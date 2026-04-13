import { ChevronRight } from "lucide-react";
import { Filiere } from "@/features/filieres/types/filiere.type";

interface ProgramCardProps {
  filiere: Filiere;
  isSelected: boolean;
  onClick: () => void;
}

const ProgramCard = ({ filiere, isSelected, onClick }: ProgramCardProps) => {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left p-5 rounded-2xl border transition-all duration-300 group ${
        isSelected
          ? "bg-primary text-primary-foreground border-primary shadow-elegant"
          : "bg-card border-border hover:border-primary/50 hover:shadow-card"
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <span
              className={`text-xs font-medium px-2 py-1 rounded-full ${
                isSelected
                  ? "bg-primary-foreground/20 text-primary-foreground"
                  : "bg-primary/10 text-primary"
              }`}
            >
              {filiere.code}
            </span>
            {!filiere.isActive && (
              <span className="text-xs font-medium px-2 py-1 rounded-full bg-muted text-muted-foreground">
                Inactive
              </span>
            )}
          </div>
          <h3
            className={`font-display text-lg font-semibold mb-1 ${
              isSelected ? "text-primary-foreground" : "text-foreground"
            }`}
          >
            {filiere.code}
          </h3>
          <p
            className={`text-sm line-clamp-2 ${
              isSelected ? "text-primary-foreground/80" : "text-muted-foreground"
            }`}
          >
            {filiere.name}
          </p>
        </div>
        <ChevronRight
          className={`w-5 h-5 flex-shrink-0 transition-transform group-hover:translate-x-1 ${
            isSelected ? "text-primary-foreground" : "text-muted-foreground"
          }`}
        />
      </div>
    </button>
  );
};

export default ProgramCard;
