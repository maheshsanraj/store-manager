import { CreationAttributes, Transaction } from "sequelize";
import { User } from "../models/user.model";
import { BaseRepository } from "./BaseRepository";

export class UserRepository extends BaseRepository<User> {
  constructor() {
    super(User);
  }
  async createUser(data: CreationAttributes<User>, transaction: Transaction) {
    return this.model.create(data, { transaction });
  }
  async findByEmail(email: string, tenantId?: string) {
    const where: any = { email };

    if (tenantId) {
      where.tenantId = tenantId;
    }

    return this.model.findOne({ where });
  }
  async findByMobileNumber(mobileNumber: string, tenantId?: string) {
    const where: any = {
      mobileNumber,
    };

    if (tenantId) {
      where.tenantId = tenantId;
    }

    return this.model.findOne({
      where,
    });
  }
  async deleteByIds(userIds: string[], transaction: Transaction) {
    return this.model.destroy({
      where: {
        id: userIds,
      },
      transaction,
    });
  }
}
