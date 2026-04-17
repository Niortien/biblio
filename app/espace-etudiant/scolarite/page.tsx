"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CreditCard, Bus, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { getEtudiantUser } from "@/lib/etudiant-auth";
import { logoutEtudiant } from "@/lib/etudiant-auth";
import EtudiantHeader from "../_components/EtudiantHeader";
import ScolariteSection from "../_components/ScolariteSection";
import TransportSection from "../_components/TransportSection";
import EtudiantLoadingScreen from "../_components/EtudiantLoadingScreen";

type EtudiantUser = {
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  filiereId?: string;
  niveauId?: string;
};

export default function ScolariteTransportPage() {
  const router = useRouter();
  const [user, setUser] = useState<EtudiantUser | null>(null);

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
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">

          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link href="/espace-etudiant" className="hover:text-foreground transition-colors flex items-center gap-1">
              <ArrowLeft className="w-3.5 h-3.5" />
              Espace etudiant
            </Link>
            <span>/</span>
            <span className="text-foreground font-medium">Scolarite &amp; Transport</span>
          </div>

          {/* Page title */}
          <div>
            <h1 className="text-2xl font-bold text-foreground">Suivi financier</h1>
            <p className="text-muted-foreground text-sm mt-1">
              Consultez vos paiements de scolarite et votre abonnement transport
            </p>
          </div>

          {user.id ? (
            <div className="grid md:grid-cols-2 gap-8">

              {/* Scolarite */}
              <section className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
                    <CreditCard className="w-5 h-5 text-blue-500" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-foreground">Ma scolarite</h2>
                    <p className="text-xs text-muted-foreground">Frais universitaires et echeances</p>
                  </div>
                </div>
                <ScolariteSection userId={user.id} />
              </section>

              {/* Transport */}
              <section className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Bus className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-foreground">Mon transport</h2>
                    <p className="text-xs text-muted-foreground">Abonnement et versements</p>
                  </div>
                </div>
                <TransportSection userId={user.id} />
              </section>

            </div>
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
