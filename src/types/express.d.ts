import { Request } from "express";
import { Tenant } from "../models/tenant.model";
import { Shop } from "../models/shop.model";

declare module "express-serve-static-core" {
  interface Request {
    user: {
      id: string;
      role: string;
      tenantId?: string;
      shopId?: string;
      tokenVersion?: number;
    };
    tenant?: Tenant;
    shop?: Shop;
  }
}