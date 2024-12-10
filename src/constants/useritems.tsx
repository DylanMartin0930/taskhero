import { Icon } from "@iconify/react";
import { useQuery } from "@tanstack/react-query";
import { SideNavItem } from "../types/sidenavitem";

export const USER_ITEMS: SideNavItem[] = [
	{
		title: "Profile",
		path: "/dashboard/profile/id?=",
		icon: <Icon icon="lucide:profile-fill" width="24" height="24" />,
	},

	{
		title: "Logout",
		path: "/logout",
		icon: <Icon icon="lucide:home" width="24" height="24" />,
	},
];
