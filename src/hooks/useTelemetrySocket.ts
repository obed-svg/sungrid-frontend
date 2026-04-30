import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import type { TelemetryRecord, TelemetryWsEvent } from "@/api/types";
import { useUiStore } from "@/store/uiStore";

function socketUrl(): string {
  const configured = import.meta.env.VITE_WS_BASE_URL;
  if (configured) {
    return `${configured.replace(/\/$/, "")}/ws/telemetry/`;
  }
  const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
  return `${protocol}//${window.location.host}/ws/telemetry/`;
}

export function useTelemetrySocket(enabled: boolean): void {
  const queryClient = useQueryClient();
  const pushToast = useUiStore((state) => state.pushToast);

  useEffect(() => {
    if (!enabled) {
      return undefined;
    }

    const ws = new WebSocket(socketUrl());

    ws.onmessage = (event) => {
      const payload = JSON.parse(event.data as string) as TelemetryWsEvent;
      if (payload.type === "telemetry.update") {
        queryClient.setQueryData<TelemetryRecord>(
          ["telemetry", "latest", payload.project_id],
          (current) => ({ ...current, ...payload }) as TelemetryRecord,
        );
      }
      if (payload.type === "maneuver.complete") {
        pushToast({
          tone: payload.result === "success" ? "success" : "error",
          message: `Maneuver ${payload.result} on project ${payload.project_id}`,
        });
      }
      if (payload.type === "device.offline") {
        pushToast({ tone: "error", message: `Project ${payload.project_id} offline` });
      }
    };

    return () => ws.close();
  }, [enabled, pushToast, queryClient]);
}

