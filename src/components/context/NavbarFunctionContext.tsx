import React, { createContext, useContext } from "react";

type NavbarFunctionContextType = {
	onRefresh: () => void;
};

const NavbarFunctionContext = createContext<
	NavbarFunctionContextType | undefined
>(undefined);

export const NavbarFunctionProvider: React.FC<{
	onRefresh: () => void;
	children: React.ReactNode;
}> = ({ onRefresh, children }) => (
	<NavbarFunctionContext.Provider value={{ onRefresh }}>
		{children}
	</NavbarFunctionContext.Provider>
);

export const useNavbarFunction = () => {
	const context = useContext(NavbarFunctionContext);
	if (!context) {
		throw new Error(
			"useNavbarFunction must be used within a NavbarFunctionProvider"
		);
	}
	return context;
};
