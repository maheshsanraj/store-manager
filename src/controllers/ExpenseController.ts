import { Request, Response } from "express";
import { ExpenseService } from "../services/ExpenseService";
import { UserRole } from "../models/user.model";
import { BaseController } from "./BaseController";

export class ExpenseController extends BaseController {
  private expenseService = new ExpenseService();

  bulkCreateExpenses = async (req: Request, res: Response) => {
    const { expenses } = req.body;

    const data = await this.expenseService.bulkCreateExpenses(expenses);

    return this.handleResponse(res, data, "Expenses created successfully");
  };

  getExpenses = async (req: Request, res: Response) => {
    const { cursor, limit, shopId, startDate, endDate } = req.query;

    const user = req.user!;

    let query: any = {
      cursor,
      limit: Number(limit) || 10,
      startDate,
      endDate,
    };

    if (user.role === UserRole.USER) {
      query.tenantId = user.tenantId;
      query.shopId = user.shopId;
    }

    if (user.role === UserRole.ADMIN) {
      if (!shopId) {
        return this.handleResponse(res, null, "shopId is required");
      }

      query.shopId = shopId;
    }

    const data = await this.expenseService.getExpenses(query);

    return this.handleResponse(res, data, "Expenses fetched successfully");
  };

  clearExpenses = async (req: Request, res: Response) => {
    const { shopId, startDate, endDate } = req.query;

    const user = req.user!;

    let query: any = {};

    if (user.role === UserRole.USER) {
      query.tenantId = user.tenantId;
      query.shopId = user.shopId;
    }

    if (user.role === UserRole.ADMIN) {
      if (!shopId) {
        return this.handleResponse(res, null, "shopId is required");
      }

      query.shopId = shopId;
    }

    if (startDate && endDate) {
      query.startDate = startDate;
      query.endDate = endDate;
    }

    const data = await this.expenseService.clearExpenses(query);

    return this.handleResponse(res, data, "Expenses cleared successfully");
  };

  bulkUpdateExpenses = async (req: Request, res: Response) => {
    const { expenses } = req.body;

    const data = await this.expenseService.bulkUpdateExpenses(expenses);

    return this.handleResponse(res, data, "Expenses updated successfully");
  };

  bulkDeleteExpenses = async (req: Request, res: Response) => {
    const { ids } = req.body;

    const data = await this.expenseService.bulkDeleteExpenses(ids);

    return this.handleResponse(res, data, "Expenses deleted successfully");
  };

  getExpenseCount = async (req: Request, res: Response) => {
    const { shopId, startDate, endDate } = req.query;
    const user = req.user!;

    let query: any = {};

    if (user.role === UserRole.USER) {
      query.tenantId = user.tenantId;
      query.shopId = user.shopId;
    }

    if (user.role === UserRole.ADMIN) {
      if (!shopId) {
        return this.handleResponse(res, null, "shopId is required");
      }

      query.shopId = shopId;
    }

    if (startDate && endDate) {
      query.startDate = startDate;
      query.endDate = endDate;
    }

    const count = await this.expenseService.getExpenseCount(query);

    return this.handleResponse(
      res,
      { count },
      "Expense count fetched successfully",
    );
  };
}
