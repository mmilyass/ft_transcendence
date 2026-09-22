import { DoctorLocation } from "src/doctor-location/type";

export class CreateDoctorDto {
  speciality: string;
  location: DoctorLocation;
  experience: number;
  bio: string;
  languages: string[];
  license_number: string;
  medical_license_url: string;
}
