"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2, Search, Layers, GitBranch } from "lucide-react";
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
import { Switch } from "@/components/ui/switch";
import toast from "react-hot-toast";
import { useMatieresQuery } from "@/features/matieres/queries/matiere.query";
import {
  useAjouterMatiereMutation,
  useModifierMatiereMutation,
  useSupprimerMatiereMutation,
} from "@/features/matieres/mutations/matiere.mutation";
import { useFilieresQuery } from "@/features/filieres/queries/filiere.query";
import { useNiveauxQuery } from "@/features/niveaux/queries/niveau.query";
import { Matiere, MatiereAddDTO } from "@/features/matieres/types/matiere.type";

const emptyForm: MatiereAddDTO = { name: "", filiereId: "", niveauId: "", coefficient: 1, isModule: false, parentId: undefined };

export default function MatieresPage() {
  const [search, setSearch] = useState("");
  const [filterFiliereId, setFilterFiliereId] = useState("");
  const [filterNiveauId, setFilterNiveauId] = useState("");
  const [addOpen, setAddOpen] = useState(false);
  const [editItem, setEditItem] = useState<Matiere | null>(null);
  const [deleteItem, setDeleteItem] = useState<Matiere | null>(null);
  const [form, setForm] = useState<MatiereAddDTO>(emptyForm);

  const { data, isLoading } = useMatieresQuery({
    filiereId: filterFiliereId || undefined,
    niveauId: filterNiveauId || undefined,
  });
  const { data: filieres } = useFilieresQuery();
  const { data: niveaux } = useNiveauxQuery(filterFiliereId ? { filiereId: filterFiliereId } : undefined);
  const ajouterMutation = useAjouterMatiereMutation();
  const modifierMutation = useModifierMatiereMutation();
  const supprimerMutation = useSupprimerMatiereMutation();

  const filieresList = filieres ?? [];
  const niveauxList = niveaux ?? [];
  const items = (data ?? []).filter((m) =>
    !search || m.name.toLowerCase().includes(search.toLowerCase())
  );

  const openAdd = () => { setForm(emptyForm); setAddOpen(true); };
  const openEdit = (item: Matiere) => {
    setForm({ name: item.name, filiereId: item.filiereId, niveauId: item.niveauId, coefficient: item.coefficient ?? 1, isModule: item.isModule ?? false, parentId: item.parentId ?? undefined });
    setEditItem(item);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Matieres</h1>
          <p className="text-muted-foreground text-sm mt-0.5">Gerez les matieres, modules et sous-matieres complementaires</p>
        </div>
        <Button onClick={openAdd} className="gap-2">
          <Plus className="w-4 h-4" /> Ajouter
        </Button>
      </div>

      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[200px] max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Rechercher une matiere..." className="pl-9" value={search}
            onChange={(e) => setSearch(e.target.value)} />
        </div>
        <Select value={filterFiliereId || "__all"}
          onValueChange={(v) => { setFilterFiliereId(v === "__all" ? "" : v); setFilterNiveauId(""); }}>
          <SelectTrigger className="w-48"><SelectValue placeholder="Toutes les filieres" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="__all">Toutes les filieres</SelectItem>
            {filieresList.map((f) => (
              <SelectItem key={f.id} value={f.id}>{f.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={filterNiveauId || "__all"} onValueChange={(v) => setFilterNiveauId(v === "__all" ? "" : v)}
          disabled={!filterFiliereId}>
          <SelectTrigger className="w-44"><SelectValue placeholder="Tous les niveaux" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="__all">Tous les niveaux</SelectItem>
            {niveauxList.map((n) => (
              <SelectItem key={n.id} value={n.id}>{n.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead>Nom</TableHead>
              <TableHead>Filiere</TableHead>
              <TableHead>Niveau</TableHead>
              <TableHead className="text-center">Coeff.</TableHead>
              <TableHead className="text-center">Type</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow><TableCell colSpan={6} className="text-center py-12 text-muted-foreground">Chargement...</TableCell></TableRow>
            ) : items.length === 0 ? (
              <TableRow><TableCell colSpan={6} className="text-center py-12 text-muted-foreground">Aucune matiere trouvee</TableCell></TableRow>
            ) : (
              items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">
                    <span className="flex items-center gap-2">
                      {item.isModule && <Layers className="w-3.5 h-3.5 text-primary shrink-0" title="Module" />}
                      {item.parentId && !item.isModule && <GitBranch className="w-3.5 h-3.5 text-muted-foreground shrink-0" title="Sous-matiere" />}
                      {item.name}
                    </span>
                    {item.parentId && item.parent && (
                      <p className="text-xs text-muted-foreground mt-0.5 ml-5">Module: {item.parent.name}</p>
                    )}
                  </TableCell>
                  <TableCell>
                    {item.filiere ? <Badge variant="outline">{item.filiere.name}</Badge> : <span className="text-muted-foreground text-sm">-</span>}
                  </TableCell>
                  <TableCell>
                    {item.niveau ? <Badge variant="secondary">{item.niveau.name}</Badge> : <span className="text-muted-foreground text-sm">-</span>}
                  </TableCell>
                  <TableCell className="text-center font-mono text-sm font-semibold">{item.coefficient ?? 1}</TableCell>
                  <TableCell className="text-center">
                    {item.isModule
                      ? <Badge className="bg-primary/10 text-primary border border-primary/20">Module</Badge>
                      : item.parentId
                        ? <Badge variant="secondary">Complementaire</Badge>
                        : <Badge variant="outline">Simple</Badge>
                    }
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" onClick={() => openEdit(item)}>
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive"
                        onClick={() => setDeleteItem(item)}>
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

      {/* Add */}
      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>Ajouter une matiere</DialogTitle></DialogHeader>
          <MatiereForm form={form} setForm={setForm} filieres={filieresList} allMatieres={data ?? []} />
          <DialogFooter>
            <DialogClose asChild><Button variant="outline">Annuler</Button></DialogClose>
            <Button onClick={() => ajouterMutation.mutate(form, { onSuccess: () => { setAddOpen(false); toast.success("Matiere ajoutee"); }, onError: () => toast.error("Erreur lors de l'ajout") })}
              disabled={ajouterMutation.isPending}>
              {ajouterMutation.isPending ? "Ajout..." : "Ajouter"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit */}
      <Dialog open={!!editItem} onOpenChange={(o) => !o && setEditItem(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>Modifier la matiere</DialogTitle></DialogHeader>
          <MatiereForm form={form} setForm={setForm} filieres={filieresList} allMatieres={data ?? []} />
          <DialogFooter>
            <DialogClose asChild><Button variant="outline">Annuler</Button></DialogClose>
            <Button onClick={() => editItem && modifierMutation.mutate(
              { id: editItem.id, data: form }, { onSuccess: () => { setEditItem(null); toast.success("Matiere modifiee"); }, onError: () => toast.error("Erreur lors de la modification") }
            )} disabled={modifierMutation.isPending}>
              {modifierMutation.isPending ? "Modification..." : "Enregistrer"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete */}
      <Dialog open={!!deleteItem} onOpenChange={(o) => !o && setDeleteItem(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader><DialogTitle>Supprimer la matiere</DialogTitle></DialogHeader>
          <p className="text-sm text-muted-foreground">
            Supprimer <strong>{deleteItem?.name}</strong> ? Cette action est irreversible.
          </p>
          <DialogFooter>
            <DialogClose asChild><Button variant="outline">Annuler</Button></DialogClose>
            <Button variant="destructive"
              onClick={() => deleteItem && supprimerMutation.mutate(deleteItem.id, { onSuccess: () => { setDeleteItem(null); toast.success("Matiere supprimee"); }, onError: () => toast.error("Erreur lors de la suppression") })}
              disabled={supprimerMutation.isPending}>
              {supprimerMutation.isPending ? "Suppression..." : "Supprimer"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function MatiereForm({ form, setForm, filieres, allMatieres }: {
  form: MatiereAddDTO;
  setForm: (f: MatiereAddDTO) => void;
  filieres: { id: string; name: string; code: string }[];
  allMatieres: Matiere[];
}) {
  const { data: niveaux } = useNiveauxQuery(form.filiereId ? { filiereId: form.filiereId } : undefined);
  const niveauxList = niveaux ?? [];
  const modules = allMatieres.filter((m) => m.isModule && m.filiereId === form.filiereId && m.niveauId === form.niveauId);

  return (
    <div className="grid gap-4 py-2">
      <div className="grid gap-1.5">
        <Label>Nom</Label>
        <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
          placeholder="ex: Algebre 1" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="grid gap-1.5">
          <Label>Filiere</Label>
          <Select value={form.filiereId} onValueChange={(v) => setForm({ ...form, filiereId: v, niveauId: "", parentId: undefined })}>
            <SelectTrigger><SelectValue placeholder="Choisir..." /></SelectTrigger>
            <SelectContent>
              {filieres.length === 0
                ? <SelectItem value="__none" disabled>Aucune filiere</SelectItem>
                : filieres.map((f) => <SelectItem key={f.id} value={f.id}>{f.code} - {f.name}</SelectItem>)
              }
            </SelectContent>
          </Select>
        </div>
        <div className="grid gap-1.5">
          <Label>Niveau</Label>
          <Select value={form.niveauId} onValueChange={(v) => setForm({ ...form, niveauId: v, parentId: undefined })} disabled={!form.filiereId}>
            <SelectTrigger><SelectValue placeholder="Choisir..." /></SelectTrigger>
            <SelectContent>
              {niveauxList.length === 0
                ? <SelectItem value="__none" disabled>{form.filiereId ? "Aucun niveau" : "Selectionner une filiere"}</SelectItem>
                : niveauxList.map((n) => <SelectItem key={n.id} value={n.id}>{n.name}</SelectItem>)
              }
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="grid gap-1.5">
          <Label>Coefficient</Label>
          <Input type="number" min="0.5" max="20" step="0.5"
            value={form.coefficient ?? 1}
            onChange={(e) => setForm({ ...form, coefficient: parseFloat(e.target.value) || 1 })} />
        </div>
        <div className="grid gap-1.5">
          <Label className="mb-1">Est un module</Label>
          <div className="flex items-center gap-2 pt-1">
            <Switch
              checked={form.isModule ?? false}
              onCheckedChange={(v) => setForm({ ...form, isModule: v, parentId: v ? undefined : form.parentId })}
            />
            <span className="text-sm text-muted-foreground">{form.isModule ? "Oui (regroupe des sous-matieres)" : "Non"}</span>
          </div>
        </div>
      </div>

      {!form.isModule && modules.length > 0 && (
        <div className="grid gap-1.5">
          <Label>Module parent (optionnel)</Label>
          <Select value={form.parentId ?? "__none"} onValueChange={(v) => setForm({ ...form, parentId: v === "__none" ? undefined : v })}>
            <SelectTrigger><SelectValue placeholder="Matiere independante" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="__none">Matiere independante</SelectItem>
              {modules.map((m) => <SelectItem key={m.id} value={m.id}>{m.name} (coeff {m.coefficient})</SelectItem>)}
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground">Une sous-matiere complementaire appartient a un module (ex: Algebre 1 dans Mathematiques 1)</p>
        </div>
      )}
    </div>
  );
}
