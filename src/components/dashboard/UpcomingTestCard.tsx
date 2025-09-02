import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CalendarClock, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import { format, parseISO } from "date-fns";

// Simplified upcoming test data with colors
const upcomingTestEvents = [
  {
    id: 1,
    title: "FPA Exam",
    date: "2025-01-15",
    time: "10:30 AM - 12:30 PM",
    bgColor: "bg-brand-orange",
    textColor: "text-brand-orange-foreground"
  },
  {
    id: 2,
    title: "GEB Test",
    date: "2025-01-18",
    time: "2:00 PM - 4:00 PM", 
    bgColor: "bg-destructive",
    textColor: "text-destructive-foreground"
  },
  {
    id: 3,
    title: "EEA Practice",
    date: "2025-01-25",
    time: "9:00 AM - 11:00 AM",
    bgColor: "bg-primary",
    textColor: "text-primary-foreground"
  }
];

const upcomingTests = [
  {
    id: 1,
    testName: "FPA",
    date: "2025-01-15",
    time: "10:30 AM",
    status: "ready"
  },
  {
    id: 2,
    testName: "GEB", 
    date: "2025-01-18",
    time: "2:00 PM",
    status: "scheduled"
  },
  {
    id: 3,
    testName: "EEA",
    date: "2025-01-25",
    time: "9:00 AM",
    status: "scheduled"
  },
];

export function UpcomingTestCard() {
  const hasUpcomingTests = upcomingTests.length > 0;
  const nextTest = upcomingTests[0];
  
  // Calculate pending tasks count
  const pendingTasksCount = 3;

  return (
    <Card className="h-fit border-l-4 border-l-primary shadow-md hover:shadow-lg transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
        <CardTitle className="text-base font-semibold text-primary">Upcoming Tests</CardTitle>
        <CalendarClock className="h-5 w-5 text-primary" />
      </CardHeader>
      <CardContent className="space-y-3">
        {hasUpcomingTests ? (
          <>
            {/* Next Test Summary */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <div className="text-sm font-semibold">{nextTest.testName}</div>
                <Badge variant="secondary" className="text-xs">
                  {nextTest.status === 'ready' ? 'Ready' : 'Scheduled'}
                </Badge>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                <span>{format(parseISO(nextTest.date), 'MMM dd, yyyy')} at {nextTest.time}</span>
              </div>
              {nextTest.status === 'ready' && (
                <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold" size="sm">
                  🚀 Start Test Now
                </Button>
              )}
            </div>

            {/* Pending Tasks Indicator */}
            {pendingTasksCount > 0 && (
              <div className="flex items-center gap-1 p-1 bg-primary-light rounded border border-primary/20">
                <div className="w-1 h-1 bg-primary rounded-full"></div>
                <span className="text-xs text-primary font-medium">
                  {pendingTasksCount} pending
                </span>
              </div>
            )}

            {/* Upcoming Test Events */}
            <div className="space-y-2">
              {upcomingTestEvents.slice(0, 2).map((event) => (
                <div
                  key={event.id}
                  className={`p-2 rounded-lg ${event.bgColor} ${event.textColor}`}
                >
                  <div className="font-medium text-xs">{event.title}</div>
                  <div className="text-xs opacity-90">
                    {format(parseISO(event.date), 'MMM dd, yyyy')} • {event.time}
                  </div>
                </div>
              ))}
            </div>

            {/* Book New Test Button */}
            <Button 
              asChild 
              className="w-full bg-brand-green hover:bg-brand-green/90 text-brand-green-foreground" 
              size="sm"
            >
              <Link to="/dashboard/exams/booked">
                Book a New Test
              </Link>
            </Button>
          </>
        ) : (
          <div className="space-y-2">
            <div className="text-xs text-muted-foreground">
              No upcoming tests scheduled
            </div>
            <Button 
              asChild 
              className="w-full bg-brand-green hover:bg-brand-green/90 text-brand-green-foreground" 
              size="sm"
            >
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