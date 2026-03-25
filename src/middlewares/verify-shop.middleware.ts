import { NextFunction, Request, Response } from "express";
import { Shop } from "../models/shop.model";

export const verifyShop = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const shopId = req.user!.shopId || req.body.shopId || req.params.shopId;

        const shop = await Shop.findOne({
            where: {
                id: shopId,
                tenantId: req.user!?.tenantId,
            },
        });

        if (!shop) {
            return res.status(404).json({ success: false, message: "Shop not found" });
        }

        req.shop = shop;

        next();
    } catch (error) {
        return res.status(500).json({ success: false, message: "Shop verification failed" });
    }
};