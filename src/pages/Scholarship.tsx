import { GeneralScholarship } from "@/components/scholarship/GeneralScholarship";
import { RequestScholarship } from "@/components/scholarship/RequestScholarship";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Scholarship = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Scholarship Program</h1>
        <p className="text-muted-foreground">Apply for scholarships to support your startup journey</p>
      </div>

      <Tabs defaultValue="available" className="space-y-6">
        <TabsList>
          <TabsTrigger value="available">Available Scholarships</TabsTrigger>
          <TabsTrigger value="request">Request Scholarship</TabsTrigger>
        </TabsList>

        <TabsContent value="available">
          <GeneralScholarship />
        </TabsContent>

        <TabsContent value="request">
          <RequestScholarship />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Scholarship;