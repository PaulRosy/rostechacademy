import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Clock, BookOpen, CheckCircle2, ArrowRight } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/courses/$slug")({
  component: CourseDetail,
});

type Course = {
  id: string; title: string; slug: string; description: string | null;
  level: string; duration_hours: number; price: number;
};
type Lesson = { id: string; title: string; type: string; position: number };

function CourseDetail() {
  const { slug } = Route.useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [course, setCourse] = useState<Course | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [enrolled, setEnrolled] = useState(false);
  const [enrolling, setEnrolling] = useState(false);

  useEffect(() => {
    (async () => {
      const { data: c } = await supabase
        .from("courses").select("*").eq("slug", slug).maybeSingle();
      setCourse(c as Course | null);
      if (c) {
        const { data: l } = await supabase
          .from("lessons").select("id,title,type,position")
          .eq("course_id", (c as Course).id).order("position");
        setLessons((l as Lesson[]) ?? []);
        if (user) {
          const { data: e } = await supabase
            .from("enrollments").select("id")
            .eq("user_id", user.id).eq("course_id", (c as Course).id).maybeSingle();
          setEnrolled(!!e);
        }
      }
    })();
  }, [slug, user]);

  const enroll = async () => {
    if (!user) return navigate({ to: "/auth", search: { mode: "signup" } });
    if (!course) return;
    setEnrolling(true);
    const { error } = await supabase
      .from("enrollments").insert({ user_id: user.id, course_id: course.id, progress: 0 });
    setEnrolling(false);
    if (error) return toast.error(error.message);
    setEnrolled(true);
    toast.success("Enrolled! Find this course in your dashboard.");
  };

  if (!course) {
    return <div className="mx-auto max-w-5xl px-6 py-24 text-muted-foreground">Loading…</div>;
  }

  return (
    <section className="mx-auto max-w-5xl px-6 py-20">
      <Link to="/courses" className="text-sm text-muted-foreground hover:text-beam">← All courses</Link>
      <div className="mt-6 grid gap-12 md:grid-cols-[2fr_1fr]">
        <div>
          <div className="font-display text-xs font-bold uppercase tracking-widest text-beam">{course.level}</div>
          <h1 className="mt-3 font-display text-4xl font-bold tracking-tight md:text-5xl">{course.title}</h1>
          <p className="mt-6 text-lg text-muted-foreground">{course.description}</p>

          <h2 className="mt-12 font-display text-xl font-semibold">Curriculum</h2>
          <ol className="mt-4 divide-y divide-border rounded-2xl border border-border bg-surface">
            {lessons.length === 0 && (
              <li className="px-5 py-6 text-sm text-muted-foreground">Lessons will be published soon.</li>
            )}
            {lessons.map((l, i) => (
              <li key={l.id} className="flex items-center gap-4 px-5 py-4 text-sm">
                <span className="font-display text-xs text-muted-foreground">{String(i + 1).padStart(2, "0")}</span>
                <BookOpen className="h-4 w-4 text-beam" />
                <span className="flex-1">{l.title}</span>
                <span className="text-xs uppercase text-muted-foreground">{l.type}</span>
              </li>
            ))}
          </ol>
        </div>

        <aside className="rounded-3xl border border-border bg-surface p-6">
          <div className="font-display text-3xl font-bold">₦{Number(course.price).toLocaleString()}</div>
          <div className="mt-1 text-xs text-muted-foreground">One-time enrollment</div>

          {enrolled ? (
            <Link to="/dashboard" className="mt-6 block">
              <Button className="w-full gradient-beam text-primary-foreground glow-beam">
                Go to dashboard <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          ) : (
            <Button
              onClick={enroll}
              disabled={enrolling}
              className="mt-6 w-full gradient-beam text-primary-foreground glow-beam"
            >
              {enrolling ? "Enrolling…" : user ? "Enroll now" : "Sign up to enroll"}
            </Button>
          )}

          <ul className="mt-6 space-y-3 text-sm text-muted-foreground">
            <li className="flex items-center gap-2"><Clock className="h-4 w-4 text-beam" />{course.duration_hours} hours of content</li>
            <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-beam" />Certificate on completion</li>
            <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-beam" />Mentor reviews</li>
            <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-beam" />Lifetime access</li>
          </ul>
        </aside>
      </div>
    </section>
  );
}
