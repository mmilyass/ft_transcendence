"use client";

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import axios from 'axios';
import { toast } from 'react-toastify';
import { z } from 'zod';
import { useAuth }  from '@/app/layout';

const tokenSchema = z.string().trim().min(1, "Verification token is missing.");

export default function VerificationEmail() {
	return (
		<Suspense fallback={null}>
			<VerificationEmailInner />
		</Suspense>
	);
}

function VerificationEmailInner() {
	const searchParams = useSearchParams();
	const router = useRouter();
	const token = searchParams.get('token');
	const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
	const [message, setMessage] = useState('Verifying your email address...');
	const [errorMessage, setErrorMessage] = useState<string | null>(null);
	const hasToken = Boolean(token);
	const displayStatus = hasToken ? status : 'error';
	const displayMessage = hasToken ? message : 'Verification token is missing.';
	const displayErrorMessage = hasToken ? errorMessage : 'Verification token is missing.';
	const { loading, setUser } = useAuth();


	useEffect(() => {
		const tokenCheck = tokenSchema.safeParse(token ?? "");
		if (!tokenCheck.success) {
			const message = tokenCheck.error.issues[0]?.message || "Invalid verification token";
			toast.error(message + " Please try again.");
			return;
		}

		const verifyEmail = async () => {
			try {
				const response = await axios.get(process.env.NEXT_PUBLIC_URL + `/auth/verify_email/token=${encodeURIComponent(token ?? "")}`, {
					withCredentials: true,
				});
				const data = response.data;

				setStatus('success');
				setMessage(data.message || 'Email verified successfully.');
				toast.success("Email verified successfully");
				setErrorMessage(null);
				if (data.user) {
					setUser(data.user);
				}
				setTimeout(() => {
					router.refresh();
					router.push('/');
				}, 2000);
			} catch (error) {
				setStatus('error');
				if (axios.isAxiosError(error)) {
					const backendMessage = error.response?.data?.message;
					const msg = Array.isArray(backendMessage)
						? backendMessage.join(", ")
						: backendMessage || error.message || 'Failed to verify email';
					setMessage(msg);
					setErrorMessage(msg);
					toast.error(msg + " Please try again.");
				} else {
					const msg = error instanceof Error ? error.message : 'An unknown error occurred.';
					setMessage(msg);
					setErrorMessage(msg);
					toast.error(msg + " Please try again.");
				}
			}
		};

		verifyEmail();
	}, [router, token, setUser]);

	if (loading) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<p className="text-lg font-medium text-gray-700">Loading...</p>
			</div>
		);
	}

	return (
		<div className="font-body min-h-screen flex items-center justify-center p-6 overflow-x-hidden" style={{ backgroundColor: '#f9f9fd', color: '#191c1e' }}>
			<div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
				<div className="absolute top-[10%] left-[10%] w-[40%] h-[40%] rounded-full blur-[120px]" style={{ backgroundColor: 'rgba(0, 87, 205, 0.05)' }}></div>
				<div className="absolute bottom-[10%] right-[10%] w-[35%] h-[35%] rounded-full blur-[100px]" style={{ backgroundColor: 'rgba(66, 92, 155, 0.05)' }}></div>
				<div className="absolute top-[20%] right-[15%] w-25 h-25 rounded-full blur-[60px] opacity-20" style={{ backgroundColor: '#ffdbce' }}></div>
			</div>

			<main className="w-full max-w-120">
				<div className="flex flex-col items-center mb-10">
					<div className="mb-4 flex items-center justify-center w-12 h-12 rounded-4xl shadow-sm" style={{ backgroundColor: '#0d6efd' }}>
						<span className="material-symbols-outlined text-2xl" data-icon="medical_services" style={{ color: '#ffffff' }}>medical_services</span>
					</div>
					<h1 className="font-headline text-2xl font-extrabold tracking-tighter" style={{ color: '#191c1e' }}>
						Maou<span className="text-blue-500">3</span>idy
					</h1>
				</div>

				<div className="glass-panel rounded-2xl shadow-[0_12px_40px_rgba(0,87,206,0.06)] p-8 md:p-12 text-center">
					<div className="flex flex-col items-center gap-4">
						<div className="flex items-center justify-center w-20 h-20 rounded-full" style={{ backgroundColor: displayStatus === 'success' ? 'rgba(34, 197, 94, 0.12)' : displayStatus === 'error' ? 'rgba(239, 68, 68, 0.12)' : 'rgba(0, 87, 205, 0.1)' }}>
							<span className="material-symbols-outlined text-5xl" style={{ color: displayStatus === 'success' ? '#16a34a' : displayStatus === 'error' ? '#dc2626' : '#0057cd' }}>
								{displayStatus === 'success' ? 'verified' : displayStatus === 'error' ? 'error' : 'mail'}
							</span>
						</div>
						<h2 className="font-headline text-3xl font-bold tracking-tight" style={{ color: '#191c1e' }}>
							Email Verification
						</h2>
						<p className="text-sm font-medium" style={{ color: '#424655' }} aria-live="polite">
							{displayMessage}
						</p>
						{displayStatus === 'error' && displayErrorMessage && (
							<div className="mt-2 rounded-lg px-4 py-3 text-sm font-medium" style={{ backgroundColor: "#ffe6e6", color: "#8b0000" }} role="alert">
								{displayErrorMessage}
							</div>
						)}
						{displayStatus === 'loading' ? (
							<p className="text-xs" style={{ color: '#727787' }}>Please wait while we confirm your account.</p>
						) : null}
					</div>
				</div>
			</main>
		</div>
	);
}
