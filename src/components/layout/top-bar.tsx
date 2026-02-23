"use client";

import { Menu, Flame, Zap } from "lucide-react";
import Link from "next/link";
import { useUiStore } from "@/stores/ui-store";
import type { Profile } from "@/types/database";

interface TopBarProps {
  profile: Profile | null;
}

export function TopBar({ profile }: TopBarProps) {
  const { toggleSidebar } = useUiStore();

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-gray-100 bg-white/70 px-4 backdrop-blur-md md:px-8">
      <button
        onClick={toggleSidebar}
        className="rounded-lg p-2 text-gray-400 transition-colors hover:text-gray-700 md:hidden"
      >
        <Menu className="h-5 w-5" />
      </button>

      <div className="hidden md:block" />

      {profile && (
        <div className="flex items-center gap-3">
          {profile.current_streak > 0 && (
            <div className="flex items-center gap-1.5 rounded-full bg-kpp-orange/10 px-2.5 py-1 text-sm">
              <Flame className="h-4 w-4 text-kpp-orange" />
              <span className="font-bold text-kpp-orange">
                {profile.current_streak}
              </span>
            </div>
          )}
          <div className="flex items-center gap-1.5 rounded-full bg-kpp-yellow/20 px-2.5 py-1 text-sm">
            <Zap className="h-4 w-4 text-kpp-yellow-dark" />
            <span className="font-bold text-kpp-yellow-dark">
              {profile.total_xp.toLocaleString()}
            </span>
          </div>
          <Link
            href="/profile"
            className="flex h-8 w-8 items-center justify-center rounded-full bg-kpp-yellow text-sm ring-2 ring-kpp-yellow/30 transition-transform hover:scale-105"
          >
            {profile.profile_tag_emoji || "💰"}
          </Link>
        </div>
      )}
    </header>
  );
}
