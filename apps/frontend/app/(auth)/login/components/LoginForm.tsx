"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { loginSchema, LoginForm as LoginFormType } from "../login.schema";
import { LoginFormProps } from "@/types/login";
import { useI18n } from "@/lib/i18n/I18nContext";

export default function LoginForm({ setUser }: LoginFormProps) {
	const router = useRouter();
	const { t } = useI18n();

	const [showPassword, setShowPassword] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<LoginFormType>({
		resolver: zodResolver(loginSchema),
		defaultValues: {
			rememberMe: false,
		},
	});

	const onSubmit = async (data: LoginFormType) => {
		setIsLoading(true);

		try {
			const { data: responseData } = await axios.post(
				process.env.NEXT_PUBLIC_URL + "/auth/login",
				{
					email: data.email,
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

			setUser(responseData.user);

			toast.success("Login successful! Redirecting...");
			router.push("/");
		} catch (err) {
			console.error(err);
			const rawMessage = axios.isAxiosError(err)
				? (err.response?.data as { message?: string | string[] })?.message
				: undefined;
			const message = Array.isArray(rawMessage)
				? rawMessage.join(", ")
				: rawMessage ||
				  (axios.isAxiosError(err)
						? "Login failed"
						: err instanceof Error
							? err.message
							: "An unknown error occurred.");

			toast.error(`${message} Please try again.`);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="glass-panel rounded-2xl shadow-[0_12px_40px_rgba(0,87,206,0.06)] p-8 md:p-12">
			<header className="mb-8 text-center">
				<h2
					className="font-headline text-3xl font-bold tracking-tight mb-2"
					style={{ color: "#191c1e" }}
				>
					{t('auth.login.title')}
				</h2>

				<p
					className="text-sm font-medium"
					style={{ color: "#424655" }}
				>
					{t('auth.login.subtitle')}
				</p>
			</header>

			<form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
				{/* Email */}
				<div className="space-y-2">
					<label
						className="block text-xs font-semibold uppercase tracking-wider"
						htmlFor="email"
					>
						{t('auth.login.email')}
					</label>

					<div className="relative">
						<span
							className="absolute inset-y-0 left-4 flex items-center pointer-events-none"
							style={{ color: "#727787" }}
						>
							<span className="material-symbols-outlined text-[20px]">
								mail
							</span>
						</span>

						<input
							id="email"
							placeholder="dr.wilson@maou3idy.com"
							className="w-full pl-12 pr-4 py-4 border-none rounded-xl outline-none font-medium"
							style={{
								backgroundColor: "#f3f3f7",
								color: "#191c1e",
							}}
							{...register("email")}
						/>
					</div>

					{errors.email && (
						<p className="text-xs text-red-600">
							{errors.email.message}
						</p>
					)}
				</div>

				{/* Password */}
				<div className="space-y-2">
					<div className="flex justify-between items-center">
						<label
							className="block text-xs font-semibold uppercase tracking-wider"
							htmlFor="password"
						>
							{t('auth.login.password')}
						</label>

						<button
							type="button"
							onClick={() => router.push("/forgot-password")}
							className="text-xs font-bold text-primary cursor-pointer"
						>
							{t('auth.login.forgotPassword')}
						</button>
					</div>

					<div className="relative">
						<span
							className="absolute inset-y-0 left-4 flex items-center pointer-events-none"
							style={{ color: "#727787" }}
						>
							<span className="material-symbols-outlined text-[20px]">
								lock
							</span>
						</span>

						<input
							id="password"
							type={showPassword ? "text" : "password"}
							placeholder="••••••••"
							className="w-full pl-12 pr-12 py-4 border-none rounded-xl outline-none font-medium"
							style={{
								backgroundColor: "#f3f3f7",
								color: "#191c1e",
							}}
							{...register("password")}
						/>

						<button
							type="button"
							onClick={() => setShowPassword(!showPassword)}
							className="absolute inset-y-0 right-4 flex items-center"
						>
							<span className="material-symbols-outlined text-[20px]">
								{showPassword ? "visibility_off" : "visibility"}
							</span>
						</button>
					</div>

					{errors.password && (
						<p className="text-xs text-red-600">
							{errors.password.message}
						</p>
					)}
				</div>

				{/* Remember Me */}
				<div className="flex items-center">
					<input
						id="rememberMe"
						type="checkbox"
						className="w-4 h-4"
						{...register("rememberMe")}
					/>

					<label
						htmlFor="rememberMe"
						className="ml-2 text-sm font-medium"
					>
						{t('auth.login.rememberMe')}
					</label>
				</div>

				{/* Submit */}
				<button
					type="submit"
					disabled={isLoading}
					className="w-full py-4 px-6 font-bold rounded-3xl text-white disabled:opacity-50"
					style={{
						background:
							"linear-gradient(to right, #0057cd, #0d6efd)",
					}}
				>
					{isLoading ? "Signing In..." : t('auth.login.submit')}
				</button>
			</form>

			<div className="mt-8 text-center">
				<p className="text-sm">
					{t('auth.login.noAccount')}
					<span
						onClick={() => router.push("/register")}
						className="ml-1 font-bold text-primary cursor-pointer"
					>
						{t('nav.signUp')}
					</span>
				</p>
			</div>
		</div>
	);
}