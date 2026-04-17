import { useMutation, useQueryClient } from "@tanstack/react-query";
import { transportAPI } from "../apis/transport.api";
import { transportQueryKeys } from "../queries/transport.query";
import {
  TransportConfigAddDTO,
  TransportConfigUpdateDTO,
  TransportAbonnementAddDTO,
  VersementTransportAddDTO,
} from "../types/transport.type";

export const useAjouterTransportConfigMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: TransportConfigAddDTO) => transportAPI.ajouterConfig(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: transportQueryKeys.configs() }),
  });
};

export const useModifierTransportConfigMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: TransportConfigUpdateDTO }) =>
      transportAPI.modifierConfig(id, data),
    onSuccess: (_r, { id }) => {
      queryClient.invalidateQueries({ queryKey: transportQueryKeys.configs() });
      queryClient.invalidateQueries({ queryKey: transportQueryKeys.config(id) });
    },
  });
};

export const useSupprimerTransportConfigMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => transportAPI.supprimerConfig(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: transportQueryKeys.configs() }),
  });
};

export const useCreerAbonnementMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: TransportAbonnementAddDTO) => transportAPI.creerAbonnement(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: transportQueryKeys.abonnements() }),
  });
};

export const useSupprimerAbonnementMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => transportAPI.supprimerAbonnement(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: transportQueryKeys.abonnements() }),
  });
};

export const useAjouterVersementTransportMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: VersementTransportAddDTO) => transportAPI.ajouterVersement(data),
    onSuccess: (_r, vars) => {
      queryClient.invalidateQueries({ queryKey: transportQueryKeys.abonnements() });
      queryClient.invalidateQueries({
        queryKey: transportQueryKeys.versements(vars.transportAbonnementId),
      });
    },
  });
};
