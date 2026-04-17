import { api } from "@/lib/api";
import { ProfesseurMatiere, AssignMatiereDTO, ClasseResumee } from "../types/professeur.type";
import { Matiere } from "@/features/matieres/types/matiere.type";
import { User } from "@/features/users/types/user.type";

export const professeurAPI = {
  /** Mes classes (professeur connecté) – retourne les classes regroupées par filière+niveau */
  getMesClasses(): Promise<ClasseResumee[]> {
    return api.request<ClasseResumee[]>({ endpoint: "professeur/mes-classes", method: "GET", tokenKey: "professeur_token" });
  },

  /** Mes matières (professeur connecté) */
  getMesMatieres(): Promise<Matiere[]> {
    return api.request<Matiere[]>({ endpoint: "professeur/mes-matieres", method: "GET", tokenKey: "professeur_token" });
  },

  /** Liste tous les professeurs (admin) */
  getAllProfesseurs(): Promise<User[]> {
    return api.request<User[]>({ endpoint: "professeur/liste", method: "GET" });
  },

  /** Matières d'un professeur (admin) */
  getMatieresOfProfesseur(professeurId: string): Promise<ProfesseurMatiere[]> {
    return api.request<ProfesseurMatiere[]>({
      endpoint: `professeur/${professeurId}/matieres`,
      method: "GET",
    });
  },

  /** Affecter une matière à un professeur (admin) */
  assignMatiere(professeurId: string, data: AssignMatiereDTO): Promise<ProfesseurMatiere> {
    return api.request<ProfesseurMatiere>({
      endpoint: `professeur/${professeurId}/matieres`,
      method: "POST",
      data,
    });
  },

  /** Retirer une affectation matière (admin) */
  removeMatiere(id: string): Promise<void> {
    return api.request<void>({ endpoint: `professeur/matieres/${id}`, method: "DELETE" });
  },
};
