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
}: {
  action: ManeuverAction;
  projectId: number;
  preStatus: DerivedStatus | undefined;
}): JSX.Element {
  const mutation = useManeuver(projectId);
  const pushToast = useUiStore((state) => state.pushToast);
  const allowed = preStatus === REQUIRED[action];
  const handleClick = () => {
    if (!allowed || mutation.isPending) {
      return;
    }
    const confirmed = window.confirm(
      `Confirm ${LABEL[action]} action for this recloser?`,
    );
    if (!confirmed) {
      return;
    }
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
  };

  const disabled = !allowed || mutation.isPending;

  return (
    <div className="relative">
      <Button
        variant={action === "TRIP" ? "danger" : "success"}
        disabled={disabled}
        onClick={handleClick}
        className="h-14 min-w-32"
      >
        {mutation.isPending ? "Sending..." : LABEL[action]}
      </Button>
      {disabled && !mutation.isPending && (
        <p className="mt-1 text-xs text-slate-400">
          Needs {REQUIRED[action]} status
        </p>
      )}
    </div>
  );
}
