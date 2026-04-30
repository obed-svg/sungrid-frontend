import { useQuery } from "@tanstack/react-query";
import { fetchLatest } from "@/api/telemetry";

export function useTelemetryLatest(projectId: number) {
  return useQuery({
    queryKey: ["telemetry", "latest", projectId],
    queryFn: () => fetchLatest(projectId),
    staleTime: 10_000,
    refetchInterval: 10_000,
  });
}

