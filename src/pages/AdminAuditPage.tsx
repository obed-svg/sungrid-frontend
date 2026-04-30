import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { useManeuvers } from "@/hooks/useManeuvers";

export function AdminAuditPage(): JSX.Element {
  const [page, setPage] = useState(1);
  const logs = useManeuvers(page);

  return (
    <>
      <div className="panel overflow-x-auto">
        <table className="w-full min-w-[850px] text-left text-sm">
          <thead className="border-b border-zinc-800 text-xs uppercase text-zinc-500">
            <tr><th className="px-3 py-3">Time</th><th>User</th><th>Project</th><th>Action</th><th>Pre</th><th>Post</th><th>Result</th><th>Error</th></tr>
          </thead>
          <tbody>
            {logs.data?.results.map((log) => (
              <tr key={log.id} className="border-b border-zinc-900">
                <td className="px-3 py-3 font-mono text-xs">{new Date(log.timestamp).toLocaleString()}</td>
                <td>{log.user}</td>
                <td>{log.project}</td>
                <td>{log.action}</td>
                <td>{log.pre_status || "--"}</td>
                <td>{log.post_status || "--"}</td>
                <td>{log.result}</td>
                <td className="max-w-64 truncate">{log.error_message}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-4 flex justify-end gap-2">
        <Button variant="ghost" disabled={page === 1} onClick={() => setPage((p) => p - 1)}>Previous</Button>
        <Button variant="ghost" disabled={!logs.data?.next} onClick={() => setPage((p) => p + 1)}>Next</Button>
      </div>
    </>
  );
}

