import { Button } from "../ui/button";
import { Shield } from "lucide-react";

interface ContinueTrainingBannerProps {
  onContinue: () => void;
  buttonText?: string;
}

export function ContinueTrainingBanner({
  onContinue,
  buttonText = 'Continue Training',
}: ContinueTrainingBannerProps) {
  return (
    <div
      className="rounded-lg p-8 mt-12 text-center shadow-md"
      style={{
        background: 'linear-gradient(90deg, #162E51, #204F6C)',
      }}
    >
      <div className="flex flex-col items-center gap-4">
        <div
          className="w-16 h-16 rounded-lg flex items-center justify-center shadow-sm"
          style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
        >
          <Shield className="h-8 w-8" style={{ color: '#FFFFFF' }} />
        </div>
        
        <h3
          style={{
            fontFamily: 'Public Sans, sans-serif',
            fontWeight: 700,
            fontSize: '1.5rem',
            color: '#FFFFFF',
            marginBottom: '0.5rem',
          }}
        >
          Continue Your AI Red Team Training Journey
        </h3>
        
        <p
          className="max-w-2xl"
          style={{
            fontFamily: 'Source Sans Pro, sans-serif',
            fontSize: '1rem',
            color: '#E8F0F2',
            lineHeight: '1.6',
          }}
        >
          Earn points, unlock new modules, and advance your certification. Master AI security vulnerabilities through hands-on learning and real-world simulations.
        </p>

        <Button
          onClick={onContinue}
          size="lg"
          className="mt-4"
          style={{
            backgroundColor: '#2E8540',
            color: '#FFFFFF',
            fontFamily: 'Public Sans, sans-serif',
            fontWeight: 600,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#1B5E20';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#2E8540';
          }}
        >
          {buttonText}
        </Button>
      </div>
    </div>
  );
}
