import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, CheckCircle, XCircle, AlertCircle, FileText, Calendar, User, MessageSquare } from "lucide-react";

interface EditRequest {
  id: string;
  profileSection: string;
  field: string;
  currentValue: string;
  requestedValue: string;
  reason: string;
  priority: string;
  status: string;
  submittedDate: string;
  adminResponse: string | null;
}

interface ViewEditRequestDetailsDialogProps {
  request: EditRequest | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case "pending":
      return <Clock className="w-4 h-4" />;
    case "approved":
      return <CheckCircle className="w-4 h-4" />;
    case "rejected":
      return <XCircle className="w-4 h-4" />;
    default:
      return <AlertCircle className="w-4 h-4" />;
  }
};

const getStatusBadge = (status: string) => {
  switch (status) {
    case "pending":
      return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Pending</Badge>;
    case "approved":
      return <Badge variant="secondary" className="bg-green-100 text-green-800">Approved</Badge>;
    case "rejected":
      return <Badge variant="secondary" className="bg-red-100 text-red-800">Rejected</Badge>;
    default:
      return <Badge variant="secondary">Unknown</Badge>;
  }
};

const getPriorityBadge = (priority: string) => {
  switch (priority) {
    case "high":
      return <Badge variant="destructive" className="text-xs">High Priority</Badge>;
    case "medium":
      return <Badge variant="secondary" className="bg-orange-100 text-orange-800 text-xs">Medium Priority</Badge>;
    case "low":
      return <Badge variant="outline" className="text-xs">Low Priority</Badge>;
    default:
      return <Badge variant="outline" className="text-xs">Unknown Priority</Badge>;
  }
};

export function ViewEditRequestDetailsDialog({
  request,
  open,
  onOpenChange,
}: ViewEditRequestDetailsDialogProps) {
  if (!request) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <FileText className="w-5 h-5" />
            Profile Edit Request Details
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Request Header */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg font-mono">{request.id}</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    {request.profileSection} → {request.field}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusIcon(request.status)}
                  {getStatusBadge(request.status)}
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>Submitted: {new Date(request.submittedDate).toLocaleDateString()}</span>
                </div>
                {getPriorityBadge(request.priority)}
              </div>
            </CardContent>
          </Card>

          {/* Value Changes */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Requested Changes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-3">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Current Value</label>
                  <div className="mt-1 p-3 bg-muted rounded-md">
                    <p className="text-sm">{request.currentValue}</p>
                  </div>
                </div>
                <div className="flex justify-center">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <div className="w-4 h-4 border-r-2 border-b-2 border-primary rotate-45 -translate-x-0.5"></div>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Requested Value</label>
                  <div className="mt-1 p-3 bg-primary/5 border border-primary/20 rounded-md">
                    <p className="text-sm font-medium">{request.requestedValue}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Reason */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <User className="w-4 h-4" />
                Reason for Change
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-relaxed">{request.reason}</p>
            </CardContent>
          </Card>

          {/* Admin Response */}
          {request.adminResponse && (
            <Card className="border-l-4 border-l-primary">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <MessageSquare className="w-4 h-4" />
                  Admin Response
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-relaxed">{request.adminResponse}</p>
              </CardContent>
            </Card>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Close
            </Button>
            {request.status === "pending" && (
              <Button 
                variant="secondary"
                onClick={() => {
                  // TODO: Implement edit request functionality
                  alert("Edit request functionality will be implemented soon");
                }}
              >
                Edit Request
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}