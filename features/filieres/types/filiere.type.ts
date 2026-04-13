export interface Filiere {
  id: string;
  name: string;
  code: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface FiliereAddDTO {
  name: string;
  code: string;
  isActive?: boolean;
}

export interface FiliereUpdateDTO extends Partial<FiliereAddDTO> {}

export interface FilieresParams {
  search?: string;
}
