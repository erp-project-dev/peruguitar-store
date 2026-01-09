import {
  LayoutDashboard,
  Guitar,
  Users,
  UserCircle,
  Settings,
  Tags,
  Layers,
  Tag,
  Receipt,
  LucideIcon,
} from "lucide-react";

export interface SidebarItem {
  id: string;
  label: string;
  icon: LucideIcon;
  path: string;
}

export interface SidebarGroup {
  group: string;
  items: SidebarItem[];
}

export type SidebarEntry = SidebarItem | SidebarGroup;

export const SIDEBAR_MENU: SidebarEntry[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
    path: "/",
  },

  {
    group: "CATALOG",
    items: [
      {
        id: "merchants",
        label: "Merchants",
        icon: Users,
        path: "/merchants",
      },
      {
        id: "categories",
        label: "Categories",
        icon: Tag,
        path: "/categories",
      },
      {
        id: "catalog",
        label: "Catalog",
        icon: Guitar,
        path: "/catalog",
      },
      {
        id: "brands",
        label: "Brands",
        icon: Tags,
        path: "/brands",
      },
      {
        id: "types",
        label: "Types",
        icon: Layers,
        path: "/types",
      },
    ],
  },

  {
    group: "ORDERS",
    items: [
      {
        id: "customers",
        label: "Customers",
        icon: UserCircle,
        path: "/customers",
      },
      {
        id: "orders",
        label: "Orders",
        icon: Receipt,
        path: "/orders",
      },
    ],
  },

  {
    id: "settings",
    label: "Settings",
    icon: Settings,
    path: "/settings",
  },
];
