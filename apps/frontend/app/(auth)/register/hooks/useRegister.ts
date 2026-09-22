"use client";

import axios from "axios";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { registerSchema } from "../../../schema/register";
import { RegisterFormData } from "@/types/register";
import { RegisterProps } from "@/types/register";

export function useRegister({ setUser }: RegisterProps) {
	const router = useRouter();

	const handleGoogleLogin = () => {
		window.location.href = process.env.NEXT_PUBLIC_URL + "/auth/google";
	};

	const registerUser = async (
		data: RegisterFormData,
		setLoading: (loading: boolean) => void
	) => {
		try {
			setLoading(true);

			const parseResult = registerSchema.safeParse(data);

			if (!parseResult.success) {
				toast.error(parseResult.error.issues[0]?.message);
				return;
			}

			const response = await axios.post(
				process.env.NEXT_PUBLIC_URL + "/auth/register",
				{
					name: data.name,
					email: data.email,
					phone: data.phone,
					password: data.password,
				},
				{
					headers: {
						"Content-Type": "application/json",
						Accept: "application/json",
					},
					withCredentials: true,
				}
			);

			setUser(response.data.user);
			toast.success(
				response.data.message ||
				"Registration successful! Please check your email to verify your account."
			);

			router.push("/");
		} catch (error) {
			if (axios.isAxiosError(error)) {
				const backendMessage = error.response?.data?.message;
				toast.error(
					Array.isArray(backendMessage)
						? backendMessage.join(", ")
						: backendMessage || error.message || "Registration failed"
				);
			} else {
				toast.error("An unknown error occurred.");
			}
		} finally {
			setLoading(false);
		}
	};

	return {
		registerUser,
		handleGoogleLogin,
	};
}