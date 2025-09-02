import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarClock } from "lucide-react";
import { Link } from "react-router-dom";

// Mock data for upcoming test
const upcomingTest = {
  testName: "FPA",
  date: "September 25, 2025",
  time: "10:30 AM",
};

export function UpcomingTestCard() {
  const hasUpcomingTest = true; // This would come from actual data/state

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Upcoming Test</CardTitle>
        <CalendarClock className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        {hasUpcomingTest ? (
          <div className="space-y-3">
            <div className="space-y-1">
              <div className="text-2xl font-bold">{upcomingTest.testName}</div>
              <p className="text-sm text-muted-foreground">{upcomingTest.date}</p>
              <p className="text-sm font-medium">{upcomingTest.time}</p>
            </div>
            <Button className="w-full" size="sm">
              Start Test
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="text-sm text-muted-foreground">
              No upcoming tests scheduled
            </div>
            <Button asChild className="w-full" size="sm">
              <Link to="/dashboard/exams/booked">
                Book a Test Now!
              </Link>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}