import { ProjectCard } from "@/components/ProjectCard";
import { useProjects } from "@/hooks/useProjects";
import { Shell } from "./Shell";

export function DashboardPage(): JSX.Element {
  const projects = useProjects();

  return (
    <Shell>
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="mt-1 text-sm text-zinc-400">Live RWK35 recloser status</p>
        </div>
      </div>
      {projects.isLoading && <p className="mt-8 text-zinc-400">Loading projects</p>}
      {projects.isError && <p className="mt-8 text-red-300">Could not load projects</p>}
      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {projects.data?.results.map((project) => <ProjectCard key={project.id} project={project} />)}
      </div>
    </Shell>
  );
}

