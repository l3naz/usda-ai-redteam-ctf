import * as React from "react";

import { cn } from "./utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        // Base styles with visible border in both modes
        "flex h-10 w-full min-w-0 rounded-lg border px-3 py-2 text-base outline-none",
        // Background and text colors
        "bg-input-background text-foreground",
        // Border - always visible with theme-adaptive colors
        "border-[#CBD5E1] dark:border-[#475569]",
        // Placeholder color
        "placeholder:text-[#94A3B8]",
        // Focus state with teal border and glow
        "focus-visible:border-[#00A7A7] focus-visible:ring-4 focus-visible:ring-[#00A7A7]/20",
        // Hover state
        "hover:border-[#00A7A7]/60 dark:hover:border-[#00A7A7]/60",
        // Transitions
        "transition-all duration-150 ease-in",
        // File input styles
        "file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground",
        // Selection colors
        "selection:bg-teal selection:text-white",
        // Disabled state
        "disabled:cursor-not-allowed disabled:opacity-50 disabled:pointer-events-none",
        // Invalid state
        "aria-invalid:border-destructive aria-invalid:ring-destructive/20",
        // Responsive text size
        "md:text-sm",
        className,
      )}
      {...props}
    />
  );
}

export { Input };
