"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2, Search } from "lucide-react";
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
import { useMatieresQuery } from "@/features/matieres/queries/matiere.query";
import {
  useAjouterMatiereMutation,
  useModifierMatiereMutation,
  useSupprimerMatiereMutation,
} from "@/features/matieres/mutations/matiere.mutation";
import { useFilieresQuery } from "@/features/filieres/queries/filiere.query";
import { useNiveauxQuery } from "@/features/niveaux/queries/niveau.query";
import { Matiere, MatiereAddDTO } from "@/features/matieres/types/matiere.type";

const emptyForm: MatiereAddDTO = { name: "", filiereId: "", niveauId: "" };

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
    setForm({ name: item.name, filiereId: item.filiereId, niveauId: item.niveauId });
    setEditItem(item);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">MatiÃ¨res</h1>
          <p className="text-muted-foreground text-sm mt-0.5">GÃ©rez les matiÃ¨res par filiÃ¨re et niveau</p>
        </div>
        <Button onClick={openAdd} className="gap-2">
          <Plus className="w-4 h-4" /> Ajouter
        </Button>
      </div>

      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[200px] max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Rechercher une matiÃ¨reâ€¦" className="pl-9" value={search}
            onChange={(e) => setSearch(e.target.value)} />
        </div>
        <Select value={filterFiliereId || "__all"}
          onValueChange={(v) => { setFilterFiliereId(v === "__all" ? "" : v); setFilterNiveauId(""); }}>
          <SelectTrigger className="w-48"><SelectValue placeholder="Toutes les filiÃ¨res" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="__all">Toutes les filiÃ¨res</SelectItem>
            {filieresList.map((f) => (
              <SelectItem key={f.id} value={f.id}>{f.code} â€” {f.name}</SelectItem>
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
              <TableHead>FiliÃ¨re</TableHead>
              <TableHead>Niveau</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow><TableCell colSpan={4} className="text-center py-12 text-muted-foreground">Chargementâ€¦</TableCell></TableRow>
            ) : items.length === 0 ? (
              <TableRow><TableCell colSpan={4} className="text-center py-12 text-muted-foreground">Aucune matiÃ¨re trouvÃ©e</TableCell></TableRow>
            ) : (
              items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell>
                    {item.filiere
                      ? <Badge variant="outline">{item.filiere.code}</Badge>
                      : <span className="text-muted-foreground text-sm">â€”</span>
                    }
                  </TableCell>
                  <TableCell>
                    {item.niveau
                      ? <Badge variant="secondary">{item.niveau.name}</Badge>
                      : <span className="text-muted-foreground text-sm">â€”</span>
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
          <DialogHeader><DialogTitle>Ajouter une matiÃ¨re</DialogTitle></DialogHeader>
          <MatiereForm form={form} setForm={setForm} filieres={filieresList} />
          <DialogFooter>
            <DialogClose asChild><Button variant="outline">Annuler</Button></DialogClose>
            <Button onClick={() => ajouterMutation.mutate(form, { onSuccess: () => { setAddOpen(false); toast.success("Matière ajoutée"); }, onError: () => toast.error("Erreur lors de l'ajout") })}
              disabled={ajouterMutation.isPending}>
              {ajouterMutation.isPending ? "Ajoutâ€¦" : "Ajouter"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit */}
      <Dialog open={!!editItem} onOpenChange={(o) => !o && setEditItem(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>Modifier la matiÃ¨re</DialogTitle></DialogHeader>
          <MatiereForm form={form} setForm={setForm} filieres={filieresList} />
          <DialogFooter>
            <DialogClose asChild><Button variant="outline">Annuler</Button></DialogClose>
            <Button onClick={() => editItem && modifierMutation.mutate(
              { id: editItem.id, data: form }, { onSuccess: () => { setEditItem(null); toast.success("Matière modifiée"); }, onError: () => toast.error("Erreur lors de la modification") }
            )} disabled={modifierMutation.isPending}>
              {modifierMutation.isPending ? "Modificationâ€¦" : "Enregistrer"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete */}
      <Dialog open={!!deleteItem} onOpenChange={(o) => !o && setDeleteItem(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader><DialogTitle>Supprimer la matiÃ¨re</DialogTitle></DialogHeader>
          <p className="text-sm text-muted-foreground">
            Supprimer <strong>{deleteItem?.name}</strong> ? Cette action est irrÃ©versible.
          </p>
          <DialogFooter>
            <DialogClose asChild><Button variant="outline">Annuler</Button></DialogClose>
            <Button variant="destructive"
              onClick={() => deleteItem && supprimerMutation.mutate(deleteItem.id, { onSuccess: () => { setDeleteItem(null); toast.success("Matière supprimée"); }, onError: () => toast.error("Erreur lors de la suppression") })}
              disabled={supprimerMutation.isPending}>
              {supprimerMutation.isPending ? "Suppressionâ€¦" : "Supprimer"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function MatiereForm({ form, setForm, filieres }: {
  form: MatiereAddDTO;
  setForm: (f: MatiereAddDTO) => void;
  filieres: { id: string; name: string; code: string }[];
}) {
  const { data: niveaux } = useNiveauxQuery(form.filiereId ? { filiereId: form.filiereId } : undefined);
  const niveauxList = niveaux ?? [];

  return (
    <div className="grid gap-4 py-2">
      <div className="grid gap-1.5">
        <Label>Nom</Label>
        <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
          placeholder="Algorithmique" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="grid gap-1.5">
          <Label>FiliÃ¨re</Label>
          <Select value={form.filiereId}
            onValueChange={(v) => setForm({ ...form, filiereId: v, niveauId: "" })}>
            <SelectTrigger><SelectValue placeholder="Choisirâ€¦" /></SelectTrigger>
            <SelectContent>
              {filieres.length === 0
                ? <SelectItem value="__none" disabled>Aucune filiÃ¨re</SelectItem>
                : filieres.map((f) => (
                    <SelectItem key={f.id} value={f.id}>{f.code} â€” {f.name}</SelectItem>
                  ))
              }
            </SelectContent>
          </Select>
        </div>
        <div className="grid gap-1.5">
          <Label>Niveau</Label>
          <Select value={form.niveauId} onValueChange={(v) => setForm({ ...form, niveauId: v })}
            disabled={!form.filiereId}>
            <SelectTrigger><SelectValue placeholder="Choisirâ€¦" /></SelectTrigger>
            <SelectContent>
              {niveauxList.length === 0
                ? <SelectItem value="__none" disabled>{form.filiereId ? "Aucun niveau" : "SÃ©lectionner d'abord une filiÃ¨re"}</SelectItem>
                : niveauxList.map((n) => (
                    <SelectItem key={n.id} value={n.id}>{n.name}</SelectItem>
                  ))
              }
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
