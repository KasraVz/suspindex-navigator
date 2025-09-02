import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { FileText } from "lucide-react";
import { Link } from "react-router-dom";

// Mock data for recent reports - using standardized test names
const recentReports = [
  {
    id: "RPT001",
    testName: "FPA",
    dateReceived: "Jan 12, 2024",
  },
  {
    id: "RPT002", 
    testName: "GEB",
    dateReceived: "Jan 7, 2024",
  },
  {
    id: "RPT003",
    testName: "EEA", 
    dateReceived: "Oct 17, 2023",
  },
];

export function ReportSummaryCard() {
  // Show only the 2 most recent reports
  const displayReports = recentReports.slice(0, 2);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Latest Reports</CardTitle>
        <FileText className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-xs">Report Name</TableHead>
                <TableHead className="text-xs">Date Received</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {displayReports.map((report) => (
                <TableRow key={report.id}>
                  <TableCell className="text-sm font-medium">{report.testName}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{report.dateReceived}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <Button asChild variant="outline" className="w-full" size="sm">
            <Link to="/dashboard/reports">
              View All Reports
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}