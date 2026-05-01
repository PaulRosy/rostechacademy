import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowRight, CheckCircle2, Sparkles, Layers, Cpu, Rocket } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import heroBg from "@/assets/hero-bg.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "RoTech Academy — Architect the next wave of software engineering" },
      { name: "description", content: "Subscription-based mastery in distributed systems, ML, and cloud. Built for ambitious African builders." },
    ],
  }),
  component: HomePage,
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

function HomePage() {
  const [courses, setCourses] = useState<Course[]>([]);

  useEffect(() => {
    supabase
      .from("courses")
      .select("id,title,slug,description,level,duration_hours,price")
      .eq("is_published", true)
      .order("created_at", { ascending: true })
      .limit(3)
      .then(({ data }) => setCourses(data ?? []));
  }, []);

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <img
            src={heroBg}
            alt=""
            width={1920}
            height={1280}
            className="h-full w-full object-cover opacity-40 hero-fade-bottom"
          />
          <div className="absolute inset-0 grid-bg opacity-40" />
        </div>
        <div className="mx-auto max-w-7xl px-6 pb-32 pt-24 md:pt-36">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-surface/60 px-3 py-1 text-xs text-muted-foreground backdrop-blur">
            <Sparkles className="h-3 w-3 text-beam" />
            New cohort opening soon
          </div>
          <h1 className="mt-8 max-w-4xl font-display text-5xl font-bold leading-[0.95] tracking-tight md:text-7xl lg:text-[5.5rem]">
            Architecting the <span className="gradient-text">next wave</span> of African software engineering.
          </h1>
          <p className="mt-8 max-w-xl text-lg text-muted-foreground">
            Master distributed systems, AI engineering, and cloud architecture through project-led mastery. Built for the ambitious.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Link to="/auth" search={{ mode: "signup" }}>
              <Button size="lg" className="gradient-beam text-primary-foreground rounded-full px-7 hover:opacity-90 glow-beam">
                Start learning <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link to="/courses">
              <Button size="lg" variant="outline" className="rounded-full border-border bg-surface/40 px-7 backdrop-blur">
                Browse curriculum
              </Button>
            </Link>
          </div>

          <div className="mt-20 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-border bg-border md:grid-cols-4">
            {[
              { k: "4+", v: "Pathways" },
              { k: "120h", v: "Lectures" },
              { k: "1:1", v: "Mentorship" },
              { k: "PDF", v: "Certificates" },
            ].map((s) => (
              <div key={s.v} className="bg-surface px-6 py-6">
                <div className="font-display text-3xl font-bold text-beam">{s.k}</div>
                <div className="mt-1 text-xs uppercase tracking-widest text-muted-foreground">{s.v}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured courses */}
      <section className="border-t border-border/60 py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-beam">Curriculum</p>
              <h2 className="mt-3 font-display text-4xl font-bold md:text-5xl">Featured pathways</h2>
            </div>
            <Link to="/courses" className="hidden text-sm text-muted-foreground hover:text-beam md:block">
              View all →
            </Link>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {courses.map((c, i) => (
              <Link
                key={c.id}
                to="/courses/$slug"
                params={{ slug: c.slug }}
                className="group rounded-3xl border border-border bg-surface p-8 transition hover:border-beam/40 hover:bg-surface-2"
              >
                <div className="mb-6 font-display text-sm font-bold text-beam">
                  {String(i + 1).padStart(2, "0")}. {c.level}
                </div>
                <h3 className="font-display text-xl font-semibold">{c.title}</h3>
                <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-muted-foreground">{c.description}</p>
                <div className="mt-8 flex items-center justify-between text-xs text-muted-foreground">
                  <span>{c.duration_hours}h content</span>
                  <span className="text-beam transition group-hover:translate-x-1">→</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Why */}
      <section className="border-t border-border/60 bg-surface/30 py-24">
        <div className="mx-auto max-w-7xl px-6">
          <h2 className="max-w-2xl font-display text-4xl font-bold tracking-tight md:text-5xl">
            Built for builders, not browsers.
          </h2>
          <div className="mt-16 grid gap-8 md:grid-cols-3">
            {[
              { icon: Layers, title: "Project-led mastery", body: "Every module ends in a deployable artifact. Theory is anchored to working code." },
              { icon: Cpu, title: "Modern stack", body: "From Go and Rust to Next.js and Kubernetes. Tools that survive contact with production." },
              { icon: Rocket, title: "Career velocity", body: "Mentor reviews, hiring intros, and a community of operators across the continent." },
            ].map((f) => (
              <div key={f.title} className="rounded-2xl border border-border bg-surface p-8">
                <div className="mb-6 inline-flex h-11 w-11 items-center justify-center rounded-xl border border-beam/30 bg-beam/10 text-beam">
                  <f.icon className="h-5 w-5" />
                </div>
                <h3 className="font-display text-lg font-semibold">{f.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{f.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-border/60 py-24">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <h2 className="font-display text-4xl font-bold md:text-5xl">Start the cohort that ships.</h2>
          <p className="mx-auto mt-5 max-w-xl text-muted-foreground">
            Join the next intake. Track progress, earn a certificate, and get hands-on review from working engineers.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link to="/auth" search={{ mode: "signup" }}>
              <Button size="lg" className="gradient-beam text-primary-foreground rounded-full px-7 glow-beam">
                Create your account <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link to="/contact">
              <Button size="lg" variant="outline" className="rounded-full px-7">
                Talk to the lecturer
              </Button>
            </Link>
          </div>
          <ul className="mt-10 flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
            {["No credit card required", "Cancel anytime", "Certificate included"].map((t) => (
              <li key={t} className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-beam" /> {t}
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
