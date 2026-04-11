import { UserDto } from "./user.dto";

export class LoginResponseDto {
  user: UserDto;
  token: string;

  constructor(user: any, token: string) {
    this.user = new UserDto(user);
    this.token = token;
  }
}