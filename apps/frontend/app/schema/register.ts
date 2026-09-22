import { z } from "zod";

export const registerSchema = z
	.object({
		name: z.string().min(2, "Name must be at least 2 characters"),

		email: z.string()
			.trim()
			.email("Enter a valid email address")
			.refine(
				(value) => value.includes("@"),
				"Please enter a valid email address. It should contain '@'."
			)
			.refine(
				(value) => /\.(com|ma)$/i.test(value),
				"Email must end with .com or .ma"
			),

		phone: z.string()
			.optional()
			.or(z.literal(""))
			.refine(
				(value) =>
					typeof value === "string" &&
					(value === "" || /^[+0-9\s()-]{7,20}$/.test(value)),
				{
					message: "Enter a valid phone number",
				}
			),

		password: z.string().min(8, "Password must be at least 8 characters"),

		confirm_password: z
			.string()
			.min(8, "Confirm password is required"),

		terms: z.boolean(),
	})
	.refine((data) => data.terms, {
		path: ["terms"],
		message: "Please accept the Terms of Service and Privacy Policy",
	})
	.refine(
		(data) => data.password === data.confirm_password,
		{
			path: ["confirm_password"],
			message: "Passwords do not match",
		}
	);