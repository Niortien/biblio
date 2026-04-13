import { DocumentType, DOCUMENT_TYPE_LABELS } from "@/features/documents/types/document.type";
import { Niveau } from "@/features/niveaux/types/niveau.type";
import { Button } from "@/components/ui/button";

const DOCUMENT_TYPES: DocumentType[] = ["devoir", "sujet_examen", "td", "tp", "support_cours"];

interface DocumentFiltersProps {
  selectedNiveauId: string | null;
  selectedType: DocumentType | null;
  onNiveauChange: (niveauId: string | null) => void;
  onTypeChange: (type: DocumentType | null) => void;
  niveaux: Niveau[];
}

const DocumentFilters = ({
  selectedNiveauId,
  selectedType,
  onNiveauChange,
  onTypeChange,
  niveaux,
}: DocumentFiltersProps) => {
  return (
    <div className="space-y-4">
      {/* Niveau filters */}
      {niveaux.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-foreground mb-3">Niveau</h4>
          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedNiveauId === null ? "default" : "outline"}
              size="sm"
              onClick={() => onNiveauChange(null)}
              className="rounded-full"
            >
              Tous
            </Button>
            {niveaux.map((niveau) => (
              <Button
                key={niveau.id}
                variant={selectedNiveauId === niveau.id ? "default" : "outline"}
                size="sm"
                onClick={() => onNiveauChange(niveau.id)}
                className="rounded-full"
              >
                {niveau.name}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Type filters */}
      <div>
        <h4 className="text-sm font-medium text-foreground mb-3">
          Type de document
        </h4>
        <div className="flex flex-wrap gap-2">
          <Button
            variant={selectedType === null ? "default" : "outline"}
            size="sm"
            onClick={() => onTypeChange(null)}
            className="rounded-full"
          >
            Tous
          </Button>
          {DOCUMENT_TYPES.map((type) => (
            <Button
              key={type}
              variant={selectedType === type ? "default" : "outline"}
              size="sm"
              onClick={() => onTypeChange(type)}
              className="rounded-full"
            >
              {DOCUMENT_TYPE_LABELS[type]}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DocumentFilters;
