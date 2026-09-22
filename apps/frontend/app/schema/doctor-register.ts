import { z } from "zod";

export const registerDoctorSchema = z.object({
  name: z.string().min(1, "Full name is required"),

  email: z
    .string()
    .email("Enter a valid email address")
    .refine(
      (value) => value.includes("@"),
      "Please enter a valid email address. It should contain '@'."
    )
    .refine(
      (value) => /\.(com|ma)$/i.test(value),
      "Email must end with .com or .ma"
    ),

  speciality: z.string().min(1, "Specialty is required"),

  license_number: z.string().min(1, "License number is required"),

  experience: z.number().min(0, "Years of experience is required"),

  bio: z.string().min(1, "Brief bio is required"),

  phone: z.string().min(1, "Phone number is required"),

  languages: z
    .array(z.string())
    .min(1, "At least one language is required"),

  location: z.object({
    address: z.string().min(1, "Address is required"),
    city: z.string().min(1, "City is required"),
    state: z.string().min(1, "State is required"),
    zip_code: z.string().min(1, "Zip code is required"),
    country: z.string().min(1, "Country is required"),
    latitude: z.number().optional(),
    longitude: z.number().optional(),
  }),

});