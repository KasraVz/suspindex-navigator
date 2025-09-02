import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";

interface UnpaidItem {
  id: string;
  testName: string;
  price: number;
  addedDate: string;
}

interface PaidOrder {
  id: string;
  orderId: string;
  date: string;
  amount: number;
  status: "completed" | "processing" | "cancelled";
  tests: string[];
}

const MyOrdersPage = () => {
  const navigate = useNavigate();
  const [selectedUnpaidItems, setSelectedUnpaidItems] = useState<string[]>([]);

  // Mock data
  const unpaidItems: UnpaidItem[] = [
    { id: "1", testName: "FPA", price: 50, addedDate: "2024-01-15" },
    { id: "2", testName: "EEA", price: 75, addedDate: "2024-01-14" },
    { id: "3", testName: "GEB", price: 60, addedDate: "2024-01-13" },
  ];

  const paidOrders: PaidOrder[] = [
    {
      id: "1",
      orderId: "ORD-2024-001",
      date: "2024-01-10",
      amount: 125,
      status: "completed",
      tests: ["FPA", "EEA"]
    },
    {
      id: "2", 
      orderId: "ORD-2024-002",
      date: "2024-01-05",
      amount: 80,
      status: "processing",
      tests: ["GEB"]
    },
    {
      id: "3",
      orderId: "ORD-2024-003", 
      date: "2023-12-28",
      amount: 95,
      status: "completed",
      tests: ["FPA", "EEA"]
    },
  ];

  const handleSelectItem = (itemId: string, checked: boolean) => {
    if (checked) {
      setSelectedUnpaidItems([...selectedUnpaidItems, itemId]);
    } else {
      setSelectedUnpaidItems(selectedUnpaidItems.filter(id => id !== itemId));
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedUnpaidItems(unpaidItems.map(item => item.id));
    } else {
      setSelectedUnpaidItems([]);
    }
  };

  const handlePaySelected = () => {
    const selectedItems = unpaidItems.filter(item => 
      selectedUnpaidItems.includes(item.id)
    );
    
    // Navigate to purchase page with selected items
    navigate("/dashboard/purchase", {
      state: { 
        cartItems: selectedItems.map(item => ({
          id: item.id,
          name: item.testName,
          price: item.price
        }))
      }
    });
  };

  const selectedTotal = unpaidItems
    .filter(item => selectedUnpaidItems.includes(item.id))
    .reduce((sum, item) => sum + item.price, 0);

  const getStatusBadge = (status: PaidOrder["status"]) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-success text-success-foreground">Completed</Badge>;
      case "processing":
        return <Badge className="bg-warning text-warning-foreground">Processing</Badge>;
      case "cancelled":
        return <Badge variant="destructive">Cancelled</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  return (
    <div className="container mx-auto max-w-6xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">My Orders</h1>
          <p className="text-muted-foreground">Manage your test purchases and order history</p>
        </div>
        <Button onClick={() => navigate("/dashboard/orders/new")} size="lg">
          <Plus className="w-4 h-4 mr-2" />
          Order New Assessments
        </Button>
      </div>

      <Tabs defaultValue="unpaid" className="space-y-6">
        <TabsList>
          <TabsTrigger value="unpaid">Unpaid ({unpaidItems.length})</TabsTrigger>
          <TabsTrigger value="paid">Order History ({paidOrders.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="unpaid" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Unpaid Items</CardTitle>
            </CardHeader>
            <CardContent>
              {unpaidItems.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">No unpaid items</p>
              ) : (
                <>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-12">
                          <Checkbox
                            checked={selectedUnpaidItems.length === unpaidItems.length}
                            onCheckedChange={handleSelectAll}
                          />
                        </TableHead>
                        <TableHead>Test Name</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Added Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {unpaidItems.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell>
                            <Checkbox
                              checked={selectedUnpaidItems.includes(item.id)}
                              onCheckedChange={(checked) => 
                                handleSelectItem(item.id, checked as boolean)
                              }
                            />
                          </TableCell>
                          <TableCell className="font-medium">{item.testName}</TableCell>
                          <TableCell>${item.price}</TableCell>
                          <TableCell>{item.addedDate}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  
                  {selectedUnpaidItems.length > 0 && (
                    <div className="flex items-center justify-between mt-6 p-4 bg-muted rounded-lg">
                      <div>
                        <p className="font-medium">
                          {selectedUnpaidItems.length} item(s) selected
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Total: ${selectedTotal}
                        </p>
                      </div>
                      <Button onClick={handlePaySelected}>
                        Pay Selected
                      </Button>
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="paid" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Order History</CardTitle>
            </CardHeader>
            <CardContent>
              {paidOrders.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">No order history</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order ID</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Tests</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paidOrders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell className="font-medium">{order.orderId}</TableCell>
                        <TableCell>{order.date}</TableCell>
                        <TableCell>
                          <div className="max-w-xs">
                            {order.tests.join(", ")}
                          </div>
                        </TableCell>
                        <TableCell>${order.amount}</TableCell>
                        <TableCell>{getStatusBadge(order.status)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MyOrdersPage;