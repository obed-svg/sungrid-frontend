import { useQuery } from "@tanstack/react-query";
import { listManeuvers } from "@/api/maneuvers";

export function useManeuvers(page: number) {
  return useQuery({
    queryKey: ["maneuvers", page],
    queryFn: () => listManeuvers({ page }),
  });
}

