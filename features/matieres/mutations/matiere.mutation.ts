import { useMutation, useQueryClient } from "@tanstack/react-query";
import { matiereAPI } from "../apis/matiere.api";
import { matiereQueryKeys } from "../queries/matiere.query";
import { MatiereAddDTO, MatiereUpdateDTO } from "../types/matiere.type";

export const useAjouterMatiereMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: MatiereAddDTO) => matiereAPI.ajouterMatiere(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: matiereQueryKeys.lists() }),
  });
};

export const useModifierMatiereMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: MatiereUpdateDTO }) =>
      matiereAPI.modifierMatiere(id, data),
    onSuccess: (_res, { id }) => {
      queryClient.invalidateQueries({ queryKey: matiereQueryKeys.lists() });
      queryClient.invalidateQueries({ queryKey: matiereQueryKeys.detail(id) });
    },
  });
};

export const useSupprimerMatiereMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => matiereAPI.supprimerMatiere(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: matiereQueryKeys.lists() }),
  });
};
