import { useQuery } from "@tanstack/react-query";
import { fetchLatest } from "@/api/telemetry";

export function useTelemetryLatest(projectId: number) {
  return useQuery({
    queryKey: ["telemetry", "latest", projectId],
    queryFn: () => fetchLatest(projectId),
    staleTime: 15_000,
  });
}

