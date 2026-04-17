"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, LogOut, Menu, X, GraduationCap, ClipboardList } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  firstName: string;
  lastName: string;
  email: string;
  onLogout: () => void;
}

export default function ProfesseurHeader({ firstName, lastName, email, onLogout }: Props) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const initials = `${firstName?.charAt(0) ?? ""}${lastName?.charAt(0) ?? ""}`.toUpperCase();

  const navLinks = [
    { href: "/espace-professeur", label: "Mes classes", icon: BookOpen },
    { href: "/espace-professeur/notes", label: "Gestion des notes", icon: ClipboardList },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-card/80 backdrop-blur-xl border-b border-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link href="/espace-professeur" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-linear-to-br from-blue-600 to-blue-500 flex items-center justify-center shadow-lg shadow-blue-500/30 group-hover:scale-105 transition-transform">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <div className="hidden sm:block">
              <p className="text-sm font-bold text-foreground leading-none">Espace Professeur</p>
              <p className="text-xs text-muted-foreground">Biblio UPB</p>
            </div>
          </Link>

          {/* Nav desktop */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  pathname === href
                    ? "bg-blue-500/10 text-blue-600"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </Link>
            ))}
          </nav>

          {/* User + logout */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-blue-500/20 text-blue-700 flex items-center justify-center text-xs font-bold">
                {initials}
              </div>
              <div className="hidden lg:block text-right">
                <p className="text-xs font-semibold text-foreground leading-none">{firstName} {lastName}</p>
                <p className="text-xs text-muted-foreground">{email}</p>
              </div>
            </div>
            <Button size="sm" variant="ghost" onClick={onLogout} className="text-muted-foreground hover:text-destructive">
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline ml-1">Déconnexion</span>
            </Button>
            {/* Mobile menu toggle */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile nav */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-border py-2">
            {navLinks.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-lg mx-1 transition-colors ${
                  pathname === href
                    ? "bg-blue-500/10 text-blue-600"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </header>
  );
}
