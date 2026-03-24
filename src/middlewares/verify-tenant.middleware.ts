import { Request, Response, NextFunction } from "express";
import { Tenant } from "../models/tenant.model";

export const verifyTenant = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const tenantId = req.user?.tenantId;

        if (!tenantId) {
            return res.status(403).json({
                message: "Tenant not found in token",
            });
        }

        const tenant = await Tenant.findOne({
            where: {
                id: tenantId,
                isActive: true,
            },
        });

        if (!tenant) {
            return res.status(403).json({
                message: "Your organization is currently inactive. Please contact the administrator.",
            });
        }

        req.tenant = tenant;

        next();
    } catch (error) {
        return res.status(500).json({
            message: "Tenant verification failed",
        });
    }
};