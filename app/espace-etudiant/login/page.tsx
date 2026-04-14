"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { BookOpen, Eye, EyeOff, Lock, Mail, GraduationCap, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import toast from "react-hot-toast";

export default function EtudiantLoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      toast.error("Veuillez remplir tous les champs");
      return;
    }
    setIsLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email, password: form.password }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body?.message ?? "Identifiants incorrects");
      }
      const data = await res.json();

      // Vérifier que c'est bien un étudiant
      if (data.user?.role !== "etudiant") {
        throw new Error("Accès réservé aux étudiants");
      }

      localStorage.setItem("etudiant_token", data.access_token);
      if (data.refresh_token) {
        localStorage.setItem("etudiant_refresh_token", data.refresh_token);
      }
      localStorage.setItem("etudiant_user", JSON.stringify(data.user));
      toast.success(`Bienvenue ${data.user.firstName} !`);
      router.push("/espace-etudiant");
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Erreur de connexion");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-linear-to-br from-primary/5 via-background to-secondary/5 px-4">
      <div className="w-full max-w-sm space-y-6">
        {/* Retour */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour au site
        </Link>

        {/* Logo */}
        <div className="flex flex-col items-center gap-2 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg">
            <GraduationCap className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Espace Étudiant</h1>
          <p className="text-muted-foreground text-sm">
            Connectez-vous pour accéder à vos ressources
          </p>
        </div>

        <Card className="shadow-md">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Connexion</CardTitle>
            <CardDescription>Entrez vos identifiants étudiants</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    autoComplete="email"
                    placeholder="etudiant@exemple.com"
                    className="pl-9"
                    value={form.email}
                    onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="password">Mot de passe</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    placeholder="••••••••"
                    className="pl-9 pr-9"
                    value={form.password}
                    onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Connexion..." : "Se connecter"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <p className="text-center text-sm text-muted-foreground">
          Pas encore de compte ?{" "}
          <Link href="/espace-etudiant/inscription" className="text-primary hover:underline font-medium">
            S&apos;inscrire
          </Link>
        </p>
      </div>
    </main>
  );
}
