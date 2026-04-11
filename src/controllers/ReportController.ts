import { Request, Response } from "express";
import { ReportService } from "../services/ReportService";
import { BaseController } from "./BaseController";
import { UserRole } from "../models/user.model";

export class ReportController extends BaseController {
  private service = new ReportService();

  getSummary = async (req: Request, res: Response) => {
    const { shopId } = req.query;
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

    const data = await this.service.getSummary(query);

    return this.handleResponse(res, data, "Summary fetched successfully");
  };
}