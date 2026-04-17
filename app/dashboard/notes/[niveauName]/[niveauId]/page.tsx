"use client";

import { useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  flexRender,
  createColumnHelper,
  SortingState,
  ColumnFiltersState,
} from "@tanstack/react-table";
import {
  ArrowLeft, ChevronRight, Plus, ClipboardList,
  CheckCircle2, Clock, AlertCircle, XCircle,
  ArrowUpDown, ArrowUp, ArrowDown, Search,
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
import { useCreerNoteMutation, useModifierNoteMutation, useSaisirSessionMutation } from "@/features/notes/mutations/note.mutation";
import {
  NoteEtudiant,
  STATUT_NOTE_LABELS,
  STATUT_NOTE_COLORS,
  StatutNote,
  NoteCreateDTO,
  NoteUpdateDTO,
  SaisirSessionDTO,
} from "@/features/notes/types/note.type";
import { User } from "@/features/users/types/user.type";

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

// ─── Row type ─────────────────────────────────────────────────────────────────

interface StudentRow {
  etudiant: User;
  note: NoteEtudiant | undefined;
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function NotesEtudiantsPage() {
  const router = useRouter();
  const params = useParams();
  const niveauName = decodeURIComponent(params.niveauName as string);
  const niveauId   = params.niveauId as string;

  const [annee, setAnnee]               = useState(CURRENT_YEAR);
  const [sorting,       setSorting]     = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter,  setGlobalFilter] = useState("");

  // Dialogs
  const [addDialog,   setAddDialog]   = useState<User | null>(null);
  const [addForm,     setAddForm]     = useState<Partial<NoteCreateDTO>>({});
  const [editNote,    setEditNote]    = useState<NoteEtudiant | null>(null);
  const [editForm,    setEditForm]    = useState<NoteUpdateDTO>({});
  const [sessionNote, setSessionNote] = useState<NoteEtudiant | null>(null);
  const [sessionVal,  setSessionVal]  = useState("");

  // ── Data ──────────────────────────────────────────────────────────────────
  const { data: allNiveaux }           = useNiveauxQuery();
  const { data: filieres }             = useFilieresQuery();
  const { data: users, isLoading: usersLoad } = useUsersQuery();
  const { data: matieres }             = useMatieresQuery({ niveauId });

  const niveau  = (allNiveaux ?? []).find(n => n.id === niveauId);
  const filiere = (filieres ?? []).find(f => f.id === niveau?.filiereId);

  const etudiants = useMemo(
    () => (users ?? []).filter(u => u.role === "etudiant" && u.niveauId === niveauId),
    [users, niveauId],
  );

  const matieresFiltrees = useMemo(
    () => (matieres ?? []).filter(m => !m.isModule),
    [matieres],
  );

  // Charger les notes pour la matière sélectionnée dans le filtre
  const [filterMatiereId, setFilterMatiereId] = useState("");
  const { data: notes } = useNotesQuery(
    { anneeAcademique: annee, matiereId: filterMatiereId || undefined },
    { enabled: !!filterMatiereId },
  );

  const notesMap = useMemo(() => {
    const m = new Map<string, NoteEtudiant>();
    (notes ?? []).forEach(n => m.set(n.etudiantId, n));
    return m;
  }, [notes]);

  // ── Mutations ────────────────────────────────────────────────────────────
  const creerMutation    = useCreerNoteMutation();
  const modifierMutation = useModifierNoteMutation();
  const sessionMutation  = useSaisirSessionMutation();

  // ── React Table columns ──────────────────────────────────────────────────
  const columnHelper = createColumnHelper<StudentRow>();

  const columns = useMemo(() => [
    columnHelper.accessor(row => `${row.etudiant.firstName} ${row.etudiant.lastName}`, {
      id: "nom",
      header: ({ column }) => (
        <SortHeader label="Étudiant" column={column} />
      ),
      cell: info => (
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary shrink-0">
            {info.row.original.etudiant.firstName[0]}
            {info.row.original.etudiant.lastName[0]}
          </div>
          <div>
            <p className="font-medium text-sm">{info.getValue()}</p>
            <p className="text-xs text-muted-foreground">{info.row.original.etudiant.email}</p>
          </div>
        </div>
      ),
      filterFn: "includesString",
    }),
    columnHelper.accessor(row => row.note?.moyenneClasse ?? null, {
      id: "classe",
      header: ({ column }) => <SortHeader label="Moy. Classe" column={column} />,
      cell: info => <span className="font-mono text-sm">{fmt(info.getValue())}</span>,
    }),
    columnHelper.accessor(row => row.note?.moyenneExamen ?? null, {
      id: "examen",
      header: ({ column }) => <SortHeader label="Moy. Examen" column={column} />,
      cell: info => <span className="font-mono text-sm">{fmt(info.getValue())}</span>,
    }),
    columnHelper.accessor(row => row.note?.moyenneMatiere ?? null, {
      id: "matiere",
      header: ({ column }) => <SortHeader label="Moy. Matière" column={column} />,
      cell: info => (
        <span className="font-mono text-sm font-bold">{fmt(info.getValue())}</span>
      ),
    }),
    columnHelper.accessor(row => row.note?.statut ?? null, {
      id: "statut",
      header: "Statut",
      cell: info => {
        const statut = info.getValue();
        if (!statut) return <span className="text-xs text-muted-foreground">Non saisi</span>;
        const Icon = STATUT_ICONS[statut];
        return (
          <Badge className={`gap-1 text-xs ${STATUT_NOTE_COLORS[statut]}`}>
            <Icon className="w-3 h-3" />
            {STATUT_NOTE_LABELS[statut]}
          </Badge>
        );
      },
    }),
    columnHelper.display({
      id: "actions",
      header: () => <span className="sr-only">Actions</span>,
      cell: ({ row }) => {
        const { etudiant, note } = row.original;
        return (
          <div className="flex justify-end gap-1">
            {!note ? (
              <Button
                size="sm"
                variant="outline"
                className="h-8 text-xs gap-1.5"
                onClick={() => {
                  setAddForm({
                    anneeAcademique: annee,
                    etudiantId: etudiant.id,
                    matiereId: filterMatiereId || undefined,
                  });
                  setAddDialog(etudiant);
                }}
                disabled={!filterMatiereId}
                title={!filterMatiereId ? "Sélectionnez une matière d'abord" : undefined}
              >
                <Plus className="w-3 h-3" /> Saisir
              </Button>
            ) : (
              <>
                <Button
                  size="sm"
                  variant="outline"
                  className="h-8 text-xs gap-1.5"
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
                    className="h-8 text-xs gap-1.5 text-orange-600 border-orange-200 hover:bg-orange-50"
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
        );
      },
    }),
  ], [columnHelper, annee, filterMatiereId]);

  const data: StudentRow[] = useMemo(
    () => etudiants.map(e => ({ etudiant: e, note: notesMap.get(e.id) })),
    [etudiants, notesMap],
  );

  const table = useReactTable({
    data,
    columns,
    state: { sorting, columnFilters, globalFilter },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel:     getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel:   getSortedRowModel(),
  });

  const saisiCount   = etudiants.filter(e => notesMap.has(e.id)).length;
  const validéCount  = (notes ?? []).filter(n => n.statut === "valide").length;
  const sessionCount = (notes ?? []).filter(n => n.statut === "en_session").length;

  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <div className="space-y-6">
      {/* Breadcrumb + header */}
      <div className="flex items-start gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.push(`/dashboard/notes/${encodeURIComponent(niveauName)}`)}
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground mb-0.5 flex-wrap">
            <span className="cursor-pointer hover:underline" onClick={() => router.push("/dashboard/notes")}>Notes</span>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="cursor-pointer hover:underline" onClick={() => router.push(`/dashboard/notes/${encodeURIComponent(niveauName)}`)}>
              {niveauName}
            </span>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-foreground font-medium">{filiere?.name ?? "…"}</span>
          </div>
          <h1 className="text-2xl font-bold">
            {filiere?.name ?? "…"} — {niveauName}
          </h1>
          <p className="text-muted-foreground text-sm mt-0.5">
            {etudiants.length} étudiant{etudiants.length > 1 ? "s" : ""} — {annee}
          </p>
        </div>

        {/* Année */}
        <Select value={annee} onValueChange={setAnnee}>
          <SelectTrigger className="w-36"><SelectValue /></SelectTrigger>
          <SelectContent>
            {YEARS.map(y => <SelectItem key={y} value={y}>{y}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      {/* Stats rapides */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Total",     value: etudiants.length, color: "text-foreground" },
          { label: "Saisis",    value: saisiCount,        color: "text-blue-600" },
          { label: "Validés",   value: validéCount,       color: "text-green-600" },
          { label: "Session",   value: sessionCount,      color: "text-orange-600" },
        ].map(s => (
          <div key={s.label} className="p-4 rounded-xl border bg-card text-center">
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filtres */}
      <div className="flex flex-wrap gap-3 items-center">
        {/* Filtre matière */}
        <Select
          value={filterMatiereId || "__all"}
          onValueChange={v => setFilterMatiereId(v === "__all" ? "" : v)}
        >
          <SelectTrigger className="w-64">
            <SelectValue placeholder="Filtrer par matière…" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="__all">Toutes les matières</SelectItem>
            {matieresFiltrees.map(m => (
              <SelectItem key={m.id} value={m.id}>
                {m.name} (coeff {m.coefficient})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Recherche globale */}
        <div className="relative flex-1 min-w-[200px] max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher un étudiant…"
            className="pl-9"
            value={globalFilter}
            onChange={e => setGlobalFilter(e.target.value)}
          />
        </div>

        {filterMatiereId && (
          <div className="flex items-center gap-1.5 text-sm px-3 py-1.5 bg-blue-50 border border-blue-200 rounded-lg text-blue-700">
            <ClipboardList className="w-3.5 h-3.5" />
            {matieresFiltrees.find(m => m.id === filterMatiereId)?.name}
          </div>
        )}
      </div>

      {/* Tableau react-table */}
      {usersLoad ? (
        <div className="space-y-2">
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="h-14 rounded-lg bg-muted animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="rounded-xl border overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              {table.getHeaderGroups().map(hg => (
                <tr key={hg.id} className="bg-muted/50 border-b border-border">
                  {hg.headers.map(header => (
                    <th
                      key={header.id}
                      className="px-4 py-3 text-left font-semibold text-muted-foreground first:pl-5 last:pr-5 last:text-right"
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.length === 0 ? (
                <tr>
                  <td colSpan={columns.length} className="text-center py-12 text-muted-foreground">
                    Aucun étudiant trouvé
                  </td>
                </tr>
              ) : (
                table.getRowModel().rows.map(row => (
                  <tr
                    key={row.id}
                    className="border-b border-border last:border-0 hover:bg-muted/20 transition-colors cursor-pointer"
                    onClick={e => {
                      // don't navigate if a button inside the row was clicked
                      if ((e.target as HTMLElement).closest("button")) return;
                      router.push(
                        `/dashboard/notes/${encodeURIComponent(niveauName)}/${niveauId}/${row.original.etudiant.id}`,
                      );
                    }}
                  >
                    {row.getVisibleCells().map(cell => (
                      <td
                        key={cell.id}
                        className="px-4 py-3 first:pl-5 last:pr-5 last:text-right"
                      >
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {!filterMatiereId && etudiants.length > 0 && (
        <p className="text-center text-sm text-muted-foreground">
          Sélectionnez une matière pour afficher et saisir les notes
        </p>
      )}

      {/* ── Dialog : Saisir note ─────────────────────────────────────────── */}
      <Dialog open={!!addDialog} onOpenChange={o => !o && setAddDialog(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ClipboardList className="w-5 h-5 text-primary" />
              Saisir une note
            </DialogTitle>
            {addDialog && (
              <p className="text-sm text-muted-foreground">
                {addDialog.firstName} {addDialog.lastName} —{" "}
                {matieresFiltrees.find(m => m.id === filterMatiereId)?.name ?? ""}
              </p>
            )}
          </DialogHeader>
          <NoteFormFields form={addForm} setForm={setAddForm} matieres={matieresFiltrees} showMatiereSelect={!filterMatiereId} />
          <DialogFooter>
            <DialogClose asChild><Button variant="outline">Annuler</Button></DialogClose>
            <Button
              onClick={() =>
                creerMutation.mutate(addForm as NoteCreateDTO, {
                  onSuccess: () => { setAddDialog(null); toast.success("Note saisie"); },
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

      {/* ── Dialog : Modifier note ───────────────────────────────────────── */}
      <Dialog open={!!editNote} onOpenChange={o => !o && setEditNote(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Modifier la note</DialogTitle>
            {editNote && (
              <p className="text-sm text-muted-foreground">
                {editNote.etudiant?.firstName} {editNote.etudiant?.lastName}
              </p>
            )}
          </DialogHeader>
          <NoteFormFields form={editForm} setForm={setEditForm} matieres={[]} showMatiereSelect={false} />
          <DialogFooter>
            <DialogClose asChild><Button variant="outline">Annuler</Button></DialogClose>
            <Button
              onClick={() =>
                editNote && modifierMutation.mutate(
                  { id: editNote.id, data: editForm },
                  {
                    onSuccess: () => { setEditNote(null); toast.success("Note mise à jour"); },
                    onError:   e => toast.error(e.message || "Erreur"),
                  },
                )
              }
              disabled={modifierMutation.isPending}
            >
              {modifierMutation.isPending ? "Mise à jour…" : "Enregistrer"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Dialog : Session ────────────────────────────────────────────── */}
      <Dialog open={!!sessionNote} onOpenChange={o => !o && setSessionNote(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Note de session</DialogTitle>
            {sessionNote && (
              <p className="text-sm text-muted-foreground">
                {sessionNote.etudiant?.firstName} {sessionNote.etudiant?.lastName}
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
              ≥ 10 → Validé, &lt; 10 → Ajourné
            </p>
          </div>
          <DialogFooter>
            <DialogClose asChild><Button variant="outline">Annuler</Button></DialogClose>
            <Button
              onClick={() =>
                sessionNote && sessionMutation.mutate(
                  { id: sessionNote.id, data: { moyenneSession: parseFloat(sessionVal) } as SaisirSessionDTO },
                  {
                    onSuccess: () => { setSessionNote(null); toast.success("Note de session enregistrée"); },
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

// ─── SortHeader ───────────────────────────────────────────────────────────────

function SortHeader({ label, column }: { label: string; column: import("@tanstack/react-table").Column<StudentRow> }) {
  const sorted = column.getIsSorted();
  return (
    <button
      className="flex items-center gap-1.5 text-left font-semibold text-muted-foreground hover:text-foreground transition-colors"
      onClick={() => column.toggleSorting(sorted === "asc")}
    >
      {label}
      {sorted === "asc"  ? <ArrowUp   className="w-3.5 h-3.5" /> :
       sorted === "desc" ? <ArrowDown className="w-3.5 h-3.5" /> :
                           <ArrowUpDown className="w-3.5 h-3.5 opacity-50" />}
    </button>
  );
}

// ─── NoteFormFields ───────────────────────────────────────────────────────────

function NoteFormFields({
  form, setForm, matieres, showMatiereSelect,
}: {
  form: Partial<NoteCreateDTO | NoteUpdateDTO>;
  setForm: (f: Partial<NoteCreateDTO | NoteUpdateDTO>) => void;
  matieres: { id: string; name: string; coefficient: number }[];
  showMatiereSelect: boolean;
}) {
  const mc = (form as Record<string, number | undefined>).moyenneClasse;
  const me = (form as Record<string, number | undefined>).moyenneExamen;
  const preview = mc != null && me != null ? (mc * 0.4 + me * 0.6).toFixed(2) : null;

  return (
    <div className="grid gap-4 py-2">
      {showMatiereSelect && (
        <div className="grid gap-1.5">
          <Label>Matière <span className="text-destructive">*</span></Label>
          <Select
            value={(form as Partial<NoteCreateDTO>).matiereId ?? "__none"}
            onValueChange={v => setForm({ ...form, matiereId: v === "__none" ? undefined : v } as Partial<NoteCreateDTO>)}
          >
            <SelectTrigger><SelectValue placeholder="Sélectionner…" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="__none">Choisir…</SelectItem>
              {matieres.map(m => (
                <SelectItem key={m.id} value={m.id}>{m.name} (coeff {m.coefficient})</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      <div className="grid grid-cols-2 gap-3">
        <div className="grid gap-1.5">
          <Label>Moy. Classe /20 <span className="text-muted-foreground text-xs">× 0.4</span></Label>
          <Input
            type="number" min="0" max="20" step="0.25"
            value={mc ?? ""}
            onChange={e => setForm({ ...form, moyenneClasse: e.target.value ? parseFloat(e.target.value) : undefined })}
            placeholder="0 – 20"
          />
        </div>
        <div className="grid gap-1.5">
          <Label>Moy. Examen /20 <span className="text-muted-foreground text-xs">× 0.6</span></Label>
          <Input
            type="number" min="0" max="20" step="0.25"
            value={me ?? ""}
            onChange={e => setForm({ ...form, moyenneExamen: e.target.value ? parseFloat(e.target.value) : undefined })}
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
          Moyenne : {preview}/20 — {parseFloat(preview) >= 10 ? "Validé ✓" : "En session ⚠"}
        </div>
      )}
    </div>
  );
}
