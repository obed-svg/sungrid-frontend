import { useMutation, useQueryClient } from "@tanstack/react-query";
import { executeManeuver } from "@/api/maneuvers";
import type { ManeuverAction } from "@/api/types";

export function useManeuver(projectId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (action: ManeuverAction) => executeManeuver(projectId, action),
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: ["telemetry", "latest", projectId] });
      await queryClient.invalidateQueries({ queryKey: ["maneuvers"] });
    },
  });
}

