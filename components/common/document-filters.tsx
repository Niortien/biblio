import { DocumentType, documentTypes, Level } from "@/data/documents";
import { Button } from "@/components/ui/button";

interface DocumentFiltersProps {
  selectedLevel: Level | "all";
  selectedType: DocumentType | "all";
  onLevelChange: (level: Level | "all") => void;
  onTypeChange: (type: DocumentType | "all") => void;
  availableLevels: Level[];
}

const DocumentFilters = ({
  selectedLevel,
  selectedType,
  onLevelChange,
  onTypeChange,
  availableLevels,
}: DocumentFiltersProps) => {
  return (
    <div className="space-y-4">
      {/* Level filters */}
      <div>
        <h4 className="text-sm font-medium text-foreground mb-3">Niveau</h4>
        <div className="flex flex-wrap gap-2">
          <Button
            variant={selectedLevel === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => onLevelChange("all")}
            className="rounded-full"
          >
            Tous
          </Button>
          {availableLevels.map((level) => (
            <Button
              key={level}
              variant={selectedLevel === level ? "default" : "outline"}
              size="sm"
              onClick={() => onLevelChange(level)}
              className="rounded-full"
            >
              {level}
            </Button>
          ))}
        </div>
      </div>

      {/* Type filters */}
      <div>
        <h4 className="text-sm font-medium text-foreground mb-3">
          Type de document
        </h4>
        <div className="flex flex-wrap gap-2">
          <Button
            variant={selectedType === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => onTypeChange("all")}
            className="rounded-full"
          >
            Tous
          </Button>
          {documentTypes.map(({ type, label }) => (
            <Button
              key={type}
              variant={selectedType === type ? "default" : "outline"}
              size="sm"
              onClick={() => onTypeChange(type)}
              className="rounded-full"
            >
              {label}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DocumentFilters;
