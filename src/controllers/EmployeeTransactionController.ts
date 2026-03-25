import { Request, Response } from "express";
import { BaseController } from "./BaseController";
import { EmployeeTransactionService } from "../services/EmployeeTransactionService";
import { UserRole } from "../models/user.model";

export class EmployeeTransactionController extends BaseController {

    private transactionService = new EmployeeTransactionService();

    bulkCreateTransactions = async (req: Request, res: Response) => {

        const { transactions } = req.body;

        const data = await this.transactionService.bulkCreateTransactions(transactions);

        return this.handleResponse(res, data, "Transactions created successfully");
    };

    getTransactions = async (req: Request, res: Response) => {

        const { cursor, limit, shopId, employeeId, startDate, endDate } = req.query;

        const user = req.user!;

        let query: any = {
            cursor,
            limit: Number(limit) || 10,
            startDate,
            endDate
        };

        if (user.role === UserRole.USER) {

            query.tenantId = user.tenantId;
            query.shopId = user.shopId;

            if (employeeId) query.employeeId = employeeId;

        }

        if (user.role === UserRole.ADMIN) {

            if (!shopId) {
                return this.handleResponse(res, null, "shopId is required");
            }

            query.shopId = shopId;

            if (employeeId) query.employeeId = employeeId;
        }

        const data = await this.transactionService.getTransactions(query);

        return this.handleResponse(res, data, "Transactions fetched successfully");
    };

    clearTransactions = async (req: Request, res: Response) => {

        const { shopId, employeeId, startDate, endDate } = req.query;

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

        if (employeeId) query.employeeId = employeeId;
        if (startDate && endDate) {
            query.startDate = startDate;
            query.endDate = endDate;
        }

        const data = await this.transactionService.clearTransactions(query);

        return this.handleResponse(res, data, "Transactions cleared successfully");
    };
}