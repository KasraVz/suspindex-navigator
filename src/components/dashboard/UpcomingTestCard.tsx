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
            <div className="border rounded-lg p-3 bg-background">
              <div className="mb-3">
                <h3 className="text-sm font-semibold text-center">
                  {format(selectedDate || new Date(), 'MMMM yyyy').toUpperCase()}
                </h3>
              </div>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                className="p-0 w-full [&_.rdp-table]:w-full [&_.rdp-cell]:p-0 pointer-events-auto"
                classNames={{
                  head_cell: "text-[10px] font-medium text-muted-foreground w-8 h-6",
                  cell: "relative h-8 w-8 p-0 text-center text-[11px]",
                  day: "h-8 w-8 p-0 font-normal hover:bg-accent hover:text-accent-foreground text-[11px]",
                  day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground",
                  day_today: "bg-accent text-accent-foreground font-medium",
                  day_outside: "text-muted-foreground opacity-50",
                }}
                components={{
                  Day: ({ date, ...props }) => {
                    const dayTests = upcomingTests.filter(test => isSameDay(parseISO(test.date), date));
                    const hasTests = dayTests.length > 0;
                    
                    return (
                      <div className="relative h-8 w-8">
                        <button
                          {...props}
                          className={cn(
                            "h-8 w-8 p-0 font-normal hover:bg-accent hover:text-accent-foreground text-[11px] relative z-10",
                            hasTests && "font-medium"
                          )}
                        />
                        {hasTests && (
                          <div className="absolute inset-0 z-0">
                            {dayTests.map((test, index) => (
                              <div
                                key={test.id}
                                className={cn(
                                  "absolute text-[8px] px-1 py-0.5 rounded text-white font-medium leading-none",
                                  test.testName === 'FPA' && "bg-blue-500",
                                  test.testName === 'GEB' && "bg-brand-orange",
                                  test.testName === 'EEA' && "bg-red-500",
                                  index === 0 && "top-0 left-0 right-0",
                                  index === 1 && "bottom-0 left-0 right-0"
                                )}
                                style={{
                                  fontSize: '7px',
                                  lineHeight: '8px'
                                }}
                              >
                                {test.testName}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  }
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