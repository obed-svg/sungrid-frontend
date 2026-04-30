import { api } from "./client";
import type { User } from "./types";

export async function login(username: string, password: string): Promise<User> {
  const response = await api.post<User>("/api/auth/login", { username, password });
  return response.data;
}

export async function logout(): Promise<void> {
  await api.post("/api/auth/logout");
}

export async function fetchMe(): Promise<User> {
  const response = await api.get<User>("/api/auth/me");
  return response.data;
}

