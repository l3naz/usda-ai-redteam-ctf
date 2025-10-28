import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";

export function ModuleHeader() {
  return (
    <div className="space-y-6">
      {/* Title and Badge */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="space-y-2">
          <h1 className="text-4xl text-primary">LLM01 – Prompt Injection</h1>
          <p className="text-muted-foreground">
            Understanding and defending against prompt manipulation attacks
          </p>
        </div>
        {/* Enhanced Severity Badge with High Contrast */}
        <span 
          className="inline-flex items-center justify-center px-3 py-1.5 rounded-full bg-[#B91C1C] text-white shadow-sm hover:bg-[#991B1B] transition-colors duration-200"
          style={{ fontWeight: 600, fontSize: '0.875rem', letterSpacing: '0.025em' }}
        >
          HIGH
        </span>
      </div>

      {/* Enhanced Progress Bar with Better Dark Mode Visibility */}
      <div className="bg-card dark:bg-card rounded-xl border border-border p-6 shadow-sm transition-colors duration-200">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm text-foreground dark:text-foreground">Module Progress</span>
          <span className="text-sm text-[#0A2342] dark:text-[#F1F5F9]">30% Complete</span>
        </div>
        {/* Custom Progress Bar with Enhanced Dark Mode Visibility */}
        <div className="relative h-2 w-full overflow-hidden rounded-lg bg-[#E2E8F0] dark:bg-[#1E293B] transition-colors duration-200">
          <div 
            className="h-full rounded-lg bg-[#00A7A7] dark:bg-[#38BDF8] transition-all duration-300"
            style={{ 
              width: '30%',
              boxShadow: '0 0 8px rgba(0, 167, 167, 0.35)'
            }}
          />
        </div>
        <p className="text-xs text-[#475569] dark:text-[#94A3B8] mt-2 transition-colors duration-200">
          Estimated time remaining: 15 minutes
        </p>
      </div>
    </div>
  );
}
