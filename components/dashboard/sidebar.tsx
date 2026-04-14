"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  BookOpen,
  FileText,
  GraduationCap,
  LayoutDashboard,
  Library,
  Layers,
  LogOut,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", label: "Vue d'ensemble", icon: LayoutDashboard, exact: true },
  { href: "/dashboard/documents", label: "Documents", icon: FileText },
  { href: "/dashboard/filieres", label: "Filières", icon: Library },
  { href: "/dashboard/matieres", label: "Matières", icon: BookOpen },
  { href: "/dashboard/niveaux", label: "Niveaux", icon: Layers },
  { href: "/dashboard/etudiants", label: "Étudiants", icon: Users },
];

function parseJwt(token: string): { email?: string; role?: string } | null {
  try {
    const payload = token.split(".")[1];
    return JSON.parse(atob(payload));
  } catch {
    return null;
  }
}

const ROLE_LABELS: Record<string, string> = {
  admin: "Admin",
  etudiant: "Étudiant",
  enseignant: "Enseignant",
};

export function DashboardSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<{ email: string; role: string } | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) {
      const payload = parseJwt(token);
      if (payload?.email) {
        setUser({ email: payload.email, role: payload.role ?? "" });
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    router.push("/login");
  };

  return (
    <aside className="w-64 min-h-screen bg-card border-r border-border flex flex-col">
      {/* Logo */}
      <div className="h-16 flex items-center gap-3 px-6 border-b border-border">
        <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center">
          <GraduationCap className="w-5 h-5 text-primary-foreground" />
        </div>
        <div>
          <p className="text-sm font-bold text-foreground">Biblio UPB</p>
          <p className="text-xs text-muted-foreground">Administration</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = item.exact
            ? pathname === item.href
            : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <Icon className="w-4 h-4 shrink-0" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Utilisateur connecté */}
      <div className="p-4 border-t border-border space-y-3">
        {user && (
          <div className="flex items-center gap-3 px-2 py-2 rounded-lg bg-muted">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
              <span className="text-xs font-bold text-primary uppercase">
                {user.email[0]}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-foreground truncate">{user.email}</p>
              <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-primary/10 text-primary">
                {ROLE_LABELS[user.role] ?? user.role}
              </span>
            </div>
          </div>
        )}
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 w-full text-xs text-muted-foreground hover:text-destructive transition-colors px-2"
        >
          <LogOut className="w-3.5 h-3.5" />
          Se déconnecter
        </button>
        <Link
          href="/"
          className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors px-2"
        >
          ← Retour au site
        </Link>
      </div>
    </aside>
  );
}
