"use client";

import { useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { BookOpen, ChevronRight, Users, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNiveauxQuery } from "@/features/niveaux/queries/niveau.query";
import { useUsersQuery } from "@/features/users/queries/user.query";
import { useFilieresQuery } from "@/features/filieres/queries/filiere.query";

const FILIERE_COLORS = [
  "bg-sky-50 border-sky-200 hover:bg-sky-100",
  "bg-violet-50 border-violet-200 hover:bg-violet-100",
  "bg-amber-50 border-amber-200 hover:bg-amber-100",
  "bg-rose-50 border-rose-200 hover:bg-rose-100",
  "bg-teal-50 border-teal-200 hover:bg-teal-100",
  "bg-orange-50 border-orange-200 hover:bg-orange-100",
  "bg-indigo-50 border-indigo-200 hover:bg-indigo-100",
];

export default function NotesFiliereListPage() {
  const router = useRouter();
  const params = useParams();
  const niveauName = decodeURIComponent(params.niveauName as string);

  const { data: allNiveaux, isLoading: niveauxLoad } = useNiveauxQuery();
  const { data: users,      isLoading: usersLoad }   = useUsersQuery();
  const { data: filieres }                           = useFilieresQuery();

  const filiereMap = useMemo(
    () => new Map((filieres ?? []).map(f => [f.id, f])),
    [filieres],
  );

  const etudiants = (users ?? []).filter(u => u.role === "etudiant");

  /** For this niveau name, get each (niveau, filiere) pair with student count */
  const entries = useMemo(() => {
    return (allNiveaux ?? [])
      .filter(n => n.name === niveauName)
      .map(niveau => {
        const filiere  = filiereMap.get(niveau.filiereId);
        const students = etudiants.filter(u => u.niveauId === niveau.id);
        return { niveau, filiere, studentCount: students.length };
      })
      .filter(e => e.studentCount > 0);
  }, [allNiveaux, niveauName, filiereMap, etudiants]);

  const isLoading = niveauxLoad || usersLoad;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.push("/dashboard/notes")}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-0.5">
            <span
              className="cursor-pointer hover:underline"
              onClick={() => router.push("/dashboard/notes")}
            >
              Notes
            </span>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-foreground font-medium">{niveauName}</span>
          </div>
          <h1 className="text-2xl font-bold text-foreground">Filières — {niveauName}</h1>
          <p className="text-muted-foreground text-sm mt-0.5">
            Sélectionnez une filière pour accéder aux étudiants
          </p>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-32 rounded-2xl bg-muted animate-pulse" />
          ))}
        </div>
      ) : entries.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 rounded-2xl border border-dashed border-border bg-muted/20 text-center">
          <BookOpen className="w-12 h-12 text-muted-foreground mb-4" />
          <p className="font-semibold text-lg">Aucune filière trouvée</p>
          <p className="text-sm text-muted-foreground mt-1">
            Aucun étudiant n&apos;est inscrit en {niveauName}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {entries.map(({ niveau, filiere, studentCount }, idx) => {
            const colorClass = FILIERE_COLORS[idx % FILIERE_COLORS.length];

            return (
              <button
                key={niveau.id}
                onClick={() =>
                  router.push(
                    `/dashboard/notes/${encodeURIComponent(niveauName)}/${niveau.id}`,
                  )
                }
                className={`group flex flex-col gap-4 p-6 rounded-2xl border-2 transition-all text-left cursor-pointer ${colorClass}`}
              >
                <div className="flex items-start justify-between">
                  <div className="w-12 h-12 rounded-xl bg-white/60 flex items-center justify-center">
                    <BookOpen className="w-6 h-6 text-current opacity-70" />
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                </div>

                <div>
                  <h2 className="text-lg font-bold">{filiere?.name ?? "—"}</h2>
                  {filiere?.code && (
                    <p className="text-sm text-muted-foreground">{filiere.code}</p>
                  )}
                </div>

                <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <Users className="w-4 h-4" />
                  <span className="font-semibold text-foreground">{studentCount}</span>
                  étudiant{studentCount > 1 ? "s" : ""}
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
