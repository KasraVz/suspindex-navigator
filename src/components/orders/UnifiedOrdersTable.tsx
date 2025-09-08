import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Eye, Trash2 } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { ViewOrderDetailsDialog } from "./ViewOrderDetailsDialog";
import { useOrders, UnifiedOrder } from "@/contexts/OrderContext";
import { useToast } from "@/hooks/use-toast";

export const UnifiedOrdersTable = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedOrder, setSelectedOrder] = useState<UnifiedOrder | null>(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const { getAllOrders, removeOrder, canRemoveOrder } = useOrders();
  const { toast } = useToast();

  // Get real unified orders from context
  const unifiedOrders = getAllOrders();

  const getStatusBadge = (status: UnifiedOrder["overallStatus"]) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-600 text-white">Completed</Badge>;
      case "pending_payment":
        return <Badge variant="destructive">Pending Payment</Badge>;
      case "ready_to_take":
        return <Badge className="bg-blue-600 text-white">Ready to Take</Badge>;
      case "in_progress":
        return <Badge className="bg-yellow-600 text-white">In Progress</Badge>;
      case "pending_kyc":
        return <Badge className="bg-orange-600 text-white">Pending KYC</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  const handleViewOrder = (order: UnifiedOrder) => {
    setSelectedOrder(order);
    setShowDetailsDialog(true);
  };

  const handleRemoveOrder = (orderId: string, orderName: string) => {
    const success = removeOrder(orderId);
    if (success) {
      toast({
        title: "Order Removed",
        description: `${orderName} has been successfully removed from your orders.`,
      });
    } else {
      toast({
        title: "Cannot Remove Order",
        description: "This order cannot be removed. Only unpaid orders that haven't been taken can be removed.",
        variant: "destructive",
      });
    }
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
                <SelectItem value="pending_payment">Pending Payment</SelectItem>
                <SelectItem value="ready_to_take">Ready to Take</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="pending_kyc">Pending KYC</SelectItem>
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
                  <TableHead>Amount</TableHead>
                  <TableHead>Payment Status</TableHead>
                  <TableHead>Test Status</TableHead>
                  <TableHead>Overall Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">{order.orderId}</TableCell>
                    <TableCell className="font-medium">{order.testName}</TableCell>
                    <TableCell>${order.amount}</TableCell>
                    <TableCell>
                      <Badge variant={order.paymentStatus === "paid" ? "default" : "destructive"}>
                        {order.paymentStatus === "paid" ? "Paid" : "Unpaid"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={
                        order.testStatus === "completed" ? "default" : 
                        order.testStatus === "in_progress" ? "secondary" : "outline"
                      }>
                        {order.testStatus === "completed" ? "Completed" : 
                         order.testStatus === "in_progress" ? "In Progress" : "Not Taken"}
                      </Badge>
                    </TableCell>
                    <TableCell>{getStatusBadge(order.overallStatus)}</TableCell>
                    <TableCell>{order.dateAdded || order.datePaid}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewOrder(order)}
                          className="flex items-center gap-2"
                        >
                          <Eye className="w-4 h-4" />
                          View
                        </Button>
                        {canRemoveOrder(order.id) && (
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                className="flex items-center gap-2 text-destructive hover:text-destructive"
                              >
                                <Trash2 className="w-4 h-4" />
                                Remove
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Remove Order</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to remove "{order.testName}"? This action cannot be undone.
                                  {order.bookingDate && " This will also cancel any associated bookings."}
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleRemoveOrder(order.id, order.testName)}
                                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                >
                                  Remove Order
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
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
    </>
  );
};