import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ViewApplicationDetailsDialog } from "./ViewApplicationDetailsDialog";
import { useState } from "react";
import { FileText, Calendar, Eye, Check, Clock, Gift, Copy } from "lucide-react";
import { useVouchers } from "@/contexts/VoucherContext";
import { useToast } from "@/hooks/use-toast";

export function ApplicationStatus() {
  const { toast } = useToast();
  const { generateVoucher } = useVouchers();
  const [selectedApplication, setSelectedApplication] = useState<typeof applications[0] | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [acceptedApplications, setAcceptedApplications] = useState<Set<number>>(new Set());
  const [processingAcceptance, setProcessingAcceptance] = useState<Set<number>>(new Set());
  const [generatedVouchers, setGeneratedVouchers] = useState<Map<number, string>>(new Map());

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
    const application = applications.find(app => app.id === applicationId);
    if (!application) return;

    setProcessingAcceptance(prev => new Set(prev).add(applicationId));
    
    // Simulate processing time and generate voucher
    setTimeout(() => {
      // Generate voucher using VoucherContext
      const voucherCode = generateVoucher(application.requestedTest, 'scholarship');
      
      // Update state
      setAcceptedApplications(prev => new Set(prev).add(applicationId));
      setGeneratedVouchers(prev => new Map(prev).set(applicationId, voucherCode));
      setProcessingAcceptance(prev => {
        const newSet = new Set(prev);
        newSet.delete(applicationId);
        return newSet;
      });

      // Show success toast
      toast({
        title: "Voucher Generated!",
        description: `Voucher has been added to your profile. Code: ${voucherCode}`,
      });
    }, 1500);
  };

  const copyVoucherCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast({
      title: "Copied!",
      description: "Voucher code copied to clipboard",
    });
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

              {/* Display voucher code after acceptance */}
              {acceptedApplications.has(application.id) && generatedVouchers.has(application.id) && (
                <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg animate-fade-in">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-green-800">Your Voucher Code:</p>
                      <p className="font-mono text-sm bg-white px-2 py-1 border rounded mt-1">
                        {generatedVouchers.get(application.id)}
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyVoucherCode(generatedVouchers.get(application.id)!)}
                      className="flex items-center gap-2 border-green-300 text-green-700 hover:bg-green-100"
                    >
                      <Copy className="w-3 h-3" />
                      Copy
                    </Button>
                  </div>
                  <p className="text-xs text-green-600 mt-2">
                    Use this code when booking your {application.requestedTest} assessment
                  </p>
                </div>
              )}
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