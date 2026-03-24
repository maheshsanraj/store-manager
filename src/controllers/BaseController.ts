import express from "express";
import type { Request, Response, NextFunction } from "express";

export class BaseController {
  protected handleResponse(
    res: Response,
    data: any,
    message = "Success"
  ) {
    return res.status(200).json({
      success: true,
      message,
      data,
    });
  }

  protected handleError(
    next: NextFunction,
    error: any
  ) {
    next(error);
  }
}