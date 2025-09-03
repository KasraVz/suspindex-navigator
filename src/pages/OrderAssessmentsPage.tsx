import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { OrderItem } from "@/components/orders/OrderItem";
import { useOrders } from "@/contexts/OrderContext";
import { toast } from "sonner";

export interface OrderItemData {
  id: string;
  assessment: string;
  bookingDate?: Date;
  bookingTime?: string;
  price: number;
  status: "empty" | "take-now" | "booked";
}

const OrderAssessmentsPage = () => {
  const navigate = useNavigate();
  const { addToCart, addToUnpaidOrders, addToBookedItems, clearCart } = useOrders();
  const [orderItems, setOrderItems] = useState<OrderItemData[]>([
    {
      id: "1",
      assessment: "",
      price: 0,
      status: "empty"
    }
  ]);

  // Clear cart when starting a new order session to prevent bundle mixing
  useEffect(() => {
    clearCart();
  }, [clearCart]);

  const addNewItem = () => {
    const newItem: OrderItemData = {
      id: Date.now().toString(),
      assessment: "",
      price: 0,
      status: "empty"
    };
    setOrderItems([...orderItems, newItem]);
  };

  const updateOrderItem = (id: string, updates: Partial<OrderItemData>) => {
    setOrderItems(items =>
      items.map(item =>
        item.id === id ? { ...item, ...updates } : item
      )
    );
  };

  const removeOrderItem = (id: string) => {
    if (orderItems.length > 1) {
      setOrderItems(items => items.filter(item => item.id !== id));
    }
  };

  const getAssessmentPrice = (assessment: string) => {
    switch (assessment) {
      case "FPA":
        return 50;
      case "GEB":
        return 60;
      case "EEA":
        return 75;
      default:
        return 0;
    }
  };

  const handleAssessmentChange = (id: string, assessment: string) => {
    updateOrderItem(id, {
      assessment,
      price: getAssessmentPrice(assessment),
      status: assessment ? "empty" : "empty"
    });
  };

  const handleTakeNow = (id: string) => {
    updateOrderItem(id, { status: "take-now" });
  };

  const handleBooking = (id: string, date: Date, time: string) => {
    updateOrderItem(id, {
      bookingDate: date,
      bookingTime: time,
      status: "booked"
    });
  };

  const validItems = orderItems.filter(item => item.assessment && item.status !== "empty");
  const totalAmount = validItems.reduce((sum, item) => sum + item.price, 0);

  const handlePayNow = () => {
    const bundleId = validItems.length > 1 ? `bundle-${Date.now()}` : undefined;
    
    const cartItems = validItems.map(item => ({
      id: item.id,
      name: item.assessment,
      price: item.price,
      bookingDate: item.bookingDate,
      bookingTime: item.bookingTime,
      status: item.status,
      bundleId
    }));
    
    addToCart(cartItems);
    navigate("/dashboard/purchase", {
      state: { cartItems }
    });
  };

  const handlePayLater = () => {
    const bundleId = validItems.length > 1 ? `bundle-${Date.now()}` : undefined;
    
    const cartItems = validItems.map(item => ({
      id: item.id,
      name: item.assessment,
      price: item.price,
      bookingDate: item.bookingDate,
      bookingTime: item.bookingTime,
      status: item.status,
      bundleId
    }));

    const unpaidItems = validItems.map(item => ({
      id: item.id,
      testName: item.assessment,
      amount: item.price,
      dateAdded: new Date().toLocaleDateString(),
      bookingDate: item.bookingDate,
      bookingTime: item.bookingTime,
      status: item.status,
      bundleId
    }));

    // Add booked items to the booked items list
    const bookedOnlyItems = validItems.filter(item => item.status === "booked" && item.bookingDate && item.bookingTime);
    const bookedItems = bookedOnlyItems.map(item => ({
      id: item.id,
      testName: item.assessment,
      bookingDate: item.bookingDate!,
      bookingTime: item.bookingTime!,
      type: "Individual", // Default type, could be made configurable
      testTime: getTestDuration(item.assessment)
    }));
    
    // Add to cart, unpaid orders, and booked items (if applicable)
    addToCart(cartItems);
    addToUnpaidOrders(unpaidItems);
    if (bookedItems.length > 0) {
      addToBookedItems(bookedItems);
    }
    
    toast.success(`${validItems.length} item(s) added to cart and saved for later payment`);
    navigate("/dashboard/orders");
  };

  const getTestDuration = (assessment: string) => {
    switch (assessment) {
      case "FPA":
        return "120 minutes";
      case "GEB":
        return "90 minutes";
      case "EEA":
        return "150 minutes";
      default:
        return "90 minutes";
    }
  };

  return (
    <div className="container mx-auto max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Order New Assessments</h1>
        <p className="text-muted-foreground">
          Configure your assessment orders and choose when to take them
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Assessment Selection</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {orderItems.map((item, index) => (
            <OrderItem
              key={item.id}
              item={item}
              onAssessmentChange={handleAssessmentChange}
              onTakeNow={handleTakeNow}
              onBooking={handleBooking}
              onRemove={orderItems.length > 1 ? () => removeOrderItem(item.id) : undefined}
            />
          ))}

          <Button
            variant="outline"
            onClick={addNewItem}
            className="w-full mt-4"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Another Assessment
          </Button>
        </CardContent>
      </Card>

      {validItems.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Order Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 mb-4">
              {validItems.map((item) => (
                <div key={item.id} className="flex justify-between items-center">
                  <div>
                    <span className="font-medium">{item.assessment}</span>
                    {item.status === "booked" && item.bookingDate && item.bookingTime && (
                      <p className="text-sm text-muted-foreground">
                        Booked for: {item.bookingDate.toLocaleDateString()} at {item.bookingTime}
                      </p>
                    )}
                    {item.status === "take-now" && (
                      <p className="text-sm text-success">Ready for immediate start after payment</p>
                    )}
                  </div>
                  <span className="font-semibold">${item.price}</span>
                </div>
              ))}
            </div>
            
            <div className="border-t pt-4">
              <div className="flex justify-between items-center mb-4">
                <span className="text-lg font-semibold">Total: ${totalAmount}</span>
              </div>
              
              <div className="flex gap-4">
                <Button onClick={handlePayNow} className="flex-1">
                  Pay Now
                </Button>
                <Button variant="outline" onClick={handlePayLater} className="flex-1">
                  Pay Later
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default OrderAssessmentsPage;