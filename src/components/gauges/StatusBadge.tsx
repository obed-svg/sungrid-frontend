import type { DerivedStatus } from "@/api/types";
import { cn } from "@/lib/cn";

const styles: Record<DerivedStatus | "OFFLINE" | "UNKNOWN", string> = {
  CLOSED: "border-green-700 bg-green-950 text-green-200",
  OPEN: "border-red-700 bg-red-950 text-red-200",
  ERROR: "border-yellow-700 bg-yellow-950 text-yellow-200",
  OFFLINE: "border-slate-300 bg-slate-100 text-slate-600",
  UNKNOWN: "border-slate-300 bg-slate-100 text-slate-600",
};

export function StatusBadge({
  status,
  className,
}: {
  status: DerivedStatus | "OFFLINE" | "UNKNOWN";
  className?: string;
}): JSX.Element {
  return (
    <span className={cn("inline-flex border px-2 py-1 text-xs font-bold uppercase", styles[status], className)}>
      {status}
    </span>
  );
}
