import { api } from "@/lib/api";
import { Matiere, MatieresParams, MatiereAddDTO, MatiereUpdateDTO } from "../types/matiere.type";

export interface IMatiereAPI {
  obtenirToutesMatieres(params?: MatieresParams): Promise<Matiere[]>;
  obtenirMatiere(id: string): Promise<Matiere>;
  ajouterMatiere(data: MatiereAddDTO): Promise<Matiere>;
  modifierMatiere(id: string, data: MatiereUpdateDTO): Promise<Matiere>;
  supprimerMatiere(id: string): Promise<void>;
}

export const matiereAPI: IMatiereAPI = {
  obtenirToutesMatieres(params?: MatieresParams): Promise<Matiere[]> {
    return api.request<Matiere[]>({
      endpoint: "matieres",
      method: "GET",
      searchParams: params as Record<string, string | number | boolean | undefined>,
    });
  },

  obtenirMatiere(id: string): Promise<Matiere> {
    return api.request<Matiere>({ endpoint: `matieres/${id}`, method: "GET" });
  },

  ajouterMatiere(data: MatiereAddDTO): Promise<Matiere> {
    return api.request<Matiere>({ endpoint: "matieres", method: "POST", data });
  },

  modifierMatiere(id: string, data: MatiereUpdateDTO): Promise<Matiere> {
    return api.request<Matiere>({ endpoint: `matieres/${id}`, method: "PUT", data });
  },

  supprimerMatiere(id: string): Promise<void> {
    return api.request<void>({ endpoint: `matieres/${id}`, method: "DELETE" });
  },
};


