import { Icon } from "@iconify/react";
import { SideNavItem } from "../types/sidenavitem";

export const DEFAULT_ITEMS: SideNavItem[] = [
  {
    title: "Inbox",
    path: "/dashboard/inbox",
    icon: <Icon icon="lucide:home" width="24" height="24" />,
  },
  {
    title: "Today",
    path: "/dashboard/today",
    icon: <Icon icon="lucide:home" width="24" height="24" />,
  },

  {
    title: "Upcoming",
    path: "/upcoming",
    icon: <Icon icon="lucide:home" width="24" height="24" />,
  },

  {
    title: "Logbook",
    path: "/dashboard/logbook",
    icon: <Icon icon="lucide:home" width="24" height="24" />,
  },

  {
    title: "Trash",
    path: "/trash",
    icon: <Icon icon="lucide:home" width="24" height="24" />,
  },
];
