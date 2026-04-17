import { useQuery } from "@tanstack/react-query";
import { noteAPI } from "../apis/note.api";
import { NotesParams } from "../types/note.type";

export const noteQueryKeys = {
  all: ["notes"] as const,
  lists: () => [...noteQueryKeys.all, "list"] as const,
  list: (params: NotesParams) => [...noteQueryKeys.lists(), params] as const,
  detail: (id: string) => [...noteQueryKeys.all, "detail", id] as const,
  bulletin: (etudiantId: string, annee: string) => [...noteQueryKeys.all, "bulletin", etudiantId, annee] as const,
  monBulletin: (annee: string) => [...noteQueryKeys.all, "mon-bulletin", annee] as const,
};

export const useNotesQuery = (params: NotesParams, options: { enabled?: boolean } = {}) =>
  useQuery({
    queryKey: noteQueryKeys.list(params),
    queryFn: () => noteAPI.listerNotes(params),
    enabled: (options.enabled !== undefined ? options.enabled : true) && !!params.anneeAcademique,
    staleTime: 30 * 1000,
    placeholderData: (prev) => prev,
  });

export const useBulletinQuery = (etudiantId: string, anneeAcademique: string, options: { enabled?: boolean } = {}) =>
  useQuery({
    queryKey: noteQueryKeys.bulletin(etudiantId, anneeAcademique),
    queryFn: () => noteAPI.getBulletin(etudiantId, anneeAcademique),
    enabled: (options.enabled !== undefined ? options.enabled : true) && !!etudiantId && !!anneeAcademique,
    staleTime: 30 * 1000,
  });

export const useMonBulletinQuery = (anneeAcademique: string, options: { enabled?: boolean } = {}) =>
  useQuery({
    queryKey: noteQueryKeys.monBulletin(anneeAcademique),
    queryFn: () => noteAPI.getMonBulletin(anneeAcademique),
    enabled: (options.enabled !== undefined ? options.enabled : true) && !!anneeAcademique,
    staleTime: 30 * 1000,
  });
