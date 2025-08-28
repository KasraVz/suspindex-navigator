import { WelcomeHeader } from "@/components/dashboard/WelcomeHeader";
import { KeyMetrics } from "@/components/dashboard/KeyMetrics";
import { QuickLinks } from "@/components/dashboard/QuickLinks";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { FastTrakCard } from "@/components/dashboard/FastTrakCard";
import { SpecialOfferCard } from "@/components/dashboard/SpecialOfferCard";

const Dashboard = () => {
  return (
    <div className="space-y-6">
      <WelcomeHeader />
      
      {/* Promotional Cards directly under welcome */}
      <div className="grid gap-4 lg:grid-cols-2">
        <FastTrakCard />
        <SpecialOfferCard />
      </div>
      
      <KeyMetrics />
      <div className="grid gap-6 lg:grid-cols-4">
        <div className="lg:col-span-2">
          <QuickLinks />
        </div>
        <div className="lg:col-span-2">
          <RecentActivity />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;