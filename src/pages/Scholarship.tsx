import { GeneralScholarship } from "@/components/scholarship/GeneralScholarship";
import { RequestScholarship } from "@/components/scholarship/RequestScholarship";
import { ApplicationStatus } from "@/components/scholarship/ApplicationStatus";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
const Scholarship = () => {
  const [activeTab, setActiveTab] = useState("available");
  return <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Scholarship Program</h1>
        <p className="text-muted-foreground">Apply for scholarships to support your startup journey</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList>
          <TabsTrigger value="available">Available Scholarships</TabsTrigger>
          <TabsTrigger value="request">Request Financial Aid</TabsTrigger>
          <TabsTrigger value="status">Application Status</TabsTrigger>
        </TabsList>

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