"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Building2,
  Bell,
  Settings,
  Shield,
  FolderOpen,
} from "lucide-react";

import { motion } from "framer-motion";
import { useAuth } from "@/app/context/AuthContext";

export default function BottomNav() {
  const pathname = usePathname();
  const { isAdmin } = useAuth();

  const userItems = [
    { href: "/dashboard", icon: LayoutDashboard, label: "Home" },
    { href: "/dashboard/properties", icon: Building2, label: "Properties" },
    { href: "/dashboard/notifications", icon: Bell, label: "Alerts" },
    { href: "/dashboard/settings", icon: Settings, label: "Account" },
  ];

  const adminItems = [
    { href: "/dashboard", icon: LayoutDashboard, label: "Home" },
    { href: "/admin", icon: Shield, label: "Admin" },
    { href: "/admin/projects", icon: FolderOpen, label: "Projects" },
    { href: "/admin/properties", icon: Building2, label: "Properties" },
    { href: "/dashboard/notifications", icon: Bell, label: "Alerts" },
    { href: "/dashboard/settings", icon: Settings, label: "Account" },
  ];

  const items = isAdmin ? adminItems : userItems;

  const isActive = (href) =>
    pathname === href ||
    (href !== "/dashboard" && href !== "/admin" && pathname.startsWith(href));

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-100 shadow-[0_-4px_20px_rgba(0,0,0,0.06)]">
      <div className="flex items-center justify-around px-2 py-2 safe-area-pb">
        {items.map(({ href, icon: Icon, label }) => {
          const active = isActive(href);
          return (
            <Link key={href} href={href} className="flex-1">
              <div
                className={`flex flex-col items-center gap-0.5 py-1.5 px-1 rounded-xl transition-all
                ${active ? "text-[#004835]" : "text-gray-400"}`}
              >
                <div className="relative">
                  {active && (
                    <motion.div
                      layoutId="bottom-nav-pill"
                      className="absolute inset-0 -m-1.5 bg-[#004835]/10 rounded-xl"
                    />
                  )}
                  <Icon
                    size={20}
                    className="relative z-10"
                    strokeWidth={active ? 2.5 : 1.8}
                  />
                </div>
                <span
                  className={`text-[10px] font-semibold leading-none ${
                    active ? "text-[#004835]" : "text-gray-400"
                  }`}
                >
                  {label}
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
