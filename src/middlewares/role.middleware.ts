import express from "express";
import type { Request, Response, NextFunction } from "express";

export const authorizeRoles =
    (...allowedRoles: string[]) =>
        (req: Request, res: Response, next: NextFunction) => {
            try {
                if (!req.user!) {
                    return res.status(401).json({ success: false, message: "Unauthorized" });
                }

                if (!allowedRoles.includes(req.user!.role)) {
                    return res.status(403).json({
                        message: "Forbidden: You do not have access to this resource",
                    });
                }

                next();
            } catch (error) {
                return res.status(500).json({ success: false, message: "Server error" });
            }
        };