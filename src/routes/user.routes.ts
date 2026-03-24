import { Router } from "express";
import { UserController } from "../controllers/UserController";
import { validateRequest } from "../middlewares/validate.middleware";
import { loginSchema } from "../validation/user.validation";
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
      asyncHandler(this.userController.login)
    );
    this.router.post(
      "/logout",
      verifyToken,
      asyncHandler(this.userController.logout)
    );
  }
}

export default new UserRoutes().router;