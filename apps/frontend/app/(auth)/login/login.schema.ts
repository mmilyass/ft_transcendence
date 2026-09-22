import { z } from "zod";

export const loginSchema = z.object({
	email: z
		.string()
		.email("Enter a valid email address")
		.refine(
			(value) => /\.(com|ma)$/i.test(value),
			"Email must end with .com or .ma"
		),
	password: z.string().min(8, "Password must be at least 8 characters"),
	rememberMe: z.boolean().optional(),
});

export type LoginForm = z.infer<typeof loginSchema>;