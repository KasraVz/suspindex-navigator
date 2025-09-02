import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Eye, Download, Share2, Users, AlertTriangle, RotateCcw } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useState } from "react";

const reports = [
  {
    id: "TST001",
    testDate: "2024-01-10",
    publishDate: "2024-01-12",
    testName: "FPA",
    status: "Paid",
    score: 85,
    quarter: "Q2",
    hasReferringPartner: true,
  },
  {
    id: "TST002",
    testDate: "2024-01-05",
    publishDate: "2024-01-07",
    testName: "GEB",
    status: "Paid",
    score: 45,
    quarter: "Q4",
    hasReferringPartner: false,
  },
  {
    id: "TST003",
    testDate: "2023-10-15",
    publishDate: "2023-10-17",
    testName: "EEA",
    status: "Unpaid",
    score: 32,
    quarter: "Q4",
    hasReferringPartner: true,
  },
];

const referringPartners = [
  { id: "partner1", name: "TechCorp Academy" },
  { id: "partner2", name: "Digital Learning Hub" },
  { id: "partner3", name: "Professional Development Center" },
  { id: "partner4", name: "Skills Training Institute" },
];

export function ReportsTable() {
  const [selectedPartner, setSelectedPartner] = useState("");

  const ShareWithPartnerModal = ({ report }: { report: any }) => {
    const isPoorPerformance = report.quarter === "Q3" || report.quarter === "Q4";

    return (
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Share with Referring Partner</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          {/* Section 1: Partner Selection */}
          <div className="space-y-3">
            <label className="text-sm font-medium">Select Referring Partner</label>
            <Select value={selectedPartner} onValueChange={setSelectedPartner}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a referring partner" />
              </SelectTrigger>
              <SelectContent>
                {referringPartners.map((partner) => (
                  <SelectItem key={partner.id} value={partner.id}>
                    {partner.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Section 2: Conditional Performance Warning */}
          {isPoorPerformance && (
            <Alert variant="destructive">
              <AlertTriangle className="w-4 h-4" />
              <AlertTitle>Performance Notice</AlertTitle>
              <AlertDescription className="space-y-3">
                <p>
                  You have scored poorly and are located in {report.quarter}. You may want to take the test again to improve your standing.
                </p>
                <Button variant="destructive" size="sm" className="w-full">
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Order Test Again
                </Button>
              </AlertDescription>
            </Alert>
          )}

          {/* Final Share Button */}
          <div className="flex justify-end">
            <Button 
              disabled={!selectedPartner}
              className="w-full"
            >
              Share Report
            </Button>
          </div>
        </div>
      </DialogContent>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Test Reports</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Test ID</TableHead>
              <TableHead>Test Date</TableHead>
              <TableHead>Publish Date</TableHead>
              <TableHead>Test Name</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {reports.map((report) => (
              <TableRow key={report.id}>
                <TableCell className="font-medium">{report.id}</TableCell>
                <TableCell>{report.testDate}</TableCell>
                <TableCell>{report.publishDate}</TableCell>
                <TableCell>{report.testName}</TableCell>
                <TableCell>
                  {report.status === "Unpaid" ? (
                    <Button size="sm">Pay Now</Button>
                  ) : (
                    <Badge variant="default">
                      {report.status}
                    </Badge>
                  )}
                </TableCell>
                <TableCell className="space-x-2">
                  {/* View button - always visible but grayed out for unpaid */}
                  <Button 
                    variant="ghost" 
                    size="sm"
                    disabled={report.status === "Unpaid"}
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                  
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    disabled={report.status === "Unpaid"}
                  >
                    <Download className="w-4 h-4" />
                  </Button>
                  
                  {/* Share with Referring Partner */}
                  {report.hasReferringPartner && (
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <Users className="w-4 h-4" />
                        </Button>
                      </DialogTrigger>
                      <ShareWithPartnerModal report={report} />
                    </Dialog>
                  )}
                  
                  {/* Regular Share */}
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        disabled={report.status === "Unpaid"}
                      >
                        <Share2 className="w-4 h-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Share Report</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <Button>Share via Email</Button>
                          <Button variant="outline">Social Media</Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}