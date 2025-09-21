import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface BookingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (date: Date, time: string) => void;
  initialDate?: Date;
  initialTime?: string;
  mode?: "booking" | "rescheduling";
}

export function BookingDialog({ 
  open, 
  onOpenChange, 
  onConfirm, 
  initialDate, 
  initialTime,
  mode = "booking"
}: BookingDialogProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(initialDate);
  const [selectedTime, setSelectedTime] = useState<string>(initialTime || "");
  const [acceptedRules, setAcceptedRules] = useState<boolean>(false);

  const timeSlots = [
    "9:00 AM",
    "10:00 AM", 
    "11:00 AM",
    "12:00 PM",
    "1:00 PM",
    "2:00 PM",
    "3:00 PM",
    "4:00 PM",
    "5:00 PM"
  ];

  const handleConfirm = () => {
    if (selectedDate && selectedTime && acceptedRules) {
      onConfirm(selectedDate, selectedTime);
      onOpenChange(false);
    }
  };

  const handleClose = () => {
    onOpenChange(false);
    // Reset to initial values when closing without confirmation
    setSelectedDate(initialDate);
    setSelectedTime(initialTime || "");
    setAcceptedRules(false);
  };

  // Only allow booking for future dates
  const disabledDates = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {mode === "rescheduling" ? "Reschedule Assessment" : "Schedule Assessment"}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div>
            <label className="text-sm font-medium mb-3 block">
              Select Date
            </label>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              disabled={disabledDates}
              initialFocus
              className={cn("p-3 pointer-events-auto border rounded-md")}
            />
          </div>

          {selectedDate && (
            <div>
              <label className="text-sm font-medium mb-3 block">
                Select Time
              </label>
              <Select value={selectedTime} onValueChange={setSelectedTime}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a time slot" />
                </SelectTrigger>
                <SelectContent>
                  {timeSlots.map((time) => (
                    <SelectItem key={time} value={time}>
                      {time}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {selectedDate && selectedTime && (
            <div className="flex items-start space-x-2">
              <Checkbox 
                id="test-rules" 
                checked={acceptedRules}
                onCheckedChange={(checked) => setAcceptedRules(checked === true)}
              />
              <Label 
                htmlFor="test-rules" 
                className="text-sm leading-relaxed cursor-pointer"
              >
                I have read and agree to the{" "}
                <a 
                  href="/test-rules" 
                  className="text-primary underline hover:no-underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Supsindex Test Rules
                </a>
              </Label>
            </div>
          )}

          <div className="flex gap-3">
            <Button 
              variant="outline" 
              onClick={handleClose}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleConfirm}
              disabled={!selectedDate || !selectedTime || !acceptedRules}
              className="flex-1"
            >
              {mode === "rescheduling" ? "Confirm Reschedule" : "Confirm Booking"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}