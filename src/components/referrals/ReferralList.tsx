import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const referrals = [
  {
    id: 1,
    name: "Alice Johnson",
    email: "alice@example.com",
    registrationDate: "2024-01-15",
    status: "Active",
    testsCompleted: 3,
  },
  {
    id: 2,
    name: "Bob Smith",
    email: "bob@example.com",
    registrationDate: "2024-01-20",
    status: "Active",
    testsCompleted: 1,
  },
  {
    id: 3,
    name: "Carol Brown",
    email: "carol@example.com",
    registrationDate: "2024-01-25",
    status: "Pending",
    testsCompleted: 0,
  },
];

export function ReferralList() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Referrals</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Registration Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Tests Completed</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {referrals.map((referral) => (
              <TableRow key={referral.id}>
                <TableCell className="font-medium">{referral.name}</TableCell>
                <TableCell>{referral.email}</TableCell>
                <TableCell>{referral.registrationDate}</TableCell>
                <TableCell>
                  <Badge variant={referral.status === "Active" ? "default" : "secondary"}>
                    {referral.status}
                  </Badge>
                </TableCell>
                <TableCell>{referral.testsCompleted}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}