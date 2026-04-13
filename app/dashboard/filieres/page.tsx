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
import { useFilieresQuery } from "@/features/filieres/queries/filiere.query";
import {
  useAjouterFiliereMutation,
  useModifierFiliereMutation,
  useSupprimerFiliereMutation,
} from "@/features/filieres/mutations/filiere.mutation";
import { Filiere, FiliereAddDTO } from "@/features/filieres/types/filiere.type";

const emptyForm: FiliereAddDTO = { name: "", code: "", isActive: true };

export default function FilieresPage() {
  const [search, setSearch] = useState("");
  const [addOpen, setAddOpen] = useState(false);
  const [editItem, setEditItem] = useState<Filiere | null>(null);
  const [deleteItem, setDeleteItem] = useState<Filiere | null>(null);
  const [form, setForm] = useState<FiliereAddDTO>(emptyForm);

  const { data, isLoading } = useFilieresQuery();
  const ajouterMutation = useAjouterFiliereMutation();
  const modifierMutation = useModifierFiliereMutation();
  const supprimerMutation = useSupprimerFiliereMutation();

  const items = (data ?? []).filter((f) =>
    !search || f.name.toLowerCase().includes(search.toLowerCase()) || f.code.toLowerCase().includes(search.toLowerCase())
  );

  const openAdd = () => { setForm(emptyForm); setAddOpen(true); };
  const openEdit = (item: Filiere) => {
    setForm({ name: item.name, code: item.code, isActive: item.isActive });
    setEditItem(item);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Filières</h1>
          <p className="text-muted-foreground text-sm mt-0.5">Gérez les filières de l'établissement</p>
        </div>
        <Button onClick={openAdd} className="gap-2">
          <Plus className="w-4 h-4" /> Ajouter
        </Button>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input placeholder="Rechercher par nom ou code…" className="pl-9" value={search}
          onChange={(e) => setSearch(e.target.value)} />
      </div>

      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead>Code</TableHead>
              <TableHead>Nom</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow><TableCell colSpan={4} className="text-center py-12 text-muted-foreground">Chargementâ€¦</TableCell></TableRow>
            ) : items.length === 0 ? (
              <TableRow><TableCell colSpan={4} className="text-center py-12 text-muted-foreground">Aucune filiÃ¨re trouvÃ©e</TableCell></TableRow>
            ) : (
              items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell><Badge variant="secondary">{item.code}</Badge></TableCell>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell>
                    <Badge variant={item.isActive ? "default" : "outline"}
                      className={item.isActive ? "bg-green-100 text-green-700 border-green-200 hover:bg-green-100" : "text-muted-foreground"}>
                      {item.isActive ? "Active" : "Inactive"}
                    </Badge>
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

      {/* Add Dialog */}
      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>Ajouter une filiÃ¨re</DialogTitle></DialogHeader>
          <FiliereForm form={form} setForm={setForm} />
          <DialogFooter>
            <DialogClose asChild><Button variant="outline">Annuler</Button></DialogClose>
            <Button onClick={() => ajouterMutation.mutate(form, { onSuccess: () => { setAddOpen(false); toast.success("Filière ajoutée"); }, onError: () => toast.error("Erreur lors de l'ajout") })}
              disabled={ajouterMutation.isPending}>
              {ajouterMutation.isPending ? "Ajoutâ€¦" : "Ajouter"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={!!editItem} onOpenChange={(o) => !o && setEditItem(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>Modifier la filiÃ¨re</DialogTitle></DialogHeader>
          <FiliereForm form={form} setForm={setForm} />
          <DialogFooter>
            <DialogClose asChild><Button variant="outline">Annuler</Button></DialogClose>
            <Button onClick={() => editItem && modifierMutation.mutate(
              { id: editItem.id, data: form }, { onSuccess: () => { setEditItem(null); toast.success("Filière modifiée"); }, onError: () => toast.error("Erreur lors de la modification") }
            )} disabled={modifierMutation.isPending}>
              {modifierMutation.isPending ? "Modificationâ€¦" : "Enregistrer"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={!!deleteItem} onOpenChange={(o) => !o && setDeleteItem(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader><DialogTitle>Supprimer la filiÃ¨re</DialogTitle></DialogHeader>
          <p className="text-sm text-muted-foreground">
            ÃŠtes-vous sÃ»r de vouloir supprimer <strong>{deleteItem?.name}</strong> ({deleteItem?.code}) ?
          </p>
          <DialogFooter>
            <DialogClose asChild><Button variant="outline">Annuler</Button></DialogClose>
            <Button variant="destructive"
              onClick={() => deleteItem && supprimerMutation.mutate(deleteItem.id, { onSuccess: () => { setDeleteItem(null); toast.success("Filière supprimée"); }, onError: () => toast.error("Erreur lors de la suppression") })}
              disabled={supprimerMutation.isPending}>
              {supprimerMutation.isPending ? "Suppressionâ€¦" : "Supprimer"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function FiliereForm({ form, setForm }: { form: FiliereAddDTO; setForm: (f: FiliereAddDTO) => void }) {
  return (
    <div className="grid gap-4 py-2">
      <div className="grid grid-cols-2 gap-3">
        <div className="grid gap-1.5">
          <Label>Nom</Label>
          <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Informatique" />
        </div>
        <div className="grid gap-1.5">
          <Label>Code</Label>
          <Input value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })}
            placeholder="INFO" />
        </div>
      </div>
      <div className="grid gap-1.5">
        <Label>Statut</Label>
        <Select value={form.isActive ? "true" : "false"}
          onValueChange={(v) => setForm({ ...form, isActive: v === "true" })}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="true">Active</SelectItem>
            <SelectItem value="false">Inactive</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

