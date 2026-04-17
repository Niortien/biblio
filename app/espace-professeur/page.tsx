"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { BookOpen, ClipboardList, ChevronRight } from "lucide-react";
import { getProfesseurUser, logoutProfesseur } from "@/lib/professeur-auth";
import ProfesseurHeader from "./_components/ProfesseurHeader";
import { useMesClassesQuery, useMesMatieresQuery } from "@/features/professeur/queries/professeur.query";

type ProfUser = { id: string; email: string; firstName: string; lastName: string; role: string };

export default function EspaceProfesseurPage() {
  const router = useRouter();
  const [user, setUser] = useState<ProfUser | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("professeur_token");
    if (!token) { router.replace("/espace-professeur/login"); return; }
    const u = getProfesseurUser();
    if (u) setUser(u);
  }, [router]);

  const { data: classes = [], isLoading: loadingClasses } = useMesClassesQuery({ enabled: !!user });
  const { data: matieres = [], isLoading: loadingMatieres } = useMesMatieresQuery({ enabled: !!user });

  const handleLogout = () => { logoutProfesseur(); router.push("/espace-professeur/login"); };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <ProfesseurHeader
        firstName={user.firstName}
        lastName={user.lastName}
        email={user.email}
        onLogout={handleLogout}
      />

      <main className="pt-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

          {/* Welcome */}
          <div>
            <h1 className="text-2xl font-bold">Bonjour, Pr. {user.lastName} 👋</h1>
            <p className="text-muted-foreground text-sm mt-1">
              Vous enseignez dans {classes.length} classe(s) et {matieres.length} matière(s).
            </p>
          </div>

          {/* Quick actions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link
              href="/espace-professeur/notes"
              className="flex items-center gap-4 p-5 rounded-xl border border-border bg-card hover:bg-muted/60 transition-colors group"
            >
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center group-hover:bg-blue-500/20 transition-colors">
                <ClipboardList className="w-6 h-6 text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-foreground">Gérer les notes</p>
                <p className="text-xs text-muted-foreground mt-0.5">Saisir, modifier, valider</p>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
            </Link>

            <div className="flex items-center gap-4 p-5 rounded-xl border border-border bg-card">
              <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="font-semibold text-foreground">{matieres.length} matière(s)</p>
                <p className="text-xs text-muted-foreground mt-0.5">Dans vos classes assignées</p>
              </div>
            </div>
          </div>

          {/* Mes classes */}
          <section>
            <h2 className="text-lg font-semibold mb-4">Mes classes</h2>
            {loadingClasses ? (
              <div className="flex items-center gap-2 text-muted-foreground text-sm">
                <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                Chargement...
              </div>
            ) : classes.length === 0 ? (
              <div className="rounded-xl border border-dashed border-border p-8 text-center text-muted-foreground text-sm">
                Aucune classe ne vous a encore été assignée. Contactez l&apos;administration.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {classes.map((cl) => (
                  <div key={`${cl.filiereId}-${cl.niveauId}`} className="rounded-xl border border-border bg-card p-4 space-y-1">
                    <p className="font-semibold text-foreground">
                      {cl.filiere?.name ?? cl.filiereId}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Niveau : {cl.niveau?.name ?? cl.niveauId}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {cl.matieres?.length ?? 0} matière(s) enseignée(s)
                    </p>
                    {cl.filiere?.code && (
                      <span className="inline-block text-xs bg-blue-500/10 text-blue-600 rounded-full px-2 py-0.5">
                        {cl.filiere.code}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Mes matières */}
          <section>
            <h2 className="text-lg font-semibold mb-4">Mes matières</h2>
            {loadingMatieres ? (
              <div className="flex items-center gap-2 text-muted-foreground text-sm">
                <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                Chargement...
              </div>
            ) : matieres.length === 0 ? (
              <div className="rounded-xl border border-dashed border-border p-8 text-center text-muted-foreground text-sm">
                Aucune matière trouvée.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {matieres.map((m) => (
                  <Link
                    key={m.id}
                    href={`/espace-professeur/notes?matiereId=${m.id}`}
                    className="flex items-center gap-3 rounded-xl border border-border bg-card p-4 hover:bg-muted/60 transition-colors group"
                  >
                    <div className="w-9 h-9 rounded-lg bg-blue-500/10 flex items-center justify-center shrink-0">
                      <BookOpen className="w-4 h-4 text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground text-sm truncate">{m.name}</p>
                      <p className="text-xs text-muted-foreground truncate">
                        {m.filiere?.name} · {m.niveau?.name} · Coeff. {m.coefficient}
                      </p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0 group-hover:translate-x-1 transition-transform" />
                  </Link>
                ))}
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}
