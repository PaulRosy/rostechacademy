import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";

export const Route = createFileRoute("/admin/enrollments")({
  component: AdminEnrollments;
});

type Row = {
  id: string;
  user_id: string;
  progress: number;
  enrolled_at: string;
  completed_at: string | null;
  course: { title: string; slug: string } | null;
  student: { full_name: string | null } | null;
};

function AdminEnrollments() {
  const [rows, setRows] = useState<Row[] | null>(null);
  const [q, setQ] = useState("");

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("enrollments")
        .select("id, user_id, progress, enrolled_at, completed_at, course:courses(title, slug), student:profiles(full_name)")
        .order("enrolled_at", { ascending: false });
      setRows((data as unknown as Row[]) ?? []);
    })();
  }, []);

  const filtered = useMemo(() => {
    if (!rows) return null;
    const term = q.trim().toLowerCase();
    if (!term) return rows;
    return rows.filter((r) =>
      (r.student?.full_name ?? "").toLowerCase().includes(term) ||
      (r.course?.title ?? "").toLowerCase().includes(term)
    );
  }, [rows, q]);

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-display text-xl font-bold">Enrollments & progress</h2>
        <Input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search student or course…"
          className="max-w-xs"
        />
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl border border-border">
        <div className="grid grid-cols-[1.5fr_1.5fr_1fr_1fr_1fr] gap-4 border-b border-border bg-surface/60 px-4 py-3 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
          <div>Student</div>
          <div>Course</div>
          <div>Progress</div>
          <div>Enrolled</div>
          <div>Status</div>
        </div>
        {filtered === null && <div className="p-10 text-center text-muted-foreground">Loading…</div>}
        {filtered?.length === 0 && <div className="p-10 text-center text-muted-foreground">No enrollments yet.</div>}
        {filtered?.map((r) => (
          <div key={r.id} className="grid grid-cols-[1.5fr_1.5fr_1fr_1fr_1fr] items-center gap-4 border-b border-border bg-surface px-4 py-4 last:border-b-0">
            <div className="min-w-0">
              <div className="truncate font-medium">{r.student?.full_name ?? "Unnamed student"}</div>
              <div className="truncate text-xs text-muted-foreground">{r.user_id.slice(0, 8)}…</div>
            </div>
            <div className="min-w-0 truncate">{r.course?.title ?? "—"}</div>
            <div>
              <Progress value={r.progress} className="h-1.5" />
              <div className="mt-1 text-xs text-muted-foreground">{r.progress}%</div>
            </div>
            <div className="text-xs text-muted-foreground">
              {new Date(r.enrolled_at).toLocaleDateString()}
            </div>
            <div>
              {r.completed_at ? (
                <span className="rounded-full bg-beam/15 px-2 py-1 text-[10px] font-semibold uppercase tracking-widest text-beam">
                  Completed
                </span>
              ) : (
                <span className="rounded-full bg-muted px-2 py-1 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                  In progress
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}