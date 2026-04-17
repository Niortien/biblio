export interface Matiere {
  id: string;
  name: string;
  filiereId: string;
  filiere?: { id: string; name: string; code: string };
  niveauId: string;
  niveau?: { id: string; name: string; filiereId: string };
  coefficient: number;
  isModule: boolean;
  parentId: string | null;
  parent?: Matiere | null;
  children?: Matiere[];
  createdAt: string;
  updatedAt: string;
}

export interface MatiereAddDTO {
  name: string;
  filiereId: string;
  niveauId: string;
  coefficient?: number;
  isModule?: boolean;
  parentId?: string;
}

export interface MatiereUpdateDTO extends Partial<MatiereAddDTO> {}

export interface MatieresParams {
  filiereId?: string;
  niveauId?: string;
}
