import { useMutation, useQueryClient } from "@tanstack/react-query";
import { filiereAPI } from "../apis/filiere.api";
import { filiereQueryKeys } from "../queries/filiere.query";
import { FiliereAddDTO, FiliereUpdateDTO } from "../types/filiere.type";

export const useAjouterFiliereMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: FiliereAddDTO) => filiereAPI.ajouterFiliere(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: filiereQueryKeys.lists() }),
  });
};

export const useModifierFiliereMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: FiliereUpdateDTO }) =>
      filiereAPI.modifierFiliere(id, data),
    onSuccess: (_res, { id }) => {
      queryClient.invalidateQueries({ queryKey: filiereQueryKeys.lists() });
      queryClient.invalidateQueries({ queryKey: filiereQueryKeys.detail(id) });
    },
  });
};

export const useSupprimerFiliereMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => filiereAPI.supprimerFiliere(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: filiereQueryKeys.lists() }),
  });
};
