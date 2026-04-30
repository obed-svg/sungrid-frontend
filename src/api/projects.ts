import { api } from "./client";
import type { Paginated, Project } from "./types";

export type ProjectInput = Omit<Project, "id" | "created_at" | "updated_at">;

export async function listProjects(): Promise<Paginated<Project>> {
  const response = await api.get<Paginated<Project>>("/api/projects/");
  return response.data;
}

export async function createProject(input: ProjectInput): Promise<Project> {
  const response = await api.post<Project>("/api/projects/", input);
  return response.data;
}

export async function updateProject(id: number, input: Partial<ProjectInput>): Promise<Project> {
  const response = await api.patch<Project>(`/api/projects/${id}/`, input);
  return response.data;
}

export async function deleteProject(id: number): Promise<void> {
  await api.delete(`/api/projects/${id}/`);
}

