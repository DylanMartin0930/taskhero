import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "react-hot-toast";

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
        <Toaster position="top-right" toastOptions={{ duration: 10000 }} />
        {children}
      </body>
    </html>
  );
}
