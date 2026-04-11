import { NextFunction, Request, Response } from "express";
import { TenantService } from "../services/TenantService";
import { BaseController } from "./BaseController";
import { UserRole } from "../models/user.model";

export class TenantController extends BaseController {
  private tenantService = new TenantService();

  createTenant = async (req: Request, res: Response, next: NextFunction) => {
    const tenant = await this.tenantService.createTenant(req.body);
    return this.handleResponse(res, tenant, "Tenant created successfully");
  };

  getTenants = async (req: Request, res: Response, next: NextFunction) => {
    const tenants = await this.tenantService.getTenants({
      role: req.user!!.role,
      tenantId: req.user!!.tenantId,
    });

    return this.handleResponse(res, tenants, "Tenants fetched successfully");
  };

  getTenantById = async (req: Request, res: Response) => {
    const tenant = await this.tenantService.getTenantById(
      req.params.id as string,
      req.user!!,
    );

    return this.handleResponse(res, tenant, "Tenant fetched successfully");
  };
  updateTenant = async (req: Request, res: Response) => {
    const tenant = await this.tenantService.updateTenant(
      req.params.id as string,
      req.body,
    );

    return this.handleResponse(res, tenant, "Tenant updated successfully");
  };

  deleteTenant = async (req: Request, res: Response) => {
    const user = req.user!;

    let tenantId: string;

    if (user.role === UserRole.SUPER_ADMIN) {
      const paramId = req.params.id;

      if (!paramId || Array.isArray(paramId)) {
        throw new Error("Tenant ID is required");
      }

      tenantId = paramId;
    } else {
      if (!user.tenantId) {
        throw new Error("Tenant not found for admin");
      }

      tenantId = user.tenantId;
    }

    const result = await this.tenantService.deleteTenant(tenantId);

    return this.handleResponse(res, result, "Tenant deleted successfully");
  };
}
