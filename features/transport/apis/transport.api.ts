import { api } from "@/lib/api";
import {
  TransportConfig,
  TransportConfigAddDTO,
  TransportConfigUpdateDTO,
  TransportAbonnement,
  TransportAbonnementAddDTO,
  VersementTransport,
  VersementTransportAddDTO,
  TransportDashboard,
} from "../types/transport.type";

export const transportAPI = {
  // --- Config ---
  obtenirToutesConfigs(): Promise<TransportConfig[]> {
    return api.request<TransportConfig[]>({ endpoint: "transport/config", method: "GET" });
  },
  obtenirConfig(id: string): Promise<TransportConfig> {
    return api.request<TransportConfig>({ endpoint: `transport/config/${id}`, method: "GET" });
  },
  ajouterConfig(data: TransportConfigAddDTO): Promise<TransportConfig> {
    return api.request<TransportConfig>({ endpoint: "transport/config", method: "POST", data });
  },
  modifierConfig(id: string, data: TransportConfigUpdateDTO): Promise<TransportConfig> {
    return api.request<TransportConfig>({ endpoint: `transport/config/${id}`, method: "PUT", data });
  },
  supprimerConfig(id: string): Promise<void> {
    return api.request<void>({ endpoint: `transport/config/${id}`, method: "DELETE" });
  },

  // --- Abonnements ---
  obtenirTousAbonnements(): Promise<TransportAbonnement[]> {
    return api.request<TransportAbonnement[]>({ endpoint: "transport/abonnements", method: "GET" });
  },
  obtenirAbonnement(id: string): Promise<TransportAbonnement> {
    return api.request<TransportAbonnement>({ endpoint: `transport/abonnements/${id}`, method: "GET" });
  },
  obtenirAbonnementsParUser(userId: string): Promise<TransportAbonnement[]> {
    return api.request<TransportAbonnement[]>({ endpoint: `transport/user/${userId}`, method: "GET" });
  },
  obtenirDashboardUser(userId: string): Promise<TransportDashboard> {
    return api.request<TransportDashboard>({ endpoint: `transport/user/${userId}/dashboard`, method: "GET" });
  },
  creerAbonnement(data: TransportAbonnementAddDTO): Promise<TransportAbonnement> {
    return api.request<TransportAbonnement>({ endpoint: "transport/abonnements", method: "POST", data });
  },
  supprimerAbonnement(id: string): Promise<void> {
    return api.request<void>({ endpoint: `transport/abonnements/${id}`, method: "DELETE" });
  },

  // --- Versements ---
  obtenirVersementsAbonnement(transportAbonnementId: string): Promise<VersementTransport[]> {
    return api.request<VersementTransport[]>({
      endpoint: `transport/versements/abonnement/${transportAbonnementId}`,
      method: "GET",
    });
  },
  obtenirVersementsUser(userId: string): Promise<VersementTransport[]> {
    return api.request<VersementTransport[]>({
      endpoint: `transport/versements/user/${userId}`,
      method: "GET",
    });
  },
  ajouterVersement(data: VersementTransportAddDTO): Promise<VersementTransport> {
    return api.request<VersementTransport>({ endpoint: "transport/versements", method: "POST", data });
  },
};
