import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { professeurAPI } from "../apis/professeur.api";
import { AssignMatiereDTO } from "../types/professeur.type";

export const professeurQueryKeys = {
  all: ["professeur"] as const,
  mesClasses: () => [...professeurQueryKeys.all, "mes-classes"] as const,
  mesMatieres: () => [...professeurQueryKeys.all, "mes-matieres"] as const,
  liste: () => [...professeurQueryKeys.all, "liste"] as const,
  matieresOf: (id: string) => [...professeurQueryKeys.all, "matieres", id] as const,
};

export const useMesClassesQuery = (options: { enabled?: boolean } = {}) =>
  useQuery({
    queryKey: professeurQueryKeys.mesClasses(),
    queryFn: () => professeurAPI.getMesClasses(),
    staleTime: 60 * 1000,
    enabled: options.enabled !== undefined ? options.enabled : true,
  });

export const useMesMatieresQuery = (options: { enabled?: boolean } = {}) =>
  useQuery({
    queryKey: professeurQueryKeys.mesMatieres(),
    queryFn: () => professeurAPI.getMesMatieres(),
    staleTime: 60 * 1000,
    enabled: options.enabled !== undefined ? options.enabled : true,
  });

export const useAllProfesseursQuery = () =>
  useQuery({
    queryKey: professeurQueryKeys.liste(),
    queryFn: () => professeurAPI.getAllProfesseurs(),
    staleTime: 60 * 1000,
  });

export const useMatieresOfProfesseurQuery = (professeurId: string) =>
  useQuery({
    queryKey: professeurQueryKeys.matieresOf(professeurId),
    queryFn: () => professeurAPI.getMatieresOfProfesseur(professeurId),
    enabled: !!professeurId,
    staleTime: 60 * 1000,
  });

export const useAssignMatiereMutation = (professeurId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: AssignMatiereDTO) => professeurAPI.assignMatiere(professeurId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: professeurQueryKeys.matieresOf(professeurId) });
      queryClient.invalidateQueries({ queryKey: professeurQueryKeys.liste() });
    },
  });
};

export const useRemoveMatiereMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => professeurAPI.removeMatiere(id),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: professeurQueryKeys.all }),
  });
};
