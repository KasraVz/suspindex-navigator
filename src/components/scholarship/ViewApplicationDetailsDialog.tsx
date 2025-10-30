import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useVouchers } from "@/contexts/VoucherContext";
import { Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

interface Application {
  id: number;
  scholarshipType: string;
  requestedTest: string;
  submissionDate: string;
  status: "Under Review" | "Accepted" | "Rejected" | "KYC Pending" | "Partner Verification" | "Approved";
  applicationType?: "General" | "LDC";
  nationality?: string;
  kycStatus?: string;
  partnerName?: string;
}

interface ViewApplicationDetailsDialogProps {
  application: Application | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAcceptOffer: (applicationId: number) => void;
}

export function ViewApplicationDetailsDialog({ 
  application, 
  open, 
  onOpenChange, 
  onAcceptOffer 
}: ViewApplicationDetailsDialogProps) {
  const { toast } = useToast();
  const { generateVoucher } = useVouchers();
  const [isAccepting, setIsAccepting] = useState(false);
  const [generatedVoucher, setGeneratedVoucher] = useState<string | null>(null);

  if (!application) return null;

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

  const handleAcceptOffer = async () => {
    if (application.status !== "Accepted") return;
    
    setIsAccepting(true);
    
    try {
      // Generate voucher for the specific test type
      const voucherCode = generateVoucher(application.requestedTest, "scholarship");
      setGeneratedVoucher(voucherCode);
      
      // Notify parent component
      onAcceptOffer(application.id);
      
      toast({
        title: "Offer Accepted!",
        description: `Your voucher code for ${application.requestedTest} has been generated.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate voucher. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAccepting(false);
    }
  };

  const copyVoucherCode = () => {
    if (generatedVoucher) {
      navigator.clipboard.writeText(generatedVoucher);
      toast({
        title: "Copied!",
        description: "Voucher code copied to clipboard",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Application Details</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium text-muted-foreground">Application ID:</span>
              <p className="mt-1">#{application.id}</p>
            </div>
            <div>
              <span className="font-medium text-muted-foreground">Status:</span>
              <div className="mt-1">{getStatusBadge(application.status)}</div>
            </div>
          </div>

          <Separator />

          <div className="space-y-3">
            <div>
              <span className="font-medium text-muted-foreground">Scholarship Type:</span>
              <p className="mt-1">{application.scholarshipType}</p>
            </div>
            <div>
              <span className="font-medium text-muted-foreground">Requested Test:</span>
              <p className="mt-1 font-medium">{application.requestedTest}</p>
            </div>
            <div>
              <span className="font-medium text-muted-foreground">Submission Date:</span>
              <p className="mt-1">{application.submissionDate}</p>
            </div>
          </div>

          {application.status === "Accepted" && !generatedVoucher && (
            <>
              <Separator />
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h4 className="font-medium text-green-800 mb-2">Congratulations!</h4>
                <p className="text-sm text-green-700 mb-3">
                  Your scholarship application has been approved. Accept this offer to receive your free test voucher.
                </p>
                <Button 
                  onClick={handleAcceptOffer}
                  disabled={isAccepting}
                  className="w-full"
                >
                  {isAccepting ? "Generating Voucher..." : "Accept Offer"}
                </Button>
              </div>
            </>
          )}

          {generatedVoucher && (
            <>
              <Separator />
              <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                <h4 className="font-medium text-primary mb-2">Your Voucher Code</h4>
                <div className="flex items-center gap-2 p-2 bg-background border rounded">
                  <code className="flex-1 text-sm font-mono">{generatedVoucher}</code>
                  <Button 
                    size="sm" 
                    variant="ghost"
                    onClick={copyVoucherCode}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Use this code at checkout for 100% discount on {application.requestedTest} test.
                </p>
              </div>
            </>
          )}

          {application.status === "Rejected" && (
            <>
              <Separator />
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <h4 className="font-medium text-red-800 mb-2">Application Update</h4>
                <p className="text-sm text-red-700">
                  Unfortunately, your scholarship application was not approved at this time. 
                  You may apply again in the future.
                </p>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}