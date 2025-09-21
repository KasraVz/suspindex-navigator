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
  percentile: 98,
  currentQuarter: "Q3",
  quartersAchieved: ["Q1", "Q2", "Q3"], // Quarters the user has achieved
  assessmentRanks: {
    seasonal: {
      fpa: { rank: 28, quarter: "Q3", testScore: 92 },
      geb: { rank: 35, quarter: "Q3", testScore: 88 },
      eea: { rank: 22, quarter: "Q3", testScore: 95 }
    },
    allTime: {
      fpa: { rank: 25, quarter: "Q3", testScore: 94 },
      geb: { rank: 42, quarter: "Q3", testScore: 87 },
      eea: { rank: 18, quarter: "Q3", testScore: 96 }
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
    { activity: "Season Dominator Badge earned", type: "badge", date: "2 hours ago" },
    { activity: "Q3 Quarter Achievement unlocked", type: "quarter", date: "1 day ago" },
    { activity: "Insight Master Badge earned", type: "badge", date: "3 days ago" },
    { activity: "FPA Excellence Certificate awarded", type: "certificate", date: "1 week ago" },
  ],
  quarterRequirements: {
    Q1: { minScore: 70, description: "Bronze level - Good foundation" },
    Q2: { minScore: 80, description: "Silver level - Strong performance" },
    Q3: { minScore: 90, description: "Gold level - Excellent results" },
    Q4: { minScore: 95, description: "Legendary - Outstanding mastery" }
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
    percentile,
    currentQuarter,
    quartersAchieved,
    assessmentRanks,
    badges,
    recentAchievements,
    quarterRequirements,
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
                      <div className="text-xs text-muted-foreground">Score: {seasonal.testScore}%</div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">All-Time</div>
                      <div className="font-semibold">#{allTime.rank}</div>
                      <div className="text-xs text-muted-foreground">Score: {allTime.testScore}%</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Quarter Progression Tracker */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Target className="h-5 w-5 text-primary" />
            <h3 className="font-semibold">Quarter Progression</h3>
          </div>
          
          {/* Quarter Progression Visual */}
          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              {["Q1", "Q2", "Q3", "Q4"].map((quarter, index) => {
                const isAchieved = quartersAchieved.includes(quarter);
                const isCurrent = quarter === currentQuarter;
                const quarterStyle = getQuarterStyle(quarter);
                
                return (
                  <div key={quarter} className="flex flex-col items-center flex-1">
                    <div 
                      className={`w-12 h-12 rounded-full border-2 flex items-center justify-center text-sm font-semibold transition-all ${
                        isAchieved 
                          ? `${quarterStyle.bg} ${quarterStyle.text} border-current` 
                          : 'bg-muted border-muted-foreground/20 text-muted-foreground'
                      } ${isCurrent ? 'ring-2 ring-primary ring-offset-2' : ''}`}
                    >
                      {isAchieved ? (
                        <CheckCircle className="h-6 w-6" />
                      ) : (
                        <span>{quarter}</span>
                      )}
                    </div>
                    <div className="mt-2 text-center">
                      <div className="text-xs font-medium">{quarter}</div>
                      <div className="text-xs text-muted-foreground">
                        {quarterRequirements[quarter].minScore}%+
                      </div>
                    </div>
                    {index < 3 && (
                      <div 
                        className={`absolute top-6 w-16 h-0.5 ${
                          quartersAchieved.includes(["Q1", "Q2", "Q3", "Q4"][index + 1]) 
                            ? 'bg-primary' 
                            : 'bg-muted-foreground/20'
                        }`}
                        style={{ left: `${(index + 1) * 25 - 8}%` }}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
          
          {/* Next Quarter Target */}
          {currentQuarter !== "Q4" && (
            <div className="mt-4 p-3 rounded-lg bg-secondary/30 border">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg">{getQuarterStyle(["Q1", "Q2", "Q3", "Q4"][["Q1", "Q2", "Q3", "Q4"].indexOf(currentQuarter) + 1]).icon}</span>
                <div>
                  <div className="font-medium text-sm">
                    Next Target: {["Q1", "Q2", "Q3", "Q4"][["Q1", "Q2", "Q3", "Q4"].indexOf(currentQuarter) + 1]}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {quarterRequirements[["Q1", "Q2", "Q3", "Q4"][["Q1", "Q2", "Q3", "Q4"].indexOf(currentQuarter) + 1]].description}
                  </div>
                </div>
              </div>
              <div className="text-xs text-muted-foreground">
                Maintain {quarterRequirements[["Q1", "Q2", "Q3", "Q4"][["Q1", "Q2", "Q3", "Q4"].indexOf(currentQuarter) + 1]].minScore}%+ average test scores across assessments
              </div>
            </div>
          )}
          
          {/* Quarter Requirements Legend */}
          <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
            {Object.entries(quarterRequirements).map(([quarter, req]) => (
              <div key={quarter} className="flex items-center gap-2">
                <span className={`w-3 h-3 rounded-full ${getQuarterStyle(quarter).bg.split(' ')[0]}`} />
                <span className="font-medium">{quarter}:</span>
                <span className="text-muted-foreground">{req.description}</span>
              </div>
            ))}
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
            {recentAchievements.slice(0, 3).map((achievement, index) => {
              const getTypeIcon = (type: string) => {
                switch (type) {
                  case 'badge': return Award;
                  case 'quarter': return Trophy;
                  case 'certificate': return Star;
                  default: return CheckCircle;
                }
              };
              
              const TypeIcon = getTypeIcon(achievement.type);
              
              return (
                <div key={index} className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
                  <div className="flex items-center gap-2">
                    <TypeIcon className="h-4 w-4 text-primary" />
                    <div>
                      <div className="text-sm font-medium">{achievement.activity}</div>
                      <div className="text-xs text-muted-foreground flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {achievement.date}
                      </div>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-primary border-primary/20 bg-primary/5 capitalize">
                    {achievement.type}
                  </Badge>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};