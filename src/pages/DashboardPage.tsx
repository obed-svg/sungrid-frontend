import { ProjectCard } from "@/components/ProjectCard";
import { useProjects } from "@/hooks/useProjects";
import { Shell } from "./Shell";

export function DashboardPage(): JSX.Element {
  const { projects } = useProjects();

  return (
    <Shell>
      <div className="border-b border-brand-blue-200 pb-5">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase text-brand-blue-600">Control operativo</p>
            <h1 className="mt-1 text-3xl font-bold text-brand-blue-950">Dashboard</h1>

          </div>

        </div>
      </div>
      {projects.isLoading && <p className="mt-8 text-slate-500">Loading projects</p>}
      {projects.isError && <p className="mt-8 text-red-300">Could not load projects</p>}
      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {projects.data?.results.map((project) => <ProjectCard key={project.id} project={project} />)}
      </div>
    </Shell>
  );
}
