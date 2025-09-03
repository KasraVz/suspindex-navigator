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
    <Card className="h-fit">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-4 pt-4">
        <CardTitle className="text-sm font-medium">Profile Completion</CardTitle>
        <User className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent className="px-4 pb-4">
        <div className="space-y-3">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">{completionPercentage}%</div>
            <Progress value={completionPercentage} className="h-2 mt-2" />
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