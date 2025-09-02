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
import { Eye, Download, Share2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const reports = [
  {
    id: "RPT001",
    testDate: "2024-01-10",
    publishDate: "2024-01-12",
    testName: "FPA",
    status: "Paid",
  },
  {
    id: "RPT002",
    testDate: "2024-01-05",
    publishDate: "2024-01-07",
    testName: "GEB",
    status: "Paid",
  },
  {
    id: "RPT003",
    testDate: "2023-10-15",
    publishDate: "2023-10-17",
    testName: "EEA",
    status: "Unpaid",
  },
];

export function ReportsTable() {
  return (
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
                  {report.status === "Paid" && (
                    <Button variant="ghost" size="sm">
                      <Eye className="w-4 h-4" />
                    </Button>
                  )}
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
  );
}