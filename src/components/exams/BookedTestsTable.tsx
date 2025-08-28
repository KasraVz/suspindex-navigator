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
import { Eye, Settings } from "lucide-react";

const bookedTests = [
  {
    orderNumber: "ORD001",
    bookedDateTime: "2024-01-15 10:00 AM",
    type: "Individual",
    paymentStatus: "Purchased",
    testName: "FPA Certification",
    testTime: "120 minutes",
  },
  {
    orderNumber: "ORD002",
    bookedDateTime: "2024-01-18 2:00 PM",
    type: "Group",
    paymentStatus: "Not Purchased",
    testName: "Business Analytics",
    testTime: "90 minutes",
  },
  {
    orderNumber: "ORD003",
    bookedDateTime: "2024-01-22 11:00 AM",
    type: "Individual",
    paymentStatus: "Purchased",
    testName: "Leadership Assessment",
    testTime: "150 minutes",
  },
];

export function BookedTestsTable() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Booked Tests</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order Number</TableHead>
              <TableHead>Booked Date & Time</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Payment Status</TableHead>
              <TableHead>Test Name</TableHead>
              <TableHead>Test Time</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {bookedTests.map((test) => (
              <TableRow key={test.orderNumber}>
                <TableCell className="font-medium">{test.orderNumber}</TableCell>
                <TableCell>{test.bookedDateTime}</TableCell>
                <TableCell>{test.type}</TableCell>
                <TableCell>
                  <Badge variant={test.paymentStatus === "Purchased" ? "default" : "secondary"} className={test.paymentStatus === "Purchased" ? "bg-brand-green text-white" : "bg-brand-cream text-brand-cream-foreground"}>
                    {test.paymentStatus}
                  </Badge>
                </TableCell>
                <TableCell>{test.testName}</TableCell>
                <TableCell>{test.testTime}</TableCell>
                <TableCell className="space-x-2">
                  <Button variant="ghost" size="sm">
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Settings className="w-4 h-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}