"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Settings, LogOut, Moon, Sun } from "lucide-react";
import { useUiStore } from "@/stores/ui-store";

export default function SettingsPage() {
  const router = useRouter();
  const supabase = createClient();
  const { theme, toggleTheme } = useUiStore();
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    setLoggingOut(true);
    await supabase.auth.signOut();
    router.push("/login");
  };

  return (
    <div className="mx-auto max-w-lg space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          <Settings className="mr-2 inline h-6 w-6 text-gray-400" />
          Settings
        </h1>
      </div>

      <div className="space-y-3">
        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          className="flex w-full items-center justify-between rounded-2xl border border-gray-200 bg-white p-4"
        >
          <div className="flex items-center gap-3">
            {theme === "dark" ? (
              <Moon className="h-5 w-5 text-kpp-purple" />
            ) : (
              <Sun className="h-5 w-5 text-kpp-yellow" />
            )}
            <div className="text-left">
              <p className="font-medium text-gray-900">Theme</p>
              <p className="text-sm text-gray-500">
                {theme === "dark" ? "Dark mode" : "Light mode"}
              </p>
            </div>
          </div>
          <div className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-500">
            {theme === "dark" ? "Dark" : "Light"}
          </div>
        </button>

        {/* Logout */}
        <button
          onClick={handleLogout}
          disabled={loggingOut}
          className="flex w-full items-center gap-3 rounded-2xl border border-destructive/20 bg-destructive/5 p-4 text-destructive transition-colors hover:bg-destructive/10"
        >
          <LogOut className="h-5 w-5" />
          <span className="font-medium">
            {loggingOut ? "Logging out..." : "Log out"}
          </span>
        </button>
      </div>
    </div>
  );
}
