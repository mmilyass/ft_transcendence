import Link from "next/link";

export default function LoginFooter() {
	return (
		<footer className="mt-12">
			<div className="flex flex-wrap justify-center gap-6 mb-6">
				<Link
					href="/privacy-policy"
					className="text-xs font-medium transition-colors"
				>
					Privacy Policy
				</Link>

				<Link
					href="/terms-of-service"
					className="text-xs font-medium transition-colors"
				>
					Terms of Service
				</Link>
			</div>

			<p className="text-center text-[10px] font-medium tracking-wide uppercase text-outline">
				© 2024 Maou<span className="text-blue-500">3</span>idy Clinical Systems. All rights reserved.
			</p>
		</footer>
	);
}