import { Router } from "express";
import { validateRequest } from "../middlewares/validate.middleware";
import { asyncHandler } from "../utils/asyncHandler";
import { verifyToken } from "../middlewares/auth.middleware";
import { authorizeRoles } from "../middlewares/role.middleware";
import { UserRole } from "../models/user.model";
import { BillingController } from "../controllers/BillingController";
import { bulkBillingSchema } from "../validation/billing.validation";
import { verifyTenant } from "../middlewares/verify-tenant.middleware";
import { verifyShop } from "../middlewares/verify-shop.middleware";

class BillingRoutes {
  public router = Router();
  private billingController = new BillingController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {

    this.router.use(verifyToken);
    this.router.use(verifyTenant);
    this.router.use(verifyShop);

    this.router.post(
      "/bulk",
      authorizeRoles(UserRole.USER),
      validateRequest(bulkBillingSchema),
      asyncHandler(this.billingController.bulkCreateBilling)
    );
    this.router.get(
      "/",
      authorizeRoles(UserRole.ADMIN, UserRole.USER),
      asyncHandler(this.billingController.getBillings)
    );
    this.router.delete(
      "/clear",
      authorizeRoles(UserRole.ADMIN, UserRole.USER),
      asyncHandler(this.billingController.clearBillings)
    );
    this.router.get(
      "/stats",
      authorizeRoles(UserRole.ADMIN, UserRole.USER),
      asyncHandler(this.billingController.getBillingsStats)
    );
  }
}

export default new BillingRoutes().router;