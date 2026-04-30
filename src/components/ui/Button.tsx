import { forwardRef } from "react";
import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "danger" | "ghost" | "success";
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", ...props }, ref) => {
    const variants = {
      primary: "border-cyan-600 bg-cyan-600 text-white hover:bg-cyan-500",
      danger: "border-red-700 bg-red-700 text-white hover:bg-red-600",
      success: "border-green-700 bg-green-700 text-white hover:bg-green-600",
      ghost: "border-zinc-700 bg-zinc-900 text-zinc-100 hover:bg-zinc-800",
    };

    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex h-10 items-center justify-center border px-4 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-45",
          variants[variant],
          className,
        )}
        {...props}
      />
    );
  },
);

Button.displayName = "Button";
