export interface ProfesseurMatiere {
  id: string;
  professeurId: string;
  matiereId: string;
  matiere?: {
    id: string;
    name: string;
    filiereId: string;
    filiere?: { id: string; name: string; code: string };
    niveauId: string;
    niveau?: { id: string; name: string };
    coefficient: number;
  };
  createdAt: string;
}

export interface ClasseResumee {
  filiereId: string;
  filiere: { id: string; name: string; code: string } | null;
  niveauId: string;
  niveau: { id: string; name: string } | null;
  matieres: {
    id: string;
    name: string;
    coefficient: number;
    isModule: boolean;
  }[];
}

export interface AssignMatiereDTO {
  matiereId: string;
}

export interface ProfesseurUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}
