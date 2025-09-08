import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Eye, CreditCard, Trash2 } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { ViewOrderDetailsDialog } from "./ViewOrderDetailsDialog";
import { useOrders, UnifiedOrder } from "@/contexts/OrderContext";
import { useToast } from "@/hooks/use-toast";

interface OrderBundle {
  bundleId: string;
  items: any[];
  totalAmount: number;
  orderDate: string;
}

export const UnpaidOrdersTable = () => {
  const [selectedOrder, setSelectedOrder] = useState<UnifiedOrder | null>(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { unpaidOrders, addToCart, removeOrder, canRemoveOrder } = useOrders();
  const { toast } = useToast();

  const totalUnpaidAmount = unpaidOrders.reduce((sum, order) => sum + order.amount, 0);

  // Group orders by bundleId
  const bundles: OrderBundle[] = [];
  const individual: any[] = [];

  unpaidOrders.forEach(order => {
    if (order.bundleId) {
      let bundle = bundles.find(b => b.bundleId === order.bundleId);
      if (!bundle) {
        bundle = {
          bundleId: order.bundleId,
          items: [],
          totalAmount: 0,
          orderDate: order.dateAdded
        };
        bundles.push(bundle);
      }
      bundle.items.push(order);
      bundle.totalAmount += order.amount;
    } else {
      individual.push(order);
    }
  });

  const handleViewOrder = (order: any) => {
    const unifiedOrder: UnifiedOrder = {
      id: order.id,
      orderId: order.orderId || `ORD-${order.id}`,
      testName: order.testName,
      amount: order.amount,
      paymentStatus: "unpaid" as const,
      testStatus: order.testStatus || "not_taken" as const,
      kycStatus: order.kycStatus || "pending" as const,
      overallStatus: "pending_payment" as const,
      dateAdded: order.dateAdded,
      bookingDate: order.bookingDate,
      bookingTime: order.bookingTime,
      bundleId: order.bundleId,
      assessmentType: order.assessmentType
    };
    
    setSelectedOrder(unifiedOrder);
    setShowDetailsDialog(true);
  };

  const handlePayBundle = (bundleId: string, items: any[]) => {
    const cartItems = items.map(item => ({
      id: item.id,
      name: item.testName,
      price: item.amount,
      bookingDate: item.bookingDate,
      bookingTime: item.bookingTime,
      bundleId: item.bundleId
    }));
    addToCart(cartItems);
    toast({
      title: "Bundle Added to Cart",
      description: `Bundle with ${items.length} items added to cart.`,
    });
  };

  const handlePayIndividual = (order: any) => {
    const cartItems = [{
      id: order.id,
      name: order.testName,
      price: order.amount,
      bookingDate: order.bookingDate,
      bookingTime: order.bookingTime
    }];
    addToCart(cartItems);
    toast({
      title: "Added to Cart",
      description: `${order.testName} has been added to your cart.`,
    });
  };

  const handlePayAll = () => {
    const cartItems = unpaidOrders.map(order => ({
      id: order.id,
      name: order.testName,
      price: order.amount,
      bookingDate: order.bookingDate,
      bookingTime: order.bookingTime,
      bundleId: order.bundleId
    }));
    addToCart(cartItems);
    toast({
      title: "Added to Cart",
      description: `All ${unpaidOrders.length} unpaid orders have been added to your cart.`,
    });
  };

  const handleRemoveOrder = (orderId: string, orderName: string) => {
    const success = removeOrder(orderId);
    if (success) {
      toast({
        title: "Order Removed",
        description: `${orderName} has been successfully removed.`,
      });
    } else {
      toast({
        title: "Cannot Remove Order",
        description: "This order cannot be removed.",
        variant: "destructive",
      });
    }
  };

  const filteredBundles = bundles.filter(bundle =>
    bundle.items.some(item => 
      item.testName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      `BUNDLE-${bundle.bundleId}`.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const filteredIndividual = individual.filter(order =>
    order.testName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (order.orderId && order.orderId.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Unpaid Orders</CardTitle>
            {unpaidOrders.length > 0 && (
              <Button onClick={handlePayAll} className="flex items-center gap-2">
                <CreditCard className="w-4 h-4" />
                Pay All (${totalUnpaidAmount})
              </Button>
            )}
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search by order ID or test name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardHeader>
        <CardContent>
          {filteredBundles.length === 0 && filteredIndividual.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              {searchQuery ? "No unpaid orders match your search" : "No unpaid orders"}
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Order Details</TableHead>
                  <TableHead>Date Added</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Booking Info</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {/* Bundle rows */}
                {filteredBundles.map((bundle) => (
                  <TableRow key={bundle.bundleId} className="bg-muted/30">
                    <TableCell>
                      <div className="font-mono text-sm">BUNDLE-{bundle.bundleId}</div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <Badge variant="outline">Bundle ({bundle.items.length} items)</Badge>
                        <div className="text-sm text-muted-foreground">
                          {bundle.items.map(item => item.testName).join(", ")}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{bundle.orderDate}</TableCell>
                    <TableCell className="font-semibold">${bundle.totalAmount}</TableCell>
                    <TableCell>
                      {bundle.items.some(item => item.bookingDate) ? (
                        <Badge variant="secondary">Has Bookings</Badge>
                      ) : (
                        <span className="text-muted-foreground">No bookings</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handlePayBundle(bundle.bundleId, bundle.items)}
                          className="flex items-center gap-2"
                        >
                          <CreditCard className="w-4 h-4" />
                          Pay Bundle (${bundle.totalAmount})
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewOrder(bundle.items[0])}
                          className="flex items-center gap-2"
                        >
                          <Eye className="w-4 h-4" />
                          View
                        </Button>
                        {bundle.items.every(item => canRemoveOrder(item.id)) && (
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="flex items-center gap-2 text-destructive hover:text-destructive"
                              >
                                <Trash2 className="w-4 h-4" />
                                Remove Bundle
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Remove Bundle</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to remove this entire bundle? This will remove all {bundle.items.length} assessments in this bundle.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => {
                                    bundle.items.forEach(item => handleRemoveOrder(item.id, item.testName));
                                  }}
                                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                >
                                  Remove Bundle
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                
                {/* Individual order rows */}
                {filteredIndividual.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell>
                      <div className="font-mono text-sm">{order.orderId || `ORD-${order.id}`}</div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{order.testName}</div>
                    </TableCell>
                    <TableCell>{order.dateAdded}</TableCell>
                    <TableCell className="font-semibold">${order.amount}</TableCell>
                    <TableCell>
                      {order.bookingDate && order.bookingTime ? (
                        <div className="text-sm">
                          <div>{order.bookingDate.toLocaleDateString()}</div>
                          <div className="text-muted-foreground">{order.bookingTime}</div>
                        </div>
                      ) : (
                        <span className="text-muted-foreground">No booking</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handlePayIndividual(order)}
                          className="flex items-center gap-2"
                        >
                          <CreditCard className="w-4 h-4" />
                          Pay Now
                        </Button>
                        <Button
                          variant="ghost"
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
                                variant="ghost"
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
                                  {order.bookingDate && " This will also cancel the associated booking."}
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