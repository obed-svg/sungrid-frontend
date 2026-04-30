import { api } from "./client";
import type { AnalogPoint, BinaryPoint, Paginated, TelemetryRecord } from "./types";

export async function fetchLatest(projectId: number): Promise<TelemetryRecord> {
  const response = await api.get<TelemetryRecord>(`/api/projects/${projectId}/telemetry/latest`);
  return response.data;
}

export async function fetchHistory(
  projectId: number,
  params: { from?: string; to?: string; page?: number } = {},
): Promise<Paginated<TelemetryRecord>> {
  const response = await api.get<Paginated<TelemetryRecord>>(
    `/api/projects/${projectId}/telemetry/history`,
    { params },
  );
  return response.data;
}

export async function fetchPoints(
  projectId: number,
  recId: number,
): Promise<{ analogs: AnalogPoint[]; binaries: BinaryPoint[] }> {
  const response = await api.get<{ analogs: AnalogPoint[]; binaries: BinaryPoint[] }>(
    `/api/projects/${projectId}/telemetry/${recId}/points`,
  );
  return response.data;
}

