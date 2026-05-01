import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ArrowRight } from "lucide-react";

export const Route = createFileRoute("/courses")({
  head: () => ({
    meta: [
      { title: "Courses — RoTech Academy" },
      { name: "description", content: "Browse the full curriculum: distributed systems, ML, cloud, and full-stack engineering." },
    ],
  }),
  component: CoursesPage,
});

type Course = {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  level: string;
  duration_hours: number;
  price: number;
};

function CoursesPage() {
  const [courses, setCourses] = useState<Course[] | null>(null);

  useEffect(() => {
    supabase
      .from("courses")
      .select("id,title,slug,description,level,duration_hours,price")
      .eq("is_published", true)
      .order("created_at", { ascending: true })
      .then(({ data }) => setCourses(data ?? []));
  }, []);

  return (
    <section className="mx-auto max-w-7xl px-6 py-24">
      <p className="text-xs font-semibold uppercase tracking-widest text-beam">Curriculum</p>
      <h1 className="mt-3 max-w-3xl font-display text-5xl font-bold tracking-tight md:text-6xl">
        Choose your pathway.
      </h1>
      <p className="mt-5 max-w-xl text-muted-foreground">
        Every track is mentor-reviewed, project-led, and built to ship into production.
      </p>

      <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {(courses ?? Array.from({ length: 4 })).map((c, i) =>
          c ? (
            <Link
              key={(c as Course).id}
              to="/courses/$slug"
              params={{ slug: (c as Course).slug }}
              className="group flex flex-col rounded-3xl border border-border bg-surface p-8 transition hover:border-beam/40 hover:bg-surface-2"
            >
              <div className="font-display text-xs font-bold uppercase tracking-widest text-beam">
                {(c as Course).level}
              </div>
              <h3 className="mt-3 font-display text-xl font-semibold">{(c as Course).title}</h3>
              <p className="mt-3 line-clamp-3 flex-1 text-sm text-muted-foreground">
                {(c as Course).description}
              </p>
              <div className="mt-8 flex items-center justify-between border-t border-border pt-5 text-sm">
                <span className="text-muted-foreground">{(c as Course).duration_hours}h</span>
                <span className="font-display font-semibold text-foreground">
                  ₦{Number((c as Course).price).toLocaleString()}
                </span>
              </div>
              <div className="mt-4 flex items-center gap-2 text-sm text-beam">
                View pathway <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-1" />
              </div>
            </Link>
          ) : (
            <div key={i} className="h-72 animate-pulse rounded-3xl border border-border bg-surface/50" />
          ),
        )}
      </div>
    </section>
  );
}
