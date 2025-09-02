import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { EyeOff, Eye, Trash2, AlertTriangle } from "lucide-react";
import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";

export function AccountSettings() {
  const [isPrivate, setIsPrivate] = useState(false);
  const [acceptedDeleteRules, setAcceptedDeleteRules] = useState(false);

  const handleVisibilityChange = (checked: boolean) => {
    setIsPrivate(checked);
  };

  const handleDeleteAccount = () => {
    if (acceptedDeleteRules) {
      // Handle account deletion logic
      console.log("Account deletion confirmed");
      setAcceptedDeleteRules(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Account Settings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                {isPrivate ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                <h4 className="text-sm font-medium">Profile Visibility</h4>
              </div>
              <p className="text-xs text-muted-foreground">
                {isPrivate ? "Your profile is private and hidden from other users" : "Your profile is visible to other users"}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm">{isPrivate ? "Private" : "Visible"}</span>
              <Switch 
                checked={isPrivate}
                onCheckedChange={handleVisibilityChange}
              />
            </div>
          </div>
          
          {isPrivate && (
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Warning: Making your profile private will hide it from other users and may limit some platform features.
              </AlertDescription>
            </Alert>
          )}
        </div>
        
        <Separator />
        
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-destructive" />
            <h4 className="text-sm font-medium">Danger Zone</h4>
          </div>
          
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" className="w-full">
                <Trash2 className="w-4 h-4 mr-2" />
                Delete Account
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription className="space-y-4">
                  <p>
                    This action cannot be undone. This will permanently delete your
                    account and remove all your data from our servers.
                  </p>
                  
                  <div className="flex items-start space-x-2">
                    <Checkbox 
                      id="delete-rules" 
                      checked={acceptedDeleteRules}
                      onCheckedChange={(checked) => setAcceptedDeleteRules(checked === true)}
                    />
                    <Label 
                      htmlFor="delete-rules" 
                      className="text-sm leading-relaxed cursor-pointer"
                    >
                      I have read and agree to the{" "}
                      <a 
                        href="/delete-account-rules" 
                        className="text-primary underline hover:no-underline"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Supsindex Delete Account Rules
                      </a>
                    </Label>
                  </div>
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel onClick={() => setAcceptedDeleteRules(false)}>
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction 
                  className="bg-destructive text-destructive-foreground"
                  onClick={handleDeleteAccount}
                  disabled={!acceptedDeleteRules}
                >
                  Delete Account
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          
          <p className="text-xs text-muted-foreground">
            Once you delete your account, there is no going back. Please be certain.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}