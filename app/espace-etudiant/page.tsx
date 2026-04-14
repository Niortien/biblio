"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getEtudiantUser } from "@/lib/etudiant-auth";
import EtudiantLoadingScreen from "./_components/EtudiantLoadingScreen";
import EtudiantPageContent from "./_components/EtudiantPageContent";

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

  useEffect(() => {
    const token = localStorage.getItem("etudiant_token");
    if (!token) { router.replace("/espace-etudiant/login"); return; }
    const u = getEtudiantUser();
    if (u) setUser(u);
  }, [router]);

  if (!user) return <EtudiantLoadingScreen />;
  return <EtudiantPageContent user={user} />;
}

