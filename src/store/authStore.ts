import { create } from "zustand";
import type { Role, User } from "@/api/types";

const RANK: Record<Role, number> = { viewer: 0, operator: 1, superadmin: 2 };

interface AuthState {
  user: User | null;
  bootstrapped: boolean;
  setUser: (user: User) => void;
  setBootstrapped: (bootstrapped: boolean) => void;
  clear: () => void;
  isAuthenticated: () => boolean;
  hasRole: (required: Role) => boolean;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  bootstrapped: false,
  setUser: (user) => set({ user }),
  setBootstrapped: (bootstrapped) => set({ bootstrapped }),
  clear: () => set({ user: null }),
  isAuthenticated: () => get().user !== null,
  hasRole: (required) => {
    const user = get().user;
    return user !== null && RANK[user.role] >= RANK[required];
  },
}));

