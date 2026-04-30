import { useEffect } from "react";
import { cn } from "@/lib/cn";
import { useUiStore } from "@/store/uiStore";

export function ToastContainer(): JSX.Element {
  const toasts = useUiStore((state) => state.toasts);
  const dismiss = useUiStore((state) => state.dismissToast);

  useEffect(() => {
    if (toasts.length === 0) {
      return undefined;
    }
    const timers = toasts.map((toast) => window.setTimeout(() => dismiss(toast.id), 5000));
    return () => timers.forEach((timer) => window.clearTimeout(timer));
  }, [dismiss, toasts]);

  return (
    <div className="fixed right-4 top-4 z-50 flex w-[min(380px,calc(100vw-2rem))] flex-col gap-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={cn(
            "border px-4 py-3 text-sm shadow-xl",
            toast.tone === "success" && "border-green-700 bg-green-950 text-green-100",
            toast.tone === "error" && "border-red-700 bg-red-950 text-red-100",
            toast.tone === "info" && "border-cyan-700 bg-cyan-950 text-cyan-100",
          )}
        >
          {toast.message}
        </div>
      ))}
    </div>
  );
}

