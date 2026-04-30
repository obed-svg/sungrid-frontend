import { Link } from "react-router-dom";
import type { Project } from "@/api/types";
import { StatusBadge } from "@/components/gauges/StatusBadge";
import { useTelemetryLatest } from "@/hooks/useTelemetryLatest";

export function ProjectCard({ project }: { project: Project }): JSX.Element {
  const latest = useTelemetryLatest(project.id);
  const status = latest.data?.derived_status ?? "OFFLINE";

  return (
    <Link to={`/projects/${project.id}`} className="panel block p-4 hover:border-cyan-700">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold">{project.name}</h2>
          <p className="mt-1 font-mono text-xs text-zinc-500">
            {project.ip}:{project.port}
          </p>
        </div>
        <StatusBadge status={status} />
      </div>
      <dl className="mt-5 grid grid-cols-3 gap-3 text-sm">
        <div>
          <dt className="label">Ua</dt>
          <dd className="font-mono">{latest.data?.ua?.toFixed(0) ?? "--"} V</dd>
        </div>
        <div>
          <dt className="label">Ia</dt>
          <dd className="font-mono">{latest.data?.ia?.toFixed(1) ?? "--"} A</dd>
        </div>
        <div>
          <dt className="label">PF</dt>
          <dd className="font-mono">{latest.data?.pf?.toFixed(2) ?? "--"}</dd>
        </div>
      </dl>
    </Link>
  );
}

