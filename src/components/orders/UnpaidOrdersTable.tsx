import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Search, Trash2, Eye, Calendar, Clock, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useOrders } from "@/contexts/OrderContext";
import { ViewOrderDetailsDialog } from "./ViewOrderDetailsDialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { toast } from "sonner";

interface OrderBundle {
  bundleId: string;
  items: any[];
  totalAmount: number;
  orderDate: string;
}

const UnpaidOrdersTable = () => {
  const { 
    unpaidOrders, 
    removeFromUnpaidOrders, 
    removeUnpaidBundle, 
    canRemoveOrder,
    selectedOrderIds,
    toggleOrderSelection,
    selectAllOrders,
    deselectAllOrders,
    getSelectedOrders
  } = useOrders();
  const navigate = useNavigate();
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showRemoveDialog, setShowRemoveDialog] = useState(false);
  const [itemToRemove, setItemToRemove] = useState<{ type: 'order' | 'bundle', id: string, name: string } | null>(null);

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

  const handlePayIndividual = (order: any) => {
    const orderItems = [{
      id: order.id,
      name: order.testName,
      price: order.amount,
      bookingDate: order.bookingDate,
      bookingTime: order.bookingTime,
      bundleId: order.bundleId,
      affiliationCodeId: order.affiliationCodeId,
      partnerName: order.partnerName,
    }];
    
    navigate("/dashboard/purchase", { state: { selectedOrders: orderItems } });
  };

  const handlePayBundle = (bundleItems: any[]) => {
    const orderItems = bundleItems.map(item => ({
      id: item.id,
      name: item.testName,
      price: item.amount,
      bookingDate: item.bookingDate,
      bookingTime: item.bookingTime,
      bundleId: item.bundleId,
      affiliationCodeId: item.affiliationCodeId,
      partnerName: item.partnerName,
    }));
    
    navigate("/dashboard/purchase", { state: { selectedOrders: orderItems } });
  };

  const handlePayAll = () => {
    const allItems = filteredBundles.flatMap(bundle => bundle.items).concat(filteredIndividual);
    const orderItems = allItems.map(order => ({
      id: order.id,
      name: order.testName,
      price: order.amount,
      bookingDate: order.bookingDate,
      bookingTime: order.bookingTime,
      bundleId: order.bundleId,
      affiliationCodeId: order.affiliationCodeId,
      partnerName: order.partnerName,
    }));
    
    navigate("/dashboard/purchase", { state: { selectedOrders: orderItems } });
  };

  const handlePaySelected = () => {
    const selectedOrders = getSelectedOrders();
    const orderItems = selectedOrders.map(order => ({
      id: order.id,
      name: order.testName,
      price: order.amount,
      bookingDate: order.bookingDate,
      bookingTime: order.bookingTime,
      bundleId: order.bundleId,
      affiliationCodeId: order.affiliationCodeId,
      partnerName: order.partnerName,
    }));
    
    navigate("/dashboard/purchase", { state: { selectedOrders: orderItems } });
  };

  const selectedTotal = getSelectedOrders().reduce((sum, order) => sum + order.amount, 0);
  const hasSelections = selectedOrderIds.length > 0;
  const isAllSelected = unpaidOrders.length > 0 && selectedOrderIds.length === unpaidOrders.length;

  const handleViewOrder = (order: any) => {
    setSelectedOrder(order);
    setShowDetailsDialog(true);
  };

  const handleViewBundle = (bundle: OrderBundle) => {
    // For bundle view, show the first item but indicate it's a bundle
    const bundleOrder = {
      ...bundle.items[0],
      testName: `Bundle: ${bundle.items.map(item => item.testName).join(", ")}`,
      amount: bundle.totalAmount
    };
    setSelectedOrder(bundleOrder);
    setShowDetailsDialog(true);
  };

  const handleRemove = (type: 'order' | 'bundle', id: string, name: string) => {
    setItemToRemove({ type, id, name });
    setShowRemoveDialog(true);
  };

  const confirmRemoveOrder = () => {
    if (!itemToRemove) return;

    try {
      if (itemToRemove.type === 'bundle') {
        removeUnpaidBundle(itemToRemove.id);
        toast.success(`Bundle removed successfully`);
      } else {
        removeFromUnpaidOrders(itemToRemove.id);
        toast.success(`${itemToRemove.name} removed successfully`);
      }
    } catch (error) {
      toast.error("Failed to remove item");
    }

    setShowRemoveDialog(false);
    setItemToRemove(null);
  };

  const filteredBundles = Object.values(groupedOrders.bundles).filter(bundle =>
    bundle.items.some(item => 
      item.testName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      `BUNDLE-${bundle.bundleId}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.partnerName && item.partnerName.toLowerCase().includes(searchQuery.toLowerCase()))
    )
  );

  const filteredIndividual = groupedOrders.individual.filter(order =>
    order.testName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    `ORD-${order.id}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (order.partnerName && order.partnerName.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle>Unpaid Orders</CardTitle>
          <div className="flex gap-2">
            {hasSelections && selectedOrderIds.length < unpaidOrders.length && (
              <Button onClick={handlePaySelected} variant="outline">
                Pay Selected (${selectedTotal})
              </Button>
            )}
            {unpaidOrders.length > 0 && (
              <Button onClick={handlePayAll}>
                Pay All (${unpaidOrders.reduce((sum, order) => sum + order.amount, 0)})
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search by order ID, test name, or partner..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          
          {filteredBundles.length === 0 && filteredIndividual.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              {searchQuery ? "No unpaid orders match your search" : "No unpaid orders"}
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox
                      checked={isAllSelected}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          selectAllOrders();
                        } else {
                          deselectAllOrders();
                        }
                      }}
                    />
                  </TableHead>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Details</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Partner</TableHead>
                  <TableHead>Booking Info</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {/* Bundle rows */}
                {filteredBundles.map((bundle) => (
                  <TableRow key={bundle.bundleId}>
                    <TableCell>
                      <Checkbox
                        checked={bundle.items.every(item => selectedOrderIds.includes(item.id))}
                        onCheckedChange={(checked) => {
                          bundle.items.forEach(item => {
                            if (checked && !selectedOrderIds.includes(item.id)) {
                              toggleOrderSelection(item.id);
                            } else if (!checked && selectedOrderIds.includes(item.id)) {
                              toggleOrderSelection(item.id);
                            }
                          });
                        }}
                      />
                    </TableCell>
                    <TableCell className="font-medium">
                      Bundle ID: {bundle.bundleId}
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{bundle.items.length} Items Bundle</p>
                        <div className="text-sm text-muted-foreground">
                          {bundle.items.map(item => item.testName).join(", ")}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{bundle.orderDate}</TableCell>
                    <TableCell>${bundle.totalAmount}</TableCell>
                    <TableCell>
                      {bundle.items[0]?.partnerName && (
                        <Badge variant="secondary">{bundle.items[0].partnerName}</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleViewBundle(bundle)}
                        className="flex items-center gap-1 text-sm"
                      >
                        <Calendar className="h-3 w-3" />
                        View Booking Details
                      </Button>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handlePayBundle(bundle.items)}
                        >
                          Pay Bundle
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewBundle(bundle)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemove('bundle', bundle.bundleId, `Bundle ${bundle.bundleId}`)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                
                {/* Individual order rows */}
                {filteredIndividual.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedOrderIds.includes(order.id)}
                        onCheckedChange={() => toggleOrderSelection(order.id)}
                      />
                    </TableCell>
                    <TableCell className="font-medium">{order.id}</TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{order.testName}</p>
                        <div className="text-sm text-muted-foreground">
                          Status: {order.testStatus || "Pending"} | KYC: {order.kycStatus || "Pending"}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{order.dateAdded}</TableCell>
                    <TableCell>${order.amount}</TableCell>
                    <TableCell>
                      {order.partnerName && (
                        <Badge variant="secondary">{order.partnerName}</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleViewOrder(order)}
                        className="flex items-center gap-1 text-sm"
                      >
                        <Calendar className="h-3 w-3" />
                        View Booking Details
                      </Button>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handlePayIndividual(order)}
                        >
                          Pay Now
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewOrder(order)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        {canRemoveOrder(order.id) && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemove('order', order.id, order.testName)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
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
            <AlertDialogTitle>Remove {itemToRemove?.type === 'bundle' ? 'Bundle' : 'Order'}</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove {itemToRemove?.name}? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmRemoveOrder} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Remove {itemToRemove?.type === 'bundle' ? 'Bundle' : 'Order'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default UnpaidOrdersTable;