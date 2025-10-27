import { useState, useEffect } from "react";
import { OverviewSection } from "../components/OverviewSection";
import { InteractiveLab } from "../components/InteractiveLab";
import { MitigationSection } from "../components/MitigationSection";
import { KnowledgeCheck } from "../components/KnowledgeCheck";
import { CompletionSection } from "../components/CompletionSection";
import { Button } from "../components/ui/button";
import { Progress } from "../components/ui/progress";
import { Card } from "../components/ui/card";
import { Skeleton } from "../components/ui/skeleton";
import { ChevronLeft, CheckCircle2, AlertCircle } from "lucide-react";
import { type UserProgress, initializeModuleProgress, calculateModuleProgress } from "../lib/userProgress";
import { getVulnerabilityById } from "../lib/vulnerabilities";
import { toast } from "sonner@2.0.3";
import { saveLastViewedModule } from "../lib/moduleUtils";

interface ModulePageProps {
  onNavigate: (page: string) => void;
  vulnerabilityId?: number;
  onModuleComplete?: (moduleId: number, score: number) => void;
  onSectionUpdate?: (moduleId: number, section: 'overview' | 'quickExplainer' | 'mitigation' | 'interactiveLab' | 'quiz') => void;
  onQuizComplete?: (moduleId: number, score: number) => void;
  userProgress?: UserProgress;
}

export function ModulePage({ 
  onNavigate, 
  vulnerabilityId, 
  onModuleComplete,
  onSectionUpdate,
  onQuizComplete,
  userProgress
}: ModulePageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [vulnerability, setVulnerability] = useState<ReturnType<typeof getVulnerabilityById>>(null);

  // Load vulnerability data
  useEffect(() => {
    if (vulnerabilityId) {
      const vuln = getVulnerabilityById(vulnerabilityId);
      setVulnerability(vuln);
      setIsLoading(false);
    } else {
      setIsLoading(false);
    }
  }, [vulnerabilityId]);

  const moduleProgress = userProgress?.moduleProgress[vulnerabilityId || 1] || initializeModuleProgress(vulnerabilityId || 1);
  const [localProgress, setLocalProgress] = useState(moduleProgress.progress);

  // Update local progress when module progress changes
  useEffect(() => {
    setLocalProgress(moduleProgress.progress);
  }, [moduleProgress.progress]);

  // Save last viewed module to localStorage on mount and progress updates
  useEffect(() => {
    if (vulnerabilityId) {
      saveLastViewedModule(vulnerabilityId, moduleProgress.progress);
    }
  }, [vulnerabilityId, moduleProgress.progress]);

  const handleSectionComplete = (section: 'overview' | 'quickExplainer' | 'mitigation' | 'interactiveLab') => {
    if (onSectionUpdate && vulnerabilityId && !moduleProgress.sectionsCompleted[section]) {
      onSectionUpdate(vulnerabilityId, section);
    }
  };

  const handleQuizComplete = (score: number) => {
    if (onQuizComplete && vulnerabilityId) {
      onQuizComplete(vulnerabilityId, score);
      
      const passed = score >= 80;
      if (passed) {
        // Completion toast with celebration
        toast.success(`🏆 Module Complete — You've mastered ${vulnerability?.shortTitle || 'this module'}!`, {
          duration: 5000,
        });
      } else {
        // Encourage to retake
        toast.info("Complete the assessment quiz with 80% or higher to finalize this module.", {
          duration: 4000,
        });
      }
    }
  };

  const estimatedTimeRemaining = Math.max(0, Math.ceil((100 - localProgress) * 0.15)); // ~15 min total

  // Get severity badge config
  const getSeverityConfig = (severity?: string) => {
    switch (severity?.toLowerCase()) {
      case 'high':
        return { bg: '#B91C1C', hoverBg: '#991B1B', label: 'HIGH' };
      case 'medium':
        return { bg: '#D97706', hoverBg: '#B45309', label: 'MEDIUM' };
      case 'low':
        return { bg: '#2E8540', hoverBg: '#1D6A34', label: 'LOW' };
      default:
        return { bg: '#6B7280', hoverBg: '#4B5563', label: 'UNKNOWN' };
    }
  };

  const severityConfig = getSeverityConfig(vulnerability?.severity);

  // Loading state
  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-8" style={{ animation: 'fadeIn 0.3s ease-out' }}>
        <Skeleton className="h-8 w-48 mb-6" />
        <div className="space-y-6">
          <div className="space-y-4">
            <Skeleton className="h-12 w-3/4" />
            <Skeleton className="h-6 w-1/2" />
          </div>
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

  // Module not found state
  if (!vulnerability || !vulnerabilityId) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Back Navigation Button */}
        <Button
          variant="ghost"
          className="pl-0 text-primary hover:text-primary/80 hover:bg-transparent mb-6"
          onClick={() => onNavigate("learn")}
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back to Learning Modules
        </Button>

        {/* Error State */}
        <Card className="p-12 text-center border-2 border-destructive/20">
          <AlertCircle className="h-16 w-16 text-destructive mx-auto mb-4" />
          <h2 className="text-2xl mb-2">Module Not Found</h2>
          <p className="text-muted-foreground mb-6">
            The module you're looking for doesn't exist or couldn't be loaded.
          </p>
          <Button onClick={() => onNavigate("learn")}>
            Return to Learning Modules
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div 
      className="max-w-7xl mx-auto px-6 py-8"
      style={{
        animation: 'fadeIn 0.3s ease-out',
      }}
    >
      {/* Single Back Navigation Button with Breadcrumb */}
      <Button
        variant="ghost"
        className="pl-0 text-primary hover:text-primary/80 hover:bg-transparent mb-6"
        onClick={() => onNavigate("learn")}
      >
        <ChevronLeft className="h-4 w-4 mr-1" />
        Back to Learning Modules
      </Button>

      {/* Dynamic Module Header with Progress */}
      <div className="space-y-6 mb-8">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="space-y-2">
            <h1 className="text-4xl text-primary">{vulnerability.title}</h1>
            <p className="text-muted-foreground">
              {vulnerability.learningObjective}
            </p>
          </div>
          <span 
            className="inline-flex items-center justify-center px-3 py-1.5 rounded-full text-white shadow-sm transition-colors duration-200"
            style={{ 
              fontWeight: 600, 
              fontSize: '0.875rem', 
              letterSpacing: '0.025em',
              backgroundColor: severityConfig.bg,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = severityConfig.hoverBg;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = severityConfig.bg;
            }}
          >
            {severityConfig.label}
          </span>
        </div>

        {/* Enhanced Progress Bar */}
        <Card className="p-6 shadow-sm border-2 border-border bg-card transition-colors duration-200">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-foreground dark:text-foreground flex items-center gap-2">
              Module Progress
              {moduleProgress.completed && (
                <CheckCircle2 className="h-4 w-4 text-success" />
              )}
            </span>
            <span className="text-sm text-[#0A2342] dark:text-[#F1F5F9] font-semibold">
              {localProgress}% Complete
            </span>
          </div>
          <Progress
            value={localProgress}
            className="h-2 transition-all duration-300"
          />
          <div className="flex items-center justify-between mt-3">
            <p className="text-xs text-[#475569] dark:text-[#94A3B8] transition-colors duration-200">
              Estimated time remaining: {estimatedTimeRemaining} minutes
            </p>
            {localProgress >= 90 && !moduleProgress.completed && (
              <p className="text-xs text-amber-600 dark:text-amber-400 font-medium">
                Complete quiz to finalize ✓
              </p>
            )}
          </div>

          {/* Section Checklist */}
          <div className="mt-4 pt-4 border-t border-border">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-2 text-xs">
              <div className={`flex items-center gap-1 ${moduleProgress.sectionsCompleted.overview ? 'text-success' : 'text-muted-foreground'}`}>
                {moduleProgress.sectionsCompleted.overview ? <CheckCircle2 className="h-3 w-3" /> : <div className="h-3 w-3 rounded-full border border-current" />}
                <span>Overview</span>
              </div>
              <div className={`flex items-center gap-1 ${moduleProgress.sectionsCompleted.quickExplainer ? 'text-success' : 'text-muted-foreground'}`}>
                {moduleProgress.sectionsCompleted.quickExplainer ? <CheckCircle2 className="h-3 w-3" /> : <div className="h-3 w-3 rounded-full border border-current" />}
                <span>Explainer</span>
              </div>
              <div className={`flex items-center gap-1 ${moduleProgress.sectionsCompleted.mitigation ? 'text-success' : 'text-muted-foreground'}`}>
                {moduleProgress.sectionsCompleted.mitigation ? <CheckCircle2 className="h-3 w-3" /> : <div className="h-3 w-3 rounded-full border border-current" />}
                <span>Mitigation</span>
              </div>
              <div className={`flex items-center gap-1 ${moduleProgress.sectionsCompleted.interactiveLab ? 'text-success' : 'text-muted-foreground'}`}>
                {moduleProgress.sectionsCompleted.interactiveLab ? <CheckCircle2 className="h-3 w-3" /> : <div className="h-3 w-3 rounded-full border border-current" />}
                <span>Lab</span>
              </div>
              <div className={`flex items-center gap-1 ${moduleProgress.sectionsCompleted.quiz ? 'text-success' : 'text-muted-foreground'}`}>
                {moduleProgress.sectionsCompleted.quiz ? <CheckCircle2 className="h-3 w-3" /> : <div className="h-3 w-3 rounded-full border border-current" />}
                <span>Quiz {moduleProgress.quizScore !== null && `(${moduleProgress.quizScore}%)`}</span>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <div className="space-y-8 mt-8">
        <OverviewSection onComplete={() => handleSectionComplete('overview')} />
        <InteractiveLab 
          onNavigateToSimulation={() => onNavigate("simulation")} 
          onComplete={() => handleSectionComplete('interactiveLab')}
        />
        <MitigationSection onComplete={() => handleSectionComplete('mitigation')} />
        <KnowledgeCheck onQuizComplete={handleQuizComplete} />
        <CompletionSection onNavigate={onNavigate} isCompleted={moduleProgress.completed} />
      </div>

      <style>{`
        @keyframes fadeIn {
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
