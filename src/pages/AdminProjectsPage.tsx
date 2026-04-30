import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { createProject, updateProject } from "@/api/projects";
import { Button } from "@/components/ui/Button";
import { useProjects } from "@/hooks/useProjects";

interface ProjectForm {
  name: string;
  ip: string;
  port: number;
  master_id: number;
  outstation_id: number;
}

export function AdminProjectsPage(): JSX.Element {
  const queryClient = useQueryClient();
  const projects = useProjects();
  const { register, handleSubmit, reset } = useForm<ProjectForm>({
    defaultValues: { port: 8000, master_id: 2, outstation_id: 1 },
  });
  const invalidate = async () => queryClient.invalidateQueries({ queryKey: ["projects"] });
  const create = useMutation({ mutationFn: createProject, onSuccess: invalidate });
  const toggle = useMutation({
    mutationFn: (input: { id: number; enabled: boolean }) => updateProject(input.id, { enabled: input.enabled }),
    onSuccess: invalidate,
  });

  const submit = handleSubmit((values) => {
    create.mutate({ ...values, enabled: true }, { onSuccess: () => reset({ name: "", ip: "", port: 8000, master_id: 2, outstation_id: 1 }) });
  });

  return (
    <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
      <form onSubmit={submit} className="panel p-4">
        <h2 className="text-lg font-semibold">Create Project</h2>
        <label className="mt-4 block"><span className="label">Name</span><input className="field mt-2" {...register("name", { required: true })} /></label>
        <label className="mt-4 block"><span className="label">VPN IP</span><input className="field mt-2" {...register("ip", { required: true })} /></label>
        <label className="mt-4 block"><span className="label">Port</span><input className="field mt-2" type="number" {...register("port", { valueAsNumber: true })} /></label>
        <div className="mt-4 grid grid-cols-2 gap-3">
          <label><span className="label">Master ID</span><input className="field mt-2" type="number" {...register("master_id", { valueAsNumber: true })} /></label>
          <label><span className="label">Outstation ID</span><input className="field mt-2" type="number" {...register("outstation_id", { valueAsNumber: true })} /></label>
        </div>
        <Button className="mt-5 w-full" disabled={create.isPending}>Create</Button>
      </form>
      <div className="panel overflow-x-auto">
        <table className="w-full min-w-[650px] text-left text-sm">
          <thead className="border-b border-zinc-800 text-xs uppercase text-zinc-500">
            <tr><th className="px-3 py-3">Name</th><th>Endpoint</th><th>IDs</th><th>Enabled</th><th /></tr>
          </thead>
          <tbody>
            {projects.data?.results.map((project) => (
              <tr key={project.id} className="border-b border-zinc-900">
                <td className="px-3 py-3">{project.name}</td>
                <td className="font-mono text-xs">{project.ip}:{project.port}</td>
                <td>{project.master_id}/{project.outstation_id}</td>
                <td>{project.enabled ? "yes" : "no"}</td>
                <td className="pr-3 text-right">
                  <Button variant="ghost" onClick={() => toggle.mutate({ id: project.id, enabled: !project.enabled })}>
                    {project.enabled ? "Disable" : "Enable"}
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

