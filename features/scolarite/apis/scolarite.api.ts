import { api } from "@/lib/api";
import {
  ScolariteConfig,
  ScolariteConfigAddDTO,
  ScolariteConfigUpdateDTO,
  EcheancierConfig,
  EcheancierConfigAddDTO,
  EcheanceEtudiant,
  ScolariteEtudiant,
  ScolariteEtudiantAddDTO,
  VersementScolarite,
  VersementScolariteAddDTO,
  VersementScolariteResponse,
  ScolariteDashboard,
} from "../types/scolarite.type";

export const scolariteAPI = {
  // --- Config ---
  obtenirToutesConfigs(): Promise<ScolariteConfig[]> {
    return api.request<ScolariteConfig[]>({ endpoint: "scolarite/config", method: "GET" });
  },
  obtenirConfig(id: string): Promise<ScolariteConfig> {
    return api.request<ScolariteConfig>({ endpoint: `scolarite/config/${id}`, method: "GET" });
  },
  ajouterConfig(data: ScolariteConfigAddDTO): Promise<ScolariteConfig> {
    return api.request<ScolariteConfig>({ endpoint: "scolarite/config", method: "POST", data });
  },
  modifierConfig(id: string, data: ScolariteConfigUpdateDTO): Promise<ScolariteConfig> {
    return api.request<ScolariteConfig>({ endpoint: `scolarite/config/${id}`, method: "PUT", data });
  },
  supprimerConfig(id: string): Promise<void> {
    return api.request<void>({ endpoint: `scolarite/config/${id}`, method: "DELETE" });
  },

  // --- Écheancier (plan de paiement) ---
  obtenirEcheancierConfig(configId: string): Promise<EcheancierConfig[]> {
    return api.request<EcheancierConfig[]>({
      endpoint: `scolarite/echeancier/config/${configId}`,
      method: "GET",
    });
  },
  ajouterEcheancier(data: EcheancierConfigAddDTO): Promise<EcheancierConfig> {
    return api.request<EcheancierConfig>({ endpoint: "scolarite/echeancier", method: "POST", data });
  },
  supprimerEcheancier(id: string): Promise<void> {
    return api.request<void>({ endpoint: `scolarite/echeancier/${id}`, method: "DELETE" });
  },

  // --- Scolarités étudiants ---
  obtenirToutesScolarites(): Promise<ScolariteEtudiant[]> {
    return api.request<ScolariteEtudiant[]>({ endpoint: "scolarite/etudiants", method: "GET" });
  },
  obtenirScolarite(id: string): Promise<ScolariteEtudiant> {
    return api.request<ScolariteEtudiant>({ endpoint: `scolarite/etudiants/${id}`, method: "GET" });
  },
  obtenirScolaritesParUser(userId: string): Promise<ScolariteEtudiant[]> {
    return api.request<ScolariteEtudiant[]>({ endpoint: `scolarite/user/${userId}`, method: "GET" });
  },
  obtenirDashboardUser(userId: string): Promise<ScolariteDashboard> {
    return api.request<ScolariteDashboard>({ endpoint: `scolarite/user/${userId}/dashboard`, method: "GET" });
  },
  assignerScolarite(data: ScolariteEtudiantAddDTO): Promise<ScolariteEtudiant> {
    return api.request<ScolariteEtudiant>({ endpoint: "scolarite/etudiants", method: "POST", data });
  },
  supprimerScolariteEtudiant(id: string): Promise<void> {
    return api.request<void>({ endpoint: `scolarite/etudiants/${id}`, method: "DELETE" });
  },

  // --- Échéances étudiant ---
  obtenirEcheancesEtudiant(scolariteEtudiantId: string): Promise<EcheanceEtudiant[]> {
    return api.request<EcheanceEtudiant[]>({
      endpoint: `scolarite/echeances/etudiant/${scolariteEtudiantId}`,
      method: "GET",
    });
  },
  obtenirEcheancesUser(userId: string): Promise<EcheanceEtudiant[]> {
    return api.request<EcheanceEtudiant[]>({
      endpoint: `scolarite/echeances/user/${userId}`,
      method: "GET",
    });
  },

  // --- Versements ---
  obtenirVersementsScolarite(scolariteEtudiantId: string): Promise<VersementScolarite[]> {
    return api.request<VersementScolarite[]>({
      endpoint: `scolarite/versements/scolarite/${scolariteEtudiantId}`,
      method: "GET",
    });
  },
  obtenirVersementsUser(userId: string): Promise<VersementScolarite[]> {
    return api.request<VersementScolarite[]>({
      endpoint: `scolarite/versements/user/${userId}`,
      method: "GET",
    });
  },
  ajouterVersement(data: VersementScolariteAddDTO): Promise<VersementScolariteResponse> {
    return api.request<VersementScolariteResponse>({ endpoint: "scolarite/versements", method: "POST", data });
  },
};
