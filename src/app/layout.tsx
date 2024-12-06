import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import Provider from "@/utils/providers";
import { WebVitals } from "../components/utils/web-vitals";
import { GoogleAnalytics } from "@next/third-parties/google";

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
        <GoogleAnalytics gaId="G-L8ZYPHQC0E" />
      </body>
    </html>
  );
}
