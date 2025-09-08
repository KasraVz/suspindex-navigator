import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X, Calendar, Edit, Briefcase, TrendingUp, MapPin } from "lucide-react";
import { BookingDialog } from "./BookingDialog";
import { ProfileUpdateDialog } from "./ProfileUpdateDialog";
import { useState, useEffect } from "react";
import { OrderItemData } from "@/pages/OrderAssessmentsPage";
import { useBusinessProfile } from "@/contexts/BusinessProfileContext";

interface OrderItemProps {
  item: OrderItemData;
  onAssessmentChange: (id: string, assessment: string) => void;
  onConfigurationChange: (id: string, field: keyof OrderItemData, value: string) => void;
  onTakeNow: (id: string) => void;
  onBooking: (id: string, date: Date, time: string) => void;
  onRemove?: () => void;
}

export function OrderItem({ 
  item, 
  onAssessmentChange,
  onConfigurationChange, 
  onTakeNow, 
  onBooking, 
  onRemove 
}: OrderItemProps) {
  const [showBookingDialog, setShowBookingDialog] = useState(false);
  const [showEditBooking, setShowEditBooking] = useState(false);
  const [showProfileUpdateDialog, setShowProfileUpdateDialog] = useState(false);
  const [pendingProfileChanges, setPendingProfileChanges] = useState<string[]>([]);
  const { businessProfile, updateBusinessProfile } = useBusinessProfile();

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

  const industryOptions = [
    "Artificial Intelligence & Machine Learning",
    "Biotechnology & Life Sciences", 
    "Software & SaaS",
    "Hardware & IoT (Internet of Things)",
    "E-commerce & Retail",
    "Fintech (Financial Technology)",
    "Energy & Cleantech",
    "Healthcare & Wellness",
    "Education & EdTech",
    "Media & Entertainment",
    "Social Enterprise & Impact",
    "Manufacturing & Industrial",
    "Agriculture & FoodTech",
    "Transportation & Logistics",
    "Creative Industries (e.g., Design, Fashion, Arts)",
    "Tourism & Hospitality",
    "Real Estate & PropTech",
    "LegalTech",
    "Cybersecurity",
    "Robotics",
    "Space Technology",
    "Environmental Technology",
    "Marketing & Advertising Technology",
    "Supply Chain & Logistics Technology",
    "Gaming",
    "Non-profit/Charity (Tech-enabled)",
    "Consulting (with a tech focus)",
    "Market Research & Analytics",
    "Other"
  ];

  const developmentStages = [
    "Idea/Conceptualization Phase",
    "Early Prototype/MVP (Minimum Viable Product) Stage",
    "Building Initial Traction/Early Customers",
    "Generating Revenue",
    "Scaling & Growth Phase",
    "Established & Expanding"
  ];

  const checkForProfileChanges = (field: keyof OrderItemData, value: string) => {
    const changes: string[] = [];
    
    if (field === 'industry' && value !== businessProfile.primaryIndustry) {
      changes.push(`Industry: ${businessProfile.primaryIndustry} → ${value}`);
    }
    if (field === 'developmentStage' && value !== businessProfile.developmentStage) {
      changes.push(`Development Stage: ${businessProfile.developmentStage} → ${value}`);
    }
    if (field === 'targetEcosystem' && value !== businessProfile.targetEcosystem) {
      changes.push(`Target Ecosystem: ${businessProfile.targetEcosystem} → ${value}`);
    }

    if (changes.length > 0) {
      setPendingProfileChanges(changes);
      setShowProfileUpdateDialog(true);
    }
  };

  const handleConfigurationChange = (field: keyof OrderItemData, value: string) => {
    onConfigurationChange(item.id, field, value);
    checkForProfileChanges(field, value);
  };

  const handleUpdateProfile = () => {
    const updates: Partial<any> = {};
    if (item.industry && item.industry !== businessProfile.primaryIndustry) {
      updates.primaryIndustry = item.industry;
    }
    if (item.developmentStage && item.developmentStage !== businessProfile.developmentStage) {
      updates.developmentStage = item.developmentStage;
    }
    if (item.targetEcosystem && item.targetEcosystem !== businessProfile.targetEcosystem) {
      updates.targetEcosystem = item.targetEcosystem;
    }
    
    updateBusinessProfile(updates);
    setShowProfileUpdateDialog(false);
  };

  const handleKeepCurrentProfile = () => {
    setShowProfileUpdateDialog(false);
  };

  // Determine which fields to show based on assessment type
  const showIndustry = item.assessment === "FPA" || item.assessment === "EEA";
  const showStage = item.assessment === "FPA" || item.assessment === "GEB" || item.assessment === "EEA";
  const showTargetEcosystem = item.assessment === "EEA";

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
              <div className="space-y-4">
                {/* Configuration Fields */}
                <div className="space-y-3">
                  {showIndustry && (
                    <div className="space-y-2">
                      <Label className="flex items-center gap-2 text-sm font-medium">
                        <Briefcase className="w-4 h-4" />
                        Industry
                      </Label>
                      <Select
                        value={item.industry || ""}
                        onValueChange={(value) => handleConfigurationChange('industry', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select industry" />
                        </SelectTrigger>
                        <SelectContent className="z-50 bg-popover">
                          {industryOptions.map((industry) => (
                            <SelectItem key={industry} value={industry}>
                              {industry}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  {showStage && (
                    <div className="space-y-2">
                      <Label className="flex items-center gap-2 text-sm font-medium">
                        <TrendingUp className="w-4 h-4" />
                        Development Stage
                      </Label>
                      <Select
                        value={item.developmentStage || ""}
                        onValueChange={(value) => handleConfigurationChange('developmentStage', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select development stage" />
                        </SelectTrigger>
                        <SelectContent className="z-50 bg-popover">
                          {developmentStages.map((stage) => (
                            <SelectItem key={stage} value={stage}>
                              {stage}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  {showTargetEcosystem && (
                    <div className="space-y-2">
                      <Label className="flex items-center gap-2 text-sm font-medium">
                        <MapPin className="w-4 h-4" />
                        Target Ecosystem
                      </Label>
                      <Input
                        value={item.targetEcosystem || ""}
                        onChange={(e) => handleConfigurationChange('targetEcosystem', e.target.value)}
                        placeholder="Enter target ecosystem"
                      />
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
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

        <ProfileUpdateDialog
          open={showProfileUpdateDialog}
          onOpenChange={setShowProfileUpdateDialog}
          onUpdateProfile={handleUpdateProfile}
          onKeepCurrent={handleKeepCurrentProfile}
          changes={pendingProfileChanges}
        />
      </CardContent>
    </Card>
  );
}