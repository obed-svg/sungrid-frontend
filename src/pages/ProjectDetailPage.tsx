import { Link, useParams } from "react-router-dom";
import { AnalogGauge } from "@/components/gauges/AnalogGauge";
import { ManeuverButton } from "@/components/gauges/ManeuverButton";
import { StatusBadge } from "@/components/gauges/StatusBadge";
import { useTelemetryLatest } from "@/hooks/useTelemetryLatest";
import { useAuthStore } from "@/store/authStore";
import { Shell } from "./Shell";

export function ProjectDetailPage(): JSX.Element {
  const projectId = Number(useParams().projectId);
  const latest = useTelemetryLatest(projectId);
  const canManeuver = useAuthStore((state) => state.hasRole("operator"));
  const data = latest.data;

  return (
    <Shell>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <Link to="/" className="text-sm text-cyan-400">Back to dashboard</Link>
          <h1 className="mt-2 text-2xl font-bold">Project {projectId}</h1>
        </div>
        <div className="flex items-center gap-2">
          <Link
            to={`/projects/${projectId}/history`}
            className="inline-flex h-10 items-center justify-center border border-zinc-700 bg-zinc-900 px-4 text-sm font-semibold text-zinc-100 hover:bg-zinc-800"
          >
            History
          </Link>
          {data && <StatusBadge status={data.derived_status} />}
        </div>
      </div>

      {latest.isLoading && <p className="mt-8 text-zinc-400">Loading telemetry</p>}
      {latest.isError && <p className="mt-8 text-red-300">Latest telemetry unavailable</p>}
      {data && (
        <>
          <section className="mt-6 grid gap-4 md:grid-cols-3">
            <AnalogGauge label="Ua" value={data.ua} unit="V" max={40000} />
            <AnalogGauge label="Ub" value={data.ub} unit="V" max={40000} />
            <AnalogGauge label="Uc" value={data.uc} unit="V" max={40000} />
            <AnalogGauge label="Ur" value={data.ur} unit="V" max={40000} />
            <AnalogGauge label="Us" value={data.us} unit="V" max={40000} />
            <AnalogGauge label="Ut" value={data.ut} unit="V" max={40000} />
            <AnalogGauge label="Ia" value={data.ia} unit="A" max={800} />
            <AnalogGauge label="Ib" value={data.ib} unit="A" max={800} />
            <AnalogGauge label="Ic" value={data.ic} unit="A" max={800} />
            <AnalogGauge label="Frequency" value={data.freq} unit="Hz" max={70} />
            <AnalogGauge label="Power factor" value={data.pf} unit="PF" max={1} />
          </section>
          <section className="panel mt-6 p-4">
            <h2 className="text-lg font-semibold">Maneuver Control</h2>
            <div className="mt-4 flex flex-wrap gap-3">
              <ManeuverButton action="TRIP" projectId={projectId} preStatus={canManeuver ? data.derived_status : undefined} />
              <ManeuverButton action="CLOSE" projectId={projectId} preStatus={canManeuver ? data.derived_status : undefined} />
            </div>
            {!canManeuver && <p className="mt-3 text-sm text-zinc-500">Viewer role cannot execute maneuvers.</p>}
          </section>
        </>
      )}
    </Shell>
  );
}
