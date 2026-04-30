import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deleteProject, listProjects } from "@/api/projects";

export function useProjects() {
  const queryClient = useQueryClient();
  const projects = useQuery({
    queryKey: ["projects"],
    queryFn: listProjects,
    staleTime: 10_000,
    refetchInterval: 10_000,
  });
  const invalidate = async () => queryClient.invalidateQueries({ queryKey: ["projects"] });
  const destroy = useMutation({ mutationFn: deleteProject, onSuccess: invalidate });

  return { projects, destroy };
}
