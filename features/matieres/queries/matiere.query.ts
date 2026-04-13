import { useQuery } from "@tanstack/react-query";
import { matiereAPI } from "../apis/matiere.api";
import { MatieresParams } from "../types/matiere.type";

export const matiereQueryKeys = {
  all: ["matieres"] as const,
  lists: () => [...matiereQueryKeys.all, "list"] as const,
  list: (params?: MatieresParams) => [...matiereQueryKeys.lists(), params] as const,
  details: () => [...matiereQueryKeys.all, "detail"] as const,
  detail: (id: string) => [...matiereQueryKeys.details(), id] as const,
};

export const useMatieresQuery = (params?: MatieresParams, options: { enabled?: boolean } = {}) =>
  useQuery({
    queryKey: matiereQueryKeys.list(params),
    queryFn: () => matiereAPI.obtenirToutesMatieres(params),
    staleTime: 60 * 1000,
    placeholderData: (prev) => prev,
    enabled: options.enabled !== undefined ? options.enabled : true,
  });

export const useMatiereQuery = (id: string) =>
  useQuery({
    queryKey: matiereQueryKeys.detail(id),
    queryFn: () => matiereAPI.obtenirMatiere(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });

