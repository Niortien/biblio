import { useMutation, useQueryClient } from "@tanstack/react-query";
import { documentAPI } from "../apis/document.api";
import { documentQueryKeys } from "../queries/document.query";
import { DocumentAddDTO, DocumentUpdateDTO } from "../types/document.type";

export const useAjouterDocumentMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: DocumentAddDTO) => documentAPI.ajouterDocument(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: documentQueryKeys.lists() });
    },
  });
};

export const useModifierDocumentMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: DocumentUpdateDTO }) =>
      documentAPI.modifierDocument(id, data),
    onSuccess: (_result, { id }) => {
      queryClient.invalidateQueries({ queryKey: documentQueryKeys.lists() });
      queryClient.invalidateQueries({ queryKey: documentQueryKeys.detail(id) });
    },
  });
};

export const useSupprimerDocumentMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => documentAPI.supprimerDocument(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: documentQueryKeys.lists() });
    },
  });
};
