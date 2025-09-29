import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Copy, Share, Gift } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useVouchers } from "@/contexts/VoucherContext";
import { useState } from "react";

// Mock referral data - in a real app, this would come from props or context
const mockReferrals = [
  { id: 1, name: "Alice Johnson", status: "Active" },
  { id: 2, name: "Bob Smith", status: "Active" },
  { id: 3, name: "Carol Brown", status: "Pending" },
];

export function ReferralCode() {
  const { toast } = useToast();
  const { generateVoucher } = useVouchers();
  const [rewardClaimed, setRewardClaimed] = useState(false);
  const [generatedVoucher, setGeneratedVoucher] = useState<string | null>(null);
  const referralCode = "SUSP-JD-2024";
  
  const activeReferrals = mockReferrals.filter(ref => ref.status === "Active").length;
  const progressPercentage = Math.min((activeReferrals / 3) * 100, 100);
  const canClaimReward = activeReferrals >= 3;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralCode);
    toast({
      title: "Copied!",
      description: "Referral code copied to clipboard",
    });
  };

  const handleClaimReward = () => {
    if (canClaimReward && !rewardClaimed) {
      const voucherCode = generateVoucher("FPA", "referral");
      setGeneratedVoucher(voucherCode);
      setRewardClaimed(true);
      
      toast({
        title: "Congratulations!",
        description: "Your free FPA Test voucher has been generated!",
      });
    }
  };

  const copyVoucherCode = () => {
    if (generatedVoucher) {
      navigator.clipboard.writeText(generatedVoucher);
      toast({
        title: "Copied!",
        description: "Voucher code copied to clipboard",
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
              {canClaimReward ? "Ready to claim your reward!" : `${3 - activeReferrals} more needed for free FPA Test`}
            </div>
          </div>
          
          <Button 
            onClick={handleClaimReward}
            disabled={!canClaimReward || rewardClaimed}
            className="w-full"
            variant={canClaimReward && !rewardClaimed ? "default" : "secondary"}
          >
            <Gift className="w-4 h-4 mr-2" />
            {rewardClaimed ? "Reward Claimed" : canClaimReward ? "Claim Free FPA Test" : "Free FPA Test (Locked)"}
          </Button>
          
          {generatedVoucher && (
            <div className="mt-4 p-3 bg-primary/5 border border-primary/20 rounded-lg">
              <div className="text-sm font-medium text-primary mb-2">Your FPA Test Voucher</div>
              <div className="flex items-center gap-2 p-2 bg-background border rounded">
                <code className="flex-1 text-sm font-mono">{generatedVoucher}</code>
                <Button size="sm" variant="ghost" onClick={copyVoucherCode}>
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Use this code at checkout for 100% discount on FPA test.
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}