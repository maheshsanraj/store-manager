import { Tenant } from "../models/tenant.model";
import { Shop } from "../models/shop.model";

declare global {
  namespace Express {
    interface Request {
      user?: {
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
}

export {};