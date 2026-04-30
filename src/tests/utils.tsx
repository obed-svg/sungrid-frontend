import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, type RenderOptions } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import type { ReactElement, ReactNode } from "react";

export function makeQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
}

export function AllProviders({
  children,
  initialEntries,
}: {
  children: ReactNode;
  initialEntries: string[] | undefined;
}): JSX.Element {
  return (
    <QueryClientProvider client={makeQueryClient()}>
      <MemoryRouter initialEntries={initialEntries ?? ["/"]}>{children}</MemoryRouter>
    </QueryClientProvider>
  );
}

export function renderWithProviders(
  ui: ReactElement,
  options?: { initialEntries?: string[] } & Omit<RenderOptions, "wrapper">,
) {
  return render(ui, {
    wrapper: ({ children }) => (
      <AllProviders initialEntries={options?.initialEntries}>{children}</AllProviders>
    ),
    ...options,
  });
}
