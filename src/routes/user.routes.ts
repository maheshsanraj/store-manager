import { Router } from "express";
import { UserController } from "../controllers/UserController";
import { validateRequest } from "../middlewares/validate.middleware";
import {
  forgetPasswordSchema,
  loginSchema,
  resetPasswordSchema,
  verifyOtpSchema,
} from "../validation/user.validation";
import { asyncHandler } from "../utils/asyncHandler";
import { verifyToken } from "../middlewares/auth.middleware";

class UserRoutes {
  public router = Router();
  private userController = new UserController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(
      "/login",
      validateRequest(loginSchema),
      asyncHandler(this.userController.login),
    );
    this.router.post(
      "/logout",
      verifyToken,
      asyncHandler(this.userController.logout),
    );
    this.router.post(
      "/forgot-password",
      validateRequest(forgetPasswordSchema),
      asyncHandler(this.userController.forgotPassword),
    );
    this.router.post(
      "/verify-otp",
      validateRequest(verifyOtpSchema),
      asyncHandler(this.userController.verifyOtp),
    );
    this.router.post(
      "/reset-password",
      validateRequest(resetPasswordSchema),
      asyncHandler(this.userController.resetPassword),
    );
  }
}

export default new UserRoutes().router;
