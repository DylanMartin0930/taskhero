import { Icon } from "@iconify/react";
import { SideNavItem } from "../types/sidenavitem";
import { useQuery } from "@tanstack/react-query";

export const USER_ITEMS: SideNavItem[] = [
  {
    title: "Profile",
    path: "/dashboard/profile/id?=",
    icon: <Icon icon="lucide:profile-fill" width="24" height="24" />,
  },

  {
    title: "Settings",
    path: "/settings",
    icon: <Icon icon="lucide:home" width="24" height="24" />,
  },

  {
    title: "Logout",
    path: "/logout",
    icon: <Icon icon="lucide:home" width="24" height="24" />,
  },
];
