import { z } from "zod";
import { registerDoctorSchema } from "@/app/schema/doctor-register";

export type RegisterDoctorForm = z.infer<
  typeof registerDoctorSchema
>;