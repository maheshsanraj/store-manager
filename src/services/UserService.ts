import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { BaseService } from "./BaseService";
import { UserRepository } from "../repositories/UserRepository";

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
      lastLogin: new Date()
    })

    const payload = {
      id: user.id,
      role: user.role,
      tokenVersion: user.tokenVersion,
      ...(user.tenantId && { tenantId: user.tenantId }),
      ...(user.shopId && { shopId: user.shopId })
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: "7d" });
    const { pin: _pin, tenantId, shopId, ...rest } = user.dataValues;

    const safeUser = {
      ...rest,
      ...(tenantId && { tenantId }),
      ...(shopId && { shopId })
    };

    return { user: safeUser, token };
  }
  async logout(userId: string) {
    const user = await this.userRepo.findById(userId);

    if (!user) {
      throw { status: 404, message: "User not found" };
    }

    await user.update({
      tokenVersion: user.tokenVersion + 1
    });

    return true;
  }
}