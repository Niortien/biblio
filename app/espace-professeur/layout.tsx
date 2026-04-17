import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Espace Professeur – Biblio UPB",
  description: "Gérez les notes de vos étudiants",
};

export default function EspaceProfesseurLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
