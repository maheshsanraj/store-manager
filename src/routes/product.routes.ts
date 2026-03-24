import { Router } from "express";
import { validateRequest } from "../middlewares/validate.middleware";
import { asyncHandler } from "../utils/asyncHandler";
import { verifyToken } from "../middlewares/auth.middleware";
import { authorizeRoles } from "../middlewares/role.middleware";
import { UserRole } from "../models/user.model";
import { ProductController } from "../controllers/ProductController";
import { createProductSchema } from "../validation/product.validation";
import { upload } from "../middlewares/upload.middleware";
import { verifyTenant } from "../middlewares/verify-tenant.middleware";
import { verifyShop } from "../middlewares/verify-shop.middleware";

class ProductRoutes {
  public router = Router();
  private productController = new ProductController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.use(verifyToken);
    this.router.use(authorizeRoles(UserRole.ADMIN, UserRole.USER));
    this.router.use(verifyTenant);
    this.router.use(verifyShop);

    this.router.post(
      "/",
      upload.single("image"),
      validateRequest(createProductSchema),
      asyncHandler(this.productController.createProduct)
    );
    this.router.get(
      "/",
      asyncHandler(this.productController.getProducts)
    );
    this.router.put(
      "/:id",
      upload.single("image"),
      asyncHandler(this.productController.updateProduct)
    );
    this.router.delete(
      "/:id",
      asyncHandler(this.productController.deleteProduct)
    );
  }
}

export default new ProductRoutes().router;