import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Award } from "lucide-react";
import { Link } from "react-router-dom";

// Mock data for recent certifications
const recentCertifications = [
  {
    id: "CERT001",
    testName: "FPA",
    status: "Valid",
    expiryDate: "2025-01-10",
  },
  {
    id: "CERT002", 
    testName: "GEB",
    status: "Valid",
    expiryDate: "2025-01-05",
  },
  {
    id: "CERT003",
    testName: "EEA", 
    status: "Expired",
    expiryDate: "2023-10-15",
  },
];

export function CertificationSummaryCard() {
  // Get the 2 most recent certifications
  const latestCertifications = recentCertifications.slice(0, 2);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Latest Certificates</CardTitle>
        <Award className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {latestCertifications.map((cert) => (
            <div key={cert.id} className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium">{cert.testName}</p>
                <p className="text-xs text-muted-foreground">
                  Expires: {new Date(cert.expiryDate).toLocaleDateString()}
                </p>
              </div>
              <Badge 
                variant={cert.status === "Valid" ? "default" : "secondary"}
                className={cert.status === "Valid" ? "bg-brand-green text-white" : ""}
              >
                {cert.status}
              </Badge>
            </div>
          ))}
        </div>
        <Button asChild variant="outline" className="w-full mt-3" size="sm">
          <Link to="/dashboard/certifications">
            View All Certificates
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}