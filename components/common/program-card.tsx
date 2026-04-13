import { ChevronRight } from "lucide-react";
import { Filiere } from "@/features/filieres/types/filiere.type";
import { getFiliereColors } from "@/lib/filiere-colors";

interface ProgramCardProps {
  filiere: Filiere;
  isSelected: boolean;
  onClick: () => void;
}

const ProgramCard = ({ filiere, isSelected, onClick }: ProgramCardProps) => {
  const colors = getFiliereColors(filiere.code);

  return (
    <button
      onClick={onClick}
      className={`w-full text-left p-5 rounded-2xl border-2 transition-all duration-300 group ${
        isSelected
          ? `${colors.bg} ${colors.text} border-transparent shadow-lg scale-[1.02]`
          : `bg-card border-border hover:${colors.border} hover:shadow-card`
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <span
              className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                isSelected
                  ? "bg-white/20 text-white"
                  : `${colors.light} ${colors.lightText}`
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
              isSelected ? "text-white" : "text-foreground"
            }`}
          >
            {filiere.code}
          </h3>
          <p
            className={`text-sm line-clamp-2 ${
              isSelected ? "text-white/80" : "text-muted-foreground"
            }`}
          >
            {filiere.name}
          </p>
        </div>
        <ChevronRight
          className={`w-5 h-5 flex-shrink-0 transition-transform group-hover:translate-x-1 ${
            isSelected ? "text-white" : "text-muted-foreground"
          }`}
        />
      </div>
    </button>
  );
};

export default ProgramCard;
