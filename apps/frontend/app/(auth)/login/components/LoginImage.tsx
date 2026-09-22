import Image from "next/image";

export default function LoginImage() {
	return (
		<div className="hidden lg:block fixed top-1/2 -right-24 -translate-y-1/2 w-64 h-96 opacity-10">
			<Image
				alt="Clinical environment"
				fill
				src="https://lh3.googleusercontent.com/aida-public/AB6AXuDkHqkkpwr0eOnMgQc0OIf1L61TFcolCMTHxPm6BOqSKDRiZcSBj5i0SSx5YDrAaRtArjRlEEHUaSO-JlNGidngNLDvErm3f5oeqkg1OzfboKqwUC-o41oEq7TrP5w_f5_Lt9qOBSQgwipkNsgr4WGewltB2UuyVvXBEInZ_1wKX4tfdXTHXcysVLmGXmgFc_3PXZR-w0MjOE1pmCAFP5ZNg4Scl11cIBqnBVqLdjq-xpAgysxmGbsDU-fYCERKJBXnoXv8DACFh5w"
				sizes="50vw"
				loading="eager"
			/>
		</div>
	);
}