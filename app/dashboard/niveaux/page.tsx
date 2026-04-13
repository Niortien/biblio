"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
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
import { useNiveauxQuery } from "@/features/niveaux/queries/niveau.query";
import {
  useAjouterNiveauMutation,
  useModifierNiveauMutation,
  useSupprimerNiveauMutation,
} from "@/features/niveaux/mutations/niveau.mutation";
import { useFilieresQuery } from "@/features/filieres/queries/filiere.query";
import { Niveau, NiveauAddDTO } from "@/features/niveaux/types/niveau.type";

const emptyForm: NiveauAddDTO = { name: "", filiereId: "" };

export default function NiveauxPage() {
  const [addOpen, setAddOpen] = useState(false);
  const [editItem, setEditItem] = useState<Niveau | null>(null);
  const [deleteItem, setDeleteItem] = useState<Niveau | null>(null);
  const [form, setForm] = useState<NiveauAddDTO>(emptyForm);
  const [filterFiliereId, setFilterFiliereId] = useState("");

  const { data, isLoading } = useNiveauxQuery(filterFiliereId ? { filiereId: filterFiliereId } : undefined);
  const { data: filieres } = useFilieresQuery();
  const ajouterMutation = useAjouterNiveauMutation();
  const modifierMutation = useModifierNiveauMutation();
  const supprimerMutation = useSupprimerNiveauMutation();

  const items = data ?? [];
  const filieresList = filieres ?? [];

  const openAdd = () => { setForm(emptyForm); setAddOpen(true); };
  const openEdit = (item: Niveau) => {
    setForm({ name: item.name, filiereId: item.filiereId });
    setEditItem(item);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Niveaux</h1>
          <p className="text-muted-foreground text-sm mt-0.5">GÃ©rez les niveaux d'Ã©tudes par filiÃ¨re</p>
        </div>
        <Button onClick={openAdd} className="gap-2">
          <Plus className="w-4 h-4" /> Ajouter
        </Button>
      </div>

      <div className="max-w-xs">
        <Select value={filterFiliereId || "__all"} onValueChange={(v) => setFilterFiliereId(v === "__all" ? "" : v)}>
          <SelectTrigger>
            <SelectValue placeholder="Toutes les filiÃ¨res" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="__all">Toutes les filiÃ¨res</SelectItem>
            {filieresList.map((f) => (
              <SelectItem key={f.id} value={f.id}>{f.code} â€” {f.name}</SelectItem>
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
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow><TableCell colSpan={3} className="text-center py-12 text-muted-foreground">Chargementâ€¦</TableCell></TableRow>
            ) : items.length === 0 ? (
              <TableRow><TableCell colSpan={3} className="text-center py-12 text-muted-foreground">Aucun niveau trouvÃ©</TableCell></TableRow>
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
        <DialogContent className="max-w-sm">
          <DialogHeader><DialogTitle>Ajouter un niveau</DialogTitle></DialogHeader>
          <NiveauForm form={form} setForm={setForm} filieres={filieresList} />
          <DialogFooter>
            <DialogClose asChild><Button variant="outline">Annuler</Button></DialogClose>
            <Button onClick={() => ajouterMutation.mutate(form, { onSuccess: () => { setAddOpen(false); toast.success("Niveau ajouté"); }, onError: () => toast.error("Erreur lors de l'ajout") })}
              disabled={ajouterMutation.isPending}>
              {ajouterMutation.isPending ? "Ajoutâ€¦" : "Ajouter"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit */}
      <Dialog open={!!editItem} onOpenChange={(o) => !o && setEditItem(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader><DialogTitle>Modifier le niveau</DialogTitle></DialogHeader>
          <NiveauForm form={form} setForm={setForm} filieres={filieresList} />
          <DialogFooter>
            <DialogClose asChild><Button variant="outline">Annuler</Button></DialogClose>
            <Button onClick={() => editItem && modifierMutation.mutate(
              { id: editItem.id, data: form }, { onSuccess: () => { setEditItem(null); toast.success("Niveau modifié"); }, onError: () => toast.error("Erreur lors de la modification") }
            )} disabled={modifierMutation.isPending}>
              {modifierMutation.isPending ? "Modificationâ€¦" : "Enregistrer"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete */}
      <Dialog open={!!deleteItem} onOpenChange={(o) => !o && setDeleteItem(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader><DialogTitle>Supprimer le niveau</DialogTitle></DialogHeader>
          <p className="text-sm text-muted-foreground">
            Supprimer <strong>{deleteItem?.name}</strong> ? Cette action est irrÃ©versible.
          </p>
          <DialogFooter>
            <DialogClose asChild><Button variant="outline">Annuler</Button></DialogClose>
            <Button variant="destructive"
              onClick={() => deleteItem && supprimerMutation.mutate(deleteItem.id, { onSuccess: () => { setDeleteItem(null); toast.success("Niveau supprimé"); }, onError: () => toast.error("Erreur lors de la suppression") })}
              disabled={supprimerMutation.isPending}>
              {supprimerMutation.isPending ? "Suppressionâ€¦" : "Supprimer"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function NiveauForm({ form, setForm, filieres }: {
  form: NiveauAddDTO;
  setForm: (f: NiveauAddDTO) => void;
  filieres: { id: string; name: string; code: string }[];
}) {
  return (
    <div className="grid gap-4 py-2">
      <div className="grid gap-1.5">
        <Label>Nom</Label>
        <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
          placeholder="Licence 1" />
      </div>
      <div className="grid gap-1.5">
        <Label>FiliÃ¨re</Label>
        <Select value={form.filiereId} onValueChange={(v) => setForm({ ...form, filiereId: v })}>
          <SelectTrigger><SelectValue placeholder="Choisir une filiÃ¨reâ€¦" /></SelectTrigger>
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
    </div>
  );

}
