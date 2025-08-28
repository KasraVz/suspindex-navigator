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
import { Building, Users, DollarSign } from "lucide-react";

const affiliateData = [
  {
    entity: "TechStartup Inc.",
    code: "TECH-001",
    requestedTests: 25,
    completedTests: 18,
    earnings: "$450.00",
    status: "Active",
  },
  {
    entity: "Innovation Labs",
    code: "INNOV-002",
    requestedTests: 15,
    completedTests: 12,
    earnings: "$300.00",
    status: "Active",
  },
];

export function AffiliateSection() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building className="w-5 h-5" />
          Affiliate Program
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4 md:grid-cols-3">
          <div className="flex items-center space-x-2">
            <Users className="w-4 h-4 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">Active Partnerships</p>
              <p className="text-2xl font-bold">2</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Badge className="w-4 h-4 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">Total Tests</p>
              <p className="text-2xl font-bold">30</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <DollarSign className="w-4 h-4 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">Total Earnings</p>
              <p className="text-2xl font-bold">$750.00</p>
            </div>
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Entity</TableHead>
              <TableHead>Affiliate Code</TableHead>
              <TableHead>Requested Tests</TableHead>
              <TableHead>Completed</TableHead>
              <TableHead>Earnings</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {affiliateData.map((affiliate, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">{affiliate.entity}</TableCell>
                <TableCell>{affiliate.code}</TableCell>
                <TableCell>{affiliate.requestedTests}</TableCell>
                <TableCell>{affiliate.completedTests}</TableCell>
                <TableCell>{affiliate.earnings}</TableCell>
                <TableCell>
                  <Badge variant="default">{affiliate.status}</Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <Button className="w-full bg-brand-orange hover:bg-brand-orange/90 text-white">Apply for Affiliate Partnership</Button>
      </CardContent>
    </Card>
  );
}