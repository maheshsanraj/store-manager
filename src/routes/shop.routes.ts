import { Router } from "express";
import { validateRequest } from "../middlewares/validate.middleware";
import { asyncHandler } from "../utils/asyncHandler";
import { verifyToken } from "../middlewares/auth.middleware";
import { authorizeRoles } from "../middlewares/role.middleware";
import { UserRole } from "../models/user.model";
import { ShopController } from "../controllers/ShopController";
import { createShopSchema, updateShopSchema } from "../validation/shop.validation";
import { verifyTenant } from "../middlewares/verify-tenant.middleware";

class ShopRoutes {
  public router = Router();
  private shopController = new ShopController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {

    this.router.use(verifyToken);
    this.router.use(verifyTenant);

    this.router.post(
      "/",
      authorizeRoles(UserRole.ADMIN),
      validateRequest(createShopSchema),
      asyncHandler(this.shopController.createShop)
    );
    this.router.get(
      "/",
      authorizeRoles(UserRole.ADMIN, UserRole.USER),
      asyncHandler(this.shopController.getShops)
    );
    this.router.get(
      "/:id",
      authorizeRoles(UserRole.ADMIN, UserRole.USER),
      asyncHandler(this.shopController.getShopById)
    );
    this.router.put(
      "/:id",
      authorizeRoles(UserRole.ADMIN, UserRole.USER),
      validateRequest(updateShopSchema),
      asyncHandler(this.shopController.updateShop)
    );
    this.router.delete(
      "/:id",
      authorizeRoles(UserRole.ADMIN),
      asyncHandler(this.shopController.deleteShop)
    );
  }
}

export default new ShopRoutes().router;