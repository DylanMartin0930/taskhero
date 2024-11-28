"use client";
import Header from "@/components/ui/header";
import Navbar from "@/components/ui/navbar";

import { DueSoonbProvider } from "@/components/context/DueSoonContext";
import { NavbarFunctionProvider } from "@/components/context/NavbarFunctionContext";
import { useRef } from "react";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const onRefreshRef = useRef<() => void>(() => {});
  return (
    <NavbarFunctionProvider onRefresh={() => onRefreshRef.current()}>
      <div className="bg-red">
        <Header />
        <div className="flex">
          <Navbar setOnRefresh={(fn) => (onRefreshRef.current = fn)} />
          <DueSoonbProvider>
            <div className="t-[60px] h-full flex-1 bg-[#e2e2e2]">
              {children}
            </div>
          </DueSoonbProvider>
        </div>
      </div>
    </NavbarFunctionProvider>
  );
}
