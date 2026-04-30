import { Link } from "react-router-dom";
import type { Project } from "@/api/types";
import { StatusBadge } from "@/components/gauges/StatusBadge";
import { useTelemetryLatest } from "@/hooks/useTelemetryLatest";

export function ProjectCard({ project }: { project: Project }): JSX.Element {
  const latest = useTelemetryLatest(project.id);

  // 404 from backend means either no data ever, or data is stale (> 6 min old)
  const hasFreshData = !latest.isError && latest.data != null;
  const status = hasFreshData ? latest.data.derived_status : "OFFLINE";

  return (
    <Link
      to={`/projects/${project.id}`}
      className="panel block p-5 transition hover:border-brand-blue-300 hover:shadow-md"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-brand-blue-950">{project.name}</h2>
        </div>
        <StatusBadge status={status} />
      </div>

      {hasFreshData ? (
        <dl className="mt-5 grid grid-cols-3 gap-3 text-sm">
          <div>
            <dt className="label">Ua</dt>
            <dd className="font-mono text-brand-blue-900">{latest.data.ua?.toFixed(0) ?? "--"} V</dd>
          </div>
          <div>
            <dt className="label">P</dt>
            <dd className="font-mono text-brand-blue-900">{latest.data.p?.toFixed(0) ?? "--"} kW</dd>
          </div>
          <div>
            <dt className="label">Q</dt>
            <dd className="font-mono text-brand-blue-900">{latest.data.q?.toFixed(0) ?? "--"} kvar</dd>
          </div>
        </dl>
      ) : (
        <p className="mt-5 text-sm font-medium text-slate-400">No hay datos disponibles</p>
      )}
    </Link>
  );
}
