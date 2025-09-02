import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useNavigate } from "react-router-dom";
import { Eye, CreditCard } from "lucide-react";

const testHistory = [
  {
    id: "1",
    testName: "FPA",
    finalTestDate: "2024-01-10",
    paymentStatus: "Paid",
    kycStatus: "Accepted"
  },
  {
    id: "2", 
    testName: "GEB",
    finalTestDate: "2024-01-05",
    paymentStatus: "Paid",
    kycStatus: "Accepted"
  },
  {
    id: "3",
    testName: "EEA", 
    finalTestDate: "2023-12-28",
    paymentStatus: "Unpaid",
    kycStatus: "Pending"
  },
  {
    id: "4",
    testName: "CPA",
    finalTestDate: "2023-12-15", 
    paymentStatus: "Paid",
    kycStatus: "Not Accepted"
  },
  {
    id: "5",
    testName: "MBA",
    finalTestDate: "2024-02-01",
    paymentStatus: "Unpaid", 
    kycStatus: "Pending"
  },
  {
    id: "6",
    testName: "PHR",
    finalTestDate: "2024-01-20",
    paymentStatus: "Paid",
    kycStatus: "Not Accepted"
  }
];
export function TestHistoryTable() {
  const navigate = useNavigate();

  const getStatusAction = (test: any) => {
    if (test.paymentStatus === "Paid" && test.kycStatus === "Accepted") {
      return (
        <Button
          variant="default"
          size="sm"
          onClick={() => navigate("/reports")}
          className="flex items-center gap-2"
        >
          <Eye size={16} />
          View Report
        </Button>
      );
    } else if (test.kycStatus === "Not Accepted") {
      return <Badge variant="destructive">Rejected</Badge>;
    } else if (test.paymentStatus === "Unpaid") {
      return (
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-2"
        >
          <CreditCard size={16} />
          Pay Now
        </Button>
      );
    }
    return <Badge variant="secondary">Processing</Badge>;
  };

  return <Card>
      <CardHeader>
        <CardTitle>Test History</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Test Name</TableHead>
              <TableHead>Test Completion Date</TableHead>
              <TableHead>Payment Status</TableHead>
              <TableHead>KYC Status</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {testHistory.map(test => <TableRow key={test.id}>
                <TableCell className="font-medium">{test.testName}</TableCell>
                <TableCell>{test.finalTestDate}</TableCell>
                <TableCell>
                  <Badge variant={test.paymentStatus === "Paid" ? "default" : "destructive"}>
                    {test.paymentStatus}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={test.kycStatus === "Accepted" ? "default" : "secondary"}>
                    {test.kycStatus}
                  </Badge>
                </TableCell>
                <TableCell>
                  {getStatusAction(test)}
                </TableCell>
              </TableRow>)}
          </TableBody>
        </Table>
      </CardContent>
    </Card>;
}