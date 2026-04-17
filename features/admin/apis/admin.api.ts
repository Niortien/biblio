import { api } from "@/lib/api";
import {
  NiveauGroupe,
  FiliereParNiveau,
  NiveauOverview,
  EtudiantNiveau,
} from "../types/admin.type";

export const adminAPI = {
  // GET /admin/niveaux
  obtenirNiveauxGroupes(): Promise<NiveauGroupe[]> {
    return api.request<NiveauGroupe[]>({ endpoint: "admin/niveaux", method: "GET" });
  },

  // GET /admin/niveaux/:niveauName/filieres
  obtenirFilieresParNiveauName(niveauName: string): Promise<FiliereParNiveau[]> {
    return api.request<FiliereParNiveau[]>({
      endpoint: `admin/niveaux/${encodeURIComponent(niveauName)}/filieres`,
      method: "GET",
    });
  },

  // GET /admin/niveaux/:niveauId/overview
  obtenirOverviewParNiveau(niveauId: string): Promise<NiveauOverview> {
    return api.request<NiveauOverview>({
      endpoint: `admin/niveaux/${niveauId}/overview`,
      method: "GET",
    });
  },

  // GET /admin/niveaux/:niveauId/etudiants
  obtenirEtudiantsParNiveau(niveauId: string): Promise<EtudiantNiveau[]> {
    return api.request<EtudiantNiveau[]>({
      endpoint: `admin/niveaux/${niveauId}/etudiants`,
      method: "GET",
    });
  },
};

