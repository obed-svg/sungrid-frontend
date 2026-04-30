import { describe, expect, it, vi } from "vitest";
import { api } from "./client";
import { deactivateUser, deleteUser } from "./users";

vi.mock("./client", () => ({
  api: {
    delete: vi.fn(),
    patch: vi.fn(),
  },
}));

describe("users api", () => {
  it("deactivates users without deleting them", async () => {
    vi.mocked(api.patch).mockResolvedValueOnce({ data: {} });

    await deactivateUser(9);

    expect(api.patch).toHaveBeenCalledWith("/api/users/9/", { is_active: false });
    expect(api.delete).not.toHaveBeenCalled();
  });

  it("hard deletes users only through deleteUser", async () => {
    vi.mocked(api.delete).mockResolvedValueOnce({ data: {} });

    await deleteUser(9);

    expect(api.delete).toHaveBeenCalledWith("/api/users/9/");
  });
});
