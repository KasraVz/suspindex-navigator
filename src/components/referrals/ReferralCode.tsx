import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Copy, Share } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function ReferralCode() {
  const { toast } = useToast();
  const referralCode = "SUSP-JD-2024";

  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralCode);
    toast({
      title: "Copied!",
      description: "Referral code copied to clipboard",
    });
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
            <li>• You both earn rewards</li>
            <li>• Track your referrals below</li>
          </ul>
        </div>
        
          <div className="p-3 bg-brand-cream rounded-lg">
            <div className="text-sm font-medium text-brand-cream-foreground">Earnings This Month</div>
            <div className="text-2xl font-bold text-primary">$125.00</div>
            <div className="text-xs text-muted-foreground">From 5 referrals</div>
          </div>
      </CardContent>
    </Card>
  );
}