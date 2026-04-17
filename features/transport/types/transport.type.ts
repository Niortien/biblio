export type TransportStatut = 'actif' | 'inactif' | 'solde';
export type TypeAbonnement = 'mensuel' | 'annuel';

export const TRANSPORT_STATUT_LABELS: Record<TransportStatut, string> = {
  actif: 'Actif',
  inactif: 'Inactif',
  solde: 'Soldé',
};

export const TRANSPORT_STATUT_COLORS: Record<TransportStatut, string> = {
  actif: 'bg-green-100 text-green-700',
  inactif: 'bg-gray-100 text-gray-700',
  solde: 'bg-blue-100 text-blue-700',
};

export const TYPE_ABONNEMENT_LABELS: Record<TypeAbonnement, string> = {
  mensuel: 'Mensuel',
  annuel: 'Annuel',
};

export interface TransportConfig {
  id: string;
  anneeAcademique: string;
  montantMensuel: number;
  montantAnnuel: number;
  description?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface TransportConfigAddDTO {
  anneeAcademique: string;
  montantMensuel: number;
  montantAnnuel: number;
  description?: string;
  isActive?: boolean;
}

export interface TransportConfigUpdateDTO extends Partial<TransportConfigAddDTO> {}

export interface TransportAbonnement {
  id: string;
  anneeAcademique: string;
  typeAbonnement: TypeAbonnement;
  montantTotal: string;
  montantPaye: string;
  statut: TransportStatut;
  notes?: string;
  userId: string;
  user?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    imageUrl?: string;
  };
  transportConfigId: string;
  transportConfig?: TransportConfig;
  createdAt: string;
  updatedAt: string;
}

export interface TransportAbonnementAddDTO {
  userId: string;
  transportConfigId: string;
  typeAbonnement: TypeAbonnement;
  notes?: string;
}

export interface VersementTransport {
  id: string;
  transportAbonnementId: string;
  montant: string;
  datePaiement: string;
  moisConcerne?: string;
  motif?: string;
  createdAt: string;
}

export interface VersementTransportAddDTO {
  transportAbonnementId: string;
  montant: number;
  datePaiement: string;
  moisConcerne?: string;
  motif?: string;
}

export interface TransportDashboard {
  abonnements: TransportAbonnement[];
  versements: VersementTransport[];
}
