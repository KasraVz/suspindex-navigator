import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Trophy, Medal, Award, Star, TrendingUp } from "lucide-react";

// Mock leaderboard data
const mockLeaderboardData = {
  daily: [
    { rank: 1, name: "Sarah Johnson", points: 2450, avatar: "", change: "+15", tests: 12 },
    { rank: 2, name: "Mike Chen", points: 2380, avatar: "", change: "+8", tests: 11 },
    { rank: 3, name: "Emily Davis", points: 2320, avatar: "", change: "+22", tests: 10 },
    { rank: 4, name: "Alex Rodriguez", points: 2280, avatar: "", change: "+5", tests: 9 },
    { rank: 5, name: "Lisa Wang", points: 2250, avatar: "", change: "+12", tests: 8 },
    { rank: 6, name: "David Kim", points: 2200, avatar: "", change: "-3", tests: 7 },
    { rank: 7, name: "Jessica Brown", points: 2150, avatar: "", change: "+18", tests: 6 },
    { rank: 8, name: "Chris Wilson", points: 2100, avatar: "", change: "+7", tests: 5 },
  ],
  weekly: [
    { rank: 1, name: "Emily Davis", points: 15820, avatar: "", change: "+145", tests: 78 },
    { rank: 2, name: "Sarah Johnson", points: 15750, avatar: "", change: "+89", tests: 76 },
    { rank: 3, name: "Mike Chen", points: 15680, avatar: "", change: "+134", tests: 74 },
    { rank: 4, name: "Alex Rodriguez", points: 15420, avatar: "", change: "+67", tests: 72 },
    { rank: 5, name: "Lisa Wang", points: 15380, avatar: "", change: "+156", tests: 70 },
    { rank: 6, name: "David Kim", points: 15200, avatar: "", change: "+23", tests: 68 },
    { rank: 7, name: "Jessica Brown", points: 15150, avatar: "", change: "+98", tests: 66 },
    { rank: 8, name: "Chris Wilson", points: 15100, avatar: "", change: "+45", tests: 64 },
  ],
  monthly: [
    { rank: 1, name: "Sarah Johnson", points: 68450, avatar: "", change: "+1245", tests: 324 },
    { rank: 2, name: "Emily Davis", points: 67820, avatar: "", change: "+1456", tests: 318 },
    { rank: 3, name: "Mike Chen", points: 67320, avatar: "", change: "+1134", tests: 312 },
    { rank: 4, name: "Lisa Wang", points: 66980, avatar: "", change: "+1678", tests: 309 },
    { rank: 5, name: "Alex Rodriguez", points: 66720, avatar: "", change: "+987", tests: 305 },
    { rank: 6, name: "David Kim", points: 65800, avatar: "", change: "+634", tests: 298 },
    { rank: 7, name: "Jessica Brown", points: 65450, avatar: "", change: "+1234", tests: 295 },
    { rank: 8, name: "Chris Wilson", points: 65200, avatar: "", change: "+876", tests: 292 },
  ]
};

const currentUserRank = { rank: 42, totalUsers: 1247, points: 45680, percentile: 97 };

const getRankIcon = (rank: number) => {
  switch (rank) {
    case 1:
      return <Trophy className="h-5 w-5 text-yellow-500" />;
    case 2:
      return <Medal className="h-5 w-5 text-gray-400" />;
    case 3:
      return <Award className="h-5 w-5 text-amber-600" />;
    default:
      return <span className="text-sm font-semibold text-muted-foreground">#{rank}</span>;
  }
};

const LeaderboardTable = ({ data }: { data: typeof mockLeaderboardData.daily }) => (
  <div className="space-y-3">
    {data.map((user) => (
      <div key={user.rank} className="flex items-center gap-4 p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors">
        <div className="flex items-center justify-center w-8">
          {getRankIcon(user.rank)}
        </div>
        
        <Avatar className="h-10 w-10">
          <AvatarImage src={user.avatar} />
          <AvatarFallback>{user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
        </Avatar>
        
        <div className="flex-1">
          <div className="font-medium">{user.name}</div>
          <div className="text-sm text-muted-foreground">{user.tests} tests completed</div>
        </div>
        
        <div className="text-right">
          <div className="font-semibold">{user.points.toLocaleString()} pts</div>
          <div className={`text-sm flex items-center gap-1 ${user.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
            <TrendingUp className="h-3 w-3" />
            {user.change}
          </div>
        </div>
      </div>
    ))}
  </div>
);

const Leaderboard = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Leaderboard</h1>
        <p className="text-muted-foreground">See how you rank among Supsindex users</p>
      </div>

      {/* Current User Rank */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="h-5 w-5 text-primary" />
            Your Current Ranking
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-3xl font-bold">#{currentUserRank.rank}</div>
              <div className="text-muted-foreground">out of {currentUserRank.totalUsers.toLocaleString()} users</div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-primary">{currentUserRank.points.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground">Total Points</div>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Top {100 - currentUserRank.percentile}% of users</span>
              <span>{currentUserRank.percentile}%</span>
            </div>
            <Progress value={currentUserRank.percentile} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* Leaderboard Tabs */}
      <Tabs defaultValue="daily" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="daily">Daily</TabsTrigger>
          <TabsTrigger value="weekly">Weekly</TabsTrigger>
          <TabsTrigger value="monthly">Monthly</TabsTrigger>
        </TabsList>

        <TabsContent value="daily">
          <Card>
            <CardHeader>
              <CardTitle>Daily Leaderboard</CardTitle>
              <p className="text-sm text-muted-foreground">Rankings updated every 24 hours</p>
            </CardHeader>
            <CardContent>
              <LeaderboardTable data={mockLeaderboardData.daily} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="weekly">
          <Card>
            <CardHeader>
              <CardTitle>Weekly Leaderboard</CardTitle>
              <p className="text-sm text-muted-foreground">Rankings for this week</p>
            </CardHeader>
            <CardContent>
              <LeaderboardTable data={mockLeaderboardData.weekly} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="monthly">
          <Card>
            <CardHeader>
              <CardTitle>Monthly Leaderboard</CardTitle>
              <p className="text-sm text-muted-foreground">Rankings for this month</p>
            </CardHeader>
            <CardContent>
              <LeaderboardTable data={mockLeaderboardData.monthly} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Leaderboard;