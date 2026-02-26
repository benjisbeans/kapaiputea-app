"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Settings, LogOut, Moon, Sun, Trash2 } from "lucide-react";
import { useUiStore } from "@/stores/ui-store";

export default function SettingsPage() {
  const router = useRouter();
  const supabase = createClient();
  const { theme, toggleTheme } = useUiStore();
  const [loggingOut, setLoggingOut] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const handleLogout = async () => {
    setLoggingOut(true);
    await supabase.auth.signOut();
    router.push("/login");
  };

  const handleDeleteAccount = async () => {
    setDeleting(true);
    setDeleteError(null);
    try {
      const res = await fetch("/api/account/delete", { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json();
        setDeleteError(data.error || "Something went wrong.");
        setDeleting(false);
        return;
      }
      await supabase.auth.signOut();
      router.push("/login");
    } catch {
      setDeleteError("Something went wrong. Try again.");
      setDeleting(false);
    }
  };

  return (
    <div className="mx-auto max-w-lg space-y-6">
      <div>
        <h1 className="text-2xl font-black text-gray-900">
          <Settings className="mr-2 inline h-6 w-6 text-gray-400" />
          Settings
        </h1>
      </div>

      <div className="space-y-3">
        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          className="flex w-full items-center justify-between rounded-3xl border border-gray-200 bg-white p-4"
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
          className="flex w-full items-center gap-3 rounded-3xl border border-destructive/20 bg-destructive/5 p-4 text-destructive transition-colors hover:bg-destructive/10"
        >
          <LogOut className="h-5 w-5" />
          <span className="font-medium">
            {loggingOut ? "Logging out..." : "Log out"}
          </span>
        </button>
      </div>

      {/* Danger zone */}
      <div className="pt-6">
        <h2 className="mb-3 text-sm font-bold text-gray-400 uppercase tracking-wide">
          Danger Zone
        </h2>

        {deleteError && (
          <div role="alert" className="mb-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {deleteError}
          </div>
        )}

        {!showDeleteConfirm ? (
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="flex w-full items-center gap-3 rounded-3xl border border-red-200 bg-white p-4 text-red-600 transition-colors hover:bg-red-50"
          >
            <Trash2 className="h-5 w-5" />
            <div className="text-left">
              <p className="font-medium">Delete account</p>
              <p className="text-sm text-red-400">
                Permanently delete your account and all data
              </p>
            </div>
          </button>
        ) : (
          <div className="rounded-3xl border border-red-300 bg-red-50 p-5">
            <p className="text-sm font-bold text-red-800">
              Are you sure? This cannot be undone.
            </p>
            <p className="mt-1 text-sm text-red-600">
              All your progress, XP, badges, and data will be permanently deleted.
            </p>
            <div className="mt-4 flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                disabled={deleting}
                className="flex-1 rounded-full border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={deleting}
                className="flex-1 rounded-full bg-red-600 px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-red-700 disabled:opacity-50"
              >
                {deleting ? "Deleting..." : "Yes, delete my account"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
