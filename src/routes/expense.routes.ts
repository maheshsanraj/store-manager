import { Router } from "express";
import { validateRequest } from "../middlewares/validate.middleware";
import { asyncHandler } from "../utils/asyncHandler";
import { verifyToken } from "../middlewares/auth.middleware";
import { authorizeRoles } from "../middlewares/role.middleware";
import { UserRole } from "../models/user.model";
import {
  bulkDeleteExpenseSchema,
  bulkExpenseSchema,
  bulkUpdateExpenseSchema,
} from "../validation/expense.validation";
import { ExpenseController } from "../controllers/ExpenseController";
import { verifyTenant } from "../middlewares/verify-tenant.middleware";
import { verifyShop } from "../middlewares/verify-shop.middleware";

class ExpenseRoutes {
  public router = Router();
  private controller = new ExpenseController();

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
      validateRequest(bulkExpenseSchema),
      asyncHandler(this.controller.bulkCreateExpenses),
    );

    this.router.get(
      "/",
      authorizeRoles(UserRole.ADMIN, UserRole.USER),
      asyncHandler(this.controller.getExpenses),
    );

    this.router.delete(
      "/clear",
      authorizeRoles(UserRole.ADMIN, UserRole.USER),
      asyncHandler(this.controller.clearExpenses),
    );

    this.router.put(
      "/bulk-update",
      authorizeRoles(UserRole.USER),
      validateRequest(bulkUpdateExpenseSchema),
      asyncHandler(this.controller.bulkUpdateExpenses),
    );

    this.router.delete(
      "/bulk-delete",
      authorizeRoles(UserRole.USER),
      validateRequest(bulkDeleteExpenseSchema),
      asyncHandler(this.controller.bulkDeleteExpenses),
    );

    this.router.get(
      "/count",
      authorizeRoles(UserRole.ADMIN, UserRole.USER),
      asyncHandler(this.controller.getExpenseCount),
    );
  }
}

export default new ExpenseRoutes().router;
