import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Trophy, Medal, Award, Star, TrendingUp } from "lucide-react";

// Mock assessment leaderboard data
const mockAssessmentLeaderboards = {
  fpa: [
    { rank: 1, name: "Sarah Johnson", points: 4850, avatar: "", change: "+125", tests: 28 },
    { rank: 2, name: "Mike Chen", points: 4720, avatar: "", change: "+89", tests: 26 },
    { rank: 3, name: "Emily Davis", points: 4680, avatar: "", change: "+156", tests: 25 },
    { rank: 4, name: "Alex Rodriguez", points: 4520, avatar: "", change: "+67", tests: 23 },
    { rank: 5, name: "Lisa Wang", points: 4450, avatar: "", change: "+134", tests: 22 },
    { rank: 6, name: "David Kim", points: 4380, avatar: "", change: "+45", tests: 21 },
    { rank: 7, name: "Jessica Brown", points: 4320, avatar: "", change: "+98", tests: 20 },
    { rank: 8, name: "Chris Wilson", points: 4280, avatar: "", change: "+78", tests: 19 },
  ],
  geb: [
    { rank: 1, name: "Emily Davis", points: 5120, avatar: "", change: "+178", tests: 34 },
    { rank: 2, name: "Lisa Wang", points: 5080, avatar: "", change: "+142", tests: 33 },
    { rank: 3, name: "Sarah Johnson", points: 4950, avatar: "", change: "+115", tests: 31 },
    { rank: 4, name: "Mike Chen", points: 4890, avatar: "", change: "+98", tests: 30 },
    { rank: 5, name: "Alex Rodriguez", points: 4820, avatar: "", change: "+87", tests: 29 },
    { rank: 6, name: "Jessica Brown", points: 4750, avatar: "", change: "+156", tests: 28 },
    { rank: 7, name: "David Kim", points: 4680, avatar: "", change: "+67", tests: 27 },
    { rank: 8, name: "Chris Wilson", points: 4620, avatar: "", change: "+89", tests: 26 },
  ],
  eea: [
    { rank: 1, name: "Alex Rodriguez", points: 5340, avatar: "", change: "+234", tests: 42 },
    { rank: 2, name: "Sarah Johnson", points: 5280, avatar: "", change: "+189", tests: 40 },
    { rank: 3, name: "Mike Chen", points: 5210, avatar: "", change: "+167", tests: 39 },
    { rank: 4, name: "Emily Davis", points: 5150, avatar: "", change: "+145", tests: 38 },
    { rank: 5, name: "Jessica Brown", points: 5090, avatar: "", change: "+198", tests: 37 },
    { rank: 6, name: "Lisa Wang", points: 5020, avatar: "", change: "+123", tests: 36 },
    { rank: 7, name: "David Kim", points: 4960, avatar: "", change: "+156", tests: 35 },
    { rank: 8, name: "Chris Wilson", points: 4890, avatar: "", change: "+134", tests: 34 },
  ]
};

const currentUserAssessmentRanks = { 
  fpa: { rank: 25, totalUsers: 1247, points: 4180, percentile: 98 },
  geb: { rank: 42, totalUsers: 1156, points: 4520, percentile: 97 },
  eea: { rank: 18, totalUsers: 923, points: 5140, percentile: 98 }
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

const LeaderboardTable = ({ data }: { data: typeof mockAssessmentLeaderboards.fpa }) => (
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

      {/* Current User Assessment Rankings */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Trophy className="h-5 w-5 text-primary" />
              FPA Ranking
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center space-y-2">
              <div className="text-2xl font-bold">#{currentUserAssessmentRanks.fpa.rank}</div>
              <div className="text-sm text-muted-foreground">of {currentUserAssessmentRanks.fpa.totalUsers.toLocaleString()}</div>
              <div className="text-lg font-semibold text-primary">{currentUserAssessmentRanks.fpa.points.toLocaleString()} pts</div>
              <Progress value={currentUserAssessmentRanks.fpa.percentile} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Medal className="h-5 w-5 text-primary" />
              GEB Ranking
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center space-y-2">
              <div className="text-2xl font-bold">#{currentUserAssessmentRanks.geb.rank}</div>
              <div className="text-sm text-muted-foreground">of {currentUserAssessmentRanks.geb.totalUsers.toLocaleString()}</div>
              <div className="text-lg font-semibold text-primary">{currentUserAssessmentRanks.geb.points.toLocaleString()} pts</div>
              <Progress value={currentUserAssessmentRanks.geb.percentile} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Award className="h-5 w-5 text-primary" />
              EEA Ranking
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center space-y-2">
              <div className="text-2xl font-bold">#{currentUserAssessmentRanks.eea.rank}</div>
              <div className="text-sm text-muted-foreground">of {currentUserAssessmentRanks.eea.totalUsers.toLocaleString()}</div>
              <div className="text-lg font-semibold text-primary">{currentUserAssessmentRanks.eea.points.toLocaleString()} pts</div>
              <Progress value={currentUserAssessmentRanks.eea.percentile} className="h-2" />
            </div>
          </CardContent>
        </Card>
      </div>

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
              <CardTitle>Financial Performance Assessment (FPA)</CardTitle>
              <p className="text-sm text-muted-foreground">Top performers in financial analysis and planning</p>
            </CardHeader>
            <CardContent>
              <LeaderboardTable data={mockAssessmentLeaderboards.fpa} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="geb">
          <Card>
            <CardHeader>
              <CardTitle>Global Entrepreneurship Bootcamp (GEB)</CardTitle>
              <p className="text-sm text-muted-foreground">Leaders in entrepreneurial skills and business development</p>
            </CardHeader>
            <CardContent>
              <LeaderboardTable data={mockAssessmentLeaderboards.geb} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="eea">
          <Card>
            <CardHeader>
              <CardTitle>Entrepreneurial Excellence Assessment (EEA)</CardTitle>
              <p className="text-sm text-muted-foreground">Excellence in innovation and startup leadership</p>
            </CardHeader>
            <CardContent>
              <LeaderboardTable data={mockAssessmentLeaderboards.eea} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Leaderboard;