import { Router } from "express";
import { validateRequest } from "../middlewares/validate.middleware";
import { asyncHandler } from "../utils/asyncHandler";
import { verifyToken } from "../middlewares/auth.middleware";
import { authorizeRoles } from "../middlewares/role.middleware";
import { UserRole } from "../models/user.model";
import { AttendanceController } from "../controllers/AttendanceController";
import { bulkAttendanceSchema } from "../validation/attendance.validation";
import { verifyTenant } from "../middlewares/verify-tenant.middleware";
import { verifyShop } from "../middlewares/verify-shop.middleware";

class AttendanceRoutes {
  public router = Router();
  private attendanceController = new AttendanceController();

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
      validateRequest(bulkAttendanceSchema),
      asyncHandler(this.attendanceController.bulkCreateAttendance)
    );

    this.router.get(
      "/",
      authorizeRoles(UserRole.ADMIN, UserRole.USER),
      asyncHandler(this.attendanceController.getAttendances)
    );

    this.router.delete(
      "/clear",
      authorizeRoles(UserRole.ADMIN, UserRole.USER),
      asyncHandler(this.attendanceController.clearAttendances)
    );
  }
}

export default new AttendanceRoutes().router;