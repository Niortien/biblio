import { api } from "@/lib/api";
import { User, UserAddDTO, UserUpdateDTO, UsersParams } from "../types/user.type";

export const userAPI = {
  obtenirTousUtilisateurs(params?: UsersParams): Promise<User[]> {
    return api.request<User[]>({
      endpoint: "users",
      method: "GET",
      searchParams: params as Record<string, string | number | boolean | undefined>,
    });
  },

  obtenirUtilisateur(id: string): Promise<User> {
    return api.request<User>({ endpoint: `users/${id}`, method: "GET" });
  },

  ajouterUtilisateur(data: UserAddDTO): Promise<User> {
    return api.request<User>({ endpoint: "users", method: "POST", data });
  },

  modifierUtilisateur(id: string, data: UserUpdateDTO): Promise<User> {
    return api.request<User>({ endpoint: `users/${id}`, method: "PUT", data });
  },

  supprimerUtilisateur(id: string): Promise<void> {
    return api.request<void>({ endpoint: `users/${id}`, method: "DELETE" });
  },

  uploadImage(id: string, file: File): Promise<User> {
    const formData = new FormData();
    formData.append("image", file);
    return api.request<User>({ endpoint: `users/${id}/image`, method: "PATCH", data: formData });
  },
};
