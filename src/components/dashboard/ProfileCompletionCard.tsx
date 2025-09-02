import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { User } from "lucide-react";
import { Link } from "react-router-dom";

interface ProfileCompletionCardProps {
  completionPercentage: number;
}

export function ProfileCompletionCard({ completionPercentage }: ProfileCompletionCardProps) {
  if (completionPercentage >= 100) {
    return null; // Don't render if profile is complete
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Profile Completion</CardTitle>
        <User className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="space-y-1">
            <div className="text-xl font-bold">{completionPercentage}%</div>
            <Progress value={completionPercentage} className="h-1" />
            <p className="text-xs text-muted-foreground">
              {completionPercentage}% complete
            </p>
          </div>
          <Button asChild variant="outline" className="w-full" size="sm">
            <Link to="/dashboard/profile">
              Complete Profile
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}