import { useQuery } from "@tanstack/react-query";
import { adminAPI } from "../apis/admin.api";

export const adminQueryKeys = {
  all: ["admin"] as const,
  niveauxGroupes: () => [...adminQueryKeys.all, "niveauxGroupes"] as const,
  filieresParNiveau: (niveauName: string) => [...adminQueryKeys.all, "filieres", niveauName] as const,
  overviewParNiveau: (niveauId: string) => [...adminQueryKeys.all, "overview", niveauId] as const,
  etudiantsParNiveau: (niveauId: string) => [...adminQueryKeys.all, "etudiants", niveauId] as const,
};

export const useNiveauxGroupesQuery = () =>
  useQuery({
    queryKey: adminQueryKeys.niveauxGroupes(),
    queryFn: () => adminAPI.obtenirNiveauxGroupes(),
    staleTime: 30 * 1000,
  });

export const useFilieresParNiveauQuery = (niveauName: string) =>
  useQuery({
    queryKey: adminQueryKeys.filieresParNiveau(niveauName),
    queryFn: () => adminAPI.obtenirFilieresParNiveauName(niveauName),
    enabled: !!niveauName,
  });

export const useOverviewParNiveauQuery = (niveauId: string) =>
  useQuery({
    queryKey: adminQueryKeys.overviewParNiveau(niveauId),
    queryFn: () => adminAPI.obtenirOverviewParNiveau(niveauId),
    enabled: !!niveauId,
  });

export const useEtudiantsParNiveauQuery = (niveauId: string) =>
  useQuery({
    queryKey: adminQueryKeys.etudiantsParNiveau(niveauId),
    queryFn: () => adminAPI.obtenirEtudiantsParNiveau(niveauId),
    enabled: !!niveauId,
  });
