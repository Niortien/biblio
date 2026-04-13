import { api } from "@/lib/api";
import { Niveau, NiveauxParams, NiveauAddDTO, NiveauUpdateDTO } from "../types/niveau.type";

export interface INiveauAPI {
  obtenirTousNiveaux(params?: NiveauxParams): Promise<Niveau[]>;
  obtenirNiveau(id: string): Promise<Niveau>;
  ajouterNiveau(data: NiveauAddDTO): Promise<Niveau>;
  modifierNiveau(id: string, data: NiveauUpdateDTO): Promise<Niveau>;
  supprimerNiveau(id: string): Promise<void>;
}

export const niveauAPI: INiveauAPI = {
  obtenirTousNiveaux(params?: NiveauxParams): Promise<Niveau[]> {
    return api.request<Niveau[]>({
      endpoint: "niveaux",
      method: "GET",
      searchParams: params as Record<string, string | number | boolean | undefined>,
    });
  },

  obtenirNiveau(id: string): Promise<Niveau> {
    return api.request<Niveau>({ endpoint: `niveaux/${id}`, method: "GET" });
  },

  ajouterNiveau(data: NiveauAddDTO): Promise<Niveau> {
    return api.request<Niveau>({ endpoint: "niveaux", method: "POST", data });
  },

  modifierNiveau(id: string, data: NiveauUpdateDTO): Promise<Niveau> {
    return api.request<Niveau>({ endpoint: `niveaux/${id}`, method: "PUT", data });
  },

  supprimerNiveau(id: string): Promise<void> {
    return api.request<void>({ endpoint: `niveaux/${id}`, method: "DELETE" });
  },
};

