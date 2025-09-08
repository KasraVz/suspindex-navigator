import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Trophy, Medal, Award, Star, TrendingUp, Crown, Zap, Target, Flame } from "lucide-react";

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

// Enhanced mock data with seasonal and all-time rankings
const mockLeaderboardData = {
  seasonal: {
    fpa: [
      { rank: 1, name: "Sarah Johnson", points: 2850, avatar: "", change: "+125", tests: 15, quarter: "Q4" },
      { rank: 2, name: "Mike Chen", points: 2720, avatar: "", change: "+89", tests: 14, quarter: "Q4" },
      { rank: 3, name: "Emily Davis", points: 2680, avatar: "", change: "+156", tests: 13, quarter: "Q3" },
      { rank: 4, name: "Alex Rodriguez", points: 2520, avatar: "", change: "+67", tests: 12, quarter: "Q3" },
      { rank: 5, name: "Lisa Wang", points: 2450, avatar: "", change: "+134", tests: 11, quarter: "Q3" },
      { rank: 6, name: "David Kim", points: 2380, avatar: "", change: "+45", tests: 10, quarter: "Q2" },
      { rank: 7, name: "Jessica Brown", points: 2320, avatar: "", change: "+98", tests: 9, quarter: "Q2" },
      { rank: 8, name: "Chris Wilson", points: 2280, avatar: "", change: "+78", tests: 8, quarter: "Q2" },
    ],
    geb: [
      { rank: 1, name: "Emily Davis", points: 3120, avatar: "", change: "+178", tests: 18, quarter: "Q4" },
      { rank: 2, name: "Lisa Wang", points: 3080, avatar: "", change: "+142", tests: 17, quarter: "Q4" },
      { rank: 3, name: "Sarah Johnson", points: 2950, avatar: "", change: "+115", tests: 16, quarter: "Q3" },
      { rank: 4, name: "Mike Chen", points: 2890, avatar: "", change: "+98", tests: 15, quarter: "Q3" },
      { rank: 5, name: "Alex Rodriguez", points: 2820, avatar: "", change: "+87", tests: 14, quarter: "Q3" },
      { rank: 6, name: "Jessica Brown", points: 2750, avatar: "", change: "+156", tests: 13, quarter: "Q2" },
      { rank: 7, name: "David Kim", points: 2680, avatar: "", change: "+67", tests: 12, quarter: "Q2" },
      { rank: 8, name: "Chris Wilson", points: 2620, avatar: "", change: "+89", tests: 11, quarter: "Q2" },
    ],
    eea: [
      { rank: 1, name: "Alex Rodriguez", points: 3340, avatar: "", change: "+234", tests: 22, quarter: "Q4" },
      { rank: 2, name: "Sarah Johnson", points: 3280, avatar: "", change: "+189", tests: 21, quarter: "Q4" },
      { rank: 3, name: "Mike Chen", points: 3210, avatar: "", change: "+167", tests: 20, quarter: "Q4" },
      { rank: 4, name: "Emily Davis", points: 3150, avatar: "", change: "+145", tests: 19, quarter: "Q3" },
      { rank: 5, name: "Jessica Brown", points: 3090, avatar: "", change: "+198", tests: 18, quarter: "Q3" },
      { rank: 6, name: "Lisa Wang", points: 3020, avatar: "", change: "+123", tests: 17, quarter: "Q3" },
      { rank: 7, name: "David Kim", points: 2960, avatar: "", change: "+156", tests: 16, quarter: "Q2" },
      { rank: 8, name: "Chris Wilson", points: 2890, avatar: "", change: "+134", tests: 15, quarter: "Q2" },
    ]
  },
  allTime: {
    fpa: [
      { rank: 1, name: "Sarah Johnson", points: 14850, avatar: "", change: "+1125", tests: 128, quarter: "Q4" },
      { rank: 2, name: "Mike Chen", points: 14720, avatar: "", change: "+889", tests: 126, quarter: "Q4" },
      { rank: 3, name: "Emily Davis", points: 14680, avatar: "", change: "+1156", tests: 125, quarter: "Q3" },
      { rank: 4, name: "Alex Rodriguez", points: 14520, avatar: "", change: "+667", tests: 123, quarter: "Q3" },
      { rank: 5, name: "Lisa Wang", points: 14450, avatar: "", change: "+1134", tests: 122, quarter: "Q3" },
      { rank: 6, name: "David Kim", points: 14380, avatar: "", change: "+445", tests: 121, quarter: "Q2" },
      { rank: 7, name: "Jessica Brown", points: 14320, avatar: "", change: "+998", tests: 120, quarter: "Q2" },
      { rank: 8, name: "Chris Wilson", points: 14280, avatar: "", change: "+778", tests: 119, quarter: "Q1" },
    ],
    geb: [
      { rank: 1, name: "Emily Davis", points: 15120, avatar: "", change: "+1178", tests: 134, quarter: "Q4" },
      { rank: 2, name: "Lisa Wang", points: 15080, avatar: "", change: "+1142", tests: 133, quarter: "Q4" },
      { rank: 3, name: "Sarah Johnson", points: 14950, avatar: "", change: "+1115", tests: 131, quarter: "Q3" },
      { rank: 4, name: "Mike Chen", points: 14890, avatar: "", change: "+998", tests: 130, quarter: "Q3" },
      { rank: 5, name: "Alex Rodriguez", points: 14820, avatar: "", change: "+887", tests: 129, quarter: "Q3" },
      { rank: 6, name: "Jessica Brown", points: 14750, avatar: "", change: "+1156", tests: 128, quarter: "Q2" },
      { rank: 7, name: "David Kim", points: 14680, avatar: "", change: "+667", tests: 127, quarter: "Q2" },
      { rank: 8, name: "Chris Wilson", points: 14620, avatar: "", change: "+889", tests: 126, quarter: "Q1" },
    ],
    eea: [
      { rank: 1, name: "Alex Rodriguez", points: 16340, avatar: "", change: "+2234", tests: 142, quarter: "Q4" },
      { rank: 2, name: "Sarah Johnson", points: 16280, avatar: "", change: "+1889", tests: 140, quarter: "Q4" },
      { rank: 3, name: "Mike Chen", points: 16210, avatar: "", change: "+1667", tests: 139, quarter: "Q4" },
      { rank: 4, name: "Emily Davis", points: 16150, avatar: "", change: "+1445", tests: 138, quarter: "Q3" },
      { rank: 5, name: "Jessica Brown", points: 16090, avatar: "", change: "+1998", tests: 137, quarter: "Q3" },
      { rank: 6, name: "Lisa Wang", points: 16020, avatar: "", change: "+1223", tests: 136, quarter: "Q3" },
      { rank: 7, name: "David Kim", points: 15960, avatar: "", change: "+1556", tests: 135, quarter: "Q2" },
      { rank: 8, name: "Chris Wilson", points: 15890, avatar: "", change: "+1334", tests: 134, quarter: "Q2" },
    ]
  }
};

const currentUserRanks = {
  seasonal: {
    fpa: { rank: 28, totalUsers: 1247, points: 2180, percentile: 98, quarter: "Q3" },
    geb: { rank: 35, totalUsers: 1156, points: 2320, percentile: 97, quarter: "Q3" },
    eea: { rank: 22, totalUsers: 923, points: 2640, percentile: 98, quarter: "Q3" }
  },
  allTime: {
    fpa: { rank: 25, totalUsers: 1247, points: 11180, percentile: 98, quarter: "Q3" },
    geb: { rank: 42, totalUsers: 1156, points: 10520, percentile: 97, quarter: "Q3" },
    eea: { rank: 18, totalUsers: 923, points: 12140, percentile: 98, quarter: "Q3" }
  }
};

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

const LeaderboardTable = ({ data }: { data: typeof mockLeaderboardData.seasonal.fpa }) => (
  <div className="space-y-3">
    {data.map((user) => {
      const quarterStyle = getQuarterStyle(user.quarter);
      return (
        <div key={user.rank} className={`flex items-center gap-4 p-4 rounded-lg border transition-colors hover:bg-accent/50 ${quarterStyle.bg}`}>
          <div className="flex items-center justify-center w-8">
            {getRankIcon(user.rank)}
          </div>
          
          <Avatar className="h-10 w-10">
            <AvatarImage src={user.avatar} />
            <AvatarFallback>{user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
          </Avatar>
          
          <div className="flex-1">
            <div className="font-medium flex items-center gap-2">
              {user.name}
              {user.quarter === 'Q4' && <span className="text-lg">👑</span>}
            </div>
            <div className="text-sm text-muted-foreground">{user.tests} tests completed</div>
          </div>
          
          <div className="flex items-center gap-3">
            <Badge className={`${quarterStyle.badge} text-xs font-semibold`}>
              {user.quarter === 'Q4' ? 'Legendary' : user.quarter}
            </Badge>
            <div className="text-right">
              <div className="font-semibold">{user.points.toLocaleString()} pts</div>
              <div className={`text-sm flex items-center gap-1 ${user.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                <TrendingUp className="h-3 w-3" />
                {user.change}
              </div>
            </div>
          </div>
        </div>
      );
    })}
  </div>
);

const UserRankingCards = ({ rankData, timeframe }: { rankData: typeof currentUserRanks.seasonal, timeframe: string }) => {
  const quarterStyle = getQuarterStyle(rankData.fpa.quarter);
  
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card className={`${quarterStyle.bg}`}>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Trophy className="h-5 w-5 text-primary" />
            FPA Ranking
            {rankData.fpa.quarter === 'Q4' && <span className="text-lg">👑</span>}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center gap-2">
              <div className="text-2xl font-bold">#{rankData.fpa.rank}</div>
              <Badge className={`${getQuarterStyle(rankData.fpa.quarter).badge} text-xs`}>
                {rankData.fpa.quarter === 'Q4' ? 'Legendary' : rankData.fpa.quarter}
              </Badge>
            </div>
            <div className="text-sm text-muted-foreground">of {rankData.fpa.totalUsers.toLocaleString()}</div>
            <div className="text-lg font-semibold text-primary">{rankData.fpa.points.toLocaleString()} pts</div>
            <Progress value={rankData.fpa.percentile} className="h-2" />
          </div>
        </CardContent>
      </Card>

      <Card className={`${getQuarterStyle(rankData.geb.quarter).bg}`}>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Medal className="h-5 w-5 text-primary" />
            GEB Ranking
            {rankData.geb.quarter === 'Q4' && <span className="text-lg">👑</span>}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center gap-2">
              <div className="text-2xl font-bold">#{rankData.geb.rank}</div>
              <Badge className={`${getQuarterStyle(rankData.geb.quarter).badge} text-xs`}>
                {rankData.geb.quarter === 'Q4' ? 'Legendary' : rankData.geb.quarter}
              </Badge>
            </div>
            <div className="text-sm text-muted-foreground">of {rankData.geb.totalUsers.toLocaleString()}</div>
            <div className="text-lg font-semibold text-primary">{rankData.geb.points.toLocaleString()} pts</div>
            <Progress value={rankData.geb.percentile} className="h-2" />
          </div>
        </CardContent>
      </Card>

      <Card className={`${getQuarterStyle(rankData.eea.quarter).bg}`}>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Award className="h-5 w-5 text-primary" />
            EEA Ranking
            {rankData.eea.quarter === 'Q4' && <span className="text-lg">👑</span>}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center gap-2">
              <div className="text-2xl font-bold">#{rankData.eea.rank}</div>
              <Badge className={`${getQuarterStyle(rankData.eea.quarter).badge} text-xs`}>
                {rankData.eea.quarter === 'Q4' ? 'Legendary' : rankData.eea.quarter}
              </Badge>
            </div>
            <div className="text-sm text-muted-foreground">of {rankData.eea.totalUsers.toLocaleString()}</div>
            <div className="text-lg font-semibold text-primary">{rankData.eea.points.toLocaleString()} pts</div>
            <Progress value={rankData.eea.percentile} className="h-2" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const Leaderboard = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Leaderboard</h1>
        <p className="text-muted-foreground">See how you rank among Supsindex users across seasons and all-time</p>
      </div>

      {/* Main Ranking Type Tabs: Seasonal vs All-Time */}
      <Tabs defaultValue="seasonal" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="seasonal" className="flex items-center gap-2">
            <Flame className="h-4 w-4" />
            Seasonal (90 Days)
          </TabsTrigger>
          <TabsTrigger value="alltime" className="flex items-center gap-2">
            <Crown className="h-4 w-4" />
            All-Time
          </TabsTrigger>
        </TabsList>

        <TabsContent value="seasonal" className="space-y-6">
          {/* Current User Seasonal Rankings */}
          <UserRankingCards rankData={currentUserRanks.seasonal} timeframe="seasonal" />

          {/* Quarter Legend */}
          <Card className="p-4">
            <div className="flex items-center gap-4 justify-center flex-wrap text-sm">
              <div className="flex items-center gap-2">
                <span className="text-lg">👑</span>
                <span className="font-semibold text-purple-700 dark:text-purple-300">Q4 - Legendary</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-lg">🥇</span>
                <span className="font-semibold text-yellow-700 dark:text-yellow-300">Q3 - Gold</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-lg">🥈</span>
                <span className="font-semibold text-gray-700 dark:text-gray-300">Q2 - Silver</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-lg">🥉</span>
                <span className="font-semibold text-amber-700 dark:text-amber-300">Q1 - Bronze</span>
              </div>
            </div>
          </Card>

          {/* Assessment Leaderboard Tabs */}
          <Tabs defaultValue="fpa" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="fpa">FPA</TabsTrigger>
              <TabsTrigger value="geb">GEB</TabsTrigger>
              <TabsTrigger value="eea">EEA</TabsTrigger>
            </TabsList>

            <TabsContent value="fpa">
              <Card>
                <CardHeader>
                  <CardTitle>Financial Performance Assessment (FPA) - Seasonal</CardTitle>
                  <p className="text-sm text-muted-foreground">Top seasonal performers in financial analysis and planning</p>
                </CardHeader>
                <CardContent>
                  <LeaderboardTable data={mockLeaderboardData.seasonal.fpa} />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="geb">
              <Card>
                <CardHeader>
                  <CardTitle>Global Entrepreneurship Bootcamp (GEB) - Seasonal</CardTitle>
                  <p className="text-sm text-muted-foreground">Seasonal leaders in entrepreneurial skills and business development</p>
                </CardHeader>
                <CardContent>
                  <LeaderboardTable data={mockLeaderboardData.seasonal.geb} />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="eea">
              <Card>
                <CardHeader>
                  <CardTitle>Entrepreneurial Excellence Assessment (EEA) - Seasonal</CardTitle>
                  <p className="text-sm text-muted-foreground">Seasonal excellence in innovation and startup leadership</p>
                </CardHeader>
                <CardContent>
                  <LeaderboardTable data={mockLeaderboardData.seasonal.eea} />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </TabsContent>

        <TabsContent value="alltime" className="space-y-6">
          {/* Current User All-Time Rankings */}
          <UserRankingCards rankData={currentUserRanks.allTime} timeframe="all-time" />

          {/* Assessment Leaderboard Tabs */}
          <Tabs defaultValue="fpa" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="fpa">FPA</TabsTrigger>
              <TabsTrigger value="geb">GEB</TabsTrigger>
              <TabsTrigger value="eea">EEA</TabsTrigger>
            </TabsList>

            <TabsContent value="fpa">
              <Card>
                <CardHeader>
                  <CardTitle>Financial Performance Assessment (FPA) - All-Time</CardTitle>
                  <p className="text-sm text-muted-foreground">All-time legends in financial analysis and planning</p>
                </CardHeader>
                <CardContent>
                  <LeaderboardTable data={mockLeaderboardData.allTime.fpa} />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="geb">
              <Card>
                <CardHeader>
                  <CardTitle>Global Entrepreneurship Bootcamp (GEB) - All-Time</CardTitle>
                  <p className="text-sm text-muted-foreground">All-time masters of entrepreneurial skills and business development</p>
                </CardHeader>
                <CardContent>
                  <LeaderboardTable data={mockLeaderboardData.allTime.geb} />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="eea">
              <Card>
                <CardHeader>
                  <CardTitle>Entrepreneurial Excellence Assessment (EEA) - All-Time</CardTitle>
                  <p className="text-sm text-muted-foreground">All-time champions of innovation and startup leadership</p>
                </CardHeader>
                <CardContent>
                  <LeaderboardTable data={mockLeaderboardData.allTime.eea} />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Leaderboard;