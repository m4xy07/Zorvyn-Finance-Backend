import { BarChart3, LayoutDashboard, ReceiptText, Users } from "lucide-react";
import type { ComponentType } from "react";

interface DashboardNavItem {
  label: string;
  href: string;
  icon: ComponentType<{ className?: string }>;
  adminOnly?: boolean;
}

export const dashboardNavItems: DashboardNavItem[] = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Records",
    href: "/records",
    icon: ReceiptText,
  },
  {
    label: "Analytics",
    href: "/analytics",
    icon: BarChart3,
  },
  {
    label: "Users",
    href: "/users",
    icon: Users,
    adminOnly: true,
  },
];

