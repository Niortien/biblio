"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { User, UserAddDTO, UserRole, USER_ROLE_LABELS } from "@/features/users/types/user.type";
import { useFilieresQuery } from "@/features/filieres/queries/filiere.query";
import { useNiveauxQuery } from "@/features/niveaux/queries/niveau.query";
import AvatarPicker from "./AvatarPicker";

interface Props {
  item: User | null;
  onClose: () => void;
  onEdit: (form: UserAddDTO, imageFile: File | null) => Promise<void>;
  isPending: boolean;
}

export default function EditEtudiantDialog({ item, onClose, onEdit, isPending }: Props) {
  const [form, setForm] = useState<UserAddDTO>({
    firstName: "", lastName: "", email: "", password: "",
    role: "etudiant", isActive: true, filiereId: "", niveauId: "",
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const { data: filieres } = useFilieresQuery();
  const filieresList = (filieres ?? []).filter((f) => f.isActive);
  const { data: niveaux } = useNiveauxQuery(form.filiereId ? { filiereId: form.filiereId } : undefined);
  const niveauxList = niveaux ?? [];

  useEffect(() => {
    if (item) {
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
    }
  }, [item]);

  return (
    <Dialog open={!!item} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Modifier l&apos;utilisateur</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <AvatarPicker
            preview={imagePreview}
            firstName={form.firstName}
            onChange={(file) => { setImageFile(file); setImagePreview(URL.createObjectURL(file)); }}
          />
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Prénom</Label>
              <Input value={form.firstName} onChange={(e) => setForm((f) => ({ ...f, firstName: e.target.value }))} />
            </div>
            <div className="space-y-1.5">
              <Label>Nom</Label>
              <Input value={form.lastName} onChange={(e) => setForm((f) => ({ ...f, lastName: e.target.value }))} />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label>Email</Label>
            <Input type="email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} />
          </div>
          <div className="space-y-1.5">
            <Label>Nouveau mot de passe (laisser vide pour ne pas changer)</Label>
            <Input type="password" placeholder="••••••••" value={form.password} onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))} />
          </div>
          <div className="space-y-1.5">
            <Label>Rôle</Label>
            <Select value={form.role} onValueChange={(v) => setForm((f) => ({ ...f, role: v as UserRole }))}>
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
            <Select value={form.isActive ? "true" : "false"} onValueChange={(v) => setForm((f) => ({ ...f, isActive: v === "true" }))}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="true">Actif</SelectItem>
                <SelectItem value="false">Inactif</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Filière <span className="text-muted-foreground text-xs">(optionnel)</span></Label>
            <Select value={form.filiereId ?? ""} onValueChange={(v) => setForm((f) => ({ ...f, filiereId: v, niveauId: "" }))}>
              <SelectTrigger><SelectValue placeholder="Choisir une filière..." /></SelectTrigger>
              <SelectContent>
                {filieresList.map((filiere) => (
                  <SelectItem key={filiere.id} value={filiere.id}>{filiere.name} ({filiere.code})</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {form.filiereId && (
            <div className="space-y-1.5">
              <Label>Niveau <span className="text-muted-foreground text-xs">(optionnel)</span></Label>
              <Select value={form.niveauId ?? ""} onValueChange={(v) => setForm((f) => ({ ...f, niveauId: v }))}>
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
          <Button variant="outline" onClick={onClose}>Annuler</Button>
          <Button onClick={() => onEdit(form, imageFile)} disabled={isPending}>
            {isPending ? "Enregistrement..." : "Enregistrer"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
