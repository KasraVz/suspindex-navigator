import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Building2, Globe, Briefcase, TrendingUp, MapPin, Edit2, Save, X } from "lucide-react";
import { useState } from "react";
import { useBusinessProfile } from "@/contexts/BusinessProfileContext";

const INDUSTRY_OPTIONS = [
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

const DEVELOPMENT_STAGES = [
  "Idea/Conceptualization Phase",
  "Early Prototype/MVP (Minimum Viable Product) Stage",
  "Building Initial Traction/Early Customers",
  "Generating Revenue",
  "Scaling & Growth Phase",
  "Established & Expanding"
];

export function BusinessProfile() {
  const [isEditing, setIsEditing] = useState(false);
  const { businessProfile, updateBusinessProfile } = useBusinessProfile();
  const [tempData, setTempData] = useState(businessProfile);
  
  const handleEdit = () => {
    setTempData(businessProfile);
    setIsEditing(true);
  };

  const handleSave = () => {
    updateBusinessProfile(tempData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setTempData(businessProfile);
    setIsEditing(false);
  };

  const updateField = (field: string, value: string) => {
    setTempData(prev => ({ ...prev, [field]: value }));
  };
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Business Profile</CardTitle>
        {!isEditing ? (
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleEdit}
          >
            <Edit2 className="w-4 h-4 mr-2" />
            Edit
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleCancel}
            >
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
            <Button 
              size="sm"
              onClick={handleSave}
            >
              <Save className="w-4 h-4 mr-2" />
              Save
            </Button>
          </div>
        )}
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium">
              <Building2 className="w-4 h-4" />
              Startup Name
            </div>
            {isEditing ? (
              <Input
                value={tempData.startupName}
                onChange={(e) => updateField('startupName', e.target.value)}
                placeholder="Enter startup name"
              />
            ) : (
              <div className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-md">
                {businessProfile.startupName}
              </div>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium">
              <Globe className="w-4 h-4" />
              Startup Website
            </div>
            {isEditing ? (
              <Input
                value={tempData.startupWebsite}
                onChange={(e) => updateField('startupWebsite', e.target.value)}
                placeholder="Enter website URL"
              />
            ) : (
              <div className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-md">
                <a 
                  href={businessProfile.startupWebsite} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  {businessProfile.startupWebsite}
                </a>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm font-medium">
            <Briefcase className="w-4 h-4" />
            Primary Industry/Field
          </div>
          {isEditing ? (
            <Select value={tempData.primaryIndustry} onValueChange={(value) => updateField('primaryIndustry', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select industry" />
              </SelectTrigger>
              <SelectContent>
                {INDUSTRY_OPTIONS.map((industry) => (
                  <SelectItem key={industry} value={industry}>
                    {industry}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <div className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-md">
              {businessProfile.primaryIndustry}
            </div>
          )}
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm font-medium">
            <TrendingUp className="w-4 h-4" />
            Current Stage of Development
          </div>
          {isEditing ? (
            <Select value={tempData.developmentStage} onValueChange={(value) => updateField('developmentStage', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select development stage" />
              </SelectTrigger>
              <SelectContent>
                {DEVELOPMENT_STAGES.map((stage) => (
                  <SelectItem key={stage} value={stage}>
                    {stage}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <div className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-md">
              {businessProfile.developmentStage}
            </div>
          )}
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm font-medium">
            <MapPin className="w-4 h-4" />
            Target Ecosystem for Future Development
          </div>
          {isEditing ? (
            <Input
              value={tempData.targetEcosystem}
              onChange={(e) => updateField('targetEcosystem', e.target.value)}
              placeholder="Enter target ecosystem"
            />
          ) : (
            <div className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-md">
              {businessProfile.targetEcosystem}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}