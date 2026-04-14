"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UserAddDTO, UserRole, USER_ROLE_LABELS } from "@/features/users/types/user.type";
import { useFilieresQuery } from "@/features/filieres/queries/filiere.query";
import { useNiveauxQuery } from "@/features/niveaux/queries/niveau.query";
import AvatarPicker from "./AvatarPicker";

const emptyForm: UserAddDTO = {
  firstName: "", lastName: "", email: "", password: "",
  role: "etudiant", isActive: true, filiereId: "", niveauId: "",
};

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (form: UserAddDTO, imageFile: File | null) => Promise<void>;
  isPending: boolean;
}

export default function AddEtudiantDialog({ open, onOpenChange, onAdd, isPending }: Props) {
  const [form, setForm] = useState<UserAddDTO>(emptyForm);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const { data: filieres } = useFilieresQuery();
  const filieresList = (filieres ?? []).filter((f) => f.isActive);
  const { data: niveaux } = useNiveauxQuery(form.filiereId ? { filiereId: form.filiereId } : undefined);
  const niveauxList = niveaux ?? [];

  const reset = () => { setForm(emptyForm); setImageFile(null); setImagePreview(null); };

  const handleOpenChange = (o: boolean) => { if (!o) reset(); onOpenChange(o); };

  const handleSubmit = async () => {
    await onAdd(form, imageFile);
    reset();
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Inscrire un étudiant</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <AvatarPicker
            preview={imagePreview}
            firstName={form.firstName}
            onChange={(file) => { setImageFile(file); setImagePreview(URL.createObjectURL(file)); }}
          />
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Prénom *</Label>
              <Input placeholder="Prénom" value={form.firstName} onChange={(e) => setForm((f) => ({ ...f, firstName: e.target.value }))} />
            </div>
            <div className="space-y-1.5">
              <Label>Nom *</Label>
              <Input placeholder="Nom" value={form.lastName} onChange={(e) => setForm((f) => ({ ...f, lastName: e.target.value }))} />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label>Email *</Label>
            <Input type="email" placeholder="email@exemple.com" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} />
          </div>
          <div className="space-y-1.5">
            <Label>Mot de passe *</Label>
            <Input type="password" placeholder="Mot de passe" value={form.password} onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))} />
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
          <DialogClose asChild><Button variant="outline">Annuler</Button></DialogClose>
          <Button onClick={handleSubmit} disabled={isPending}>
            {isPending ? "Inscription..." : "Inscrire"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
