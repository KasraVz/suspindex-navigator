import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Clock, CheckCircle, XCircle, FileText, AlertCircle } from "lucide-react";
import { ViewEditRequestDetailsDialog } from "./ViewEditRequestDetailsDialog";

// Mock data for edit requests
const mockEditRequests = [
  {
    id: "REQ-001",
    profileSection: "Personal Profile",
    field: "Email Address",
    currentValue: "john.doe@example.com",
    requestedValue: "john.doe@newcompany.com",
    reason: "Changed companies and need to update professional email",
    priority: "medium",
    status: "pending",
    submittedDate: "2024-03-15",
    adminResponse: null
  },
  {
    id: "REQ-002", 
    profileSection: "Business Profile",
    field: "Development Stage",
    currentValue: "Building Initial Traction/Early Customers",
    requestedValue: "Generating Revenue",
    reason: "We've reached consistent monthly revenue and need to update our stage",
    priority: "low",
    status: "approved",
    submittedDate: "2024-03-10",
    adminResponse: "Request approved. Profile updated successfully."
  },
  {
    id: "REQ-003",
    profileSection: "Personal Profile", 
    field: "Full Name",
    currentValue: "John Doe",
    requestedValue: "Jonathan Doe",
    reason: "Legal name change - want to use full professional name",
    priority: "high",
    status: "rejected",
    submittedDate: "2024-03-08",
    adminResponse: "Please provide legal documentation for name changes. Contact support for assistance."
  }
];

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
      return <Badge variant="destructive" className="text-xs">High</Badge>;
    case "medium":
      return <Badge variant="secondary" className="bg-orange-100 text-orange-800 text-xs">Medium</Badge>;
    case "low":
      return <Badge variant="outline" className="text-xs">Low</Badge>;
    default:
      return <Badge variant="outline" className="text-xs">Unknown</Badge>;
  }
};

export function ProfileEditRequests() {
  const [selectedRequest, setSelectedRequest] = useState<typeof mockEditRequests[0] | null>(null);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);

  const handleViewDetails = (request: typeof mockEditRequests[0]) => {
    setSelectedRequest(request);
    setIsDetailsDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Profile Edit Requests
          </CardTitle>
        </CardHeader>
        <CardContent>
          {mockEditRequests.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No edit requests submitted yet.</p>
              <p className="text-sm">Use the "Request Edit" buttons on your profile to submit change requests.</p>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Request ID</TableHead>
                    <TableHead>Section & Field</TableHead>
                    <TableHead>Current → Requested</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockEditRequests.map((request) => (
                    <TableRow key={request.id}>
                      <TableCell className="font-mono text-sm">{request.id}</TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{request.profileSection}</p>
                          <p className="text-sm text-muted-foreground">{request.field}</p>
                        </div>
                      </TableCell>
                      <TableCell className="max-w-[200px]">
                        <div className="space-y-1">
                          <p className="text-sm text-muted-foreground truncate">
                            <span className="font-medium">From:</span> {request.currentValue}
                          </p>
                          <p className="text-sm truncate">
                            <span className="font-medium">To:</span> {request.requestedValue}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        {getPriorityBadge(request.priority)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(request.status)}
                          {getStatusBadge(request.status)}
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {new Date(request.submittedDate).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleViewDetails(request)}
                        >
                          View Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <ViewEditRequestDetailsDialog
        request={selectedRequest}
        open={isDetailsDialogOpen}
        onOpenChange={setIsDetailsDialogOpen}
      />
    </div>
  );
}