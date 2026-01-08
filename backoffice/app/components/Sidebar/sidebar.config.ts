// sidebar.config.ts
import {
  LayoutDashboard,
  Guitar,
  Users,
  UserCircle,
  Settings,
  Tags,
  Layers,
  Tag,
} from "lucide-react";

export const SIDEBAR_MENU = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
    path: "/",
  },
  {
    id: "customers",
    label: "Customers",
    icon: UserCircle,
    path: "/customers",
  },
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
  {
    id: "settings",
    label: "Settings",
    icon: Settings,
    path: "/settings",
  },
];
