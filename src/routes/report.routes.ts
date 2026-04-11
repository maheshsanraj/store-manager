import { Router } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { verifyToken } from "../middlewares/auth.middleware";
import { verifyTenant } from "../middlewares/verify-tenant.middleware";
import { verifyShop } from "../middlewares/verify-shop.middleware";
import { ReportController } from "../controllers/ReportController";

class ReportRoutes {
  public router = Router();
  private controller = new ReportController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.use(verifyToken);
    this.router.use(verifyTenant);
    this.router.use(verifyShop);

    this.router.get(
      "/summary",
      asyncHandler(this.controller.getSummary)
    );
  }
}

export default new ReportRoutes().router;