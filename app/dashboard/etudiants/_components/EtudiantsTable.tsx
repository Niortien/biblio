import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Pencil, Trash2, UserCheck, UserX } from "lucide-react";
import { User, UserRole, USER_ROLE_LABELS } from "@/features/users/types/user.type";

const roleColors: Record<UserRole, string> = {
  etudiant: "bg-blue-100 text-blue-700",
  admin: "bg-red-100 text-red-700",
  professeur: "bg-green-100 text-green-700",
};

interface Props {
  items: User[];
  isLoading: boolean;
  onView: (user: User) => void;
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
}

export default function EtudiantsTable({ items, isLoading, onView, onEdit, onDelete }: Props) {
  return (
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
                onClick={() => onView(user)}
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
                    day: "numeric", month: "short", year: "numeric",
                  })}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); onEdit(user); }}>
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive hover:text-destructive"
                      onClick={(e) => { e.stopPropagation(); onDelete(user); }}
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
  );
}
