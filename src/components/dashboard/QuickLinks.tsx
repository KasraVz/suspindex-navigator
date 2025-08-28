import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { BookOpen, FileText, Users } from "lucide-react";

export function QuickLinks() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4 md:grid-cols-3">
        <Button asChild className="h-20 flex-col gap-2 bg-brand-orange hover:bg-brand-orange/90 text-white">
          <Link to="/dashboard/exams/booked">
            <BookOpen className="h-6 w-6" />
            Book a Test
          </Link>
        </Button>

        <Button asChild variant="outline" className="h-20 flex-col gap-2 border-brand-green text-brand-green hover:bg-brand-green hover:text-white">
          <Link to="/dashboard/reports">
            <FileText className="h-6 w-6" />
            View Reports
          </Link>
        </Button>

        <Button asChild variant="outline" className="h-20 flex-col gap-2 border-brand-gold text-brand-gold hover:bg-brand-gold hover:text-white">
          <Link to="/dashboard/community">
            <Users className="h-6 w-6" />
            Community Hub
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}