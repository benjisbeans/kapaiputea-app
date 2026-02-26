import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function DELETE() {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Delete all user data (cascade handles most, but be explicit)
    await supabase.from("xp_transactions").delete().eq("user_id", user.id);
    await supabase.from("user_badges").delete().eq("user_id", user.id);
    await supabase.from("streak_history").delete().eq("user_id", user.id);
    await supabase.from("user_lesson_progress").delete().eq("user_id", user.id);
    await supabase.from("user_module_progress").delete().eq("user_id", user.id);
    await supabase.from("quiz_responses").delete().eq("user_id", user.id);
    await supabase.from("profiles").delete().eq("id", user.id);

    // Delete the auth user using the admin client
    // Note: the user's Supabase auth record is deleted via the
    // ON DELETE CASCADE on profiles -> auth.users, or we sign them out.
    // For a full delete we need the service role key.
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (serviceRoleKey) {
      const { createClient: createAdminClient } = await import(
        "@supabase/supabase-js"
      );
      const adminClient = createAdminClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        serviceRoleKey,
        { auth: { autoRefreshToken: false, persistSession: false } }
      );
      await adminClient.auth.admin.deleteUser(user.id);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Account deletion error:", error);
    return NextResponse.json(
      { error: "Failed to delete account" },
      { status: 500 }
    );
  }
}
