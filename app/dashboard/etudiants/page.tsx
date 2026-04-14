"use client";

import { useState, useRef } from "react";
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
import { useUsersQuery } from "@/features/users/queries/user.query";
import {
  useAjouterUtilisateurMutation,
  useModifierUtilisateurMutation,
  useSupprimerUtilisateurMutation,
} from "@/features/users/mutations/user.mutation";
import { User, UserAddDTO, UserRole, USER_ROLE_LABELS } from "@/features/users/types/user.type";
import { userAPI } from "@/features/users/apis/user.api";
import { useFilieresQuery } from "@/features/filieres/queries/filiere.query";
import { useNiveauxQuery } from "@/features/niveaux/queries/niveau.query";
import { Camera, Pencil, Plus, Search, Trash2, UserCheck, UserX } from "lucide-react";

const emptyForm: UserAddDTO = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  role: "etudiant",
  isActive: true,
  filiereId: "",
  niveauId: "",
};

export default function EtudiantsPage() {
  const [search, setSearch] = useState("");
  const [addOpen, setAddOpen] = useState(false);
  const [viewItem, setViewItem] = useState<User | null>(null);
  const [editItem, setEditItem] = useState<User | null>(null);
  const [deleteItem, setDeleteItem] = useState<User | null>(null);
  const [form, setForm] = useState<UserAddDTO>(emptyForm);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: filieres } = useFilieresQuery();
  const filieresList = (filieres ?? []).filter((f) => f.isActive);
  const { data: niveaux } = useNiveauxQuery(
    form.filiereId ? { filiereId: form.filiereId } : undefined
  );
  const niveauxList = niveaux ?? [];

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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const openAdd = () => {
    setForm(emptyForm);
    setImageFile(null);
    setImagePreview(null);
    setAddOpen(true);
  };

  const openEdit = (item: User) => {
    setForm({
      firstName: item.firstName,
      lastName: item.lastName,
      email: item.email,
      password: "",
      role: item.role,
      isActive: item.isActive,
      filiereId: item.filiereId ?? "",
      niveauId: item.niveauId ?? "",
    });
    setImageFile(null);
    setImagePreview(item.imageUrl ?? null);
    setEditItem(item);
  };

  const handleAdd = async () => {
    if (!form.firstName || !form.lastName || !form.email || !form.password) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      return;
    }
    try {
      const newUser = await ajouterMutation.mutateAsync(form);
      if (imageFile) {
        await userAPI.uploadImage(newUser.id, imageFile);
      }
      toast.success("Étudiant inscrit avec succès");
      setAddOpen(false);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Erreur lors de l'inscription");
    }
  };

  const handleEdit = async () => {
    if (!editItem) return;
    const payload = { ...form };
    if (!payload.password) delete (payload as Partial<UserAddDTO>).password;
    try {
      await modifierMutation.mutateAsync({ id: editItem.id, data: payload });
      if (imageFile) {
        await userAPI.uploadImage(editItem.id, imageFile);
      }
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

  const roleColors: Record<UserRole, string> = {
    etudiant: "bg-blue-100 text-blue-700",
    admin: "bg-red-100 text-red-700",
    professeur: "bg-green-100 text-green-700",
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
        <Button onClick={openAdd} className="gap-2">
          <Plus className="w-4 h-4" /> Inscrire un étudiant
        </Button>
      </div>

      {/* Barre de recherche */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Rechercher..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Tableau */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">Photo</TableHead>
              <TableHead>Nom</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Rôle</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead>Inscrit le</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-10 text-muted-foreground">
                  Chargement...
                </TableCell>
              </TableRow>
            ) : items.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-10 text-muted-foreground">
                  Aucun utilisateur trouvé
                </TableCell>
              </TableRow>
            ) : (
              items.map((user) => (
                <TableRow
                  key={user.id}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => setViewItem(user)}
                >
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <div className="w-9 h-9 rounded-full overflow-hidden bg-muted flex items-center justify-center shrink-0">
                      {user.imageUrl ? (
                        <img
                          src={`http://localhost:8002/${user.imageUrl}`}
                          alt={user.firstName}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-sm font-semibold text-muted-foreground">
                          {user.firstName.charAt(0).toUpperCase()}
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">
                    {user.firstName} {user.lastName}
                  </TableCell>
                  <TableCell className="text-muted-foreground">{user.email}</TableCell>
                  <TableCell>
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${roleColors[user.role]}`}>
                      {USER_ROLE_LABELS[user.role]}
                    </span>
                  </TableCell>
                  <TableCell>
                    {user.isActive ? (
                      <Badge variant="outline" className="gap-1 text-green-600 border-green-200 bg-green-50">
                        <UserCheck className="w-3 h-3" /> Actif
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="gap-1 text-red-600 border-red-200 bg-red-50">
                        <UserX className="w-3 h-3" /> Inactif
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {new Date(user.createdAt).toLocaleDateString("fr-FR", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); openEdit(user); }}>
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:text-destructive"
                        onClick={(e) => { e.stopPropagation(); setDeleteItem(user); }}
                      >
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

      {/* Dialog Inscription */}
      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Inscrire un étudiant</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            {/* Avatar picker */}
            <div className="flex justify-center">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="relative group w-20 h-20 rounded-full border-2 border-dashed border-border hover:border-primary transition-colors overflow-hidden bg-muted flex items-center justify-center"
              >
                {imagePreview ? (
                  <img src={imagePreview} alt="preview" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-2xl font-bold text-muted-foreground">
                    {form.firstName ? form.firstName.charAt(0).toUpperCase() : "👤"}
                  </span>
                )}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Camera className="w-5 h-5 text-white" />
                </div>
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/gif,image/webp"
                className="hidden"
                onChange={handleImageChange}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Prénom *</Label>
                <Input
                  placeholder="Prénom"
                  value={form.firstName}
                  onChange={(e) => setForm((f) => ({ ...f, firstName: e.target.value }))}
                />
              </div>
              <div className="space-y-1.5">
                <Label>Nom *</Label>
                <Input
                  placeholder="Nom"
                  value={form.lastName}
                  onChange={(e) => setForm((f) => ({ ...f, lastName: e.target.value }))}
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Email *</Label>
              <Input
                type="email"
                placeholder="email@exemple.com"
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Mot de passe *</Label>
              <Input
                type="password"
                placeholder="Mot de passe"
                value={form.password}
                onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Rôle</Label>
              <Select
                value={form.role}
                onValueChange={(v) => setForm((f) => ({ ...f, role: v as UserRole }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {(Object.entries(USER_ROLE_LABELS) as [UserRole, string][]).map(([value, label]) => (
                    <SelectItem key={value} value={value}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Statut</Label>
              <Select
                value={form.isActive ? "true" : "false"}
                onValueChange={(v) => setForm((f) => ({ ...f, isActive: v === "true" }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="true">Actif</SelectItem>
                  <SelectItem value="false">Inactif</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Filière <span className="text-muted-foreground text-xs">(optionnel)</span></Label>
              <Select
                value={form.filiereId ?? ""}
                onValueChange={(v) => setForm((f) => ({ ...f, filiereId: v, niveauId: "" }))}
              >
                <SelectTrigger><SelectValue placeholder="Choisir une filière..." /></SelectTrigger>
                <SelectContent>
                  {filieresList.map((filiere) => (
                    <SelectItem key={filiere.id} value={filiere.id}>
                      {filiere.name} ({filiere.code})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {form.filiereId && (
              <div className="space-y-1.5">
                <Label>Niveau <span className="text-muted-foreground text-xs">(optionnel)</span></Label>
                <Select
                  value={form.niveauId ?? ""}
                  onValueChange={(v) => setForm((f) => ({ ...f, niveauId: v }))}
                >
                  <SelectTrigger><SelectValue placeholder="Choisir un niveau..." /></SelectTrigger>
                  <SelectContent>
                    {niveauxList.map((niveau) => (
                      <SelectItem key={niveau.id} value={niveau.id}>{niveau.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Annuler</Button>
            </DialogClose>
            <Button onClick={handleAdd} disabled={ajouterMutation.isPending}>
              {ajouterMutation.isPending ? "Inscription..." : "Inscrire"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog Modification */}
      <Dialog open={!!editItem} onOpenChange={(o) => !o && setEditItem(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Modifier l&apos;utilisateur</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            {/* Avatar picker */}
            <div className="flex justify-center">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="relative group w-20 h-20 rounded-full border-2 border-dashed border-border hover:border-primary transition-colors overflow-hidden bg-muted flex items-center justify-center"
              >
                {imagePreview ? (
                  <img src={imagePreview} alt="preview" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-2xl font-bold text-muted-foreground">
                    {form.firstName ? form.firstName.charAt(0).toUpperCase() : "👤"}
                  </span>
                )}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Camera className="w-5 h-5 text-white" />
                </div>
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/gif,image/webp"
                className="hidden"
                onChange={handleImageChange}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Prénom</Label>
                <Input
                  value={form.firstName}
                  onChange={(e) => setForm((f) => ({ ...f, firstName: e.target.value }))}
                />
              </div>
              <div className="space-y-1.5">
                <Label>Nom</Label>
                <Input
                  value={form.lastName}
                  onChange={(e) => setForm((f) => ({ ...f, lastName: e.target.value }))}
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Email</Label>
              <Input
                type="email"
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Nouveau mot de passe (laisser vide pour ne pas changer)</Label>
              <Input
                type="password"
                placeholder="••••••••"
                value={form.password}
                onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Rôle</Label>
              <Select
                value={form.role}
                onValueChange={(v) => setForm((f) => ({ ...f, role: v as UserRole }))}
              >
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {(Object.entries(USER_ROLE_LABELS) as [UserRole, string][]).map(([value, label]) => (
                    <SelectItem key={value} value={value}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Statut</Label>
              <Select
                value={form.isActive ? "true" : "false"}
                onValueChange={(v) => setForm((f) => ({ ...f, isActive: v === "true" }))}
              >
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="true">Actif</SelectItem>
                  <SelectItem value="false">Inactif</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Filière <span className="text-muted-foreground text-xs">(optionnel)</span></Label>
              <Select
                value={form.filiereId ?? ""}
                onValueChange={(v) => setForm((f) => ({ ...f, filiereId: v, niveauId: "" }))}
              >
                <SelectTrigger><SelectValue placeholder="Choisir une filière..." /></SelectTrigger>
                <SelectContent>
                  {filieresList.map((filiere) => (
                    <SelectItem key={filiere.id} value={filiere.id}>
                      {filiere.name} ({filiere.code})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {form.filiereId && (
              <div className="space-y-1.5">
                <Label>Niveau <span className="text-muted-foreground text-xs">(optionnel)</span></Label>
                <Select
                  value={form.niveauId ?? ""}
                  onValueChange={(v) => setForm((f) => ({ ...f, niveauId: v }))}
                >
                  <SelectTrigger><SelectValue placeholder="Choisir un niveau..." /></SelectTrigger>
                  <SelectContent>
                    {niveauxList.map((niveau) => (
                      <SelectItem key={niveau.id} value={niveau.id}>{niveau.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditItem(null)}>Annuler</Button>
            <Button onClick={handleEdit} disabled={modifierMutation.isPending}>
              {modifierMutation.isPending ? "Enregistrement..." : "Enregistrer"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog Suppression */}
      <Dialog open={!!deleteItem} onOpenChange={(o) => !o && setDeleteItem(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Supprimer l&apos;utilisateur</DialogTitle>
          </DialogHeader>
          <p className="text-muted-foreground text-sm">
            Voulez-vous vraiment supprimer{" "}
            <span className="font-semibold text-foreground">
              {deleteItem?.firstName} {deleteItem?.lastName}
            </span>{" "}
            ? Cette action est irréversible.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteItem(null)}>Annuler</Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={supprimerMutation.isPending}
            >
              {supprimerMutation.isPending ? "Suppression..." : "Supprimer"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog Détail étudiant */}
      <Dialog open={!!viewItem} onOpenChange={(o) => !o && setViewItem(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Fiche étudiant</DialogTitle>
          </DialogHeader>
          {viewItem && (
            <div className="space-y-5 py-1">
              {/* Avatar */}
              <div className="flex flex-col items-center gap-3">
                <div className="w-24 h-24 rounded-full overflow-hidden bg-muted flex items-center justify-center ring-4 ring-border">
                  {viewItem.imageUrl ? (
                    <img
                      src={`http://localhost:8002/${viewItem.imageUrl}`}
                      alt={viewItem.firstName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-3xl font-bold text-muted-foreground">
                      {viewItem.firstName.charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
                <div className="text-center">
                  <p className="text-lg font-semibold">{viewItem.firstName} {viewItem.lastName}</p>
                  <p className="text-sm text-muted-foreground">{viewItem.email}</p>
                </div>
              </div>

              {/* Infos */}
              <div className="rounded-lg border border-border divide-y divide-border text-sm">
                <div className="flex justify-between px-4 py-2.5">
                  <span className="text-muted-foreground">Rôle</span>
                  <span className="font-medium">{USER_ROLE_LABELS[viewItem.role]}</span>
                </div>
                <div className="flex justify-between px-4 py-2.5">
                  <span className="text-muted-foreground">Statut</span>
                  {viewItem.isActive ? (
                    <Badge variant="outline" className="gap-1 text-green-600 border-green-200 bg-green-50 text-xs">
                      <UserCheck className="w-3 h-3" /> Actif
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="gap-1 text-red-600 border-red-200 bg-red-50 text-xs">
                      <UserX className="w-3 h-3" /> Inactif
                    </Badge>
                  )}
                </div>
                <div className="flex justify-between px-4 py-2.5">
                  <span className="text-muted-foreground">Filière</span>
                  <span className="font-medium">
                    {viewItem.filiere ? `${viewItem.filiere.name} (${viewItem.filiere.code})` : "—"}
                  </span>
                </div>
                <div className="flex justify-between px-4 py-2.5">
                  <span className="text-muted-foreground">Niveau</span>
                  <span className="font-medium">{viewItem.niveau?.name ?? "—"}</span>
                </div>
                <div className="flex justify-between px-4 py-2.5">
                  <span className="text-muted-foreground">Inscrit le</span>
                  <span className="font-medium">
                    {new Date(viewItem.createdAt).toLocaleDateString("fr-FR", {
                      day: "numeric", month: "long", year: "numeric",
                    })}
                  </span>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setViewItem(null)}>Fermer</Button>
            <Button onClick={() => { setViewItem(null); openEdit(viewItem!); }}>
              Modifier
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
