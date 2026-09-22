import { IsEmail } from "class-validator";

export class ForgetPasswordDto {
  @IsEmail({}, { message: "Invalid email format" })
  email: string;
}
