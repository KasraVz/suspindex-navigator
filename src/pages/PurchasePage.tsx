import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Clock, PlayCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { CartItem } from "@/contexts/OrderContext";

interface Test {
  id: string;
  name: string;
  price: number;
  description?: string;
}

const PurchasePage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [tests, setTests] = useState<Test[]>([]);

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
      // From cart (array of CartItem objects)
      const cartItems = location.state.cartItems as CartItem[];
      const convertedTests = cartItems.map(item => ({
        id: item.id,
        name: item.name,
        price: item.price,
        description: `${item.name} certification exam`
      }));
      setTests(convertedTests);
    } else {
      // Default empty state
      setTests([]);
    }
  }, [location.state]);

  const total = tests.reduce((sum, test) => sum + test.price, 0);

  const handleTakeNow = (test: Test) => {
    // Mock navigation to exam
    console.log(`Taking ${test.name} now`);
  };

  const handleBookLater = (test: Test) => {
    navigate("/dashboard/exams/booked");
  };

  const handlePayNow = () => {
    // Mock payment processing
    console.log("Processing payment for:", tests);
    // Navigate to orders page after "payment"
    navigate("/dashboard/orders");
  };

  const handleAddToCart = () => {
    // Mock add to cart
    console.log("Adding to cart:", tests);
    navigate("/dashboard");
  };

  return (
    <div className="container mx-auto max-w-4xl space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <h1 className="text-2xl font-bold">Purchase Tests</h1>
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
        <>
          <div className="space-y-4">
            {tests.map((test) => (
              <Card key={test.id}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold">{test.name}</h3>
                      {test.description && (
                        <p className="text-muted-foreground mt-1">{test.description}</p>
                      )}
                      <p className="text-lg font-bold text-primary mt-2">${test.price}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleTakeNow(test)}
                        className="flex items-center gap-2"
                      >
                        <PlayCircle className="h-4 w-4" />
                        Take Test Now!
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => handleBookLater(test)}
                        className="flex items-center gap-2"
                      >
                        <Clock className="h-4 w-4" />
                        Book for Later
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 mb-4">
                {tests.map((test) => (
                  <div key={test.id} className="flex justify-between">
                    <span>{test.name}</span>
                    <span>${test.price}</span>
                  </div>
                ))}
              </div>
              <Separator className="mb-4" />
              <div className="flex justify-between text-lg font-semibold mb-6">
                <span>Total:</span>
                <span>${total}</span>
              </div>
              <div className="flex gap-4">
                <Button 
                  className="flex-1" 
                  onClick={handlePayNow}
                >
                  Pay Now
                </Button>
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={handleAddToCart}
                >
                  Add to Cart
                </Button>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export default PurchasePage;