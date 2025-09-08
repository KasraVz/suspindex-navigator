import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Calendar, Clock, CreditCard, FileText, Shield, User, CheckCircle, Circle, XCircle } from "lucide-react";
import { UnifiedOrder } from "@/contexts/OrderContext";
import { useNavigate } from "react-router-dom";

interface ViewOrderDetailsDialogProps {
  order: UnifiedOrder | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ViewOrderDetailsDialog({ order, open, onOpenChange }: ViewOrderDetailsDialogProps) {
  const navigate = useNavigate();

  if (!order) return null;

  const handleAction = (action: string) => {
    onOpenChange(false);
    switch (action) {
      case "pay":
        navigate("/dashboard/purchase");
        break;
      case "take_test":
        navigate("/dashboard/exams/take");
        break;
      case "schedule":
        navigate("/dashboard/exams/schedule");
        break;
      case "view_report":
        navigate("/dashboard/reports");
        break;
      case "appeal":
        navigate("/dashboard/support");
        break;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
      case "paid": 
      case "taken":
      case "approved":
        return "default";
      case "waiting_payment":
      case "unpaid":
      case "rejected":
        return "destructive";
      case "waiting_test":
      case "waiting_kyc":
      case "scheduled":
      case "pending":
        return "secondary";
      default:
        return "outline";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getOrderTimeline = () => {
    const timeline = [
      {
        title: "Order Placed",
        date: order.dateAdded || order.datePaid || '',
        completed: true,
        icon: CheckCircle,
        description: `${order.testName} assessment ordered`
      }
    ];

    // Payment step
    if (order.paymentStatus === "paid") {
      timeline.push({
        title: "Payment Completed",
        date: order.datePaid || order.dateAdded || '',
        completed: true,
        icon: CheckCircle,
        description: `$${order.amount} payment processed`
      });
    } else {
      timeline.push({
        title: "Payment Pending",
        date: "",
        completed: false,
        icon: Circle,
        description: "Payment required to proceed"
      });
    }

    // Test step
    if (order.testStatus === "completed") {
      timeline.push({
        title: "Test Completed",
        date: order.dateAdded || '',
        completed: true,
        icon: CheckCircle,
        description: "Assessment successfully completed"
      });
    } else if (order.bookingDate) {
      timeline.push({
        title: "Test Scheduled",
        date: order.bookingDate?.toISOString().split('T')[0] || "",
        completed: false,
        icon: Circle,
        description: order.bookingTime ? `Scheduled for ${order.bookingTime}` : "Test scheduled"
      });
    } else {
      timeline.push({
        title: "Test Pending",
        date: "",
        completed: false,
        icon: Circle,
        description: "Test needs to be taken"
      });
    }

    // KYC step
    if (order.kycStatus === "approved") {
      timeline.push({
        title: "KYC Approved",
        date: order.dateAdded || '',
        completed: true,
        icon: CheckCircle,
        description: "Identity verification approved"
      });
    } else if (order.kycStatus === "rejected") {
      timeline.push({
        title: "KYC Rejected",
        date: order.dateAdded || '',
        completed: false,
        icon: XCircle,
        description: "Identity verification rejected"
      });
    } else {
      timeline.push({
        title: "KYC Pending",
        date: "",
        completed: false,
        icon: Circle,
        description: "Identity verification required"
      });
    }

    return timeline;
  };

  const getNextSteps = () => {
    switch (order.overallStatus) {
      case "pending_payment":
        return [
          "Complete payment to proceed",
          "You can still take the test without payment",
          "KYC verification will begin after test completion"
        ];
      case "ready_to_take":
        return [
          "Take your scheduled test",
          order.bookingDate ? `Scheduled for ${formatDate(order.bookingDate.toISOString())} at ${order.bookingTime}` : "Schedule your test if needed",
          "KYC verification will begin after test completion"
        ];
      case "pending_kyc":
        return [
          "KYC documents are being reviewed",
          "Review typically takes 2-3 business days",
          "You'll be notified once approved or if additional documents are needed"
        ];
      case "completed":
        return [
          "Order completed successfully!",
          "Your certificate is available for download",
          "Results can be viewed in the Reports section"
        ];
      default:
        return [];
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Order Details - {order.orderId}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Order Overview */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">Test Information</h3>
              <p className="text-lg font-semibold mt-1">{order.testName}</p>
              <p className="text-sm text-muted-foreground">Order placed on {formatDate(order.dateAdded || order.datePaid || '')}</p>
            </div>
            <div>
              <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">Amount</h3>
              <p className="text-lg font-semibold mt-1">${order.amount}</p>
              <Badge variant={getStatusColor(order.overallStatus)} className="mt-1">
                {order.overallStatus.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </Badge>
            </div>
          </div>

          <Separator />

          {/* Status Breakdown */}
          <div>
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Status Breakdown
            </h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-3 rounded-lg border">
                <CreditCard className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm font-medium">Payment</p>
                <Badge variant={getStatusColor(order.paymentStatus)} className="mt-1">
                  {order.paymentStatus === "paid" ? "Paid" : "Unpaid"}
                </Badge>
              </div>
              <div className="text-center p-3 rounded-lg border">
                <FileText className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm font-medium">Test</p>
                <Badge variant={getStatusColor(order.testStatus)} className="mt-1">
                  {order.testStatus === "completed" ? "Completed" : 
                   order.testStatus === "in_progress" ? "In Progress" : "Not Taken"}
                </Badge>
              </div>
              <div className="text-center p-3 rounded-lg border">
                <User className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm font-medium">KYC</p>
                <Badge variant={getStatusColor(order.kycStatus)} className="mt-1">
                  {order.kycStatus === "approved" ? "Approved" : 
                   order.kycStatus === "rejected" ? "Rejected" : "Pending"}
                </Badge>
              </div>
            </div>
          </div>

          {/* Booking Information */}
          {order.bookingDate && (
            <>
              <Separator />
              <div>
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Booking Information
                </h3>
                <div className="flex items-center gap-4 p-3 bg-muted rounded-lg">
                  <Calendar className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">{formatDate(order.bookingDate.toISOString())}</p>
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {order.bookingTime}
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Order Timeline */}
          <Separator />
          <div>
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Order Timeline
            </h3>
            <div className="space-y-4">
              {getOrderTimeline().map((item, index) => {
                const IconComponent = item.icon;
                return (
                  <div key={index} className="flex items-start gap-3">
                    <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                      item.completed 
                        ? item.icon === XCircle 
                          ? "bg-destructive text-destructive-foreground" 
                          : "bg-success text-success-foreground"
                        : "bg-muted text-muted-foreground"
                    }`}>
                      <IconComponent className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="font-medium text-sm">{item.title}</p>
                        {item.date && (
                          <p className="text-xs text-muted-foreground">
                            {formatDate(item.date)}
                          </p>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Next Steps */}
          <Separator />
          <div>
            <h3 className="font-semibold mb-3">Next Steps</h3>
            <ul className="space-y-2">
              {getNextSteps().map((step, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="flex-shrink-0 w-5 h-5 bg-primary text-primary-foreground rounded-full text-xs flex items-center justify-center mt-0.5">
                    {index + 1}
                  </span>
                  <span className="text-sm">{step}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Available Actions */}
          <Separator />
          <div>
            <h3 className="font-semibold mb-3">Available Actions</h3>
            <div className="flex flex-wrap gap-2">
              {order.overallStatus === "pending_payment" && (
                <>
                  <Button onClick={() => handleAction("pay")} className="flex items-center gap-2">
                    <CreditCard className="h-4 w-4" />
                    Pay Now
                  </Button>
                  <Button variant="outline" onClick={() => handleAction("take_test")} className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Take Test
                  </Button>
                </>
              )}
              {order.overallStatus === "ready_to_take" && (
                <>
                  <Button onClick={() => handleAction("take_test")} className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Take Test
                  </Button>
                  {!order.bookingDate && (
                    <Button variant="outline" onClick={() => handleAction("schedule")} className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      Schedule Test
                    </Button>
                  )}
                </>
              )}
              {order.overallStatus === "completed" && (
                <Button onClick={() => handleAction("view_report")} className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  View Report
                </Button>
              )}
              {order.overallStatus === "pending_kyc" && (
                <p className="text-sm text-muted-foreground py-2">
                  No actions required at this time. KYC review is in progress.
                </p>
              )}
            </div>
          </div>

        </div>
      </DialogContent>
    </Dialog>
  );
}