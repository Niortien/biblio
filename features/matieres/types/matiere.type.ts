export interface Matiere {
  id: string;
  name: string;
  filiereId: string;
  filiere?: { id: string; name: string; code: string };
  niveauId: string;
  niveau?: { id: string; name: string; filiereId: string };
  createdAt: string;
  updatedAt: string;
}

export interface MatiereAddDTO {
  name: string;
  filiereId: string;
  niveauId: string;
}

export interface MatiereUpdateDTO extends Partial<MatiereAddDTO> {}

export interface MatieresParams {
  filiereId?: string;
  niveauId?: string;
}
