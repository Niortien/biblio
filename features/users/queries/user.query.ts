import { useQuery } from "@tanstack/react-query";
import { userAPI } from "../apis/user.api";

export const userQueryKeys = {
  all: ["users"] as const,
  lists: () => [...userQueryKeys.all, "list"] as const,
  detail: (id: string) => [...userQueryKeys.all, "detail", id] as const,
};

export const useUsersQuery = () => {
  return useQuery({
    queryKey: userQueryKeys.lists(),
    queryFn: () => userAPI.obtenirTousUtilisateurs(),
    staleTime: 60 * 1000,
  });
};
