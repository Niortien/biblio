import { useQuery } from "@tanstack/react-query";
import { documentAPI } from "../apis/document.api";
import { DocumentsParams } from "../types/document.type";

export const documentQueryKeys = {
  all: ["documents"] as const,
  lists: () => [...documentQueryKeys.all, "list"] as const,
  list: (params?: DocumentsParams) => [...documentQueryKeys.lists(), params] as const,
  details: () => [...documentQueryKeys.all, "detail"] as const,
  detail: (id: string) => [...documentQueryKeys.details(), id] as const,
};

export const useDocumentsQuery = (params?: DocumentsParams) => {
  return useQuery({
    queryKey: documentQueryKeys.list(params),
    queryFn: () => documentAPI.obtenirTousDocuments(params),
    staleTime: 60 * 1000, // 1 minute
    placeholderData: (prev) => prev,
  });
};

export const useDocumentQuery = (id: string) => {
  return useQuery({
    queryKey: documentQueryKeys.detail(id),
    queryFn: () => documentAPI.obtenirDocument(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
