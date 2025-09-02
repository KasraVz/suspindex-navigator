import { WelcomeHeader } from "@/components/dashboard/WelcomeHeader";
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
      <div className="flex flex-wrap gap-4">
        {/* Hero Card - Upcoming Tests (more prominent) */}
        <div className="w-full lg:w-[calc(50%-0.5rem)]">
          <UpcomingTestCard />
        </div>
        
        {/* Secondary Cards */}
        <div className="w-full md:w-[calc(50%-0.5rem)] lg:w-[calc(25%-0.5rem)]">
          <ProfileCompletionCard completionPercentage={profileCompletion} />
        </div>
        <div className="w-full md:w-[calc(50%-0.5rem)] lg:w-[calc(25%-0.5rem)]">
          <CertificationSummaryCard />
        </div>
        
        {/* Reports Card - Full width on mobile, half on larger screens */}
        <div className="w-full lg:w-[calc(50%-0.5rem)]">
          <ReportSummaryCard />
        </div>
      </div>
      
      {/* Promotional Cards */}
      <div className="grid gap-4 lg:grid-cols-2">
        <FastTrakCard />
        <SpecialOfferCard />
      </div>
      
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