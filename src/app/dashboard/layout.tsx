"use client";
import Header from "@/components/ui/header";
import Navbar from "@/components/ui/navbar";

import { DueSoonbProvider } from "@/components/context/DueSoonContext";
import { GraphProvider } from "@/components/context/GraphContext";
import { NavbarFunctionProvider } from "@/components/context/NavbarFunctionContext";
import { UserProvider } from "@/components/context/UserContext";
import { useRef } from "react";

export default function DashboardLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const onRefreshRef = useRef<() => void>(() => {});
	return (
		<NavbarFunctionProvider onRefresh={() => onRefreshRef.current()}>
			<div className="min-h-screen flex flex-col">
				<Header />
				<div className="flex flex-1 overflow-hidden">
					<Navbar setOnRefresh={(fn) => (onRefreshRef.current = fn)} />
					<UserProvider>
						<GraphProvider>
							<DueSoonbProvider>
								<div className="flex-1 overflow-auto  bg-[#e2e2e2]">
									<div className="max-w-full h-full">{children}</div>
								</div>
							</DueSoonbProvider>
						</GraphProvider>
					</UserProvider>
				</div>
			</div>
		</NavbarFunctionProvider>
	);
}
