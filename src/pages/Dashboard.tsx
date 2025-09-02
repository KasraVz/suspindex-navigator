import { WelcomeHeader } from "@/components/dashboard/WelcomeHeader";
import { KeyMetrics } from "@/components/dashboard/KeyMetrics";
import { QuickLinks } from "@/components/dashboard/QuickLinks";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { FastTrakCard } from "@/components/dashboard/FastTrakCard";
import { SpecialOfferCard } from "@/components/dashboard/SpecialOfferCard";
import { UpcomingTestCard } from "@/components/dashboard/UpcomingTestCard";
import { ProfileCompletionCard } from "@/components/dashboard/ProfileCompletionCard";
import { ReportSummaryCard } from "@/components/dashboard/ReportSummaryCard";
import { CertificationSummaryCard } from "@/components/dashboard/CertificationSummaryCard";

const Dashboard = () => {
  const profileCompletion = 75; // This would come from user data/state

  return (
    <div className="space-y-6">
      <WelcomeHeader />
      
      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <UpcomingTestCard />
        <ProfileCompletionCard completionPercentage={profileCompletion} />
        <ReportSummaryCard />
        <CertificationSummaryCard />
      </div>
      
      {/* Promotional Cards */}
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