import { act, fireEvent, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { ManeuverButton } from "./ManeuverButton";
import { renderWithProviders } from "@/tests/utils";

const mocks = vi.hoisted(() => ({
  mutate: vi.fn(),
}));

vi.mock("@/hooks/useManeuver", () => ({
  useManeuver: () => ({
    isPending: false,
    mutate: mocks.mutate,
  }),
}));

describe("ManeuverButton", () => {
  afterEach(() => {
    vi.useRealTimers();
    mocks.mutate.mockReset();
  });

  it("requires a full hold before executing a maneuver", () => {
    vi.useFakeTimers();
    renderWithProviders(
      <ManeuverButton action="TRIP" projectId={3} preStatus="CLOSED" holdMs={500} />,
    );

    fireEvent.mouseDown(screen.getByRole("button", { name: /TRIP/i }));
    act(() => {
      vi.advanceTimersByTime(499);
    });
    expect(mocks.mutate).not.toHaveBeenCalled();

    act(() => {
      vi.advanceTimersByTime(1);
    });
    expect(mocks.mutate).toHaveBeenCalledWith("TRIP", expect.any(Object));
  });

  it("does not execute when the current status fails the guard", () => {
    vi.useFakeTimers();
    renderWithProviders(
      <ManeuverButton action="CLOSE" projectId={3} preStatus="CLOSED" holdMs={500} />,
    );

    expect(screen.getByText("Needs OPEN status")).toBeInTheDocument();
    fireEvent.mouseDown(screen.getByRole("button", { name: /CLOSE/i }));
    act(() => {
      vi.advanceTimersByTime(500);
    });

    expect(mocks.mutate).not.toHaveBeenCalled();
  });
});
