"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/layout";

import LoginBackground from "./components/LoginBackground";
import LoginBrand from "./components/LoginBrand";
import LoginForm from "./components/LoginForm";
import LoginFooter from "./components/LoginFooter";
import LoginImage from "./components/LoginImage";

export default function Login() {
	const router = useRouter();
	const { user, setUser } = useAuth();

	useEffect(() => {
	if (!user) return;

	router.push("/");
	}, [user, router]);

	return (
		<div
			className="font-body min-h-screen flex items-center justify-center p-6 overflow-x-hidden"
			style={{ backgroundColor: "#f9f9fd", color: "#191c1e" }}
		>
			<LoginBackground />

			<main className="w-full max-w-120">
				<LoginBrand />
				<LoginForm setUser={setUser} />
				<LoginFooter />
			</main>

			<LoginImage />
		</div>
	);
}