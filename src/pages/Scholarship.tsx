import { GeneralScholarship } from "@/components/scholarship/GeneralScholarship";
import { RequestScholarship } from "@/components/scholarship/RequestScholarship";
import { LDCApplicationForm } from "@/components/scholarship/LDCApplicationForm";
import { ApplicationStatus } from "@/components/scholarship/ApplicationStatus";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Globe } from "lucide-react";
import { useState } from "react";
const Scholarship = () => {
  const [activeTab, setActiveTab] = useState("ldc");
  return <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Scholarship Program</h1>
        <p className="text-muted-foreground">Apply for scholarships to support your startup journey</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid grid-cols-2 lg:grid-cols-4 gap-2">
          <TabsTrigger value="ldc" className="relative">
            <Globe className="w-4 h-4 mr-2" />
            LDC Program
            <Badge variant="outline" className="ml-2 bg-success/10 text-success border-success/20 text-xs">
              FREE
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="available">Available Scholarships</TabsTrigger>
          <TabsTrigger value="request">Request Financial Aid</TabsTrigger>
          <TabsTrigger value="status">Application Status</TabsTrigger>
        </TabsList>

        <TabsContent value="ldc">
          <LDCApplicationForm />
        </TabsContent>

        <TabsContent value="available">
          <GeneralScholarship />
        </TabsContent>

        <TabsContent value="request">
          <RequestScholarship />
        </TabsContent>

        <TabsContent value="status">
          <ApplicationStatus />
        </TabsContent>
      </Tabs>
    </div>;
};
export default Scholarship;