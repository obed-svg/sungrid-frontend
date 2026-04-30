import { api } from "./client";
import type { ManeuverAction, ManeuverLog, Paginated } from "./types";

export async function executeManeuver(
  projectId: number,
  action: ManeuverAction,
): Promise<ManeuverLog> {
  const response = await api.post<ManeuverLog>(`/api/projects/${projectId}/maneuver/`, { action });
  return response.data;
}

export async function listManeuvers(
  params: { project?: number; user?: number; from?: string; to?: string; page?: number } = {},
): Promise<Paginated<ManeuverLog>> {
  const response = await api.get<Paginated<ManeuverLog>>("/api/maneuvers/", { params });
  return response.data;
}

