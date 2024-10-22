import type { Metadata } from "next";
import Header from "@/components/ui/header";
import Navbar from "@/components/ui/navbar";

export const metadata: Metadata = {
  title: "TaskHero",
  description: "Unleash Your Productivity One Task at a Time",
};

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <div className="bg-red">
        <Header />
        <div className="flex">
          <Navbar />
          <div className="t-[60px] l-[300px] flex-1">{children}</div>
        </div>
      </div>
    </div>
  );
}
