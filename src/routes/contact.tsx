import { createFileRoute } from "@tanstack/react-router";
import { MessageCircle, Mail, Linkedin, Youtube, ArrowUpRight } from "lucide-react";
import { CONTACT } from "@/lib/contact";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — RoTech Academy" },
      { name: "description", content: "Reach the RoTech Academy lecturer on WhatsApp, email, LinkedIn, or YouTube." },
    ],
  }),
  component: ContactPage,
});

const channels = [
  { icon: MessageCircle, label: "WhatsApp", desc: "Fastest response. Usually within an hour.", href: CONTACT.whatsapp },
  { icon: Mail, label: "Email", desc: "For detailed enquiries and partnerships.", href: `mailto:${CONTACT.email}` },
  { icon: Linkedin, label: "LinkedIn", desc: "Connect professionally with the lecturer.", href: CONTACT.linkedin },
  { icon: Youtube, label: "YouTube", desc: "Free lessons, demos, and walkthroughs.", href: CONTACT.youtube },
];

function ContactPage() {
  return (
    <section className="mx-auto max-w-5xl px-6 py-24">
      <p className="text-xs font-semibold uppercase tracking-widest text-beam">Contact</p>
      <h1 className="mt-3 font-display text-5xl font-bold tracking-tight md:text-6xl">
        Talk to the lecturer.
      </h1>
      <p className="mt-5 max-w-xl text-lg text-muted-foreground">
        Pick the channel that fits. We answer every question, including the early ones.
      </p>

      <div className="mt-12 grid gap-6 md:grid-cols-2">
        {channels.map((c) => (
          <a
            key={c.label}
            href={c.href}
            target="_blank"
            rel="noreferrer"
            className="group flex items-start gap-5 rounded-2xl border border-border bg-surface p-6 transition hover:border-beam/40 hover:bg-surface-2"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-beam/30 bg-beam/10 text-beam">
              <c.icon className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h3 className="font-display text-lg font-semibold">{c.label}</h3>
                <ArrowUpRight className="h-4 w-4 text-muted-foreground transition group-hover:text-beam" />
              </div>
              <p className="mt-1 text-sm text-muted-foreground">{c.desc}</p>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
