"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  BookOpen,
  Trophy,
  Medal,
  User,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", label: "Home", icon: LayoutDashboard },
  { href: "/modules", label: "Learn", icon: BookOpen },
  { href: "/leaderboard", label: "Ranks", icon: Trophy },
  { href: "/achievements", label: "Badges", icon: Medal },
  { href: "/profile", label: "Profile", icon: User },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-gray-100 bg-white/80 backdrop-blur-md md:hidden">
      <div className="flex items-center justify-around py-1.5 pb-[max(0.375rem,env(safe-area-inset-bottom))]">
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-0.5 px-3 py-1.5 text-[10px] font-bold transition-colors",
                isActive ? "text-kpp-dark" : "text-gray-400"
              )}
            >
              <item.icon className={cn("h-5 w-5", isActive && "text-kpp-yellow-dark")} />
              <span>{item.label}</span>
              {isActive && (
                <span className="mt-0.5 h-1 w-1 rounded-full bg-kpp-yellow-dark" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
