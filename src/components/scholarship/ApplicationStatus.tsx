import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ViewApplicationDetailsDialog } from "./ViewApplicationDetailsDialog";
import { useState } from "react";
import { FileText, Calendar, Eye, Check, Clock, Gift } from "lucide-react";

export function ApplicationStatus() {
  const [selectedApplication, setSelectedApplication] = useState<typeof applications[0] | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [acceptedApplications, setAcceptedApplications] = useState<Set<number>>(new Set());
  const [processingAcceptance, setProcessingAcceptance] = useState<Set<number>>(new Set());

  const applications = [
    {
      id: 1,
      scholarshipType: "General Startup Scholarship",
      requestedTest: "EEA",
      submissionDate: "2024-01-15",
      status: "Under Review" as const,
    },
    {
      id: 2,
      scholarshipType: "Women in Business Grant",
      requestedTest: "FPA",
      submissionDate: "2024-01-10",
      status: "Accepted" as const,
    },
    {
      id: 3,
      scholarshipType: "Student Discount Program",
      requestedTest: "GEB",
      submissionDate: "2024-01-05",
      status: "Rejected" as const,
    },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Under Review":
        return <Badge variant="secondary">Under Review</Badge>;
      case "Accepted":
        return <Badge className="bg-green-100 text-green-800 border-green-200">Accepted</Badge>;
      case "Rejected":
        return <Badge variant="destructive">Rejected</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const handleViewDetails = (application: typeof applications[0]) => {
    setSelectedApplication(application);
    setDialogOpen(true);
  };

  const handleAcceptOffer = (applicationId: number) => {
    setProcessingAcceptance(prev => new Set(prev).add(applicationId));
    // Simulate processing time
    setTimeout(() => {
      setAcceptedApplications(prev => new Set(prev).add(applicationId));
      setProcessingAcceptance(prev => {
        const newSet = new Set(prev);
        newSet.delete(applicationId);
        return newSet;
      });
    }, 1500);
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
                  ID: #{application.id}
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
                  <span className="font-medium">{application.status}</span>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleViewDetails(application)}
                  className="flex items-center gap-2"
                >
                  <Eye className="w-4 h-4" />
                  View Details
                </Button>
                
                {/* Processing Accept Offer button */}
                {processingAcceptance.has(application.id) && (
                  <Button 
                    size="sm"
                    disabled
                    className="flex items-center gap-2 bg-primary/60"
                  >
                    <Clock className="w-4 h-4 animate-spin" />
                    Processing...
                  </Button>
                )}
                
                {/* Accept Offer button */}
                {application.status === "Accepted" && 
                 !acceptedApplications.has(application.id) && 
                 !processingAcceptance.has(application.id) && (
                  <Button 
                    size="sm"
                    onClick={() => handleAcceptOffer(application.id)}
                    className="flex items-center gap-2 hover:scale-105 transition-transform"
                  >
                    <Gift className="w-4 h-4" />
                    Accept Offer
                  </Button>
                )}
                
                {/* Offer Accepted badge */}
                {acceptedApplications.has(application.id) && (
                  <Badge className="bg-green-100 text-green-800 border-green-200 animate-fade-in flex items-center gap-1">
                    <Check className="w-3 h-3" />
                    Offer Accepted ✨
                  </Badge>
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
      
      <ViewApplicationDetailsDialog
        application={selectedApplication}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onAcceptOffer={handleAcceptOffer}
      />
    </Card>
  );
}