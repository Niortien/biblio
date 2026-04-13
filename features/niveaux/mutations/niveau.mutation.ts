import { useMutation, useQueryClient } from "@tanstack/react-query";
import { niveauAPI } from "../apis/niveau.api";
import { niveauQueryKeys } from "../queries/niveau.query";
import { NiveauAddDTO, NiveauUpdateDTO } from "../types/niveau.type";

export const useAjouterNiveauMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: NiveauAddDTO) => niveauAPI.ajouterNiveau(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: niveauQueryKeys.lists() }),
  });
};

export const useModifierNiveauMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: NiveauUpdateDTO }) =>
      niveauAPI.modifierNiveau(id, data),
    onSuccess: (_res, { id }) => {
      queryClient.invalidateQueries({ queryKey: niveauQueryKeys.lists() });
      queryClient.invalidateQueries({ queryKey: niveauQueryKeys.detail(id) });
    },
  });
};

export const useSupprimerNiveauMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => niveauAPI.supprimerNiveau(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: niveauQueryKeys.lists() }),
  });
};
