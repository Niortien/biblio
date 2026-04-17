import { useMutation, useQueryClient } from "@tanstack/react-query";
import { scolariteAPI } from "../apis/scolarite.api";
import { scolariteQueryKeys } from "../queries/scolarite.query";
import {
  ScolariteConfigAddDTO,
  ScolariteConfigUpdateDTO,
  EcheancierConfigAddDTO,
  ScolariteEtudiantAddDTO,
  VersementScolariteAddDTO,
} from "../types/scolarite.type";

export const useAjouterScolariteConfigMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: ScolariteConfigAddDTO) => scolariteAPI.ajouterConfig(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: scolariteQueryKeys.configs() }),
  });
};

export const useModifierScolariteConfigMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: ScolariteConfigUpdateDTO }) =>
      scolariteAPI.modifierConfig(id, data),
    onSuccess: (_r, { id }) => {
      queryClient.invalidateQueries({ queryKey: scolariteQueryKeys.configs() });
      queryClient.invalidateQueries({ queryKey: scolariteQueryKeys.config(id) });
    },
  });
};

export const useSupprimerScolariteConfigMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => scolariteAPI.supprimerConfig(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: scolariteQueryKeys.configs() }),
  });
};

export const useAjouterEcheancierMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: EcheancierConfigAddDTO) => scolariteAPI.ajouterEcheancier(data),
    onSuccess: (_r, vars) => {
      queryClient.invalidateQueries({
        queryKey: scolariteQueryKeys.echeancier(vars.scolariteConfigId),
      });
    },
  });
};

export const useSupprimerEcheancierMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, configId }: { id: string; configId: string }) =>
      scolariteAPI.supprimerEcheancier(id),
    onSuccess: (_r, { configId }) => {
      queryClient.invalidateQueries({ queryKey: scolariteQueryKeys.echeancier(configId) });
    },
  });
};

export const useAssignerScolariteMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: ScolariteEtudiantAddDTO) => scolariteAPI.assignerScolarite(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: scolariteQueryKeys.scolarites() }),
  });
};

export const useSupprimerScolariteEtudiantMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => scolariteAPI.supprimerScolariteEtudiant(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: scolariteQueryKeys.scolarites() }),
  });
};

export const useAjouterVersementScolariteMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: VersementScolariteAddDTO) => scolariteAPI.ajouterVersement(data),
    onSuccess: (_r, vars) => {
      queryClient.invalidateQueries({ queryKey: scolariteQueryKeys.scolarites() });
      queryClient.invalidateQueries({
        queryKey: scolariteQueryKeys.versements(vars.scolariteEtudiantId),
      });
      if (vars.scolariteEtudiantId) {
        queryClient.invalidateQueries({
          queryKey: scolariteQueryKeys.echeancesEtudiant(vars.scolariteEtudiantId),
        });
      }
    },
  });
};

