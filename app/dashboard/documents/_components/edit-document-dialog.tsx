"use client";

import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { DocumentFormFields, DocumentFormValues } from "./document-form-fields";
import { Document } from "@/features/documents/types/document.type";
import { useModifierDocumentMutation } from "@/features/documents/mutations/document.mutation";
import { Filiere } from "@/features/filieres/types/filiere.type";
import { Niveau } from "@/features/niveaux/types/niveau.type";
import { Matiere } from "@/features/matieres/types/matiere.type";

interface Props {
  document: Document | null;
  onClose: () => void;
  filieres: Filiere[];
  allNiveaux: Niveau[];
  allMatieres: Matiere[];
}

export function EditDocumentDialog({
  document, onClose, filieres, allNiveaux, allMatieres,
}: Props) {
  const [form, setForm] = useState<DocumentFormValues>({
    name: "",
    type: "support_cours",
    filiereId: "",
    niveauId: "",
    matiereId: "",
  });
  const mutation = useModifierDocumentMutation();

  useEffect(() => {
    if (document) {
      setForm({
        name: document.name,
        type: document.type,
        filiereId: document.filiereId ?? "",
        niveauId: document.niveauId ?? "",
        matiereId: document.matiereId ?? "",
      });
    }
  }, [document]);

  const handleSubmit = () => {
    if (!document) return;
    mutation.mutate(
      {
        id: document.id,
        data: {
          name: form.name,
          type: form.type,
          filiereId: form.filiereId,
          niveauId: form.niveauId,
          matiereId: form.matiereId || undefined,
        },
      },
      {
        onSuccess: () => {
          onClose();
          toast.success("Document modifié");
        },
        onError: () => toast.error("Erreur lors de la modification"),
      }
    );
  };

  return (
    <Dialog open={!!document} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Modifier le document</DialogTitle>
        </DialogHeader>
        <DocumentFormFields
          values={form}
          onChange={setForm}
          filieres={filieres}
          allNiveaux={allNiveaux}
          allMatieres={allMatieres}
        />
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Annuler</Button>
          </DialogClose>
          <Button onClick={handleSubmit} disabled={mutation.isPending}>
            {mutation.isPending ? "Modification…" : "Enregistrer"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
