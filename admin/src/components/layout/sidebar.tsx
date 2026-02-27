"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Package,
  FileText,
  FolderTree,
  Tag,
  Image,
  ImagePlus,
  MapPin,
  Globe,
  Users,
  History,
  Settings,
  LogOut,
  Mail,
  MessageSquare,
  Star,
} from "lucide-react";
import { logout } from "@/lib/auth";

const menuItems = [
  {
    title: "Dashboard",
    href: "/",
    icon: LayoutDashboard,
  },
  {
    title: "Products",
    href: "/products",
    icon: Package,
  },
  {
    title: "Blogs",
    href: "/blogs",
    icon: FileText,
  },
  {
    title: "Categories",
    href: "/categories",
    icon: FolderTree,
  },
  {
    title: "Featured Categories",
    href: "/featured-categories",
    icon: Star,
  },
  {
    title: "Brands",
    href: "/brands",
    icon: Tag,
  },
  {
    title: "Showcases",
    href: "/showcases",
    icon: Image,
  },
  {
    title: "Provinces",
    href: "/provinces",
    icon: MapPin,
  },
  {
    title: "Pages",
    href: "/pages",
    icon: Globe,
  },
  {
    title: "Media Library",
    href: "/media",
    icon: ImagePlus,
  },
  {
    title: "Contacts",
    href: "/contacts",
    icon: Mail,
  },
  {
    title: "Chats",
    href: "/chats",
    icon: MessageSquare,
  },
  {
    title: "Users",
    href: "/users",
    icon: Users,
  },
  {
    title: "Activity Logs",
    href: "/activity",
    icon: History,
  },
  {
    title: "Settings",
    href: "/settings",
    icon: Settings,
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r bg-white">
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div className="flex h-16 items-center border-b px-6">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">JR</span>
            </div>
            <span className="font-semibold text-lg">Admin Panel</span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-4">
          <ul className="space-y-1">
            {menuItems.map((item) => {
              const isActive =
                pathname === item.href ||
                (item.href !== "/" && pathname.startsWith(item.href));

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                      isActive
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.title}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Logout */}
        <div className="border-t p-3">
          <button
            onClick={logout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
          >
            <LogOut className="h-4 w-4" />
            ออกจากระบบ
          </button>
        </div>
      </div>
    </aside>
  );
}
