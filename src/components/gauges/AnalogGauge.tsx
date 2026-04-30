import { cn } from "@/lib/cn";

export function AnalogGauge({
  label,
  value,
  unit,
  max,
}: {
  label: string;
  value: number | null | undefined;
  unit: string;
  max: number;
}): JSX.Element {
  const safe = typeof value === "number" && Number.isFinite(value) ? value : 0;
  const pct = Math.max(0, Math.min(100, (safe / max) * 100));

  return (
    <div className="panel p-4">
      <div className="flex items-center justify-between">
        <span className="label">{label}</span>
        <span className="font-mono text-lg">{value == null ? "--" : safe.toFixed(unit === "PF" ? 2 : 1)}</span>
      </div>
      <div className="mt-3 h-2 bg-zinc-800">
        <div
          className={cn("h-full", pct > 85 ? "bg-yellow-500" : "bg-cyan-500")}
          style={{ width: `${pct}%` }}
        />
      </div>
      <div className="mt-2 text-right text-xs text-zinc-500">{unit}</div>
    </div>
  );
}

