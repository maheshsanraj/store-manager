import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { BaseService } from "./BaseService";
import { UserRepository } from "../repositories/UserRepository";
import { generateOtp } from "../utils/generateOtp";
import { sendEmail } from "./emailSerivce";
import { otpTemplate } from "../templates/resetOtp.template";
import { LoginResponseDto } from "../dtos/user";

interface LoginResponse {
  user: any;
  token: string;
}

export class UserService extends BaseService<any> {
  private userRepo: UserRepository;

  constructor() {
    const repo = new UserRepository();
    super(repo);
    this.userRepo = repo;
  }

  async login(mobileNumber: string, pin: string): Promise<LoginResponse> {
    const user = await this.userRepo.findByMobileNumber(mobileNumber);

    if (!user) {
      throw { status: 404, message: "User not found" };
    }

    const isMatch = await bcrypt.compare(pin, user.pin);
    if (!isMatch) {
      throw { status: 401, message: "Invalid PIN" };
    }
    await user.update({
      lastLogin: new Date(),
    });

    const payload = {
      id: user.id,
      role: user.role,
      tokenVersion: user.tokenVersion,
      ...(user.tenantId && { tenantId: user.tenantId }),
      ...(user.shopId && { shopId: user.shopId }),
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET!, {
      expiresIn: "7d",
    });

    return new LoginResponseDto(user, token);
  }
  async logout(userId: string) {
    const user = await this.userRepo.findById(userId);

    if (!user) {
      throw { status: 404, message: "User not found" };
    }

    await user.update({
      tokenVersion: user.tokenVersion + 1,
    });

    return true;
  }
  async sendResetOtp(email: string) {
    const user = await this.userRepo.findByEmail(email);

    if (!user) return true;

    if (
      user.resetOtpRequestedAt &&
      user.resetOtpRequestedAt > new Date(Date.now() - 30 * 1000)
    ) {
      throw { status: 429, message: "Please wait before requesting OTP again" };
    }

    const otp = generateOtp();

    await user.update({
      resetOtp: await bcrypt.hash(otp, 10),
      resetOtpExpiry: new Date(Date.now() + 5 * 60 * 1000),
      resetOtpAttempts: 0,
      resetOtpRequestedAt: new Date(),
    });

    setImmediate(() => {
      sendEmail({
        to: user.email,
        subject: "Password Reset OTP",
        html: otpTemplate(user.name, otp),
      });
    });

    return true;
  }
  async verifyOtp(email: string, otp: string) {
    const user = await this.userRepo.findByEmail(email);

    if (!user || !user.resetOtp) {
      throw { status: 400, message: "Invalid request" };
    }

    if (user.resetOtpExpiry! < new Date()) {
      throw { status: 400, message: "OTP expired" };
    }

    if (user.resetOtpAttempts >= 5) {
      throw { status: 429, message: "Too many attempts, try later" };
    }

    const isValid = await bcrypt.compare(otp, user.resetOtp);

    if (!isValid) {
      await user.update({
        resetOtpAttempts: user.resetOtpAttempts + 1,
      });

      throw { status: 400, message: "Invalid OTP" };
    }

    await user.update({
      resetOtp: null,
      resetOtpExpiry: null,
      resetOtpAttempts: 0,
    });

    const resetToken = jwt.sign(
      { email, type: "reset" },
      process.env.JWT_SECRET!,
      { expiresIn: "5m" },
    );

    return resetToken;
  }
  async resetPassword(token: string, newPin: string) {
    let decoded: any;

    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET!);
    } catch {
      throw { status: 401, message: "Invalid or expired token" };
    }

    if (decoded.type !== "reset") {
      throw { status: 400, message: "Invalid token type" };
    }

    const user = await this.userRepo.findByEmail(decoded.email);

    if (!user) {
      throw { status: 404, message: "User not found" };
    }

    const hashedPin = await bcrypt.hash(newPin, 10);

    await user.update({
      pin: hashedPin,
      resetOtp: null,
      resetOtpExpiry: null,
      resetOtpAttempts: 0,
      resetOtpRequestedAt: null,
      tokenVersion: user.tokenVersion + 1,
    });

    return true;
  }
}
