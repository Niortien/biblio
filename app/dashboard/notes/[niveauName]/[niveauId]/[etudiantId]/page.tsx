"use client";

import { useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft, ChevronRight, Plus, ClipboardList,
  CheckCircle2, Clock, AlertCircle, XCircle, BookOpen,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose,
} from "@/components/ui/dialog";
import toast from "react-hot-toast";

import { useNiveauxQuery } from "@/features/niveaux/queries/niveau.query";
import { useFilieresQuery } from "@/features/filieres/queries/filiere.query";
import { useMatieresQuery } from "@/features/matieres/queries/matiere.query";
import { useUsersQuery } from "@/features/users/queries/user.query";
import { useNotesQuery } from "@/features/notes/queries/note.query";
import {
  useCreerNoteMutation,
  useModifierNoteMutation,
  useSaisirSessionMutation,
} from "@/features/notes/mutations/note.mutation";
import {
  NoteEtudiant,
  STATUT_NOTE_LABELS,
  STATUT_NOTE_COLORS,
  StatutNote,
  NoteCreateDTO,
  NoteUpdateDTO,
  SaisirSessionDTO,
} from "@/features/notes/types/note.type";

// ─── Constants ────────────────────────────────────────────────────────────────

const CURRENT_YEAR = "2025-2026";
const YEARS = ["2025-2026", "2024-2025", "2023-2024"];

const STATUT_ICONS: Record<StatutNote, React.ElementType> = {
  en_cours:   Clock,
  valide:     CheckCircle2,
  en_session: AlertCircle,
  ajourne:    XCircle,
};

function fmt(n: number | null | undefined) {
  if (n == null) return "—";
  return Number(n).toFixed(2);
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function EtudiantNotesPage() {
  const router    = useRouter();
  const params    = useParams();
  const niveauName  = decodeURIComponent(params.niveauName as string);
  const niveauId    = params.niveauId as string;
  const etudiantId  = params.etudiantId as string;

  const [annee, setAnnee] = useState(CURRENT_YEAR);

  // Dialogs
  const [addDialog,   setAddDialog]   = useState(false);
  const [addForm,     setAddForm]     = useState<Partial<NoteCreateDTO>>({});
  const [editNote,    setEditNote]    = useState<NoteEtudiant | null>(null);
  const [editForm,    setEditForm]    = useState<NoteUpdateDTO>({});
  const [sessionNote, setSessionNote] = useState<NoteEtudiant | null>(null);
  const [sessionVal,  setSessionVal]  = useState("");

  // ── Data ──────────────────────────────────────────────────────────────────
  const { data: allNiveaux } = useNiveauxQuery();
  const { data: filieres }   = useFilieresQuery();
  const { data: users }      = useUsersQuery();
  const { data: matieres }   = useMatieresQuery({ niveauId });

  const niveau   = (allNiveaux ?? []).find(n => n.id === niveauId);
  const filiere  = (filieres ?? []).find(f => f.id === niveau?.filiereId);
  const etudiant = (users ?? []).find(u => u.id === etudiantId);

  const matieresFiltrees = useMemo(
    () => (matieres ?? []).filter(m => !m.isModule),
    [matieres],
  );

  const { data: notes, isLoading: notesLoad } = useNotesQuery(
    { anneeAcademique: annee, etudiantId },
    { enabled: !!etudiantId },
  );

  // Map matiereId → note
  const notesMap = useMemo(() => {
    const m = new Map<string, NoteEtudiant>();
    (notes ?? []).forEach(n => m.set(n.matiereId, n));
    return m;
  }, [notes]);

  // Matieres that don't yet have a note this year
  const matieresAvecNote    = matieresFiltrees.filter(m => notesMap.has(m.id));
  const matieresSansNote    = matieresFiltrees.filter(m => !notesMap.has(m.id));

  // ── Mutations ────────────────────────────────────────────────────────────
  const creerMutation    = useCreerNoteMutation();
  const modifierMutation = useModifierNoteMutation();
  const sessionMutation  = useSaisirSessionMutation();

  const openAdd = () => {
    setAddForm({ anneeAcademique: annee, etudiantId });
    setAddDialog(true);
  };

  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <div className="space-y-6">

      {/* Breadcrumb + header */}
      <div className="flex items-start gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.push(`/dashboard/notes/${encodeURIComponent(niveauName)}/${niveauId}`)}
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>

        <div className="flex-1">
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground mb-0.5 flex-wrap">
            <span className="cursor-pointer hover:underline" onClick={() => router.push("/dashboard/notes")}>
              Notes
            </span>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="cursor-pointer hover:underline" onClick={() => router.push(`/dashboard/notes/${encodeURIComponent(niveauName)}`)}>
              {niveauName}
            </span>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="cursor-pointer hover:underline" onClick={() => router.push(`/dashboard/notes/${encodeURIComponent(niveauName)}/${niveauId}`)}>
              {filiere?.name ?? "…"}
            </span>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-foreground font-medium">
              {etudiant ? `${etudiant.firstName} ${etudiant.lastName}` : "…"}
            </span>
          </div>
          <h1 className="text-2xl font-bold">
            {etudiant ? `${etudiant.firstName} ${etudiant.lastName}` : "…"}
          </h1>
          <p className="text-muted-foreground text-sm mt-0.5">
            {filiere?.name ?? ""} — {niveauName} — {annee}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Select value={annee} onValueChange={setAnnee}>
            <SelectTrigger className="w-36"><SelectValue /></SelectTrigger>
            <SelectContent>
              {YEARS.map(y => <SelectItem key={y} value={y}>{y}</SelectItem>)}
            </SelectContent>
          </Select>
          <Button onClick={openAdd} className="gap-2" disabled={matieresSansNote.length === 0}>
            <Plus className="w-4 h-4" />
            Ajouter une note
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Matieres",  value: matieresFiltrees.length,                                        color: "text-foreground" },
          { label: "Saisies",   value: matieresAvecNote.length,                                        color: "text-blue-600" },
          { label: "Validees",  value: (notes ?? []).filter(n => n.statut === "valide").length,        color: "text-green-600" },
          { label: "Session",   value: (notes ?? []).filter(n => n.statut === "en_session").length,    color: "text-orange-600" },
        ].map(s => (
          <div key={s.label} className="p-4 rounded-xl border bg-card text-center">
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Notes list */}
      {notesLoad ? (
        <div className="space-y-2">
          {[1, 2, 3].map(i => <div key={i} className="h-20 rounded-xl bg-muted animate-pulse" />)}
        </div>
      ) : matieresFiltrees.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 rounded-xl border border-dashed border-border bg-muted/20 text-center">
          <BookOpen className="w-10 h-10 text-muted-foreground mb-3" />
          <p className="font-medium">Aucune matiere configuree pour ce niveau</p>
        </div>
      ) : (
        <div className="rounded-xl border overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-muted/50 border-b border-border">
                <th className="px-5 py-3 text-left font-semibold text-muted-foreground">Matiere</th>
                <th className="px-4 py-3 text-center font-semibold text-muted-foreground">Coeff.</th>
                <th className="px-4 py-3 text-center font-semibold text-muted-foreground">Moy. Classe</th>
                <th className="px-4 py-3 text-center font-semibold text-muted-foreground">Moy. Examen</th>
                <th className="px-4 py-3 text-center font-semibold text-muted-foreground">Moy. Matiere</th>
                <th className="px-4 py-3 text-center font-semibold text-muted-foreground">Session</th>
                <th className="px-4 py-3 text-center font-semibold text-muted-foreground">Statut</th>
                <th className="px-5 py-3 text-right font-semibold text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {matieresFiltrees.map(matiere => {
                const note = notesMap.get(matiere.id);
                return (
                  <tr key={matiere.id} className="border-b border-border last:border-0 hover:bg-muted/20 transition-colors">
                    <td className="px-5 py-3 font-medium">{matiere.name}</td>
                    <td className="px-4 py-3 text-center text-muted-foreground">{matiere.coefficient}</td>
                    <td className="px-4 py-3 text-center font-mono">{fmt(note?.moyenneClasse)}</td>
                    <td className="px-4 py-3 text-center font-mono">{fmt(note?.moyenneExamen)}</td>
                    <td className="px-4 py-3 text-center font-mono font-bold">{fmt(note?.moyenneMatiere)}</td>
                    <td className="px-4 py-3 text-center font-mono">{fmt(note?.moyenneSession)}</td>
                    <td className="px-4 py-3 text-center">
                      {note ? (
                        (() => {
                          const Icon = STATUT_ICONS[note.statut];
                          return (
                            <Badge className={`gap-1 text-xs ${STATUT_NOTE_COLORS[note.statut]}`}>
                              <Icon className="w-3 h-3" />
                              {STATUT_NOTE_LABELS[note.statut]}
                            </Badge>
                          );
                        })()
                      ) : (
                        <span className="text-xs text-muted-foreground">Non saisi</span>
                      )}
                    </td>
                    <td className="px-5 py-3 text-right">
                      <div className="flex justify-end gap-1">
                        {!note ? (
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-8 text-xs gap-1"
                            onClick={() => {
                              setAddForm({ anneeAcademique: annee, etudiantId, matiereId: matiere.id });
                              setAddDialog(true);
                            }}
                          >
                            <Plus className="w-3 h-3" /> Saisir
                          </Button>
                        ) : (
                          <>
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-8 text-xs"
                              onClick={() => {
                                setEditForm({
                                  moyenneClasse: note.moyenneClasse ?? undefined,
                                  moyenneExamen: note.moyenneExamen ?? undefined,
                                });
                                setEditNote(note);
                              }}
                            >
                              Modifier
                            </Button>
                            {note.statut === "en_session" && (
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-8 text-xs text-orange-600 border-orange-200 hover:bg-orange-50"
                                onClick={() => {
                                  setSessionVal(note.moyenneSession != null ? String(note.moyenneSession) : "");
                                  setSessionNote(note);
                                }}
                              >
                                Session
                              </Button>
                            )}
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* ── Dialog : Ajouter note ─────────────────────────────────────────── */}
      <Dialog open={addDialog} onOpenChange={o => { if (!o) { setAddDialog(false); setAddForm({ anneeAcademique: annee, etudiantId }); } }}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ClipboardList className="w-5 h-5 text-primary" />
              Saisir une note
            </DialogTitle>
            {etudiant && (
              <p className="text-sm text-muted-foreground">
                {etudiant.firstName} {etudiant.lastName}
              </p>
            )}
          </DialogHeader>

          <div className="grid gap-4 py-2">
            {/* Matiere select — only matieres without a note yet */}
            <div className="grid gap-1.5">
              <Label>Matiere <span className="text-destructive">*</span></Label>
              <Select
                value={addForm.matiereId ?? "__none"}
                onValueChange={v => setAddForm(f => ({ ...f, matiereId: v === "__none" ? undefined : v }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selectionner une matiere…" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__none">Choisir…</SelectItem>
                  {matieresSansNote.map(m => (
                    <SelectItem key={m.id} value={m.id}>
                      {m.name} (coeff {m.coefficient})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <NoteInputFields form={addForm} setForm={setAddForm} />
          </div>

          <DialogFooter>
            <DialogClose asChild><Button variant="outline">Annuler</Button></DialogClose>
            <Button
              onClick={() =>
                creerMutation.mutate(addForm as NoteCreateDTO, {
                  onSuccess: () => { setAddDialog(false); setAddForm({ anneeAcademique: annee, etudiantId }); toast.success("Note saisie"); },
                  onError:   e => toast.error(e.message || "Erreur"),
                })
              }
              disabled={creerMutation.isPending || !addForm.matiereId}
            >
              {creerMutation.isPending ? "Enregistrement…" : "Enregistrer"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Dialog : Modifier note ────────────────────────────────────────── */}
      <Dialog open={!!editNote} onOpenChange={o => !o && setEditNote(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Modifier la note</DialogTitle>
            {editNote && (
              <p className="text-sm text-muted-foreground">
                {matieresFiltrees.find(m => m.id === editNote.matiereId)?.name ?? ""}
              </p>
            )}
          </DialogHeader>
          <NoteInputFields form={editForm} setForm={setEditForm} />
          <DialogFooter>
            <DialogClose asChild><Button variant="outline">Annuler</Button></DialogClose>
            <Button
              onClick={() =>
                editNote && modifierMutation.mutate(
                  { id: editNote.id, data: editForm },
                  {
                    onSuccess: () => { setEditNote(null); toast.success("Note mise a jour"); },
                    onError:   e => toast.error(e.message || "Erreur"),
                  },
                )
              }
              disabled={modifierMutation.isPending}
            >
              {modifierMutation.isPending ? "Mise a jour…" : "Enregistrer"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Dialog : Session ─────────────────────────────────────────────── */}
      <Dialog open={!!sessionNote} onOpenChange={o => !o && setSessionNote(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Note de session</DialogTitle>
            {sessionNote && (
              <p className="text-sm text-muted-foreground">
                {matieresFiltrees.find(m => m.id === sessionNote.matiereId)?.name ?? ""}
              </p>
            )}
          </DialogHeader>
          <div className="grid gap-1.5 py-2">
            <Label>Note de session (/20)</Label>
            <Input
              type="number" min="0" max="20" step="0.25"
              value={sessionVal}
              onChange={e => setSessionVal(e.target.value)}
              placeholder="ex: 11.5"
            />
            <p className="text-xs text-muted-foreground">
              &ge; 10 &rarr; Valide, &lt; 10 &rarr; Ajourne
            </p>
          </div>
          <DialogFooter>
            <DialogClose asChild><Button variant="outline">Annuler</Button></DialogClose>
            <Button
              onClick={() =>
                sessionNote && sessionMutation.mutate(
                  { id: sessionNote.id, data: { moyenneSession: parseFloat(sessionVal) } as SaisirSessionDTO },
                  {
                    onSuccess: () => { setSessionNote(null); toast.success("Note de session enregistree"); },
                    onError:   e => toast.error(e.message || "Erreur"),
                  },
                )
              }
              disabled={sessionMutation.isPending || !sessionVal}
            >
              {sessionMutation.isPending ? "Enregistrement…" : "Valider"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ─── Shared note input fields ─────────────────────────────────────────────────

function NoteInputFields({
  form,
  setForm,
}: {
  form: Partial<NoteCreateDTO | NoteUpdateDTO>;
  setForm: (fn: (prev: Partial<NoteCreateDTO | NoteUpdateDTO>) => Partial<NoteCreateDTO | NoteUpdateDTO>) => void;
}) {
  const mc = (form as Record<string, number | undefined>).moyenneClasse;
  const me = (form as Record<string, number | undefined>).moyenneExamen;
  const preview = mc != null && me != null ? (mc * 0.4 + me * 0.6).toFixed(2) : null;

  return (
    <>
      <div className="grid grid-cols-2 gap-3">
        <div className="grid gap-1.5">
          <Label>
            Moy. Classe /20{" "}
            <span className="text-muted-foreground text-xs font-normal">&times; 0.4</span>
          </Label>
          <Input
            type="number" min="0" max="20" step="0.25"
            value={mc ?? ""}
            onChange={e => setForm(f => ({ ...f, moyenneClasse: e.target.value ? parseFloat(e.target.value) : undefined }))}
            placeholder="0 – 20"
          />
        </div>
        <div className="grid gap-1.5">
          <Label>
            Moy. Examen /20{" "}
            <span className="text-muted-foreground text-xs font-normal">&times; 0.6</span>
          </Label>
          <Input
            type="number" min="0" max="20" step="0.25"
            value={me ?? ""}
            onChange={e => setForm(f => ({ ...f, moyenneExamen: e.target.value ? parseFloat(e.target.value) : undefined }))}
            placeholder="0 – 20"
          />
        </div>
      </div>
      {preview && (
        <div className={`text-sm text-center font-semibold py-2.5 rounded-lg border ${
          parseFloat(preview) >= 10
            ? "bg-green-50 border-green-200 text-green-700"
            : "bg-orange-50 border-orange-200 text-orange-700"
        }`}>
          Moyenne matiere : {preview}/20{" "}
          {parseFloat(preview) >= 10 ? "— Valide" : "— En session"}
        </div>
      )}
    </>
  );
}
