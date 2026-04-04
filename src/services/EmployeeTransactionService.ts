import { BaseService } from "./BaseService";
import { EmployeeTransactionRepository } from "../repositories/EmployeeTransactionRepository";
import { EmployeeTransaction } from "../models/employeeTransaction.model";
import { v4 as uuidv4 } from "uuid";
import { sequelize } from "../config/database";

export class EmployeeTransactionService extends BaseService<any> {
  constructor() {
    const repo = new EmployeeTransactionRepository();
    super(repo);
  }

  async bulkCreateTransactions(transactions: EmployeeTransaction[]) {
    const formattedData = transactions.map((item) => ({
      id: item.id ?? uuidv4(),

      tenantId: item.tenantId,
      shopId: item.shopId,
      employeeId: item.employeeId,

      type: item.type,

      amount: Number(item.amount),

      date: item.date,

      createdBy: item.createdBy,

      description: item.description?.trim() || null,

      createdAt: item.createdAt ?? new Date(),
      updatedAt: item.updatedAt ?? new Date(),
    }));

    return this.repository.bulkCreate(formattedData);
  }

  async getTransactions(query: any) {
    const transactions = await this.repository.getTransactions(query);

    const nextCursor =
      transactions.length > 0 ? transactions[transactions.length - 1].id : null;

    return {
      transactions,
      nextCursor,
      hasMore: transactions.length === (query.limit || 10),
    };
  }

  async clearTransactions(query: any) {
    const deletedCount = await this.repository.clearTransactions(query);

    return {
      deletedCount,
    };
  }

  async countTransactions(query: any) {
    const result = await this.repository.countTransactions(query);

    return result;
  }

  async bulkUpdateTransactions(transactions: any[]) {
    if (!transactions?.length) return [];

    return sequelize.transaction(async (t) => {
      return this.repository.bulkUpdateById(transactions, t);
    });
  }

  async deleteTransaction(query: any) {
  const deleted = await this.repository.deleteByQuery(query);

  if (!deleted) {
    throw new Error("Transaction not found or unauthorized");
  }

  return {
    deleted: true,
  };
}
}
