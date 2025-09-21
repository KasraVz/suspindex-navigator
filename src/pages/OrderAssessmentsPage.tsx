import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { OrderItem } from "@/components/orders/OrderItem";
import { useOrders } from "@/contexts/OrderContext";
import { useBusinessProfile } from "@/contexts/BusinessProfileContext";
import { toast } from "sonner";
import { useAffiliation } from "@/contexts/AffiliationContext";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export interface OrderItemData {
  id: string;
  assessment: string;
  bookingDate?: Date;
  bookingTime?: string;
  price: number;
  originalPrice?: number;
  status: "empty" | "take-now" | "booked";
  industry?: string;
  developmentStage?: string;
  targetEcosystem?: string;
  affiliationCodeId?: string;
  isFromAffiliate?: boolean;
}

const OrderAssessmentsPage = () => {
  const navigate = useNavigate();
  const { addToCart, addToUnpaidOrders, addToBookedItems, clearCart } = useOrders();
  const { businessProfile } = useBusinessProfile();
  const { affiliationCodes, getAvailableTests, getDiscountForTest, markDiscountUsed } = useAffiliation();
  const [orderType, setOrderType] = useState<"self" | "affiliate" | null>(null);
  const [selectedAffiliationCode, setSelectedAffiliationCode] = useState<string>("");
  const [orderItems, setOrderItems] = useState<OrderItemData[]>([]);


  const handleOrderTypeSelect = (type: "self" | "affiliate") => {
    setOrderType(type);
    if (type === "self") {
      // Initialize with empty item for self-assessment
      setOrderItems([{
        id: "1",
        assessment: "",
        price: 0,
        status: "empty"
      }]);
    } else {
      // Clear items for affiliate selection
      setOrderItems([]);
      setSelectedAffiliationCode("");
    }
  };

  const handleAffiliationCodeSelect = (codeId: string) => {
    setSelectedAffiliationCode(codeId);
    const code = affiliationCodes.find(c => c.id === codeId);
    if (!code) return;

    const availableTests = getAvailableTests(codeId);
    const newItems: OrderItemData[] = availableTests.map((test, index) => {
      const originalPrice = getAssessmentPrice(test);
      const discount = getDiscountForTest(test, codeId);
      
      return {
        id: `${Date.now()}-${index}`,
        assessment: test,
        originalPrice,
        price: originalPrice - discount,
        status: "empty",
        affiliationCodeId: codeId,
        isFromAffiliate: true,
        // Pre-populate with business profile data
        industry: (test === "FPA" || test === "EEA") ? businessProfile.primaryIndustry : undefined,
        developmentStage: (test === "FPA" || test === "GEB" || test === "EEA") ? businessProfile.developmentStage : undefined,
        targetEcosystem: test === "EEA" ? businessProfile.targetEcosystem : undefined,
      };
    });

    setOrderItems(newItems);
  };

  const addNewItem = () => {
    const newItem: OrderItemData = {
      id: Date.now().toString(),
      assessment: "",
      price: 0,
      status: "empty",
      isFromAffiliate: false
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
    const originalPrice = getAssessmentPrice(assessment);
    
    const updates: Partial<OrderItemData> = {
      assessment,
      originalPrice,
      price: originalPrice,
      status: assessment ? "empty" : "empty"
    };

    // Pre-populate with business profile data when assessment is selected
    if (assessment) {
      if (assessment === "FPA" || assessment === "EEA") {
        updates.industry = businessProfile.primaryIndustry;
      }
      if (assessment === "FPA" || assessment === "GEB" || assessment === "EEA") {
        updates.developmentStage = businessProfile.developmentStage;
      }
      if (assessment === "EEA") {
        updates.targetEcosystem = businessProfile.targetEcosystem;
      }
    }

    updateOrderItem(id, updates);
  };

  const handleConfigurationChange = (id: string, field: keyof OrderItemData, value: string) => {
    updateOrderItem(id, { [field]: value });
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
    // Only allow payment if items have booking information
    const itemsWithBooking = validItems.filter(item => 
      item.status === "booked" && item.bookingDate && item.bookingTime
    );

    if (itemsWithBooking.length === 0) {
      toast.error("Please book at least one assessment before payment");
      return;
    }

    const bundleId = itemsWithBooking.length > 1 ? `bundle-${Date.now()}` : undefined;
    
    const cartItems = itemsWithBooking.map(item => {
      const discountAmount = item.originalPrice ? item.originalPrice - item.price : 0;
      const code = item.affiliationCodeId ? affiliationCodes.find(c => c.id === item.affiliationCodeId) : null;
      
      return {
        id: item.id,
        name: item.assessment,
        price: item.price,
        originalPrice: item.originalPrice,
        discountAmount,
        affiliationCodeId: item.affiliationCodeId,
        partnerName: code?.partnerName,
        bookingDate: item.bookingDate,
        bookingTime: item.bookingTime,
        status: item.status,
        bundleId
      };
    });
    
    navigate("/dashboard/purchase", {
      state: { cartItems }
    });
  };

  const handlePayLater = () => {
    // Only create orders if they have booking information
    const itemsWithBooking = validItems.filter(item => 
      item.status === "booked" && item.bookingDate && item.bookingTime
    );

    if (itemsWithBooking.length === 0) {
      toast.error("Please book at least one assessment before saving the order");
      return;
    }

    const bundleId = itemsWithBooking.length > 1 ? `bundle-${Date.now()}` : undefined;

    const unpaidItems = itemsWithBooking.map(item => {
      const code = item.affiliationCodeId ? affiliationCodes.find(c => c.id === item.affiliationCodeId) : null;
      
      return {
        id: item.id,
        testName: item.assessment,
        amount: item.price,
        dateAdded: new Date().toLocaleDateString(),
        bookingDate: item.bookingDate!,
        bookingTime: item.bookingTime!,
        status: item.status,
        bundleId,
        testStatus: "scheduled" as const,
        kycStatus: "pending" as const,
        affiliationCodeId: item.affiliationCodeId,
        partnerName: code?.partnerName,
      };
    });

    // Add booked items to the booked items list
    const bookedItems = itemsWithBooking.map(item => ({
      id: item.id,
      testName: item.assessment,
      bookingDate: item.bookingDate!,
      bookingTime: item.bookingTime!,
      type: bundleId ? "Bundle Assessment" : "Individual Assessment",
      testTime: getTestDuration(item.assessment)
    }));
    
    // Add to unpaid orders and booked items only (no cart)
    addToUnpaidOrders(unpaidItems);
    addToBookedItems(bookedItems);
    
    toast.success(`${itemsWithBooking.length} assessment(s) booked and added to unpaid orders`);
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

      {/* Order Type Selection */}
      {!orderType && (
        <Card>
          <CardHeader>
            <CardTitle>Select Order Type</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Choose whether this order is for yourself or through a partner affiliation code.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card 
                className="cursor-pointer hover:shadow-md transition-shadow border-2 hover:border-primary/50"
                onClick={() => handleOrderTypeSelect("self")}
              >
                <CardContent className="p-6 text-center">
                  <h3 className="font-semibold mb-2">Self-Assessment</h3>
                  <p className="text-sm text-muted-foreground">
                    Order assessments for yourself at regular pricing
                  </p>
                </CardContent>
              </Card>
              
              <Card 
                className="cursor-pointer hover:shadow-md transition-shadow border-2 hover:border-primary/50"
                onClick={() => handleOrderTypeSelect("affiliate")}
              >
                <CardContent className="p-6 text-center">
                  <h3 className="font-semibold mb-2">Partner Affiliation</h3>
                  <p className="text-sm text-muted-foreground">
                    Use a partner's affiliation code for special pricing and requested tests
                  </p>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Affiliation Code Selection */}
      {orderType === "affiliate" && !selectedAffiliationCode && (
        <Card>
          <CardHeader>
            <CardTitle>Select Affiliation Code</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Choose from your active affiliation codes:</Label>
              <Select onValueChange={handleAffiliationCodeSelect}>
                <SelectTrigger>
                  <SelectValue placeholder="Select an affiliation code" />
                </SelectTrigger>
                <SelectContent>
                  {affiliationCodes
                    .filter(code => {
                      // Filter out expired codes and codes with no available tests
                      const isExpired = new Date(code.expiryDate) < new Date();
                      const availableTests = getAvailableTests(code.id);
                      return !isExpired && availableTests.length > 0;
                    })
                    .map((code) => (
                    <SelectItem key={code.id} value={code.id}>
                      <div className="flex flex-col">
                        <span>{code.partnerName}</span>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="secondary" className="text-xs">{code.code}</Badge>
                          <span className="text-sm text-muted-foreground">
                            ({getAvailableTests(code.id).length} tests available)
                          </span>
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {affiliationCodes.length === 0 && (
              <p className="text-sm text-muted-foreground">
                No affiliation codes found. Add codes in your Profile → Affiliation Codes tab first.
              </p>
            )}
            {affiliationCodes.length > 0 && 
             affiliationCodes.filter(code => {
               const isExpired = new Date(code.expiryDate) < new Date();
               const availableTests = getAvailableTests(code.id);
               return !isExpired && availableTests.length > 0;
             }).length === 0 && (
              <p className="text-sm text-muted-foreground">
                No valid affiliation codes available. All codes may be expired or have no remaining tests.
              </p>
            )}
            <Button variant="outline" onClick={() => setOrderType(null)}>
              Back to Order Type Selection
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Order Items Display */}
      {orderItems.length > 0 && (

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Assessment Selection</CardTitle>
              {orderType && (
                <Button variant="outline" size="sm" onClick={() => {
                  setOrderType(null);
                  setOrderItems([]);
                  setSelectedAffiliationCode("");
                }}>
                  Change Order Type
                </Button>
              )}
            </div>
            {selectedAffiliationCode && (
              <div className="text-sm text-muted-foreground">
                <div>Using affiliation code from: {affiliationCodes.find(c => c.id === selectedAffiliationCode)?.partnerName}</div>
                <div className="text-xs mt-1">Code: {affiliationCodes.find(c => c.id === selectedAffiliationCode)?.code}</div>
              </div>
            )}
          </CardHeader>
          <CardContent className="space-y-4">
            {orderItems.map((item, index) => (
              <OrderItem
                key={item.id}
                item={item}
                onAssessmentChange={handleAssessmentChange}
                onConfigurationChange={handleConfigurationChange}
                onTakeNow={handleTakeNow}
                onBooking={handleBooking}
                onRemove={orderItems.length > 1 || !item.isFromAffiliate ? () => removeOrderItem(item.id) : undefined}
              />
            ))}

            {orderType === "self" && (
              <Button
                variant="outline"
                onClick={addNewItem}
                className="w-full mt-4"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Another Assessment
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {validItems.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Order Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 mb-4">
              {validItems.map((item) => (
                <div key={item.id} className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium">{item.assessment}</span>
                      {item.isFromAffiliate && (
                        <Badge variant="secondary">Partner Request</Badge>
                      )}
                    </div>
                    {/* Show configuration details */}
                    <div className="text-sm text-muted-foreground space-y-1 mt-1">
                      {item.industry && (
                        <p>Industry: {item.industry}</p>
                      )}
                      {item.developmentStage && (
                        <p>Stage: {item.developmentStage}</p>
                      )}
                      {item.targetEcosystem && (
                        <p>Target Ecosystem: {item.targetEcosystem}</p>
                      )}
                    </div>
                    {/* Show booking/scheduling details */}
                    {item.status === "booked" && item.bookingDate && item.bookingTime && (
                      <p className="text-sm text-muted-foreground mt-1">
                        Booked for: {item.bookingDate.toLocaleDateString()} at {item.bookingTime}
                      </p>
                    )}
                    {item.status === "take-now" && (
                      <p className="text-sm text-success mt-1">Ready for immediate start after payment</p>
                    )}
                  </div>
                  <div className="text-right">
                    {item.originalPrice && item.originalPrice > item.price && (
                      <div className="text-sm text-muted-foreground line-through">
                        ${item.originalPrice}
                      </div>
                    )}
                    <span className="font-semibold">${item.price}</span>
                    {item.originalPrice && item.originalPrice > item.price && (
                      <div className="text-xs text-success">
                        ${item.originalPrice - item.price} discount
                      </div>
                    )}
                  </div>
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