"use client";

import { Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Document, DocumentType, DOCUMENT_TYPE_LABELS,
} from "@/features/documents/types/document.type";
import { getFiliereColors } from "@/lib/filiere-colors";
import { Badge } from "@/components/ui/badge";

const typeColors: Record<DocumentType, string> = {
  devoir: "bg-orange-100 text-orange-700",
  sujet_examen: "bg-red-100 text-red-700",
  td: "bg-green-100 text-green-700",
  tp: "bg-purple-100 text-purple-700",
  support_cours: "bg-blue-100 text-blue-700",
};

interface Props {
  documents: Document[] | undefined;
  isLoading: boolean;
  onEdit: (doc: Document) => void;
  onDelete: (doc: Document) => void;
}

export function DocumentsTable({ documents, isLoading, onEdit, onDelete }: Props) {
  return (
    <div className="border rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead>Nom</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Filière</TableHead>
            <TableHead>Niveau</TableHead>
            <TableHead>Matière</TableHead>
            <TableHead>Format</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-12 text-muted-foreground">
                Chargement…
              </TableCell>
            </TableRow>
          ) : (documents ?? []).length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-12 text-muted-foreground">
                Aucun document trouvé
              </TableCell>
            </TableRow>
          ) : (
            (documents ?? []).map((doc) => (
              <TableRow key={doc.id}>
                <TableCell className="font-medium max-w-[180px] truncate">{doc.name}</TableCell>
                <TableCell>
                  <span className={`inline-flex px-2 py-0.5 rounded text-xs font-medium ${typeColors[doc.type]}`}>
                    {DOCUMENT_TYPE_LABELS[doc.type]}
                  </span>
                </TableCell>
                <TableCell>
                  {(() => {
                    const c = getFiliereColors(doc.filiere?.code ?? "");
                    return (
                      <span className={`inline-flex px-2 py-0.5 rounded text-xs font-bold ${c.light} ${c.lightText}`}>
                        {doc.filiere?.name ?? doc.filiereId}
                      </span>
                    );
                  })()}
                </TableCell>
                <TableCell>
                  {(() => {
                    const c = getFiliereColors(doc.filiere?.code ?? "");
                    return (
                      <span className={`inline-flex px-2 py-0.5 rounded text-xs font-medium ${c.light} ${c.lightText}`}>
                        {doc.niveau?.name ?? doc.niveauId}
                      </span>
                    );
                  })()}
                </TableCell>
                <TableCell className="text-muted-foreground text-sm">
                  {doc.matiere?.name ?? "—"}
                </TableCell>
                <TableCell>
                  <Badge variant={doc.fileType === "pdf" ? "default" : "secondary"}>
                    {doc.fileType.toUpperCase()}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <Button variant="ghost" size="icon" onClick={() => onEdit(doc)}>
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive hover:text-destructive"
                      onClick={() => onDelete(doc)}
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
