import {
  BookOpen,
  ClipboardList,
  Download,
  FileText,
  FlaskConical,
  GraduationCap,
  FileImage,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Document, DocumentType, DOCUMENT_TYPE_LABELS } from "@/features/documents/types/document.type";


interface DocumentCardProps {
  document: Document;
}

const getTypeIcon = (type: DocumentType) => {
  switch (type) {
    case "support_cours": return BookOpen;
    case "td": return FileText;
    case "tp": return FlaskConical;
    case "devoir": return ClipboardList;
    case "sujet_examen": return GraduationCap;
    default: return FileText;
  }
};

const getTypeColor = (type: DocumentType) => {
  switch (type) {
    case "support_cours": return "bg-primary/10 text-primary";
    case "td": return "bg-blue-500/10 text-blue-600";
    case "tp": return "bg-green-500/10 text-green-600";
    case "devoir": return "bg-orange-500/10 text-orange-600";
    case "sujet_examen": return "bg-red-500/10 text-red-600";
    default: return "bg-muted text-muted-foreground";
  }
};

const DocumentCard = ({ document }: DocumentCardProps) => {
  const Icon = document.fileType === "image" ? FileImage : getTypeIcon(document.type);

  const handleDownload = () => {
    const link = window.document.createElement("a");
    link.href = document.fileUrl;
    link.download = document.name;
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
          <Icon className="w-6 h-6" />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <span
              className={`text-xs font-medium px-2 py-1 rounded-full ${getTypeColor(
                document.type
              )}`}
            >
              {DOCUMENT_TYPE_LABELS[document.type]}
            </span>
            {document.niveau && (
              <span className="text-xs text-muted-foreground">
                {document.niveau.name}
              </span>
            )}
          </div>

          <h3 className="font-display text-base font-semibold text-foreground mb-1 line-clamp-1 group-hover:text-primary transition-colors">
            {document.name}
          </h3>

          {document.matiere && (
            <p className="text-sm text-muted-foreground line-clamp-1 mb-3">
              {document.matiere.name}
            </p>
          )}

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <span className="uppercase">{document.fileType}</span>
              <span>•</span>
              <span>
                {new Date(document.createdAt).toLocaleDateString("fr-FR", {
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
