import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as authApi from "@/api/auth";
import { useAuthStore } from "@/store/authStore";

export function useAuth() {
  const queryClient = useQueryClient();
  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);
  const clear = useAuthStore((state) => state.clear);

  const me = useQuery({
    queryKey: ["me"],
    queryFn: authApi.fetchMe,
    retry: false,
    enabled: false,
  });

  const login = useMutation({
    mutationFn: (input: { username: string; password: string }) =>
      authApi.login(input.username, input.password),
    onSuccess: (nextUser) => {
      setUser(nextUser);
      queryClient.setQueryData(["me"], nextUser);
    },
  });

  const logout = useMutation({
    mutationFn: authApi.logout,
    onSettled: () => {
      clear();
      queryClient.clear();
    },
  });

  return { user, me, login, logout };
}

