import { GeneralScholarship } from "@/components/scholarship/GeneralScholarship";
import { RequestScholarship } from "@/components/scholarship/RequestScholarship";
import { DraftScholarships } from "@/components/scholarship/DraftScholarships";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";

const Scholarship = () => {
  const [activeTab, setActiveTab] = useState("available");
  const [draftData, setDraftData] = useState(null);

  const handleEditDraft = (draft: any) => {
    setDraftData(draft);
    setActiveTab("request");
  };
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Scholarship Program</h1>
        <p className="text-muted-foreground">Apply for scholarships to support your startup journey</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList>
          <TabsTrigger value="available">Available Scholarships</TabsTrigger>
          <TabsTrigger value="request">Request Scholarship</TabsTrigger>
          <TabsTrigger value="drafts">Draft Applications</TabsTrigger>
        </TabsList>

        <TabsContent value="available">
          <GeneralScholarship />
        </TabsContent>

        <TabsContent value="request">
          <RequestScholarship initialData={draftData} />
        </TabsContent>

        <TabsContent value="drafts">
          <DraftScholarships onEditDraft={handleEditDraft} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Scholarship;