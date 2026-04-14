"use client";

import { useState } from "react";
import Link from "next/link";
import { GraduationCap, LogOut, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  firstName: string;
  lastName: string;
  email: string;
  onLogout: () => void;
}

export default function EtudiantHeader({ firstName, lastName, email, onLogout }: Props) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const initials = `${firstName?.charAt(0) ?? ""}${lastName?.charAt(0) ?? ""}`.toUpperCase();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-card/80 backdrop-blur-xl border-b border-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link href="/espace-etudiant" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-linear-to-br from-primary to-primary/80 flex items-center justify-center shadow-lg shadow-primary/30 group-hover:scale-105 transition-transform">
              <GraduationCap className="w-5 h-5 text-primary-foreground" />
            </div>
            <div className="hidden sm:block">
              <p className="text-sm font-bold text-foreground leading-none">Espace Étudiant</p>
              <p className="text-xs text-muted-foreground">Biblio UPB</p>
            </div>
          </Link>

          {/* Desktop */}
          <div className="hidden md:flex items-center gap-3">
            <div className="flex items-center gap-2.5 bg-linear-to-r from-primary/10 to-primary/5 border border-primary/20 rounded-full pl-1.5 pr-4 py-1 animate-fade-in">
              <div className="w-7 h-7 rounded-full bg-linear-to-br from-primary to-primary/80 flex items-center justify-center text-primary-foreground text-xs font-bold shadow shadow-primary/40">
                {initials}
              </div>
              <div className="leading-tight">
                <p className="text-xs font-semibold text-foreground">{firstName} {lastName}</p>
                <p className="text-[10px] text-primary font-semibold uppercase tracking-widest">Étudiant</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onLogout}
              className="gap-2 text-muted-foreground hover:text-destructive hover:bg-destructive/5 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Déconnexion
            </Button>
          </div>

          {/* Mobile toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen((v) => !v)}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-card/95 px-4 py-4 space-y-3 animate-fade-in-up">
          <div className="flex items-center gap-3 bg-primary/8 border border-primary/20 rounded-2xl p-3">
            <div className="w-10 h-10 rounded-full bg-linear-to-br from-primary to-primary/80 flex items-center justify-center text-primary-foreground font-bold shadow shadow-primary/30">
              {initials}
            </div>
            <div>
              <p className="text-sm font-semibold">{firstName} {lastName}</p>
              <p className="text-xs text-muted-foreground">{email}</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onLogout}
            className="gap-2 w-full justify-start text-destructive/80 hover:text-destructive"
          >
            <LogOut className="w-4 h-4" /> Déconnexion
          </Button>
        </div>
      )}
    </header>
  );
}
