import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Eye, Download, Share2, AlertTriangle, RefreshCw } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";

const reports = [
  {
    id: "RPT001",
    testDate: "2024-01-10",
    publishDate: "2024-01-12",
    testName: "FPA",
    status: "Paid",
    score: 85,
    quarter: "Q1",
    referringPartner: null,
    referringPartnerName: null,
  },
  {
    id: "RPT002",
    testDate: "2024-01-05",
    publishDate: "2024-01-07",
    testName: "GEB",
    status: "Paid",
    score: 92,
    quarter: "Q2",
    referringPartner: "PART001",
    referringPartnerName: "TechCorner Academy",
  },
  {
    id: "RPT003",
    testDate: "2023-10-15",
    publishDate: "2023-10-17",
    testName: "EEA",
    status: "Unpaid",
    score: 45,
    quarter: "Q3",
    referringPartner: "PART002",
    referringPartnerName: "EduMax Solutions",
  },
  {
    id: "RPT004",
    testDate: "2023-12-20",
    publishDate: "2023-12-22",
    testName: "MBA",
    status: "Paid",
    score: 38,
    quarter: "Q4",
    referringPartner: null,
    referringPartnerName: null,
  },
];

const partnersList = [
  { id: "PART001", name: "TechCorner Academy" },
  { id: "PART002", name: "EduMax Solutions" },
  { id: "PART003", name: "LearnPro Institute" },
];

export function ReportsTable() {
  const [selectedPartner, setSelectedPartner] = useState<string>("");

  // Check for poor performing reports that need warning
  const poorPerformingReports = reports.filter(
    (report) => report.score < 50 && (report.quarter === "Q3" || report.quarter === "Q4")
  );

  return (
    <div className="space-y-6">
      {/* Performance Warnings */}
      {poorPerformingReports.map((report) => (
        <Alert key={`warning-${report.id}`} variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Poor Performance Alert</AlertTitle>
          <AlertDescription className="flex items-center justify-between">
            <span>
              You have scored poorly on your {report.testName} test (Score: {report.score}) and are located in {report.quarter}. 
              Would you like to retake the test to improve your performance?
            </span>
            <Button size="sm" className="ml-4">
              <RefreshCw className="w-4 h-4 mr-2" />
              Order Again
            </Button>
          </AlertDescription>
        </Alert>
      ))}

      <Card>
        <CardHeader>
          <CardTitle>Test Reports</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Report ID</TableHead>
                <TableHead>Test Date</TableHead>
                <TableHead>Publish Date</TableHead>
                <TableHead>Test Name</TableHead>
                <TableHead>Referring Partner</TableHead>
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
                    {report.referringPartner ? (
                      <div className="space-y-2">
                        <Badge variant="secondary" className="text-xs">
                          {report.referringPartnerName}
                        </Badge>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-xs"
                              disabled={report.status === "Unpaid"}
                            >
                              Share with Partner
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Share Report with Referring Partner</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div className="space-y-2">
                                <label className="text-sm font-medium">Select Partner</label>
                                <Select value={selectedPartner} onValueChange={setSelectedPartner}>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Choose a referring partner" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {partnersList.map((partner) => (
                                      <SelectItem key={partner.id} value={partner.id}>
                                        {partner.name}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                              <div className="flex gap-2">
                                <Button disabled={!selectedPartner}>
                                  Share Report
                                </Button>
                                <Button variant="outline">
                                  Cancel
                                </Button>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                    ) : (
                      <span className="text-muted-foreground text-sm">-</span>
                    )}
                  </TableCell>
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
                    {/* View button - always shown but disabled for unpaid */}
                    <Button 
                      variant="ghost" 
                      size="sm"
                      disabled={report.status === "Unpaid"}
                      className={report.status === "Unpaid" ? "opacity-50" : ""}
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
    </div>
  );
}