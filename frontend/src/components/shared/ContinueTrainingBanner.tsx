import { Button } from "../ui/button";
import usdaLogo from "figma:asset/fe46ba86f87cfc9f9ab97c58bcc60686524f146d.png";

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
          <img 
            src={usdaLogo} 
            alt="USDA – United States Department of Agriculture"
            className="drop-shadow-md"
            style={{ 
              width: '42px', 
              height: 'auto',
              objectFit: 'contain'
            }}
          />
        </div>
        
        <h3
          className="text-white"
          style={{
            fontFamily: 'Public Sans, sans-serif',
            fontWeight: 700,
            fontSize: '1.5rem',
            marginBottom: '0.5rem',
          }}
        >
          Continue Your AI Red Team Training Journey
        </h3>
        
        <p
          className="max-w-2xl text-slate-100"
          style={{
            fontFamily: 'Source Sans Pro, sans-serif',
            fontSize: '1rem',
            lineHeight: '1.6',
          }}
        >
          Earn points, unlock new modules, and advance your certification. Master AI security vulnerabilities through hands-on learning and real-world simulations.
        </p>

        <Button
          onClick={onContinue}
          size="lg"
          className="mt-4 bg-success dark:bg-teal text-white hover:bg-success/90 dark:hover:bg-teal/90"
          style={{
            fontFamily: 'Public Sans, sans-serif',
            fontWeight: 600,
          }}
        >
          {buttonText}
        </Button>
      </div>
    </div>
  );
}
