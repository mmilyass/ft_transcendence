import { IsNotEmpty, IsString, MinLength } from "class-validator";

export class ChangePasswordDto {
  @IsString({ message: "Old password must be a string" })
  @IsNotEmpty({ message: "Old password is required" })
  old_password: string;
  @IsString({ message: "New password must be a string" })
  @IsNotEmpty({ message: "New password is required" })
  @MinLength(8, { message: "New password must be at least 8 characters long" })
  new_password: string;
}
