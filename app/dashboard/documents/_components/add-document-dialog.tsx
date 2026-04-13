"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { DocumentFormFields, DocumentFormValues } from "./document-form-fields";
import { DocumentAddDTO } from "@/features/documents/types/document.type";
import { useAjouterDocumentMutation } from "@/features/documents/mutations/document.mutation";
import { Filiere } from "@/features/filieres/types/filiere.type";
import { Niveau } from "@/features/niveaux/types/niveau.type";
import { Matiere } from "@/features/matieres/types/matiere.type";

const emptyForm: DocumentFormValues = {
  name: "",
  type: "support_cours",
  filiereId: "",
  niveauId: "",
  matiereId: "",
  file: null,
};

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  filieres: Filiere[];
  allNiveaux: Niveau[];
  allMatieres: Matiere[];
}

export function AddDocumentDialog({
  open, onOpenChange, filieres, allNiveaux, allMatieres,
}: Props) {
  const [form, setForm] = useState<DocumentFormValues>(emptyForm);
  const mutation = useAjouterDocumentMutation();

  const handleClose = (o: boolean) => {
    if (!o) setForm(emptyForm);
    onOpenChange(o);
  };

  const handleSubmit = () => {
    if (!form.file) return;
    mutation.mutate(
      {
        name: form.name,
        type: form.type,
        filiereId: form.filiereId,
        niveauId: form.niveauId,
        matiereId: form.matiereId || undefined,
        file: form.file,
      } as DocumentAddDTO,
      {
        onSuccess: () => {
          handleClose(false);
          toast.success("Document ajouté");
        },
        onError: () => toast.error("Erreur lors de l'ajout"),
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Ajouter un document</DialogTitle>
        </DialogHeader>
        <DocumentFormFields
          values={form}
          onChange={setForm}
          filieres={filieres}
          allNiveaux={allNiveaux}
          allMatieres={allMatieres}
          showFile
        />
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Annuler</Button>
          </DialogClose>
          <Button
            onClick={handleSubmit}
            disabled={
              mutation.isPending ||
              !form.file ||
              !form.name ||
              !form.filiereId ||
              !form.niveauId
            }
          >
            {mutation.isPending ? "Upload…" : "Ajouter"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
