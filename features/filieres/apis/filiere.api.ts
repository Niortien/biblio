import { api } from "@/lib/api";
import { Filiere, FilieresParams, FiliereAddDTO, FiliereUpdateDTO } from "../types/filiere.type";

export interface IFiliereAPI {
  obtenirToutesFilieres(params?: FilieresParams): Promise<Filiere[]>;
  obtenirFiliere(id: string): Promise<Filiere>;
  ajouterFiliere(data: FiliereAddDTO): Promise<Filiere>;
  modifierFiliere(id: string, data: FiliereUpdateDTO): Promise<Filiere>;
  supprimerFiliere(id: string): Promise<void>;
}

export const filiereAPI: IFiliereAPI = {
  obtenirToutesFilieres(): Promise<Filiere[]> {
    return api.request<Filiere[]>({ endpoint: "filieres", method: "GET" });
  },

  obtenirFiliere(id: string): Promise<Filiere> {
    return api.request<Filiere>({ endpoint: `filieres/${id}`, method: "GET" });
  },

  ajouterFiliere(data: FiliereAddDTO): Promise<Filiere> {
    return api.request<Filiere>({ endpoint: "filieres", method: "POST", data });
  },

  modifierFiliere(id: string, data: FiliereUpdateDTO): Promise<Filiere> {
    return api.request<Filiere>({ endpoint: `filieres/${id}`, method: "PUT", data });
  },

  supprimerFiliere(id: string): Promise<void> {
    return api.request<void>({ endpoint: `filieres/${id}`, method: "DELETE" });
  },
};

