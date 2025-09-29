import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Copy, Gift, Calendar } from "lucide-react";
import { useVoucher } from "@/contexts/VoucherContext";
import { useToast } from "@/hooks/use-toast";

export function VoucherList() {
  const { vouchers } = useVoucher();
  const { toast } = useToast();

  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code);
    toast({
      title: "Copied!",
      description: "Voucher code copied to clipboard",
    });
  };

  const getSourceBadge = (source: string) => {
    return source === 'scholarship' ? 
      <Badge variant="secondary" className="bg-blue-100 text-blue-800 border-blue-300">Scholarship</Badge> :
      <Badge variant="secondary" className="bg-purple-100 text-purple-800 border-purple-300">Referral</Badge>;
  };

  const getStatusBadge = (voucher: any) => {
    if (voucher.isUsed) {
      return <Badge variant="secondary" className="bg-gray-100 text-gray-800 border-gray-300">Used</Badge>;
    }
    
    const isExpired = new Date() > new Date(voucher.expiryDate);
    if (isExpired) {
      return <Badge variant="secondary" className="bg-red-100 text-red-800 border-red-300">Expired</Badge>;
    }
    
    return <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-300">Active</Badge>;
  };

  if (vouchers.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Gift className="w-5 h-5" />
            My Vouchers
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <Gift className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>No vouchers available</p>
            <p className="text-sm">Complete scholarship applications or refer friends to earn vouchers</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Gift className="w-5 h-5" />
          My Vouchers ({vouchers.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {vouchers.map((voucher) => {
            const isExpired = new Date() > new Date(voucher.expiryDate);
            const canUse = !voucher.isUsed && !isExpired;
            
            return (
              <div key={voucher.id} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <h3 className="font-medium">Free {voucher.testType} Test</h3>
                    {getSourceBadge(voucher.source)}
                    {getStatusBadge(voucher)}
                  </div>
                </div>
                
                <div className="bg-gray-50 dark:bg-gray-800 rounded-md p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-mono font-medium">{voucher.code}</p>
                      <p className="text-xs text-muted-foreground">Voucher Code</p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(voucher.code)}
                      disabled={!canUse}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="grid gap-2 md:grid-cols-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span>Expires: {new Date(voucher.expiryDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">Discount:</span>
                    <span className="font-medium text-green-600">100% OFF</span>
                  </div>
                </div>

                {canUse && (
                  <div className="text-xs text-muted-foreground bg-blue-50 dark:bg-blue-950 p-2 rounded">
                    💡 Use this code during checkout to get your free {voucher.testType} assessment
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}