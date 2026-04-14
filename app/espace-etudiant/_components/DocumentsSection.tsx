"use client";

import { FileX, Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Document } from "@/features/documents/types/document.type";
import { DocumentType, DOCUMENT_TYPE_LABELS } from "@/features/documents/types/document.type";
import DocumentCard from "@/components/common/document-card";

interface Filiere { code: string }
interface Niveau  { name: string }

interface Props {
  documents: Document[];
  isLoading: boolean;
  search: string;
  onSearchChange: (v: string) => void;
  selectedType: DocumentType | null;
  onClearType: () => void;
  myFiliere: Filiere | undefined;
  myNiveau: Niveau | undefined;
}

export default function DocumentsSection({
  documents, isLoading, search, onSearchChange, selectedType, onClearType, myFiliere, myNiveau,
}: Props) {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 pb-16">

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 animate-fade-in-up" style={{ animationDelay: "0.55s" }}>
        <div>
          <h2 className="text-xl font-bold text-foreground">
            {myFiliere
              ? `📂 ${myFiliere.code}${myNiveau ? ` · ${myNiveau.name}` : ""}`
              : "📂 Tous les documents"}
          </h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            {isLoading
              ? "Chargement..."
              : `${documents.length} document${documents.length !== 1 ? "s" : ""}${selectedType ? ` · ${DOCUMENT_TYPE_LABELS[selectedType]}` : ""}`}
          </p>
        </div>
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher un document..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9 rounded-xl border-border focus:border-primary transition-colors"
          />
        </div>
      </div>

      {/* Filtre actif */}
      {selectedType && (
        <div className="flex items-center gap-2 mb-6 animate-fade-in">
          <span className="text-sm text-muted-foreground">Filtre actif :</span>
          <button
            onClick={onClearType}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/80 transition-colors"
          >
            {DOCUMENT_TYPE_LABELS[selectedType]}
            <X className="w-3 h-3" />
          </button>
        </div>
      )}

      {/* Grille */}
      {isLoading ? (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="h-36 rounded-2xl bg-muted animate-pulse"
              style={{ animationDelay: `${i * 0.08}s` }}
            />
          ))}
        </div>
      ) : documents.length > 0 ? (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
          {documents.map((doc, i) => (
            <div key={doc.id} className="animate-fade-in-up" style={{ animationDelay: `${i * 0.05}s` }}>
              <DocumentCard document={doc} />
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-24 animate-fade-in">
          <div className="w-20 h-20 rounded-3xl bg-muted flex items-center justify-center mb-5">
            <FileX className="w-10 h-10 text-muted-foreground/40" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-1">Aucun document trouvé</h3>
          <p className="text-muted-foreground text-sm text-center max-w-xs">
            {selectedType
              ? "Aucun document pour ce type. Essayez un autre filtre."
              : "Aucune ressource disponible pour votre cursus pour l'instant."}
          </p>
          {selectedType && (
            <button onClick={onClearType} className="mt-4 text-primary text-sm font-medium hover:underline">
              Effacer le filtre
            </button>
          )}
        </div>
      )}
    </div>
  );
}
