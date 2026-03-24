import { BaseService } from "./BaseService";
import bcrypt from "bcrypt";
import { sequelize } from "../config/database";
import { UserRepository } from "../repositories/UserRepository";
import { EmployeeRepository } from "../repositories/EmployeeRepository";
import { UserRole } from '../models/user.model';
import { Transaction } from "sequelize";
export class EmployeeService extends BaseService<any> {
  private userRepository: UserRepository;

  constructor() {
    const employeeRepo = new EmployeeRepository();
    super(employeeRepo);
    this.userRepository = new UserRepository();
  }
  async createEmployee(data: any) {
    return sequelize.transaction(async (transaction) => {

      const pin = Math.floor(100000 + Math.random() * 900000).toString();
      const hashedPin = await bcrypt.hash(pin, Number(process.env.SALT_ROUNDS));

      let user = await this.userRepository.findByMobileNumber(
        data.mobileNumber,
        data.tenantId
      );

      if (!user) {
        user = await this.userRepository.createUser(
          {
            name: data.name,
            mobileNumber: data.mobileNumber,
            pin: hashedPin,
            role: UserRole.EMPLOYEE,
            tenantId: data.tenantId,
            shopId: data.shopId,
            tokenVersion: 0
          },
          transaction
        );
      }

      const existingEmployee = await this.repository.findEmployeeByUserId(
        user.id,
        data.tenantId,
        data.shopId
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
        transaction
      );
      console.log('Employee login', data.mobileNumber, pin)
      return {
        mobileNumber: data.mobileNumber,
        pin: user ? pin : undefined
      };

    });
  }
  async getEmployees(query: any) {

    const employees = await this.repository.getEmployees(query);

    const nextCursor =
      employees.length > 0
        ? employees[employees.length - 1].id
        : null;

    return {
      employees,
      nextCursor,
      hasMore: employees.length === (query.limit || 10)
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
          transaction
        );
      }

      return employee;

    });
  }

  async clearEmployees(query: any) {

    return sequelize.transaction(async (transaction) => {

      const employees = await this.repository.findAll({
        where: query
      });

      const userIds = employees.map((emp: any) => emp.userId);

      await this.repository.clearEmployees(query, transaction);

      if (userIds.length > 0) {
        await this.userRepository.deleteByIds(userIds, transaction);
      }

      return {
        deletedCount: employees.length
      };

    });

  }
}