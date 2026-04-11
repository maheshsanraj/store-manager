import { BaseService } from "./BaseService";
import bcrypt from "bcrypt";
import { sequelize } from "../config/database";
import { UserRepository } from "../repositories/UserRepository";
import { EmployeeRepository } from "../repositories/EmployeeRepository";
import { UserRole } from "../models/user.model";
import { Op } from "sequelize";
import { sendEmail } from "./emailSerivce";
import { welcomeTemplate } from "../templates/welcome.template";
import { AttendanceRepository } from "../repositories/AttendanceRepository";
import { EmployeeTransactionRepository } from "../repositories/EmployeeTransactionRepository";
export class EmployeeService extends BaseService<any> {
  private userRepository: UserRepository;
  private attendanceRepository: AttendanceRepository;
  private transactionRepository: EmployeeTransactionRepository;

  constructor() {
    const employeeRepo = new EmployeeRepository();
    super(employeeRepo);
    this.userRepository = new UserRepository();
    this.attendanceRepository = new AttendanceRepository();
    this.transactionRepository = new EmployeeTransactionRepository();
  }
  async createEmployee(data: any) {
    return sequelize.transaction(async (transaction) => {
      const pin = Math.floor(100000 + Math.random() * 900000).toString();
      const hashedPin = await bcrypt.hash(pin, Number(process.env.SALT_ROUNDS));
      const mobileNumber = data.mobileNumber.trim();
      const email = data.email.trim().toLowerCase();
      const name = data.name.trim();

      const existingUser = await this.userRepository.findOne({
        where: {
          tenantId: data.tenantId,
          [Op.or]: [{ mobileNumber }, { email }],
        },
        transaction,
      });
      if (existingUser && existingUser.mobileNumber === mobileNumber) {
        throw new Error("Mobile number already exist");
      }

      if (existingUser && existingUser.email === email) {
        throw new Error("Email already exists");
      }

      let user = existingUser;
      let isNewUser = false;

      if (!user) {
        user = await this.userRepository.createUser(
          {
            name,
            email,
            mobileNumber,
            pin: hashedPin,
            role: UserRole.EMPLOYEE,
            tenantId: data.tenantId,
            shopId: data.shopId,
            tokenVersion: 0,
          },
          transaction,
        );
        isNewUser = true;
      }

      const existingEmployee = await this.repository.findEmployeeByUserId(
        user.id,
        data.tenantId,
        data.shopId,
      );

      if (existingEmployee) {
        throw new Error("Employee already exists in this shop");
      }

      await this.repository.createEmployee(
        {
          tenantId: data.tenantId,
          shopId: data.shopId,
          userId: user.id,
          dailySalary: data.dailySalary,
          joiningDate: data.joiningDate,
        },
        transaction,
      );
      if (isNewUser) {
        setImmediate(() => {
          sendEmail({
            to: email,
            subject: "Account Created",
            html: welcomeTemplate(name, mobileNumber, pin),
          });
        });
      }

      return {
        mobileNumber,
        email,
        pin: isNewUser ? pin : undefined,
      };
    });
  }
  async getEmployees(query: any) {
    const employees = await this.repository.getEmployees(query);

    const nextCursor =
      employees.length > 0 ? employees[employees.length - 1].id : null;

    return {
      employees,
      nextCursor,
      hasMore: employees.length === (query.limit || 10),
    };
  }

  async updateEmployee(id: string, data: any, user: any) {
    return sequelize.transaction(async (transaction) => {
      const employee = await this.repository.findById(id);

      if (!employee) {
        throw new Error("Employee not found");
      }

      if (user.role === UserRole.USER) {
        if (
          employee.tenantId !== user.tenantId ||
          employee.shopId !== user.shopId
        ) {
          throw new Error("Unauthorized");
        }
      }

      await employee.update(data, { transaction });

      const userUpdateData: any = {};

      if (data.name) userUpdateData.name = data.name;
      if (data.mobileNumber) userUpdateData.mobileNumber = data.mobileNumber;

      if (Object.keys(userUpdateData).length > 0) {
        await this.userRepository.update(
          { id: employee.userId },
          userUpdateData,
          transaction,
        );
      }

      return employee;
    });
  }

  async clearEmployees(query: any) {
    return sequelize.transaction(async (transaction) => {
      const employees = await this.repository.findAll({
        where: query,
      });

      const userIds = employees.map((emp: any) => emp.userId);

      await this.repository.clearEmployees(query, transaction);

      if (userIds.length > 0) {
        await this.userRepository.deleteByIds(userIds, transaction);
      }

      return {
        deletedCount: employees.length,
      };
    });
  }
  async getEmployeeCount(query: any) {
    return this.repository.getEmployeeCount(query);
  }
  async calculateSalary(
    employeeId: string,
    user: any,
    shopIdFromQuery?: string,
    startDate?: string,
    endDate?: string,
  ) {
    const employee = await this.repository.findById(employeeId);
    if (!employee) throw new Error("Employee not found");

    if (user.role === UserRole.USER) {
      if (
        employee.tenantId !== user.tenantId ||
        employee.shopId !== user.shopId
      ) {
        throw new Error("Unauthorized");
      }
    }

    if (user.role === UserRole.ADMIN) {
      if (employee.tenantId !== user.tenantId) {
        throw new Error("Unauthorized (Different Tenant)");
      }

      if (!shopIdFromQuery) {
        throw new Error("shopId is required for admin");
      }

      if (employee.shopId !== shopIdFromQuery) {
        throw new Error("Unauthorized (Different Shop)");
      }
    }

    const presentDays = await this.attendanceRepository.countPresentDays(
      employeeId,
      startDate ? new Date(startDate) : undefined,
      endDate ? new Date(endDate) : undefined,
    );

    let totalDays = 0;
    if (startDate && endDate) {
      totalDays =
        Math.ceil(
          (new Date(endDate).getTime() - new Date(startDate).getTime()) /
            (1000 * 60 * 60 * 24),
        ) + 1;
    } else {
      totalDays = await this.attendanceRepository.countTotalDays(employeeId);
    }

    const perDaySalary = Number(employee.dailySalary) || 0;
    const totalSalary = presentDays * perDaySalary;

    const {
      advance = 0,
      bonus = 0,
      paid = 0,
    } = await this.transactionRepository.getTransactionSummary({
      tenantId: employee.tenantId,
      shopId: employee.shopId,
      employeeId,
      startDate,
      endDate,
    });

    const safeAdvance = Number(advance) || 0;
    const safePaid = Number(paid) || 0;

    const netSalary = Math.max(totalSalary - safeAdvance, 0);
    const remainingRaw = netSalary - safePaid;

    const remaining = Math.max(remainingRaw, 0);
    const overpaid = remainingRaw < 0 ? Math.abs(remainingRaw) : 0;

    return {
      totalDays,
      presentDays,
      absentDays: totalDays - presentDays,

      perDaySalary,
      totalSalary,

      advance: safeAdvance,
      bonus: Number(bonus) || 0,

      netSalary,

      paid: safePaid,
      remaining,

      overpaid,
    };
  }

  async deleteEmployee(employeeId: string, user: any) {
    return sequelize.transaction(async (transaction) => {
      const employee = await this.repository.findById(employeeId);

      if (!employee) {
        throw new Error("Employee not found");
      }

      if (user.role === UserRole.USER) {
        if (
          employee.tenantId !== user.tenantId ||
          employee.shopId !== user.shopId
        ) {
          throw new Error("Unauthorized");
        }
      }

      if (user.role === UserRole.ADMIN) {
        if (employee.tenantId !== user.tenantId) {
          throw new Error("Unauthorized (Different Tenant)");
        }
      }

      const userId = employee.userId;

      await employee.destroy({ transaction });

      const otherEmployee = await this.repository.findOne({
        where: { userId },
        transaction,
      });

      if (!otherEmployee) {
        await this.userRepository.deleteByIds([userId], transaction);
      }

      return {
        deleted: true,
        employeeId,
        userDeleted: !otherEmployee,
      };
    });
  }
}
