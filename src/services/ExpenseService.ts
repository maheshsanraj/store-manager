import { BaseService } from "./BaseService";
import { ExpenseRepository } from "../repositories/ExpenseRepository";
import { Expense } from "../models/expense.model";
import { v4 as uuidv4 } from "uuid";

export class ExpenseService extends BaseService<any> {
  constructor() {
    const repo = new ExpenseRepository();
    super(repo);
  }

  async bulkCreateExpenses(expenses: Expense[]) {
    const formattedData = expenses.map((item) => ({
      id: item.id ?? uuidv4(),

      tenantId: item.tenantId,
      shopId: item.shopId,

      title: item.title.trim(),

      amount: Number(item.amount),

      date: item.date,

      createdBy: item.createdBy,

      createdAt: item.createdAt ?? new Date(),
      updatedAt: item.updatedAt ?? new Date(),
    }));

    return this.repository.bulkCreate(formattedData);
  }

  async getExpenses(query: any) {
    const expenses = await this.repository.getExpenses(query);

    const nextCursor =
      expenses.length > 0 ? expenses[expenses.length - 1].id : null;

    return {
      data: expenses,
      nextCursor,
      hasMore: expenses.length === (query.limit || 10),
    };
  }

  async clearExpenses(query: any) {
    const deletedCount = await this.repository.clearExpenses(query);
    return {
      deletedCount,
    };
  }

  async bulkUpdateExpenses(expenses: any[]) {
    const formattedData = expenses.map((item) => ({
      id: item.id,
      ...(item.title && { title: item.title.trim() }),
      ...(item.amount && { amount: Number(item.amount) }),
      ...(item.date && { date: item.date }),
      updatedAt: new Date(),
    }));

    return this.repository.bulkUpdateExpenses(formattedData);
  }

  async bulkDeleteExpenses(ids: string[]) {
    const deletedCount = await this.repository.bulkDeleteExpenses(ids);

    return {
      deletedCount,
    };
  }

  async getExpenseCount(query: any) {
    return this.repository.getExpenseCount(query);
  }
}
