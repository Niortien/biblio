import { useQuery } from "@tanstack/react-query";
import { niveauAPI } from "../apis/niveau.api";
import { NiveauxParams } from "../types/niveau.type";

export const niveauQueryKeys = {
  all: ["niveaux"] as const,
  lists: () => [...niveauQueryKeys.all, "list"] as const,
  list: (params?: NiveauxParams) => [...niveauQueryKeys.lists(), params] as const,
  details: () => [...niveauQueryKeys.all, "detail"] as const,
  detail: (id: string) => [...niveauQueryKeys.details(), id] as const,
};

export const useNiveauxQuery = (params?: NiveauxParams, options: { enabled?: boolean } = {}) =>
  useQuery({
    queryKey: niveauQueryKeys.list(params),
    queryFn: () => niveauAPI.obtenirTousNiveaux(params),
    staleTime: 60 * 1000,
    placeholderData: (prev) => prev,
    enabled: options.enabled !== undefined ? options.enabled : true,
  });

export const useNiveauQuery = (id: string) =>
  useQuery({
    queryKey: niveauQueryKeys.detail(id),
    queryFn: () => niveauAPI.obtenirNiveau(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });

