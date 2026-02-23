"use client";

import { Zap, Flame, Trophy, School, Globe, DollarSign } from "lucide-react";
import { TabsRoot, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

interface LeaderEntry {
  id: string;
  display_name: string;
  profile_tag: string;
  profile_tag_emoji: string;
  total_xp: number;
  current_level: number;
  current_streak: number;
  bank_balance: number;
}

interface LeaderboardClientProps {
  leaders: LeaderEntry[];
  schoolLeaders: LeaderEntry[];
  currentUserId: string;
  schoolDomain: string | null;
}

function Podium({ leaders }: { leaders: LeaderEntry[] }) {
  if (leaders.length < 3) return null;

  return (
    <div className="flex items-end justify-center gap-3 pb-4">
      {/* 2nd */}
      <div className="flex flex-col items-center">
        <span className="text-3xl">{leaders[1].profile_tag_emoji}</span>
        <div className="mt-2 flex h-20 w-20 flex-col items-center justify-center rounded-2xl border border-gray-200 bg-gray-50">
          <span className="text-lg font-black text-gray-400">2</span>
          <span className="text-xs text-gray-500">
            {leaders[1].total_xp} XP
          </span>
        </div>
        <p className="mt-1 max-w-[80px] truncate text-xs font-medium text-gray-900">
          {leaders[1].display_name}
        </p>
      </div>
      {/* 1st */}
      <div className="flex flex-col items-center">
        <span className="text-4xl">{leaders[0].profile_tag_emoji}</span>
        <div className="mt-2 flex h-28 w-24 flex-col items-center justify-center rounded-2xl border border-kpp-yellow-dark/20 bg-kpp-yellow/10 shadow-[0_0_20px_rgba(234,179,8,0.15)]">
          <span className="text-2xl font-black text-kpp-yellow-dark">1</span>
          <span className="text-xs text-kpp-yellow-dark">
            {leaders[0].total_xp} XP
          </span>
        </div>
        <p className="mt-1 max-w-[96px] truncate text-xs font-bold text-gray-900">
          {leaders[0].display_name}
        </p>
      </div>
      {/* 3rd */}
      <div className="flex flex-col items-center">
        <span className="text-3xl">{leaders[2].profile_tag_emoji}</span>
        <div className="mt-2 flex h-16 w-20 flex-col items-center justify-center rounded-2xl border border-kpp-orange/20 bg-kpp-orange/5">
          <span className="text-lg font-black text-kpp-orange">3</span>
          <span className="text-xs text-kpp-orange">
            {leaders[2].total_xp} XP
          </span>
        </div>
        <p className="mt-1 max-w-[80px] truncate text-xs font-medium text-gray-900">
          {leaders[2].display_name}
        </p>
      </div>
    </div>
  );
}

function LeaderList({
  leaders,
  currentUserId,
}: {
  leaders: LeaderEntry[];
  currentUserId: string;
}) {
  if (!leaders || leaders.length === 0) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center">
        <Trophy className="mx-auto h-10 w-10 text-gray-300" />
        <p className="mt-3 text-sm text-gray-500">
          No one on the leaderboard yet. Be the first!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-1.5">
      {leaders.map((entry, index) => {
        const isCurrentUser = entry.id === currentUserId;
        return (
          <div
            key={entry.id}
            className={`flex items-center gap-3 rounded-2xl border p-3.5 ${
              isCurrentUser
                ? "border-kpp-yellow-dark/20 bg-kpp-yellow/5 shadow-sm"
                : "border-gray-200/60 bg-white shadow-sm"
            }`}
          >
            <span
              className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                index === 0
                  ? "bg-kpp-yellow/20 text-kpp-yellow-dark"
                  : index === 2
                  ? "bg-kpp-orange/15 text-kpp-orange"
                  : "bg-gray-100 text-gray-500"
              }`}
            >
              {index + 1}
            </span>
            <span className="text-xl">{entry.profile_tag_emoji}</span>
            <div className="flex-1 min-w-0">
              <p className="truncate text-sm font-semibold text-gray-900">
                {entry.display_name}
                {isCurrentUser && (
                  <span className="ml-1.5 text-xs text-kpp-yellow-dark">
                    (You)
                  </span>
                )}
              </p>
              <p className="text-xs text-gray-500">
                {entry.profile_tag} &middot; Lvl {entry.current_level}
              </p>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-1 text-sm font-bold text-gray-900">
                <Zap className="h-3.5 w-3.5 text-kpp-yellow-dark" />
                {entry.total_xp.toLocaleString()}
              </div>
              <div className="flex items-center justify-end gap-1 text-xs text-emerald-600">
                <DollarSign className="h-3 w-3" />
                {Number(entry.bank_balance).toLocaleString("en-NZ", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
              </div>
              {entry.current_streak > 0 && (
                <div className="flex items-center gap-1 text-xs text-kpp-orange">
                  <Flame className="h-3 w-3" />
                  {entry.current_streak}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function LeaderboardClient({
  leaders,
  schoolLeaders,
  currentUserId,
  schoolDomain,
}: LeaderboardClientProps) {
  return (
    <TabsRoot defaultValue="global">
      <TabsList className="w-full grid grid-cols-2">
        <TabsTrigger value="global" className="flex items-center gap-1.5">
          <Globe className="h-4 w-4" />
          Global
        </TabsTrigger>
        <TabsTrigger value="school" className="flex items-center gap-1.5">
          <School className="h-4 w-4" />
          My School
        </TabsTrigger>
      </TabsList>

      <TabsContent value="global" className="space-y-6">
        <Podium leaders={leaders} />
        <LeaderList leaders={leaders} currentUserId={currentUserId} />
      </TabsContent>

      <TabsContent value="school" className="space-y-6">
        {!schoolDomain ? (
          <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center">
            <School className="mx-auto h-10 w-10 text-gray-300" />
            <p className="mt-3 text-sm font-semibold text-gray-900">
              School leaderboard unavailable
            </p>
            <p className="mt-1 text-sm text-gray-500">
              Sign up with your school email to see how you rank against your classmates.
            </p>
          </div>
        ) : (
          <>
            <p className="text-sm text-gray-500">
              Showing learners from <span className="font-bold text-gray-900">@{schoolDomain}</span>
            </p>
            <Podium leaders={schoolLeaders} />
            <LeaderList leaders={schoolLeaders} currentUserId={currentUserId} />
          </>
        )}
      </TabsContent>
    </TabsRoot>
  );
}
