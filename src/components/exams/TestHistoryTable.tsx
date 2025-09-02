import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
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
export function TestHistoryTable() {
  return <Card>
      <CardHeader>
        <CardTitle>Test History</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order Number</TableHead>
              <TableHead>Test Name</TableHead>
              <TableHead>Test Completion Date</TableHead>
              <TableHead>Test Status</TableHead>
              <TableHead>Payment Status</TableHead>
              <TableHead>KYC Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {testHistory.map(test => <TableRow key={test.orderNumber}>
                <TableCell className="font-medium">{test.orderNumber}</TableCell>
                <TableCell>{test.testName}</TableCell>
                <TableCell>{test.finalTestDate}</TableCell>
                <TableCell>
                  <Badge variant={test.testStatus === "Done" ? "default" : "secondary"}>
                    {test.testStatus}
                  </Badge>
                </TableCell>
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
              </TableRow>)}
          </TableBody>
        </Table>
      </CardContent>
    </Card>;
}