import { useQuery } from "@tanstack/react-query";
import { scolariteAPI } from "../apis/scolarite.api";

export const scolariteQueryKeys = {
  all: ["scolarite"] as const,
  configs: () => [...scolariteQueryKeys.all, "configs"] as const,
  config: (id: string) => [...scolariteQueryKeys.configs(), id] as const,
  echeancier: (configId: string) => [...scolariteQueryKeys.all, "echeancier", configId] as const,
  scolarites: () => [...scolariteQueryKeys.all, "scolarites"] as const,
  scolarite: (id: string) => [...scolariteQueryKeys.scolarites(), id] as const,
  userScolarites: (userId: string) => [...scolariteQueryKeys.all, "user", userId] as const,
  userDashboard: (userId: string) => [...scolariteQueryKeys.all, "dashboard", userId] as const,
  echeancesEtudiant: (scolariteEtudiantId: string) => [...scolariteQueryKeys.all, "echeances", scolariteEtudiantId] as const,
  echeancesUser: (userId: string) => [...scolariteQueryKeys.all, "echeancesUser", userId] as const,
  versements: (scolariteId: string) => [...scolariteQueryKeys.all, "versements", scolariteId] as const,
  userVersements: (userId: string) => [...scolariteQueryKeys.all, "userVersements", userId] as const,
};

export const useScolariteConfigsQuery = () =>
  useQuery({
    queryKey: scolariteQueryKeys.configs(),
    queryFn: () => scolariteAPI.obtenirToutesConfigs(),
    staleTime: 60 * 1000,
  });

export const useScolariteConfigQuery = (id: string) =>
  useQuery({
    queryKey: scolariteQueryKeys.config(id),
    queryFn: () => scolariteAPI.obtenirConfig(id),
    enabled: !!id,
  });

export const useEcheancierConfigQuery = (configId: string) =>
  useQuery({
    queryKey: scolariteQueryKeys.echeancier(configId),
    queryFn: () => scolariteAPI.obtenirEcheancierConfig(configId),
    enabled: !!configId,
  });

export const useScolaritesQuery = () =>
  useQuery({
    queryKey: scolariteQueryKeys.scolarites(),
    queryFn: () => scolariteAPI.obtenirToutesScolarites(),
    staleTime: 30 * 1000,
  });

export const useUserScolaritesQuery = (userId: string) =>
  useQuery({
    queryKey: scolariteQueryKeys.userScolarites(userId),
    queryFn: () => scolariteAPI.obtenirScolaritesParUser(userId),
    enabled: !!userId,
  });

export const useUserScolariteDashboardQuery = (userId: string) =>
  useQuery({
    queryKey: scolariteQueryKeys.userDashboard(userId),
    queryFn: () => scolariteAPI.obtenirDashboardUser(userId),
    enabled: !!userId,
  });

export const useEcheancesEtudiantQuery = (scolariteEtudiantId: string) =>
  useQuery({
    queryKey: scolariteQueryKeys.echeancesEtudiant(scolariteEtudiantId),
    queryFn: () => scolariteAPI.obtenirEcheancesEtudiant(scolariteEtudiantId),
    enabled: !!scolariteEtudiantId,
  });

export const useEcheancesUserQuery = (userId: string) =>
  useQuery({
    queryKey: scolariteQueryKeys.echeancesUser(userId),
    queryFn: () => scolariteAPI.obtenirEcheancesUser(userId),
    enabled: !!userId,
  });

export const useVersementsScolariteQuery = (scolariteEtudiantId: string) =>
  useQuery({
    queryKey: scolariteQueryKeys.versements(scolariteEtudiantId),
    queryFn: () => scolariteAPI.obtenirVersementsScolarite(scolariteEtudiantId),
    enabled: !!scolariteEtudiantId,
  });

export const useUserVersementsScolariteQuery = (userId: string) =>
  useQuery({
    queryKey: scolariteQueryKeys.userVersements(userId),
    queryFn: () => scolariteAPI.obtenirVersementsUser(userId),
    enabled: !!userId,
  });

