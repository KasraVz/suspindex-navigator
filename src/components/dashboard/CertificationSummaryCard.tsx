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
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
        <CardTitle className="text-sm font-medium">Latest Certificates</CardTitle>
        <Award className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {latestCertifications.map((cert) => (
            <div key={cert.id} className="flex items-center gap-3 p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors overflow-hidden">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <Award className={`h-5 w-5 ${cert.status === "Valid" ? "text-green-600" : "text-muted-foreground"}`} />
              </div>
              <div className="flex-1 min-w-0 overflow-hidden">
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-sm font-semibold truncate flex-1">{cert.testName} Certificate</p>
                  <Badge 
                    variant={cert.status === "Valid" ? "default" : "secondary"}
                    className={`shrink-0 text-xs ${cert.status === "Valid" ? "bg-green-600 hover:bg-green-700" : ""}`}
                  >
                    <span className="hidden sm:inline">{cert.status === "Valid" ? "✓ Valid" : "⚠ Expired"}</span>
                    <span className="sm:hidden">{cert.status === "Valid" ? "✓" : "⚠"}</span>
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground truncate">
                  {cert.status === "Valid" ? "Expires" : "Expired"}: {new Date(cert.expiryDate).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
          <Button asChild variant="outline" className="w-full" size="sm">
            <Link to="/dashboard/certifications">
              🏆 View All Certificates
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}