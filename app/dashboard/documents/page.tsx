"use client";

import { useState, useRef } from "react";
import { Plus, Pencil, Trash2, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import toast from "react-hot-toast";
import { useDocumentsQuery } from "@/features/documents/queries/document.query";
import {
  useAjouterDocumentMutation,
  useModifierDocumentMutation,
  useSupprimerDocumentMutation,
} from "@/features/documents/mutations/document.mutation";
import { useFilieresQuery } from "@/features/filieres/queries/filiere.query";
import { useNiveauxQuery } from "@/features/niveaux/queries/niveau.query";
import { useMatieresQuery } from "@/features/matieres/queries/matiere.query";
import {
  Document, DocumentAddDTO, DocumentUpdateDTO, DocumentType, DOCUMENT_TYPE_LABELS,
} from "@/features/documents/types/document.type";

const TYPES: DocumentType[] = ["devoir", "sujet_examen", "td", "tp", "support_cours"];

const typeColors: Record<DocumentType, string> = {
  devoir: "bg-orange-100 text-orange-700",
  sujet_examen: "bg-red-100 text-red-700",
  td: "bg-green-100 text-green-700",
  tp: "bg-purple-100 text-purple-700",
  support_cours: "bg-blue-100 text-blue-700",
};

type AddForm = Omit<DocumentAddDTO, "file"> & { file: File | null };
const emptyAdd: AddForm = {
  name: "", type: "support_cours", filiereId: "", niveauId: "", matiereId: "", file: null,
};

export default function DocumentsPage() {
  const [filters, setFilters] = useState<{ filiereId?: string; niveauId?: string }>({});
  const [addOpen, setAddOpen] = useState(false);
  const [editDoc, setEditDoc] = useState<Document | null>(null);
  const [editForm, setEditForm] = useState<DocumentUpdateDTO>({});
  const [deleteDoc, setDeleteDoc] = useState<Document | null>(null);
  const [addForm, setAddForm] = useState<AddForm>(emptyAdd);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: documents, isLoading } = useDocumentsQuery(filters);
  const { data: filieres } = useFilieresQuery();
  const { data: allNiveaux } = useNiveauxQuery();
  const { data: allMatieres } = useMatieresQuery();

  // Filtrage côté client pour le formulaire d'ajout
  const addNiveaux = (allNiveaux ?? []).filter(
    (n) => !addForm.filiereId || n.filiereId === addForm.filiereId
  );
  const addMatieres = (allMatieres ?? []).filter(
    (m) =>
      (!addForm.filiereId || m.filiereId === addForm.filiereId) &&
      (!addForm.niveauId || m.niveauId === addForm.niveauId)
  );

  // Filtrage côté client pour le formulaire d'édition
  const editNiveaux = (allNiveaux ?? []).filter(
    (n) => !editForm.filiereId || n.filiereId === editForm.filiereId
  );
  const editMatieres = (allMatieres ?? []).filter(
    (m) =>
      (!editForm.filiereId || m.filiereId === editForm.filiereId) &&
      (!editForm.niveauId || m.niveauId === editForm.niveauId)
  );
  const ajouterMutation = useAjouterDocumentMutation();
  const modifierMutation = useModifierDocumentMutation();
  const supprimerMutation = useSupprimerDocumentMutation();

  const openEdit = (doc: Document) => {
    setEditForm({ name: doc.name, type: doc.type, filiereId: doc.filiereId, niveauId: doc.niveauId, matiereId: doc.matiereId });
    setEditDoc(doc);
  };

  const handleSubmitAdd = () => {
    if (!addForm.file) return;
    ajouterMutation.mutate(
      { ...addForm, file: addForm.file } as DocumentAddDTO,
      { onSuccess: () => { setAddOpen(false); setAddForm(emptyAdd); toast.success("Document ajouté"); }, onError: () => toast.error("Erreur lors de l'ajout") }
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Documents</h1>
          <p className="text-muted-foreground text-sm mt-0.5">GÃ©rez tous les fichiers de la bibliothÃ¨que</p>
        </div>
        <Button onClick={() => setAddOpen(true)} className="gap-2">
          <Plus className="w-4 h-4" /> Ajouter
        </Button>
      </div>

      {/* Filtres */}
      <div className="flex flex-wrap gap-3">
        <Select value={filters.filiereId ?? "all"}
          onValueChange={(v) => setFilters({ filiereId: v === "all" ? undefined : v, niveauId: undefined })}>
          <SelectTrigger className="w-44"><SelectValue placeholder="Toutes les filiÃ¨res" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toutes les filières</SelectItem>
            {(filieres ?? []).map((f) => <SelectItem key={f.id} value={f.id}>{f.code} â€” {f.name}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={filters.niveauId ?? "all"}
          onValueChange={(v) => setFilters((p) => ({ ...p, niveauId: v === "all" ? undefined : v }))}>
          <SelectTrigger className="w-44"><SelectValue placeholder="Tous les niveaux" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les niveaux</SelectItem>
            {(allNiveaux ?? []).map((n) => <SelectItem key={n.id} value={n.id}>{n.name}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead>Nom</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>FiliÃ¨re</TableHead>
              <TableHead>Niveau</TableHead>
              <TableHead>MatiÃ¨re</TableHead>
              <TableHead>Format</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow><TableCell colSpan={7} className="text-center py-12 text-muted-foreground">Chargementâ€¦</TableCell></TableRow>
            ) : (documents ?? []).length === 0 ? (
              <TableRow><TableCell colSpan={7} className="text-center py-12 text-muted-foreground">Aucun document trouvÃ©</TableCell></TableRow>
            ) : (
              (documents ?? []).map((doc) => (
                <TableRow key={doc.id}>
                  <TableCell className="font-medium max-w-[180px] truncate">{doc.name}</TableCell>
                  <TableCell>
                    <span className={`inline-flex px-2 py-0.5 rounded text-xs font-medium ${typeColors[doc.type]}`}>
                      {DOCUMENT_TYPE_LABELS[doc.type]}
                    </span>
                  </TableCell>
                  <TableCell><Badge variant="outline">{doc.filiere?.code ?? doc.filiereId}</Badge></TableCell>
                  <TableCell><Badge variant="secondary">{doc.niveau?.name ?? doc.niveauId}</Badge></TableCell>
                  <TableCell className="text-muted-foreground text-sm">{doc.matiere?.name ?? "â€”"}</TableCell>
                  <TableCell>
                    <Badge variant={doc.fileType === "pdf" ? "default" : "secondary"}>
                      {doc.fileType.toUpperCase()}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="icon" onClick={() => openEdit(doc)}>
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive"
                        onClick={() => setDeleteDoc(doc)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Dialog Ajouter */}
      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>Ajouter un document</DialogTitle></DialogHeader>
          <div className="grid gap-4 py-2">
            <div className="grid gap-1.5">
              <Label>Nom</Label>
              <Input value={addForm.name}
                onChange={(e) => setAddForm((p) => ({ ...p, name: e.target.value }))}
                placeholder="Ex: Sujet examen Algo 2025" />
            </div>
            <div className="grid gap-1.5">
              <Label>Type</Label>
              <Select value={addForm.type} onValueChange={(v) => setAddForm((p) => ({ ...p, type: v as DocumentType }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {TYPES.map((t) => <SelectItem key={t} value={t}>{DOCUMENT_TYPE_LABELS[t]}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-1.5">
                <Label>FiliÃ¨re</Label>
                <Select value={addForm.filiereId}
                  onValueChange={(v) => setAddForm((p) => ({ ...p, filiereId: v, niveauId: "", matiereId: "" }))}>
                  <SelectTrigger><SelectValue placeholder="Choisirâ€¦" /></SelectTrigger>
                  <SelectContent>
                    {(filieres ?? []).map((f) => <SelectItem key={f.id} value={f.id}>{f.code}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-1.5">
                <Label>Niveau</Label>
                <Select value={addForm.niveauId}
                  onValueChange={(v) => setAddForm((p) => ({ ...p, niveauId: v }))}>
                  <SelectTrigger><SelectValue placeholder="Choisirâ€¦" /></SelectTrigger>
                  <SelectContent>
                    {addNiveaux.map((n) => <SelectItem key={n.id} value={n.id}>{n.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid gap-1.5">
              <Label>MatiÃ¨re <span className="text-muted-foreground text-xs">(optionnel)</span></Label>
              <Select value={addForm.matiereId ?? "none"}
                onValueChange={(v) => setAddForm((p) => ({ ...p, matiereId: v === "none" ? "" : v }))}>
                <SelectTrigger><SelectValue placeholder="Aucune" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Aucune</SelectItem>
                  {addMatieres.map((m) => <SelectItem key={m.id} value={m.id}>{m.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-1.5">
              <Label>Fichier <span className="text-muted-foreground text-xs">(PDF ou image, max 20 MB)</span></Label>
              <div
                className="border-2 border-dashed border-border rounded-lg p-4 text-center cursor-pointer hover:border-primary transition-colors"
                onClick={() => fileInputRef.current?.click()}>
                {addForm.file ? (
                  <p className="text-sm font-medium text-foreground">{addForm.file.name}</p>
                ) : (
                  <div className="flex flex-col items-center gap-1">
                    <Upload className="w-5 h-5 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">Cliquez pour sÃ©lectionner un fichier</p>
                  </div>
                )}
              </div>
              <input ref={fileInputRef} type="file" accept=".pdf,image/*" className="hidden"
                onChange={(e) => setAddForm((p) => ({ ...p, file: e.target.files?.[0] ?? null }))} />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild><Button variant="outline">Annuler</Button></DialogClose>
            <Button onClick={handleSubmitAdd}
              disabled={ajouterMutation.isPending || !addForm.file || !addForm.name || !addForm.filiereId || !addForm.niveauId}>
              {ajouterMutation.isPending ? "Uploadâ€¦" : "Ajouter"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog Modifier */}
      <Dialog open={!!editDoc} onOpenChange={(o) => !o && setEditDoc(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>Modifier le document</DialogTitle></DialogHeader>
          <div className="grid gap-4 py-2">
            <div className="grid gap-1.5">
              <Label>Nom</Label>
              <Input value={editForm.name ?? ""}
                onChange={(e) => setEditForm((p) => ({ ...p, name: e.target.value }))} />
            </div>
            <div className="grid gap-1.5">
              <Label>Type</Label>
              <Select value={editForm.type} onValueChange={(v) => setEditForm((p) => ({ ...p, type: v as DocumentType }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {TYPES.map((t) => <SelectItem key={t} value={t}>{DOCUMENT_TYPE_LABELS[t]}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-1.5">
                <Label>Filière</Label>
                <Select value={editForm.filiereId ?? ""}
                  onValueChange={(v) => setEditForm((p) => ({ ...p, filiereId: v, niveauId: "", matiereId: "" }))}>
                  <SelectTrigger><SelectValue placeholder="Choisir…" /></SelectTrigger>
                  <SelectContent>
                    {(filieres ?? []).map((f) => <SelectItem key={f.id} value={f.id}>{f.code}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-1.5">
                <Label>Niveau</Label>
                <Select value={editForm.niveauId ?? ""}
                  onValueChange={(v) => setEditForm((p) => ({ ...p, niveauId: v, matiereId: "" }))}
                  disabled={!editForm.filiereId}>
                  <SelectTrigger><SelectValue placeholder="Choisir…" /></SelectTrigger>
                  <SelectContent>
                    {editNiveaux.map((n) => <SelectItem key={n.id} value={n.id}>{n.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid gap-1.5">
              <Label>Matière <span className="text-muted-foreground text-xs">(optionnel)</span></Label>
              <Select value={editForm.matiereId ?? "none"}
                onValueChange={(v) => setEditForm((p) => ({ ...p, matiereId: v === "none" ? "" : v }))}
                disabled={!editForm.niveauId}>
                <SelectTrigger><SelectValue placeholder="Aucune" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Aucune</SelectItem>
                  {editMatieres.map((m) => <SelectItem key={m.id} value={m.id}>{m.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild><Button variant="outline">Annuler</Button></DialogClose>
            <Button onClick={() => editDoc && modifierMutation.mutate(
              { id: editDoc.id, data: editForm }, { onSuccess: () => { setEditDoc(null); toast.success("Document modifié"); }, onError: () => toast.error("Erreur lors de la modification") }
            )} disabled={modifierMutation.isPending}>
              {modifierMutation.isPending ? "Modificationâ€¦" : "Enregistrer"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog Supprimer */}
      <Dialog open={!!deleteDoc} onOpenChange={(o) => !o && setDeleteDoc(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader><DialogTitle>Supprimer le document</DialogTitle></DialogHeader>
          <p className="text-sm text-muted-foreground">
            Supprimer <strong>{deleteDoc?.name}</strong> ? Cette action est irrÃ©versible.
          </p>
          <DialogFooter>
            <DialogClose asChild><Button variant="outline">Annuler</Button></DialogClose>
            <Button variant="destructive"
              onClick={() => deleteDoc && supprimerMutation.mutate(deleteDoc.id, { onSuccess: () => { setDeleteDoc(null); toast.success("Document supprimé"); }, onError: () => toast.error("Erreur lors de la suppression") })}
              disabled={supprimerMutation.isPending}>
              {supprimerMutation.isPending ? "Suppressionâ€¦" : "Supprimer"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
