"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDocumentsQuery } from "@/features/documents/queries/document.query";
import { useFilieresQuery } from "@/features/filieres/queries/filiere.query";
import { useNiveauxQuery } from "@/features/niveaux/queries/niveau.query";
import { useMatieresQuery } from "@/features/matieres/queries/matiere.query";
import { Document } from "@/features/documents/types/document.type";
import { DocumentsFilters } from "./_components/documents-filters";
import { DocumentsTable } from "./_components/documents-table";
import { AddDocumentDialog } from "./_components/add-document-dialog";
import { EditDocumentDialog } from "./_components/edit-document-dialog";
import { DeleteDocumentDialog } from "./_components/delete-document-dialog";

type Filters = { filiereId?: string; niveauId?: string };

export default function DocumentsPage() {
  const [filters, setFilters] = useState<Filters>({});
  const [addOpen, setAddOpen] = useState(false);
  const [editDoc, setEditDoc] = useState<Document | null>(null);
  const [deleteDoc, setDeleteDoc] = useState<Document | null>(null);

  const { data: documents, isLoading } = useDocumentsQuery(filters);
  const { data: filieres = [] } = useFilieresQuery();
  const { data: allNiveaux = [] } = useNiveauxQuery();
  const { data: allMatieres = [] } = useMatieresQuery();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Documents</h1>
          <p className="text-muted-foreground text-sm mt-0.5">
            Gérez tous les fichiers de la bibliothèque
          </p>
        </div>
        <Button onClick={() => setAddOpen(true)} className="gap-2">
          <Plus className="w-4 h-4" /> Ajouter
        </Button>
      </div>

      <DocumentsFilters
        filters={filters}
        filieres={filieres}
        allNiveaux={allNiveaux}
        onChange={setFilters}
      />

      <DocumentsTable
        documents={documents}
        isLoading={isLoading}
        onEdit={setEditDoc}
        onDelete={setDeleteDoc}
      />

      <AddDocumentDialog
        open={addOpen}
        onOpenChange={setAddOpen}
        filieres={filieres}
        allNiveaux={allNiveaux}
        allMatieres={allMatieres}
      />

      <EditDocumentDialog
        document={editDoc}
        onClose={() => setEditDoc(null)}
        filieres={filieres}
        allNiveaux={allNiveaux}
        allMatieres={allMatieres}
      />

      <DeleteDocumentDialog
        document={deleteDoc}
        onClose={() => setDeleteDoc(null)}
      />
    </div>
  );
}