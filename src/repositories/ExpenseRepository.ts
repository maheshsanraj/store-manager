import { Op } from "sequelize";
import { Expense } from "../models/expense.model";
import { BaseRepository } from "./BaseRepository";

interface ExpenseQuery {
    cursor?: string;
    limit?: number;
    tenantId?: string;
    shopId?: string;
    startDate?: string;
    endDate?: string;
}

export class ExpenseRepository extends BaseRepository<Expense> {

    constructor() {
        super(Expense);
    }

    async getExpenses(query: ExpenseQuery) {

        const { cursor, limit = 10, tenantId, shopId, startDate, endDate } = query;

        const where: any = {};

        if (cursor) {
            where.id = { [Op.gt]: cursor };
        }

        if (tenantId) {
            where.tenantId = tenantId;
        }

        if (shopId) {
            where.shopId = shopId;
        }

        if (startDate && endDate) {
            where.date = {
                [Op.between]: [startDate, endDate],
            };
        }

        const expenses = await this.model.findAll({
            where,
            limit,
            order: [["id", "ASC"]],
        });

        return expenses;
    }

    async clearExpenses(query: {
        tenantId?: string;
        shopId?: string;
        startDate?: string;
        endDate?: string;
    }) {

        const { tenantId, shopId, startDate, endDate } = query;

        const where: any = {};

        if (tenantId) where.tenantId = tenantId;
        if (shopId) where.shopId = shopId;

        if (startDate && endDate) {
            where.date = {
                [Op.between]: [startDate, endDate],
            };
        }

        return this.model.destroy({ where });
    }

    async bulkUpdateExpenses(expenses: any[]) {

        const updates = expenses.map((expense) =>
            this.model.update(expense, {
                where: { id: expense.id }
            })
        );

        return Promise.all(updates);
    }

    async bulkDeleteExpenses(ids: string[]) {

        return this.model.destroy({
            where: {
                id: {
                    [Op.in]: ids
                }
            }
        });

    }
}