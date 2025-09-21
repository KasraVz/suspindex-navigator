import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Calendar, Clock, CreditCard, FileText, Shield, User, CheckCircle, Circle, XCircle, Trash2 } from "lucide-react";
import { UnifiedOrder } from "./UnifiedOrdersTable";
import { useNavigate } from "react-router-dom";
import { useOrders } from "@/contexts/OrderContext";
import { toast } from "sonner";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useState } from "react";

interface ViewOrderDetailsDialogProps {
  order: UnifiedOrder | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ViewOrderDetailsDialog({ order, open, onOpenChange }: ViewOrderDetailsDialogProps) {
  const navigate = useNavigate();
  const { removeOrder, canRemoveOrder } = useOrders();
  const [showRemoveDialog, setShowRemoveDialog] = useState(false);

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

  const handleRemoveOrder = () => {
    if (order && removeOrder(order.id)) {
      toast.success(`Order ${order.orderId} removed successfully`);
      onOpenChange(false);
    } else {
      toast.error("Failed to remove order. Order may be paid or test already taken.");
    }
    setShowRemoveDialog(false);
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
        date: order.orderDate,
        completed: true,
        icon: CheckCircle,
        description: `${order.testName} assessment ordered`
      }
    ];

    // Payment step
    if (order.paymentStatus === "paid") {
      timeline.push({
        title: "Payment Completed",
        date: order.orderDate, // Assuming payment was on same day for mock data
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
    if (order.testStatus === "taken" && order.testTakenDate) {
      timeline.push({
        title: "Test Completed",
        date: order.testTakenDate,
        completed: true,
        icon: CheckCircle,
        description: "Assessment successfully completed"
      });
    } else if (order.testStatus === "scheduled") {
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
        date: order.kycSubmissionDate || "",
        completed: true,
        icon: CheckCircle,
        description: "Identity verification approved"
      });
    } else if (order.kycStatus === "rejected") {
      timeline.push({
        title: "KYC Rejected",
        date: order.kycSubmissionDate || "",
        completed: false,
        icon: XCircle,
        description: "Identity verification rejected"
      });
    } else if (order.kycSubmissionDate) {
      timeline.push({
        title: "KYC Under Review",
        date: order.kycSubmissionDate,
        completed: false,
        icon: Circle,
        description: "Identity verification in progress"
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

    // Certificate/Completion step
    if (order.overallStatus === "completed") {
      timeline.push({
        title: "Certificate Issued",
        date: order.kycSubmissionDate || "", // Mock date
        completed: true,
        icon: CheckCircle,
        description: "Assessment certificate ready for download"
      });
    }

    return timeline;
  };

  const getNextSteps = () => {
    switch (order.overallStatus) {
      case "waiting_payment":
        return [
          "Complete payment to proceed",
          "You can still take the test without payment",
          "KYC verification will begin after test completion"
        ];
      case "waiting_test":
        return [
          "Take your scheduled test",
          order.bookingDate ? `Scheduled for ${formatDate(order.bookingDate.toISOString())} at ${order.bookingTime}` : "Schedule your test if needed",
          "KYC verification will begin after test completion"
        ];
      case "waiting_kyc":
        return [
          "KYC documents are being reviewed",
          "Review typically takes 2-3 business days",
          "You'll be notified once approved or if additional documents are needed"
        ];
      case "rejected":
        return [
          "KYC verification was rejected",
          "Contact support for more information",
          "You may be able to resubmit with corrected documents"
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
              <p className="text-sm text-muted-foreground">Order placed on {formatDate(order.orderDate)}</p>
            </div>
            <div>
              <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">Amount</h3>
              <p className="text-lg font-semibold mt-1">${order.amount}</p>
              <Badge variant={getStatusColor(order.overallStatus)} className="mt-1">
                {order.overallStatus?.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()) || 'Pending'}
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
                  {order.testStatus === "taken" ? "Taken" : 
                   order.testStatus === "scheduled" ? "Scheduled" : "Not Taken"}
                </Badge>
                {order.testTakenDate && (
                  <p className="text-xs text-muted-foreground mt-1">
                    {formatDate(order.testTakenDate)}
                  </p>
                )}
              </div>
              <div className="text-center p-3 rounded-lg border">
                <User className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm font-medium">KYC</p>
                <Badge variant={getStatusColor(order.kycStatus)} className="mt-1">
                  {order.kycStatus === "approved" ? "Approved" : 
                   order.kycStatus === "rejected" ? "Rejected" : "Pending"}
                </Badge>
                {order.kycSubmissionDate && (
                  <p className="text-xs text-muted-foreground mt-1">
                    {formatDate(order.kycSubmissionDate)}
                  </p>
                )}
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
              {order.overallStatus === "waiting_payment" && (
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
              {order.overallStatus === "waiting_test" && (
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
              {order.overallStatus === "rejected" && (
                <Button variant="outline" onClick={() => handleAction("appeal")} className="flex items-center gap-2">
                  Appeal Decision
                </Button>
              )}
              {order.overallStatus === "waiting_kyc" && (
                <p className="text-sm text-muted-foreground py-2">
                  No actions required at this time. KYC review is in progress.
                </p>
              )}
              {canRemoveOrder(order.id) && (
                <Button 
                  variant="outline" 
                  onClick={() => setShowRemoveDialog(true)}
                  className="flex items-center gap-2 text-destructive hover:text-destructive border-destructive/20"
                >
                  <Trash2 className="h-4 w-4" />
                  Remove Order
                </Button>
              )}
            </div>
          </div>

        </div>
      </DialogContent>

      <AlertDialog open={showRemoveDialog} onOpenChange={setShowRemoveDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Order</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove order {order?.orderId}? This action cannot be undone.
              {order?.bookingDate && (
                <div className="mt-2 p-2 bg-warning/10 rounded text-warning-foreground">
                  <strong>Warning:</strong> This order has a scheduled booking that will also be cancelled.
                </div>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleRemoveOrder} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Remove Order
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Dialog>
  );
}