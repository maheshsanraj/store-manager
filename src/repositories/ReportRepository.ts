import { Op } from "sequelize";
import { Billing } from "../models/billing.model";
import { Expense } from "../models/expense.model";

export class ReportRepository {
  async getTotalBilling(query: any): Promise<number> {
    const where: any = {};

    if (query.tenantId) where.tenantId = query.tenantId;
    if (query.shopId) where.shopId = query.shopId;

    if (query.startDate && query.endDate) {
      where.date = {
        [Op.between]: [query.startDate, query.endDate],
      };
    }

    const result = await Billing.sum("totalAmount", { where });

    return result || 0;
  }

  async getTotalExpense(query: any): Promise<number> {
    const where: any = {};

    if (query.tenantId) where.tenantId = query.tenantId;
    if (query.shopId) where.shopId = query.shopId;

    if (query.startDate && query.endDate) {
      where.date = {
        [Op.between]: [query.startDate, query.endDate],
      };
    }

    const result = await Expense.sum("amount", { where });

    return result || 0;
  }
}