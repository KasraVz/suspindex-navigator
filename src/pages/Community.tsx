import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, MessageCircle, Calendar, Award } from "lucide-react";

const Community = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">SupsHub</h1>
        <p className="text-muted-foreground">Connect with other startup founders and partners</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Members</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,234</div>
            <p className="text-xs text-muted-foreground">+12% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Discussions</CardTitle>
            <MessageCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">89</div>
            <p className="text-xs text-muted-foreground">Active threads</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Events</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <p className="text-xs text-muted-foreground">Upcoming this week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Top Contributors</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">25</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Discussions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">Startup Funding Strategies</p>
                <p className="text-xs text-muted-foreground">Started by Alex Johnson • 2 replies</p>
              </div>
              <Button variant="ghost" size="sm">View</Button>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">Tech Stack Decisions</p>
                <p className="text-xs text-muted-foreground">Started by Sarah Chen • 8 replies</p>
              </div>
              <Button variant="ghost" size="sm">View</Button>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">Market Research Tips</p>
                <p className="text-xs text-muted-foreground">Started by Mike Rodriguez • 5 replies</p>
              </div>
              <Button variant="ghost" size="sm">View</Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Upcoming Events</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">Startup Pitch Workshop</p>
                <p className="text-xs text-muted-foreground">March 15, 2024 • 2:00 PM EST</p>
              </div>
              <Button size="sm">Join</Button>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">Networking Mixer</p>
                <p className="text-xs text-muted-foreground">March 18, 2024 • 6:00 PM EST</p>
              </div>
              <Button size="sm">Register</Button>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">Funding Roundtable</p>
                <p className="text-xs text-muted-foreground">March 22, 2024 • 10:00 AM EST</p>
              </div>
              <Button size="sm">RSVP</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Community;