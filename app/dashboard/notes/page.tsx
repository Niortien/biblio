"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { GraduationCap, ChevronRight, Users } from "lucide-react";
import { useNiveauxQuery } from "@/features/niveaux/queries/niveau.query";
import { useUsersQuery } from "@/features/users/queries/user.query";
import { useFilieresQuery } from "@/features/filieres/queries/filiere.query";

const NIVEAU_ORDER = ["Licence 1", "Licence 2", "Licence 3"];

const NIVEAU_COLORS: Record<string, string> = {
  "Licence 1": "bg-blue-50 border-blue-200 hover:bg-blue-100",
  "Licence 2": "bg-purple-50 border-purple-200 hover:bg-purple-100",
  "Licence 3": "bg-emerald-50 border-emerald-200 hover:bg-emerald-100",
};

const NIVEAU_BADGE: Record<string, string> = {
  "Licence 1": "bg-blue-100 text-blue-700",
  "Licence 2": "bg-purple-100 text-purple-700",
  "Licence 3": "bg-emerald-100 text-emerald-700",
};

export default function NotesPage() {
  const router = useRouter();

  const { data: allNiveaux, isLoading: niveauxLoad } = useNiveauxQuery();
  const { data: users,      isLoading: usersLoad }   = useUsersQuery();
  const { data: filieres }                           = useFilieresQuery();

  // suppress unused warning - filieres may be used for future filtering
  void filieres;

  const etudiants  = (users ?? []).filter(u => u.role === "etudiant");
  const niveauxList = allNiveaux ?? [];

  const niveauStats = useMemo(() => {
    const map = new Map<string, { niveauIds: string[]; studentCount: number; filiereCount: number }>();
    for (const n of niveauxList) {
      const students = etudiants.filter(u => u.niveauId === n.id);
      if (students.length === 0) continue;
      if (!map.has(n.name)) map.set(n.name, { niveauIds: [], studentCount: 0, filiereCount: 0 });
      const entry = map.get(n.name)!;
      entry.niveauIds.push(n.id);
      entry.studentCount += students.length;
      entry.filiereCount += 1;
    }
    return map;
  }, [niveauxList, etudiants]);

  const orderedNames = NIVEAU_ORDER.filter(n => niveauStats.has(n));
  const isLoading = niveauxLoad || usersLoad;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Notes &amp; Resultats</h1>
        <p className="text-muted-foreground text-sm mt-0.5">
          Selectionnez un niveau pour commencer la saisie des notes
        </p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-36 rounded-2xl bg-muted animate-pulse" />
          ))}
        </div>
      ) : orderedNames.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 rounded-2xl border border-dashed border-border bg-muted/20 text-center">
          <GraduationCap className="w-12 h-12 text-muted-foreground mb-4" />
          <p className="font-semibold text-lg">Aucun etudiant enregistre</p>
          <p className="text-sm text-muted-foreground mt-1">
            Ajoutez des etudiants pour pouvoir saisir des notes
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {orderedNames.map(name => {
            const stats = niveauStats.get(name)!;
            const colorClass = NIVEAU_COLORS[name] ?? "bg-muted/50 border-border hover:bg-muted";
            const badgeClass = NIVEAU_BADGE[name] ?? "bg-muted text-muted-foreground";

            return (
              <button
                key={name}
                onClick={() => router.push(`/dashboard/notes/${encodeURIComponent(name)}`)}
                className={`group flex flex-col gap-4 p-6 rounded-2xl border-2 transition-all text-left cursor-pointer ${colorClass}`}
              >
                <div className="flex items-start justify-between">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${badgeClass}`}>
                    <GraduationCap className="w-6 h-6" />
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                </div>

                <div>
                  <h2 className="text-xl font-bold">{name}</h2>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    Annee universitaire
                  </p>
                </div>

                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <Users className="w-4 h-4" />
                    <span className="font-semibold text-foreground">{stats.studentCount}</span>&nbsp;etudiant{stats.studentCount > 1 ? "s" : ""}
                  </div>
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <span className="font-semibold text-foreground">{stats.filiereCount}</span>&nbsp;filiere{stats.filiereCount > 1 ? "s" : ""}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}