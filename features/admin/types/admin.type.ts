import { Filiere } from "@/features/filieres/types/filiere.type";

// ─── Étape 1 : GET /admin/niveaux ─────────────────────────────────────────────
export interface NiveauGroupe {
  niveauName: string;
  nbFilieres: number;
  nbEtudiants: number;
  niveaux: { id: string; filiereId: string; filiere: Filiere }[];
}

// ─── Étape 2 : GET /admin/niveaux/:niveauName/filieres ───────────────────────
export interface FiliereParNiveau {
  filiere: Filiere;
  niveauId: string;
  nbEtudiants: number;
}

// ─── Étape 3a : GET /admin/niveaux/:niveauId/overview ────────────────────────
export interface NiveauOverview {
  niveau: { id: string; name: string; filiereId: string; filiere: Filiere };
  scolarite: {
    total: number;
    soldes: number;
    enCours: number;
    enRetard: number;
    montantTotalDu: number;
    montantTotalPaye: number;
    montantRestant: number;
  };
  transport: {
    totalAbonnes: number;
    abonnementsSoldes: number;
    abonnementsActifs: number;
    montantTotalDu: number;
    montantTotalPaye: number;
    montantRestant: number;
  };
}

// ─── Étape 3b : GET /admin/niveaux/:niveauId/etudiants ───────────────────────
export interface EtudiantNiveau {
  etudiant: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    isActive: boolean;
    filiereId: string | null;
    niveauId: string | null;
    imageUrl: string | null;
  };
  scolarite: {
    id: string;
    montantTotal: number;
    montantPaye: number;
    statut: "en_cours" | "solde" | "en_retard";
    anneeAcademique: string;
  } | null;
  transport: {
    id: string;
    montantTotal: number;
    montantPaye: number;
    statut: string;
    anneeAcademique: string;
    typeAbonnement: "mensuel" | "annuel";
  }[];
}

