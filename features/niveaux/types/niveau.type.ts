export interface Niveau {
  id: string;
  name: string;
  filiereId: string;
  filiere?: { id: string; name: string; code: string };
  createdAt: string;
  updatedAt: string;
}

export interface NiveauAddDTO {
  name: string;
  filiereId: string;
}

export interface NiveauUpdateDTO extends Partial<NiveauAddDTO> {}

export interface NiveauxParams {
  filiereId?: string;
}
