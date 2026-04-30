import { useEffect } from "react";
import type { Role } from "@/api/types";

const EVENTS = ["mousedown", "keydown", "touchstart", "scroll"];

function timeoutFor(role: Role): number {
  if (role === "superadmin") {
    return Number(import.meta.env.VITE_IDLE_TIMEOUT_SUPERADMIN_MS || 900_000);
  }
  return Number(import.meta.env.VITE_IDLE_TIMEOUT_OPERATOR_MS || 1_800_000);
}

export function useIdleTimeout(role: Role | undefined, onTimeout: () => void): void {
  useEffect(() => {
    if (!role) {
      return undefined;
    }

    let timer: number | undefined;
    const reset = () => {
      if (timer) {
        window.clearTimeout(timer);
      }
      timer = window.setTimeout(onTimeout, timeoutFor(role));
    };

    reset();
    EVENTS.forEach((event) => document.addEventListener(event, reset, { passive: true }));

    return () => {
      if (timer) {
        window.clearTimeout(timer);
      }
      EVENTS.forEach((event) => document.removeEventListener(event, reset));
    };
  }, [onTimeout, role]);
}

