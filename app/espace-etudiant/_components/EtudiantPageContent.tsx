"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { CreditCard, Bus, GraduationCap, BookOpen, ArrowRight } from "lucide-react";
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
    id?: string;
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

        {/* Quick-access cards */}
        {user.id && (
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 pb-16">
            <h2 className="text-lg font-bold text-foreground mb-4">Acces rapide</h2>
            <div className="grid sm:grid-cols-2 gap-4">

              <Link href="/espace-etudiant/notes" className="group flex items-center gap-4 p-5 rounded-2xl border border-border bg-card hover:border-green-300 hover:bg-green-50/50 transition-all">
                <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center shrink-0 group-hover:bg-green-500/20 transition-colors">
                  <BookOpen className="w-6 h-6 text-green-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-foreground">Mes notes &amp; resultats</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Bulletin academique et moyennes</p>
                </div>
                <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-green-600 group-hover:translate-x-1 transition-all" />
              </Link>

              <Link href="/espace-etudiant/scolarite" className="group flex items-center gap-4 p-5 rounded-2xl border border-border bg-card hover:border-blue-300 hover:bg-blue-50/50 transition-all">
                <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center shrink-0 group-hover:bg-blue-500/20 transition-colors">
                  <CreditCard className="w-6 h-6 text-blue-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-foreground">Scolarite &amp; Transport</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Suivi des paiements et abonnements</p>
                </div>
                <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
              </Link>

            </div>
          </div>
        )}
      </main>
    </div>
  );
}
