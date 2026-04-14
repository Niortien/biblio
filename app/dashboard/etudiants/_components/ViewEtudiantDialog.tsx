import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import { User, USER_ROLE_LABELS } from "@/features/users/types/user.type";
import { UserCheck, UserX } from "lucide-react";

interface Props {
  item: User | null;
  onClose: () => void;
  onEdit: (item: User) => void;
}

export default function ViewEtudiantDialog({ item, onClose, onEdit }: Props) {
  return (
    <Dialog open={!!item} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Fiche étudiant</DialogTitle>
        </DialogHeader>
        {item && (
          <div className="space-y-5 py-1">
            <div className="flex flex-col items-center gap-3">
              <div className="w-24 h-24 rounded-full overflow-hidden bg-muted flex items-center justify-center ring-4 ring-border">
                {item.imageUrl ? (
                  <img
                    src={`http://localhost:8002/${item.imageUrl}`}
                    alt={item.firstName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-3xl font-bold text-muted-foreground">
                    {item.firstName.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
              <div className="text-center">
                <p className="text-lg font-semibold">{item.firstName} {item.lastName}</p>
                <p className="text-sm text-muted-foreground">{item.email}</p>
              </div>
            </div>
            <div className="rounded-lg border border-border divide-y divide-border text-sm">
              <div className="flex justify-between px-4 py-2.5">
                <span className="text-muted-foreground">Rôle</span>
                <span className="font-medium">{USER_ROLE_LABELS[item.role]}</span>
              </div>
              <div className="flex justify-between px-4 py-2.5">
                <span className="text-muted-foreground">Statut</span>
                {item.isActive ? (
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
                  {item.filiere ? `${item.filiere.name} (${item.filiere.code})` : "—"}
                </span>
              </div>
              <div className="flex justify-between px-4 py-2.5">
                <span className="text-muted-foreground">Niveau</span>
                <span className="font-medium">{item.niveau?.name ?? "—"}</span>
              </div>
              <div className="flex justify-between px-4 py-2.5">
                <span className="text-muted-foreground">Inscrit le</span>
                <span className="font-medium">
                  {new Date(item.createdAt).toLocaleDateString("fr-FR", {
                    day: "numeric", month: "long", year: "numeric",
                  })}
                </span>
              </div>
            </div>
          </div>
        )}
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Fermer</Button>
          <Button onClick={() => { onClose(); onEdit(item!); }}>Modifier</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
