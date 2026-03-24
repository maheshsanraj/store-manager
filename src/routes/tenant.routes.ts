import { Router } from "express";
import { validateRequest } from "../middlewares/validate.middleware";
import { asyncHandler } from "../utils/asyncHandler";
import { createTenantSchema, updateTenantSchema } from "../validation/tenant.validation";
import { verifyToken } from "../middlewares/auth.middleware";
import { authorizeRoles } from "../middlewares/role.middleware";
import { User, UserRole } from "../models/user.model";
import { TenantController } from "../controllers/TenantController";
import { tenantUpdateRoleCheck } from "../utils/tenantUpdateRoleCheck";

class TenantRoutes {
  public router = Router();
  private tenantController = new TenantController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {

    this.router.use(verifyToken);

    this.router.post(
      "/",
      authorizeRoles(UserRole.SUPER_ADMIN),
      validateRequest(createTenantSchema),
      asyncHandler(this.tenantController.createTenant)
    );
    this.router.get(
      "/:id",
      authorizeRoles(UserRole.SUPER_ADMIN, UserRole.ADMIN),
      asyncHandler(this.tenantController.getTenantById)
    );
    this.router.get(
      "/",
      authorizeRoles(UserRole.SUPER_ADMIN),
      asyncHandler(this.tenantController.getTenants)
    );
    this.router.put(
      "/:id",
      authorizeRoles(UserRole.SUPER_ADMIN, UserRole.ADMIN),
      validateRequest(updateTenantSchema),
      tenantUpdateRoleCheck,
      asyncHandler(this.tenantController.updateTenant)
    );

    this.router.delete(
      "/:id",
      authorizeRoles(UserRole.SUPER_ADMIN, UserRole.ADMIN),
      asyncHandler(this.tenantController.deleteTenant)
    );
  }
}

export default new TenantRoutes().router;