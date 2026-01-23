import {
  BookOpen,
  ClipboardList,
  Download,
  FileText,
  FlaskConical,
  GraduationCap,
  Youtube,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Document, DocumentType } from "@/data/documents";


interface DocumentCardProps {
  document: Document;
}

const getTypeIcon = (type: DocumentType) => {
  switch (type) {
    case "cours":
      return BookOpen;
    case "td":
      return FileText;
    case "tp":
      return FlaskConical;
    case "devoir":
      return ClipboardList;
    case "examen":
      return GraduationCap;
    default:
      return FileText;
  }
};

const getTypeLabel = (type: DocumentType) => {
  switch (type) {
    case "cours":
      return "Cours";
    case "td":
      return "TD";
    case "tp":
      return "TP";
    case "devoir":
      return "Devoir";
    case "examen":
      return "Examen";
    default:
      return type;
  }
};

const getTypeColor = (type: DocumentType) => {
  switch (type) {
    case "cours":
      return "bg-primary/10 text-primary";
    case "td":
      return "bg-blue-500/10 text-blue-600";
    case "tp":
      return "bg-green-500/10 text-green-600";
    case "devoir":
      return "bg-orange-500/10 text-orange-600";
    case "examen":
      return "bg-red-500/10 text-red-600";
    default:
      return "bg-muted text-muted-foreground";
  }
};

const DocumentCard = ({ document }: DocumentCardProps) => {
  const Icon = getTypeIcon(document.type);

  const handleDownload = () => {
    const link = window.document.createElement("a");
    link.href = document.fileUrl;
    link.download = document.fileName;
    link.click();
  };

  return (
    <div className="bg-card rounded-2xl border border-border p-5 hover:shadow-elegant transition-all duration-300 group animate-scale-in">
      <div className="flex items-start gap-4">
        {/* Icon */}
        <div
          className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${getTypeColor(
            document.type
          )}`}
        >
          <Youtube className="w-6 h-6" />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <span
              className={`text-xs font-medium px-2 py-1 rounded-full ${getTypeColor(
                document.type
              )}`}
            >
              {getTypeLabel(document.type)}
            </span>
            <span className="text-xs text-muted-foreground">
              {document.level}
            </span>
          </div>

          <h3 className="font-display text-base font-semibold text-foreground mb-1 line-clamp-1 group-hover:text-primary transition-colors">
            {document.title}
          </h3>

          {document.description && (
            <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
              {document.description}
            </p>
          )}

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <span>{document.fileSize}</span>
              <span>•</span>
              <span>
                {new Date(document.uploadDate).toLocaleDateString("fr-FR", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </span>
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={handleDownload}
              className="gap-2 text-primary hover:text-primary hover:bg-primary/10"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Télécharger</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentCard;
