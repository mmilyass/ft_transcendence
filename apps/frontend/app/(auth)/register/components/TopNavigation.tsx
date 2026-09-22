"use client";

export default function TopNavigation() {

	return (
		<header
			className="fixed top-0 w-full z-50 backdrop-blur-xl shadow-sm"
			style={{
				backgroundColor: "rgba(248, 248, 253, 0.8)",
			}}
		>
			<div className="flex justify-between items-center px-6 py-4 max-w-screen-2xl mx-auto w-full">
				<div
					className="text-xl font-bold tracking-tighter font-headline"
					style={{ color: "#191c1e" }}
				>
					Maou<span className="text-blue-500">3</span>idy
				</div>
			</div>
		</header>
	);
}