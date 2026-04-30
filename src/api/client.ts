import axios, { type AxiosInstance } from "axios";
import { getCsrfToken } from "@/lib/csrf";

const baseURL = import.meta.env.VITE_API_BASE_URL || "";

export const api: AxiosInstance = axios.create({
  baseURL,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const method = (config.method ?? "get").toLowerCase();
  if (["post", "put", "patch", "delete"].includes(method)) {
    const token = getCsrfToken();
    if (token) {
      config.headers.set("X-CSRFToken", token);
    }
  }
  return config;
});

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public detail?: unknown,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

api.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    if (axios.isAxiosError(error) && error.response) {
      const data = error.response.data as { detail?: string } | undefined;
      const detail = data?.detail ?? error.response.statusText;
      throw new ApiError(error.response.status, detail, error.response.data);
    }
    throw error;
  },
);

