"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search } from "lucide-react";
import toast from "react-hot-toast";
import { useUsersQuery } from "@/features/users/queries/user.query";
import {
  useAjouterUtilisateurMutation,
  useModifierUtilisateurMutation,
  useSupprimerUtilisateurMutation,
} from "@/features/users/mutations/user.mutation";
import { User, UserAddDTO } from "@/features/users/types/user.type";
import { userAPI } from "@/features/users/apis/user.api";
import EtudiantsTable from "./_components/EtudiantsTable";
import AddEtudiantDialog from "./_components/AddEtudiantDialog";
import EditEtudiantDialog from "./_components/EditEtudiantDialog";
import DeleteEtudiantDialog from "./_components/DeleteEtudiantDialog";
import ViewEtudiantDialog from "./_components/ViewEtudiantDialog";

export default function EtudiantsPage() {
  const [search, setSearch] = useState("");
  const [addOpen, setAddOpen] = useState(false);
  const [viewItem, setViewItem] = useState<User | null>(null);
  const [editItem, setEditItem] = useState<User | null>(null);
  const [deleteItem, setDeleteItem] = useState<User | null>(null);

  const { data, isLoading } = useUsersQuery();
  const ajouterMutation = useAjouterUtilisateurMutation();
  const modifierMutation = useModifierUtilisateurMutation();
  const supprimerMutation = useSupprimerUtilisateurMutation();

  const items = (data ?? []).filter((u) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      u.firstName.toLowerCase().includes(q) ||
      u.lastName.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q)
    );
  });

  const handleAdd = async (form: UserAddDTO, imageFile: File | null) => {
    if (!form.firstName || !form.lastName || !form.email || !form.password) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      return;
    }
    try {
      const newUser = await ajouterMutation.mutateAsync(form);
      if (imageFile) await userAPI.uploadImage(newUser.id, imageFile);
      toast.success("Étudiant inscrit avec succès");
      setAddOpen(false);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Erreur lors de l'inscription");
    }
  };

  const handleEdit = async (form: UserAddDTO, imageFile: File | null) => {
    if (!editItem) return;
    const payload = { ...form };
    if (!payload.password) delete (payload as Partial<UserAddDTO>).password;
    try {
      await modifierMutation.mutateAsync({ id: editItem.id, data: payload });
      if (imageFile) await userAPI.uploadImage(editItem.id, imageFile);
      toast.success("Utilisateur modifié avec succès");
      setEditItem(null);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Erreur lors de la modification");
    }
  };

  const handleDelete = async () => {
    if (!deleteItem) return;
    try {
      await supprimerMutation.mutateAsync(deleteItem.id);
      toast.success("Utilisateur supprimé");
      setDeleteItem(null);
    } catch {
      toast.error("Erreur lors de la suppression");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Étudiants</h1>
          <p className="text-muted-foreground text-sm mt-0.5">
            Inscrivez et gérez les comptes utilisateurs
          </p>
        </div>
        <Button onClick={() => setAddOpen(true)} className="gap-2">
          <Plus className="w-4 h-4" /> Inscrire un étudiant
        </Button>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Rechercher..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      <EtudiantsTable
        items={items}
        isLoading={isLoading}
        onView={setViewItem}
        onEdit={setEditItem}
        onDelete={setDeleteItem}
      />

      <AddEtudiantDialog
        open={addOpen}
        onOpenChange={setAddOpen}
        onAdd={handleAdd}
        isPending={ajouterMutation.isPending}
      />

      <EditEtudiantDialog
        item={editItem}
        onClose={() => setEditItem(null)}
        onEdit={handleEdit}
        isPending={modifierMutation.isPending}
      />

      <DeleteEtudiantDialog
        item={deleteItem}
        onClose={() => setDeleteItem(null)}
        onDelete={handleDelete}
        isPending={supprimerMutation.isPending}
      />

      <ViewEtudiantDialog
        item={viewItem}
        onClose={() => setViewItem(null)}
        onEdit={(user) => { setViewItem(null); setEditItem(user); }}
      />
    </div>
  );
}
