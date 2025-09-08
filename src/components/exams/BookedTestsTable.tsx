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
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { useOrders } from "@/contexts/OrderContext";
import { toast } from "sonner";
import { Calendar, Trash2, X } from "lucide-react";
import { useState } from "react";

export function BookedTestsTable() {
  const { bookedItems, paidItems, unpaidOrders, addToCart, cancelBooking, removeOrder, canRemoveOrder } = useOrders();
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [showRemoveDialog, setShowRemoveDialog] = useState(false);
  const [selectedTest, setSelectedTest] = useState<{id: string, name: string} | null>(null);

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

  const handleCancelBooking = (testId: string, testName: string) => {
    setSelectedTest({id: testId, name: testName});
    setShowCancelDialog(true);
  };

  const handleRemoveOrder = (testId: string, testName: string) => {
    setSelectedTest({id: testId, name: testName});
    setShowRemoveDialog(true);
  };

  const confirmCancelBooking = () => {
    if (selectedTest) {
      cancelBooking(selectedTest.id);
      toast.success(`Booking for ${selectedTest.name} cancelled. Order remains in unpaid orders.`);
    }
    setShowCancelDialog(false);
    setSelectedTest(null);
  };

  const confirmRemoveOrder = () => {
    if (selectedTest && removeOrder(selectedTest.id)) {
      toast.success(`Order for ${selectedTest.name} removed completely.`);
    } else {
      toast.error("Failed to remove order. Order may be paid or test already taken.");
    }
    setShowRemoveDialog(false);
    setSelectedTest(null);
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
                <TableHead>Manage</TableHead>
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
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleCancelBooking(test.id, test.testName)}
                          className="flex items-center gap-2"
                        >
                          <X size={14} />
                          Cancel Booking
                        </Button>
                        {canRemoveOrder(test.id) && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveOrder(test.id, test.testName)}
                            className="flex items-center gap-2 text-destructive hover:text-destructive"
                          >
                            <Trash2 size={14} />
                            Remove Order
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </CardContent>

      <AlertDialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel Booking</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to cancel the booking for {selectedTest?.name}? 
              The order will remain in your unpaid orders and you can book it again later.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep Booking</AlertDialogCancel>
            <AlertDialogAction onClick={confirmCancelBooking}>
              Cancel Booking
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={showRemoveDialog} onOpenChange={setShowRemoveDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Order</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to completely remove the order for {selectedTest?.name}? 
              This will cancel the booking and remove the order entirely. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmRemoveOrder} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Remove Order
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}