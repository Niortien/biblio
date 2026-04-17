"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Plus, Pencil, Trash2, CheckCircle, ClipboardList } from "lucide-react";
import { getProfesseurUser, logoutProfesseur } from "@/lib/professeur-auth";
import ProfesseurHeader from "../_components/ProfesseurHeader";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import toast from "react-hot-toast";
import { useMesMatieresQuery } from "@/features/professeur/queries/professeur.query";
import { useNotesQuery } from "@/features/notes/queries/note.query";
import {
  useCreerNoteMutation,
  useModifierNoteMutation,
  useSupprimerNoteMutation,
  useSaisirSessionMutation,
} from "@/features/notes/mutations/note.mutation";
import { useUsersQuery } from "@/features/users/queries/user.query";
import { STATUT_NOTE_LABELS, STATUT_NOTE_COLORS, NoteEtudiant } from "@/features/notes/types/note.type";
import { Matiere } from "@/features/matieres/types/matiere.type";

const YEARS = ["2025-2026", "2024-2025", "2023-2024"];

type ProfUser = { id: string; email: string; firstName: string; lastName: string; role: string };

// ---------------- Note form dialog ----------------
interface NoteFormDialogProps {
  open: boolean;
  onClose: () => void;
  matiereId: string;
  anneeAcademique: string;
  etudiantId: string;
  etudiantName: string;
  existingNote: NoteEtudiant | null;
}

function NoteFormDialog({ open, onClose, matiereId, anneeAcademique, etudiantId, etudiantName, existingNote }: NoteFormDialogProps) {
  const [moyenneClasse, setMoyenneClasse] = useState<string>(existingNote?.moyenneClasse?.toString() ?? "");
  const [moyenneExamen, setMoyenneExamen] = useState<string>(existingNote?.moyenneExamen?.toString() ?? "");

  const creer = useCreerNoteMutation();
  const modifier = useModifierNoteMutation();

  useEffect(() => {
    setMoyenneClasse(existingNote?.moyenneClasse?.toString() ?? "");
    setMoyenneExamen(existingNote?.moyenneExamen?.toString() ?? "");
  }, [existingNote, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const mc = moyenneClasse !== "" ? parseFloat(moyenneClasse) : undefined;
    const me = moyenneExamen !== "" ? parseFloat(moyenneExamen) : undefined;

    if ((mc !== undefined && (mc < 0 || mc > 20)) || (me !== undefined && (me < 0 || me > 20))) {
      toast.error("Les notes doivent être entre 0 et 20");
      return;
    }

    try {
      if (existingNote) {
        await modifier.mutateAsync({ id: existingNote.id, data: { moyenneClasse: mc, moyenneExamen: me } });
        toast.success("Note mise à jour");
      } else {
        await creer.mutateAsync({ etudiantId, matiereId, anneeAcademique, moyenneClasse: mc, moyenneExamen: me });
        toast.success("Note créée");
      }
      onClose();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Erreur");
    }
  };

  const isBusy = creer.isPending || modifier.isPending;

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>{existingNote ? "Modifier la note" : "Saisir une note"}</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-muted-foreground -mt-2">
          Étudiant : <span className="font-medium text-foreground">{etudiantName}</span>
        </p>
        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div className="space-y-1.5">
            <Label>Moyenne de classe (/20) — 40%</Label>
            <Input
              type="number"
              min={0}
              max={20}
              step={0.01}
              placeholder="ex: 12.50"
              value={moyenneClasse}
              onChange={(e) => setMoyenneClasse(e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label>Moyenne d&apos;examen (/20) — 60%</Label>
            <Input
              type="number"
              min={0}
              max={20}
              step={0.01}
              placeholder="ex: 14.00"
              value={moyenneExamen}
              onChange={(e) => setMoyenneExamen(e.target.value)}
            />
          </div>
          <div className="flex gap-2 pt-1">
            <Button type="button" variant="outline" className="flex-1" onClick={onClose} disabled={isBusy}>
              Annuler
            </Button>
            <Button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700" disabled={isBusy}>
              {isBusy ? "Enregistrement..." : "Enregistrer"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// ---------------- Session dialog ----------------
interface SessionDialogProps {
  open: boolean;
  onClose: () => void;
  note: NoteEtudiant;
  etudiantName: string;
}

function SessionDialog({ open, onClose, note, etudiantName }: SessionDialogProps) {
  const [moyenneSession, setMoyenneSession] = useState("");
  const saisirSession = useSaisirSessionMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(moyenneSession);
    if (isNaN(val) || val < 0 || val > 20) {
      toast.error("Note entre 0 et 20 requise");
      return;
    }
    try {
      await saisirSession.mutateAsync({ id: note.id, data: { moyenneSession: val } });
      toast.success("Note de session enregistrée");
      onClose();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Erreur");
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Note de session</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-muted-foreground -mt-2">
          Étudiant : <span className="font-medium text-foreground">{etudiantName}</span>
        </p>
        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div className="space-y-1.5">
            <Label>Moyenne de session (/20)</Label>
            <Input
              type="number"
              min={0}
              max={20}
              step={0.01}
              placeholder="ex: 11.00"
              value={moyenneSession}
              onChange={(e) => setMoyenneSession(e.target.value)}
              autoFocus
            />
          </div>
          <div className="flex gap-2 pt-1">
            <Button type="button" variant="outline" className="flex-1" onClick={onClose}>Annuler</Button>
            <Button type="submit" className="flex-1 bg-orange-500 hover:bg-orange-600" disabled={saisirSession.isPending}>
              {saisirSession.isPending ? "Enregistrement..." : "Enregistrer"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// ---------------- Main page ----------------
function NotesPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [user, setUser] = useState<ProfUser | null>(null);
  const [selectedMatiereId, setSelectedMatiereId] = useState<string>(searchParams.get("matiereId") ?? "");
  const [annee, setAnnee] = useState(YEARS[0]);
  const [noteDialog, setNoteDialog] = useState<{ etudiantId: string; etudiantName: string; existing: NoteEtudiant | null } | null>(null);
  const [sessionDialog, setSessionDialog] = useState<{ note: NoteEtudiant; etudiantName: string } | null>(null);
  const supprimer = useSupprimerNoteMutation();

  useEffect(() => {
    const token = localStorage.getItem("professeur_token");
    if (!token) { router.replace("/espace-professeur/login"); return; }
    const u = getProfesseurUser();
    if (u) setUser(u);
  }, [router]);

  const { data: matieres = [], isLoading: loadingMatieres } = useMesMatieresQuery({ enabled: !!user });
  const selectedMatiere: Matiere | undefined = matieres.find((m) => m.id === selectedMatiereId);

  const { data: notes = [], isLoading: loadingNotes } = useNotesQuery(
    { matiereId: selectedMatiereId, anneeAcademique: annee },
    { enabled: !!selectedMatiereId && !!annee },
  );

  const { data: allUsers = [] } = useUsersQuery();
  const etudiants = allUsers.filter(
    (u) =>
      u.role === "etudiant" &&
      u.filiereId === selectedMatiere?.filiereId &&
      u.niveauId === selectedMatiere?.niveauId,
  );

  const getNoteForEtudiant = (etudiantId: string) =>
    notes.find((n) => n.etudiantId === etudiantId) ?? null;

  const handleLogout = () => { logoutProfesseur(); router.push("/espace-professeur/login"); };

  const handleDelete = async (id: string) => {
    if (!confirm("Supprimer cette note ?")) return;
    try {
      await supprimer.mutateAsync(id);
      toast.success("Note supprimée");
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Erreur");
    }
  };

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
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">

          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link href="/espace-professeur" className="hover:text-foreground transition-colors flex items-center gap-1">
              <ArrowLeft className="w-3.5 h-3.5" />
              Espace professeur
            </Link>
            <span>/</span>
            <span className="text-foreground font-medium">Gestion des notes</span>
          </div>

          {/* Header */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
              <ClipboardList className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Gestion des notes</h1>
              <p className="text-muted-foreground text-sm mt-0.5">Sélectionnez une matière pour gérer les notes</p>
            </div>
          </div>

          {/* Filtres */}
          <div className="flex flex-wrap gap-3">
            <div className="flex-1 min-w-48">
              <Select
                value={selectedMatiereId}
                onValueChange={setSelectedMatiereId}
                disabled={loadingMatieres}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choisir une matière…" />
                </SelectTrigger>
                <SelectContent>
                  {matieres.map((m) => (
                    <SelectItem key={m.id} value={m.id}>
                      {m.name} — {m.filiere?.name} / {m.niveau?.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Select value={annee} onValueChange={setAnnee}>
              <SelectTrigger className="w-36">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {YEARS.map((y) => (
                  <SelectItem key={y} value={y}>{y}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Tableau des étudiants + notes */}
          {!selectedMatiereId ? (
            <div className="rounded-xl border border-dashed border-border p-12 text-center text-muted-foreground text-sm">
              Sélectionnez une matière pour afficher les étudiants et leurs notes.
            </div>
          ) : loadingNotes ? (
            <div className="flex items-center gap-2 text-muted-foreground text-sm py-8 justify-center">
              <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
              Chargement...
            </div>
          ) : etudiants.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border p-12 text-center text-muted-foreground text-sm">
              Aucun étudiant inscrit dans cette classe.
            </div>
          ) : (
            <div className="rounded-xl border border-border overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-muted/50 border-b border-border">
                  <tr>
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground">Étudiant</th>
                    <th className="text-center px-4 py-3 font-medium text-muted-foreground">Moy. classe</th>
                    <th className="text-center px-4 py-3 font-medium text-muted-foreground">Moy. examen</th>
                    <th className="text-center px-4 py-3 font-medium text-muted-foreground">Moy. matière</th>
                    <th className="text-center px-4 py-3 font-medium text-muted-foreground">Session</th>
                    <th className="text-center px-4 py-3 font-medium text-muted-foreground">Statut</th>
                    <th className="text-right px-4 py-3 font-medium text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {etudiants.map((etudiant) => {
                    const note = getNoteForEtudiant(etudiant.id);
                    const fullName = `${etudiant.firstName} ${etudiant.lastName}`;
                    return (
                      <tr key={etudiant.id} className="hover:bg-muted/30 transition-colors">
                        <td className="px-4 py-3">
                          <p className="font-medium text-foreground">{fullName}</p>
                          <p className="text-xs text-muted-foreground">{etudiant.email}</p>
                        </td>
                        <td className="px-4 py-3 text-center">
                          {note?.moyenneClasse != null ? (
                            <span className="font-mono font-semibold">{Number(note.moyenneClasse).toFixed(2)}</span>
                          ) : (
                            <span className="text-muted-foreground">—</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-center">
                          {note?.moyenneExamen != null ? (
                            <span className="font-mono font-semibold">{Number(note.moyenneExamen).toFixed(2)}</span>
                          ) : (
                            <span className="text-muted-foreground">—</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-center">
                          {note?.moyenneMatiere != null ? (
                            <span className={`font-mono font-bold ${Number(note.moyenneMatiere) >= 10 ? "text-green-600" : "text-red-500"}`}>
                              {Number(note.moyenneMatiere).toFixed(2)}
                            </span>
                          ) : (
                            <span className="text-muted-foreground">—</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-center">
                          {note?.moyenneSession != null ? (
                            <span className={`font-mono font-semibold ${Number(note.moyenneSession) >= 10 ? "text-green-600" : "text-red-500"}`}>
                              {Number(note.moyenneSession).toFixed(2)}
                            </span>
                          ) : note?.statut === "en_session" ? (
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-7 text-orange-600 border-orange-300 hover:bg-orange-50 text-xs"
                              onClick={() => setSessionDialog({ note, etudiantName: fullName })}
                            >
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Saisir
                            </Button>
                          ) : (
                            <span className="text-muted-foreground">—</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-center">
                          {note ? (
                            <Badge className={`text-xs border ${STATUT_NOTE_COLORS[note.statut]}`} variant="outline">
                              {STATUT_NOTE_LABELS[note.statut]}
                            </Badge>
                          ) : (
                            <span className="text-xs text-muted-foreground">Pas de note</span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-end gap-1">
                            <Button
                              size="icon"
                              variant="ghost"
                              className="w-7 h-7 text-blue-600 hover:bg-blue-50"
                              title={note ? "Modifier" : "Saisir"}
                              onClick={() =>
                                setNoteDialog({ etudiantId: etudiant.id, etudiantName: fullName, existing: note })
                              }
                            >
                              {note ? <Pencil className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                            </Button>
                            {note && (
                              <Button
                                size="icon"
                                variant="ghost"
                                className="w-7 h-7 text-red-500 hover:bg-red-50"
                                title="Supprimer"
                                onClick={() => handleDelete(note.id)}
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </Button>
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
        </div>
      </main>

      {/* Dialogs */}
      {noteDialog && selectedMatiereId && (
        <NoteFormDialog
          open
          onClose={() => setNoteDialog(null)}
          matiereId={selectedMatiereId}
          anneeAcademique={annee}
          etudiantId={noteDialog.etudiantId}
          etudiantName={noteDialog.etudiantName}
          existingNote={noteDialog.existing}
        />
      )}
      {sessionDialog && (
        <SessionDialog
          open
          onClose={() => setSessionDialog(null)}
          note={sessionDialog.note}
          etudiantName={sessionDialog.etudiantName}
        />
      )}
    </div>
  );
}

export default function NotesPage() {
  return (
    <Suspense>
      <NotesPageInner />
    </Suspense>
  );
}
