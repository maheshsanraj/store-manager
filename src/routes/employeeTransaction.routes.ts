import { Router } from "express";
import { validateRequest } from "../middlewares/validate.middleware";
import { asyncHandler } from "../utils/asyncHandler";
import { verifyToken } from "../middlewares/auth.middleware";
import { authorizeRoles } from "../middlewares/role.middleware";
import { UserRole } from "../models/user.model";
import { EmployeeTransactionController } from "../controllers/EmployeeTransactionController";
import { bulkEmployeeTransactionSchema } from "../validation/employeeTransaction.validation";
import { verifyTenant } from "../middlewares/verify-tenant.middleware";
import { verifyShop } from "../middlewares/verify-shop.middleware";

class EmployeeTransactionRoutes {

  public router = Router();
  private controller = new EmployeeTransactionController();

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
      validateRequest(bulkEmployeeTransactionSchema),
      asyncHandler(this.controller.bulkCreateTransactions)
    );

    this.router.get(
      "/",
      authorizeRoles(UserRole.ADMIN, UserRole.USER),
      asyncHandler(this.controller.getTransactions)
    );

    this.router.delete(
      "/clear",
      authorizeRoles(UserRole.ADMIN, UserRole.USER),
      asyncHandler(this.controller.clearTransactions)
    );
  }
}

export default new EmployeeTransactionRoutes().router;