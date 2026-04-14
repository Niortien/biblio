import { useMutation, useQueryClient } from "@tanstack/react-query";
import { userAPI } from "../apis/user.api";
import { userQueryKeys } from "../queries/user.query";
import { UserAddDTO, UserUpdateDTO } from "../types/user.type";

export const useAjouterUtilisateurMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: UserAddDTO) => userAPI.ajouterUtilisateur(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: userQueryKeys.lists() }),
  });
};

export const useModifierUtilisateurMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UserUpdateDTO }) =>
      userAPI.modifierUtilisateur(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: userQueryKeys.lists() }),
  });
};

export const useSupprimerUtilisateurMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => userAPI.supprimerUtilisateur(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: userQueryKeys.lists() }),
  });
};
