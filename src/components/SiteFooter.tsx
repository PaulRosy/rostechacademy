import { Link } from "@tanstack/react-router";
import { MessageCircle, Mail, Linkedin, Youtube } from "lucide-react";
import { CONTACT } from "@/lib/contact";

export function SiteFooter() {
  return (
    <footer className="border-t border-border/60 bg-background">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-12 md:grid-cols-4">
          <div className="md:col-span-2">
            <Link to="/" className="font-display text-xl font-bold tracking-tight">
              ROTECH<span className="text-beam">.</span>
            </Link>
            <p className="mt-4 max-w-sm text-sm text-muted-foreground">
              Architecting the next wave of African software engineering through project-led mastery.
            </p>
          </div>
          <div>
            <h4 className="mb-4 text-xs font-semibold uppercase tracking-widest text-muted-foreground">Platform</h4>
            <ul className="space-y-3 text-sm">
              <li><Link to="/courses" className="hover:text-beam">Courses</Link></li>
              <li><Link to="/about" className="hover:text-beam">About</Link></li>
              <li><Link to="/contact" className="hover:text-beam">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="mb-4 text-xs font-semibold uppercase tracking-widest text-muted-foreground">Connect</h4>
            <ul className="space-y-3 text-sm">
              <li><a href={CONTACT.whatsapp} target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-beam"><MessageCircle className="h-4 w-4" />WhatsApp</a></li>
              <li><a href={`mailto:${CONTACT.email}`} className="flex items-center gap-2 hover:text-beam"><Mail className="h-4 w-4" />Email</a></li>
              <li><a href={CONTACT.linkedin} target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-beam"><Linkedin className="h-4 w-4" />LinkedIn</a></li>
              <li><a href={CONTACT.youtube} target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-beam"><Youtube className="h-4 w-4" />YouTube</a></li>
            </ul>
          </div>
        </div>
        <div className="mt-12 border-t border-border/60 pt-6 text-xs text-muted-foreground">
          © {new Date().getFullYear()} RoTech Academy. All rights reserved.
        </div>
      </div>
    </footer>
  );
}