import { useState, useEffect } from "react";
import { Card } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import { Badge } from "../components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { Trophy, Medal, Award, Search, TrendingUp, Loader2, RefreshCw } from "lucide-react";
import { useUser } from "../context/UserContext";
import { fetchLeaderboard, updateLeaderboardScore, type LeaderboardEntry } from "../utils/api";
import { toast } from "sonner@2.0.3";

interface LeaderboardPageProps {
  onNavigate: (page: string) => void;
}

export function LeaderboardPage({ onNavigate }: LeaderboardPageProps) {
  const { user, userProgress } = useUser();
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch leaderboard data
  const loadLeaderboard = async (showRefreshToast = false) => {
    try {
      setRefreshing(true);
      const data = await fetchLeaderboard();
      
      // Sort by score descending and add rank
      const sortedData = data
        .sort((a, b) => b.score - a.score)
        .map((entry, index) => ({
          ...entry,
          rank: index + 1,
        }));
      
      setLeaderboardData(sortedData);
      
      if (showRefreshToast) {
        toast.success("Leaderboard refreshed");
      }
    } catch (error: any) {
      console.error("Failed to load leaderboard:", error);
      toast.error("Failed to load leaderboard data");
      
      // Fallback to mock data if API fails
      setLeaderboardData([
        { id: 1, name: "Admin", score: 200, rank: 1 },
        { id: 2, name: "Player2", score: 150, rank: 2 },
      ]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Load leaderboard on mount
  useEffect(() => {
    loadLeaderboard();
  }, []);

  // Update leaderboard when user completes a module
  const handleScoreUpdate = async (points: number) => {
    if (!user || (!user.id && !user.uid)) {
      toast.error("Please log in to update your score");
      return;
    }

    try {
      // userId is extracted from JWT token by backend, but we pass it for compatibility
      await updateLeaderboardScore(user.id || user.uid, points);
      toast.success(`+${points} points added!`);
      
      // Refresh leaderboard
      await loadLeaderboard();
    } catch (error: any) {
      console.error("Failed to update score:", error);
      toast.error("Failed to update leaderboard");
    }
  };

  // Filter leaderboard based on search query
  const filteredData = leaderboardData.filter((entry) =>
    entry.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Trophy className="h-5 w-5 text-yellow-500" />;
    if (rank === 2) return <Medal className="h-5 w-5 text-gray-400" />;
    if (rank === 3) return <Medal className="h-5 w-5 text-amber-600" />;
    return null;
  };

  const getUserInitials = (name?: string | null) => {
    if (!name) return "U";
    const parts = name.split(" ");
    return parts.length >= 2
      ? `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase()
      : name.slice(0, 2).toUpperCase();
  };

  // Calculate average score
  const averageScore = leaderboardData.length > 0
    ? Math.round(leaderboardData.reduce((sum, entry) => sum + entry.score, 0) / leaderboardData.length)
    : 0;

  // Loading state
  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-8 flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-teal" />
          <p className="text-muted-foreground">Loading leaderboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      {/* Logged-In User Info */}
      {user ? (
        <div className="flex items-center gap-2 mb-2">
          <Avatar className="h-7 w-7">
            {user.photoURL && <AvatarImage src={user.photoURL} alt={user.displayName || "User"} />}
            <AvatarFallback className="text-xs bg-teal/10 text-primary border border-teal/20">
              {getUserInitials(user.displayName)}
            </AvatarFallback>
          </Avatar>
          <span className="text-sm text-primary dark:text-slate-200">
            Logged in as: <span className="font-medium">{user.displayName || user.email?.split("@")[0] || "User"}</span>
          </span>
        </div>
      ) : (
        <div className="flex items-center gap-2 mb-2">
          <div className="h-7 w-7 rounded-full bg-muted animate-pulse" />
          <span className="text-sm text-muted-foreground">
            Logged in as: …
          </span>
        </div>
      )}

      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-4xl text-primary mb-2">Leaderboard</h1>
          <p className="text-muted-foreground">
            Top performers in USDA AI Red Team Training across all departments
          </p>
        </div>
        <Button
          onClick={() => loadLeaderboard(true)}
          disabled={refreshing}
          variant="outline"
          size="sm"
          className="gap-2"
        >
          {refreshing ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <RefreshCw className="h-4 w-4" />
          )}
          Refresh
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <Card className="p-6 border-2 border-border">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <TrendingUp className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl text-primary">{leaderboardData.length}+</p>
              <p className="text-xs text-muted-foreground">Total Users</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 border-2 border-border">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-teal/10 flex items-center justify-center">
              <Award className="h-5 w-5" style={{ color: "#00a7a7" }} />
            </div>
            <div>
              <p className="text-2xl" style={{ color: "#00a7a7" }}>
                {averageScore}
              </p>
              <p className="text-xs text-muted-foreground">Average Score</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 border-2 border-border">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
              <Trophy className="h-5 w-5 text-success" />
            </div>
            <div>
              <p className="text-2xl text-success">{userProgress.completedModules.length}/10</p>
              <p className="text-xs text-muted-foreground">Your Progress</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Search and Filter */}
      <Card className="p-4 mb-6 border-2 border-border">
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search by name..." 
              className="pl-10" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </Card>

      {/* Leaderboard Table */}
      <Card className="border-2 border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="w-20">Rank</TableHead>
              <TableHead>Name</TableHead>
              <TableHead className="text-center">Score</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.length > 0 ? (
              filteredData.map((entry) => {
                const isCurrentUser = user && (
                  entry.id === user.id || 
                  entry.id === user.uid || 
                  entry.id.toString() === user.uid || 
                  entry.name === user.displayName
                );
                
                return (
                  <TableRow
                    key={entry.id}
                    className={
                      isCurrentUser
                        ? "bg-teal/5 border-l-4 border-l-teal"
                        : "hover:bg-muted/30"
                    }
                  >
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getRankIcon(entry.rank || 0)}
                        <span className={(entry.rank || 0) <= 3 ? "font-semibold" : "text-muted-foreground"}>
                          #{entry.rank}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {entry.avatar ? (
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={entry.avatar} alt={entry.name} />
                            <AvatarFallback>{getUserInitials(entry.name)}</AvatarFallback>
                          </Avatar>
                        ) : (
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="bg-teal/10 text-teal">
                              {getUserInitials(entry.name)}
                            </AvatarFallback>
                          </Avatar>
                        )}
                        <span className={isCurrentUser ? "font-semibold text-primary" : ""}>
                          {entry.name}
                        </span>
                        {isCurrentUser && (
                          <Badge
                            variant="outline"
                            className="bg-teal/10 border-teal/20"
                            style={{ color: "#00a7a7" }}
                          >
                            You
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <span className="font-semibold text-primary text-lg">{entry.score}</span>
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={3} className="text-center py-8 text-muted-foreground">
                  No results found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>

      {/* Bottom CTA */}
      <Card className="mt-8 p-8 text-center border-2 border-border">
        <h3 className="text-primary mb-3">Improve Your Ranking</h3>
        <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
          Complete more modules and achieve higher scores to climb the leaderboard. Each module
          completion contributes to your overall ranking.
        </p>
        <Button
          onClick={() => onNavigate("learn")}
          size="lg"
          className="bg-primary hover:bg-primary/90"
        >
          Continue Training
        </Button>
      </Card>
    </div>
  );
}
