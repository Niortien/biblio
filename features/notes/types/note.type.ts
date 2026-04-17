import { Matiere } from "@/features/matieres/types/matiere.type";

export type StatutNote = "en_cours" | "valide" | "en_session" | "ajourne";

export const STATUT_NOTE_LABELS: Record<StatutNote, string> = {
  en_cours: "En cours",
  valide: "Validé",
  en_session: "En session",
  ajourne: "Ajourné",
};

export const STATUT_NOTE_COLORS: Record<StatutNote, string> = {
  en_cours:   "bg-gray-100 text-gray-700 border-gray-200",
  valide:     "bg-green-100 text-green-700 border-green-200",
  en_session: "bg-orange-100 text-orange-700 border-orange-200",
  ajourne:    "bg-red-100 text-red-700 border-red-200",
};

export interface NoteEtudiant {
  id: string;
  etudiantId: string;
  etudiant?: { id: string; firstName: string; lastName: string; email: string };
  matiereId: string;
  matiere?: Matiere;
  anneeAcademique: string;
  moyenneClasse: number | null;
  moyenneExamen: number | null;
  moyenneMatiere: number | null;
  statut: StatutNote;
  moyenneSession: number | null;
  createdAt: string;
  updatedAt: string;
}

/** Résultat d'un module complémentaire dans le bulletin */
export interface ResultatModule {
  module: Matiere;
  notes: NoteEtudiant[];
  moyenneModule: number | null;
  statut: "valide" | "en_cours" | "en_session" | "ajourne";
}

/** Bulletin complet */
export interface BulletinEtudiant {
  etudiantId: string;
  anneeAcademique: string;
  notesMatiereSimple: NoteEtudiant[];
  modulesComplementaires: ResultatModule[];
  moyenneGenerale: number | null;
}

export interface NoteCreateDTO {
  etudiantId: string;
  matiereId: string;
  anneeAcademique: string;
  moyenneClasse?: number;
  moyenneExamen?: number;
}

export interface NoteUpdateDTO {
  moyenneClasse?: number;
  moyenneExamen?: number;
}

export interface SaisirSessionDTO {
  moyenneSession: number;
}

export interface NotesParams {
  etudiantId?: string;
  matiereId?: string;
  anneeAcademique: string;
}
