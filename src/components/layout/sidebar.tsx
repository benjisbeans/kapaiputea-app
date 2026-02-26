"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  BookOpen,
  Trophy,
  Medal,
  User,
  Gamepad2,
  Settings,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useUiStore } from "@/stores/ui-store";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/modules", label: "Modules", icon: BookOpen },
  { href: "/games", label: "Games", icon: Gamepad2 },
  { href: "/leaderboard", label: "Leaderboard", icon: Trophy },
  { href: "/achievements", label: "Achievements", icon: Medal },
  { href: "/profile", label: "Profile", icon: User },
];

export function Sidebar() {
  const pathname = usePathname();
  const { sidebarOpen, setSidebarOpen } = useUiStore();

  return (
    <>
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/20 md:hidden"
          aria-hidden="true"
          onClick={() => setSidebarOpen(false)}
          onKeyDown={(e) => { if (e.key === "Escape") setSidebarOpen(false); }}
        />
      )}

      <aside
        className={cn(
          "fixed left-0 top-0 z-50 flex h-full w-64 flex-col border-r border-gray-100 bg-gradient-to-b from-white to-gray-50/80 transition-transform duration-300 md:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Logo */}
        <div className="flex h-16 items-center justify-between px-6">
          <Link
            href="/dashboard"
            className="text-lg font-black tracking-tight text-kpp-dark"
          >
            Ka Pai Pūtea
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            aria-label="Close sidebar"
            className="rounded-lg p-1.5 text-gray-400 transition-colors hover:text-gray-700 md:hidden"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Nav */}
        <nav className="mt-2 flex-1 space-y-0.5 px-3">
          {navItems.map((item) => {
            const isActive =
              item.href === "/games"
                ? pathname.startsWith("/games") || pathname.startsWith("/invest") || pathname.startsWith("/hustle")
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all",
                  isActive
                    ? "bg-kpp-yellow/80 text-kpp-dark font-bold border-l-[3px] border-kpp-yellow-dark"
                    : "text-gray-500 hover:bg-gray-100 hover:text-gray-900 border-l-[3px] border-transparent"
                )}
              >
                <item.icon className="h-[18px] w-[18px]" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Settings */}
        <div className="border-t border-gray-100 p-3">
          <Link
            href="/settings"
            onClick={() => setSidebarOpen(false)}
            className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-gray-500 transition-all hover:bg-gray-100 hover:text-gray-900"
          >
            <Settings className="h-[18px] w-[18px]" />
            Settings
          </Link>
        </div>
      </aside>
    </>
  );
}
