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
      className={`rounded-lg border transition-all duration-200 ${className}`}
      style={{
        backgroundColor: '#FFFFFF',
        border: '1.5px solid #E2E8F0',
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
            className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ 
              backgroundColor: '#E6F4EA',
            }}
          >
            <span style={{ fontSize: '1.5rem' }}>🏆</span>
          </div>
          <div>
            <p 
              className="text-sm mb-1"
              style={{ 
                color: '#475569',
                fontFamily: 'Source Sans Pro, sans-serif',
                fontWeight: 500,
              }}
            >
              Modules Completed
            </p>
            <p 
              style={{ 
                fontSize: '1.5rem',
                fontFamily: 'Public Sans, sans-serif',
                fontWeight: 700,
                color: '#2E8540',
                lineHeight: '1',
              }}
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
              className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ 
                backgroundColor: '#E6F4EA',
              }}
            >
              <span style={{ fontSize: '1.5rem' }}>🎖️</span>
            </div>
            <div>
              <p 
                className="text-sm mb-1"
                style={{ 
                  color: '#475569',
                  fontFamily: 'Source Sans Pro, sans-serif',
                  fontWeight: 500,
                }}
              >
                Average Score
              </p>
              <p 
                style={{ 
                  fontSize: '1.5rem',
                  fontFamily: 'Public Sans, sans-serif',
                  fontWeight: 700,
                  color: '#2E8540',
                  lineHeight: '1',
                }}
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
            className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ 
              backgroundColor: '#E6F4EA',
            }}
          >
            <span style={{ fontSize: '1.5rem' }}>🎯</span>
          </div>
          <div className="flex-1">
            <p 
              className="text-sm mb-2"
              style={{ 
                color: '#475569',
                fontFamily: 'Source Sans Pro, sans-serif',
                fontWeight: 500,
              }}
            >
              Current Progress
            </p>
            <div className="flex items-center gap-3">
              <div 
                className="flex-1 h-2 rounded-full overflow-hidden"
                style={{ backgroundColor: '#E5E7EB' }}
              >
                <div
                  className="h-full transition-all duration-1000 ease-out"
                  style={{
                    width: `${currentProgress}%`,
                    backgroundColor: '#2E8540',
                    animation: 'progressGrow 1s ease-out',
                  }}
                />
              </div>
              <span 
                className="text-sm"
                style={{ 
                  color: '#2E8540',
                  fontFamily: 'Public Sans, sans-serif',
                  fontWeight: 700,
                  minWidth: '40px',
                }}
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
      `}</style>
    </div>
  );
}

