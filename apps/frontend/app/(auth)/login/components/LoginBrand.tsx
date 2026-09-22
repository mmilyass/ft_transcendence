export default function LoginBrand() {
	return (
		<div className="flex flex-col items-center mb-10">
			<div
				className="mb-4 flex items-center justify-center w-12 h-12 rounded-4xl shadow-sm"
				style={{ backgroundColor: "#0d6efd" }}
			>
				<span
					className="material-symbols-outlined text-2xl"
					style={{ color: "#ffffff" }}
				>
					medical_services
				</span>
			</div>

			<h1
				className="font-headline text-2xl font-extrabold tracking-tighter"
				style={{ color: "#191c1e" }}
			>
				Maou<span className="text-blue-500">3</span>idy
			</h1>
		</div>
	);
}