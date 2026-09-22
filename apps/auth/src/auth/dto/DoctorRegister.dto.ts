import { IsEmail, IsNotEmpty } from "class-validator";

export class DoctorRegisterDto {
  @IsNotEmpty({ message: "Full name is required" })
  name: string;
  @IsEmail({}, { message: "Invalid email format" })
  @IsNotEmpty({ message: "Email is required" })
  email: string;
  @IsNotEmpty({ message: "location is required" })
  location: {
    address: string;
    city: string;
    state: string;
    zip_code: string;
    country: string;
    latitude?: number;
    longitude?: number;
  };
  @IsNotEmpty({ message: "experience is required" })
  experience: number;
  @IsNotEmpty({ message: "speciality is required" })
  speciality: string;
  @IsNotEmpty({ message: "License number is required" })
  license_number: string;
  @IsNotEmpty({ message: "Brief bio is required" })
  bio: string;
  @IsNotEmpty({ message: "Phone number is required" })
  phone: string;
  languages: string[];
}
