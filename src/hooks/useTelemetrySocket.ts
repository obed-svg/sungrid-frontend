import { useEffect, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import type { TelemetryRecord, TelemetryWsEvent } from "@/api/types";
import type { UiState } from "@/store/uiStore";
import { useUiStore } from "@/store/uiStore";

const RECONNECT_DELAY_MS = 3000;
const MAX_RECONNECT_ATTEMPTS = 10;

function socketUrl(projectId?: number): string {
  const configured = import.meta.env.VITE_WS_BASE_URL;
  const base = configured ? configured.replace(/\/$/, "") : "";
  const path = projectId != null ? `/ws/telemetry/${projectId}/` : "/ws/telemetry/";
  if (base) {
    return `${base}${path}`;
  }
  const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
  return `${protocol}//${window.location.host}${path}`;
}

interface SocketState {
  ws: WebSocket | null;
  reconnectTimer: ReturnType<typeof setTimeout> | null;
  attempts: number;
  projectId: number | undefined;
}

export function useTelemetrySocket(enabled: boolean, projectId?: number): void {
  const queryClient = useQueryClient();
  const pushToast = useUiStore((state) => state.pushToast);
  const stateRef = useRef<SocketState>({
    ws: null,
    reconnectTimer: null,
    attempts: 0,
    projectId: undefined,
  });

  useEffect(() => {
    if (!enabled) {
      cleanup(stateRef.current);
      return undefined;
    }

    // If projectId changes, reconnect
    const state = stateRef.current;
    if (state.projectId !== projectId) {
      cleanup(state);
      state.projectId = projectId;
    }

    connect(state, queryClient, pushToast);

    return () => {
      cleanup(state);
    };
  }, [enabled, projectId, queryClient, pushToast]);
}

function cleanup(state: SocketState): void {
  if (state.reconnectTimer) {
    clearTimeout(state.reconnectTimer);
    state.reconnectTimer = null;
  }
  if (state.ws) {
    state.ws.onclose = null;
    state.ws.onerror = null;
    state.ws.onmessage = null;
    state.ws.onopen = null;
    if (state.ws.readyState === WebSocket.OPEN || state.ws.readyState === WebSocket.CONNECTING) {
      state.ws.close();
    }
    state.ws = null;
  }
  state.attempts = 0;
}

function connect(
  state: SocketState,
  queryClient: ReturnType<typeof useQueryClient>,
  pushToast: UiState["pushToast"],
): void {
  if (state.ws?.readyState === WebSocket.OPEN || state.ws?.readyState === WebSocket.CONNECTING) {
    return;
  }

  try {
    const ws = new WebSocket(socketUrl(state.projectId));
    state.ws = ws;

    ws.onopen = () => {
      state.attempts = 0;
    };

    ws.onmessage = (event) => {
      let payload: TelemetryWsEvent;
      try {
        payload = JSON.parse(event.data as string) as TelemetryWsEvent;
      } catch {
        return;
      }

      if (payload.type === "telemetry.update") {
        queryClient.setQueryData<TelemetryRecord>(
          ["telemetry", "latest", payload.project_id],
          (current) => ({ ...current, ...payload.data }) as TelemetryRecord,
        );
        // Also invalidate history so it refreshes on next visit
        queryClient.invalidateQueries({ queryKey: ["telemetry", "history", payload.project_id] });
      }
      if (payload.type === "maneuver.complete") {
        pushToast({
          tone: payload.result === "success" ? "success" : "error",
          message: `Maneuver ${payload.result} on project ${payload.project_id} by ${payload.by}`,
        });
        // Refresh latest telemetry after maneuver
        queryClient.invalidateQueries({ queryKey: ["telemetry", "latest", payload.project_id] });
      }
      if (payload.type === "device.offline") {
        pushToast({ tone: "error", message: `Project ${payload.project_id} offline: ${payload.reason}` });
      }
    };

    ws.onclose = () => {
      state.ws = null;
      scheduleReconnect(state, queryClient, pushToast);
    };

    ws.onerror = () => {
      // Let onclose handle reconnection
    };
  } catch {
    scheduleReconnect(state, queryClient, pushToast);
  }
}

function scheduleReconnect(
  state: SocketState,
  queryClient: ReturnType<typeof useQueryClient>,
  pushToast: UiState["pushToast"],
): void {
  if (state.reconnectTimer || state.attempts >= MAX_RECONNECT_ATTEMPTS) {
    return;
  }
  state.attempts += 1;
  state.reconnectTimer = setTimeout(() => {
    state.reconnectTimer = null;
    connect(state, queryClient, pushToast);
  }, RECONNECT_DELAY_MS);
}
