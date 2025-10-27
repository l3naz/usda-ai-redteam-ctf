import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Progress } from "../components/ui/progress";
import { vulnerabilities, type Vulnerability } from "../lib/vulnerabilities";
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
  Clock,
  Award,
  Shield,
} from "lucide-react";

interface VulnerabilitiesPageProps {
  onNavigate: (page: string, data?: any) => void;
  completedModules?: number[];
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

export function VulnerabilitiesPage({ onNavigate, completedModules = [] }: VulnerabilitiesPageProps) {
  const completionPercentage = (completedModules.length / vulnerabilities.length) * 100;

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high":
        return "bg-destructive/10 text-destructive border-destructive/20";
      case "medium":
        return "bg-warning/10 text-warning border-warning/20";
      case "low":
        return "bg-success/10 text-success border-success/20";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-4xl text-primary mb-2">Vulnerabilities Explored</h1>
            <p className="text-muted-foreground">
              Master 10 critical AI security vulnerabilities through interactive training modules
            </p>
          </div>
          <div className="text-right">
            <p className="text-3xl text-primary mb-1">
              {completedModules.length} / {vulnerabilities.length}
            </p>
            <p className="text-sm text-muted-foreground">Modules Completed</p>
          </div>
        </div>

        {/* Progress Bar */}
        <Card className="p-6 shadow-sm border-2 border-border">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm">Overall Training Progress</span>
            <span className="text-sm" style={{ color: "#00a7a7" }}>
              {Math.round(completionPercentage)}% Complete
            </span>
          </div>
          <Progress
            value={completionPercentage}
            className="h-3"
            style={
              {
                "--progress-background": "#00a7a7",
              } as React.CSSProperties
            }
          />
        </Card>
      </div>

      {/* Vulnerabilities Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-6">
        {vulnerabilities.map((vulnerability) => {
          const Icon = iconMap[vulnerability.id];
          const isCompleted = completedModules.includes(vulnerability.id);

          return (
            <Card
              key={vulnerability.id}
              className="p-6 hover:shadow-lg transition-all border-2 border-border hover:border-teal relative overflow-hidden"
            >
              {/* Completed Overlay */}
              {isCompleted && (
                <div className="absolute top-4 right-4">
                  <div className="bg-success text-success-foreground text-xs px-3 py-1 rounded-full">
                    Completed ✓
                  </div>
                </div>
              )}

              {/* Icon and Number */}
              <div className="flex items-start gap-4 mb-4">
                <div
                  className={`flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center ${
                    isCompleted ? "bg-success/10" : "bg-primary/10"
                  }`}
                >
                  <Icon className={`h-6 w-6 ${isCompleted ? "text-success" : "text-primary"}`} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs px-2 py-1 bg-muted text-muted-foreground rounded">
                      #{vulnerability.id}
                    </span>
                    <Badge variant="outline" className={getSeverityColor(vulnerability.severity)}>
                      {vulnerability.severity.toUpperCase()}
                    </Badge>
                  </div>
                  <h3 className="text-primary mb-1">{vulnerability.title}</h3>
                </div>
              </div>

              {/* Description */}
              <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                {vulnerability.description}
              </p>

              {/* Meta Info */}
              <div className="flex items-center justify-between pt-4 border-t border-border">
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {vulnerability.timeEstimate}
                  </div>
                  <div className="px-2 py-1 bg-muted rounded">{vulnerability.category}</div>
                </div>
                <Button
                  onClick={() => onNavigate("modules", { vulnerabilityId: vulnerability.id })}
                  size="sm"
                  variant={isCompleted ? "outline" : "default"}
                  className={`transition-all duration-200 review-button ${
                    isCompleted 
                      ? "" 
                      : "bg-primary hover:bg-primary/90"
                  }`}
                  style={
                    isCompleted
                      ? {
                          fontWeight: 600,
                          borderRadius: '8px',
                          padding: '6px 14px',
                          borderWidth: '1.5px',
                          borderStyle: 'solid',
                          borderColor: 'var(--review-btn-border, #38BDF8)',
                          color: 'var(--review-btn-text, #38BDF8)',
                          backgroundColor: 'transparent'
                        }
                      : undefined
                  }
                  onMouseEnter={(e) => {
                    if (isCompleted) {
                      e.currentTarget.style.backgroundColor = 'rgba(56, 189, 248, 0.15)';
                      e.currentTarget.style.color = '#FFFFFF';
                      e.currentTarget.style.borderColor = '#00A7A7';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (isCompleted) {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.color = 'var(--review-btn-text, #38BDF8)';
                      e.currentTarget.style.borderColor = 'var(--review-btn-border, #38BDF8)';
                    }
                  }}
                  onMouseDown={(e) => {
                    if (isCompleted) {
                      e.currentTarget.style.backgroundColor = '#00A7A7';
                      e.currentTarget.style.color = '#FFFFFF';
                      e.currentTarget.style.borderColor = '#00A7A7';
                    }
                  }}
                  onMouseUp={(e) => {
                    if (isCompleted) {
                      e.currentTarget.style.backgroundColor = 'rgba(56, 189, 248, 0.15)';
                      e.currentTarget.style.color = '#FFFFFF';
                      e.currentTarget.style.borderColor = '#00A7A7';
                    }
                  }}
                >
                  {isCompleted ? "Review" : "Learn More"}
                </Button>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Bottom CTA - Certificate Banner */}
      <Card 
        className="mt-8 p-8 text-center border-0 relative overflow-hidden transition-all duration-300"
        style={{
          background: completionPercentage === 100 
            ? 'linear-gradient(90deg, #065F46, #10B981)' 
            : 'linear-gradient(90deg, #0F172A, #1E293B)',
          border: '1px solid #00A7A7',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)'
        }}
      >
        <div className="flex flex-col items-center gap-4">
          {/* Icon */}
          <div 
            className="p-3 rounded-full transition-all duration-300"
            style={{
              backgroundColor: completionPercentage === 100 ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 167, 167, 0.1)',
              border: `1px solid ${completionPercentage === 100 ? '#ffffff' : '#00A7A7'}`
            }}
          >
            {completionPercentage === 100 ? (
              <Award className="h-8 w-8" style={{ color: '#ffffff' }} />
            ) : (
              <Shield className="h-8 w-8" style={{ color: '#00A7A7' }} />
            )}
          </div>

          {/* Title */}
          <h3 
            className="mb-0 transition-colors duration-300"
            style={{ 
              color: '#E2E8F0',
              fontWeight: 600,
              fontSize: '1.25rem'
            }}
          >
            {completionPercentage === 100 
              ? '🎉 Certificate Unlocked — View & Download' 
              : 'Complete All Modules to Earn Your Certificate'}
          </h3>

          {/* Description */}
          <p 
            className="mb-4 max-w-2xl mx-auto"
            style={{
              color: completionPercentage === 100 ? '#D1FAE5' : '#94A3B8',
              lineHeight: '1.5'
            }}
          >
            {completionPercentage === 100 
              ? 'Congratulations! You have mastered all modules and earned your official USDA AI Center of Excellence completion certificate.'
              : 'Demonstrate your expertise in AI red teaming and receive an official USDA AI Center of Excellence completion certificate.'}
          </p>

          {/* Progress Ring (Optional - shows when not complete) */}
          {completionPercentage < 100 && (
            <div className="flex items-center gap-3 mb-2">
              <div className="relative w-16 h-16">
                <svg className="w-16 h-16 transform -rotate-90">
                  <circle
                    cx="32"
                    cy="32"
                    r="28"
                    stroke="#1E293B"
                    strokeWidth="6"
                    fill="none"
                  />
                  <circle
                    cx="32"
                    cy="32"
                    r="28"
                    stroke="#00A7A7"
                    strokeWidth="6"
                    fill="none"
                    strokeDasharray={`${2 * Math.PI * 28}`}
                    strokeDashoffset={`${2 * Math.PI * 28 * (1 - completionPercentage / 100)}`}
                    strokeLinecap="round"
                    className="transition-all duration-500 ease-out"
                    style={{
                      filter: 'drop-shadow(0 0 4px rgba(0, 167, 167, 0.5))'
                    }}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span 
                    className="text-xs"
                    style={{ color: '#00A7A7', fontWeight: 600 }}
                  >
                    {Math.round(completionPercentage)}%
                  </span>
                </div>
              </div>
              <div className="text-left">
                <div style={{ color: '#E2E8F0', fontSize: '0.875rem', fontWeight: 600 }}>
                  {completedModules.length} of {vulnerabilities.length} Modules
                </div>
                <div style={{ color: '#94A3B8', fontSize: '0.75rem' }}>
                  {vulnerabilities.length - completedModules.length} remaining
                </div>
              </div>
            </div>
          )}

          {/* Button */}
          <Button
            size="lg"
            onClick={() => onNavigate("profile")}
            className="transition-all duration-200 ease-in-out"
            style={{
              background: completionPercentage === 100 ? '#ffffff' : 'transparent',
              color: completionPercentage === 100 ? '#065F46' : '#00A7A7',
              border: completionPercentage === 100 ? 'none' : '1px solid #00A7A7',
              borderRadius: '8px',
              fontWeight: 600
            }}
            onMouseEnter={(e) => {
              if (completionPercentage < 100) {
                e.currentTarget.style.background = '#00A7A7';
                e.currentTarget.style.color = '#0F172A';
              } else {
                e.currentTarget.style.background = '#F0FDF4';
              }
            }}
            onMouseLeave={(e) => {
              if (completionPercentage < 100) {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.color = '#00A7A7';
              } else {
                e.currentTarget.style.background = '#ffffff';
                e.currentTarget.style.color = '#065F46';
              }
            }}
          >
            {completionPercentage === 100 ? 'Download Certificate' : 'View Your Progress'}
          </Button>
        </div>
      </Card>
    </div>
  );
}
