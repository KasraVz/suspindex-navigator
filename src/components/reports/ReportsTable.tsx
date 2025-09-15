import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Eye, Download, Share2, Users, AlertTriangle, RotateCcw, Check, ChevronDown } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useState } from "react";
const reports = [{
  id: "TST001",
  testDate: "2024-01-10",
  publishDate: "2024-01-12",
  testName: "FPA",
  status: "Paid",
  score: 85,
  quarter: "Q2"
}, {
  id: "TST002",
  testDate: "2024-01-05",
  publishDate: "2024-01-07",
  testName: "GEB",
  status: "Paid",
  score: 45,
  quarter: "Q4"
}, {
  id: "TST003",
  testDate: "2023-10-15",
  publishDate: "2023-10-17",
  testName: "EEA",
  status: "Unpaid",
  score: 32,
  quarter: "Q4"
}, {
  id: "TST004",
  testDate: "2023-11-20",
  publishDate: "2023-11-22",
  testName: "CPA",
  status: "Paid",
  score: 38,
  quarter: "Q3"
}, {
  id: "TST005",
  testDate: "2023-12-08",
  publishDate: "2023-12-10",
  testName: "MBA",
  status: "Paid",
  score: 28,
  quarter: "Q4"
}, {
  id: "TST006",
  testDate: "2024-02-14",
  publishDate: "2024-02-16",
  testName: "PMP",
  status: "Unpaid",
  score: 42,
  quarter: "Q3"
}];
const referringPartners = [{
  id: "partner1",
  name: "TechCorp Academy"
}, {
  id: "partner2",
  name: "Digital Learning Hub"
}, {
  id: "partner3",
  name: "Professional Development Center"
}, {
  id: "partner4",
  name: "Skills Training Institute"
}];
export function ReportsTable() {
  const [selectedPartners, setSelectedPartners] = useState<string[]>([]);
  const ShareWithPartnerModal = ({
    report
  }: {
    report: any;
  }) => {
    const isPoorPerformance = report.quarter === "Q3" || report.quarter === "Q4";
    return <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Share with Referring Partner</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          {/* Section 1: Partner Selection */}
          <div className="space-y-3">
            <label className="text-sm font-medium">Select Referring Partners</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button 
                  variant="outline" 
                  type="button"
                  className="w-full justify-between text-left font-normal"
                  role="combobox"
                >
                  {selectedPartners.length === 0 
                    ? "Choose referring partners" 
                    : selectedPartners.length === 1 
                      ? referringPartners.find(p => p.id === selectedPartners[0])?.name
                      : `${selectedPartners.length} partners selected`
                  }
                  <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0 bg-background border border-border z-50" align="start">
                <div className="p-2">
                  {referringPartners.map((partner) => (
                    <div
                      key={partner.id}
                      className="flex items-center space-x-2 rounded-md px-2 py-1.5 hover:bg-accent"
                    >
                      <Checkbox
                        id={partner.id}
                        checked={selectedPartners.includes(partner.id)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSelectedPartners([...selectedPartners, partner.id]);
                          } else {
                            setSelectedPartners(selectedPartners.filter(id => id !== partner.id));
                          }
                        }}
                      />
                      <label 
                        htmlFor={partner.id}
                        className="flex-1 text-sm cursor-pointer"
                      >
                        {partner.name}
                      </label>
                    </div>
                  ))}
                </div>
                {selectedPartners.length > 0 && (
                  <div className="border-t p-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      type="button"
                      className="w-full text-xs"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedPartners([]);
                      }}
                    >
                      Clear All
                    </Button>
                  </div>
                )}
              </PopoverContent>
            </Popover>
          </div>

          {/* Section 2: Conditional Performance Warning */}
          {isPoorPerformance && <Alert variant="destructive">
              <AlertTriangle className="w-4 h-4" />
              <AlertTitle>Performance Notice</AlertTitle>
              <AlertDescription className="space-y-3">
                <p>
                  You have scored poorly and are located in {report.quarter}. You may want to take the test again to improve your standing.
                </p>
                <Button variant="destructive" size="sm" className="w-full">
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Order Test Again
                </Button>
              </AlertDescription>
            </Alert>}

          {/* Final Share Button */}
          <div className="flex justify-end">
            <Button disabled={selectedPartners.length === 0} className="w-full">
              Share Report ({selectedPartners.length} partner{selectedPartners.length !== 1 ? 's' : ''})
            </Button>
          </div>
        </div>
      </DialogContent>;
  };
  return <Card>
      <CardHeader>
        <CardTitle>Test Reports</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Test ID</TableHead>
              <TableHead>Test Date</TableHead>
              <TableHead>Issued Date</TableHead>
              <TableHead>Test Name</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {reports.map(report => <TableRow key={report.id}>
                <TableCell className="font-medium">{report.id}</TableCell>
                <TableCell>{report.testDate}</TableCell>
                <TableCell>{report.publishDate}</TableCell>
                <TableCell>{report.testName}</TableCell>
                <TableCell>
                  {report.status === "Unpaid" ? <Button size="sm">Pay Now</Button> : <Badge variant="default">
                      {report.status}
                    </Badge>}
                </TableCell>
                <TableCell className="space-x-2">
                  {/* View button - always visible but grayed out for unpaid */}
                  <Button variant="ghost" size="sm" disabled={report.status === "Unpaid"}>
                    <Eye className="w-4 h-4" />
                  </Button>
                  
                  <Button variant="ghost" size="sm" disabled={report.status === "Unpaid"}>
                    <Download className="w-4 h-4" />
                  </Button>
                  
                  {/* Share with Referring Partner */}
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="ghost" size="sm" disabled={report.status === "Unpaid"}>
                        <Users className="w-4 h-4" />
                      </Button>
                    </DialogTrigger>
                    <ShareWithPartnerModal report={report} />
                  </Dialog>
                  
                  {/* Regular Share */}
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="ghost" size="sm" disabled={report.status === "Unpaid"}>
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
              </TableRow>)}
          </TableBody>
        </Table>
      </CardContent>
    </Card>;
}