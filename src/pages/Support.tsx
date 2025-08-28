import { TicketingSystem } from "@/components/support/TicketingSystem";

const Support = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Support Center</h1>
        <p className="text-muted-foreground">Get help with your Suspindex account and platform</p>
      </div>
      <TicketingSystem />
    </div>
  );
};

export default Support;