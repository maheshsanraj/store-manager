import { NextFunction, Request, Response } from "express";
import { Shop } from "../models/shop.model";

export const verifyShop = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const queryShopId =
      (req.user && req.user.shopId) ||
      req.query.shopId ||
      req.body.shopId ||
      req.params.shopId;
    if (!queryShopId) {
      return res.status(400).json({
        success: false,
        message: "ShopId is required",
      });
    }

    const shop = await Shop.findOne({
      where: {
        id: queryShopId,
        tenantId: req.user?.tenantId,
      },
    });

    if (!shop) {
      return res
        .status(404)
        .json({ success: false, message: "Shop not found" });
    }

    req.shop = shop;

    next();
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Shop verification failed" });
  }
};
