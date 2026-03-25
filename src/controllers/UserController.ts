import express from "express";
import type { Request, Response, NextFunction } from "express";
import { BaseController } from "./BaseController";
import { UserService } from "../services/UserService";

export class UserController extends BaseController {
  private userService = new UserService();

  login = async (req: Request, res: Response, next: NextFunction) => {
    const { mobileNumber, pin } = req.body;

    const { user, token } = await this.userService.login(mobileNumber, pin);

    return this.handleResponse(res, { user, token }, "Login successful");
  };
  logout = async (req: Request, res: Response) => {

    const userId = req.user!?.id;


    if (!userId) {
      throw { status: 400, message: "User not found in token" };
    }

    await this.userService.logout(userId);
    return this.handleResponse(res, null, "Logout successful");
  };
}