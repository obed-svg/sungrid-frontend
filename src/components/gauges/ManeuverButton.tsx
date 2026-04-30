import { useEffect, useRef, useState } from "react";
import type { DerivedStatus, ManeuverAction } from "@/api/types";
import { Button } from "@/components/ui/Button";
import { useManeuver } from "@/hooks/useManeuver";
import { useUiStore } from "@/store/uiStore";

const REQUIRED: Record<ManeuverAction, DerivedStatus> = {
  TRIP: "CLOSED",
  CLOSE: "OPEN",
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
  const timeoutRef = useRef<number | null>(null);
  const allowed = preStatus === REQUIRED[action];

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const start = () => {
    if (!allowed || mutation.isPending) {
      return;
    }
    setHolding(true);
    timeoutRef.current = window.setTimeout(() => {
      mutation.mutate(action, {
        onSuccess: (log) => {
          pushToast({
            tone: log.result === "success" ? "success" : "error",
            message: `${action} ${log.result}`,
          });
        },
        onError: (error) => {
          pushToast({ tone: "error", message: error instanceof Error ? error.message : "Maneuver failed" });
        },
      });
      setHolding(false);
    }, holdMs);
  };

  const cancel = () => {
    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current);
    }
    setHolding(false);
  };

  return (
    <Button
      variant={action === "TRIP" ? "danger" : "success"}
      disabled={!allowed || mutation.isPending}
      onMouseDown={start}
      onMouseUp={cancel}
      onMouseLeave={cancel}
      onTouchStart={start}
      onTouchEnd={cancel}
      className="h-14 min-w-32"
    >
      {holding ? "HOLD..." : action}
    </Button>
  );
}

