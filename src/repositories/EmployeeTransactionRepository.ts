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

    const { cursor, limit = 10, tenantId, shopId, employeeId, startDate, endDate } = query;

    const where: any = {};

    if (cursor) where.id = { [Op.gt]: cursor };
    if (tenantId) where.tenantId = tenantId;
    if (shopId) where.shopId = shopId;
    if (employeeId) where.employeeId = employeeId;

    if (startDate && endDate) {
      where.date = {
        [Op.between]: [startDate, endDate]
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
}