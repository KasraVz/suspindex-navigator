import { WelcomeHeader } from "@/components/dashboard/WelcomeHeader";
import { QuickLinks } from "@/components/dashboard/QuickLinks";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { FastTrakCard } from "@/components/dashboard/FastTrakCard";
import { SpecialOfferCard } from "@/components/dashboard/SpecialOfferCard";
import { UpcomingTestCard } from "@/components/dashboard/UpcomingTestCard";
import { ProfileCompletionCard } from "@/components/dashboard/ProfileCompletionCard";
import { ReportSummaryCard } from "@/components/dashboard/ReportSummaryCard";
import { CertificationSummaryCard } from "@/components/dashboard/CertificationSummaryCard";
import { ReferringPartnerCard } from "@/components/dashboard/ReferringPartnerCard";

const Dashboard = () => {
  const profileCompletion = 75; // This would come from user data/state

  return (
    <div className="space-y-6">
      <WelcomeHeader />
      
      {/* Summary Cards Grid */}
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-12">
        {/* Row 1: Upcoming Tests + Profile + Certificates */}
        <div className="lg:col-span-6">
          <UpcomingTestCard />
        </div>
        <div className="lg:col-span-3">
          <ProfileCompletionCard completionPercentage={profileCompletion} />
        </div>
        <div className="lg:col-span-3">
          <CertificationSummaryCard />
        </div>
        
        {/* Row 2: Reports + Partner Progress */}
        <div className="md:col-span-2 lg:col-span-8">
          <ReportSummaryCard />
        </div>
        <div className="lg:col-span-4">
          <ReferringPartnerCard />
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