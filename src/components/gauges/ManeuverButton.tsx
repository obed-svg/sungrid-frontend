import { useEffect, useRef, useState } from "react";
import type { DerivedStatus, ManeuverAction } from "@/api/types";
import { Button } from "@/components/ui/Button";
import { useManeuver } from "@/hooks/useManeuver";
import { useUiStore } from "@/store/uiStore";

const REQUIRED: Record<ManeuverAction, DerivedStatus> = {
  TRIP: "CLOSED",
  CLOSE: "OPEN",
};

const LABEL: Record<ManeuverAction, string> = {
  TRIP: "TRIP",
  CLOSE: "CLOSE",
};

export function ManeuverButton({
  action,
  projectId,
  preStatus,
  holdMs = 2000,
}: {
  action: ManeuverAction;
  projectId: number;
  preStatus: DerivedStatus | undefined;
  holdMs?: number;
}): JSX.Element {
  const mutation = useManeuver(projectId);
  const pushToast = useUiStore((state) => state.pushToast);
  const [holding, setHolding] = useState(false);
  const [progress, setProgress] = useState(0);
  const timeoutRef = useRef<number | null>(null);
  const intervalRef = useRef<number | null>(null);
  const allowed = preStatus === REQUIRED[action];

  useEffect(() => {
    return () => {
      if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
      if (intervalRef.current) window.clearInterval(intervalRef.current);
    };
  }, []);

  const clearTimers = () => {
    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    if (intervalRef.current) {
      window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const start = () => {
    if (!allowed || mutation.isPending) {
      return;
    }
    setHolding(true);
    setProgress(0);

    const startTime = Date.now();
    intervalRef.current = window.setInterval(() => {
      const elapsed = Date.now() - startTime;
      setProgress(Math.min(100, (elapsed / holdMs) * 100));
    }, 50);

    timeoutRef.current = window.setTimeout(() => {
      clearTimers();
      setHolding(false);
      setProgress(0);
      mutation.mutate(action, {
        onSuccess: (log) => {
          pushToast({
            tone: log.result === "success" ? "success" : "error",
            message: `${LABEL[action]}: ${log.result}`,
          });
        },
        onError: (error) => {
          pushToast({
            tone: "error",
            message: error instanceof Error ? error.message : "Maneuver failed",
          });
        },
      });
    }, holdMs);
  };

  const cancel = () => {
    clearTimers();
    setHolding(false);
    setProgress(0);
  };

  const disabled = !allowed || mutation.isPending;

  return (
    <div className="relative">
      <Button
        variant={action === "TRIP" ? "danger" : "success"}
        disabled={disabled}
        onMouseDown={start}
        onMouseUp={cancel}
        onMouseLeave={cancel}
        onTouchStart={start}
        onTouchEnd={cancel}
        className="h-14 min-w-32 relative overflow-hidden"
      >
        {/* Progress fill */}
        {holding && (
          <span
            className="absolute inset-0 bg-white/20 transition-none"
            style={{ width: `${progress}%`, left: 0 }}
          />
        )}
        <span className="relative z-10">
          {mutation.isPending ? "Sending..." : holding ? `HOLD ${Math.ceil((holdMs - (progress / 100) * holdMs) / 1000)}s` : LABEL[action]}
        </span>
      </Button>
      {/* Disabled reason */}
      {disabled && !mutation.isPending && (
        <p className="mt-1 text-xs text-slate-400">
          Needs {REQUIRED[action]} status
        </p>
      )}
    </div>
  );
}
