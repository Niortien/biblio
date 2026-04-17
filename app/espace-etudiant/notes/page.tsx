"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { GraduationCap, ArrowLeft } from "lucide-react";
import Link from "next/link";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { getEtudiantUser, logoutEtudiant } from "@/lib/etudiant-auth";
import EtudiantHeader from "../_components/EtudiantHeader";
import NotesSection from "../_components/NotesSection";
import EtudiantLoadingScreen from "../_components/EtudiantLoadingScreen";

type EtudiantUser = {
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  filiereId?: string;
  niveauId?: string;
};

const YEARS = ["2025-2026", "2024-2025", "2023-2024"];
const CURRENT_YEAR = YEARS[0];

export default function NotesPage() {
  const router = useRouter();
  const [user, setUser] = useState<EtudiantUser | null>(null);
  const [annee, setAnnee] = useState(CURRENT_YEAR);

  useEffect(() => {
    const token = localStorage.getItem("etudiant_token");
    if (!token) { router.replace("/espace-etudiant/login"); return; }
    const u = getEtudiantUser();
    if (u) setUser(u);
  }, [router]);

  if (!user) return <EtudiantLoadingScreen />;

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
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link href="/espace-etudiant" className="hover:text-foreground transition-colors flex items-center gap-1">
              <ArrowLeft className="w-3.5 h-3.5" />
              Espace etudiant
            </Link>
            <span>/</span>
            <span className="text-foreground font-medium">Mes notes</span>
          </div>

          {/* Header */}
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Mes notes &amp; resultats</h1>
                <p className="text-muted-foreground text-sm mt-0.5">
                  Bulletin academique — {annee}
                </p>
              </div>
            </div>

            <Select value={annee} onValueChange={setAnnee}>
              <SelectTrigger className="w-36"><SelectValue /></SelectTrigger>
              <SelectContent>
                {YEARS.map(y => <SelectItem key={y} value={y}>{y}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          {user.id ? (
            <NotesSectionWithYear userId={user.id} annee={annee} />
          ) : (
            <div className="flex items-center justify-center py-20 text-muted-foreground text-sm">
              Impossible de charger vos informations. Veuillez vous reconnecter.
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

// Wrapper to pass annee to NotesSection — reuse existing component with key to reset on year change
function NotesSectionWithYear({ userId, annee }: { userId: string; annee: string }) {
  return <NotesSection key={annee} userId={userId} annee={annee} />;
}
