import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createUser, deactivateUser, listUsers, updateUser, type CreateUserInput } from "@/api/users";
import type { User } from "@/api/types";

export function useUsers() {
  const queryClient = useQueryClient();
  const users = useQuery({ queryKey: ["users"], queryFn: listUsers });
  const invalidate = async () => queryClient.invalidateQueries({ queryKey: ["users"] });

  const create = useMutation({ mutationFn: (input: CreateUserInput) => createUser(input), onSuccess: invalidate });
  const update = useMutation({
    mutationFn: (input: { id: number; values: Partial<User> }) => updateUser(input.id, input.values),
    onSuccess: invalidate,
  });
  const deactivate = useMutation({ mutationFn: deactivateUser, onSuccess: invalidate });

  return { users, create, update, deactivate };
}

