import { Button } from "@/components/ui/button";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import { User } from "@/features/users/types/user.type";

interface Props {
  item: User | null;
  onClose: () => void;
  onDelete: () => Promise<void>;
  isPending: boolean;
}

export default function DeleteEtudiantDialog({ item, onClose, onDelete, isPending }: Props) {
  return (
    <Dialog open={!!item} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Supprimer l&apos;utilisateur</DialogTitle>
        </DialogHeader>
        <p className="text-muted-foreground text-sm">
          Voulez-vous vraiment supprimer{" "}
          <span className="font-semibold text-foreground">
            {item?.firstName} {item?.lastName}
          </span>{" "}
          ? Cette action est irréversible.
        </p>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Annuler</Button>
          <Button variant="destructive" onClick={onDelete} disabled={isPending}>
            {isPending ? "Suppression..." : "Supprimer"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
