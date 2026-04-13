"use client";

import toast from "react-hot-toast";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Document } from "@/features/documents/types/document.type";
import { useSupprimerDocumentMutation } from "@/features/documents/mutations/document.mutation";

interface Props {
  document: Document | null;
  onClose: () => void;
}

export function DeleteDocumentDialog({ document, onClose }: Props) {
  const mutation = useSupprimerDocumentMutation();

  return (
    <Dialog open={!!document} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Supprimer le document</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-muted-foreground">
          Supprimer <strong>{document?.name}</strong> ? Cette action est irréversible.
        </p>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Annuler</Button>
          </DialogClose>
          <Button
            variant="destructive"
            disabled={mutation.isPending}
            onClick={() =>
              document &&
              mutation.mutate(document.id, {
                onSuccess: () => {
                  onClose();
                  toast.success("Document supprimé");
                },
                onError: () => toast.error("Erreur lors de la suppression"),
              })
            }
          >
            {mutation.isPending ? "Suppression…" : "Supprimer"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
