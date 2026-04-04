import { Router } from "express";
import { validateRequest } from "../middlewares/validate.middleware";
import { asyncHandler } from "../utils/asyncHandler";
import { verifyToken } from "../middlewares/auth.middleware";
import { authorizeRoles } from "../middlewares/role.middleware";
import { UserRole } from "../models/user.model";
import { EmployeeController } from "../controllers/EmployeeController";
import {
  createEmployeeSchema,
  updateEmployeeSchema,
} from "../validation/employee.validation";
import { verifyTenant } from "../middlewares/verify-tenant.middleware";
import { verifyShop } from "../middlewares/verify-shop.middleware";

class EmployeeRoutes {
  public router = Router();
  private employeeController = new EmployeeController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.use(verifyToken);
    this.router.use(verifyTenant);
    this.router.use(verifyShop);

    this.router.post(
      "/",
      authorizeRoles(UserRole.USER),
      validateRequest(createEmployeeSchema),
      asyncHandler(this.employeeController.createEmployee),
    );
    this.router.get(
      "/",
      authorizeRoles(UserRole.USER, UserRole.ADMIN),
      asyncHandler(this.employeeController.getEmployees),
    );
    this.router.put(
      "/:id",
      authorizeRoles(UserRole.USER),
      validateRequest(updateEmployeeSchema),
      asyncHandler(this.employeeController.updateEmployee),
    );
    this.router.get(
      "/count",
      authorizeRoles(UserRole.USER, UserRole.ADMIN),
      asyncHandler(this.employeeController.getEmployeeCount),
    );
    this.router.get(
      "/:employeeId/salary",
      authorizeRoles(UserRole.USER, UserRole.ADMIN),
      asyncHandler(this.employeeController.getSalary),
    );
    this.router.delete(
      "/:id",
      authorizeRoles(UserRole.USER, UserRole.ADMIN),
      asyncHandler(this.employeeController.deleteEmployee),
    );
    this.router.delete(
      "/clear",
      authorizeRoles(UserRole.USER, UserRole.ADMIN),
      asyncHandler(this.employeeController.clearEmployees),
    );
  }
}

export default new EmployeeRoutes().router;
