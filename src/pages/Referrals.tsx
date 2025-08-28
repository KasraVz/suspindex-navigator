import { ReferralCode } from "@/components/referrals/ReferralCode";
import { ReferralList } from "@/components/referrals/ReferralList";
import { AffiliateSection } from "@/components/referrals/AffiliateSection";

const Referrals = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Referral & Affiliate Program</h1>
        <p className="text-muted-foreground">Earn rewards by referring new users to Suspindex</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <ReferralList />
          <AffiliateSection />
        </div>
        <div className="lg:col-span-1">
          <ReferralCode />
        </div>
      </div>
    </div>
  );
};

export default Referrals;