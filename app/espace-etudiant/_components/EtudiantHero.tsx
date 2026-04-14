"use client";

import {
  BookOpen, FileText, FlaskConical, GraduationCap, ClipboardList, Sparkles,
} from "lucide-react";
import { DocumentType, DOCUMENT_TYPE_LABELS } from "@/features/documents/types/document.type";
import { Document } from "@/features/documents/types/document.type";

interface Filiere { id: string; name: string; code: string }
interface Niveau  { id: string; name: string }

interface Props {
  firstName: string;
  greeting: string;
  emoji: string;
  myFiliere: Filiere | undefined;
  myNiveau: Niveau | undefined;
  documents: Document[] | undefined;
  selectedType: DocumentType | null;
  onSelectType: (type: DocumentType | null) => void;
}

const TYPE_ICONS: Record<DocumentType, React.ElementType> = {
  support_cours: BookOpen,
  td: FileText,
  tp: FlaskConical,
  devoir: ClipboardList,
  sujet_examen: GraduationCap,
};

const TYPE_COLORS: Record<DocumentType, { card: string; icon: string; active: string }> = {
  support_cours: { card: "from-blue-500/10 to-blue-500/5 border-blue-200 hover:border-blue-400",    icon: "bg-blue-500 text-white",    active: "from-blue-500 to-blue-600 border-blue-600 text-white" },
  td:            { card: "from-violet-500/10 to-violet-500/5 border-violet-200 hover:border-violet-400", icon: "bg-violet-500 text-white", active: "from-violet-500 to-violet-600 border-violet-600 text-white" },
  tp:            { card: "from-emerald-500/10 to-emerald-500/5 border-emerald-200 hover:border-emerald-400", icon: "bg-emerald-500 text-white", active: "from-emerald-500 to-emerald-600 border-emerald-600 text-white" },
  devoir:        { card: "from-orange-500/10 to-orange-500/5 border-orange-200 hover:border-orange-400", icon: "bg-orange-500 text-white", active: "from-orange-500 to-orange-600 border-orange-600 text-white" },
  sujet_examen:  { card: "from-rose-500/10 to-rose-500/5 border-rose-200 hover:border-rose-400",    icon: "bg-rose-500 text-white",    active: "from-rose-500 to-rose-600 border-rose-600 text-white" },
};

export default function EtudiantHero({
  firstName, greeting, emoji, myFiliere, myNiveau, documents, selectedType, onSelectType,
}: Props) {
  return (
    <section className="relative overflow-hidden py-14 md:py-20">
      {/* Blobs décoratifs */}
      <div className="absolute -top-20 -left-20 w-80 h-80 rounded-full bg-primary/15 blur-3xl animate-float" style={{ animationDelay: "0s" }} />
      <div className="absolute top-10 right-0 w-64 h-64 rounded-full bg-secondary/20 blur-3xl animate-float" style={{ animationDelay: "1.5s" }} />
      <div className="absolute bottom-0 left-1/2 w-96 h-40 rounded-full bg-primary/8 blur-2xl animate-float" style={{ animationDelay: "0.8s" }} />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Badge "espace personnel" */}
        <div className="animate-fade-in-up" style={{ animationDelay: "0.05s" }}>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold mb-5">
            <Sparkles className="w-3.5 h-3.5" />
            Votre espace personnel
          </div>
        </div>

        {/* Titre */}
        <h1 className="text-3xl md:text-5xl font-bold mb-3 animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
          {greeting},{" "}
          <span className="bg-linear-to-r from-primary via-primary/80 to-secondary bg-clip-text text-transparent">
            {firstName}
          </span>{" "}
          <span className="inline-block animate-float" style={{ animationDelay: "0.3s" }}>{emoji}</span>
        </h1>
        <p className="text-muted-foreground text-lg mb-10 animate-fade-in-up" style={{ animationDelay: "0.15s" }}>
          Retrouvez toutes vos ressources académiques en un clic.
        </p>

        {/* Cursus badges */}
        {(myFiliere || myNiveau) && (
          <div className="flex flex-wrap gap-3 mb-10 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
            {myFiliere && (
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary text-primary-foreground text-sm font-semibold shadow-lg shadow-primary/30">
                <GraduationCap className="w-4 h-4" />
                {myFiliere.name} · {myFiliere.code}
              </div>
            )}
            {myNiveau && (
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-card border border-border text-foreground text-sm font-medium shadow">
                {myNiveau.name}
              </div>
            )}
          </div>
        )}

        {/* Stat cards par type */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {(Object.keys(DOCUMENT_TYPE_LABELS) as DocumentType[]).map((type, i) => {
            const Icon = TYPE_ICONS[type];
            const colors = TYPE_COLORS[type];
            const count = (documents ?? []).filter((d) => d.type === type).length;
            const isActive = selectedType === type;
            return (
              <button
                key={type}
                onClick={() => onSelectType(isActive ? null : type)}
                className={`relative group flex flex-col gap-3 p-4 rounded-2xl border bg-linear-to-br text-left transition-all duration-200 hover:-translate-y-1 hover:shadow-lg animate-pop-in ${
                  isActive ? `${colors.active} shadow-lg` : `${colors.card} bg-card`
                }`}
                style={{ animationDelay: `${0.25 + i * 0.07}s` }}
              >
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center shadow ${isActive ? "bg-white/20" : colors.icon}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <p className={`text-2xl font-bold leading-none ${isActive ? "text-white" : "text-foreground"}`}>{count}</p>
                  <p className={`text-xs mt-0.5 ${isActive ? "text-white/80" : "text-muted-foreground"}`}>{DOCUMENT_TYPE_LABELS[type]}</p>
                </div>
                {isActive && <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-white/60 animate-pulse" />}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
