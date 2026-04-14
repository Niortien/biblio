import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Espace Étudiant – Biblio UPB",
  description: "Accédez à vos ressources académiques personnalisées",
};

export default function EspaceEtudiantLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
