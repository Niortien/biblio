import { useMutation, useQueryClient } from "@tanstack/react-query";
import { noteAPI } from "../apis/note.api";
import { noteQueryKeys } from "../queries/note.query";
import { NoteCreateDTO, NoteUpdateDTO, SaisirSessionDTO } from "../types/note.type";

export const useCreerNoteMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: NoteCreateDTO) => noteAPI.creerNote(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: noteQueryKeys.lists() }),
  });
};

export const useModifierNoteMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: NoteUpdateDTO }) => noteAPI.modifierNote(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: noteQueryKeys.lists() });
      queryClient.invalidateQueries({ queryKey: noteQueryKeys.all });
    },
  });
};

export const useSaisirSessionMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: SaisirSessionDTO }) => noteAPI.saisirSession(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: noteQueryKeys.lists() });
      queryClient.invalidateQueries({ queryKey: noteQueryKeys.all });
    },
  });
};

export const useSupprimerNoteMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => noteAPI.supprimerNote(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: noteQueryKeys.lists() }),
  });
};
