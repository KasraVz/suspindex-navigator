import { ReferralCode } from "@/components/referrals/ReferralCode";
import { ReferralList } from "@/components/referrals/ReferralList";

const Referrals = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Referral Program</h1>
        <p className="text-muted-foreground">Refer friends and earn a free FPA Test when 3 people join</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <ReferralList />
        </div>
        <div className="lg:col-span-1">
          <ReferralCode />
        </div>
      </div>
    </div>
  );
};

export default Referrals;