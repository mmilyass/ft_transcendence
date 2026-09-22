export default function LoginBackground() {
	return (
		<div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
			<div
				className="absolute top-[10%] left-[10%] w-[40%] h-[40%] rounded-full blur-[120px]"
				style={{ backgroundColor: "rgba(0, 87, 205, 0.05)" }}
			/>
			<div
				className="absolute bottom-[10%] right-[10%] w-[35%] h-[35%] rounded-full blur-[100px]"
				style={{ backgroundColor: "rgba(66, 92, 155, 0.05)" }}
			/>
			<div
				className="absolute top-[20%] right-[15%] w-25 h-25 rounded-full blur-[60px] opacity-20"
				style={{ backgroundColor: "#ffdbce" }}
			/>
		</div>
	);
}