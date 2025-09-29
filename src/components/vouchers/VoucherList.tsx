import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Copy, Gift, Users } from "lucide-react";
import { useVouchers } from "@/contexts/VoucherContext";
import { useToast } from "@/hooks/use-toast";

export function VoucherList() {
  const { vouchers } = useVouchers();
  const { toast } = useToast();

  const copyVoucherCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast({
      title: "Copied!",
      description: "Voucher code copied to clipboard",
    });
  };

  const getSourceIcon = (source: 'scholarship' | 'referral') => {
    return source === 'scholarship' ? (
      <Gift className="h-4 w-4 text-green-600" />
    ) : (
      <Users className="h-4 w-4 text-blue-600" />
    );
  };

  const getSourceLabel = (source: 'scholarship' | 'referral') => {
    return source === 'scholarship' ? 'Scholarship' : 'Referral';
  };

  const getStatusBadge = (status: 'available' | 'used') => {
    return status === 'available' ? (
      <Badge className="bg-green-100 text-green-800 border-green-200">Available</Badge>
    ) : (
      <Badge variant="secondary">Used</Badge>
    );
  };

  if (vouchers.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <Gift className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">No Vouchers Yet</h3>
          <p className="text-muted-foreground">
            Vouchers earned from scholarships and referrals will appear here.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">My Vouchers</h2>
        <Badge variant="outline" className="text-sm">
          {vouchers.filter(v => v.status === 'available').length} Available
        </Badge>
      </div>

      <div className="grid gap-4">
        {vouchers.map((voucher) => (
          <Card key={voucher.id} className={voucher.status === 'used' ? 'opacity-60' : ''}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    {getSourceIcon(voucher.source)}
                    <span className="font-medium">{voucher.testType} Test Voucher</span>
                    {getStatusBadge(voucher.status)}
                  </div>
                  
                  <div className="bg-muted/50 border rounded p-3 mb-3">
                    <div className="flex items-center gap-2">
                      <code className="flex-1 text-sm font-mono">{voucher.code}</code>
                      {voucher.status === 'available' && (
                        <Button 
                          size="sm" 
                          variant="ghost"
                          onClick={() => copyVoucherCode(voucher.code)}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-xs text-muted-foreground">
                    <div>
                      <span className="font-medium">Source:</span>
                      <p>{getSourceLabel(voucher.source)}</p>
                    </div>
                    <div>
                      <span className="font-medium">Discount:</span>
                      <p className="text-green-600 font-medium">{voucher.discount}% OFF</p>
                    </div>
                    <div>
                      <span className="font-medium">Created:</span>
                      <p>{voucher.createdAt.toLocaleDateString()}</p>
                    </div>
                    {voucher.expiryDate && (
                      <div>
                        <span className="font-medium">Expires:</span>
                        <p>{voucher.expiryDate.toLocaleDateString()}</p>
                      </div>
                    )}
                    {voucher.usedAt && (
                      <div className="col-span-2">
                        <span className="font-medium">Used on:</span>
                        <p>{voucher.usedAt.toLocaleDateString()}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}