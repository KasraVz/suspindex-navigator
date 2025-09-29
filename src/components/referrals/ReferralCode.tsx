import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Copy, Share, Gift } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useVoucher } from "@/contexts/VoucherContext";
import { useState, useEffect } from "react";

// Mock referral data - in a real app, this would come from props or context
const mockReferrals = [
  { id: 1, name: "Alice Johnson", status: "Active" },
  { id: 2, name: "Bob Smith", status: "Active" },
  { id: 3, name: "Carol Brown", status: "Pending" },
];

export function ReferralCode() {
  const { toast } = useToast();
  const { addVoucher, vouchers } = useVoucher();
  const referralCode = "SUSP-JD-2024";
  const [hasClaimedReward, setHasClaimedReward] = useState(false);
  
  const activeReferrals = mockReferrals.filter(ref => ref.status === "Active").length;
  const progressPercentage = Math.min((activeReferrals / 3) * 100, 100);
  const canClaimReward = activeReferrals >= 3 && !hasClaimedReward;

  // Check if user has already claimed referral reward
  useEffect(() => {
    const referralVoucher = vouchers.find(v => v.source === 'referral' && v.testType === 'FPA');
    if (referralVoucher) {
      setHasClaimedReward(true);
    }
  }, [vouchers]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralCode);
    toast({
      title: "Copied!",
      description: "Referral code copied to clipboard",
    });
  };

  const handleClaimReward = () => {
    if (canClaimReward) {
      // Generate voucher code for FPA test
      const expiryDate = new Date();
      expiryDate.setMonth(expiryDate.getMonth() + 12); // 12 months from now

      addVoucher({
        testType: 'FPA',
        discountType: 'percentage',
        discountValue: 100,
        isUsed: false,
        expiryDate: expiryDate.toISOString(),
        source: 'referral',
      });

      setHasClaimedReward(true);
      
      toast({
        title: "Congratulations!",
        description: "Your free FPA Test voucher has been generated! Check your vouchers to use it during checkout.",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Referral Code</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex space-x-2">
          <Input value={referralCode} readOnly />
          <Button onClick={copyToClipboard} size="sm">
            <Copy className="w-4 h-4" />
          </Button>
        </div>
        
        <Button variant="outline" className="w-full">
          <Share className="w-4 h-4 mr-2" />
          Share Code
        </Button>
        
        <div className="text-sm text-muted-foreground space-y-2">
          <p className="font-medium">How it works:</p>
          <ul className="space-y-1 text-xs">
            <li>• Share your code with friends</li>
            <li>• They sign up using your code</li>
            <li>• Get 3 active referrals = Free FPA Test</li>
            <li>• Track your referrals below</li>
          </ul>
        </div>
        
        <div className="space-y-3">
          <div className="p-3 bg-secondary rounded-lg">
            <div className="text-sm font-medium">Referral Progress</div>
            <div className="text-lg font-bold">{activeReferrals} out of 3 people joined</div>
            <Progress value={progressPercentage} className="mt-2" />
            <div className="text-xs text-muted-foreground mt-1">
              {hasClaimedReward ? "Reward already claimed!" : canClaimReward ? "Ready to claim your reward!" : `${3 - activeReferrals} more needed for free FPA Test`}
            </div>
          </div>
          
          <Button 
            onClick={handleClaimReward}
            disabled={!canClaimReward}
            className="w-full"
            variant={canClaimReward ? "default" : "secondary"}
          >
            <Gift className="w-4 h-4 mr-2" />
            {hasClaimedReward ? "Free FPA Test (Claimed)" : canClaimReward ? "Claim Free FPA Test" : "Free FPA Test (Locked)"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}