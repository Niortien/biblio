import { api } from "@/lib/api";
import { ChangePasswordDTO, ChangePasswordResponse } from "../types/auth.type";

export const authAPI = {
  changerMotDePasse(data: ChangePasswordDTO, tokenKey?: string): Promise<ChangePasswordResponse> {
    return api.request<ChangePasswordResponse>({
      endpoint: "auth/change-password",
      method: "PATCH",
      data,
      tokenKey,
    });
  },
};
