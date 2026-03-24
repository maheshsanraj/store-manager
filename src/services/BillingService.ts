
import { BaseService } from "./BaseService";
import { BillingRepository } from "../repositories/BillingRepository";
import { Billing } from "../models/billing.model";
import { v4 as uuidv4 } from "uuid";

export class BillingService extends BaseService<any> {

  constructor() {
    const repo = new BillingRepository();
    super(repo);
  }

  async bulkCreateBilling(billings: Billing[]) {

    const formattedData = billings.map((item) => ({
      id: item.id ?? uuidv4(),
      tenantId: item.tenantId,
      shopId: item.shopId,
      name: item.name.trim(),
      price: Number(item.price),
      quantity: Number(item.quantity),
      totalAmount: Number(item.totalAmount),
      date: item.date,
      createdAt: item.createdAt ?? new Date(),
      updatedAt: item.updatedAt ?? new Date(),
    }));
    return this.repository.bulkCreate(formattedData)
  }
  async getBillings(query: any) {

    const billings = await this.repository.getBillings(query);

    const nextCursor =
      billings.length > 0
        ? billings[billings.length - 1].id
        : null;

    return {
      data: billings,
      nextCursor,
      hasMore: billings.length === (query.limit || 10)
    };
  }
  async clearBillings(query: any) {

    const deletedCount = await this.repository.clearBillings(query);

    return {
      deletedCount
    };
  }
  async getBillingsStats(query: any) {
    const data = await this.repository.getBillingsStats(query);
    return data;
  }
}