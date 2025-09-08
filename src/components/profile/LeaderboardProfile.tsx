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

// Quarter colors and styling
const getQuarterStyle = (quarter: string) => {
  switch (quarter) {
    case 'Q4':
      return {
        bg: 'bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-purple-500/30',
        text: 'text-purple-700 dark:text-purple-300',
        badge: 'bg-gradient-to-r from-purple-500 to-pink-500 text-white',
        icon: '👑'
      };
    case 'Q3':
      return {
        bg: 'bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border-yellow-500/30',
        text: 'text-yellow-700 dark:text-yellow-300',
        badge: 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white',
        icon: '🥇'
      };
    case 'Q2':
      return {
        bg: 'bg-gradient-to-r from-gray-400/10 to-gray-500/10 border-gray-400/30',
        text: 'text-gray-700 dark:text-gray-300',
        badge: 'bg-gradient-to-r from-gray-400 to-gray-500 text-white',
        icon: '🥈'
      };
    case 'Q1':
      return {
        bg: 'bg-gradient-to-r from-amber-600/10 to-amber-700/10 border-amber-600/30',
        text: 'text-amber-700 dark:text-amber-300',
        badge: 'bg-gradient-to-r from-amber-600 to-amber-700 text-white',
        icon: '🥉'
      };
    default:
      return {
        bg: 'bg-muted/50 border-muted',
        text: 'text-muted-foreground',
        badge: 'bg-muted text-muted-foreground',
        icon: '📊'
      };
  }
};

// Enhanced mock user leaderboard data
const mockUserLeaderboardData = {
  overallRank: 28,
  totalUsers: 1247,
  totalPoints: 45680,
  percentile: 98,
  currentQuarter: "Q3",
  assessmentRanks: {
    seasonal: {
      fpa: { rank: 28, points: 2180, quarter: "Q3" },
      geb: { rank: 35, points: 2320, quarter: "Q3" },
      eea: { rank: 22, points: 2640, quarter: "Q3" }
    },
    allTime: {
      fpa: { rank: 25, points: 11180, quarter: "Q3" },
      geb: { rank: 42, points: 10520, quarter: "Q3" },
      eea: { rank: 18, points: 12140, quarter: "Q3" }
    }
  },
  badges: [
    { name: "Season Dominator", description: "Top seasonal ranking in FPA", icon: Trophy, earned: true, category: "seasonal" },
    { name: "Eternal Legend", description: "Top all-time ranking", icon: Star, earned: true, category: "alltime" },
    { name: "Insight Master", description: "Excellent assessment feedback", icon: Target, earned: true, category: "feedback" },
    { name: "Community Sage", description: "Highly upvoted in Supshub", icon: CheckCircle, earned: true, category: "community" },
    { name: "Triple Threat", description: "Top ranks across all assessments", icon: Medal, earned: false, category: "mastery" },
    { name: "Legendary Elite", description: "Achieved Q4 status", icon: Award, earned: false, category: "legendary" },
  ],
  recentAchievements: [
    { activity: "Season Dominator Badge", points: "+500", date: "2 hours ago" },
    { activity: "Q3 Quarter Achievement", points: "+300", date: "1 day ago" },
    { activity: "Insight Master Badge", points: "+250", date: "3 days ago" },
    { activity: "Assessment Streak Bonus", points: "+100", date: "1 week ago" },
  ],
  nextMilestone: {
    name: "Q4 Legendary Status",
    currentProgress: 2180,
    target: 3000,
    pointsNeeded: 820,
    progressPercent: 73
  },
  certificates: [
    { name: "Q3 Excellence Certificate", assessment: "FPA", issued: "2024-03-15" },
    { name: "Q3 Excellence Certificate", assessment: "EEA", issued: "2024-03-10" },
  ]
};

export const LeaderboardProfile = () => {
  const { 
    overallRank, 
    totalUsers, 
    totalPoints, 
    percentile,
    currentQuarter,
    assessmentRanks,
    badges,
    recentAchievements,
    nextMilestone,
    certificates
  } = mockUserLeaderboardData;

  const quarterStyle = getQuarterStyle(currentQuarter);
  
  const badgesByCategory = {
    legendary: badges.filter(b => b.category === 'legendary'),
    seasonal: badges.filter(b => b.category === 'seasonal'),
    alltime: badges.filter(b => b.category === 'alltime'),
    feedback: badges.filter(b => b.category === 'feedback'),
    community: badges.filter(b => b.category === 'community'),
    mastery: badges.filter(b => b.category === 'mastery'),
  };

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
        {/* Current Quarter & Ranking */}
        <div className={`p-4 rounded-lg border ${quarterStyle.bg}`}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="text-2xl">{quarterStyle.icon}</span>
              <div>
                <h3 className="font-semibold">Current Quarter Status</h3>
                <Badge className={`${quarterStyle.badge} mt-1`}>
                  {currentQuarter === 'Q4' ? 'Legendary Elite' : `Quarter ${currentQuarter}`}
                </Badge>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold">#{overallRank}</div>
              <div className="text-sm text-muted-foreground">of {totalUsers.toLocaleString()}</div>
            </div>
          </div>
          {currentQuarter === 'Q4' && (
            <div className="text-sm text-muted-foreground">
              🎉 Congratulations! You're in the legendary quarter with exceptional performance!
            </div>
          )}
        </div>

        {/* Assessment Rankings Comparison */}
        <div className="space-y-4">
          <h3 className="font-semibold flex items-center gap-2">
            <Trophy className="h-5 w-5 text-primary" />
            Assessment Rankings
          </h3>
          <div className="grid gap-3">
            {['fpa', 'geb', 'eea'].map((assessment) => {
              const seasonal = assessmentRanks.seasonal[assessment];
              const allTime = assessmentRanks.allTime[assessment];
              const assessmentQuarter = getQuarterStyle(seasonal.quarter);
              
              return (
                <div key={assessment} className={`p-3 rounded-lg border ${assessmentQuarter.bg}`}>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm uppercase">{assessment}</span>
                      {seasonal.quarter === 'Q4' && <span className="text-sm">👑</span>}
                    </div>
                    <Badge className={`${assessmentQuarter.badge} text-xs`}>
                      {seasonal.quarter === 'Q4' ? 'Legendary' : seasonal.quarter}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mt-2">
                    <div>
                      <div className="text-xs text-muted-foreground">Seasonal (90d)</div>
                      <div className="font-semibold">#{seasonal.rank}</div>
                      <div className="text-xs text-muted-foreground">{seasonal.points.toLocaleString()} pts</div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">All-Time</div>
                      <div className="font-semibold">#{allTime.rank}</div>
                      <div className="text-xs text-muted-foreground">{allTime.points.toLocaleString()} pts</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Progress to Next Quarter/Milestone */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Target className="h-5 w-5 text-primary" />
            <h3 className="font-semibold">Next Milestone: {nextMilestone.name}</h3>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progress to Q4 Legendary</span>
              <span>{nextMilestone.pointsNeeded.toLocaleString()} points needed</span>
            </div>
            <Progress value={nextMilestone.progressPercent} className="h-2" />
          </div>
        </div>

        {/* Enhanced Badge System */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Award className="h-5 w-5 text-primary" />
            <h3 className="font-semibold">Achievement Badges</h3>
          </div>
          
          <div className="space-y-4">
            {/* Legendary Badges */}
            {badgesByCategory.legendary.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-2">🏆 Legendary Achievements</h4>
                <div className="grid grid-cols-2 gap-2">
                  {badgesByCategory.legendary.map((badge) => (
                    <div 
                      key={badge.name}
                      className={`p-2 rounded-lg border text-center transition-all text-xs ${
                        badge.earned 
                          ? 'bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-purple-500/30 text-purple-700 dark:text-purple-300' 
                          : 'bg-muted/50 border-muted text-muted-foreground opacity-60'
                      }`}
                    >
                      <badge.icon className={`h-4 w-4 mx-auto mb-1 ${badge.earned ? 'text-purple-600' : 'text-muted-foreground'}`} />
                      <div className="font-medium">{badge.name}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Other Badge Categories */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {[...badgesByCategory.seasonal, ...badgesByCategory.alltime, ...badgesByCategory.feedback, ...badgesByCategory.community, ...badgesByCategory.mastery].map((badge) => (
                <div 
                  key={badge.name}
                  className={`p-2 rounded-lg border text-center transition-all text-xs ${
                    badge.earned 
                      ? 'bg-primary/5 border-primary/20 text-primary' 
                      : 'bg-muted/50 border-muted text-muted-foreground opacity-60'
                  }`}
                >
                  <badge.icon className={`h-4 w-4 mx-auto mb-1 ${badge.earned ? 'text-primary' : 'text-muted-foreground'}`} />
                  <div className="font-medium">{badge.name}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Certificates Section */}
        {certificates.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Star className="h-5 w-5 text-primary" />
              <h3 className="font-semibold">Certificates Earned</h3>
            </div>
            <div className="space-y-2">
              {certificates.map((cert, index) => (
                <div key={index} className="flex items-center justify-between p-2 rounded-lg bg-secondary/30 border">
                  <div className="flex items-center gap-2">
                    <Trophy className="h-4 w-4 text-primary" />
                    <div>
                      <div className="text-sm font-medium">{cert.name}</div>
                      <div className="text-xs text-muted-foreground">{cert.assessment}</div>
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground">{cert.issued}</div>
                </div>
              ))}
            </div>
          </div>
        )}

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