import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Trash2, Tag, X, Gift } from "lucide-react";
import { useState, useEffect } from "react";
import { CartItem, useOrders } from "@/contexts/OrderContext";
import { useAffiliation } from "@/contexts/AffiliationContext";
import { useVouchers } from "@/contexts/VoucherContext";
import { toast } from "sonner";

interface Test {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  discountAmount?: number;
  partnerName?: string;
  affiliationCodeId?: string;
  description?: string;
  bookingDate?: string;
  bookingTime?: string;
  bundleId?: string;
}

const PurchasePage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { addToPaidItems, removeFromUnpaidOrders, clearCart, removeFromCart } = useOrders();
  const { markDiscountUsed } = useAffiliation();
  const { isVoucherValid, useVoucher, getVoucherByCode } = useVouchers();
  const [tests, setTests] = useState<Test[]>([]);
  const [discountCode, setDiscountCode] = useState("");
  const [voucherCode, setVoucherCode] = useState("");
  const [appliedDiscount, setAppliedDiscount] = useState<{
    code: string;
    type: "percentage" | "fixed";
    value: number;
    description: string;
  } | null>(null);
  const [appliedVouchers, setAppliedVouchers] = useState<{
    code: string;
    testType: string;
    testId: string;
  }[]>([]);
  const [isApplyingDiscount, setIsApplyingDiscount] = useState(false);
  const [isApplyingVoucher, setIsApplyingVoucher] = useState(false);

  // Mock discount codes
  const validDiscountCodes = {
    "STUDENT10": { type: "percentage" as const, value: 10, description: "Student Discount" },
    "NEWUSER15": { type: "percentage" as const, value: 15, description: "New User Discount" },
    "SAVE20": { type: "percentage" as const, value: 20, description: "Save 20%" },
    "FIXED25": { type: "fixed" as const, value: 25, description: "$25 Off" },
  };

  useEffect(() => {
    // Handle different data sources
    if (location.state?.tests) {
      // From notifications (array of test names)
      const testNames = location.state.tests as string[];
      const mockTests = testNames.map((name, index) => ({
        id: `test-${index}`,
        name,
        price: 50 + (index * 10), // Mock pricing
        description: `${name} certification exam`
      }));
      setTests(mockTests);
    } else if (location.state?.cartItems) {
      // From cart (array of CartItem objects) - legacy support
      const cartItems = location.state.cartItems as CartItem[];
      const convertedTests = cartItems.map(item => ({
        id: item.id,
        name: item.name,
        price: item.price,
        originalPrice: item.originalPrice,
        discountAmount: item.discountAmount ?? (item.originalPrice && item.price < item.originalPrice ? item.originalPrice - item.price : undefined),
        partnerName: item.partnerName,
        affiliationCodeId: item.affiliationCodeId,
        description: `${item.name} certification exam`,
        bookingDate: item.bookingDate ? item.bookingDate.toLocaleDateString() : undefined,
        bookingTime: item.bookingTime,
        bundleId: item.bundleId, // Preserve bundle information
      }));
      setTests(convertedTests);
    } else if (location.state?.selectedOrders) {
      // From selected orders (new flow)
      const selectedOrders = location.state.selectedOrders as any[];
      const convertedTests = selectedOrders.map(order => ({
        id: order.id,
        name: order.name,
        price: order.price,
        originalPrice: order.originalPrice,
        discountAmount: order.discountAmount,
        partnerName: order.partnerName,
        affiliationCodeId: order.affiliationCodeId,
        description: `${order.name} certification exam`,
        bookingDate: order.bookingDate ? order.bookingDate.toLocaleDateString() : undefined,
        bookingTime: order.bookingTime,
        bundleId: order.bundleId,
      }));
      setTests(convertedTests);
    } else {
      // Default empty state
      setTests([]);
    }
  }, [location.state]);

  const handleRemoveItem = (testId: string) => {
    setTests(prev => prev.filter(test => test.id !== testId));
    removeFromCart(testId);
  };

  const handleApplyDiscount = async () => {
    if (!discountCode.trim()) return;
    
    setIsApplyingDiscount(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const upperCode = discountCode.toUpperCase();
    const discount = validDiscountCodes[upperCode as keyof typeof validDiscountCodes];
    
    if (discount) {
      setAppliedDiscount({
        code: upperCode,
        type: discount.type,
        value: discount.value,
        description: discount.description
      });
      setDiscountCode("");
      toast.success(`Discount applied: ${discount.description}`);
    } else {
      toast.error("Invalid discount code");
    }
    
    setIsApplyingDiscount(false);
  };

  const handleRemoveDiscount = () => {
    setAppliedDiscount(null);
    toast.success("Discount removed");
  };

  const handleApplyVoucher = async () => {
    if (!voucherCode.trim()) return;
    
    setIsApplyingVoucher(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const upperCode = voucherCode.toUpperCase();
    const voucher = getVoucherByCode(upperCode);
    
    if (!voucher) {
      toast.error("Invalid voucher code");
      setIsApplyingVoucher(false);
      return;
    }

    if (voucher.status === 'used') {
      toast.error("This voucher has already been used");
      setIsApplyingVoucher(false);
      return;
    }

    // Find matching test for this voucher
    const matchingTest = tests.find(test => test.name === voucher.testType);
    
    if (!matchingTest) {
      toast.error(`No ${voucher.testType} test found in your cart`);
      setIsApplyingVoucher(false);
      return;
    }

    // Check if voucher already applied to this test
    const alreadyApplied = appliedVouchers.some(v => v.testId === matchingTest.id);
    if (alreadyApplied) {
      toast.error("A voucher is already applied to this test");
      setIsApplyingVoucher(false);
      return;
    }

    setAppliedVouchers(prev => [...prev, {
      code: upperCode,
      testType: voucher.testType,
      testId: matchingTest.id,
    }]);
    
    setVoucherCode("");
    toast.success(`100% discount voucher applied to ${voucher.testType} test`);
    setIsApplyingVoucher(false);
  };

  const handleRemoveVoucher = (testId: string) => {
    setAppliedVouchers(prev => prev.filter(v => v.testId !== testId));
    toast.success("Voucher removed");
  };

  const handleProceedToPayment = () => {
    // Mock payment processing
    console.log("Processing payment for:", tests);
    console.log("Applied discount:", appliedDiscount);
    console.log("Applied vouchers:", appliedVouchers);
    
    // Mark vouchers as used
    appliedVouchers.forEach(voucher => {
      useVoucher(voucher.code);
    });
    
    // Mark affiliation discounts as used after successful payment
    tests.forEach(test => {
      if (test.affiliationCodeId && test.discountAmount && test.discountAmount > 0) {
        markDiscountUsed(test.affiliationCodeId, test.name);
      }
    });
    
    // Move items from unpaid to paid
    const paidItems = tests.map(test => ({
      id: test.id,
      testName: test.name,
      amount: test.price,
      datePaid: new Date().toLocaleDateString(),
      bookingDate: test.bookingDate ? new Date(test.bookingDate) : undefined,
      bookingTime: test.bookingTime,
    }));
    
    addToPaidItems(paidItems);
    
    // Remove from unpaid orders if they were there
    tests.forEach(test => {
      removeFromUnpaidOrders(test.id);
    });
    
    // Clear cart
    clearCart();
    
    toast.success("Payment Successful! Your order is confirmed.");
    navigate("/dashboard/orders");
  };

  const subtotal = tests.reduce((sum, test) => sum + test.price, 0);
  
  // Calculate discount amount from regular discount codes
  let discountAmount = 0;
  if (appliedDiscount) {
    if (appliedDiscount.type === "percentage") {
      discountAmount = Math.round(subtotal * (appliedDiscount.value / 100));
    } else {
      discountAmount = Math.min(appliedDiscount.value, subtotal);
    }
  }
  
  // Calculate voucher discounts (100% off specific tests)
  let voucherDiscountAmount = 0;
  appliedVouchers.forEach(voucher => {
    const test = tests.find(t => t.id === voucher.testId);
    if (test) {
      voucherDiscountAmount += test.price;
    }
  });
  
  const totalDiscountAmount = discountAmount + voucherDiscountAmount;
  const discountedSubtotal = Math.max(0, subtotal - totalDiscountAmount);
  const tax = Math.round(discountedSubtotal * 0.08); // 8% tax on discounted amount
  const total = discountedSubtotal + tax;

  return (
    <div className="container mx-auto max-w-6xl space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <h1 className="text-2xl font-bold">Checkout</h1>
      </div>

      {tests.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-muted-foreground">No tests selected for purchase.</p>
            <Button 
              className="mt-4" 
              onClick={() => navigate("/dashboard")}
            >
              Browse Tests
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Order Details */}
          <div className="lg:col-span-2 space-y-6">
            {(() => {
              // Group tests by bundleId
              const groupedTests = tests.reduce((acc, test) => {
                const key = test.bundleId || `individual-${test.id}`;
                if (!acc[key]) {
                  acc[key] = [];
                }
                acc[key].push(test);
                return acc;
              }, {} as Record<string, Test[]>);

              const bundles = Object.entries(groupedTests).filter(([key, items]) => 
                items[0].bundleId && items.length > 1
              );
              
              const individualItems = Object.entries(groupedTests).filter(([key, items]) => 
                !items[0].bundleId || items.length === 1
              ).map(([_, items]) => items[0]);

              return (
                <>
                  {/* Render Bundles */}
                  {bundles.map(([bundleId, bundleTests]) => {
                    const bundleTotal = bundleTests.reduce((sum, test) => sum + test.price, 0);
                    return (
                      <Card key={bundleId}>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-primary rounded-full"></div>
                            Bundle ({bundleTests.length} items) - ${bundleTotal}
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          {bundleTests.map((test) => (
                            <Card key={test.id} className="bg-muted/30">
                              <CardContent className="p-4">
                                <div className="flex items-start justify-between">
                                  <div className="flex-1">
                                    <h3 className="text-lg font-semibold">{test.name}</h3>
                                    {test.description && (
                                      <p className="text-muted-foreground text-sm mt-1">{test.description}</p>
                                    )}
                                     {test.bookingDate && (
                                       <p className="text-sm text-primary mt-2 font-medium">
                                         Booked for: {test.bookingDate}
                                         {test.bookingTime && ` at ${test.bookingTime}`}
                                       </p>
                                     )}
                                     <div className="flex items-center gap-2 mt-2">
                                       {test.originalPrice && test.discountAmount && test.discountAmount > 0 ? (
                                         <>
                                           <span className="text-lg text-muted-foreground line-through">${test.originalPrice}</span>
                                           <span className="text-lg font-bold text-green-600">${test.price}</span>
                                           <span className="text-sm text-green-600">(-${test.discountAmount})</span>
                                            {test.partnerName && (
                                              <div className="mt-1">
                                                <Badge variant="secondary" className="text-xs">
                                                  {test.partnerName} Discount
                                                </Badge>
                                                {test.affiliationCodeId && (
                                                  <div className="text-xs text-muted-foreground mt-1">
                                                    Code: {test.affiliationCodeId}
                                                  </div>
                                                )}
                                              </div>
                                            )}
                                         </>
                                       ) : (
                                         <span className="text-lg font-bold text-primary">${test.price}</span>
                                       )}
                                     </div>
                                  </div>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleRemoveItem(test.id)}
                                    className="text-destructive hover:text-destructive"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </CardContent>
                      </Card>
                    );
                  })}

                  {/* Render Individual Items */}
                  {individualItems.length > 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle>Individual Items</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {individualItems.map((test) => (
                          <Card key={test.id} className="bg-muted/30">
                            <CardContent className="p-4">
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <h3 className="text-lg font-semibold">{test.name}</h3>
                                  {test.description && (
                                    <p className="text-muted-foreground text-sm mt-1">{test.description}</p>
                                  )}
                                   {test.bookingDate && (
                                     <p className="text-sm text-primary mt-2 font-medium">
                                       Booked for: {test.bookingDate}
                                       {test.bookingTime && ` at ${test.bookingTime}`}
                                     </p>
                                   )}
                                   <div className="flex items-center gap-2 mt-2">
                                     {test.originalPrice && test.discountAmount && test.discountAmount > 0 ? (
                                       <>
                                         <span className="text-lg text-muted-foreground line-through">${test.originalPrice}</span>
                                         <span className="text-lg font-bold text-green-600">${test.price}</span>
                                         <span className="text-sm text-green-600">(-${test.discountAmount})</span>
                                          {test.partnerName && (
                                            <div className="mt-1">
                                              <Badge variant="secondary" className="text-xs">
                                                {test.partnerName} Discount
                                              </Badge>
                                              {test.affiliationCodeId && (
                                                <div className="text-xs text-muted-foreground mt-1">
                                                  Code: {test.affiliationCodeId}
                                                </div>
                                              )}
                                            </div>
                                          )}
                                       </>
                                     ) : (
                                       <span className="text-lg font-bold text-primary">${test.price}</span>
                                     )}
                                   </div>
                                </div>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleRemoveItem(test.id)}
                                  className="text-destructive hover:text-destructive"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </CardContent>
                    </Card>
                  )}
                </>
              );
            })()}
          </div>

          {/* Right Column: Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent>
                 <div className="space-y-3 mb-4">
                   {tests.map((test) => (
                     <div key={test.id} className="flex justify-between text-sm">
                       <span className="flex-1">{test.name}</span>
                       <div className="flex items-center gap-2">
                         {test.originalPrice && test.discountAmount && test.discountAmount > 0 ? (
                           <>
                             <span className="text-muted-foreground line-through">${test.originalPrice}</span>
                             <span className="font-medium text-green-600">${test.price}</span>
                           </>
                         ) : (
                           <span>${test.price}</span>
                         )}
                       </div>
                     </div>
                   ))}
                 </div>
                
                <Separator className="mb-4" />
                
                {/* Discount Code Section */}
                <div className="mb-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Tag className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Discount Code</span>
                  </div>
                  
                  {appliedDiscount ? (
                    <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800/50 rounded-md">
                      <div className="flex items-center gap-2">
                        <Tag className="h-4 w-4 text-green-600" />
                        <div>
                          <p className="text-sm font-medium text-green-700 dark:text-green-300">
                            {appliedDiscount.code}
                          </p>
                          <p className="text-xs text-green-600 dark:text-green-400">
                            {appliedDiscount.description}
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleRemoveDiscount}
                        className="text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <Input
                        placeholder="Enter discount code"
                        value={discountCode}
                        onChange={(e) => setDiscountCode(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleApplyDiscount()}
                        className="flex-1"
                      />
                      <Button
                        variant="outline"
                        onClick={handleApplyDiscount}
                        disabled={!discountCode.trim() || isApplyingDiscount}
                        className="px-4"
                      >
                        {isApplyingDiscount ? "Applying..." : "Apply"}
                      </Button>
                    </div>
                  )}
                </div>
                
                 {/* Voucher Code Section */}
                 <div className="mb-4">
                   <div className="flex items-center gap-2 mb-3">
                     <Gift className="h-4 w-4 text-muted-foreground" />
                     <span className="text-sm font-medium">Voucher Code</span>
                   </div>
                   
                   {appliedVouchers.length > 0 ? (
                     <div className="space-y-2">
                       {appliedVouchers.map((voucher) => {
                         const test = tests.find(t => t.id === voucher.testId);
                         return (
                           <div key={voucher.code} className="flex items-center justify-between p-3 bg-primary/5 border border-primary/20 rounded-md">
                             <div className="flex items-center gap-2">
                               <Gift className="h-4 w-4 text-primary" />
                               <div>
                                 <div className="text-sm font-medium">{voucher.code}</div>
                                 <div className="text-xs text-muted-foreground">100% off {test?.name}</div>
                               </div>
                             </div>
                             <Button
                               variant="ghost"
                               size="sm"
                               onClick={() => handleRemoveVoucher(voucher.testId)}
                               className="text-muted-foreground hover:text-destructive"
                             >
                               <X className="h-4 w-4" />
                             </Button>
                           </div>
                         );
                       })}
                     </div>
                   ) : (
                     <div className="flex gap-2">
                       <Input
                         placeholder="Enter voucher code"
                         value={voucherCode}
                         onChange={(e) => setVoucherCode(e.target.value.toUpperCase())}
                         onKeyPress={(e) => e.key === 'Enter' && handleApplyVoucher()}
                       />
                       <Button
                         onClick={handleApplyVoucher}
                         disabled={!voucherCode.trim() || isApplyingVoucher}
                         size="sm"
                       >
                         {isApplyingVoucher ? "Applying..." : "Apply"}
                       </Button>
                     </div>
                   )}
                 </div>
                 
                 {/* Voucher Code Section */}
                 <div className="mb-4">
                   <div className="flex items-center gap-2 mb-3">
                     <Gift className="h-4 w-4 text-muted-foreground" />
                     <span className="text-sm font-medium">Voucher Code</span>
                   </div>
                   
                   {appliedVouchers.length > 0 ? (
                     <div className="space-y-2">
                       {appliedVouchers.map((voucher) => {
                         const test = tests.find(t => t.id === voucher.testId);
                         return (
                           <div key={voucher.code} className="flex items-center justify-between p-3 bg-primary/5 border border-primary/20 rounded-md">
                             <div className="flex items-center gap-2">
                               <Gift className="h-4 w-4 text-primary" />
                               <div>
                                 <div className="text-sm font-medium">{voucher.code}</div>
                                 <div className="text-xs text-muted-foreground">100% off {test?.name}</div>
                               </div>
                             </div>
                             <Button
                               variant="ghost"
                               size="sm"
                               onClick={() => handleRemoveVoucher(voucher.testId)}
                               className="text-muted-foreground hover:text-destructive"
                             >
                               <X className="h-4 w-4" />
                             </Button>
                           </div>
                         );
                       })}
                     </div>
                   ) : (
                     <div className="flex gap-2">
                       <Input
                         placeholder="Enter voucher code"
                         value={voucherCode}
                         onChange={(e) => setVoucherCode(e.target.value.toUpperCase())}
                         onKeyPress={(e) => e.key === 'Enter' && handleApplyVoucher()}
                       />
                       <Button
                         onClick={handleApplyVoucher}
                         disabled={!voucherCode.trim() || isApplyingVoucher}
                         size="sm"
                       >
                         {isApplyingVoucher ? "Applying..." : "Apply"}
                       </Button>
                     </div>
                   )}
                 </div>
                 
                 <Separator className="mb-4" />
                 
                 {/* Subtotal and Discounts */}
                 <div className="space-y-2 text-sm">
                   <div className="flex justify-between">
                     <span>Subtotal</span>
                     <span>${subtotal}</span>
                   </div>
                   
                   {appliedDiscount && (
                     <div className="flex justify-between text-green-600">
                       <span>Discount ({appliedDiscount.code})</span>
                       <span>-${discountAmount}</span>
                     </div>
                   )}
                   
                   {voucherDiscountAmount > 0 && (
                     <div className="flex justify-between text-green-600">
                       <span>Voucher Discounts</span>
                       <span>-${voucherDiscountAmount}</span>
                     </div>
                   )}
                   
                   <div className="flex justify-between">
                     <span>Tax (8%)</span>
                     <span>${tax}</span>
                   </div>
                 </div>
                 
                 <Separator className="my-3" />
                 
                 <div className="flex justify-between font-semibold text-lg">
                   <span>Total</span>
                   <span>${total}</span>
                 </div>
                 
                 <Button 
                   className="w-full mt-6" 
                   size="lg"
                   onClick={handleProceedToPayment}
                 >
                   Proceed to Payment - ${total}
                 </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};

export default PurchasePage;