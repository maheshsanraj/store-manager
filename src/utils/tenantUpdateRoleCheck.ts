import { Request, Response, NextFunction } from "express";
import { UserRole } from "../models/user.model";

export const tenantUpdateRoleCheck = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.user;
  const tenantId = req.params.id;

  if (user.role === UserRole.ADMIN) {

    if (user.tenantId !== tenantId) {
      return res.status(403).json({
        message: "You can only update their own tenant",
      });
    }

    const restrictedFields = [
      "shopLimit",
      "userLimitPerShop",
      "subscriptionStatus",
    ];

    const sentRestricted = restrictedFields.some(
      (field) => field in req.body
    );

    if (sentRestricted) {
      return res.status(403).json({
        message: "Admins cannot update subscription settings",
      });
    }
  }

  next();
};