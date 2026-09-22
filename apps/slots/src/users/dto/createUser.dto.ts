import { Role } from "@prisma/client";

export class CreateUserDto {
  name: string;
  email: string;
  password: string;
  phone?: string = "";
  verified?: boolean = false;
  role?: Role = Role.USER;
}
