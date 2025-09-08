import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { NavLink } from "react-router-dom";
import { 
  Trophy, 
  Medal, 
  Star, 
  TrendingUp, 
  Target, 
  Award,
  ExternalLink,
  Calendar,
  CheckCircle
} from "lucide-react";

// Mock user leaderboard data
const mockUserLeaderboardData = {
  overallRank: 28,
  totalUsers: 1247,
  totalPoints: 45680,
  percentile: 98,
  assessmentRanks: {
    fpa: { rank: 25, points: 4180 },
    geb: { rank: 42, points: 4520 },
    eea: { rank: 18, points: 5140 }
  },
  badges: [
    { name: "Financial Analyst", description: "FPA top performer", icon: Trophy, earned: true },
    { name: "Global Thinker", description: "GEB excellence", icon: Target, earned: true },
    { name: "Innovation Leader", description: "EEA champion", icon: CheckCircle, earned: true },
    { name: "Excellence Pro", description: "All assessments mastery", icon: Star, earned: false },
    { name: "Assessment Champion", description: "Top 10 in any assessment", icon: Medal, earned: true },
  ],
  recentAchievements: [
    { activity: "FPA Perfect Score", points: "+350", date: "2 hours ago" },
    { activity: "GEB Module Completed", points: "+200", date: "1 day ago" },
    { activity: "EEA Leadership Badge", points: "+150", date: "3 days ago" },
    { activity: "Assessment Streak Bonus", points: "+100", date: "1 week ago" },
  ],
  nextMilestone: {
    name: "Top 15 Overall",
    currentProgress: 28,
    target: 15,
    pointsNeeded: 1840,
    progressPercent: 78
  }
};

export const LeaderboardProfile = () => {
  const { 
    overallRank, 
    totalUsers, 
    totalPoints, 
    percentile,
    assessmentRanks,
    badges,
    recentAchievements,
    nextMilestone
  } = mockUserLeaderboardData;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-xl font-semibold">Leaderboard & Achievements</CardTitle>
        <Button variant="outline" size="sm" asChild>
          <NavLink to="/dashboard/leaderboard" className="flex items-center gap-2">
            View Full Leaderboard
            <ExternalLink className="h-4 w-4" />
          </NavLink>
        </Button>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Current Ranking */}
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Trophy className="h-5 w-5 text-primary" />
                <h3 className="font-semibold">Current Ranking</h3>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-primary">#{overallRank}</span>
                <span className="text-muted-foreground">of {totalUsers.toLocaleString()}</span>
              </div>
              <p className="text-sm text-muted-foreground">Top {100 - percentile}% of all users</p>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-2">
                <Star className="h-5 w-5 text-primary" />
                <h3 className="font-semibold">Total Points</h3>
              </div>
              <div className="text-2xl font-bold">{totalPoints.toLocaleString()}</div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="font-semibold mb-3">Assessment Rankings</h3>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">FPA</span>
                  <div className="text-right">
                    <Badge variant="secondary">#{assessmentRanks.fpa.rank}</Badge>
                    <div className="text-xs text-muted-foreground mt-1">{assessmentRanks.fpa.points} pts</div>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">GEB</span>
                  <div className="text-right">
                    <Badge variant="secondary">#{assessmentRanks.geb.rank}</Badge>
                    <div className="text-xs text-muted-foreground mt-1">{assessmentRanks.geb.points} pts</div>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">EEA</span>
                  <div className="text-right">
                    <Badge variant="secondary">#{assessmentRanks.eea.rank}</Badge>
                    <div className="text-xs text-muted-foreground mt-1">{assessmentRanks.eea.points} pts</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Progress to Next Milestone */}
        <div>
            <div className="flex items-center gap-2 mb-3">
              <Target className="h-5 w-5 text-primary" />
              <h3 className="font-semibold">Next Milestone: {nextMilestone.name}</h3>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progress to Top 15</span>
                <span>{nextMilestone.pointsNeeded.toLocaleString()} points needed</span>
              </div>
              <Progress value={nextMilestone.progressPercent} className="h-2" />
            </div>
        </div>

        {/* Badges & Achievements */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Award className="h-5 w-5 text-primary" />
            <h3 className="font-semibold">Badges</h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {badges.map((badge) => (
              <div 
                key={badge.name}
                className={`p-3 rounded-lg border text-center transition-all ${
                  badge.earned 
                    ? 'bg-primary/5 border-primary/20 text-primary' 
                    : 'bg-muted/50 border-muted text-muted-foreground opacity-60'
                }`}
              >
                <badge.icon className={`h-6 w-6 mx-auto mb-2 ${badge.earned ? 'text-primary' : 'text-muted-foreground'}`} />
                <div className="text-xs font-medium">{badge.name}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="h-5 w-5 text-primary" />
            <h3 className="font-semibold">Recent Activity</h3>
          </div>
          <div className="space-y-3">
            {recentAchievements.slice(0, 3).map((achievement, index) => (
              <div key={index} className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
                <div>
                  <div className="text-sm font-medium">{achievement.activity}</div>
                  <div className="text-xs text-muted-foreground flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {achievement.date}
                  </div>
                </div>
                <Badge variant="outline" className="text-green-600 border-green-600/20 bg-green-600/5">
                  {achievement.points}
                </Badge>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};