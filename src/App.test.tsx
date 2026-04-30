import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { StatusBadge } from "@/components/gauges/StatusBadge";
import { renderWithProviders } from "@/tests/utils";

describe("frontend smoke", () => {
  it("renders status badge", () => {
    renderWithProviders(<StatusBadge status="CLOSED" />);
    expect(screen.getByText("CLOSED")).toBeInTheDocument();
  });
});

