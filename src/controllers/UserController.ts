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
  forgotPassword = async (req: Request, res: Response) => {
    const { email } = req.body;

    await this.userService.sendResetOtp(email);

    return this.handleResponse(res, null, "OTP sent to email");
  };

  verifyOtp = async (req: Request, res: Response) => {
    const { email, otp } = req.body;

    const result = await this.userService.verifyOtp(email, otp);

    return this.handleResponse(res, result, "OTP verified");
  };

  resetPassword = async (req: Request, res: Response) => {
    const token = req.headers.authorization?.split(" ")[1];
    const { newPin } = req.body;

    if (!token) {
      throw { status: 401, message: "Token missing" };
    }

    await this.userService.resetPassword(token, newPin);

    return this.handleResponse(res, null, "Password reset successful");
  };
}
