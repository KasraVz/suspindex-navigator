import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CalendarClock, Clock, ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, isSameDay, isSameMonth, addMonths, subMonths, parseISO, isWithinInterval, differenceInDays, isBefore, isAfter } from "date-fns";
import { cn } from "@/lib/utils";

// Enhanced mock data with multi-day events and better structure
const calendarEvents = [
  {
    id: 1,
    title: "FPA Exam Prep",
    startDate: "2025-01-13",
    endDate: "2025-01-15",
    startTime: "9:00 AM",
    endTime: "5:00 PM",
    color: "bg-blue-500",
    textColor: "text-white",
    type: "preparation"
  },
  {
    id: 2,
    title: "GEB Test",
    startDate: "2025-01-18",
    endDate: "2025-01-18",
    startTime: "2:00 PM",
    endTime: "4:00 PM",
    color: "bg-orange-500",
    textColor: "text-white",
    type: "exam"
  },
  {
    id: 3,
    title: "Study Session",
    startDate: "2025-01-20",
    endDate: "2025-01-22",
    startTime: "10:00 AM",
    endTime: "12:00 PM",
    color: "bg-green-500",
    textColor: "text-white",
    type: "study"
  },
  {
    id: 4,
    title: "EEA Practice",
    startDate: "2025-01-25",
    endDate: "2025-01-25",
    startTime: "9:00 AM",
    endTime: "11:00 AM",
    color: "bg-purple-500",
    textColor: "text-white",
    type: "practice"
  },
  {
    id: 5,
    title: "Review Week",
    startDate: "2025-01-27",
    endDate: "2025-01-31",
    startTime: "All Day",
    endTime: "",
    color: "bg-pink-500",
    textColor: "text-white",
    type: "review"
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
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const hasUpcomingTests = upcomingTests.length > 0;
  const nextTest = upcomingTests[0];
  
  // Calculate pending tasks count
  const pendingTasksCount = calendarEvents.filter(event => 
    event.type === 'preparation' || event.type === 'study'
  ).length;

  // Generate calendar dates
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const dateFormat = "d";
  const rows = [];
  let days = [];
  let day = startDate;
  let formattedDate = "";

  // Get events for a specific date
  const getEventsForDate = (date: Date) => {
    return calendarEvents.filter(event => {
      const eventStart = parseISO(event.startDate);
      const eventEnd = parseISO(event.endDate);
      return isWithinInterval(date, { start: eventStart, end: eventEnd });
    });
  };

  // Get event block properties for rendering
  const getEventBlockProps = (event: any, date: Date) => {
    const eventStart = parseISO(event.startDate);
    const eventEnd = parseISO(event.endDate);
    const isFirstDay = isSameDay(date, eventStart);
    const isLastDay = isSameDay(date, eventEnd);
    const isMiddleDay = !isFirstDay && !isLastDay;
    
    return {
      isFirstDay,
      isLastDay,
      isMiddleDay,
      showTitle: isFirstDay,
      roundedLeft: isFirstDay,
      roundedRight: isLastDay || isSameDay(eventStart, eventEnd)
    };
  };

  // Build calendar rows
  while (day <= endDate) {
    for (let i = 0; i < 7; i++) {
      formattedDate = format(day, dateFormat);
      const cloneDay = day;
      const dayEvents = getEventsForDate(cloneDay);
      const isCurrentMonth = isSameMonth(day, monthStart);
      const isToday = isSameDay(day, new Date());
      const isSelected = selectedDate && isSameDay(day, selectedDate);

      days.push(
        <div
          key={day.toString()}
          className={cn(
            "relative h-20 border-r border-b border-border/20 cursor-pointer transition-colors",
            !isCurrentMonth && "bg-muted/20 text-muted-foreground/50",
            isSelected && "bg-primary/10",
            "hover:bg-accent/50"
          )}
          onClick={() => setSelectedDate(cloneDay)}
        >
          {/* Date number */}
          <div className={cn(
            "absolute top-1 left-1 text-xs font-medium w-5 h-5 rounded-full flex items-center justify-center",
            isToday && "bg-primary text-primary-foreground",
            !isCurrentMonth && "text-muted-foreground/50"
          )}>
            {formattedDate}
          </div>

          {/* Event blocks */}
          <div className="absolute top-6 left-0 right-0 bottom-0 px-1 space-y-0.5 overflow-hidden">
            {dayEvents.slice(0, 2).map((event, index) => {
              const blockProps = getEventBlockProps(event, cloneDay);
              return (
                <div
                  key={`${event.id}-${cloneDay.toString()}`}
                  className={cn(
                    "text-[9px] px-1.5 py-0.5 font-medium leading-tight truncate",
                    event.color,
                    event.textColor,
                    blockProps.roundedLeft && "rounded-l-sm",
                    blockProps.roundedRight && "rounded-r-sm",
                    !blockProps.roundedLeft && !blockProps.roundedRight && "rounded-none"
                  )}
                  title={`${event.title} (${event.startTime}${event.endTime ? ` - ${event.endTime}` : ''})`}
                >
                  {blockProps.showTitle ? event.title : ''}
                </div>
              );
            })}
            {dayEvents.length > 2 && (
              <div className="text-[8px] text-muted-foreground font-medium px-1">
                +{dayEvents.length - 2} more
              </div>
            )}
          </div>
        </div>
      );
      day = addDays(day, 1);
    }
    rows.push(
      <div key={day.toString()} className="grid grid-cols-7">
        {days}
      </div>
    );
    days = [];
  }

  const onDateClick = (day: Date) => {
    setSelectedDate(day);
  };

  const nextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  const prevMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
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

            {/* Pending Tasks Indicator */}
            {pendingTasksCount > 0 && (
              <div className="flex items-center gap-2 p-2 bg-blue-50 rounded-lg border border-blue-200">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-xs text-blue-700 font-medium">
                  {pendingTasksCount} pending tasks
                </span>
              </div>
            )}

            {/* Google Calendar Widget */}
            <div className="border rounded-lg bg-background overflow-hidden">
              {/* Calendar Header */}
              <div className="flex items-center justify-between p-3 border-b">
                <button
                  onClick={prevMonth}
                  className="p-1 hover:bg-accent rounded"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <h3 className="text-sm font-semibold">
                  {format(currentMonth, 'MMMM yyyy')}
                </h3>
                <button
                  onClick={nextMonth}
                  className="p-1 hover:bg-accent rounded"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>

              {/* Day Headers */}
              <div className="grid grid-cols-7 border-b">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                  <div key={day} className="p-2 text-center text-xs font-medium text-muted-foreground border-r last:border-r-0">
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar Grid */}
              <div className="bg-background">
                {rows}
              </div>
            </div>

            {/* Book New Test Button */}
            <Button 
              asChild 
              className="w-full bg-green-600 hover:bg-green-700 text-white" 
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
              className="w-full bg-green-600 hover:bg-green-700 text-white" 
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