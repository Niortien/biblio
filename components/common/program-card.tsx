import { ChevronRight } from "lucide-react";
import { Level, Program } from "@/data/documents";

interface ProgramCardProps {
  name: Program;
  fullName: string;
  levels: Level[];
  isSelected: boolean;
  onClick: () => void;
}

const ProgramCard = ({ name, fullName, levels, isSelected, onClick }: ProgramCardProps) => {
  const isMaster = levels.includes('M1') || levels.includes('M2');

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
                  : isMaster
                  ? "bg-secondary/20 text-secondary-foreground"
                  : "bg-primary/10 text-primary"
              }`}
            >
              {isMaster ? "Master" : "Licence"}
            </span>
          </div>
          <h3
            className={`font-display text-lg font-semibold mb-1 ${
              isSelected ? "text-primary-foreground" : "text-foreground"
            }`}
          >
            {name}
          </h3>
          <p
            className={`text-sm line-clamp-2 ${
              isSelected ? "text-primary-foreground/80" : "text-muted-foreground"
            }`}
          >
            {fullName}
          </p>
          <div className="flex gap-2 mt-3">
            {levels.map((level) => (
              <span
                key={level}
                className={`text-xs font-medium px-2 py-0.5 rounded ${
                  isSelected
                    ? "bg-primary-foreground/20"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {level}
              </span>
            ))}
          </div>
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
