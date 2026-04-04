import { Op } from "sequelize";
import { EmployeeTransaction } from "../models/employeeTransaction.model";
import { BaseRepository } from "./BaseRepository";

interface TransactionQuery {
  cursor?: string;
  limit?: number;
  tenantId?: string;
  shopId?: string;
  employeeId?: string;
  startDate?: string;
  endDate?: string;
}

export class EmployeeTransactionRepository extends BaseRepository<EmployeeTransaction> {
  constructor() {
    super(EmployeeTransaction);
  }

  async getTransactions(query: TransactionQuery) {
    const {
      cursor,
      limit = 10,
      tenantId,
      shopId,
      employeeId,
      startDate,
      endDate,
    } = query;

    const where: any = {};

    if (cursor) where.id = { [Op.gt]: cursor };
    if (tenantId) where.tenantId = tenantId;
    if (shopId) where.shopId = shopId;
    if (employeeId) where.employeeId = employeeId;

    if (startDate && endDate) {
      where.date = {
        [Op.between]: [startDate, endDate],
      };
    }

    const transactions = await this.model.findAll({
      where,
      limit,
      order: [["id", "ASC"]],
    });

    return transactions;
  }

  async clearTransactions(query: any) {
    const { tenantId, shopId, employeeId, startDate, endDate } = query;

    const where: any = {};

    if (tenantId) where.tenantId = tenantId;
    if (shopId) where.shopId = shopId;
    if (employeeId) where.employeeId = employeeId;

    if (startDate && endDate) {
      where.date = {
        [Op.between]: [startDate, endDate],
      };
    }

    return this.model.destroy({ where });
  }

  async countTransactions(query: any) {
    const { tenantId, shopId, employeeId, startDate, endDate, type } = query;

    const where: any = {};

    if (tenantId) where.tenantId = tenantId;
    if (shopId) where.shopId = shopId;
    if (employeeId) where.employeeId = employeeId;

    if (type) {
      where.type = type;
    }

    if (startDate && endDate) {
      where.date = {
        [Op.between]: [startDate, endDate],
      };
    }

    const total = await this.model.count({ where });

    const grouped = await this.model.findAll({
      where,
      attributes: [
        "type",
        [
          this.model.sequelize!.fn("COUNT", this.model.sequelize!.col("id")),
          "count",
        ],
      ],
      group: ["type"],
      raw: true,
    });

    return {
      total,
      breakdown: grouped,
    };
  }
  async getTransactionSummary(query: any) {
    const { tenantId, shopId, employeeId, startDate, endDate } = query;

    const where: any = {
      tenantId,
      shopId,
      employeeId,
    };

    if (startDate && endDate) {
      where.date = {
        [Op.between]: [startDate, endDate],
      };
    }

    const result = await this.model.findAll({
      where,
      attributes: [
        "type",
        [
          this.model.sequelize!.fn("SUM", this.model.sequelize!.col("amount")),
          "total",
        ],
      ],
      group: ["type"],
      raw: true,
    });

    let advance = 0;
    let bonus = 0;
    let paid = 0;

    result.forEach((item: any) => {
      if (item.type === "advance") advance = Number(item.total);
      if (item.type === "bonus") bonus = Number(item.total);
      if (item.type === "salary_paid") paid = Number(item.total);
    });

    return { advance, bonus, paid };
  }
  async bulkUpdateById(data: any[], transaction?: any) {
    const promises = data.map((item) => {
      const { id, ...updateData } = item;

      return this.model.update(updateData, {
        where: { id },
        transaction,
      });
    });

    return Promise.all(promises);
  }
  async deleteByQuery(query: any) {
    const where: any = {
      id: query.id,
    };

    if (query.tenantId) where.tenantId = query.tenantId;
    if (query.shopId) where.shopId = query.shopId;

    const deletedCount = await this.model.destroy({
      where,
      limit: 1,
    });

    return deletedCount > 0;
  }
}
