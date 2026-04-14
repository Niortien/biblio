"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { GraduationCap } from "lucide-react";
import { useDocumentsQuery } from "@/features/documents/queries/document.query";
import { useFilieresQuery } from "@/features/filieres/queries/filiere.query";
import { useNiveauxQuery } from "@/features/niveaux/queries/niveau.query";
import { DocumentType } from "@/features/documents/types/document.type";
import { getEtudiantUser, logoutEtudiant } from "@/lib/etudiant-auth";
import EtudiantHeader from "./_components/EtudiantHeader";
import EtudiantHero from "./_components/EtudiantHero";
import DocumentsSection from "./_components/DocumentsSection";

const GREETINGS = ["Bonjour", "Salut", "Bienvenue", "Hello"];
const EMOJIS = ["👋", "🎓", "📚", "✨", "🚀"];

type EtudiantUser = {
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  filiereId?: string;
  niveauId?: string;
};

export default function EspaceEtudiantPage() {
  const router = useRouter();
  const [user, setUser] = useState<EtudiantUser | null>(null);
  const [selectedType, setSelectedType] = useState<DocumentType | null>(null);
  const [search, setSearch] = useState("");
  const [greeting] = useState(() => GREETINGS[Math.floor(Math.random() * GREETINGS.length)]);
  const [emoji] = useState(() => EMOJIS[Math.floor(Math.random() * EMOJIS.length)]);

  useEffect(() => {
    const token = localStorage.getItem("etudiant_token");
    if (!token) { router.replace("/espace-etudiant/login"); return; }
    const u = getEtudiantUser();
    if (u) setUser(u);
  }, [router]);

  const { data: filieres } = useFilieresQuery();
  const { data: niveaux } = useNiveauxQuery(
    user?.filiereId ? { filiereId: user.filiereId } : undefined
  );
  const { data: documents, isLoading: docsLoading } = useDocumentsQuery({
    filiereId: user?.filiereId,
    niveauId: user?.niveauId,
    type: selectedType ?? undefined,
  });

  const myFiliere = (filieres ?? []).find((f) => f.id === user?.filiereId);
  const myNiveau  = (niveaux ?? []).find((n) => n.id === user?.niveauId);
  const documentsList = (documents ?? []).filter((d) =>
    !search || d.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleLogout = () => { logoutEtudiant(); router.push("/espace-etudiant/login"); };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-primary/5 via-background to-secondary/5">
        <div className="flex flex-col items-center gap-4 animate-fade-in">
          <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center animate-pulse">
            <GraduationCap className="w-8 h-8 text-primary-foreground" />
          </div>
          <p className="text-muted-foreground text-sm">Chargement de votre espace...</p>
        </div>
      </div>
    );
  }

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

