import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { StatusBadge } from "@/components/gauges/StatusBadge";
import { Button } from "@/components/ui/Button";
import { useTelemetryHistory } from "@/hooks/useTelemetryHistory";
import { Shell } from "./Shell";

export function HistoryPage(): JSX.Element {
  const projectId = Number(useParams().projectId);
  const [page, setPage] = useState(1);
  const history = useTelemetryHistory(projectId, page);

  return (
    <Shell>
      <Link to={`/projects/${projectId}`} className="text-sm text-cyan-400">Back to project</Link>
      <h1 className="mt-2 text-2xl font-bold">Telemetry History</h1>
      <div className="panel mt-6 overflow-x-auto">
        <table className="w-full min-w-[900px] text-left text-sm">
          <thead className="border-b border-zinc-800 text-xs uppercase text-zinc-500">
            <tr>
              <th className="px-3 py-3">Time</th>
              <th className="px-3 py-3">Status</th>
              <th className="px-3 py-3">Ua</th>
              <th className="px-3 py-3">Ub</th>
              <th className="px-3 py-3">Uc</th>
              <th className="px-3 py-3">Ia</th>
              <th className="px-3 py-3">Ib</th>
              <th className="px-3 py-3">Ic</th>
              <th className="px-3 py-3">PF</th>
            </tr>
          </thead>
          <tbody>
            {history.data?.results.map((row) => (
              <tr key={row.id} className="border-b border-zinc-900">
                <td className="px-3 py-3 font-mono text-xs">{new Date(row.cycle_timestamp).toLocaleString()}</td>
                <td className="px-3 py-3"><StatusBadge status={row.derived_status} /></td>
                <td className="px-3 py-3">{row.ua ?? "--"}</td>
                <td className="px-3 py-3">{row.ub ?? "--"}</td>
                <td className="px-3 py-3">{row.uc ?? "--"}</td>
                <td className="px-3 py-3">{row.ia ?? "--"}</td>
                <td className="px-3 py-3">{row.ib ?? "--"}</td>
                <td className="px-3 py-3">{row.ic ?? "--"}</td>
                <td className="px-3 py-3">{row.pf ?? "--"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-4 flex justify-end gap-2">
        <Button variant="ghost" disabled={page === 1} onClick={() => setPage((p) => p - 1)}>Previous</Button>
        <Button variant="ghost" disabled={!history.data?.next} onClick={() => setPage((p) => p + 1)}>Next</Button>
      </div>
    </Shell>
  );
}

