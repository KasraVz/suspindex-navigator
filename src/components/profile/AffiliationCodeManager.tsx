import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import { CheckCircle, XCircle, Trash2, Plus, User, Calendar, Mail, Percent } from "lucide-react";
import { useAffiliation } from "@/contexts/AffiliationContext";
import { toast } from "sonner";

export function AffiliationCodeManager() {
  const [newCode, setNewCode] = useState("");
  const { affiliationCodes, addAffiliationCode, removeAffiliationCode } = useAffiliation();

  const handleAddCode = () => {
    if (!newCode.trim()) {
      toast.error("Please enter an affiliation code");
      return;
    }

    const success = addAffiliationCode(newCode.trim().toUpperCase());
    if (success) {
      toast.success("Affiliation code added successfully!");
      setNewCode("");
    } else {
      toast.error("Invalid or already added affiliation code");
    }
  };

  const handleRemoveCode = (id: string) => {
    removeAffiliationCode(id);
    toast.success("Affiliation code removed");
  };

  const getCompletionPercentage = (code: any) => {
    if (code.requestedTests.length === 0) return 0;
    return (code.completedTests.length / code.requestedTests.length) * 100;
  };

  const isExpired = (expiryDate: string) => {
    return new Date(expiryDate) < new Date();
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Add New Affiliation Code</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="affiliation-code">Affiliation Code</Label>
            <div className="flex gap-2">
              <Input
                id="affiliation-code"
                value={newCode}
                onChange={(e) => setNewCode(e.target.value)}
                placeholder="Enter your partner's affiliation code"
                className="flex-1"
              />
              <Button onClick={handleAddCode}>
                <Plus className="w-4 h-4 mr-2" />
                Add Code
              </Button>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">
            Enter the affiliation code provided by your mentor or partner to access special pricing and requested assessments.
          </p>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Active Affiliation Codes</h3>
        
        {affiliationCodes.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-muted-foreground">No affiliation codes added yet.</p>
              <p className="text-sm text-muted-foreground mt-1">
                Add codes from your mentors or partners to access special pricing and test recommendations.
              </p>
            </CardContent>
          </Card>
        ) : (
          affiliationCodes.map((code) => (
            <Card key={code.id} className={`${isExpired(code.expiryDate) ? 'opacity-60' : ''}`}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="flex items-center gap-2">
                      <User className="w-5 h-5" />
                      {code.partnerName}
                    </CardTitle>
                    <div className="text-sm text-muted-foreground mt-1">
                      Code: {code.code}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <Badge variant="secondary">{code.partnerType}</Badge>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        Added: {new Date(code.dateAdded).toLocaleDateString()}
                      </span>
                      {isExpired(code.expiryDate) && (
                        <Badge variant="destructive">Expired</Badge>
                      )}
                    </div>
                  </div>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive/80">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Remove Affiliation Code</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to remove this affiliation code? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleRemoveCode(code.id)}>
                          Remove
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Progress Section */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Test Completion Progress</span>
                    <span>{code.completedTests.length} of {code.requestedTests.length} completed</span>
                  </div>
                  <Progress value={getCompletionPercentage(code)} className="h-2" />
                </div>

                {/* Requested Tests */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Requested Tests</Label>
                  <div className="flex flex-wrap gap-2">
                    {code.requestedTests.map((test) => {
                      const isCompleted = code.completedTests.includes(test);
                      const discount = code.discounts[test];
                      const discountUsed = code.usedDiscounts[test];
                      
                      return (
                        <div key={test} className="flex items-center gap-1">
                          <Badge 
                            variant={isCompleted ? "default" : "outline"}
                            className="flex items-center gap-1"
                          >
                            {isCompleted ? (
                              <CheckCircle className="w-3 h-3" />
                            ) : (
                              <XCircle className="w-3 h-3" />
                            )}
                            {test}
                            {discount && (
                              <span className="ml-1 flex items-center gap-1">
                                <Percent className="w-3 h-3" />
                                ${discount} off
                                {discountUsed && " (used)"}
                              </span>
                            )}
                          </Badge>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Contact Information */}
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Mail className="w-4 h-4" />
                  <span>{code.contactEmail}</span>
                </div>

                {/* Code Details */}
                <div className="bg-muted/50 rounded-lg p-3 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Code: {code.code}</span>
                    <span className="text-muted-foreground">
                      Expires: {new Date(code.expiryDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}