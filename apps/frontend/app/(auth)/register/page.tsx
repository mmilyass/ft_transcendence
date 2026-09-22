"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import InformationFooter from "@/components/InformationFooter";
import { useAuth } from "@/app/layout";

import { registerSchema } from "../../schema/register";
import { RegisterFormData } from "@/types/register";
import { useRegister } from "./hooks/useRegister";

import TopNavigation from "./components/TopNavigation";
import RegisterHeader from "./components/RegisterHeader";
import RegisterForm from "./components/RegisterForm";
import SocialLogin from "./components/SocialLogin";

export default function RegisterPage() {
	const router = useRouter();

	const { user, loading, setUser } = useAuth();

	const [showPassword, setShowPassword] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	const { registerUser, handleGoogleLogin } =
		useRegister({ setUser });

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<RegisterFormData>({
		resolver: zodResolver(registerSchema),
	});

	useEffect(() => {
		if (loading) return;
		if (!user) return;
		router.refresh();
		router.push("/");
	}, [user, loading, router]);

	return (
		<div
			className="min-h-screen flex flex-col"
			style={{ backgroundColor: "#f9f9fd" }}
		>
			<TopNavigation />

			<main className="flex-1 flex items-center justify-center pt-24 pb-12 px-4">
				<div className="w-full max-w-xl">
					<div
						className="rounded-xl p-8 md:p-12 shadow-sm"
						style={{ backgroundColor: "#ffffff" }}
					>
						<RegisterHeader />

						<SocialLogin
							handleGoogleLogin={
								handleGoogleLogin
							}
						/>

						<RegisterForm
							register={register}
							errors={errors}
							showPassword={showPassword}
							setShowPassword={
								setShowPassword
							}
							isLoading={isLoading}
							onSubmit={handleSubmit(
								(data) =>
									registerUser(
										data,
										setIsLoading
									)
							)}
						/>
					</div>
				</div>
			</main>

			<InformationFooter />
		</div>
	);
}