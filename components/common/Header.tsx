"use client";

import { GraduationCap, Menu, X } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import Link from "next/link";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl gradient-primary flex items-center justify-center shadow-elegant group-hover:shadow-glow transition-shadow duration-300">
              <GraduationCap className="w-5 h-5 md:w-6 md:h-6 text-primary-foreground" />
            </div>
            <div className="hidden sm:block">
              <h1 className="font-display text-lg md:text-xl font-bold text-foreground">
                Espace Documents
              </h1>
              <p className="text-xs text-muted-foreground">Université</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link
              href="/"
              className="text-sm font-medium text-foreground hover:text-primary transition-colors"
            >
              Accueil
            </Link>
            <Link
              href="/#programs"
              className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              Filières
            </Link>
            <Link
              href="/#documents"
              className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              Documents
            </Link>
          </nav>

          {/* CTA Espace Étudiant */}
          <div className="hidden md:block">
            <Button asChild size="sm">
              <Link href="/espace-etudiant/login">
                <GraduationCap className="w-4 h-4 mr-1.5" />
                Espace Étudiant
              </Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </Button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-border animate-fade-in">
            <nav className="flex flex-col gap-4">
              <Link
                href="/"
                className="text-sm font-medium text-foreground hover:text-primary transition-colors px-2 py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Accueil
              </Link>
              <Link
                href="/#programs"
                className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors px-2 py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Filières
              </Link>
              <Link
                href="/#documents"
                className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors px-2 py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Documents
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
