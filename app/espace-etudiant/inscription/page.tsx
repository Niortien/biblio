"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Lock, Mail, User, GraduationCap, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Link from "next/link";
import toast from "react-hot-toast";
import { useFilieresQuery } from "@/features/filieres/queries/filiere.query";
import { useNiveauxQuery } from "@/features/niveaux/queries/niveau.query";

export default function EtudiantInscriptionPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    filiereId: "",
    niveauId: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { data: filieres } = useFilieresQuery();
  const { data: niveaux } = useNiveauxQuery(
    form.filiereId ? { filiereId: form.filiereId } : undefined
  );
  const filieresList = (filieres ?? []).filter((f) => f.isActive);
  const niveauxList = niveaux ?? [];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.firstName || !form.lastName || !form.email || !form.password) {
      toast.error("Veuillez remplir tous les champs");
      return;
    }
    if (form.password !== form.confirmPassword) {
      toast.error("Les mots de passe ne correspondent pas");
      return;
    }
    if (form.password.length < 6) {
      toast.error("Le mot de passe doit contenir au moins 6 caractères");
      return;
    }
    setIsLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: form.firstName,
          lastName: form.lastName,
          email: form.email,
          password: form.password,
          role: "etudiant",
          ...(form.filiereId && { filiereId: form.filiereId }),
          ...(form.niveauId && { niveauId: form.niveauId }),
        }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body?.message ?? "Erreur lors de l'inscription");
      }
      toast.success("Compte créé avec succès ! Vous pouvez vous connecter.");
      router.push("/espace-etudiant/login");
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Erreur lors de l'inscription");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-linear-to-br from-primary/5 via-background to-secondary/5 px-4 py-10">
      <div className="w-full max-w-md space-y-6">
        {/* Retour */}
        <Link
          href="/espace-etudiant/login"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour à la connexion
        </Link>

        {/* Logo */}
        <div className="flex flex-col items-center gap-2 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg">
            <GraduationCap className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Créer un compte</h1>
          <p className="text-muted-foreground text-sm">
            Rejoignez la plateforme documentaire
          </p>
        </div>

        <Card className="shadow-md">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Inscription</CardTitle>
            <CardDescription>Remplissez le formulaire pour créer votre compte étudiant</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="firstName">Prénom</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="firstName"
                      placeholder="Prénom"
                      className="pl-9"
                      value={form.firstName}
                      onChange={(e) => setForm((f) => ({ ...f, firstName: e.target.value }))}
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="lastName">Nom</Label>
                  <Input
                    id="lastName"
                    placeholder="Nom"
                    value={form.lastName}
                    onChange={(e) => setForm((f) => ({ ...f, lastName: e.target.value }))}
                  />
                </div>
              </div>

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

              {/* Filière */}
              <div className="space-y-1.5">
                <Label>Filière <span className="text-muted-foreground text-xs">(optionnel)</span></Label>
                <Select
                  value={form.filiereId}
                  onValueChange={(v) => setForm((f) => ({ ...f, filiereId: v, niveauId: "" }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Choisir une filière..." />
                  </SelectTrigger>
                  <SelectContent>
                    {filieresList.map((filiere) => (
                      <SelectItem key={filiere.id} value={filiere.id}>
                        {filiere.name} ({filiere.code})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Niveau (visible si filière choisie) */}
              {form.filiereId && (
                <div className="space-y-1.5">
                  <Label>Niveau <span className="text-muted-foreground text-xs">(optionnel)</span></Label>
                  <Select
                    value={form.niveauId}
                    onValueChange={(v) => setForm((f) => ({ ...f, niveauId: v }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Choisir un niveau..." />
                    </SelectTrigger>
                    <SelectContent>
                      {niveauxList.map((niveau) => (
                        <SelectItem key={niveau.id} value={niveau.id}>
                          {niveau.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="space-y-1.5">
                <Label htmlFor="password">Mot de passe</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
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

              <div className="space-y-1.5">
                <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    className="pl-9"
                    value={form.confirmPassword}
                    onChange={(e) => setForm((f) => ({ ...f, confirmPassword: e.target.value }))}
                  />
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Création du compte..." : "Créer mon compte"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <p className="text-center text-sm text-muted-foreground">
          Déjà un compte ?{" "}
          <Link href="/espace-etudiant/login" className="text-primary hover:underline font-medium">
            Se connecter
          </Link>
        </p>
      </div>
    </main>
  );
}
