import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { BookOpen, Award, Clock } from "lucide-react";

export const Route = createFileRoute("/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard — RoTech Academy" }] }),
  component: Dashboard,
});

type Enrollment = {
  id: string;
  progress: number;
  completed_at: string | null;
  course: { title: string; slug: string; duration_hours: number; level: string } | null;
};

function Dashboard() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [enrollments, setEnrollments] = useState<Enrollment[] | null>(null);

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/auth", search: { mode: "login" } });
  }, [loading, user, navigate]);

  useEffect(() => {
    if (!user) return;
    supabase
      .from("enrollments")
      .select("id, progress, completed_at, course:courses(title, slug, duration_hours, level)")
      .eq("user_id", user.id)
      .order("enrolled_at", { ascending: false })
      .then(({ data }) => setEnrollments((data as unknown as Enrollment[]) ?? []));
  }, [user]);

  if (loading || !user) return null;

  const completed = enrollments?.filter((e) => e.completed_at).length ?? 0;
  const inProgress = enrollments?.filter((e) => !e.completed_at).length ?? 0;

  return (
    <section className="mx-auto max-w-7xl px-6 py-16">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-beam">Your dashboard</p>
          <h1 className="mt-2 font-display text-4xl font-bold tracking-tight md:text-5xl">
            Welcome back.
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">{user.email}</p>
        </div>
        <Link to="/courses">
          <Button variant="outline" className="rounded-full">Browse more courses</Button>
        </Link>
      </div>

      <div className="mt-10 grid gap-px overflow-hidden rounded-2xl border border-border bg-border md:grid-cols-3">
        {[
          { icon: BookOpen, k: enrollments?.length ?? 0, v: "Enrolled" },
          { icon: Clock, k: inProgress, v: "In progress" },
          { icon: Award, k: completed, v: "Completed" },
        ].map((s) => (
          <div key={s.v} className="flex items-center gap-4 bg-surface p-6">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-beam/30 bg-beam/10 text-beam">
              <s.icon className="h-5 w-5" />
            </div>
            <div>
              <div className="font-display text-2xl font-bold">{s.k}</div>
              <div className="text-xs uppercase tracking-widest text-muted-foreground">{s.v}</div>
            </div>
          </div>
        ))}
      </div>

      <h2 className="mt-14 font-display text-2xl font-bold">My courses</h2>
      <div className="mt-6 space-y-4">
        {enrollments === null && (
          <div className="h-32 animate-pulse rounded-2xl border border-border bg-surface/50" />
        )}
        {enrollments?.length === 0 && (
          <div className="rounded-2xl border border-border bg-surface p-10 text-center">
            <p className="text-muted-foreground">You haven't enrolled in a course yet.</p>
            <Link to="/courses" className="mt-4 inline-block">
              <Button className="gradient-beam text-primary-foreground glow-beam rounded-full">
                Explore courses
              </Button>
            </Link>
          </div>
        )}
        {enrollments?.map((e) => (
          <div key={e.id} className="rounded-2xl border border-border bg-surface p-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex-1">
                <div className="font-display text-xs font-bold uppercase tracking-widest text-beam">
                  {e.course?.level}
                </div>
                <h3 className="mt-1 font-display text-lg font-semibold">{e.course?.title}</h3>
                <div className="mt-3 flex items-center gap-3 text-xs text-muted-foreground">
                  <span>{e.course?.duration_hours}h</span>
                  <span>•</span>
                  <span>{e.progress}% complete</span>
                  {e.completed_at && <span className="text-beam">✓ Completed</span>}
                </div>
                <Progress value={e.progress} className="mt-3 h-1.5" />
              </div>
              {e.course && (
                <Link to="/courses/$slug" params={{ slug: e.course.slug }}>
                  <Button size="sm" variant="outline" className="rounded-full">Continue</Button>
                </Link>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
