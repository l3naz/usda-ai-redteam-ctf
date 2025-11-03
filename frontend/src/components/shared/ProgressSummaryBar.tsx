import { Trophy, Target, Award } from "lucide-react";

interface ProgressSummaryBarProps {
  modulesCompleted: number;
  totalModules: number;
  averageScore?: number;
  currentProgress: number;
  className?: string;
}

export function ProgressSummaryBar({
  modulesCompleted,
  totalModules,
  averageScore,
  currentProgress,
  className = "",
}: ProgressSummaryBarProps) {
  return (
    <div 
      className={`rounded-lg border-2 transition-all duration-200 bg-card dark:bg-card border-border ${className}`}
      role="region"
      aria-label="Learning progress summary"
      style={{
        borderRadius: '12px',
        padding: '1rem 1.5rem',
        boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.05)',
        marginBottom: '1.25rem',
      }}
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Modules Completed */}
        <div 
          className="flex items-center gap-4"
          style={{
            animation: 'fadeInStat 0.5s ease-out',
          }}
        >
          <div 
            className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 bg-success/10"
            aria-hidden="true"
          >
            <span style={{ fontSize: '1.5rem' }}>🏆</span>
          </div>
          <div>
            <p 
              className="text-sm mb-1 text-muted-foreground dark:text-slate-300"
              style={{ 
                fontFamily: 'Source Sans Pro, sans-serif',
                fontWeight: 500,
              }}
              id="modules-completed-label"
            >
              Modules Completed
            </p>
            <p 
              className="text-success dark:text-teal"
              style={{ 
                fontSize: '1.5rem',
                fontFamily: 'Public Sans, sans-serif',
                fontWeight: 700,
                lineHeight: '1',
              }}
              aria-labelledby="modules-completed-label"
              aria-live="polite"
            >
              {modulesCompleted}/{totalModules}
            </p>
          </div>
        </div>

        {/* Average Score (if provided) */}
        {averageScore !== undefined && (
          <div 
            className="flex items-center gap-4"
            style={{
              animation: 'fadeInStat 0.5s ease-out 0.2s backwards',
            }}
          >
            <div 
              className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 bg-success/10"
              aria-hidden="true"
            >
              <span style={{ fontSize: '1.5rem' }}>🎖️</span>
            </div>
            <div>
              <p 
                className="text-sm mb-1 text-muted-foreground dark:text-slate-300"
                style={{ 
                  fontFamily: 'Source Sans Pro, sans-serif',
                  fontWeight: 500,
                }}
                id="average-score-label"
              >
                Average Score
              </p>
              <p 
                className="text-success dark:text-teal"
                style={{ 
                  fontSize: '1.5rem',
                  fontFamily: 'Public Sans, sans-serif',
                  fontWeight: 700,
                  lineHeight: '1',
                }}
                aria-labelledby="average-score-label"
                aria-live="polite"
              >
                {averageScore}%
              </p>
            </div>
          </div>
        )}

        {/* Current Progress */}
        <div 
          className="flex items-center gap-4"
          style={{
            animation: 'fadeInStat 0.5s ease-out 0.4s backwards',
          }}
        >
          <div 
            className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 bg-success/10"
            aria-hidden="true"
          >
            <span style={{ fontSize: '1.5rem' }}>🎯</span>
          </div>
          <div className="flex-1">
            <p 
              className="text-sm mb-2 text-muted-foreground dark:text-slate-300"
              style={{ 
                fontFamily: 'Source Sans Pro, sans-serif',
                fontWeight: 500,
              }}
              id="current-progress-label"
            >
              Current Progress
            </p>
            <div className="flex items-center gap-3">
              <div 
                className="flex-1 h-2 rounded-full overflow-hidden bg-muted dark:bg-slate-700"
                role="progressbar"
                aria-valuenow={currentProgress}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-labelledby="current-progress-label"
              >
                <div
                  className="h-full transition-all duration-1000 ease-out bg-success dark:bg-teal"
                  style={{
                    width: `${currentProgress}%`,
                    animation: 'progressGrow 1s ease-out',
                  }}
                />
              </div>
              <span 
                className="text-sm text-success dark:text-teal"
                style={{ 
                  fontFamily: 'Public Sans, sans-serif',
                  fontWeight: 700,
                  minWidth: '40px',
                }}
                aria-live="polite"
              >
                {currentProgress}%
              </span>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes progressGrow {
          from {
            width: 0;
          }
        }

        @keyframes fadeInStat {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          @keyframes progressGrow {
            from, to {
              width: ${currentProgress}%;
            }
          }
          @keyframes fadeInStat {
            from, to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        }
      `}</style>
    </div>
  );
}

