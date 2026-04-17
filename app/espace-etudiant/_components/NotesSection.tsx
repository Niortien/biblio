"use client";

import { useState } from "react";
import { GraduationCap, CheckCircle2, Clock, AlertCircle, XCircle, ChevronDown, ChevronUp } from "lucide-react";
import { useBulletinQuery } from "@/features/notes/queries/note.query";
import {
  BulletinEtudiant,
  ResultatModule,
  NoteEtudiant,
  StatutNote,
  STATUT_NOTE_LABELS,
  STATUT_NOTE_COLORS,
} from "@/features/notes/types/note.type";

const CURRENT_YEAR = "2025-2026";

const STATUT_ICONS: Record<StatutNote, React.ElementType> = {
  en_cours:   Clock,
  valide:     CheckCircle2,
  en_session: AlertCircle,
  ajourne:    XCircle,
};

function fmt(n: number | null): string {
  if (n == null) return "-";
  return Number(n).toFixed(2);
}

interface Props {
  userId: string;
  annee?: string;
}

export default function NotesSection({ userId, annee: anneeProp }: Props) {
  const [annee] = useState(anneeProp ?? CURRENT_YEAR);
  const { data: bulletin, isLoading, isError, error } = useBulletinQuery(userId, annee, { enabled: !!userId });
  const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set());

  const toggleModule = (id: string) => {
    setExpandedModules((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-20 rounded-2xl bg-muted animate-pulse" />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center py-10 text-center rounded-2xl border border-dashed border-destructive/40 bg-destructive/5">
        <AlertCircle className="w-8 h-8 text-destructive mb-2" />
        <p className="text-sm font-medium text-destructive">Erreur lors du chargement des notes</p>
        <p className="text-xs text-muted-foreground mt-1">{error instanceof Error ? error.message : "Erreur inconnue"}</p>
      </div>
    );
  }

  if (!bulletin || (bulletin.notesMatiereSimple.length === 0 && bulletin.modulesComplementaires.length === 0)) {
    return (
      <div className="flex flex-col items-center justify-center py-10 text-center rounded-2xl border border-dashed border-border bg-muted/30">
        <GraduationCap className="w-8 h-8 text-muted-foreground mb-2" />
        <p className="text-sm text-muted-foreground">Aucune note disponible pour {annee}</p>
      </div>
    );
  }

  const { notesMatiereSimple, modulesComplementaires, moyenneGenerale } = bulletin;

  return (
    <div className="space-y-4">
      {/* Matières simples */}
      {notesMatiereSimple.map((note) => (
        <NoteCard key={note.id} note={note} />
      ))}

      {/* Modules complémentaires */}
      {modulesComplementaires.map((mod) => (
        <ModuleCard
          key={mod.module.id}
          mod={mod}
          expanded={expandedModules.has(mod.module.id)}
          onToggle={() => toggleModule(mod.module.id)}
        />
      ))}

      {/* Moyenne générale */}
      <div className={`p-5 rounded-2xl border-2 flex items-center justify-between ${
        moyenneGenerale != null && moyenneGenerale >= 10
          ? "bg-green-50 border-green-200"
          : moyenneGenerale != null
            ? "bg-orange-50 border-orange-200"
            : "bg-muted border-border"
      }`}>
        <div>
          <p className="font-semibold text-foreground">Moyenne générale</p>
          <p className="text-xs text-muted-foreground mt-0.5">
            {moyenneGenerale == null
              ? "Bulletin incomplet — certaines notes manquent encore"
              : moyenneGenerale >= 10
                ? "Félicitations ! Année validée"
                : "Année non validée — des rattrapages sont possibles"
            }
          </p>
        </div>
        <p className={`text-3xl font-bold ${
          moyenneGenerale != null && moyenneGenerale >= 10
            ? "text-green-700"
            : moyenneGenerale != null
              ? "text-orange-700"
              : "text-muted-foreground"
        }`}>
          {moyenneGenerale != null ? `${moyenneGenerale.toFixed(2)}/20` : "--"}
        </p>
      </div>
    </div>
  );
}

function NoteCard({ note }: { note: NoteEtudiant }) {
  const statut = note.statut;
  const Icon = STATUT_ICONS[statut];
  const colorClass = STATUT_NOTE_COLORS[statut];
  const noteFinale = note.moyenneSession != null ? note.moyenneSession : note.moyenneMatiere;

  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <div className="flex items-start justify-between gap-3 mb-4">
        <div>
          <p className="font-semibold text-foreground">{note.matiere?.name ?? "Matière"}</p>
          <p className="text-xs text-muted-foreground mt-0.5">Coefficient {note.matiere?.coefficient ?? 1}</p>
        </div>
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${colorClass}`}>
          <Icon className="w-3 h-3" />
          {STATUT_NOTE_LABELS[statut]}
        </span>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <ScoreItem label="Moy. Classe" value={fmt(note.moyenneClasse)} sub="×0.4" />
        <ScoreItem label="Moy. Examen" value={fmt(note.moyenneExamen)} sub="×0.6" />
        <ScoreItem
          label={note.moyenneSession != null ? "Note Session" : "Moy. Matière"}
          value={fmt(noteFinale)}
          highlight
          good={noteFinale != null && noteFinale >= 10}
        />
      </div>

      {/* Barre de progression visuelle */}
      {noteFinale != null && (
        <div className="mt-4">
          <div className="flex justify-between text-xs text-muted-foreground mb-1">
            <span>0</span><span className="font-medium">10 (seuil)</span><span>20</span>
          </div>
          <div className="h-2 rounded-full bg-muted overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${noteFinale >= 10 ? "bg-green-500" : "bg-orange-400"}`}
              style={{ width: `${Math.min(100, (noteFinale / 20) * 100)}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

function ModuleCard({ mod, expanded, onToggle }: {
  mod: ResultatModule;
  expanded: boolean;
  onToggle: () => void;
}) {
  const statut = mod.statut as StatutNote;
  const Icon = STATUT_ICONS[statut];
  const colorClass = STATUT_NOTE_COLORS[statut];

  return (
    <div className="rounded-2xl border-2 border-primary/20 bg-card">
      {/* En-tête module */}
      <button
        type="button"
        className="w-full p-5 flex items-start justify-between gap-3 text-left"
        onClick={onToggle}
      >
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-4 h-4 text-primary shrink-0" />
            <p className="font-semibold text-foreground">{mod.module.name}</p>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5 ml-6">
            Module complémentaire · Coefficient {mod.module.coefficient}
            {mod.moyenneModule != null && ` · Moyenne module : ${mod.moyenneModule.toFixed(2)}/20`}
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${colorClass}`}>
            <Icon className="w-3 h-3" />
            {STATUT_NOTE_LABELS[statut]}
          </span>
          {expanded ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
        </div>
      </button>

      {/* Barre de progression module */}
      {mod.moyenneModule != null && (
        <div className="px-5 pb-3">
          <div className="h-2 rounded-full bg-muted overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${mod.moyenneModule >= 10 ? "bg-green-500" : "bg-orange-400"}`}
              style={{ width: `${Math.min(100, (mod.moyenneModule / 20) * 100)}%` }}
            />
          </div>
        </div>
      )}

      {/* Sous-matières */}
      {expanded && (
        <div className="border-t border-border px-5 pb-5 pt-4 space-y-3">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Sous-matières</p>
          {mod.notes.map((note) => (
            <div key={note.id} className="rounded-xl bg-muted/40 p-4">
              <div className="flex items-center justify-between mb-3">
                <p className="font-medium text-sm">{note.matiere?.name ?? "-"}</p>
                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${STATUT_NOTE_COLORS[note.statut]}`}>
                  {STATUT_NOTE_LABELS[note.statut]}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <ScoreItem label="Moy. Classe" value={fmt(note.moyenneClasse)} sub="×0.4" small />
                <ScoreItem label="Moy. Examen" value={fmt(note.moyenneExamen)} sub="×0.6" small />
                <ScoreItem
                  label={note.moyenneSession != null ? "Session" : "Moy."}
                  value={fmt(note.moyenneSession ?? note.moyenneMatiere)}
                  highlight small
                  good={(note.moyenneSession ?? note.moyenneMatiere) != null && (note.moyenneSession ?? note.moyenneMatiere)! >= 10}
                />
              </div>
            </div>
          ))}
          <p className="text-xs text-muted-foreground pt-1">
            La moyenne du module est calculée par pondération des sous-matières par leur coefficient.
            Même si une sous-matière est en session, le module peut être validé si la moyenne pondérée ≥ 10.
          </p>
        </div>
      )}
    </div>
  );
}

function ScoreItem({ label, value, sub, highlight, good, small }: {
  label: string;
  value: string;
  sub?: string;
  highlight?: boolean;
  good?: boolean;
  small?: boolean;
}) {
  return (
    <div className={`rounded-xl p-3 text-center ${highlight ? (good ? "bg-green-50 border border-green-200" : value === "-" ? "bg-muted border border-border" : "bg-orange-50 border border-orange-200") : "bg-muted/60"}`}>
      <p className={`font-bold ${small ? "text-lg" : "text-xl"} ${highlight ? (good ? "text-green-700" : value === "-" ? "text-muted-foreground" : "text-orange-700") : "text-foreground"}`}>
        {value}
      </p>
      <p className={`text-muted-foreground mt-0.5 ${small ? "text-[10px]" : "text-xs"}`}>{label}</p>
      {sub && <p className="text-[10px] text-muted-foreground">{sub}</p>}
    </div>
  );
}
