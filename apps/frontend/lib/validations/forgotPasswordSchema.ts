import { z } from "zod";

export const forgotSchema = z.object({
  email: z
    .string()
    .email("Enter a valid email address")
    .refine(
      (value) => /\.(com|ma)$/i.test(value),
      "Email must end with .com or .ma"
    ),
});

export type ForgotForm = z.infer<typeof forgotSchema>;