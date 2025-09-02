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
        <div className="space-y-3">
          <div className="space-y-2">
            <div className="text-2xl font-bold">{completionPercentage}%</div>
            <Progress value={completionPercentage} className="h-2" />
            <p className="text-xs text-muted-foreground">
              Your profile is {completionPercentage}% complete
            </p>
          </div>
          <Button asChild variant="outline" className="w-full" size="sm">
            <Link to="/dashboard/profile">
              Complete your Profile
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}