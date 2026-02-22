import { SupabaseClient } from "@supabase/supabase-js";

export interface StreakDay {
  date: string;
  dayLabel: string;
  active: boolean;
  isToday: boolean;
}

export async function getStreakCalendarData(
  supabase: SupabaseClient,
  userId: string,
  days: number = 14
): Promise<{ streakDays: StreakDay[]; hasActivityToday: boolean }> {
  const today = new Date();
  const dates: string[] = [];

  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    dates.push(d.toISOString().split("T")[0]);
  }

  const { data: history } = await supabase
    .from("streak_history")
    .select("activity_date")
    .eq("user_id", userId)
    .in("activity_date", dates);

  const activeDates = new Set((history || []).map((h) => h.activity_date));
  const todayStr = today.toISOString().split("T")[0];

  const dayNames = ["S", "M", "T", "W", "T", "F", "S"];

  const streakDays: StreakDay[] = dates.map((date) => {
    const d = new Date(date + "T12:00:00");
    return {
      date,
      dayLabel: dayNames[d.getDay()],
      active: activeDates.has(date),
      isToday: date === todayStr,
    };
  });

  return {
    streakDays,
    hasActivityToday: activeDates.has(todayStr),
  };
}
