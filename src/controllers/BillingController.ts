import { NextFunction, Request, Response } from "express";
import { BaseController } from "./BaseController";
import { BillingService } from "../services/BillingService";
import { UserRole } from "../models/user.model";

export class BillingController extends BaseController {
  private billingService = new BillingService();

  bulkCreateBilling = async (req: Request, res: Response) => {
    const { billings } = req.body;
    const data = await this.billingService.bulkCreateBilling(billings);
    return this.handleResponse(res, data, "Billings created successfully");
  }
  getBillings = async (req: Request, res: Response) => {
    const {
      cursor,
      limit,
      tenantId,
      shopId,
      startDate,
      endDate
    } = req.query;

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
    }
    if (user.role === UserRole.ADMIN) {
      query.tenantId = tenantId;
      query.shopId = shopId;
    }

    const data = await this.billingService.getBillings(query);

    return this.handleResponse(res, data, "Billings fetched successfully");
  };
  clearBillings = async (req: Request, res: Response) => {

    const { shopId, startDate, endDate } = req.query;

    const user = req.user!;

    let query: any = {
      startDate,
      endDate
    };

    if (user.role === UserRole.USER) {
      query.tenantId = user.tenantId;
      query.shopId = user.shopId;
    }

    if (user.role === UserRole.ADMIN) {
      query.shopId = shopId;
    }

    const data = await this.billingService.clearBillings(query);

    return this.handleResponse(res, data, "Billings cleared successfully");

  };
  getBillingsStats = async (req: Request, res: Response) => {
    const { tenantId, shopId, startDate, endDate } = req.query;
    const user = req.user!;

    let query: any = { startDate, endDate };

    if (user.role === UserRole.USER) {
      query.tenantId = user.tenantId;
      query.shopId = user.shopId;
    }

    if (user.role === UserRole.ADMIN) {
      query.tenantId = tenantId;
      query.shopId = shopId;
    }

    const data = await this.billingService.getBillingsStats(query);

    return this.handleResponse(res, data, "Billing stats fetched");
  };
}