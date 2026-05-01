import { createFileRoute, Link, Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect } from "react";
import { useIsAdmin } from "@/hooks/useIsAdmin";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { LayoutDashboard, BookOpen, Users, ShieldCheck } from "lucide-react";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Admin — RoTech Academy" }] }),
  component: AdminLayout,
});

function AdminLayout() {
  const { isAdmin, loading, user } = useIsAdmin();
  const navigate = useNavigate();
  const path = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/auth", search: { mode: "login" } });
  }, [loading, user, navigate]);

  const claim = async () => {
    const { data, error } = await supabase.rpc("claim_first_admin");
    if (error) return toast.error(error.message);
    if (data) {
      toast.success("You are now admin. Refreshing…");
      setTimeout(() => window.location.reload(), 600);
    } else {
      toast.error("An admin already exists. Ask one to grant you access.");
    }
  };

  if (loading) return <div className="mx-auto max-w-7xl px-6 py-16 text-muted-foreground">Loading…</div>;

  if (!isAdmin) {
    return (
      <section className="mx-auto max-w-2xl px-6 py-20 text-center">
        <ShieldCheck className="mx-auto h-12 w-12 text-beam" />
        <h1 className="mt-4 font-display text-3xl font-bold">Admin access required</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          You don't have admin privileges. If you're the first user setting up RoTech Academy, claim admin below.
        </p>
        <Button onClick={claim} className="mt-6 gradient-beam text-primary-foreground glow-beam rounded-full">
          Claim first admin
        </Button>
      </section>
    );
  }

  const tabs = [
    { to: "/admin", label: "Overview", icon: LayoutDashboard, exact: true },
    { to: "/admin/courses", label: "Courses", icon: BookOpen },
    { to: "/admin/enrollments", label: "Enrollments", icon: Users },
  ];

  return (
    <section className="mx-auto max-w-7xl px-6 py-12">
      <div className="flex items-end justify-between gap-4 border-b border-border pb-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-beam">Admin</p>
          <h1 className="mt-2 font-display text-3xl font-bold tracking-tight md:text-4xl">Control center</h1>
        </div>
      </div>
      <nav className="mt-6 flex flex-wrap gap-2">
        {tabs.map((t) => {
          const active = t.exact ? path === t.to : path.startsWith(t.to);
          return (
            <Link
              key={t.to}
              to={t.to}
              className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition ${
                active
                  ? "border-beam/50 bg-beam/10 text-beam"
                  : "border-border bg-surface text-muted-foreground hover:text-foreground"
              }`}
            >
              <t.icon className="h-4 w-4" />
              {t.label}
            </Link>
          );
        })}
      </nav>
      <div className="mt-8">
        <Outlet />
      </div>
    </section>
  );
}