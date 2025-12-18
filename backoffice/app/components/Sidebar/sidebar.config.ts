// sidebar.config.ts
import {
  LayoutDashboard,
  Guitar,
  Users,
  Settings,
  Tags,
  Layers,
} from "lucide-react";

export const SIDEBAR_MENU = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
    path: "/",
  },
  {
    id: "merchants",
    label: "Merchants",
    icon: Users,
    path: "/merchants",
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
