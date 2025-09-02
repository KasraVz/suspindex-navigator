import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CreditCard } from "lucide-react";
const testHistory = [{
  orderNumber: "ORD005",
  testName: "FPA",
  finalTestDate: "2024-01-10",
  testStatus: "Done",
  paymentStatus: "Paid",
  kycStatus: "Accepted"
}, {
  orderNumber: "ORD004",
  testName: "GEB",
  finalTestDate: "2024-01-05",
  testStatus: "Done",
  paymentStatus: "Paid",
  kycStatus: "Accepted"
}, {
  orderNumber: "ORD003",
  testName: "EEA",
  finalTestDate: "2023-12-28",
  testStatus: "Not Done",
  paymentStatus: "Unpaid",
  kycStatus: "Not Accepted"
}];

const getTestStatus = (paymentStatus: string, kycStatus: string) => {
  if (kycStatus === "Not Accepted") {
    return "Rejected";
  }
  if (paymentStatus === "Paid" && kycStatus === "Accepted") {
    return "View Report";
  }
  if (paymentStatus === "Unpaid") {
    return "Waiting for payment";
  }
  return "Pending";
};
export function TestHistoryTable() {
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
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {testHistory.map(test => {
              const status = getTestStatus(test.paymentStatus, test.kycStatus);
              return (
                <TableRow key={test.orderNumber}>
                  <TableCell className="font-medium">{test.testName}</TableCell>
                  <TableCell>{test.finalTestDate}</TableCell>
                  <TableCell>
                    {status === "Waiting for payment" ? (
                      <div className="flex items-center gap-2">
                        <Badge variant="destructive">{status}</Badge>
                        <Button size="sm" variant="outline">
                          <CreditCard className="mr-1 h-3 w-3" />
                          Pay Now
                        </Button>
                      </div>
                    ) : (
                      <Badge 
                        variant={
                          status === "View Report" ? "default" : 
                          status === "Rejected" ? "destructive" : 
                          "secondary"
                        }
                      >
                        {status}
                      </Badge>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>;
}