import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, Globe, Briefcase, TrendingUp, MapPin } from "lucide-react";

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

// Mock data - this would come from user registration data
const mockBusinessData = {
  startupName: "TechFlow Solutions",
  startupWebsite: "https://www.techflowsolutions.com",
  primaryIndustry: "Software & SaaS",
  developmentStage: "Building Initial Traction/Early Customers",
  targetEcosystem: "Silicon Valley"
};

export function BusinessProfile() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Business Profile</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium">
              <Building2 className="w-4 h-4" />
              Startup Name
            </div>
            <div className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-md">
              {mockBusinessData.startupName}
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium">
              <Globe className="w-4 h-4" />
              Startup Website
            </div>
            <div className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-md">
              <a 
                href={mockBusinessData.startupWebsite} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                {mockBusinessData.startupWebsite}
              </a>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm font-medium">
            <Briefcase className="w-4 h-4" />
            Primary Industry/Field
          </div>
          <div className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-md">
            {mockBusinessData.primaryIndustry}
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm font-medium">
            <TrendingUp className="w-4 h-4" />
            Current Stage of Development
          </div>
          <div className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-md">
            {mockBusinessData.developmentStage}
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm font-medium">
            <MapPin className="w-4 h-4" />
            Target Ecosystem for Future Development
          </div>
          <div className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-md">
            {mockBusinessData.targetEcosystem}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}