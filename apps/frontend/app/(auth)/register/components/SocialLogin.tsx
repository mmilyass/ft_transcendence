interface Props {
	handleGoogleLogin: () => void;
}

export default function SocialLogin({
	handleGoogleLogin,
}: Props) {
	return (
		<div className="flex flex-col gap-4 mb-8">
			<button
				onClick={handleGoogleLogin}
				className="flex items-center justify-center gap-3 w-full py-3.5 px-6 rounded-xl font-medium text-sm transition-all duration-200 active:scale-95"
				style={{
					backgroundColor: "#f3f3f7",
					color: "#191c1e",
				}}
			>
				Continue with Google
			</button>

			<div className="flex items-center gap-4 py-2">
				<div
					className="h-px flex-1"
					style={{ backgroundColor: "#e7e8eb" }}
				/>
				<span
					className="text-xs font-semibold tracking-widest uppercase"
					style={{ color: "#727787" }}
				>
					OR
				</span>
				<div
					className="h-px flex-1"
					style={{ backgroundColor: "#e7e8eb" }}
				/>
			</div>
		</div>
	);
}