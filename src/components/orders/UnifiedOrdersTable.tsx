import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Eye, CreditCard, Calendar, FileText, Search, Trash2, ChevronRight, ChevronDown } from "lucide-react";
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
  bundleId?: string;
  bundleName?: string;
  isBundleHeader?: boolean;
  bundleItems?: UnifiedOrder[];
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
  const [expandedBundles, setExpandedBundles] = useState<Set<string>>(new Set());

  // Bundle name mapping
  const bundleNames: Record<string, string> = {
    "FPA_GEB_001": "FPA + GEB Professional Bundle",
    "FPA_GEB_PAID_001": "FPA + GEB Professional Bundle",
    "ALL_ASSESSMENTS_001": "All Assessments Complete Package",
    "FOUNDATION_001": "Foundation Bundle (FPA + EEA)"
  };

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
      bundleId: order.bundleId,
      bundleName: order.bundleId ? bundleNames[order.bundleId] : undefined,
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
      bundleId: order.bundleId,
      bundleName: order.bundleId ? bundleNames[order.bundleId] : undefined,
    }))
  ];

  // Remove duplicates based on original order ID
  const deduplicatedOrders = allOrders.filter((order, index, array) => {
    const originalId = order.id.replace(/^(unpaid-|paid-)/, '');
    return array.findIndex(o => o.id.replace(/^(unpaid-|paid-)/, '') === originalId) === index;
  });

  // Process bundles and create bundle headers
  const bundleHeaders: UnifiedOrder[] = [];
  const bundleGroups: Record<string, UnifiedOrder[]> = {};
  const individualOrders: UnifiedOrder[] = [];

  // Group orders by bundle
  deduplicatedOrders.forEach(order => {
    if (order.bundleId) {
      if (!bundleGroups[order.bundleId]) {
        bundleGroups[order.bundleId] = [];
      }
      bundleGroups[order.bundleId].push(order);
    } else {
      individualOrders.push(order);
    }
  });

  // Create bundle headers only (no sub-items in main list)
  Object.entries(bundleGroups).forEach(([bundleId, orders]) => {
    if (orders.length > 0) {
      const firstOrder = orders[0];
      const totalAmount = orders.reduce((sum, order) => sum + order.amount, 0);
      
      // Determine bundle status based on all items
      const allCompleted = orders.every(o => o.overallStatus === "completed");
      const anyWaitingPayment = orders.some(o => o.overallStatus === "waiting_payment");
      const anyWaitingTest = orders.some(o => o.overallStatus === "waiting_test");
      const anyWaitingKyc = orders.some(o => o.overallStatus === "waiting_kyc");
      const anyRejected = orders.some(o => o.overallStatus === "rejected");

      let bundleStatus: UnifiedOrder["overallStatus"];
      if (allCompleted) bundleStatus = "completed";
      else if (anyWaitingPayment) bundleStatus = "waiting_payment";
      else if (anyWaitingTest) bundleStatus = "waiting_test";
      else if (anyWaitingKyc) bundleStatus = "waiting_kyc";
      else if (anyRejected) bundleStatus = "rejected";
      else bundleStatus = "waiting_payment";

      // Update bundle items to have consistent order ID
      const bundleOrderId = `BUNDLE-${bundleId}`;
      const updatedBundleItems = orders.map(order => ({
        ...order,
        orderId: bundleOrderId
      }));

      // Create bundle header
      const bundleHeader: UnifiedOrder = {
        id: `bundle-${bundleId}`,
        orderId: bundleOrderId,
        testName: firstOrder.bundleName || `Bundle ${bundleId}`,
        amount: totalAmount,
        orderDate: firstOrder.orderDate,
        paymentStatus: orders.every(o => o.paymentStatus === "paid") ? "paid" : "unpaid",
        testStatus: orders.every(o => o.testStatus === "taken") ? "taken" : 
                   orders.some(o => o.testStatus === "scheduled") ? "scheduled" : "not_taken",
        kycStatus: orders.every(o => o.kycStatus === "approved") ? "approved" :
                  orders.some(o => o.kycStatus === "rejected") ? "rejected" : "pending",
        overallStatus: bundleStatus,
        bundleId,
        bundleName: firstOrder.bundleName,
        isBundleHeader: true,
        bundleItems: updatedBundleItems
      };

      bundleHeaders.push(bundleHeader);
    }
  });

  // Combine bundle headers and individual orders
  const processedOrders = [...bundleHeaders, ...individualOrders];

  const unifiedOrders = processedOrders;

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

  const toggleBundleExpansion = (bundleId: string) => {
    setExpandedBundles(prev => {
      const newSet = new Set(prev);
      if (newSet.has(bundleId)) {
        newSet.delete(bundleId);
      } else {
        newSet.add(bundleId);
      }
      return newSet;
    });
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
                         order.orderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (order.bundleName && order.bundleName.toLowerCase().includes(searchQuery.toLowerCase()));
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
                  <TableHead>Test Name / Bundle</TableHead>
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
                  order.isBundleHeader ? (
                    <Collapsible key={order.id} open={expandedBundles.has(order.bundleId!)} onOpenChange={() => toggleBundleExpansion(order.bundleId!)}>
                      <CollapsibleTrigger asChild>
                        <TableRow className="bg-muted/50 font-semibold hover:bg-muted/70 cursor-pointer">
                          <TableCell className="font-medium">
                            <div className="flex items-center gap-2">
                              {expandedBundles.has(order.bundleId!) ? (
                                <ChevronDown size={16} />
                              ) : (
                                <ChevronRight size={16} />
                              )}
                              {order.orderId}
                            </div>
                          </TableCell>
                          <TableCell className="font-medium text-primary">
                            {order.testName}
                            <div className="text-xs text-muted-foreground mt-1">
                              {order.bundleItems?.length} assessments
                            </div>
                          </TableCell>
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
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleViewOrder(order);
                                }}
                                className="flex items-center gap-2"
                              >
                                <Eye size={16} />
                              </Button>
                              <Badge variant="secondary" className="text-xs">
                                Bundle
                              </Badge>
                            </div>
                          </TableCell>
                        </TableRow>
                      </CollapsibleTrigger>
                      <CollapsibleContent asChild>
                        <>
                          {order.bundleItems?.map((subOrder) => (
                            <TableRow key={`${order.id}-${subOrder.id}`} className="bg-background/50">
                              <TableCell className="font-medium pl-8">
                                <div className="flex items-center gap-2">
                                  <span className="text-muted-foreground">└─</span>
                                  {subOrder.orderId}
                                </div>
                              </TableCell>
                              <TableCell className="pl-8">{subOrder.testName}</TableCell>
                              <TableCell>{subOrder.orderDate}</TableCell>
                              <TableCell>${subOrder.amount}</TableCell>
                              <TableCell>
                                <Badge variant={subOrder.paymentStatus === "paid" ? "default" : "destructive"}>
                                  {subOrder.paymentStatus === "paid" ? "Paid" : "Unpaid"}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <Badge variant={
                                  subOrder.testStatus === "taken" ? "default" : 
                                  subOrder.testStatus === "scheduled" ? "secondary" : "outline"
                                }>
                                  {subOrder.testStatus === "taken" ? "Taken" : 
                                   subOrder.testStatus === "scheduled" ? "Scheduled" : "Not Taken"}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <Badge variant={
                                  subOrder.kycStatus === "approved" ? "default" : 
                                  subOrder.kycStatus === "rejected" ? "destructive" : "secondary"
                                }>
                                  {subOrder.kycStatus === "approved" ? "Approved" : 
                                   subOrder.kycStatus === "rejected" ? "Rejected" : "Pending"}
                                </Badge>
                              </TableCell>
                              <TableCell>{getStatusBadge(subOrder.overallStatus)}</TableCell>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleViewOrder(subOrder)}
                                    className="flex items-center gap-2"
                                  >
                                    <Eye size={16} />
                                  </Button>
                                  {canRemoveOrder(subOrder.id.replace(/^(unpaid-|paid-)/, '')) && (
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => handleRemoveOrder(subOrder)}
                                      className="flex items-center gap-2 text-destructive hover:text-destructive"
                                    >
                                      <Trash2 size={16} />
                                    </Button>
                                  )}
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </>
                      </CollapsibleContent>
                    </Collapsible>
                  ) : (
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
                  )
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