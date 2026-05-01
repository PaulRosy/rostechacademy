import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — RoTech Academy" },
      { name: "description", content: "RoTech Academy is a project-led platform training the next generation of African software engineers." },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <section className="mx-auto max-w-4xl px-6 py-24">
      <p className="text-xs font-semibold uppercase tracking-widest text-beam">About</p>
      <h1 className="mt-3 font-display text-5xl font-bold tracking-tight md:text-6xl">
        Engineering education that respects your time.
      </h1>
      <div className="mt-10 space-y-6 text-lg text-muted-foreground">
        <p>
          RoTech Academy was founded by a working lecturer to close a gap: too much theory, too little
          shipped code. Every pathway is sequenced around a real artifact you can show in an interview
          or deploy to production.
        </p>
        <p>
          We focus on the durable skills — distributed systems, machine learning engineering, and cloud
          architecture — and pair them with mentorship from operators who hire for these roles.
        </p>
        <p>
          Whether you're switching into tech or sharpening your edge, RoTech gives you the reps,
          the review, and the proof.
        </p>
      </div>

      <div className="mt-16 grid gap-px overflow-hidden rounded-2xl border border-border bg-border md:grid-cols-3">
        {[
          { k: "Africa-first", v: "Built for the continent's hiring market." },
          { k: "Cohort-based", v: "Ship together, stay accountable." },
          { k: "Always-on mentor", v: "Direct WhatsApp access to the lecturer." },
        ].map((s) => (
          <div key={s.k} className="bg-surface p-8">
            <div className="font-display text-lg font-semibold text-beam">{s.k}</div>
            <p className="mt-2 text-sm text-muted-foreground">{s.v}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
