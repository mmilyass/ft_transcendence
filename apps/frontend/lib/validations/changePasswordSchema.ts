import { z } from "zod";

export const changeSchema = z
  .object({
    currentPassword: z
      .string()
      .trim()
      .min(8, "Current password is required"),

    newPassword: z
      .string()
      .trim()
      .min(8, "New password must be at least 8 characters"),

    confirmPassword: z
      .string()
      .trim()
      .min(8, "Confirm password is required"),
  })
  .refine(
    (data) => data.newPassword === data.confirmPassword,
    {
      path: ["confirmPassword"],
      message: "New passwords do not match",
    }
  );

export type ChangeForm = z.infer<typeof changeSchema>;