"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useDocumentsQuery } from "@/features/documents/queries/document.query";
import { useFilieresQuery } from "@/features/filieres/queries/filiere.query";
import { useNiveauxQuery } from "@/features/niveaux/queries/niveau.query";
import { DocumentType } from "@/features/documents/types/document.type";
import { logoutEtudiant } from "@/lib/etudiant-auth";
import EtudiantHeader from "./EtudiantHeader";
import EtudiantHero from "./EtudiantHero";
import DocumentsSection from "./DocumentsSection";

const GREETINGS = ["Bonjour", "Salut", "Bienvenue", "Hello"];
const EMOJIS = ["👋", "🎓", "📚", "✨", "🚀"];

interface Props {
  user: {
    firstName: string;
    lastName: string;
    email: string;
    filiereId?: string;
    niveauId?: string;
  };
}

export default function EtudiantPageContent({ user }: Props) {
  const router = useRouter();
  const [selectedType, setSelectedType] = useState<DocumentType | null>(null);
  const [search, setSearch] = useState("");
  const [greeting] = useState(() => GREETINGS[Math.floor(Math.random() * GREETINGS.length)]);
  const [emoji] = useState(() => EMOJIS[Math.floor(Math.random() * EMOJIS.length)]);

  const { data: filieres } = useFilieresQuery();
  const { data: niveaux } = useNiveauxQuery(
    user.filiereId ? { filiereId: user.filiereId } : undefined
  );
  const { data: documents, isLoading: docsLoading } = useDocumentsQuery({
    filiereId: user.filiereId,
    niveauId: user.niveauId,
    type: selectedType ?? undefined,
  });

  const myFiliere = (filieres ?? []).find((f) => f.id === user.filiereId);
  const myNiveau  = (niveaux ?? []).find((n) => n.id === user.niveauId);
  const documentsList = (documents ?? []).filter((d) =>
    !search || d.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleLogout = () => { logoutEtudiant(); router.push("/espace-etudiant/login"); };

  return (
    <div className="min-h-screen bg-background">
      <EtudiantHeader
        firstName={user.firstName}
        lastName={user.lastName}
        email={user.email}
        onLogout={handleLogout}
      />
      <main className="pt-16">
        <EtudiantHero
          firstName={user.firstName}
          greeting={greeting}
          emoji={emoji}
          myFiliere={myFiliere}
          myNiveau={myNiveau}
          documents={documents}
          selectedType={selectedType}
          onSelectType={setSelectedType}
        />
        <DocumentsSection
          documents={documentsList}
          isLoading={docsLoading}
          search={search}
          onSearchChange={setSearch}
          selectedType={selectedType}
          onClearType={() => setSelectedType(null)}
          myFiliere={myFiliere}
          myNiveau={myNiveau}
        />
      </main>
    </div>
  );
}
