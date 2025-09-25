import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { GraduationCap, Calendar, Award } from "lucide-react";
import { ScholarshipApplicationDialog } from "./ScholarshipApplicationDialog";

const scholarships = [
  {
    id: 1,
    title: "Startup Innovation Scholarship",
    description: "Support for innovative startup founders in their certification journey",
    testType: "FPA",
    deadline: "March 31, 2024",
    status: "Open",
    requirements: ["Active startup registration", "Less than 2 years operation", "Tech-based business"],
  },
  {
    id: 2,
    title: "Women Entrepreneurs Grant",
    description: "Empowering women in business through professional development",
    testType: "EEA",
    deadline: "April 15, 2024",
    status: "Open",
    requirements: ["Female founder", "Business plan submission", "Leadership potential"],
  },
  {
    id: 3,
    title: "Social Impact Fellowship",
    description: "For startups focused on social and environmental impact",
    testType: "GEB",
    deadline: "February 28, 2024",
    status: "Closing Soon",
    requirements: ["Social impact mission", "Community involvement", "Sustainability focus"],
  },
  {
    id: 4,
    title: "Tech Innovation Bundle",
    description: "Comprehensive assessment package for technology startups",
    testType: "Bundle of 3",
    deadline: "May 15, 2024",
    status: "Open",
    requirements: ["Technology startup", "Product in development", "Growth potential"],
  },
];

export function GeneralScholarship() {
  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
        {scholarships.map((scholarship) => (
          <Card key={scholarship.id} className="h-fit">
            <CardHeader>
              <div className="flex items-center justify-between">
                <GraduationCap className="w-6 h-6 text-primary" />
                <Badge variant={scholarship.status === "Open" ? "default" : "destructive"}>
                  {scholarship.status}
                </Badge>
              </div>
              <CardTitle className="text-lg">{scholarship.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">{scholarship.description}</p>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-primary" />
                  <span className="font-bold text-primary">{scholarship.testType}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">{scholarship.deadline}</span>
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium mb-2">Requirements:</h4>
                <ul className="text-xs text-muted-foreground space-y-1">
                  {scholarship.requirements.map((req, index) => (
                    <li key={index}>• {req}</li>
                  ))}
                </ul>
              </div>
              
              <ScholarshipApplicationDialog scholarship={scholarship}>
                <Button 
                  className="w-full bg-brand-green hover:bg-brand-green/90 text-white" 
                  disabled={scholarship.status === "Closing Soon"}
                >
                  Apply Now
                </Button>
              </ScholarshipApplicationDialog>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}