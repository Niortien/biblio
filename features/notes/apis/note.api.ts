import { api } from "@/lib/api";
import {
  NoteEtudiant,
  BulletinEtudiant,
  NoteCreateDTO,
  NoteUpdateDTO,
  SaisirSessionDTO,
  NotesParams,
} from "../types/note.type";

export const noteAPI = {
  creerNote(data: NoteCreateDTO): Promise<NoteEtudiant> {
    return api.request<NoteEtudiant>({ endpoint: "notes", method: "POST", data });
  },

  modifierNote(id: string, data: NoteUpdateDTO): Promise<NoteEtudiant> {
    return api.request<NoteEtudiant>({ endpoint: `notes/${id}`, method: "PUT", data });
  },

  saisirSession(id: string, data: SaisirSessionDTO): Promise<NoteEtudiant> {
    return api.request<NoteEtudiant>({ endpoint: `notes/${id}/session`, method: "PUT", data });
  },

  supprimerNote(id: string): Promise<void> {
    return api.request<void>({ endpoint: `notes/${id}`, method: "DELETE" });
  },

  obtenirNote(id: string): Promise<NoteEtudiant> {
    return api.request<NoteEtudiant>({ endpoint: `notes/${id}`, method: "GET" });
  },

  listerNotes(params: NotesParams): Promise<NoteEtudiant[]> {
    return api.request<NoteEtudiant[]>({
      endpoint: "notes",
      method: "GET",
      searchParams: params as Record<string, string | number | boolean | undefined>,
    });
  },

  getBulletin(etudiantId: string, anneeAcademique: string): Promise<BulletinEtudiant> {
    return api.request<BulletinEtudiant>({
      endpoint: `notes/bulletin/${etudiantId}`,
      method: "GET",
      searchParams: { anneeAcademique },
    });
  },

  getMonBulletin(anneeAcademique: string): Promise<BulletinEtudiant> {
    return api.request<BulletinEtudiant>({
      endpoint: "notes/mon-bulletin",
      method: "GET",
      searchParams: { anneeAcademique },
    });
  },
};
