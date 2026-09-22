"use client";

import Link from "next/link";
import {
	Dispatch,
	SetStateAction,
} from "react";
import {
	FieldErrors,
	UseFormRegister,
} from "react-hook-form";

import { RegisterFormData } from "@/types/register";
import { useI18n } from "@/lib/i18n/I18nContext";

interface RegisterFormProps {
	register: UseFormRegister<RegisterFormData>;
	errors: FieldErrors<RegisterFormData>;
	showPassword: boolean;
	setShowPassword: Dispatch<SetStateAction<boolean>>;
	isLoading: boolean;
	onSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>;
}

export default function RegisterForm({
	register,
	errors,
	showPassword,
	setShowPassword,
	isLoading,
	onSubmit,
}: RegisterFormProps) {
	const { t } = useI18n();
	return (
		<form className="space-y-6" onSubmit={onSubmit}>
			{/* {t('auth.register.name')} */}
			<div className="space-y-2">
				<label
					className="block text-xs font-bold tracking-wider uppercase pl-1"
					htmlFor="name"
					style={{ color: "#5f6368" }}
				>
					{t('auth.register.name')}
				</label>

				<div className="relative">
					<span
						className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[20px]"
						style={{ color: "#727787" }}
					>
						person
					</span>

					<input
						className="w-full pl-12 pr-4 py-3.5 border-none rounded-xl focus:ring-2 transition-all duration-200 placeholder:text-outline/60 text-sm outline-none"
						style={{
							backgroundColor: "#f3f3f7",
							color: "#191c1e",
						}}
						id="name"
						type="text"
						placeholder="John Doe"
						{...register("name")}
					/>
				</div>

				{errors.name && (
					<p
						className="text-xs mt-1"
						style={{ color: "#e55353" }}
					>
						{errors.name.message}
					</p>
				)}
			</div>

			{/* Email & Phone */}
			<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
				<div className="space-y-2">
					<label
						className="block text-xs font-bold tracking-wider uppercase pl-1"
						htmlFor="email"
						style={{ color: "#5f6368" }}
					>
						{t('auth.register.email')}
					</label>

					<div className="relative">
						<span
							className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[20px]"
							style={{ color: "#727787" }}
						>
							mail
						</span>

						<input
							className="w-full pl-12 pr-4 py-3.5 border-none rounded-xl outline-none text-sm"
							style={{
								backgroundColor: "#f3f3f7",
								color: "#191c1e",
							}}
							id="email"
							placeholder="john@example.com"
							{...register("email")}
						/>
					</div>

					{errors.email && (
						<p
							className="text-xs mt-1"
							style={{ color: "#e55353" }}
						>
							{errors.email.message}
						</p>
					)}
				</div>

				<div className="space-y-2">
					<label
						className="block text-xs font-bold tracking-wider uppercase pl-1"
						htmlFor="phone"
						style={{ color: "#5f6368" }}
					>
						{t('auth.register.phone')}
					</label>

					<div className="relative">
						<span
							className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[20px]"
							style={{ color: "#727787" }}
						>
							call
						</span>

						<input
							className="w-full pl-12 pr-4 py-3.5 border-none rounded-xl outline-none text-sm"
							style={{
								backgroundColor: "#f3f3f7",
								color: "#191c1e",
							}}
							id="phone"
							type="tel"
							placeholder="+1 (555) 000-0000"
							{...register("phone")}
						/>
					</div>

					{errors.phone && (
						<p
							className="text-xs mt-1"
							style={{ color: "#e55353" }}
						>
							{errors.phone.message}
						</p>
					)}
				</div>
			</div>

			{/* Passwords */}
			<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
				<div className="space-y-2">
					<label
						className="block text-xs font-bold tracking-wider uppercase pl-1"
						htmlFor="password"
						style={{ color: "#5f6368" }}
					>
						{t('auth.register.password')}
					</label>

					<div className="relative">
						<span
							className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[20px]"
							style={{ color: "#727787" }}
						>
							lock
						</span>

						<input
							className="w-full pl-12 pr-4 py-3.5 border-none rounded-xl outline-none text-sm"
							style={{
								backgroundColor: "#f3f3f7",
								color: "#191c1e",
							}}
							id="password"
							type={
								showPassword
									? "text"
									: "password"
							}
							placeholder="••••••••"
							{...register("password")}
						/>
					</div>

					{errors.password && (
						<p
							className="text-xs mt-1"
							style={{ color: "#e55353" }}
						>
							{errors.password.message}
						</p>
					)}
				</div>

				<div className="space-y-2">
					<label
						className="block text-xs font-bold tracking-wider uppercase pl-1"
						htmlFor="confirm_password"
						style={{ color: "#5f6368" }}
					>
						{t('auth.register.confirmPassword')}
					</label>

					<div className="relative">
						<span
							className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[20px]"
							style={{ color: "#727787" }}
						>
							verified_user
						</span>

						<input
							className="w-full pl-12 pr-4 py-3.5 border-none rounded-xl outline-none text-sm"
							style={{
								backgroundColor: "#f3f3f7",
								color: "#191c1e",
							}}
							id="confirm_password"
							type={
								showPassword
									? "text"
									: "password"
							}
							placeholder="••••••••"
							{...register(
								"confirm_password"
							)}
						/>
					</div>

					{errors.confirm_password && (
						<p
							className="text-xs mt-1"
							style={{ color: "#e55353" }}
						>
							{
								errors.confirm_password
									.message
							}
						</p>
					)}
				</div>
			</div>

			{/* {t('auth.register.showPassword')} */}
			<div className="flex gap-2">
				<input
					id="show_password"
					type="checkbox"
					className="mt-1 rounded cursor-pointer"
					style={{
						accentColor: "#0057cd",
					}}
					checked={showPassword}
					onChange={() =>
						setShowPassword((prev) => !prev)
					}
				/>

				<label
					htmlFor="show_password"
					className="text-xs cursor-pointer"
					style={{ color: "#5f6368" }}
				>
					{t('auth.register.showPassword')}
				</label>
			</div>

			{/* Terms */}
			<div className="flex gap-2">
				<input
					id="terms"
					type="checkbox"
					{...register("terms")}
					className="mt-1 rounded cursor-pointer"
					style={{
						accentColor: "#0057cd",
					}}
				/>

				<label
					htmlFor="terms"
					className="text-xs leading-relaxed"
					style={{ color: "#5f6368" }}
				>
					I agree to the{" "}
					<Link
						href="/terms-of-service"
						className="font-semibold hover:underline"
						style={{ color: "#0057cd" }}
					>
						Terms of Service
					</Link>{" "}
					and{" "}
					<Link
						href="/privacy-policy"
						className="font-semibold hover:underline"
						style={{ color: "#0057cd" }}
					>
						Privacy Policy
					</Link>
					.
				</label>
			</div>

			{errors.terms && (
				<p
					className="text-xs"
					style={{ color: "#e55353" }}
				>
					{errors.terms.message}
				</p>
			)}

			{/* Submit */}
			<button
				type="submit"
				disabled={isLoading}
				className="w-full py-4 font-headline font-bold rounded-xl shadow-lg transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
				style={{
					background:
						"linear-gradient(to right, #0057cd, #0d6efd)",
					color: "#ffffff",
					boxShadow:
						"0 8px 16px rgba(0, 87, 205, 0.2)",
				}}
			>
				{isLoading
					? "Registering..."
					: t('auth.register.submit')}
			</button>

			<div className="mt-8 text-center">
				<p
					className="text-sm"
					style={{ color: "#5f6368" }}
				>
					{t('auth.register.haveAccount')}
					<Link
						href="/login"
						className="font-bold ml-1"
						style={{ color: "#0057cd" }}
					>
						{t('nav.signIn')}
					</Link>
				</p>
			</div>
		</form>
	);
}