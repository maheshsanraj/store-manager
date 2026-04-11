import { cleanObject } from "../../utils/cleanObject";


export class UserDto {
  constructor(user: any) {
    const u = user.dataValues || user;

    return cleanObject({
      id: u.id,
      name: u.name,
      mobileNumber: u.mobileNumber,
      email: u.email,
      role: u.role,
      tenantId: u.tenantId,
      shopId: u.shopId,
    });
  }
}