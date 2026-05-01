import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { BookOpen, GraduationCap, Users, CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/admin/")({
  component: AdminOverview,
});

function AdminOverview() {
  const [stats, setStats] = useState<{ courses: number; published: number; enrollments: number; completed: number } | null>(null);

  useEffect(() => {
    (async () => {
      const [c, p, e, done] = await Promise.all([
        supabase.from("courses").select("id", { count: "exact", head: true }),
        supabase.from("courses").select("id", { count: "exact", head: true }).eq("is_published", true),
        supabase.from("enrollments").select("id", { count: "exact", head: true }),
        supabase.from("enrollments").select("id", { count: "exact", head: true }).not("completed_at", "is", null),
      ]);
      setStats({
        courses: c.count ?? 0,
        published: p.count ?? 0,
        enrollments: e.count ?? 0,
        completed: done.count ?? 0,
      });
    })();
  }, []);

  const cards = [
    { icon: BookOpen, label: "Total courses", value: stats?.courses ?? "—" },
    { icon: GraduationCap, label: "Published", value: stats?.published ?? "—" },
    { icon: Users, label: "Enrollments", value: stats?.enrollments ?? "—" },
    { icon: CheckCircle2, label: "Completions", value: stats?.completed ?? "—" },
  ];

  return (
    <div className="grid gap-px overflow-hidden rounded-2xl border border-border bg-border md:grid-cols-4">
      {cards.map((c) => (
        <div key={c.label} className="flex items-center gap-4 bg-surface p-6">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-beam/30 bg-beam/10 text-beam">
            <c.icon className="h-5 w-5" />
          </div>
          <div>
            <div className="font-display text-2xl font-bold">{c.value}</div>
            <div className="text-xs uppercase tracking-widest text-muted-foreground">{c.label}</div>
          </div>
        </div>
      ))}
    </div>
  );
}