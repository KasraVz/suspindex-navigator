import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, CreditCard, Search, Package } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useOrders } from "@/contexts/OrderContext";
import { ViewOrderDetailsDialog } from "./ViewOrderDetailsDialog";
import { UnifiedOrder } from "./UnifiedOrdersTable";

interface OrderBundle {
  bundleId: string;
  items: any[];
  totalAmount: number;
  orderDate: string;
}

export function UnpaidOrdersTable() {
  const navigate = useNavigate();
  const { unpaidOrders, removeUnpaidBundle, removeFromUnpaidOrders } = useOrders();
  const [selectedOrder, setSelectedOrder] = useState<UnifiedOrder | null>(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const totalUnpaidAmount = unpaidOrders.reduce((sum, order) => sum + order.amount, 0);

  // Group items by bundleId
  const groupedOrders = unpaidOrders.reduce((acc, order) => {
    if (order.bundleId) {
      if (!acc.bundles[order.bundleId]) {
        acc.bundles[order.bundleId] = {
          bundleId: order.bundleId,
          items: [],
          totalAmount: 0,
          orderDate: order.dateAdded
        };
      }
      acc.bundles[order.bundleId].items.push(order);
      acc.bundles[order.bundleId].totalAmount += order.amount;
    } else {
      acc.individual.push(order);
    }
    return acc;
  }, { bundles: {} as Record<string, OrderBundle>, individual: [] as any[] });

  const handleViewOrder = (order: any) => {
    // Convert to UnifiedOrder format for the dialog
    const unifiedOrder: UnifiedOrder = {
      id: order.id,
      orderId: `ORD-${order.id}`,
      testName: order.testName,
      amount: order.amount,
      orderDate: order.dateAdded,
      paymentStatus: "unpaid" as const,
      testStatus: "not_taken" as const,
      kycStatus: "pending" as const,
      overallStatus: "waiting_payment" as const,
      bookingDate: order.bookingDate,
      bookingTime: order.bookingTime,
    };
    
    setSelectedOrder(unifiedOrder);
    setShowDetailsDialog(true);
  };

  const handlePayBundle = (bundle: OrderBundle) => {
    const cartItems = bundle.items.map(item => ({
      id: item.id,
      name: item.testName,
      price: item.amount,
      bookingDate: item.bookingDate,
      bookingTime: item.bookingTime,
      status: item.status,
      bundleId: item.bundleId
    }));
    
    navigate("/dashboard/purchase", { state: { cartItems } });
  };

  const handlePayIndividual = (order: any) => {
    const cartItems = [{
      id: order.id,
      name: order.testName,
      price: order.amount,
      bookingDate: order.bookingDate,
      bookingTime: order.bookingTime,
      status: order.status
    }];
    
    navigate("/dashboard/purchase", { state: { cartItems } });
  };

  const handlePayAll = () => {
    const allCartItems = unpaidOrders.map(order => ({
      id: order.id,
      name: order.testName,
      price: order.amount,
      bookingDate: order.bookingDate,
      bookingTime: order.bookingTime,
      status: order.status,
      bundleId: order.bundleId
    }));
    
    navigate("/dashboard/purchase", { state: { cartItems: allCartItems } });
  };

  const filteredBundles = Object.values(groupedOrders.bundles).filter(bundle =>
    bundle.items.some(item => 
      item.testName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      `BUNDLE-${bundle.bundleId}`.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const filteredIndividual = groupedOrders.individual.filter(order =>
    order.testName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    `ORD-${order.id}`.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Unpaid Orders</CardTitle>
            {unpaidOrders.length > 0 && (
              <Button onClick={handlePayAll} className="flex items-center gap-2">
                <CreditCard size={16} />
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
                        <div className="flex items-center gap-2">
                          <Package className="h-4 w-4 text-primary" />
                          <Badge variant="outline">Bundle ({bundle.items.length} items)</Badge>
                        </div>
                        <div className="text-sm text-muted-foreground ml-6">
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
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => handlePayBundle(bundle)}
                          className="flex items-center gap-2"
                        >
                          <CreditCard size={16} />
                          Pay Bundle (${bundle.totalAmount})
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewOrder(bundle.items[0])}
                        >
                          <Eye size={16} />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                
                {/* Individual order rows */}
                {filteredIndividual.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell>
                      <div className="font-mono text-sm">ORD-{order.id}</div>
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
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => handlePayIndividual(order)}
                          className="flex items-center gap-2"
                        >
                          <CreditCard size={16} />
                          Pay Now
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewOrder(order)}
                        >
                          <Eye size={16} />
                        </Button>
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
}