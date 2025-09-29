import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Calendar, Eye } from "lucide-react";

export function ApplicationStatus() {
  const applications = [
    {
      id: "APP001",
      scholarshipType: "General Scholarship", 
      requestedTest: "FPA",
      submissionDate: "2024-01-15",
      status: "under-review"
    },
    {
      id: "APP002",
      scholarshipType: "Women Entrepreneurs",
      requestedTest: "EEA", 
      submissionDate: "2024-01-10",
      status: "accepted"
    },
    {
      id: "APP003",
      scholarshipType: "Technology Innovation",
      requestedTest: "Bundle",
      submissionDate: "2024-01-08", 
      status: "rejected"
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "under-review":
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 border-yellow-300">Under Review</Badge>;
      case "accepted":
        return <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-300">Accepted</Badge>;
      case "rejected":
        return <Badge variant="secondary" className="bg-red-100 text-red-800 border-red-300">Rejected</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="w-5 h-5" />
          Application Status
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {applications.map((application) => (
            <div key={application.id} className="border rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <h3 className="font-medium">{application.scholarshipType}</h3>
                  {getStatusBadge(application.status)}
                </div>
                <div className="text-sm text-muted-foreground">
                  ID: {application.id}
                </div>
              </div>
              
              <div className="grid gap-2 md:grid-cols-3">
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-muted-foreground">Test Type:</span>
                  <span className="font-medium">{application.requestedTest}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <span>Submitted: {application.submissionDate}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-muted-foreground">Status:</span>
                  <span className="font-medium capitalize">{application.status.replace('-', ' ')}</span>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex items-center gap-2"
                >
                  <Eye className="w-4 h-4" />
                  View Details
                </Button>
                {application.status === "accepted" && (
                  <Button size="sm" className="flex items-center gap-2">
                    Accept Offer
                  </Button>
                )}
              </div>
            </div>
          ))}

          {applications.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <FileText className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>No applications submitted yet</p>
              <p className="text-sm">Submit a scholarship application to track its status here</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}