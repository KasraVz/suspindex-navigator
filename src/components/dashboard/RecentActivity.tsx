import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const activities = [
  {
    id: 1,
    title: "Test Completed",
    description: "FPA Certification completed successfully",
    time: "2 hours ago",
    type: "success",
  },
  {
    id: 2,
    title: "New Message",
    description: "Community discussion reply",
    time: "4 hours ago",
    type: "info",
  },
  {
    id: 3,
    title: "Profile Updated",
    description: "Contact information updated",
    time: "1 day ago",
    type: "info",
  },
  {
    id: 4,
    title: "Test Scheduled",
    description: "Business Analytics test booked for March 20",
    time: "2 days ago",
    type: "warning",
  },
];

export function RecentActivity() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-start space-x-3">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium">{activity.title}</p>
              <p className="text-xs text-muted-foreground">{activity.description}</p>
              <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
            </div>
            <Badge variant={activity.type === "success" ? "default" : "secondary"}>
              {activity.type}
            </Badge>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}