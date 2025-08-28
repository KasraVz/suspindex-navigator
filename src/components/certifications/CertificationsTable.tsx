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
import { Eye, Download, Share } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const certifications = [
  {
    id: "CERT001",
    testDate: "2024-01-10",
    testName: "FPA Certification",
    status: "Valid",
    expiryDate: "2025-01-10",
  },
  {
    id: "CERT002",
    testDate: "2024-01-05",
    testName: "Business Strategy",
    status: "Valid",
    expiryDate: "2025-01-05",
  },
  {
    id: "CERT003",
    testDate: "2022-10-15",
    testName: "Market Analysis",
    status: "Expired",
    expiryDate: "2023-10-15",
  },
];

export function CertificationsTable() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>My Certifications</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Certification ID</TableHead>
              <TableHead>Test Date</TableHead>
              <TableHead>Test Name</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Expiry Date</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {certifications.map((cert) => (
              <TableRow key={cert.id}>
                <TableCell className="font-medium">{cert.id}</TableCell>
                <TableCell>{cert.testDate}</TableCell>
                <TableCell>{cert.testName}</TableCell>
                <TableCell>
                  <Badge variant={cert.status === "Valid" ? "default" : "secondary"}>
                    {cert.status}
                  </Badge>
                </TableCell>
                <TableCell>{cert.expiryDate}</TableCell>
                <TableCell className="space-x-2">
                  <Button variant="ghost" size="sm">
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Download className="w-4 h-4" />
                  </Button>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <Share className="w-4 h-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Share Certification</DialogTitle>
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