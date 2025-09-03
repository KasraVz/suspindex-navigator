import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Mail, User, CreditCard, CheckCircle, FileEdit, Eye } from "lucide-react";
import { ProfileEditRequestDialog } from "./ProfileEditRequestDialog";
import { useState } from "react";

export function ProfileInfo() {
  const [showRequestDialog, setShowRequestDialog] = useState(false);
  
  return (
    <>
      <ProfileEditRequestDialog 
        open={showRequestDialog} 
        onOpenChange={setShowRequestDialog}
      />
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Profile Information</CardTitle>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => setShowRequestDialog(true)}
        >
          <FileEdit className="w-4 h-4 mr-2" />
          Request Edit
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium">Full Name</span>
            </div>
            <p className="text-sm">John Doe</p>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium">Email Address</span>
            </div>
            <p className="text-sm">john.doe@example.com</p>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium">Passport ID</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => window.open('/path-to-passport-document.pdf', '_blank')}
                className="h-6 w-6 p-0"
              >
                <Eye className="w-3 h-3" />
              </Button>
            </div>
            <p className="text-sm">ABC123456789</p>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium">Verification Status</span>
            </div>
            <Badge variant="default" className="bg-success text-success-foreground">
              Verified
            </Badge>
          </div>
        </div>
        
        <div className="pt-4 border-t">
          <h4 className="text-sm font-medium mb-2">Account Statistics</h4>
          <div className="grid gap-2 md:grid-cols-3 text-sm">
            <div>
              <span className="text-muted-foreground">Member since:</span>
              <p className="font-medium">January 2024</p>
            </div>
            <div>
              <span className="text-muted-foreground">Tests completed:</span>
              <p className="font-medium">8</p>
            </div>
            <div>
              <span className="text-muted-foreground">Certifications:</span>
              <p className="font-medium">12</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
    </>
  );
}