import { useState, useEffect, useMemo } from "react";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Badge } from "../components/ui/badge";
import { Progress } from "../components/ui/progress";
import { Separator } from "../components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { Alert, AlertDescription } from "../components/ui/alert";
import { calculateCompletionPercentage } from "../lib/userProgress";
import { vulnerabilities } from "../lib/vulnerabilities";
import { useUser } from "../context/UserContext";
import {
  Award,
  Download,
  Mail,
  Calendar,
  Shield,
  Trophy,
  Target,
  CheckCircle2,
  Settings,
  Edit,
  Save,
  X,
  Smartphone,
  AlertCircle,
  User as UserIcon,
} from "lucide-react";

interface ProfilePageProps {
  onNavigate: (page: string) => void;
}

export function ProfilePage({ onNavigate }: ProfilePageProps) {
  const { user, userProgress } = useUser();
  const [isEditing, setIsEditing] = useState(false);
  const [showVerification, setShowVerification] = useState(false);
  const [formData, setFormData] = useState({
    fullName: user?.displayName || "User",
    email: user?.email || "",
    mobileNumber: "+1 (555) 123-4567",
  });
  const [originalData, setOriginalData] = useState(formData);

  const completionPercentage = calculateCompletionPercentage(userProgress.completedModules);
  
  // Dynamic badges based on real progress
  const badges = useMemo(() => [
    { 
      id: 1, 
      name: "First Module", 
      icon: Target, 
      earned: userProgress.completedModules.length >= 1 
    },
    { 
      id: 2, 
      name: "5 Modules", 
      icon: Shield, 
      earned: userProgress.completedModules.length >= 5 
    },
    { 
      id: 3, 
      name: "Perfect Score", 
      icon: Trophy, 
      earned: Object.values(userProgress.moduleProgress).some(m => m.quizScore === 100) 
    },
    { 
      id: 4, 
      name: "All Complete", 
      icon: Award, 
      earned: userProgress.completedModules.length === 10 
    },
  ], [userProgress.completedModules.length, userProgress.moduleProgress]);

  // Get completed modules with scores and dates from userProgress
  const completedModulesData = useMemo(() => {
    return userProgress.completedModules.map(moduleId => {
      const vulnerability = vulnerabilities.find(v => v.id === moduleId);
      const moduleProgress = userProgress.moduleProgress[moduleId];
      return {
        id: moduleId,
        title: vulnerability?.title || `Module ${moduleId}`,
        score: moduleProgress?.quizScore || 0,
        date: moduleProgress?.lastAccessedDate || new Date().toISOString(),
      };
    }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [userProgress.completedModules, userProgress.moduleProgress]);
  
  if (!user) {
    return null;
  }

  const handleEdit = () => {
    setIsEditing(true);
    setOriginalData(formData);
  };

  const handleCancel = () => {
    setFormData(originalData);
    setIsEditing(false);
    setShowVerification(false);
  };

  const handleSave = () => {
    // Check if email or mobile changed
    if (formData.email !== originalData.email || formData.mobileNumber !== originalData.mobileNumber) {
      setShowVerification(true);
    }
    setIsEditing(false);
  };

  const handleResendCode = () => {
    alert("Verification code sent to " + formData.mobileNumber);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 transition-colors duration-200">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl text-card-foreground mb-2 transition-colors duration-200">Your Profile</h1>
        <p className="text-muted-foreground transition-colors duration-200">Manage your account and track your progress</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Column - Profile Info */}
        <div className="lg:col-span-1 space-y-6">
          {/* User Card */}
          <Card className="p-6 border-2 border-border bg-card text-center transition-colors duration-200">
            <Avatar className="w-24 h-24 mx-auto mb-4">
              {user.photoURL && <AvatarImage src={user.photoURL} alt={user.displayName || "User"} />}
              <AvatarFallback className="bg-teal text-white text-2xl transition-colors duration-200">
                {user.displayName
                  ?.split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase() || user.email?.[0]?.toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
            <h3 className="text-primary mb-1">{user.displayName || user.email?.split("@")[0] || "User"}</h3>
            <p className="text-sm text-muted-foreground mb-4">Security Analyst</p>
            <div className="flex flex-col gap-2">
              <Badge variant="outline" className="bg-teal/10 border-teal/20" style={{ color: "#00a7a7" }}>
                Active Learner
              </Badge>
              {user.uid && (
                <div className="text-xs text-muted-foreground mt-2">
                </div>
              )}
            </div>
          </Card>

          {/* Contact Info */}
          <Card className="p-6 border-2 border-border">
            <h4 className="text-primary mb-4">Contact Information</h4>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-3 text-muted-foreground">
                <Mail className="h-4 w-4 flex-shrink-0" />
                <span className="truncate">{formData.email}</span>
              </div>
              <div className="flex items-center gap-3 text-muted-foreground">
                <Smartphone className="h-4 w-4 flex-shrink-0" />
                <span>{formData.mobileNumber}</span>
              </div>
              <div className="flex items-center gap-3 text-muted-foreground">
                <Calendar className="h-4 w-4 flex-shrink-0" />
                <span>Joined September 2025</span>
              </div>
            </div>
          </Card>

          {/* Badges */}
          <Card className="p-6 border-2 border-border">
            <h4 className="text-primary mb-4">Badges Earned</h4>
            <div className="grid grid-cols-2 gap-3">
              {badges.map((badge) => (
                <div
                  key={badge.id}
                  className={`p-3 rounded-lg border-2 text-center ${
                    badge.earned
                      ? "border-success bg-success/5"
                      : "border-border bg-muted/30 opacity-50"
                  }`}
                >
                  <badge.icon
                    className={`h-8 w-8 mx-auto mb-2 ${
                      badge.earned ? "text-success" : "text-muted-foreground"
                    }`}
                  />
                  <p className="text-xs">{badge.name}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Right Column - Progress & Settings */}
        <div className="lg:col-span-2 space-y-6">
          {/* Progress Overview */}
          <Card className="p-6 border-2 border-border">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-primary">Training Progress</h3>
              <Button variant="outline" size="sm" className="gap-2">
                <Download className="h-4 w-4" />
                Download Certificate
              </Button>
            </div>

            {/* Stats Grid */}
            <div className="grid md:grid-cols-3 gap-4 mb-6">
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-3xl text-primary mb-1 transition-all duration-300">{userProgress.completedModules.length}/10</p>
                <p className="text-xs text-muted-foreground">Modules Completed</p>
              </div>
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-3xl text-primary mb-1 transition-all duration-300">{userProgress.totalScore}</p>
                <p className="text-xs text-muted-foreground">Total Score</p>
              </div>
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-3xl text-primary mb-1 transition-all duration-300">#{userProgress.rank}</p>
                <p className="text-xs text-muted-foreground">Leaderboard Rank</p>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm">Overall Completion</span>
                <span className="text-sm transition-all duration-300" style={{ color: "#00a7a7" }}>
                  {completionPercentage}%
                </span>
              </div>
              <Progress
                value={completionPercentage}
                className="h-3 transition-all duration-700"
                style={
                  {
                    "--progress-background": "#00a7a7",
                  } as React.CSSProperties
                }
              />
            </div>

            {/* Completed Modules List */}
            <div>
              <h4 className="text-sm mb-3">
                Completed Modules
                {completedModulesData.length > 0 && (
                  <span className="ml-2 text-xs text-muted-foreground">
                    ({completedModulesData.length})
                  </span>
                )}
              </h4>
              <div className="space-y-2">
                {completedModulesData.length === 0 ? (
                  <div className="text-center py-6 text-muted-foreground text-sm">
                    No modules completed yet. Start learning!
                  </div>
                ) : (
                  completedModulesData.map((module, index) => (
                    <div
                      key={module.id}
                      className="flex items-center justify-between p-3 bg-muted rounded-lg transition-all duration-300 hover:bg-muted/80"
                      style={{
                        animation: `fadeIn 0.3s ease-out ${index * 0.05}s both`
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <CheckCircle2 className="h-4 w-4 text-success flex-shrink-0" />
                          {index === 0 && completedModulesData.length > 1 && (
                            <div className="absolute -top-1 -right-1 w-2 h-2 bg-success rounded-full animate-pulse" />
                          )}
                        </div>
                        <div>
                          <p className="text-sm">{module.title}</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(module.date).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </p>
                        </div>
                      </div>
                      <Badge
                        variant="outline"
                        className={
                          module.score >= 90
                            ? "bg-success/10 text-success border-success/20"
                            : "bg-muted"
                        }
                      >
                        {module.score}%
                      </Badge>
                    </div>
                  ))
                )}
              </div>
            </div>

            <Button
              onClick={() => onNavigate(completionPercentage === 100 ? "profile" : "learn")}
              className="w-full mt-6 bg-primary hover:bg-primary/90 transition-all duration-300"
            >
              {completionPercentage === 100 ? (
                <>
                  <Award className="h-4 w-4 mr-2" />
                  View Certificate
                </>
              ) : (
                'Continue Training'
              )}
            </Button>
          </Card>

          {/* Settings */}
          <Card className="p-6 border-2 border-border">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Settings className="h-5 w-5 text-primary" />
                <h3 className="text-primary">Account Settings</h3>
              </div>
              {!isEditing && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleEdit}
                  className="gap-2"
                >
                  <Edit className="h-4 w-4" />
                  Edit Profile
                </Button>
              )}
            </div>

            {/* Verification Alert */}
            {showVerification && (
              <Alert className="mb-6 border-warning/20 bg-yellow-50">
                <AlertCircle className="h-4 w-4 text-warning" />
                <AlertDescription className="text-yellow-800">
                  <p className="mb-2">
                    A verification link has been sent to your current email address.
                  </p>
                  <Button
                    variant="link"
                    size="sm"
                    onClick={handleResendCode}
                    className="p-0 h-auto text-yellow-800 underline"
                  >
                    Resend verification code for mobile number
                  </Button>
                </AlertDescription>
              </Alert>
            )}

            <div className="space-y-6">
              <div>
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  disabled={!isEditing}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  disabled={!isEditing}
                  className="mt-1"
                />
                {isEditing && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Changing your email will require verification
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="mobile">Mobile Number</Label>
                <Input
                  id="mobile"
                  type="tel"
                  value={formData.mobileNumber}
                  onChange={(e) => setFormData({ ...formData, mobileNumber: e.target.value })}
                  disabled={!isEditing}
                  className="mt-1"
                />
                {isEditing && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Changing your number will require verification
                  </p>
                )}
              </div>

              {isEditing && (
                <>
                  <Separator />
                  <div className="flex gap-3">
                    <Button onClick={handleSave} className="bg-primary hover:bg-primary/90 gap-2">
                      <Save className="h-4 w-4" />
                      Save Changes
                    </Button>
                    <Button variant="outline" onClick={handleCancel} className="gap-2">
                      <X className="h-4 w-4" />
                      Cancel
                    </Button>
                  </div>
                </>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
