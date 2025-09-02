import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { X, Calendar, Edit } from "lucide-react";
import { BookingDialog } from "./BookingDialog";
import { useState } from "react";
import { OrderItemData } from "@/pages/OrderAssessmentsPage";

interface OrderItemProps {
  item: OrderItemData;
  onAssessmentChange: (id: string, assessment: string) => void;
  onTakeNow: (id: string) => void;
  onBooking: (id: string, date: Date, time: string) => void;
  onRemove?: () => void;
}

export function OrderItem({ 
  item, 
  onAssessmentChange, 
  onTakeNow, 
  onBooking, 
  onRemove 
}: OrderItemProps) {
  const [showBookingDialog, setShowBookingDialog] = useState(false);
  const [showEditBooking, setShowEditBooking] = useState(false);

  const handleBookingConfirm = (date: Date, time: string) => {
    onBooking(item.id, date, time);
    setShowBookingDialog(false);
    setShowEditBooking(false);
  };

  const assessmentOptions = [
    { value: "FPA", label: "FPA - Fundamental Payroll Assessment ($50)" },
    { value: "GEB", label: "GEB - General Employment Basics ($60)" },
    { value: "EEA", label: "EEA - Employment Ethics Assessment ($75)" }
  ];

  return (
    <Card className="border border-border">
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          <div className="flex-1 space-y-4">
            <div className="flex items-center gap-2">
              <Select
                value={item.assessment}
                onValueChange={(value) => onAssessmentChange(item.id, value)}
              >
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Select an assessment" />
                </SelectTrigger>
                <SelectContent>
                  {assessmentOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              {onRemove && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onRemove}
                  className="text-destructive hover:text-destructive/80"
                >
                  <X className="w-4 h-4" />
                </Button>
              )}
            </div>

            {item.assessment && (
              <div className="flex flex-col sm:flex-row gap-2">
                {item.status === "empty" && (
                  <>
                    <Button
                      onClick={() => onTakeNow(item.id)}
                      className="flex-1"
                    >
                      Take it Now!
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setShowBookingDialog(true)}
                      className="flex-1"
                    >
                      <Calendar className="w-4 h-4 mr-2" />
                      Book for Later
                    </Button>
                  </>
                )}

                {item.status === "take-now" && (
                  <div className="bg-success/10 text-success border border-success/20 rounded-md p-3">
                    <p className="text-sm font-medium">
                      Ready for immediate start after payment
                    </p>
                  </div>
                )}

                {item.status === "booked" && item.bookingDate && item.bookingTime && (
                  <div className="bg-primary/10 text-primary border border-primary/20 rounded-md p-3 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">
                        Booked for: {item.bookingDate.toLocaleDateString()} at {item.bookingTime}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowEditBooking(true)}
                      className="text-primary hover:text-primary/80"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>

          {item.assessment && (
            <div className="text-right">
              <p className="font-semibold text-lg">${item.price}</p>
            </div>
          )}
        </div>

        <BookingDialog
          open={showBookingDialog}
          onOpenChange={setShowBookingDialog}
          onConfirm={handleBookingConfirm}
          initialDate={item.bookingDate}
          initialTime={item.bookingTime}
        />

        <BookingDialog
          open={showEditBooking}
          onOpenChange={setShowEditBooking}
          onConfirm={handleBookingConfirm}
          initialDate={item.bookingDate}
          initialTime={item.bookingTime}
        />
      </CardContent>
    </Card>
  );
}