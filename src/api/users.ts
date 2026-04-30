import { api } from "./client";
import type { Paginated, Role, User } from "./types";

export interface CreateUserInput {
  username: string;
  email?: string;
  password: string;
  role: Role;
}

export async function listUsers(): Promise<Paginated<User>> {
  const response = await api.get<Paginated<User>>("/api/users/");
  return response.data;
}

export async function createUser(input: CreateUserInput): Promise<User> {
  const response = await api.post<User>("/api/users/", input);
  return response.data;
}

export async function updateUser(id: number, input: Partial<User>): Promise<User> {
  const response = await api.patch<User>(`/api/users/${id}/`, input);
  return response.data;
}

export async function deactivateUser(id: number): Promise<void> {
  await api.delete(`/api/users/${id}/`);
}

