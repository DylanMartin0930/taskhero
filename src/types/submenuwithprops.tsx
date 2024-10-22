import { SideNavItem } from "./sidenavitem";

export type MenuItemWithSubMenuProps = {
  item: SideNavItem;
  toggleOpen: () => void;
};
