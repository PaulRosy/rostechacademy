import { Link, useRouterState } from "@tanstack/react-router";
import { useAuth } from "@/contexts/AuthContext";
import { useIsAdmin } from "@/hooks/useIsAdmin";
import { Button } from "@/components/ui/button";

export function SiteHeader() {
  const { user, signOut } = useAuth();
  const { isAdmin } = useIsAdmin();
  const path = useRouterState({ select: (s) => s.location.pathname });

  const navLink = (to: string, label: string) => (
    <Link
      to={to}
      className={`text-sm font-medium transition-colors hover:text-foreground ${
        path === to ? "text-foreground" : "text-muted-foreground"
      }`}
    >
      {label}
    </Link>
  );

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link to="/" className="font-display text-xl font-bold tracking-tight text-foreground">
          ROTECH<span className="text-beam">.</span>
        </Link>
        <nav className="hidden items-center gap-8 md:flex">
          {navLink("/courses", "Courses")}
          {navLink("/about", "About")}
          {navLink("/contact", "Contact")}
          {user && navLink("/dashboard", "Dashboard")}
          {isAdmin && navLink("/admin", "Admin")}
        </nav>
        <div className="flex items-center gap-3">
          {user ? (
            <>
              <Link to="/dashboard" className="hidden md:block">
                <Button variant="ghost" size="sm">My Learning</Button>
              </Link>
              <Button size="sm" onClick={signOut} className="bg-beam text-primary-foreground hover:opacity-90">
                Sign out
              </Button>
            </>
          ) : (
            <>
              <Link to="/auth" search={{ mode: "login" }}>
                <Button variant="ghost" size="sm">Log in</Button>
              </Link>
              <Link to="/auth" search={{ mode: "signup" }}>
                <Button size="sm" className="bg-beam text-primary-foreground hover:opacity-90 rounded-full px-5">
                  Join Cohort
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}