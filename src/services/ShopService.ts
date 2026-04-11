import { BaseService } from "./BaseService";
import { UserRepository } from "../repositories/UserRepository";
import { UserRole } from "../models/user.model";
import bcrypt from "bcrypt";
import { Op } from "sequelize";
import { ShopRepository } from "../repositories/ShopRepository";
import { sequelize } from "../config/database";
import { TenantRepository } from "../repositories/TenantRepository";
import { Product } from "../models/product.model";
import { sendEmail } from "./emailSerivce";
import { welcomeTemplate } from "../templates/welcome.template";
export class ShopService extends BaseService<any> {
  private userRepository: UserRepository;
  private tenantRepository: TenantRepository;

  constructor() {
    const shopRepo = new ShopRepository();
    super(shopRepo);
    this.userRepository = new UserRepository();
    this.tenantRepository = new TenantRepository();
  }

  async createShop(data: {
    shopName: string;
    username: string;
    mobileNumber: string;
    email: string;
    ownerId: string;
    tenantId: string;
  }) {
    return sequelize.transaction(async (transaction) => {
      const now = new Date();
      const shopName = data.shopName.trim();
      const username = data.username.trim();
      const mobileNumber = data.mobileNumber.trim();
      const email = data.email.trim().toLowerCase();

      const tenant = await this.tenantRepository.findById(
        data.tenantId,
        transaction,
      );

      if (!tenant) {
        throw new Error("Tenant not found");
      }

      const shopCount = await this.repository.count(
        { tenantId: data.tenantId },
        transaction,
      );

      if (tenant.shopLimit && shopCount >= tenant.shopLimit) {
        throw new Error(
          `You can only create up to ${tenant.shopLimit} shops for this tenant`,
        );
      }

      const existingShop = await this.repository.findOne({
        where: {
          name: shopName,
          tenantId: data.tenantId,
        },
        transaction,
      });

      if (existingShop) {
        throw new Error("Shop with this name already exists in this tenant");
      }

      const existingUser = await this.userRepository.findOne({
        where: {
          [Op.or]: [
            { name: username },
            { mobileNumber: mobileNumber },
            { email },
          ],
        },
        transaction,
      });

      if (existingUser) {
        if (existingUser.name === username) {
          throw new Error("Username already exists");
        }

        if (existingUser.mobileNumber === mobileNumber) {
          throw new Error("Mobile number already exists");
        }

        if (existingUser.email === email) {
          throw new Error("Email already exists");
        }
      }

      const shop = await this.repository.create(
        {
          tenantId: data.tenantId,
          name: shopName,
          ownerId: data.ownerId,
          isActive: true,
          createdAt: now,
          updatedAt: now,
        },
        { transaction },
      );

      const randomPin = Math.floor(100000 + Math.random() * 900000).toString();
      const hashedPin = await bcrypt.hash(randomPin, 10);

      const user = await this.userRepository.create(
        {
          tenantId: data.tenantId,
          shopId: shop.id,
          name: username,
          email,
          mobileNumber: mobileNumber,
          pin: hashedPin,
          role: UserRole.USER,
          isActive: true,
          createdAt: now,
          updatedAt: now,
        },
        { transaction },
      );

      setImmediate(() => {
        sendEmail({
          to: email,
          subject: "Account Created",
          html: welcomeTemplate(username, mobileNumber, randomPin),
        });
      });
      console.log(mobileNumber, randomPin);

      return {
        shop,
        user,
      };
    });
  }
  async getShops(user: { role: string; tenantId?: string; shopId?: string }) {
    switch (user.role) {
      case UserRole.SUPER_ADMIN:
        return this.repository.findAll();

      case UserRole.ADMIN:
        return this.repository.findAll({
          where: { tenantId: user.tenantId },
        });

      case UserRole.USER:
        return this.repository.findAll({
          where: { id: user.shopId },
        });

      default:
        return [];
    }
  }

  async getShopById(
    id: string,
    user: { role: string; tenantId?: string; shopId?: string },
  ) {
    let shopId = id;

    if (user.role === UserRole.USER) {
      shopId = user.shopId!;
    }

    const shop = await this.repository.findById(shopId);

    if (!shop) {
      throw new Error("Shop not found");
    }

    if (user.role === UserRole.ADMIN && shop.tenantId !== user.tenantId) {
      throw new Error("Unauthorized access");
    }

    return shop;
  }

  async updateShop(
    id: string,
    data: { shopName: string },
    user: { role: string; tenantId?: string; shopId?: string },
  ) {
    let shopId = id;

    if (user.role === UserRole.USER) {
      shopId = user.shopId!;
    }

    const shop = await this.repository.findById(shopId);

    if (!shop) {
      throw new Error("Shop not found");
    }

    if (user.role === UserRole.ADMIN && shop.tenantId !== user.tenantId) {
      throw new Error("Unauthorized");
    }
    const newName = data.shopName.trim();

    if (shop.name === newName) {
      throw new Error("No changes detected");
    }

    await this.repository.update({ id: shopId }, { name: newName });

    return this.repository.findById(shopId);
  }
  async deleteShop(
    id: string,
    user: { role: string; tenantId?: string; shopId?: string },
  ) {
    const shop = await this.repository.findById(id);

    if (!shop) {
      throw new Error("Shop not found");
    }

    if (shop.tenantId !== user.tenantId) {
      throw new Error("Unauthorized");
    }
    const products = await Product.findAll({
      where: { shopId: id },
    });

    await Promise.all(products.map((p) => p.destroy()));

    await shop.destroy();

    return { deleted: true };
  }
}
