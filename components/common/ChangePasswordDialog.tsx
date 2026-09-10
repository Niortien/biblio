"use client";

import { useState } from "react";
import { KeyRound, Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger,
} from "@/components/ui/dialog";
import { useChangerMotDePasseMutation } from "@/features/auth/mutations/auth.mutation";

const emptyForm = { currentPassword: "", newPassword: "", confirmPassword: "" };

interface Props {
  /** Clé localStorage du token de l'espace courant (etudiant_token, professeur_token). Omis pour l'espace admin. */
  tokenKey?: string;
  triggerVariant?: "ghost" | "outline";
  triggerClassName?: string;
}

export default function ChangePasswordDialog({ tokenKey, triggerVariant = "ghost", triggerClassName }: Props) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [showPasswords, setShowPasswords] = useState(false);
  const mutation = useChangerMotDePasseMutation(tokenKey);

  const reset = () => setForm(emptyForm);

  const handleOpenChange = (o: boolean) => {
    if (!o) reset();
    setOpen(o);
  };

  const handleSubmit = async () => {
    if (!form.currentPassword || !form.newPassword || !form.confirmPassword) {
      toast.error("Veuillez remplir tous les champs");
      return;
    }
    if (form.newPassword.length < 6) {
      toast.error("Le nouveau mot de passe doit contenir au moins 6 caractères");
      return;
    }
    if (form.newPassword !== form.confirmPassword) {
      toast.error("Les deux mots de passe ne correspondent pas");
      return;
    }
    try {
      await mutation.mutateAsync({
        currentPassword: form.currentPassword,
        newPassword: form.newPassword,
      });
      toast.success("Mot de passe mis à jour avec succès");
      handleOpenChange(false);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Erreur lors du changement de mot de passe");
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant={triggerVariant} size="sm" className={triggerClassName ?? "gap-2 text-muted-foreground hover:text-foreground"}>
          <KeyRound className="w-4 h-4" />
          Changer le mot de passe
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Changer le mot de passe</DialogTitle>
          <DialogDescription>
            Entrez votre mot de passe actuel puis votre nouveau mot de passe.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-1.5">
            <Label>Mot de passe actuel *</Label>
            <Input
              type={showPasswords ? "text" : "password"}
              autoComplete="current-password"
              value={form.currentPassword}
              onChange={(e) => setForm((f) => ({ ...f, currentPassword: e.target.value }))}
            />
          </div>
          <div className="space-y-1.5">
            <Label>Nouveau mot de passe *</Label>
            <Input
              type={showPasswords ? "text" : "password"}
              autoComplete="new-password"
              value={form.newPassword}
              onChange={(e) => setForm((f) => ({ ...f, newPassword: e.target.value }))}
            />
          </div>
          <div className="space-y-1.5">
            <Label>Confirmer le nouveau mot de passe *</Label>
            <Input
              type={showPasswords ? "text" : "password"}
              autoComplete="new-password"
              value={form.confirmPassword}
              onChange={(e) => setForm((f) => ({ ...f, confirmPassword: e.target.value }))}
            />
          </div>
          <button
            type="button"
            onClick={() => setShowPasswords((v) => !v)}
            className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            {showPasswords ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            {showPasswords ? "Masquer" : "Afficher"} les mots de passe
          </button>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => handleOpenChange(false)}>Annuler</Button>
          <Button onClick={handleSubmit} disabled={mutation.isPending}>
            {mutation.isPending ? "Mise à jour..." : "Mettre à jour"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
