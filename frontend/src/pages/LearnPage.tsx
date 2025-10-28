import { useState, useEffect } from "react";
import { Button } from "../components/ui/button";
import { vulnerabilities } from "../lib/vulnerabilities";
import { calculateCompletionPercentage } from "../lib/userProgress";
import { useUser } from "../context/UserContext";
import { toast } from "sonner@2.0.3";
import {
  AlertTriangle,
  Database,
  Eye,
  Image,
  Download,
  Lock,
  Users,
  ShieldAlert,
  FileWarning,
  Zap,
} from "lucide-react";
import { ProgressSummaryBar } from "../components/shared/ProgressSummaryBar";
import { FilterBar } from "../components/shared/FilterBar";
import { VulnerabilityCard } from "../components/shared/VulnerabilityCard";
import { ContinueTrainingBanner } from "../components/shared/ContinueTrainingBanner";
import { ResumeCard } from "../components/shared/ResumeCard";
import { 
  getLastViewedModule, 
  saveLastViewedModule, 
  getTimeElapsed,
  type LastViewedModule 
} from "../lib/moduleUtils";

interface LearnPageProps {
  onNavigate: (page: string, data?: any) => void;
}

const iconMap: Record<number, any> = {
  1: AlertTriangle,
  2: Database,
  3: Eye,
  4: Image,
  5: Download,
  6: Lock,
  7: Users,
  8: ShieldAlert,
  9: FileWarning,
  10: Zap,
};

export function LearnPage({ onNavigate }: LearnPageProps) {
  const { userProgress } = useUser();
  const completionPercentage = calculateCompletionPercentage(userProgress.completedModules);
  const [prevCompletedCount, setPrevCompletedCount] = useState(userProgress.completedModules.length);
  const [activeFilter, setActiveFilter] = useState<'all' | 'high' | 'medium' | 'low'>('all');
  const [visibleCount, setVisibleCount] = useState(6);
  const [lastViewed, setLastViewed] = useState<LastViewedModule | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  // Load last viewed module from localStorage on mount
  useEffect(() => {
    const lastViewedModule = getLastViewedModule();
    if (lastViewedModule) {
      setLastViewed(lastViewedModule);
    }
  }, []);

  // Save module view to localStorage when navigating
  const handleModuleClick = (moduleId: number) => {
    const isCompleted = userProgress.completedModules.includes(moduleId);
    const progress = isCompleted ? 100 : (userProgress.moduleProgress?.[moduleId]?.progress || 0);
    
    saveLastViewedModule(moduleId, progress);
    
    const module = vulnerabilities.find((v) => v.id === moduleId);
    if (module) {
      setLastViewed({
        id: moduleId,
        title: module.title,
        progress,
        updatedAt: Date.now(),
      });
    }
    
    // Pass vulnerabilityId (not id) to match what App.tsx expects
    onNavigate("modules", { vulnerabilityId: moduleId });
  };

  // Monitor progress changes and show toasts
  useEffect(() => {
    const currentCount = userProgress.completedModules.length;
    
    if (currentCount > prevCompletedCount) {
      const newPercentage = calculateCompletionPercentage(userProgress.completedModules);
      
      // Show progress update toast
      toast.success(`✅ Module completed — your progress is now ${newPercentage}%`, {
        duration: 4000,
      });

      // Check if all modules are complete
      if (currentCount === vulnerabilities.length) {
        setTimeout(() => {
          toast.success("🏆 All modules mastered! Great job, Agent.", {
            duration: 6000,
          });
        }, 1000);
      }
    }
    
    setPrevCompletedCount(currentCount);
  }, [userProgress.completedModules, prevCompletedCount]);

  // Filter vulnerabilities based on active filter
  const filteredVulnerabilities = vulnerabilities.filter((vuln) => {
    if (activeFilter === 'all') return true;
    // Map "low" to "easy" for display purposes
    if (activeFilter === 'low') {
      // Since there are no "low" severity modules in the data, this will be empty
      // You can add a "low" severity to some modules if needed
      return vuln.severity === 'low';
    }
    return vuln.severity === activeFilter;
  });

  // Get visible vulnerabilities based on "Load More" state
  const visibleVulnerabilities = filteredVulnerabilities.slice(0, visibleCount);
  const hasMore = visibleCount < filteredVulnerabilities.length;

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 4);
  };

  const handleFilterChange = (filter: 'all' | 'high' | 'medium' | 'low') => {
    setIsAnimating(true);
    setActiveFilter(filter);
    setVisibleCount(6); // Reset to initial count when filter changes
    
    // Reset animation after transition
    setTimeout(() => {
      setIsAnimating(false);
    }, 400);
  };

  // Calculate average score
  const averageScore = userProgress.completedModules.length > 0
    ? Math.round((userProgress.completedModules.reduce((acc, id) => acc + (userProgress.quizScores?.[id] || 85), 0) / userProgress.completedModules.length))
    : 0;

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 transition-colors duration-200">
      {/* Header Section */}
      <div className="mb-6">
        <h1
          className="mb-2"
          style={{
            fontSize: '2rem',
            fontFamily: 'Source Sans Pro, sans-serif',
            fontWeight: 700,
            color: '#162E51',
          }}
        >
          OWASP Top 10 for LLM Applications
        </h1>
        <p
          style={{
            fontFamily: 'Source Sans Pro, sans-serif',
            fontSize: '1rem',
            color: '#475569',
          }}
        >
          Learn and Mitigate AI Risks
        </p>
      </div>

      {/* Progress Summary Bar */}
      <ProgressSummaryBar
        modulesCompleted={userProgress.completedModules.length}
        totalModules={vulnerabilities.length}
        averageScore={averageScore}
        currentProgress={completionPercentage}
      />

      {/* Filter Bar */}
      <FilterBar activeFilter={activeFilter} onFilterChange={handleFilterChange} />

      {/* Resume Card + Module Cards Grid */}
      <div 
        className={`grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-4 lg:gap-6 mb-8 transition-opacity duration-400 ${
          isAnimating ? 'opacity-0' : 'opacity-100'
        }`}
        style={{
          animation: isAnimating ? '' : 'fadeInUp 0.4s ease-out',
        }}
      >
        {/* Resume Card - Always appears first if available */}
        {lastViewed && (
          <div
            style={{
              animation: 'slideInFromLeft 0.5s ease-out',
            }}
          >
            <ResumeCard
              moduleId={lastViewed.id}
              moduleTitle={lastViewed.title}
              progress={lastViewed.progress}
              lastActive={getTimeElapsed(lastViewed.updatedAt)}
              onResume={() => handleModuleClick(lastViewed.id)}
            />
          </div>
        )}

        {/* Module Cards */}
        {visibleVulnerabilities.map((vulnerability, index) => {
          const Icon = iconMap[vulnerability.id];
          const isCompleted = userProgress.completedModules.includes(vulnerability.id);
          const progress = isCompleted ? 100 : (userProgress.moduleProgress?.[vulnerability.id]?.progress || 0);

          return (
            <div
              key={vulnerability.id}
              style={{
                animation: `fadeInUp 0.4s ease-out ${index * 0.05}s backwards`,
              }}
            >
              <VulnerabilityCard
                id={vulnerability.id}
                title={vulnerability.title}
                description={vulnerability.description}
                severity={vulnerability.severity}
                icon={Icon}
                isCompleted={isCompleted}
                progress={progress}
                onAction={() => handleModuleClick(vulnerability.id)}
                actionLabel={isCompleted ? "Review" : "Learn"}
              />
            </div>
          );
        })}
      </div>

      {/* Load More Button */}
      {hasMore && (
        <div className="flex justify-center mb-8">
          <Button
            onClick={handleLoadMore}
            variant="outline"
            size="lg"
            className="px-8 transition-all duration-200"
            style={{
              fontFamily: 'Public Sans, sans-serif',
              fontWeight: 600,
              borderColor: '#162E51',
              color: '#162E51',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(46, 133, 64, 0.1)';
              e.currentTarget.style.borderColor = '#2E8540';
              e.currentTarget.style.color = '#2E8540';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.borderColor = '#162E51';
              e.currentTarget.style.color = '#162E51';
            }}
          >
            Load More Modules
          </Button>
        </div>
      )}

      {/* Continue Training Banner */}
      <ContinueTrainingBanner
        onContinue={() => onNavigate("play")}
        buttonText={userProgress.completedModules.length === vulnerabilities.length ? "Continue to Simulations" : "Continue Training"}
      />

      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideInFromLeft {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </div>
  );
}
