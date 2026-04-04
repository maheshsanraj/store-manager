import { BaseService } from "./BaseService";
import { UserRepository } from "../repositories/UserRepository";
import { TenantRepository } from "../repositories/TenantRepository";
import { UserRole } from "../models/user.model";
import { SubscriptionStatus } from "../models/tenant.model";
import bcrypt from "bcrypt";
import { Op } from "sequelize";
import { sequelize } from "../config/database";
import { EmployeeRepository } from "../repositories/EmployeeRepository";
import { sendEmail } from "./emailSerivce";
import { welcomeTemplate } from "../templates/welcome.template";
export class TenantService extends BaseService<any> {
  private userRepository: UserRepository;
  private employeeRepository: EmployeeRepository;

  constructor() {
    const tenantRepo = new TenantRepository();
    super(tenantRepo);
    this.userRepository = new UserRepository();
    this.employeeRepository = new EmployeeRepository();
  }

  async createTenant(data: {
    tenantName: string;
    tenantEmail: string;
    username: string;
    mobileNumber: string;
  }) {
    return await sequelize.transaction(async (transaction: any) => {
      const now = new Date();

      const tenantName = data.tenantName.trim();
      const tenantEmail = data.tenantEmail.trim().toLowerCase();
      const mobileNumber = data.mobileNumber.trim();

      const existingTenant = await this.repository.findOne({
        where: {
          [Op.or]: [{ name: tenantName }, { email: tenantEmail }],
        },
        transaction,
      });

      if (existingTenant) {
        if (existingTenant.name === tenantName) {
          throw new Error("Tenant with this name already exists");
        }
        if (existingTenant.email === tenantEmail) {
          throw new Error("Tenant with this email already exists");
        }
      }

      const existingUser = await this.userRepository.findOne({
        where: {
          [Op.or]: [{ name: data.username }, { mobileNumber }],
        },
        transaction,
      });

      if (existingUser) {
        if (existingUser.name === data.username) {
          throw new Error("Username already exists");
        }
        if (existingUser.mobileNumber === mobileNumber) {
          throw new Error("Mobile number already exists");
        }
      }

      const tenant = await this.repository.create(
        {
          name: tenantName,
          email: tenantEmail,
          subscriptionStatus: SubscriptionStatus.TRIAL,
          shopLimit: 2,
          userLimitPerShop: 10,
          isActive: true,
          createdAt: now,
          updatedAt: now,
        },
        { transaction },
      );

      const randomPin = Math.floor(100000 + Math.random() * 900000).toString();
      const hashedPassword = await bcrypt.hash(randomPin, 10);

      const user = await this.userRepository.create(
        {
          tenantId: tenant.id,
          name: data.username,
          email: tenantEmail,
          mobileNumber,
          pin: hashedPassword,
          role: UserRole.ADMIN,
          isActive: true,
          createdAt: now,
          updatedAt: now,
        },
        { transaction },
      );
      console.log(mobileNumber, " ", randomPin, " : Login data");

      // setImmediate(() => {
      //   sendEmail({
      //     to: user.email,
      //     subject: "Account Created",
      //     html: welcomeTemplate(data.username, mobileNumber, randomPin),
      //   });
      // });

      return { tenant, user };
    });
  }

  async getTenants(user: { role: string; tenantId?: string }) {
    if (user.role === UserRole.SUPER_ADMIN) {
      return this.repository.findAll();
    } else if (user.role === UserRole.ADMIN) {
      return this.repository.findAll({ where: { id: user.tenantId } });
    }
    return [];
  }

  async getTenantById(
    tenantId: string,
    user: { role: string; tenantId?: string },
  ) {
    if (user.role === UserRole.SUPER_ADMIN) {
      const tenant = await this.repository.findById(tenantId);

      if (!tenant) {
        throw new Error("Tenant not found");
      }

      return tenant;
    }

    if (user.role === UserRole.ADMIN) {
      if (tenantId !== user.tenantId) {
        throw new Error("Unauthorized access");
      }

      const tenant = await this.repository.findById(tenantId);

      if (!tenant) {
        throw new Error("Tenant not found");
      }

      return tenant;
    }

    throw new Error("Access denied");
  }
  async updateTenant(tenantId: string, data: any) {
    const tenant = await this.repository.findById(tenantId);

    if (!tenant) {
      throw new Error("Tenant not found");
    }

    await tenant.update({
      ...(data.tenantName && { name: data.tenantName.trim() }),
      ...(data.tenantEmail && { email: data.tenantEmail.trim().toLowerCase() }),
      ...(data.shopLimit && { shopLimit: data.shopLimit }),
      ...(data.userLimitPerShop && { userLimitPerShop: data.userLimitPerShop }),
      ...(data.subscriptionStatus && {
        subscriptionStatus: data.subscriptionStatus,
      }),
      updatedAt: new Date(),
    });

    return tenant;
  }
  async deleteTenant(tenantId: string) {
    return sequelize.transaction(async (transaction) => {
      const tenant = await this.repository.findById(tenantId);

      if (!tenant) {
        throw new Error("Tenant not found");
      }

      await this.employeeRepository.delete({ tenantId }, transaction);

      await this.userRepository.delete({ tenantId }, transaction);

      await this.repository.delete({ id: tenantId }, transaction);

      return { success: true };
    });
  }
}
