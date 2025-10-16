import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { AssessmentCatalog, assessmentTypes } from "@/components/orders/AssessmentCatalog";
import { AssessmentConfigCard } from "@/components/orders/AssessmentConfigCard";
import { useOrders } from "@/contexts/OrderContext";
import { useBusinessProfile } from "@/contexts/BusinessProfileContext";
import { toast } from "sonner";
import { useAffiliation } from "@/contexts/AffiliationContext";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { ShoppingCart } from "lucide-react";

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
  const { addToUnpaidOrders, addToBookedItems } = useOrders();
  const { businessProfile } = useBusinessProfile();
  const { affiliationCodes, getAvailableTests, getDiscountForTest } = useAffiliation();
  const [orderType, setOrderType] = useState<"self" | "affiliate" | null>(null);
  const [selectedAffiliationCode, setSelectedAffiliationCode] = useState<string>("");
  const [selectedAssessments, setSelectedAssessments] = useState<string[]>([]);
  const [orderItems, setOrderItems] = useState<OrderItemData[]>([]);


  const handleAddAssessment = (assessment: string) => {
    if (selectedAssessments.includes(assessment)) {
      toast.info("Assessment already added to cart");
      return;
    }

    const originalPrice = getAssessmentPrice(assessment);
    let finalPrice = originalPrice;
    let affiliationCodeId = undefined;
    let isFromAffiliate = false;

    // Apply affiliate discount if applicable
    if (orderType === "affiliate" && selectedAffiliationCode) {
      const discount = getDiscountForTest(assessment, selectedAffiliationCode);
      finalPrice = originalPrice - discount;
      affiliationCodeId = selectedAffiliationCode;
      isFromAffiliate = true;
    }

    const newItem: OrderItemData = {
      id: `${Date.now()}-${assessment}`,
      assessment,
      originalPrice,
      price: finalPrice,
      status: "empty",
      affiliationCodeId,
      isFromAffiliate,
      // Pre-populate with business profile data
      industry: (assessment === "FPA" || assessment === "EEA") ? businessProfile.primaryIndustry : undefined,
      developmentStage: businessProfile.developmentStage,
      targetEcosystem: assessment === "EEA" ? businessProfile.targetEcosystem : undefined,
    };

    setSelectedAssessments([...selectedAssessments, assessment]);
    setOrderItems([...orderItems, newItem]);
    toast.success(`${assessment} added to cart`);
  };

  const handleOrderTypeSelect = (type: "self" | "affiliate") => {
    setOrderType(type);
    if (type === "affiliate") {
      setSelectedAffiliationCode("");
    }
  };

  const handleAffiliationCodeSelect = (codeId: string) => {
    setSelectedAffiliationCode(codeId);
    const code = affiliationCodes.find(c => c.id === codeId);
    if (!code) return;

    const availableTests = getAvailableTests(codeId);
    
    // Pre-select assessments from affiliation code
    setSelectedAssessments(availableTests);
    
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
        industry: (test === "FPA" || test === "EEA") ? businessProfile.primaryIndustry : undefined,
        developmentStage: businessProfile.developmentStage,
        targetEcosystem: test === "EEA" ? businessProfile.targetEcosystem : undefined,
      };
    });

    setOrderItems(newItems);
  };

  const removeOrderItem = (id: string) => {
    const item = orderItems.find(i => i.id === id);
    if (item) {
      setSelectedAssessments(selectedAssessments.filter(a => a !== item.assessment));
      setOrderItems(orderItems.filter(i => i.id !== id));
      toast.success(`${item.assessment} removed from cart`);
    }
  };

  const updateOrderItem = (id: string, updates: Partial<OrderItemData>) => {
    setOrderItems(items =>
      items.map(item =>
        item.id === id ? { ...item, ...updates } : item
      )
    );
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

  const calculateBundleDiscount = () => {
    const uniqueAssessments = new Set(orderItems.map(i => i.assessment));
    const count = uniqueAssessments.size;
    
    if (count === 3) return 20; // $20 off for all three
    if (count === 2) return 10; // $10 off for two
    return 0;
  };

  const validItems = orderItems.filter(item => item.assessment && item.status !== "empty");
  const subtotal = validItems.reduce((sum, item) => sum + item.price, 0);
  const bundleDiscount = orderType === "self" ? calculateBundleDiscount() : 0;
  const totalAmount = subtotal - bundleDiscount;

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

  const lockedAssessments = orderType === "affiliate" && selectedAffiliationCode 
    ? getAvailableTests(selectedAffiliationCode) 
    : [];

  return (
    <div className="container mx-auto max-w-6xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Order New Assessments</h1>
        <p className="text-muted-foreground">
          Select assessments from the catalog, configure each one, and proceed to payment
        </p>
      </div>

      {/* Assessment Catalog - Always Visible */}
      <AssessmentCatalog
        selectedAssessments={selectedAssessments}
        onAddAssessment={handleAddAssessment}
        lockedAssessments={lockedAssessments}
      />

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

      {/* Selected Assessments Cart */}
      {orderItems.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShoppingCart className="w-5 h-5" />
                <CardTitle>Selected Assessments ({orderItems.length})</CardTitle>
              </div>
              {orderType && (
                <Button variant="outline" size="sm" onClick={() => {
                  setOrderType(null);
                  setOrderItems([]);
                  setSelectedAssessments([]);
                  setSelectedAffiliationCode("");
                }}>
                  Reset Order
                </Button>
              )}
            </div>
            {selectedAffiliationCode && (
              <div className="text-sm text-muted-foreground">
                <div>Using affiliation code from: {affiliationCodes.find(c => c.id === selectedAffiliationCode)?.partnerName}</div>
                <div className="text-xs mt-1">Code: {affiliationCodes.find(c => c.id === selectedAffiliationCode)?.code}</div>
              </div>
            )}
            {bundleDiscount > 0 && (
              <div className="bg-success/10 border border-success/20 rounded-md p-3 mt-2">
                <p className="text-sm font-medium text-success">
                  🎉 Bundle discount! You're saving ${bundleDiscount}
                </p>
              </div>
            )}
          </CardHeader>
          <CardContent className="space-y-4">
            {orderItems.map((item) => (
              <AssessmentConfigCard
                key={item.id}
                item={item}
                onConfigurationChange={handleConfigurationChange}
                onTakeNow={handleTakeNow}
                onBooking={handleBooking}
                onRemove={() => removeOrderItem(item.id)}
                canRemove={!item.isFromAffiliate}
              />
            ))}
          </CardContent>
        </Card>
      )}

      {validItems.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Order Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 mb-4">
              <div className="flex justify-between text-base">
                <span className="text-muted-foreground">Subtotal:</span>
                <span className="font-medium">${subtotal}</span>
              </div>
              
              {bundleDiscount > 0 && (
                <div className="flex justify-between text-base text-success">
                  <span className="font-medium">Bundle Discount:</span>
                  <span className="font-semibold">-${bundleDiscount}</span>
                </div>
              )}
              
              {orderType === "affiliate" && validItems.some(item => item.originalPrice && item.originalPrice > item.price) && (
                <div className="flex justify-between text-base text-success">
                  <span className="font-medium">Partner Discount:</span>
                  <span className="font-semibold">
                    -${validItems.reduce((sum, item) => 
                      sum + (item.originalPrice && item.originalPrice > item.price ? item.originalPrice - item.price : 0), 0
                    )}
                  </span>
                </div>
              )}
            </div>

            <div className="flex justify-between items-center text-xl font-bold pt-3 border-t">
              <span>Total:</span>
              <span className="text-primary">${totalAmount}</span>
            </div>

            <div className="mt-4 p-3 bg-muted/50 rounded-md">
              <p className="text-sm text-muted-foreground">
                {validItems.filter(i => i.status === "booked").length} assessment(s) scheduled • {validItems.filter(i => i.status === "take-now").length} ready to start
              </p>
            </div>
            
            <div className="flex gap-4 mt-4">
              <Button onClick={handlePayNow} className="flex-1">
                Pay Now
              </Button>
              <Button variant="outline" onClick={handlePayLater} className="flex-1">
                Pay Later
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default OrderAssessmentsPage;