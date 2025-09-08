import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Eye, CreditCard, Calendar, FileText, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useOrders } from "@/contexts/OrderContext";
import { ViewOrderDetailsDialog } from "./ViewOrderDetailsDialog";

export interface UnifiedOrder {
  id: string;
  orderId: string;
  testName: string;
  amount: number;
  orderDate: string;
  paymentStatus: "paid" | "unpaid";
  testStatus: "not_taken" | "taken" | "scheduled";
  kycStatus: "pending" | "approved" | "rejected";
  overallStatus: "completed" | "waiting_payment" | "waiting_test" | "waiting_kyc" | "rejected";
  testTakenDate?: string;
  kycSubmissionDate?: string;
  bookingDate?: Date;
  bookingTime?: string;
}

export function UnifiedOrdersTable() {
  const navigate = useNavigate();
  const { unpaidOrders, bookedItems, paidItems } = useOrders();
  const [selectedOrder, setSelectedOrder] = useState<UnifiedOrder | null>(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Mock unified orders data - in real app, this would be consolidated from all order sources
  const unifiedOrders: UnifiedOrder[] = [
    {
      id: "1",
      orderId: "ORD-2024-001",
      testName: "FPA",
      amount: 85,
      orderDate: "2024-01-10",
      paymentStatus: "paid",
      testStatus: "taken",
      kycStatus: "approved",
      overallStatus: "completed",
      testTakenDate: "2024-01-15",
      kycSubmissionDate: "2024-01-16"
    },
    {
      id: "2",
      orderId: "ORD-2024-002",
      testName: "GEB",
      amount: 75,
      orderDate: "2024-01-05",
      paymentStatus: "unpaid",
      testStatus: "not_taken",
      kycStatus: "pending",
      overallStatus: "waiting_payment"
    },
    {
      id: "3",
      orderId: "ORD-2024-003",
      testName: "EEA",
      amount: 95,
      orderDate: "2023-12-28",
      paymentStatus: "paid",
      testStatus: "not_taken",
      kycStatus: "pending",
      overallStatus: "waiting_test",
      bookingDate: new Date("2024-02-15"),
      bookingTime: "10:00 AM"
    },
    {
      id: "4",
      orderId: "ORD-2024-004",
      testName: "CPA",
      amount: 120,
      orderDate: "2023-12-15",
      paymentStatus: "paid",
      testStatus: "taken",
      kycStatus: "rejected",
      overallStatus: "rejected",
      testTakenDate: "2023-12-20",
      kycSubmissionDate: "2023-12-21"
    },
    {
      id: "5",
      orderId: "ORD-2024-005",
      testName: "MBA",
      amount: 150,
      orderDate: "2024-02-01",
      paymentStatus: "paid",
      testStatus: "taken",
      kycStatus: "pending",
      overallStatus: "waiting_kyc",
      testTakenDate: "2024-02-05",
      kycSubmissionDate: "2024-02-06"
    }
  ];

  const getStatusBadge = (status: UnifiedOrder["overallStatus"]) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-success text-success-foreground">Completed</Badge>;
      case "waiting_payment":
        return <Badge variant="destructive">Waiting for Payment</Badge>;
      case "waiting_test":
        return <Badge className="bg-warning text-warning-foreground">Waiting for Test</Badge>;
      case "waiting_kyc":
        return <Badge className="bg-info text-info-foreground">Waiting for KYC</Badge>;
      case "rejected":
        return <Badge variant="destructive">Rejected</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  const handleViewOrder = (order: UnifiedOrder) => {
    setSelectedOrder(order);
    setShowDetailsDialog(true);
  };

  const filteredOrders = unifiedOrders.filter(order => {
    const matchesSearch = order.testName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         order.orderId.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || order.overallStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>All Orders</CardTitle>
          <div className="flex flex-col sm:flex-row gap-4 mt-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search by test name or order ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="waiting_payment">Waiting for Payment</SelectItem>
                <SelectItem value="waiting_test">Waiting for Test</SelectItem>
                <SelectItem value="waiting_kyc">Waiting for KYC</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {filteredOrders.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              {searchQuery || statusFilter !== "all" ? "No orders match your filters" : "No orders found"}
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Test Name</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Payment</TableHead>
                  <TableHead>Test</TableHead>
                  <TableHead>KYC</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">{order.orderId}</TableCell>
                    <TableCell className="font-medium">{order.testName}</TableCell>
                    <TableCell>{order.orderDate}</TableCell>
                    <TableCell>${order.amount}</TableCell>
                    <TableCell>
                      <Badge variant={order.paymentStatus === "paid" ? "default" : "destructive"}>
                        {order.paymentStatus === "paid" ? "Paid" : "Unpaid"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={
                        order.testStatus === "taken" ? "default" : 
                        order.testStatus === "scheduled" ? "secondary" : "outline"
                      }>
                        {order.testStatus === "taken" ? "Taken" : 
                         order.testStatus === "scheduled" ? "Scheduled" : "Not Taken"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={
                        order.kycStatus === "approved" ? "default" : 
                        order.kycStatus === "rejected" ? "destructive" : "secondary"
                      }>
                        {order.kycStatus === "approved" ? "Approved" : 
                         order.kycStatus === "rejected" ? "Rejected" : "Pending"}
                      </Badge>
                    </TableCell>
                    <TableCell>{getStatusBadge(order.overallStatus)}</TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleViewOrder(order)}
                        className="flex items-center gap-2"
                      >
                        <Eye size={16} />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <ViewOrderDetailsDialog
        order={selectedOrder}
        open={showDetailsDialog}
        onOpenChange={setShowDetailsDialog}
      />
    </>
  );
}