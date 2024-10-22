import { Icon } from "@iconify/react";
import { SideNavItem } from "../types/sidenavitem";

export const DEFAULT_ITEMS: SideNavItem[] = [
  {
    title: "Inbox",
    path: "/inbox",
    icon: <Icon icon="lucide:home" width="24" height="24" />,
  },
  {
    title: "Today",
    path: "/today",
    icon: <Icon icon="lucide:home" width="24" height="24" />,
  },

  {
    title: "Upcoming",
    path: "/upcoming",
    icon: <Icon icon="lucide:home" width="24" height="24" />,
  },

  {
    title: "Logbook",
    path: "/logbook",
    icon: <Icon icon="lucide:home" width="24" height="24" />,
  },

  {
    title: "Trash",
    path: "/trash",
    icon: <Icon icon="lucide:home" width="24" height="24" />,
  },
];
