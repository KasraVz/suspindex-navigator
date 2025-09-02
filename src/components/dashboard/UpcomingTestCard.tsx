import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { CalendarClock, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { format, isSameDay, parseISO } from "date-fns";
import { cn } from "@/lib/utils";

// Mock data for upcoming tests
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
    date: "2025-01-22",
    time: "9:00 AM",
    status: "scheduled"
  },
];

export function UpcomingTestCard() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const hasUpcomingTests = upcomingTests.length > 0;
  const nextTest = upcomingTests[0]; // Assuming sorted by date
  
  // Get tests for selected date
  const selectedDateTests = selectedDate 
    ? upcomingTests.filter(test => isSameDay(parseISO(test.date), selectedDate))
    : [];

  // Get all test dates for highlighting
  const testDates = upcomingTests.map(test => parseISO(test.date));

  const isTestDate = (date: Date) => {
    return testDates.some(testDate => isSameDay(testDate, date));
  };

  return (
    <Card className="h-fit">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
        <CardTitle className="text-sm font-medium">Upcoming Tests</CardTitle>
        <CalendarClock className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent className="space-y-4">
        {hasUpcomingTests ? (
          <>
            {/* Next Test Summary */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="text-lg font-semibold">{nextTest.testName}</div>
                <Badge variant="secondary" className="text-xs">
                  {nextTest.status === 'ready' ? 'Ready' : 'Scheduled'}
                </Badge>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-3 w-3" />
                <span>{format(parseISO(nextTest.date), 'MMM dd, yyyy')} at {nextTest.time}</span>
              </div>
              {nextTest.status === 'ready' && (
                <Button className="w-full" size="sm">
                  Start Test
                </Button>
              )}
            </div>

            {/* Mini Calendar Widget */}
            <div className="border rounded-lg p-2 bg-muted/30">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                className={cn("p-0 [&_.rdp-cell]:h-8 [&_.rdp-cell]:w-8 [&_.rdp-day]:h-7 [&_.rdp-day]:w-7 [&_.rdp-day]:text-xs pointer-events-auto")}
                modifiers={{
                  testDate: testDates
                }}
                modifiersClassNames={{
                  testDate: "bg-brand-green/20 text-brand-green font-medium hover:bg-brand-green/30 relative after:absolute after:bottom-0.5 after:left-1/2 after:transform after:-translate-x-1/2 after:w-1 after:h-1 after:bg-brand-green after:rounded-full"
                }}
                disabled={(date) => date < new Date()}
              />
              
              {/* Selected Date Tests */}
              {selectedDateTests.length > 0 && (
                <div className="mt-2 p-2 bg-background rounded border">
                  <div className="text-xs font-medium text-muted-foreground mb-1">
                    {format(selectedDate!, 'MMM dd')} Tests:
                  </div>
                  {selectedDateTests.map(test => (
                    <div key={test.id} className="flex justify-between items-center text-xs">
                      <span className="font-medium">{test.testName}</span>
                      <span className="text-muted-foreground">{test.time}</span>
                    </div>
                  ))}
                </div>
              )}
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
          <div className="space-y-3">
            <div className="text-sm text-muted-foreground">
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