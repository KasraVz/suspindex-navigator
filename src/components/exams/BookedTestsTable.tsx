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
import { Calendar, Clock, Play, Trash2 } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useOrders } from "@/contexts/OrderContext";
import { useToast } from "@/hooks/use-toast";

export const BookedTestsTable = () => {
  const { bookedItems, paidItems, addToCart, removeOrder, canRemoveOrder } = useOrders();
  const { toast } = useToast();

  const handleTakeNow = (testId: string, testName: string) => {
    toast({
      title: "Starting Assessment",
      description: `Starting ${testName} now!`,
    });
    console.log(`Starting test: ${testName}`);
  };

  const handlePayNow = (testId: string, testName: string) => {
    // Find the matching unpaid order to get the correct price
    const cartItem = {
      id: testId,
      name: testName,
      price: 299, // Default price, should be fetched from unpaid orders
    };
    addToCart([cartItem]);
    toast({
      title: "Added to Cart",
      description: `${testName} added to cart for payment`,
    });
  };

  const isTestPaid = (testId: string): boolean => {
    return paidItems.some(item => item.id === testId);
  };

  const handleRemoveBooking = (testId: string, testName: string) => {
    const success = removeOrder(testId);
    if (success) {
      toast({
        title: "Booking Removed",
        description: `${testName} booking has been cancelled and removed.`,
      });
    } else {
      toast({
        title: "Cannot Remove Booking",
        description: "This booking cannot be removed. Only unpaid bookings can be cancelled.",
        variant: "destructive",
      });
    }
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
                <TableHead>Test Name</TableHead>
                <TableHead>Booking Date</TableHead>
                <TableHead>Booking Time</TableHead>
                <TableHead>Test Duration</TableHead>
                <TableHead>Payment Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bookedItems.map((test) => {
                const isPaid = isTestPaid(test.id);
                return (
                  <TableRow key={test.id}>
                    <TableCell className="font-medium">{test.testName}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        {test.bookingDate.toLocaleDateString()}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-muted-foreground" />
                        {test.bookingTime}
                      </div>
                    </TableCell>
                    <TableCell>{test.testTime}</TableCell>
                    <TableCell>
                      {isPaid ? (
                        <Badge variant="default" className="bg-primary text-primary-foreground">
                          Paid
                        </Badge>
                      ) : (
                        <Badge variant="destructive">Unpaid</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {!isPaid && (
                          <Button
                            size="sm"
                            onClick={() => handlePayNow(test.id, test.testName)}
                            className="flex items-center gap-2"
                          >
                            Pay Now
                          </Button>
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleTakeNow(test.id, test.testName)}
                          className="flex items-center gap-2"
                        >
                          <Play className="w-4 h-4" />
                          Take it Now
                        </Button>
                        {!isPaid && canRemoveOrder(test.id) && (
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="flex items-center gap-2 text-destructive hover:text-destructive"
                              >
                                <Trash2 className="w-4 h-4" />
                                Cancel
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Cancel Booking</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to cancel the booking for "{test.testName}"? This will remove the test from your schedule and unpaid orders.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Keep Booking</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleRemoveBooking(test.id, test.testName)}
                                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                >
                                  Cancel Booking
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
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
    </Card>
  );
};