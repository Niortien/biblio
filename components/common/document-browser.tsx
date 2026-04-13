"use client";
import { useDocumentsQuery } from "@/features/documents/queries/document.query";
import { useFilieresQuery } from "@/features/filieres/queries/filiere.query";
import { useNiveauxQuery } from "@/features/niveaux/queries/niveau.query";
import { DocumentType } from "@/features/documents/types/document.type";
import { Filiere } from "@/features/filieres/types/filiere.type";
import { FileX, Loader2 } from "lucide-react";
import { useState } from "react";
import DocumentCard from "./document-card";
import DocumentFilters from "./document-filters";
import ProgramCard from "./program-card";

const DocumentBrowser = () => {
  const [selectedFiliere, setSelectedFiliere] = useState<Filiere | null>(null);
  const [selectedNiveauId, setSelectedNiveauId] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<DocumentType | null>(null);

  const { data: filieres, isLoading: filieresLoading } = useFilieresQuery();
  const { data: niveaux } = useNiveauxQuery(
    selectedFiliere ? { filiereId: selectedFiliere.id } : undefined
  );
  const { data: documents, isLoading: docsLoading } = useDocumentsQuery({
    filiereId: selectedFiliere?.id,
    niveauId: selectedNiveauId ?? undefined,
    type: selectedType ?? undefined,
  });

  const filieresList = (filieres ?? []).filter((f) => f.isActive);
  const niveauxList = niveaux ?? [];
  const documentsList = documents ?? [];

  const handleFiliereClick = (filiere: Filiere) => {
    if (selectedFiliere?.id === filiere.id) {
      setSelectedFiliere(null);
    } else {
      setSelectedFiliere(filiere);
      setSelectedNiveauId(null);
    }
  };

  return (
    <div className="py-16 md:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Filieres Section */}
        <section id="programs" className="mb-16">
          <div className="text-center mb-10">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              Choisissez votre filiÃ¨re
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              SÃ©lectionnez votre filiÃ¨re pour accÃ©der Ã  tous les documents
              disponibles
            </p>
          </div>

          {filieresLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filieresList.map((filiere) => (
                <ProgramCard
                  key={filiere.id}
                  filiere={filiere}
                  isSelected={selectedFiliere?.id === filiere.id}
                  onClick={() => handleFiliereClick(filiere)}
                />
              ))}
            </div>
          )}
        </section>

        {/* Documents Section */}
        <section id="documents">
          <div className="bg-card rounded-3xl border border-border p-6 md:p-8 shadow-card">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
              <div>
                <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-2">
                  {selectedFiliere
                    ? `Documents â€” ${selectedFiliere.code}`
                    : "Tous les documents"}
                </h2>
                <p className="text-muted-foreground">
                  {docsLoading
                    ? "Chargementâ€¦"
                    : `${documentsList.length} document${documentsList.length !== 1 ? "s" : ""} disponible${documentsList.length !== 1 ? "s" : ""}`}
                </p>
              </div>

              {selectedFiliere && (
                <button
                  onClick={() => {
                    setSelectedFiliere(null);
                    setSelectedNiveauId(null);
                    setSelectedType(null);
                  }}
                  className="text-sm text-primary hover:underline"
                >
                  Voir toutes les filiÃ¨res
                </button>
              )}
            </div>

            {/* Filters */}
            <div className="mb-8 pb-8 border-b border-border">
              <DocumentFilters
                selectedNiveauId={selectedNiveauId}
                selectedType={selectedType}
                onNiveauChange={setSelectedNiveauId}
                onTypeChange={setSelectedType}
                niveaux={niveauxList}
              />
            </div>

            {/* Documents Grid */}
            {docsLoading ? (
              <div className="flex justify-center py-16">
                <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
              </div>
            ) : documentsList.length > 0 ? (
              <div className="grid md:grid-cols-2 gap-4">
                {documentsList.map((doc) => (
                  <DocumentCard key={doc.id} document={doc} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <FileX className="w-16 h-16 text-muted-foreground/50 mx-auto mb-4" />
                <h3 className="font-display text-xl font-semibold text-foreground mb-2">
                  Aucun document trouvÃ©
                </h3>
                <p className="text-muted-foreground max-w-md mx-auto">
                  Il n&apos;y a pas encore de documents correspondant Ã  vos
                  critÃ¨res. Essayez de modifier vos filtres.
                </p>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};


export default DocumentBrowser;
