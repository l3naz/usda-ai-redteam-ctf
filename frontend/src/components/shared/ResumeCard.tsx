import { Button } from "../ui/button";
import { Clock, Play } from "lucide-react";

interface ResumeCardProps {
  moduleId: number;
  moduleTitle: string;
  progress: number;
  lastActive: string;
  onResume: () => void;
}

export function ResumeCard({
  moduleId,
  moduleTitle,
  progress,
  lastActive,
  onResume,
}: ResumeCardProps) {
  return (
    <div
      className="rounded-lg relative overflow-hidden transition-all duration-300 hover:shadow-lg flex flex-col"
      style={{
        background: 'linear-gradient(90deg, #E6F4EA, #CDE9D6)',
        border: '1.5px solid #2E8540',
        borderRadius: '12px',
        padding: '1.25rem 1rem',
        boxShadow: '0px 4px 10px rgba(46, 133, 64, 0.15)',
        animation: 'subtlePulse 3s ease-in-out infinite',
        height: '100%',
        minHeight: '320px',
      }}
    >
      {/* Decorative corner accent */}
      <div
        className="absolute top-0 right-0 w-32 h-32 opacity-10"
        style={{
          background: 'radial-gradient(circle at top right, #2E8540, transparent)',
        }}
      />

      <div className="relative z-10 flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center gap-2 mb-3">
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: 'rgba(46, 133, 64, 0.25)' }}
          >
            <Play className="h-5 w-5" style={{ color: '#2E8540' }} />
          </div>
          <h3
            style={{
              fontFamily: 'Public Sans, sans-serif',
              fontWeight: 700,
              fontSize: '1.1rem',
              color: '#162E51',
              lineHeight: '1.3',
            }}
          >
            Continue Where You Left Off
          </h3>
        </div>

        {/* Last viewed module */}
        <p
          className="mb-1"
          style={{
            fontFamily: 'Source Sans Pro, sans-serif',
            fontSize: '0.9rem',
            color: '#162E51',
            fontWeight: 600,
          }}
        >
          Last viewed: <span style={{ color: '#2E8540', fontWeight: 700 }}>{moduleTitle}</span>
        </p>

        {/* Last active timestamp */}
        <div className="flex items-center gap-1.5 mb-4">
          <Clock className="h-3.5 w-3.5" style={{ color: '#5A5A5A' }} />
          <p
            className="text-xs"
            style={{
              fontFamily: 'Source Sans Pro, sans-serif',
              color: '#5A5A5A',
            }}
          >
            Last active {lastActive}
          </p>
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-1.5">
            <span
              className="text-xs uppercase tracking-wide"
              style={{
                color: '#162E51',
                fontFamily: 'Public Sans, sans-serif',
                fontWeight: 600,
                fontSize: '0.7rem',
              }}
            >
              Progress
            </span>
            <span
              className="text-xs"
              style={{
                color: '#2E8540',
                fontFamily: 'Public Sans, sans-serif',
                fontWeight: 700,
              }}
            >
              {progress}%
            </span>
          </div>
          <div
            className="h-1.5 rounded-full overflow-hidden"
            style={{ backgroundColor: 'rgba(46, 133, 64, 0.25)' }}
          >
            <div
              className="h-full transition-all duration-1000 ease-out"
              style={{
                width: `${progress}%`,
                backgroundColor: '#2E8540',
                animation: 'progressSlide 1s ease-out',
              }}
            />
          </div>
        </div>

        {/* Resume Button */}
        <Button
          onClick={onResume}
          className="w-full transition-all duration-200"
          style={{
            height: '40px',
            borderRadius: '8px',
            backgroundColor: '#2E8540',
            color: '#FFFFFF',
            fontFamily: 'Public Sans, sans-serif',
            fontWeight: 600,
            fontSize: '0.9rem',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#1D6A34';
            e.currentTarget.style.transform = 'scale(1.02)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#2E8540';
            e.currentTarget.style.transform = 'scale(1)';
          }}
        >
          Resume
        </Button>
      </div>

      <style>{`
        @keyframes subtlePulse {
          0%, 100% {
            box-shadow: 0 0 0 0 rgba(46, 133, 64, 0.4);
          }
          50% {
            box-shadow: 0 0 0 8px rgba(46, 133, 64, 0);
          }
        }

        @keyframes progressSlide {
          from {
            width: 0;
          }
        }
      `}</style>
    </div>
  );
}
