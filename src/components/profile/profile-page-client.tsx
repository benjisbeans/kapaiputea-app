"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  Zap,
  Flame,
  BookOpen,
  Trophy,
  TrendingUp,
  Calendar,
  Medal,
  Pencil,
  X,
  Check,
  ChevronDown,
  Plus,
  DollarSign,
} from "lucide-react";
import {
  LEVEL_NAMES,
  STREAM_LABELS,
  STREAM_EMOJIS,
  PATHWAY_OPTIONS,
  GOAL_OPTIONS,
  AVATAR_EMOJIS,
} from "@/lib/constants";
import { ShareButton } from "@/components/sharing/share-button";
import type { Profile, Badge, UserBadge } from "@/types/database";

/* ── animation ── */
const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 14 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: "easeOut" as const },
  },
};

/* ── animated counter ── */
function useCounter(end: number, duration = 1200) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (end === 0) return;
    const start = performance.now();
    let raf: number;
    function tick(now: number) {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setCount(Math.round(eased * end));
      if (t < 1) raf = requestAnimationFrame(tick);
    }
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [end, duration]);
  return count;
}

/* ── types ── */
interface Props {
  profile: Profile;
  earnedBadges: (UserBadge & { badge: Badge })[];
  allBadges: Badge[];
  levelProgress: number;
  nextLevelXp: number;
}

const CARD = "rounded-3xl border border-gray-200/60 bg-white shadow-sm";

const rarityBgs: Record<string, string> = {
  common: "bg-gray-100",
  uncommon: "bg-green-50",
  rare: "bg-blue-50",
  epic: "bg-purple-50",
  legendary: "bg-yellow-50",
};

const CONFIDENCE_EMOJIS = ["😰", "😕", "😐", "😊", "🤑"];

export function ProfilePageClient({
  profile: initialProfile,
  earnedBadges,
  allBadges,
  levelProgress,
  nextLevelXp,
}: Props) {
  const [profile, setProfile] = useState(initialProfile);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showGoalPicker, setShowGoalPicker] = useState(false);

  // Edit form state
  const [editForm, setEditForm] = useState({
    display_name: profile.display_name,
    stream: profile.stream,
    profile_tag: profile.profile_tag,
    year_group: profile.year_group,
    has_part_time_job: profile.has_part_time_job,
    financial_confidence: profile.financial_confidence || 3,
    goals: [...(profile.goals || [])],
    profile_tag_emoji: profile.profile_tag_emoji,
  });

  const startEditing = () => {
    setEditForm({
      display_name: profile.display_name,
      stream: profile.stream,
      profile_tag: profile.profile_tag,
      year_group: profile.year_group,
      has_part_time_job: profile.has_part_time_job,
      financial_confidence: profile.financial_confidence || 3,
      goals: [...(profile.goals || [])],
      profile_tag_emoji: profile.profile_tag_emoji,
    });
    setEditing(true);
  };

  const cancelEditing = () => {
    setEditing(false);
    setShowEmojiPicker(false);
    setShowGoalPicker(false);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          display_name: editForm.display_name,
          stream: editForm.stream,
          profile_tag: editForm.profile_tag,
          year_group: editForm.year_group,
          has_part_time_job: editForm.has_part_time_job,
          financial_confidence: editForm.financial_confidence,
          goals: editForm.goals,
          profile_tag_emoji: editForm.profile_tag_emoji,
        }),
      });
      if (res.ok) {
        const { profile: updated } = await res.json();
        setProfile(updated);
        setEditing(false);
        setShowEmojiPicker(false);
        setShowGoalPicker(false);
      }
    } finally {
      setSaving(false);
    }
  };

  const earnedIds = new Set(earnedBadges.map((b) => b.badge_id));
  const xp = useCounter(profile.total_xp);
  const streak = useCounter(profile.current_streak, 800);
  const lessons = useCounter(profile.lessons_completed, 800);
  const modules = useCounter(profile.modules_completed, 800);
  const bestStreak = useCounter(profile.longest_streak, 800);
  const bank = profile.bank_balance ?? 10000;

  const memberSince = new Date(profile.created_at).toLocaleDateString("en-NZ", {
    month: "short",
    year: "numeric",
  });

  const pathwayOptions = PATHWAY_OPTIONS[editing ? editForm.stream : profile.stream];
  const displayStream = editing ? editForm.stream : profile.stream;
  const displayTag = editing ? editForm.profile_tag : profile.profile_tag;
  const displayEmoji = editing ? editForm.profile_tag_emoji : profile.profile_tag_emoji;
  const displayName = editing ? editForm.display_name : profile.display_name;

  return (
    <motion.div
      className="mx-auto max-w-2xl space-y-6 pb-8"
      variants={stagger}
      initial="hidden"
      animate="show"
    >
      {/* ── Hero Banner ── */}
      <motion.div variants={fadeUp}>
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-kpp-yellow via-kpp-orange to-kpp-pink p-6 pb-8">
          {/* Top buttons */}
          <div className="flex justify-end gap-2">
            <ShareButton
              shareData={{
                title: `${profile.display_name} on Ka Pai Putea`,
                text: `I'm a ${profile.profile_tag} ${profile.profile_tag_emoji} - Level ${profile.current_level} with ${profile.total_xp} XP!`,
                url: `/share?type=profile&level=${profile.current_level}&xp=${profile.total_xp}&emoji=${encodeURIComponent(profile.profile_tag_emoji)}`,
              }}
              variant="inline"
            />
            {!editing ? (
              <button
                onClick={startEditing}
                className="flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1.5 text-sm font-medium text-white backdrop-blur-sm transition-colors hover:bg-white/30"
              >
                <Pencil className="h-3.5 w-3.5" />
                Edit
              </button>
            ) : (
              <button
                onClick={cancelEditing}
                className="flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1.5 text-sm font-medium text-white backdrop-blur-sm transition-colors hover:bg-white/30"
              >
                <X className="h-3.5 w-3.5" />
                Cancel
              </button>
            )}
          </div>

          {/* Profile info */}
          <div className="mt-4 flex items-center gap-5">
            {/* Avatar */}
            <div className="relative">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white/20 text-4xl ring-4 ring-white/30">
                {displayEmoji}
              </div>
              {editing && (
                <button
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full bg-white text-gray-600 shadow-md transition-transform hover:scale-110"
                >
                  <Pencil className="h-3 w-3" />
                </button>
              )}
              {/* Emoji picker */}
              {showEmojiPicker && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowEmojiPicker(false)}
                  />
                  <div className="absolute left-0 top-full z-50 mt-2 grid w-64 grid-cols-7 gap-1 rounded-2xl border border-gray-200 bg-white p-3 shadow-xl">
                    {AVATAR_EMOJIS.map((emoji) => (
                      <button
                        key={emoji}
                        onClick={() => {
                          setEditForm((f) => ({ ...f, profile_tag_emoji: emoji }));
                          setShowEmojiPicker(false);
                        }}
                        className={`flex h-8 w-8 items-center justify-center rounded-lg text-xl transition-colors hover:bg-gray-100 ${
                          editForm.profile_tag_emoji === emoji
                            ? "bg-kpp-yellow/20 ring-2 ring-kpp-yellow-dark"
                            : ""
                        }`}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            <div className="flex-1 min-w-0">
              {editing ? (
                <input
                  type="text"
                  value={editForm.display_name}
                  onChange={(e) =>
                    setEditForm((f) => ({ ...f, display_name: e.target.value }))
                  }
                  maxLength={30}
                  className="w-full rounded-xl border-2 border-white/30 bg-white/10 px-3 py-1.5 text-2xl font-black text-white placeholder-white/50 backdrop-blur-sm outline-none focus:border-white/60"
                />
              ) : (
                <h1 className="truncate text-3xl font-black text-white">
                  {displayName}
                </h1>
              )}
              <span className="mt-1 inline-flex items-center rounded-full bg-white/20 px-2.5 py-0.5 text-xs font-bold text-white backdrop-blur-sm">
                {displayTag}
              </span>
              <p className="mt-1.5 text-sm text-white/80">
                {STREAM_EMOJIS[displayStream]} {STREAM_LABELS[displayStream]}
              </p>
            </div>
          </div>

          {/* Level bar in hero footer */}
          <div className="mt-6">
            <div className="flex items-center justify-between text-xs text-white/70">
              <span className="font-bold text-white">
                Level {profile.current_level} - {LEVEL_NAMES[profile.current_level - 1]}
              </span>
              <span className="tabular-nums">
                {profile.total_xp.toLocaleString()} / {nextLevelXp.toLocaleString()} XP
              </span>
            </div>
            <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-white/20">
              <motion.div
                className="h-full rounded-full bg-white"
                initial={{ width: 0 }}
                animate={{ width: `${levelProgress}%` }}
                transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
              />
            </div>
          </div>
        </div>
      </motion.div>

      {/* ── About Me ── */}
      <motion.div variants={fadeUp}>
        <div className={`${CARD} p-5`}>
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-gray-900">About Me</h3>
            {editing && (
              <div className="flex gap-2">
                <button
                  onClick={cancelEditing}
                  className="rounded-full px-3 py-1 text-sm font-medium text-gray-500 transition-colors hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex items-center gap-1 rounded-full bg-black px-4 py-1 text-sm font-bold text-white transition-transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
                >
                  {saving ? (
                    "Saving..."
                  ) : (
                    <>
                      <Check className="h-3.5 w-3.5" />
                      Save
                    </>
                  )}
                </button>
              </div>
            )}
          </div>

          <div className="mt-4 space-y-4">
            {/* Stream */}
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">Path</span>
              {editing ? (
                <div className="relative">
                  <select
                    value={editForm.stream}
                    onChange={(e) =>
                      setEditForm((f) => ({
                        ...f,
                        stream: e.target.value as Profile["stream"],
                        profile_tag: PATHWAY_OPTIONS[e.target.value]?.options[0] || f.profile_tag,
                      }))
                    }
                    className="appearance-none rounded-xl border border-gray-200 bg-gray-50 py-1.5 pl-3 pr-8 text-sm font-medium text-gray-900 outline-none focus:border-kpp-yellow-dark focus:bg-white"
                  >
                    {Object.entries(STREAM_LABELS).map(([key, label]) => (
                      <option key={key} value={key}>
                        {STREAM_EMOJIS[key]} {label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                </div>
              ) : (
                <span className="text-sm font-bold text-gray-900">
                  {STREAM_EMOJIS[profile.stream]} {STREAM_LABELS[profile.stream]}
                </span>
              )}
            </div>

            {/* Title (profile tag) */}
            {pathwayOptions && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">{pathwayOptions.label}</span>
                {editing ? (
                  <div className="relative">
                    <select
                      value={editForm.profile_tag}
                      onChange={(e) =>
                        setEditForm((f) => ({ ...f, profile_tag: e.target.value }))
                      }
                      className="appearance-none rounded-xl border border-gray-200 bg-gray-50 py-1.5 pl-3 pr-8 text-sm font-medium text-gray-900 outline-none focus:border-kpp-yellow-dark focus:bg-white"
                    >
                      {!pathwayOptions.options.includes(editForm.profile_tag) && (
                        <option value={editForm.profile_tag}>
                          {editForm.profile_tag}
                        </option>
                      )}
                      {pathwayOptions.options.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  </div>
                ) : (
                  <span className="text-sm font-bold text-gray-900">
                    {profile.profile_tag}
                  </span>
                )}
              </div>
            )}

            {/* Year group */}
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">Year</span>
              {editing ? (
                <div className="flex gap-1 rounded-xl bg-gray-100 p-0.5">
                  {[10, 11, 12, 13].map((y) => (
                    <button
                      key={y}
                      onClick={() => setEditForm((f) => ({ ...f, year_group: y }))}
                      className={`rounded-lg px-3.5 py-1 text-sm font-bold transition-all ${
                        editForm.year_group === y
                          ? "bg-white text-gray-900 shadow-sm"
                          : "text-gray-500 hover:text-gray-700"
                      }`}
                    >
                      {y}
                    </button>
                  ))}
                </div>
              ) : (
                <span className="text-sm font-bold text-gray-900">
                  Year {profile.year_group}
                </span>
              )}
            </div>

            {/* Part-time job */}
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">Part-time job</span>
              {editing ? (
                <button
                  onClick={() =>
                    setEditForm((f) => ({
                      ...f,
                      has_part_time_job: !f.has_part_time_job,
                    }))
                  }
                  className={`relative inline-flex h-7 w-12 shrink-0 items-center rounded-full transition-colors ${
                    editForm.has_part_time_job ? "bg-kpp-green" : "bg-gray-300"
                  }`}
                >
                  <span
                    className={`inline-block h-5 w-5 rounded-full bg-white shadow-md transition-transform ${
                      editForm.has_part_time_job
                        ? "translate-x-6"
                        : "translate-x-1"
                    }`}
                  />
                </button>
              ) : (
                <span className="text-sm font-bold text-gray-900">
                  {profile.has_part_time_job ? "Yes" : "No"}
                </span>
              )}
            </div>

            {/* Financial confidence */}
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">Money confidence</span>
              {editing ? (
                <div className="flex gap-1">
                  {CONFIDENCE_EMOJIS.map((emoji, i) => (
                    <button
                      key={i}
                      onClick={() =>
                        setEditForm((f) => ({ ...f, financial_confidence: i + 1 }))
                      }
                      className={`flex h-8 w-8 items-center justify-center rounded-lg text-lg transition-all ${
                        editForm.financial_confidence >= i + 1
                          ? "bg-kpp-yellow/15 scale-110"
                          : "opacity-30 hover:opacity-60"
                      }`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="flex gap-0.5">
                  {CONFIDENCE_EMOJIS.map((emoji, i) => (
                    <span
                      key={i}
                      className={`text-lg ${
                        (profile.financial_confidence || 0) >= i + 1
                          ? ""
                          : "opacity-20"
                      }`}
                    >
                      {emoji}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Goals */}
            <div>
              <span className="text-sm text-gray-500">Goals</span>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {(editing ? editForm.goals : profile.goals || []).map((goal) => (
                  <span
                    key={goal}
                    className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium ${
                      editing
                        ? "bg-kpp-yellow/10 text-kpp-yellow-dark"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {goal}
                    {editing && (
                      <button
                        onClick={() =>
                          setEditForm((f) => ({
                            ...f,
                            goals: f.goals.filter((g) => g !== goal),
                          }))
                        }
                        className="ml-0.5 rounded-full p-0.5 transition-colors hover:bg-kpp-yellow-dark/10"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    )}
                  </span>
                ))}
                {editing && (
                  <div className="relative">
                    <button
                      onClick={() => setShowGoalPicker(!showGoalPicker)}
                      className="inline-flex items-center gap-1 rounded-full border border-dashed border-gray-300 px-3 py-1 text-xs font-medium text-gray-500 transition-colors hover:border-gray-400 hover:text-gray-700"
                    >
                      <Plus className="h-3 w-3" />
                      Add
                    </button>
                    {showGoalPicker && (
                      <>
                        <div
                          className="fixed inset-0 z-40"
                          onClick={() => setShowGoalPicker(false)}
                        />
                        <div className="absolute left-0 top-full z-50 mt-1 w-56 rounded-xl border border-gray-200 bg-white p-2 shadow-xl">
                          {GOAL_OPTIONS.filter(
                            (g) => !editForm.goals.includes(g)
                          ).map((goal) => (
                            <button
                              key={goal}
                              onClick={() => {
                                setEditForm((f) => ({
                                  ...f,
                                  goals: [...f.goals, goal],
                                }));
                                setShowGoalPicker(false);
                              }}
                              className="block w-full rounded-lg px-3 py-1.5 text-left text-sm text-gray-700 transition-colors hover:bg-gray-50"
                            >
                              {goal}
                            </button>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                )}
                {!editing && (!profile.goals || profile.goals.length === 0) && (
                  <span className="text-sm text-gray-400">None set</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ── Stats ── */}
      <motion.div
        variants={fadeUp}
        className="grid grid-cols-3 gap-3"
      >
        {[
          {
            icon: Zap,
            color: "text-kpp-yellow-dark",
            bg: "bg-kpp-yellow/10",
            value: xp.toLocaleString(),
            label: "Total XP",
          },
          {
            icon: Flame,
            color: "text-kpp-orange",
            bg: "bg-kpp-orange/10",
            value: String(streak),
            label: "Day Streak",
          },
          {
            icon: BookOpen,
            color: "text-kpp-blue",
            bg: "bg-kpp-blue/10",
            value: String(lessons),
            label: "Lessons",
          },
          {
            icon: Trophy,
            color: "text-kpp-purple",
            bg: "bg-kpp-purple/10",
            value: String(modules),
            label: "Modules",
          },
          {
            icon: DollarSign,
            color: "text-emerald-600",
            bg: "bg-emerald-100",
            value: `$${bank.toLocaleString("en-NZ", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
            label: "Bank Balance",
          },
          {
            icon: TrendingUp,
            color: "text-kpp-pink",
            bg: "bg-kpp-pink/10",
            value: String(bestStreak),
            label: "Best Streak",
          },
          {
            icon: Calendar,
            color: "text-kpp-green",
            bg: "bg-kpp-green/10",
            value: memberSince,
            label: "Joined",
          },
        ].map((s) => (
          <div key={s.label} className={`${CARD} p-4`}>
            <div className={`inline-flex rounded-lg p-2 ${s.bg}`}>
              <s.icon className={`h-5 w-5 ${s.color}`} />
            </div>
            <p className="mt-3 text-xl font-black tabular-nums text-gray-900">
              {s.value}
            </p>
            <p className="text-xs text-gray-500">{s.label}</p>
          </div>
        ))}
      </motion.div>

      {/* ── Badge Collection ── */}
      <motion.div variants={fadeUp} className={`${CARD} p-5`}>
        <div className="flex items-center justify-between">
          <h3 className="flex items-center gap-2 text-sm font-bold text-gray-900">
            <Medal className="h-4 w-4 text-kpp-yellow-dark" />
            Badge Collection
          </h3>
          <span className="text-xs text-gray-500">
            {earnedBadges.length}/{allBadges.length}
          </span>
        </div>
        <div className="mt-4 grid grid-cols-4 gap-3">
          {allBadges.slice(0, 12).map((badge) => {
            const earned = earnedIds.has(badge.id);
            return (
              <div
                key={badge.id}
                className={`flex flex-col items-center gap-1 rounded-xl p-2 ${
                  earned ? "" : "opacity-25 grayscale"
                }`}
                title={`${badge.name}${earned ? "" : " (Locked)"}`}
              >
                <div
                  className={`flex h-11 w-11 items-center justify-center rounded-xl text-xl ${
                    earned ? rarityBgs[badge.rarity] || "bg-gray-100" : "bg-gray-100"
                  }`}
                >
                  {badge.emoji}
                </div>
                <span className="text-center text-[10px] font-medium text-gray-500">
                  {badge.name}
                </span>
              </div>
            );
          })}
        </div>
        {allBadges.length > 12 && (
          <Link
            href="/achievements"
            className="mt-4 block text-center text-xs font-medium text-gray-500 transition-colors hover:text-kpp-yellow-dark"
          >
            View all achievements &rarr;
          </Link>
        )}
      </motion.div>
    </motion.div>
  );
}
