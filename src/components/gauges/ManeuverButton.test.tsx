import { fireEvent, screen } from "@testing-library/react";
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
    mocks.mutate.mockReset();
    vi.unstubAllGlobals();
  });

  it("asks for confirmation before executing a maneuver", () => {
    const confirm = vi.fn(() => true);
    vi.stubGlobal("confirm", confirm);
    renderWithProviders(<ManeuverButton action="TRIP" projectId={3} preStatus="CLOSED" />);

    fireEvent.click(screen.getByRole("button", { name: /TRIP/i }));
    expect(confirm).toHaveBeenCalledWith("Confirm TRIP action for this recloser?");
    expect(mocks.mutate).toHaveBeenCalledWith("TRIP", expect.any(Object));
  });

  it("does not execute when the user cancels the confirmation", () => {
    const confirm = vi.fn(() => false);
    vi.stubGlobal("confirm", confirm);
    renderWithProviders(<ManeuverButton action="CLOSE" projectId={3} preStatus="OPEN" />);

    fireEvent.click(screen.getByRole("button", { name: /CLOSE/i }));
    expect(confirm).toHaveBeenCalledWith("Confirm CLOSE action for this recloser?");
    expect(mocks.mutate).not.toHaveBeenCalled();
  });

  it("does not execute when the current status fails the guard", () => {
    renderWithProviders(<ManeuverButton action="CLOSE" projectId={3} preStatus="CLOSED" />);

    expect(screen.getByText("Needs OPEN status")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /CLOSE/i }));
    expect(mocks.mutate).not.toHaveBeenCalled();
  });
});
