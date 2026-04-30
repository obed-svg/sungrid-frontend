import { screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { ProjectDetailPage } from "./ProjectDetailPage";
import { renderWithProviders } from "@/tests/utils";

const mocks = vi.hoisted(() => ({
  useProjects: vi.fn(),
  useTelemetryLatest: vi.fn(),
  useTelemetrySocket: vi.fn(),
}));

vi.mock("./Shell", () => ({
  Shell: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

vi.mock("react-router-dom", async (importOriginal) => {
  const actual = await importOriginal<typeof import("react-router-dom")>();
  return {
    ...actual,
    useParams: () => ({ projectId: "7" }),
  };
});

vi.mock("@/hooks/useProjects", () => ({
  useProjects: mocks.useProjects,
}));

vi.mock("@/hooks/useTelemetryLatest", () => ({
  useTelemetryLatest: mocks.useTelemetryLatest,
}));

vi.mock("@/hooks/useTelemetrySocket", () => ({
  useTelemetrySocket: mocks.useTelemetrySocket,
}));

describe("ProjectDetailPage", () => {
  it("shows the project name when telemetry is empty", () => {
    mocks.useProjects.mockReturnValue({
      projects: {
        data: {
          results: [
            {
              id: 7,
              name: "Paso norte",
              ip: "10.9.1.172",
              port: 8000,
              master_id: 2,
              outstation_id: 1,
              enabled: true,
              created_at: "2026-04-30T00:00:00Z",
              updated_at: "2026-04-30T00:00:00Z",
            },
          ],
        },
      },
    });
    mocks.useTelemetryLatest.mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
    });

    renderWithProviders(<ProjectDetailPage />, { initialEntries: ["/projects/7"] });

    expect(screen.getByRole("heading", { name: "Paso norte" })).toBeInTheDocument();
    expect(screen.getByText("No hay datos disponibles")).toBeInTheDocument();
  });
});
