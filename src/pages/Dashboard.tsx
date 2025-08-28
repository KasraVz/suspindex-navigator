import { WelcomeHeader } from "@/components/dashboard/WelcomeHeader";
import { KeyMetrics } from "@/components/dashboard/KeyMetrics";
import { QuickLinks } from "@/components/dashboard/QuickLinks";
import { RecentActivity } from "@/components/dashboard/RecentActivity";

const Dashboard = () => {
  return (
    <div className="space-y-6">
      <WelcomeHeader />
      <KeyMetrics />
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <QuickLinks />
        </div>
        <div className="lg:col-span-1">
          <RecentActivity />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;