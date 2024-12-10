import Provider from "@/utils/providers";
import { GoogleAnalytics } from "@next/third-parties/google";
import type { Metadata } from "next";
import Script from "next/script";
import { Toaster } from "react-hot-toast";
import { WebVitals } from "../components/utils/web-vitals";
import "./globals.css";

export const metadata: Metadata = {
	title: "TaskHero",
	description: "Unleash Your Productivity One Task at a Time",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body>
				<Toaster position="top-right" toastOptions={{ duration: 5000 }} />
				<WebVitals />
				<Provider>{children}</Provider>
				<GoogleAnalytics gaId="G-9T9C0K7QTS" />
			</body>
		</html>
	);
}
