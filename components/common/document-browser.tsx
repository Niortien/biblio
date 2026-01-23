"use client";
import {
  documents,
  DocumentType,
  Level,
  Program,
  programs,
} from "@/data/documents";
import { FileX } from "lucide-react";
import { useMemo, useState } from "react";
import DocumentCard from "./document-card";
import DocumentFilters from "./document-filters";
import ProgramCard from "./program-card";

const DocumentBrowser = () => {
  const [selectedProgram, setSelectedProgram] = useState<Program | null>(null);
  const [selectedLevel, setSelectedLevel] = useState<Level | "all">("all");
  const [selectedType, setSelectedType] = useState<DocumentType | "all">("all");

  const selectedProgramData = useMemo(
    () => programs.find((p) => p.name === selectedProgram),
    [selectedProgram]
  );

  const filteredDocuments = useMemo(() => {
    let filtered = documents;

    if (selectedProgram) {
      filtered = filtered.filter((doc) => doc.program === selectedProgram);
    }

    if (selectedLevel !== "all") {
      filtered = filtered.filter((doc) => doc.level === selectedLevel);
    }

    if (selectedType !== "all") {
      filtered = filtered.filter((doc) => doc.type === selectedType);
    }

    return filtered;
  }, [selectedProgram, selectedLevel, selectedType]);

  const handleProgramClick = (program: Program) => {
    if (selectedProgram === program) {
      setSelectedProgram(null);
    } else {
      setSelectedProgram(program);
      setSelectedLevel("all");
    }
  };

  return (
    <div className="py-16 md:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Programs Section */}
        <section id="programs" className="mb-16">
          <div className="text-center mb-10">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              Choisissez votre filière
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Sélectionnez votre filière pour accéder à tous les documents
              disponibles
            </p>
          </div>

          {/* Licence Programs */}
          <div className="mb-10">
            <h3 className="font-display text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full gradient-primary" />
              Licence
            </h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {programs
                .filter((p) => p.levels.includes("L1"))
                .map((program) => (
                  <ProgramCard
                    key={program.name}
                    {...program}
                    isSelected={selectedProgram === program.name}
                    onClick={() => handleProgramClick(program.name)}
                  />
                ))}
            </div>
          </div>

          {/* Master Programs */}
          <div>
            <h3 className="font-display text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full gradient-secondary" />
              Master
            </h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {programs
                .filter((p) => p.levels.includes("M1"))
                .map((program) => (
                  <ProgramCard
                    key={program.name}
                    {...program}
                    isSelected={selectedProgram === program.name}
                    onClick={() => handleProgramClick(program.name)}
                  />
                ))}
            </div>
          </div>
        </section>

        {/* Documents Section */}
        <section id="documents">
          <div className="bg-card rounded-3xl border border-border p-6 md:p-8 shadow-card">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
              <div>
                <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-2">
                  {selectedProgram
                    ? `Documents - ${selectedProgram}`
                    : "Tous les documents"}
                </h2>
                <p className="text-muted-foreground">
                  {filteredDocuments.length} document
                  {filteredDocuments.length > 1 ? "s" : ""} disponible
                  {filteredDocuments.length > 1 ? "s" : ""}
                </p>
              </div>

              {selectedProgram && (
                <button
                  onClick={() => {
                    setSelectedProgram(null);
                    setSelectedLevel("all");
                    setSelectedType("all");
                  }}
                  className="text-sm text-primary hover:underline"
                >
                  Voir toutes les filières
                </button>
              )}
            </div>

            {/* Filters */}
            <div className="mb-8 pb-8 border-b border-border">
              <DocumentFilters
                selectedLevel={selectedLevel}
                selectedType={selectedType}
                onLevelChange={setSelectedLevel}
                onTypeChange={setSelectedType}
                availableLevels={
                  selectedProgramData?.levels || ["L1", "L2", "L3", "M1", "M2"]
                }
              />
            </div>

            {/* Documents Grid */}
            {filteredDocuments.length > 0 ? (
              <div className="grid md:grid-cols-2 gap-4">
                {filteredDocuments.map((doc) => (
                  <DocumentCard key={doc.id} document={doc} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <FileX className="w-16 h-16 text-muted-foreground/50 mx-auto mb-4" />
                <h3 className="font-display text-xl font-semibold text-foreground mb-2">
                  Aucun document trouvé
                </h3>
                <p className="text-muted-foreground max-w-md mx-auto">
                  Il n&apos;y a pas encore de documents correspondant à vos
                  critères de recherche. Essayez de modifier vos filtres.
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
