import { useQuery } from "@tanstack/react-query";
import { fetchHistory } from "@/api/telemetry";

export function useTelemetryHistory(projectId: number, page: number) {
  return useQuery({
    queryKey: ["telemetry", "history", projectId, page],
    queryFn: () => fetchHistory(projectId, { page }),
    staleTime: 30_000,
  });
}

