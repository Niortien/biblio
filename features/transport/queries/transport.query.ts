import { useQuery } from "@tanstack/react-query";
import { transportAPI } from "../apis/transport.api";

export const transportQueryKeys = {
  all: ["transport"] as const,
  configs: () => [...transportQueryKeys.all, "configs"] as const,
  config: (id: string) => [...transportQueryKeys.configs(), id] as const,
  abonnements: () => [...transportQueryKeys.all, "abonnements"] as const,
  abonnement: (id: string) => [...transportQueryKeys.abonnements(), id] as const,
  userAbonnements: (userId: string) => [...transportQueryKeys.all, "user", userId] as const,
  userDashboard: (userId: string) => [...transportQueryKeys.all, "dashboard", userId] as const,
  versements: (abonnementId: string) => [...transportQueryKeys.all, "versements", abonnementId] as const,
  userVersements: (userId: string) => [...transportQueryKeys.all, "userVersements", userId] as const,
};

export const useTransportConfigsQuery = () =>
  useQuery({
    queryKey: transportQueryKeys.configs(),
    queryFn: () => transportAPI.obtenirToutesConfigs(),
    staleTime: 60 * 1000,
  });

export const useTransportConfigQuery = (id: string) =>
  useQuery({
    queryKey: transportQueryKeys.config(id),
    queryFn: () => transportAPI.obtenirConfig(id),
    enabled: !!id,
  });

export const useTransportAbonnementsQuery = () =>
  useQuery({
    queryKey: transportQueryKeys.abonnements(),
    queryFn: () => transportAPI.obtenirTousAbonnements(),
    staleTime: 30 * 1000,
  });

export const useUserTransportAbonnementsQuery = (userId: string) =>
  useQuery({
    queryKey: transportQueryKeys.userAbonnements(userId),
    queryFn: () => transportAPI.obtenirAbonnementsParUser(userId),
    enabled: !!userId,
  });

export const useUserTransportDashboardQuery = (userId: string) =>
  useQuery({
    queryKey: transportQueryKeys.userDashboard(userId),
    queryFn: () => transportAPI.obtenirDashboardUser(userId),
    enabled: !!userId,
  });

export const useVersementsTransportQuery = (transportAbonnementId: string) =>
  useQuery({
    queryKey: transportQueryKeys.versements(transportAbonnementId),
    queryFn: () => transportAPI.obtenirVersementsAbonnement(transportAbonnementId),
    enabled: !!transportAbonnementId,
  });

export const useUserVersementsTransportQuery = (userId: string) =>
  useQuery({
    queryKey: transportQueryKeys.userVersements(userId),
    queryFn: () => transportAPI.obtenirVersementsUser(userId),
    enabled: !!userId,
  });
