import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useOrders } from "@/contexts/OrderContext";
import { toast } from "sonner";

export function BookedTestsTable() {
  const { bookedItems, paidItems, unpaidOrders, addToCart } = useOrders();

  const handleTakeNow = (testId: string, testName: string) => {
    toast.success(`Starting ${testName} now!`);
    // Here you would typically navigate to the exam or trigger the exam start
    console.log(`Starting test: ${testName}`);
  };

  const handlePayNow = (testId: string, testName: string) => {
    // Find the item in unpaid orders to get the price
    const unpaidItem = unpaidOrders.find(item => item.id === testId);
    if (unpaidItem) {
      const cartItem = {
        id: testId,
        name: testName,
        price: unpaidItem.amount,
        bookingDate: unpaidItem.bookingDate,
        bookingTime: unpaidItem.bookingTime,
        status: unpaidItem.status
      };
      addToCart([cartItem]);
      toast.success(`${testName} added to cart for payment`);
    }
  };

  const isTestPaid = (testId: string) => {
    return paidItems.some(item => item.id === testId);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Booked Tests</CardTitle>
      </CardHeader>
      <CardContent>
        {bookedItems.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>No tests have been booked yet.</p>
            <p className="text-sm mt-2">Book a test from the "Order New Assessments" page to see it here.</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Booked Date & Time</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Payment Status</TableHead>
                <TableHead>Test Name</TableHead>
                <TableHead>Preferred Test Time</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bookedItems.map((test) => {
                const isPaid = isTestPaid(test.id);
                return (
                  <TableRow key={test.id}>
                    <TableCell>
                      {test.bookingDate.toLocaleDateString()} at {test.bookingTime}
                    </TableCell>
                    <TableCell>{test.type}</TableCell>
                    <TableCell>
                      {isPaid ? (
                        <Badge variant="default" className="bg-primary text-primary-foreground">
                          Paid
                        </Badge>
                      ) : (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handlePayNow(test.id, test.testName)}
                        >
                          Pay Now
                        </Button>
                      )}
                    </TableCell>
                    <TableCell className="font-medium">{test.testName}</TableCell>
                    <TableCell>{test.testTime}</TableCell>
                    <TableCell>
                      <Button 
                        variant="default" 
                        size="sm"
                        onClick={() => handleTakeNow(test.id, test.testName)}
                      >
                        Take it Now
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}