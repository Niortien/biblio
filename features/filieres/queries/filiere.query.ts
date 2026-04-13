import { useQuery } from "@tanstack/react-query";
import { filiereAPI } from "../apis/filiere.api";
import { FilieresParams } from "../types/filiere.type";

export const filiereQueryKeys = {
  all: ["filieres"] as const,
  lists: () => [...filiereQueryKeys.all, "list"] as const,
  list: (params?: FilieresParams) => [...filiereQueryKeys.lists(), params] as const,
  details: () => [...filiereQueryKeys.all, "detail"] as const,
  detail: (id: string) => [...filiereQueryKeys.details(), id] as const,
};

export const useFilieresQuery = (params?: FilieresParams) =>
  useQuery({
    queryKey: filiereQueryKeys.list(params),
    queryFn: () => filiereAPI.obtenirToutesFilieres(params),
    staleTime: 60 * 1000,
    placeholderData: (prev) => prev,
  });

export const useFiliereQuery = (id: string) =>
  useQuery({
    queryKey: filiereQueryKeys.detail(id),
    queryFn: () => filiereAPI.obtenirFiliere(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });

