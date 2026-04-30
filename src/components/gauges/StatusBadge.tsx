import type { DerivedStatus } from "@/api/types";
import { cn } from "@/lib/cn";

const styles: Record<DerivedStatus | "OFFLINE", string> = {
  CLOSED: "border-green-700 bg-green-950 text-green-200",
  OPEN: "border-red-700 bg-red-950 text-red-200",
  ERROR: "border-yellow-700 bg-yellow-950 text-yellow-200",
  OFFLINE: "border-zinc-700 bg-zinc-900 text-zinc-300",
};

export function StatusBadge({
  status,
  className,
}: {
  status: DerivedStatus | "OFFLINE";
  className?: string;
}): JSX.Element {
  return (
    <span className={cn("inline-flex border px-2 py-1 text-xs font-bold", styles[status], className)}>
      {status}
    </span>
  );
}

