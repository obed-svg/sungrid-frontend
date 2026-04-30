import { create } from "zustand";

export interface Toast {
  id: number;
  tone: "success" | "error" | "info";
  message: string;
}

export interface UiState {
  toasts: Toast[];
  pushToast: (toast: Omit<Toast, "id">) => void;
  dismissToast: (id: number) => void;
}

let nextId = 1;

export const useUiStore = create<UiState>((set) => ({
  toasts: [],
  pushToast: (toast) =>
    set((state) => ({ toasts: [...state.toasts, { ...toast, id: nextId++ }].slice(-4) })),
  dismissToast: (id) =>
    set((state) => ({ toasts: state.toasts.filter((toast) => toast.id !== id) })),
}));

