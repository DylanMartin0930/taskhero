import { Icon } from "@iconify/react";
import { SideNavItem } from "../types/sidenavitem";

export const USER_ITEMS: SideNavItem[] = [
  {
    title: "Profile",
    path: "/profile",
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
