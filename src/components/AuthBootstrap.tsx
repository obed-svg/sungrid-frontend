import { useEffect } from "react";
import type { ReactNode } from "react";
import { fetchMe } from "@/api/auth";
import { useAuthStore } from "@/store/authStore";

export function AuthBootstrap({ children }: { children: ReactNode }): JSX.Element {
  const bootstrapped = useAuthStore((state) => state.bootstrapped);
  const setBootstrapped = useAuthStore((state) => state.setBootstrapped);
  const setUser = useAuthStore((state) => state.setUser);
  const clear = useAuthStore((state) => state.clear);

  useEffect(() => {
    let mounted = true;
    void fetchMe()
      .then((user) => {
        if (mounted) {
          setUser(user);
        }
      })
      .catch(() => {
        if (mounted) {
          clear();
        }
      })
      .finally(() => {
        if (mounted) {
          setBootstrapped(true);
        }
      });

    return () => {
      mounted = false;
    };
  }, [clear, setBootstrapped, setUser]);

  if (!bootstrapped) {
    return <div className="grid min-h-screen place-items-center text-sm text-zinc-400">Loading</div>;
  }

  return <>{children}</>;
}
