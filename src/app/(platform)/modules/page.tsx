import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { ModulesPageClient } from "@/components/modules/modules-page-client";

export default async function ModulesPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("stream")
    .eq("id", user.id)
    .single();

  const { data: modules } = await supabase
    .from("modules")
    .select("*")
    .eq("is_published", true)
    .order("module_order");

  const { data: moduleProgress } = await supabase
    .from("user_module_progress")
    .select("*")
    .eq("user_id", user.id);

  const progressMap: Record<string, (typeof moduleProgress extends (infer T)[] | null ? T : never)> = {};
  (moduleProgress || []).forEach((p) => {
    progressMap[p.module_id] = p;
  });

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
          Modules
        </h1>
        <p className="mt-1 text-gray-500">
          Your personalised learning path. Start with the recommended ones.
        </p>
      </div>

      <ModulesPageClient
        modules={modules || []}
        progressMap={progressMap}
        userStream={profile?.stream || "unsure"}
      />
    </div>
  );
}
