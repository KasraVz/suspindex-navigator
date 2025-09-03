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
    <Card className="h-fit hover:shadow-md transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 px-4 pt-4">
        <CardTitle className="text-sm font-medium">Latest Reports</CardTitle>
        <FileText className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent className="px-4 pb-4">
        <div className="space-y-3">
          {/* Horizontal layout for reports */}
          <div className="flex gap-3 overflow-x-auto pb-2">
            {displayReports.map((report, index) => (
              <div key={report.id} className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50 hover:bg-secondary/70 transition-colors min-w-fit">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <FileText className="h-4 w-4 text-primary" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-sm whitespace-nowrap">{report.testName} Report</p>
                    <Badge variant="outline" className="text-xs shrink-0">
                      {index === 0 ? "Latest" : "Recent"}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground whitespace-nowrap">{report.dateReceived}</p>
                </div>
              </div>
            ))}
          </div>
          <Button asChild variant="outline" className="w-full" size="sm">
            <Link to="/dashboard/reports">
              📊 View All Reports
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}