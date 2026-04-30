import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import { AuthBootstrap } from "@/components/AuthBootstrap";
import { ToastContainer } from "@/components/ui/Toast";
import { AppRouter } from "@/routes/AppRouter";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 30_000, refetchOnWindowFocus: false, retry: 1 },
  },
});

export function App(): JSX.Element {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthBootstrap>
          <AppRouter />
          <ToastContainer />
        </AuthBootstrap>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

