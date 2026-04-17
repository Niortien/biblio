export type ScolariteStatut = 'en_cours' | 'solde' | 'en_retard';

export const SCOLARITE_STATUT_LABELS: Record<ScolariteStatut, string> = {
  en_cours: 'En cours',
  solde: 'Soldé',
  en_retard: 'En retard',
};

export const SCOLARITE_STATUT_COLORS: Record<ScolariteStatut, string> = {
  en_cours: 'bg-blue-100 text-blue-700',
  solde: 'bg-green-100 text-green-700',
  en_retard: 'bg-red-100 text-red-700',
};

export type EcheanceStatut = 'en_attente' | 'partiel' | 'paye' | 'en_retard';

export const ECHEANCE_STATUT_LABELS: Record<EcheanceStatut, string> = {
  en_attente: 'En attente',
  partiel: 'Partiel',
  paye: 'Payé',
  en_retard: 'En retard',
};

export const ECHEANCE_STATUT_COLORS: Record<EcheanceStatut, string> = {
  en_attente: 'bg-gray-100 text-gray-600',
  partiel: 'bg-orange-100 text-orange-700',
  paye: 'bg-green-100 text-green-700',
  en_retard: 'bg-red-100 text-red-700',
};

export interface ScolariteConfig {
  id: string;
  anneeAcademique: string;
  montantTotal: number;
  montantInscription: number;
  nombreVersements: number;
  description?: string;
  isActive: boolean;
  filiereId: string;
  niveauId: string;
  filiere?: { id: string; name: string; code: string };
  niveau?: { id: string; name: string };
  createdAt: string;
  updatedAt: string;
}

export interface ScolariteConfigAddDTO {
  anneeAcademique: string;
  montantTotal: number;
  montantInscription: number;
  nombreVersements: number;
  description?: string;
  isActive?: boolean;
  filiereId: string;
  niveauId: string;
}

export interface ScolariteConfigUpdateDTO extends Partial<ScolariteConfigAddDTO> {}

// ─── Écheancier (plan de paiement d'une config) ────────────────────────────────

export interface EcheancierConfig {
  id: string;
  scolariteConfigId: string;
  numero: number;
  libelle: string;
  montant: number;
  dateEcheance: string;
  estInscription: boolean;
  notes?: string;
}

export interface EcheancierConfigAddDTO {
  scolariteConfigId: string;
  numero: number;
  libelle: string;
  montant: number;
  dateEcheance: string;
  estInscription?: boolean;
  notes?: string;
}

// ─── Échéances étudiant ────────────────────────────────────────────────────────

export interface EcheanceEtudiant {
  id: string;
  scolariteEtudiantId: string;
  numero: number;
  libelle: string;
  montantDu: string;
  montantPaye: string;
  dateLimite: string;
  statut: EcheanceStatut;
  echeancierScolarite?: EcheancierConfig;
}

export interface ScolariteEtudiant {
  id: string;
  anneeAcademique: string;
  montantTotal: string;
  montantPaye: string;
  statut: ScolariteStatut;
  notes?: string;
  userId: string;
  user?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    imageUrl?: string;
  };
  scolariteConfigId: string;
  scolariteConfig?: ScolariteConfig;
  echeances?: EcheanceEtudiant[];
  createdAt: string;
  updatedAt: string;
}

export interface ScolariteEtudiantAddDTO {
  userId: string;
  scolariteConfigId: string;
  notes?: string;
}

export interface VersementScolarite {
  id: string;
  scolariteEtudiantId: string;
  montant: string;
  datePaiement: string;
  motif?: string;
  echeanceEtudiantId?: string;
  createdAt: string;
}

export interface VersementScolariteAddDTO {
  scolariteEtudiantId: string;
  echeanceEtudiantId?: string;
  montant: number;
  datePaiement: string;
  motif?: string;
}

export interface VersementScolariteResponse {
  versement: VersementScolarite;
  scolarite: {
    id: string;
    montantPaye: string;
    statut: ScolariteStatut;
  };
  echeance?: {
    id: string;
    montantPaye: string;
    statut: EcheanceStatut;
  };
}

export interface ScolariteDashboard {
  scolarites: ScolariteEtudiant[];
  versements: VersementScolarite[];
}
