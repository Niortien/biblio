import { useQuery } from "@tanstack/react-query";
import { userAPI } from "../apis/user.api";
import { UsersParams } from "../types/user.type";

export const userQueryKeys = {
  all: ["users"] as const,
  lists: () => [...userQueryKeys.all, "list"] as const,
  list: (params: UsersParams) => [...userQueryKeys.lists(), params] as const,
  detail: (id: string) => [...userQueryKeys.all, "detail", id] as const,
};

export const useUsersQuery = (params?: UsersParams) => {
  return useQuery({
    queryKey: params ? userQueryKeys.list(params) : userQueryKeys.lists(),
    queryFn: () => userAPI.obtenirTousUtilisateurs(params),
    staleTime: 60 * 1000,
    placeholderData: (prev) => prev,
  });
};
