import { Request, Response, NextFunction } from "express";
import { Schema } from "joi";
import fs from "fs";

export const validateRequest = (schema: Schema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req.body, { abortEarly: false, stripUnknown: true });
    if (error) {
      if (req.file && fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }
      return res.status(400).json({
        success: false,
        message: "Validation error",
        details: error.details.map((d) => d.message),
      });
    }
    next();
  };
};