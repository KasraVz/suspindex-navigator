import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Eye, CreditCard, Calendar, FileText, Search, Trash2 } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { toast } from "sonner";
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
  const { unpaidOrders, bookedItems, paidItems, removeOrder, canRemoveOrder } = useOrders();
  const [selectedOrder, setSelectedOrder] = useState<UnifiedOrder | null>(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showRemoveDialog, setShowRemoveDialog] = useState(false);
  const [orderToRemove, setOrderToRemove] = useState<UnifiedOrder | null>(null);

  // Consolidate all orders from different sources into unified format
  const allOrders: UnifiedOrder[] = [
    // Unpaid orders
    ...unpaidOrders.map(order => ({
      id: `unpaid-${order.id}`,
      orderId: `ORD-${order.id}`,
      testName: order.testName,
      amount: order.amount,
      orderDate: order.dateAdded,
      paymentStatus: "unpaid" as const,
      testStatus: order.testStatus || "not_taken" as const,
      kycStatus: order.kycStatus || "pending" as const,
      overallStatus: "waiting_payment" as const,
      bookingDate: order.bookingDate,
      bookingTime: order.bookingTime,
    })),
    // Paid orders
    ...paidItems.map(order => ({
      id: `paid-${order.id}`,
      orderId: `ORD-${order.id}`,
      testName: order.testName,
      amount: order.amount,
      orderDate: order.datePaid,
      paymentStatus: "paid" as const,
      testStatus: ["101", "103", "104"].includes(order.id) ? "taken" as const : "not_taken" as const,
      kycStatus: ["101", "103", "104"].includes(order.id) ? "approved" as const : "pending" as const,
      overallStatus: ["101", "103", "104"].includes(order.id) ? "completed" as const : "waiting_test" as const,
      testTakenDate: ["101", "103", "104"].includes(order.id) ? "2023-12-20" : undefined,
      kycSubmissionDate: ["101", "103", "104"].includes(order.id) ? "2023-12-21" : undefined,
      bookingDate: order.bookingDate,
      bookingTime: order.bookingTime,
    }))
  ];

  // Remove duplicates based on original order ID
  const unifiedOrders = allOrders.filter((order, index, array) => {
    const originalId = order.id.replace(/^(unpaid-|paid-)/, '');
    return array.findIndex(o => o.id.replace(/^(unpaid-|paid-)/, '') === originalId) === index;
  });

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

  const handleRemoveOrder = (order: UnifiedOrder) => {
    setOrderToRemove(order);
    setShowRemoveDialog(true);
  };

  const confirmRemoveOrder = () => {
    if (orderToRemove) {
      const originalId = orderToRemove.id.replace(/^(unpaid-|paid-)/, '');
      if (removeOrder(originalId)) {
        toast.success(`Order ${orderToRemove.orderId} removed successfully`);
      } else {
        toast.error("Failed to remove order. Order may be paid or test already taken.");
      }
    }
    setShowRemoveDialog(false);
    setOrderToRemove(null);
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
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewOrder(order)}
                          className="flex items-center gap-2"
                        >
                          <Eye size={16} />
                        </Button>
                        {canRemoveOrder(order.id.replace(/^(unpaid-|paid-)/, '')) && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveOrder(order)}
                            className="flex items-center gap-2 text-destructive hover:text-destructive"
                          >
                            <Trash2 size={16} />
                          </Button>
                        )}
                      </div>
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

      <AlertDialog open={showRemoveDialog} onOpenChange={setShowRemoveDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Order</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove order {orderToRemove?.orderId}? This action cannot be undone.
              {orderToRemove?.bookingDate && (
                <div className="mt-2 p-2 bg-warning/10 rounded text-warning-foreground">
                  <strong>Warning:</strong> This order has a scheduled booking that will also be cancelled.
                </div>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmRemoveOrder} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Remove Order
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}