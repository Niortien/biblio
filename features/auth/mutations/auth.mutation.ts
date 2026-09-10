import { useMutation } from "@tanstack/react-query";
import { authAPI } from "../apis/auth.api";
import { ChangePasswordDTO } from "../types/auth.type";

export const useChangerMotDePasseMutation = (tokenKey?: string) => {
  return useMutation({
    mutationFn: (data: ChangePasswordDTO) => authAPI.changerMotDePasse(data, tokenKey),
  });
};
