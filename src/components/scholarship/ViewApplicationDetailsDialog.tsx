import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, FileText, User, Target } from "lucide-react";

interface Application {
  id: string;
  scholarshipType: string;
  requestedTest: string;
  submissionDate: string;
  status: string;
}

interface ViewApplicationDetailsDialogProps {
  application: Application | null;
  isOpen: boolean;
  onClose: () => void;
  onAcceptOffer?: (application: Application) => void;
}

export function ViewApplicationDetailsDialog({ 
  application, 
  isOpen, 
  onClose, 
  onAcceptOffer 
}: ViewApplicationDetailsDialogProps) {
  if (!application) return null;

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

  const getStatusDescription = (status: string) => {
    switch (status) {
      case "under-review":
        return "Your application is currently being reviewed by our scholarship committee. We'll notify you once a decision is made.";
      case "accepted":
        return "Congratulations! Your scholarship application has been accepted. You can now claim your voucher code for a free assessment.";
      case "rejected":
        return "Unfortunately, your scholarship application was not approved this time. You may reapply in the future or explore other scholarship opportunities.";
      default:
        return "Status unknown.";
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Application Details
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Application Overview */}
          <div className="bg-secondary/50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">{application.scholarshipType}</h3>
              {getStatusBadge(application.status)}
            </div>
            
            <div className="grid gap-3 md:grid-cols-2">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm">Application ID: {application.id}</span>
              </div>
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm">Test Type: {application.requestedTest}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm">Submitted: {application.submissionDate}</span>
              </div>
            </div>
          </div>

          {/* Status Information */}
          <div>
            <h4 className="font-medium mb-2">Status Information</h4>
            <p className="text-sm text-muted-foreground">
              {getStatusDescription(application.status)}
            </p>
          </div>

          {/* Scholarship Details */}
          <div>
            <h4 className="font-medium mb-2">Scholarship Details</h4>
            <div className="text-sm text-muted-foreground space-y-1">
              <p>• Full assessment fee coverage</p>
              <p>• Valid for {application.requestedTest} assessment</p>
              <p>• One-time use voucher code</p>
              <p>• Valid for 6 months from acceptance date</p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Close
            </Button>
            
            {application.status === "accepted" && onAcceptOffer && (
              <Button onClick={() => onAcceptOffer(application)} className="flex-1">
                Accept Offer & Generate Code
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}