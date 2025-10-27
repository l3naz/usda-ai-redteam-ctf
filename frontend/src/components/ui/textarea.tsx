import * as React from "react";

import { cn } from "./utils";

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        // Base styles with visible border
        "flex w-full min-h-20 rounded-lg border px-3 py-2 text-base outline-none resize-none",
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
        // Selection colors
        "selection:bg-teal selection:text-white",
        // Disabled state
        "disabled:cursor-not-allowed disabled:opacity-50",
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

export { Textarea };
