import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Progress } from "../components/ui/progress";
import { calculateCompletionPercentage, getRemainingModules } from "../lib/userProgress";
import { useUser } from "../context/UserContext";
import { 
  BookOpen, 
  Target, 
  Trophy, 
  Award, 
  TrendingUp,
  ArrowRight,
  CheckCircle2,
  Clock
} from "lucide-react";

interface DashboardPageProps {
  user: { name: string; email: string };
  onNavigate: (page: string) => void;
}

export function DashboardPage({ user, onNavigate }: DashboardPageProps) {
  const { userProgress } = useUser();
  const completionPercentage = calculateCompletionPercentage(userProgress.completedModules);
  const remainingModules = getRemainingModules(userProgress.completedModules);
  const firstName = user.name?.split(" ")[0] || user.email?.split("@")[0] || "User";

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      {/* Welcome Banner */}
      <div className="text-white rounded-lg p-8 mb-8 transition-colors duration-200 shadow-md" style={{
        background: 'linear-gradient(90deg, #162E51, #2E8540)'
      }}>
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="mb-2" style={{ 
              fontSize: '2rem', 
              fontFamily: 'Public Sans, sans-serif',
              fontWeight: 700,
              color: '#FFFFFF'
            }}>
              Welcome back, {firstName}! 👋
            </h1>
            <p className="text-lg" style={{ 
              color: '#B8E1C5',
              fontFamily: 'Source Sans Pro, sans-serif'
            }}>
              Continue your AI Red Team training journey
            </p>
          </div>
          <div className="text-right">
            <p className="mb-1" style={{ 
              fontSize: '2rem', 
              fontFamily: 'Public Sans, sans-serif',
              fontWeight: 700,
              color: '#FFFFFF'
            }}>
              {userProgress.completedModules.length}/10
            </p>
            <p className="text-sm" style={{ 
              color: '#B8E1C5',
              fontFamily: 'Source Sans Pro, sans-serif'
            }}>
              Modules Completed
            </p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm" style={{ 
              color: '#E8F0F2',
              fontFamily: 'Source Sans Pro, sans-serif'
            }}>
              Overall Progress
            </span>
            <span className="text-sm transition-all duration-300" style={{ 
              color: '#FFFFFF',
              fontFamily: 'Public Sans, sans-serif',
              fontWeight: 600
            }}>
              {completionPercentage}%
            </span>
          </div>
          <div className="rounded-full h-3 overflow-hidden" style={{ backgroundColor: '#A9DAB4' }}>
            <div 
              className="h-full transition-all duration-700 ease-out rounded-full"
              style={{ 
                width: `${completionPercentage}%`,
                backgroundColor: '#2E8540'
              }}
            />
          </div>
        </div>
      </div>

      {/* Main CTAs */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <Card className="p-8 border-2 bg-card transition-all duration-200 cursor-pointer group hover:shadow-lg" style={{
          borderColor: 'rgba(46, 133, 64, 0.3)'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = '#2E8540';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = 'rgba(46, 133, 64, 0.3)';
        }}>
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors" style={{
              backgroundColor: 'rgba(46, 133, 64, 0.1)'
            }}>
              <BookOpen className="h-7 w-7" style={{ color: '#2E8540' }} />
            </div>
            <div className="flex-1">
              <h3 className="text-card-foreground mb-2" style={{ 
                fontFamily: 'Public Sans, sans-serif',
                fontWeight: 700
              }}>
                Start Learning
              </h3>
              <p className="text-muted-foreground text-sm mb-4">
                Explore AI vulnerabilities through interactive modules and hands-on exercises
              </p>
              <Button 
                onClick={() => onNavigate("learn")}
                className="gap-2"
              >
                Go to Learn
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>

        <Card className="p-8 border-2 bg-card transition-all duration-200 cursor-pointer group hover:shadow-lg" style={{
          borderColor: 'rgba(46, 133, 64, 0.3)'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = '#2E8540';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = 'rgba(46, 133, 64, 0.3)';
        }}>
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors" style={{
              backgroundColor: 'rgba(46, 133, 64, 0.1)'
            }}>
              <Target className="h-7 w-7" style={{ color: '#2E8540' }} />
            </div>
            <div className="flex-1">
              <h3 className="text-card-foreground mb-2" style={{ 
                fontFamily: 'Public Sans, sans-serif',
                fontWeight: 700
              }}>
                Go to Play
              </h3>
              <p className="text-muted-foreground text-sm mb-4">
                Practice your skills in live CTF simulations and red team exercises
              </p>
              <Button 
                onClick={() => onNavigate("play")}
                className="gap-2"
                variant="outline"
              >
                Go to Play
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>
      </div>

      {/* Stats Grid */}
      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <Card className="p-6 border-2 border-border bg-card transition-colors duration-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
              <CheckCircle2 className="h-5 w-5 text-success" />
            </div>
            <div>
              <p className="text-2xl text-card-foreground transition-all duration-300">{userProgress.completedModules.length}</p>
              <p className="text-xs text-muted-foreground">Completed</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 border-2 border-border bg-card transition-colors duration-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center">
              <Clock className="h-5 w-5 text-warning" />
            </div>
            <div>
              <p className="text-2xl text-card-foreground transition-all duration-300">{remainingModules}</p>
              <p className="text-xs text-muted-foreground">Remaining</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 border-2 border-border bg-card transition-colors duration-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-teal/10 flex items-center justify-center">
              <TrendingUp className="h-5 w-5 text-teal" />
            </div>
            <div>
              <p className="text-2xl text-card-foreground transition-all duration-300">{userProgress.totalScore}</p>
              <p className="text-xs text-muted-foreground">Total Score</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 border-2 border-border bg-card transition-colors duration-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-teal/10 flex items-center justify-center">
              <Trophy className="h-5 w-5 text-teal" />
            </div>
            <div>
              <p className="text-2xl text-card-foreground transition-all duration-300">#{userProgress.rank}</p>
              <p className="text-xs text-muted-foreground">Rank</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Recent Activity & Quick Links */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <Card className="p-6 border-2 border-border bg-card transition-colors duration-200">
          <h3 className="text-card-foreground mb-4">Recent Activity</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
              <div className="w-8 h-8 rounded-full bg-success/10 flex items-center justify-center flex-shrink-0">
                <CheckCircle2 className="h-4 w-4 text-success" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm truncate text-card-foreground">Completed Membership Inference</p>
                <p className="text-xs text-muted-foreground">{"2 days ago"}</p>
              </div>
              <span className="text-xs px-2 py-1 bg-success/10 text-success rounded">90%</span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
              <div className="w-8 h-8 rounded-full bg-success/10 flex items-center justify-center flex-shrink-0">
                <CheckCircle2 className="h-4 w-4 text-success" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm truncate text-card-foreground">Completed Adversarial Examples</p>
                <p className="text-xs text-muted-foreground">{"3 days ago"}</p>
              </div>
              <span className="text-xs px-2 py-1 bg-success/10 text-success rounded">92%</span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
              <div className="w-8 h-8 rounded-full bg-success/10 flex items-center justify-center flex-shrink-0">
                <CheckCircle2 className="h-4 w-4 text-success" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm truncate text-card-foreground">Completed Data Poisoning</p>
                <p className="text-xs text-muted-foreground">{"5 days ago"}</p>
              </div>
              <span className="text-xs px-2 py-1 bg-success/10 text-success rounded">88%</span>
            </div>
          </div>
        </Card>

        {/* Quick Links */}
        <Card className="p-6 border-2 border-border bg-card transition-colors duration-200">
          <h3 className="text-card-foreground mb-4">Quick Links</h3>
          <div className="space-y-3">
            <button
              onClick={() => onNavigate("leaderboard")}
              className="w-full flex items-center justify-between p-3 bg-muted hover:bg-muted/70 rounded-lg transition-colors text-left"
            >
              <div className="flex items-center gap-3">
                <Trophy className="h-5 w-5 text-teal" />
                <span className="text-sm text-card-foreground">View Leaderboard</span>
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground" />
            </button>
            <button
              onClick={() => onNavigate("profile")}
              className="w-full flex items-center justify-between p-3 bg-muted hover:bg-muted/70 rounded-lg transition-colors text-left"
            >
              <div className="flex items-center gap-3">
                <Award className="h-5 w-5 text-teal" />
                <span className="text-sm text-card-foreground">View Certificates</span>
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground" />
            </button>
            <button
              onClick={() => onNavigate("profile")}
              className="w-full flex items-center justify-between p-3 bg-muted hover:bg-muted/70 rounded-lg transition-colors text-left"
            >
              <div className="flex items-center gap-3">
                <Target className="h-5 w-5 text-teal" />
                <span className="text-sm text-card-foreground">Edit Profile</span>
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground" />
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
}
