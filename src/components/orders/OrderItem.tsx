import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { X, Calendar, Edit, Briefcase, TrendingUp, MapPin, Clock, FileQuestion, CheckCircle2 } from "lucide-react";
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

  const assessmentTypes = {
    FPA: {
      code: "FPA",
      title: "Founder Public Awareness",
      description: "Evaluates your public visibility and market recognition as a founder.",
      duration: "45-60 minutes",
      questions: "80-120 questions",
      requiredFields: ["Stage", "Industry"],
      price: 50,
      colorClass: "bg-accent"
    },
    GEB: {
      code: "GEB",
      title: "General Entrepreneur Behavior",
      description: "Assesses your entrepreneurial mindset, decision-making, and leadership capabilities.",
      duration: "30-45 minutes",
      questions: "60-80 questions",
      requiredFields: ["Stage"],
      price: 60,
      colorClass: "bg-primary"
    },
    EEA: {
      code: "EEA",
      title: "Ecosystem Environment Assessment",
      description: "Analyzes your startup ecosystem engagement and environmental factors.",
      duration: "50-70 minutes",
      questions: "90-130 questions",
      requiredFields: ["Stage", "Industry", "Ecosystem"],
      price: 75,
      colorClass: "bg-tertiary"
    }
  };

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
            <div className="flex items-center justify-between">
              <h3 className="font-medium text-sm text-muted-foreground">
                {item.isFromAffiliate ? "Partner Requested Assessment" : "Select Assessment Type"}
              </h3>
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

            {/* Assessment Tiles */}
            <div className={`grid gap-4 ${item.isFromAffiliate ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-3'}`}>
              {item.isFromAffiliate ? (
                // Single locked tile for affiliate orders
                (() => {
                  const type = assessmentTypes[item.assessment as keyof typeof assessmentTypes];
                  if (!type) return null;
                  return (
                    <Card className="relative border-primary/30 bg-primary/5">
                      <CardContent className="p-4 space-y-3">
                        <div className="flex items-start justify-between">
                          <Badge className={`${type.colorClass} text-white`}>
                            {type.code}
                          </Badge>
                          <Badge variant="secondary" className="text-xs">
                            Partner Request
                          </Badge>
                        </div>
                        
                        <div>
                          <h4 className="font-semibold text-base mb-1">{type.title}</h4>
                          <p className="text-sm text-muted-foreground">{type.description}</p>
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Clock className="w-4 h-4" />
                            {type.duration}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <FileQuestion className="w-4 h-4" />
                            {type.questions}
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-1">
                          {type.requiredFields.map(field => (
                            <Badge key={field} variant="secondary" className="text-xs">
                              {field}
                            </Badge>
                          ))}
                        </div>

                        {item.originalPrice && item.originalPrice > item.price && (
                          <div className="bg-success/10 border border-success/20 rounded-md p-2 text-center">
                            <p className="text-sm font-medium text-success">
                              ${item.originalPrice - item.price} discount applied
                            </p>
                          </div>
                        )}

                        <div className="text-right pt-2 border-t">
                          {item.originalPrice && item.originalPrice > item.price && (
                            <span className="text-sm text-muted-foreground line-through mr-2">
                              ${item.originalPrice}
                            </span>
                          )}
                          <span className="text-xl font-bold">${item.price}</span>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })()
              ) : (
                // Interactive tiles for self-assessment
                Object.entries(assessmentTypes).map(([key, type]) => (
                  <Card
                    key={key}
                    className={`cursor-pointer transition-all duration-200 hover:scale-105 hover:shadow-md ${
                      item.assessment === key 
                        ? 'ring-2 ring-accent shadow-lg' 
                        : ''
                    }`}
                    onClick={() => onAssessmentChange(item.id, key)}
                  >
                    <CardContent className="p-4 space-y-3">
                      <div className="flex items-start justify-between">
                        <Badge className={`${type.colorClass} text-white`}>
                          {type.code}
                        </Badge>
                        {item.assessment === key && (
                          <div className="w-5 h-5 bg-accent rounded-full flex items-center justify-center">
                            <CheckCircle2 className="w-3 h-3 text-white" />
                          </div>
                        )}
                      </div>
                      
                      <div>
                        <h4 className="font-semibold text-base mb-1">{type.title}</h4>
                        <p className="text-sm text-muted-foreground line-clamp-2">{type.description}</p>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Clock className="w-4 h-4" />
                          {type.duration}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <FileQuestion className="w-4 h-4" />
                          {type.questions}
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-1">
                        {type.requiredFields.map(field => (
                          <Badge key={field} variant="secondary" className="text-xs">
                            {field}
                          </Badge>
                        ))}
                      </div>

                      <div className="text-right pt-2 border-t">
                        <span className="text-xl font-bold">${type.price}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))
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
              {item.originalPrice && item.originalPrice > item.price && (
                <div className="text-sm text-muted-foreground line-through">
                  ${item.originalPrice}
                </div>
              )}
              <p className="font-semibold text-lg">${item.price}</p>
              {item.originalPrice && item.originalPrice > item.price && (
                <div className="text-xs text-success">
                  ${item.originalPrice - item.price} off
                </div>
              )}
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