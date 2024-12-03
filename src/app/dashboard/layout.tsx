"use client";
import Header from "@/components/ui/header";
import Navbar from "@/components/ui/navbar";

import { DueSoonbProvider } from "@/components/context/DueSoonContext";
import { NavbarFunctionProvider } from "@/components/context/NavbarFunctionContext";
import { GraphProvider } from "@/components/context/GraphContext";
import { useRef } from "react";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const onRefreshRef = useRef<() => void>(() => {});
  return (
    <NavbarFunctionProvider onRefresh={() => onRefreshRef.current()}>
      <body className=" bg-red">
        <Header />
        <div className="flex h-auto">
          <Navbar setOnRefresh={(fn) => (onRefreshRef.current = fn)} />
          <GraphProvider>
            <DueSoonbProvider>
              <div className="t-[60px] h-full flex-1 bg-[#e2e2e2]">
                {children}
              </div>
            </DueSoonbProvider>
          </GraphProvider>
        </div>
      </body>
    </NavbarFunctionProvider>
  );
}
