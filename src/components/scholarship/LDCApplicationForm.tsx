import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileUpload } from "@/components/ui/file-upload";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Globe, CheckCircle2, FileText, Users, AlertCircle, ExternalLink } from "lucide-react";
import { LDC_COUNTRIES } from "@/data/ldcCountries";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export function LDCApplicationForm() {
  const { toast } = useToast();
  const [nationality, setNationality] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [passportNumber, setPassportNumber] = useState("");
  const [passportFile, setPassportFile] = useState<File | null>(null);
  const [partnerName, setPartnerName] = useState("");
  const [partnerOrg, setPartnerOrg] = useState("");
  const [referralFile, setReferralFile] = useState<File | null>(null);
  const [startupInfo, setStartupInfo] = useState("");
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!nationality) {
      toast({
        title: "Nationality Required",
        description: "Please select your nationality from the LDC countries list.",
        variant: "destructive",
      });
      return;
    }

    if (!passportFile) {
      toast({
        title: "Passport Required",
        description: "Please upload your passport for KYC verification.",
        variant: "destructive",
      });
      return;
    }

    if (!referralFile) {
      toast({
        title: "Referral Letter Required",
        description: "Please upload your referral letter from an official Supsindex partner.",
        variant: "destructive",
      });
      return;
    }

    if (!agreedToTerms) {
      toast({
        title: "Terms Required",
        description: "Please agree to the KYC verification process.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    // Simulate submission
    setTimeout(() => {
      toast({
        title: "Application Submitted!",
        description: "Your LDC application has been submitted for review. You'll receive updates via email.",
      });
      setIsSubmitting(false);
      
      // Reset form
      setNationality("");
      setFullName("");
      setEmail("");
      setPassportNumber("");
      setPassportFile(null);
      setPartnerName("");
      setPartnerOrg("");
      setReferralFile(null);
      setStartupInfo("");
      setAgreedToTerms(false);
    }, 2000);
  };

  return (
    <div className="space-y-6">
      {/* Program Benefits Card */}
      <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 via-accent/5 to-background">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-primary/10">
              <Globe className="w-6 h-6 text-primary" />
            </div>
            <div>
              <CardTitle className="text-2xl">LDC Applicant Program</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Free Assessment Access for Least Developed Countries Citizens
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-3">
              <h3 className="font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-success" />
                Program Benefits
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between p-2 rounded bg-background/60">
                  <span>✓ FPA Assessment</span>
                  <Badge variant="outline" className="bg-success/10 text-success border-success/20">
                    FREE ($50)
                  </Badge>
                </div>
                <div className="flex items-center justify-between p-2 rounded bg-background/60">
                  <span>✓ GEB Assessment</span>
                  <Badge variant="outline" className="bg-success/10 text-success border-success/20">
                    FREE ($60)
                  </Badge>
                </div>
                <div className="flex items-center justify-between p-2 rounded bg-background/60">
                  <span>✓ EEA Assessment</span>
                  <Badge variant="outline" className="bg-success/10 text-success border-success/20">
                    FREE ($75)
                  </Badge>
                </div>
              </div>
              <div className="p-3 rounded-lg bg-success/10 border border-success/20">
                <p className="text-center font-bold text-success text-lg">
                  Total Value: $185 - Yours FREE!
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="font-semibold flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-primary" />
                Eligibility Requirements
              </h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                  <span>Nationality from UN LDC list</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                  <span>Valid passport (required for KYC)</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                  <span>Referral from official Supsindex Partner/Ambassador</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                  <span>Name must match passport exactly</span>
                </li>
              </ul>

              <div className="pt-2 space-y-2">
                <Button variant="outline" size="sm" className="w-full justify-start" asChild>
                  <a href="#" target="_blank" rel="noopener noreferrer">
                    <Users className="w-4 h-4 mr-2" />
                    View Official Partners & Ambassadors
                    <ExternalLink className="w-3 h-3 ml-auto" />
                  </a>
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start" asChild>
                  <a href="#" target="_blank" rel="noopener noreferrer">
                    <FileText className="w-4 h-4 mr-2" />
                    Download Referral Letter Template
                    <ExternalLink className="w-3 h-3 ml-auto" />
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Application Form */}
      <Card>
        <CardHeader>
          <CardTitle>Application Form</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Eligibility Section */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg border-b pb-2">1. Eligibility Verification</h3>
              
              <div className="space-y-2">
                <Label htmlFor="nationality">
                  Nationality <span className="text-destructive">*</span>
                </Label>
                <Select value={nationality} onValueChange={setNationality} required>
                  <SelectTrigger id="nationality">
                    <SelectValue placeholder="Select your country from LDC list" />
                  </SelectTrigger>
                  <SelectContent>
                    {LDC_COUNTRIES.map((country) => (
                      <SelectItem key={country} value={country}>
                        {country}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  Only citizens of UN-designated Least Developed Countries are eligible
                </p>
              </div>
            </div>

            {/* Personal Information Section */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg border-b pb-2">2. Personal Information</h3>
              
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Important:</strong> Your name must match exactly as it appears on your passport.
                </AlertDescription>
              </Alert>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="fullName">
                    Full Name (as on Passport) <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="fullName"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Enter your full legal name"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">
                    Email Address <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your.email@example.com"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="passportNumber">
                  Passport Number <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="passportNumber"
                  value={passportNumber}
                  onChange={(e) => setPassportNumber(e.target.value)}
                  placeholder="Enter your passport number"
                  required
                />
              </div>
            </div>

            {/* Document Upload Section */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg border-b pb-2">3. Document Upload</h3>
              
              <div className="space-y-2">
                <Label>
                  Passport Upload (Photo/Scan) <span className="text-destructive">*</span>
                </Label>
                <FileUpload
                  accept=".pdf,.jpg,.jpeg,.png"
                  onFileSelect={setPassportFile}
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Upload a clear photo or scan of your passport (PDF, JPG, or PNG, max 10MB)
                </p>
              </div>
            </div>

            {/* Referral Information Section */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg border-b pb-2">4. Referral Information</h3>
              
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="partnerName">
                    Partner/Ambassador Name <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="partnerName"
                    value={partnerName}
                    onChange={(e) => setPartnerName(e.target.value)}
                    placeholder="Name of referring partner"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="partnerOrg">
                    Partner Organization <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="partnerOrg"
                    value={partnerOrg}
                    onChange={(e) => setPartnerOrg(e.target.value)}
                    placeholder="Organization name"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>
                  Referral Letter Upload <span className="text-destructive">*</span>
                </Label>
                <FileUpload
                  accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                  onFileSelect={setReferralFile}
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Upload the official referral letter with your name matching your passport
                </p>
              </div>

              <Alert className="bg-warning/10 border-warning/20">
                <AlertCircle className="h-4 w-4 text-warning" />
                <AlertDescription className="text-warning">
                  The referral letter must state your full name <strong>exactly as it appears on your passport</strong>. 
                  Applications with name mismatches will be rejected.
                </AlertDescription>
              </Alert>
            </div>

            {/* Additional Information Section */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg border-b pb-2">5. Additional Information (Optional)</h3>
              
              <div className="space-y-2">
                <Label htmlFor="startupInfo">Startup/Business Information</Label>
                <Textarea
                  id="startupInfo"
                  value={startupInfo}
                  onChange={(e) => setStartupInfo(e.target.value)}
                  placeholder="Tell us about your startup or business venture..."
                  className="min-h-[100px]"
                />
                <p className="text-xs text-muted-foreground">
                  While optional, this helps us understand your entrepreneurial journey
                </p>
              </div>
            </div>

            {/* Terms and Conditions */}
            <div className="space-y-4">
              <div className="flex items-start gap-3 p-4 rounded-lg border bg-muted/30">
                <Checkbox
                  id="terms"
                  checked={agreedToTerms}
                  onCheckedChange={(checked) => setAgreedToTerms(checked as boolean)}
                  required
                />
                <div className="space-y-1">
                  <Label htmlFor="terms" className="text-sm font-normal cursor-pointer">
                    I agree to the KYC verification process and understand that:
                  </Label>
                  <ul className="text-xs text-muted-foreground space-y-1 ml-1">
                    <li>• My passport will be verified for authenticity</li>
                    <li>• My referral letter will be checked with the stated partner</li>
                    <li>• My personal information will be securely stored</li>
                    <li>• Processing may take 5-10 business days</li>
                    <li>• I can only submit one LDC application</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end pt-4">
              <Button
                type="submit"
                size="lg"
                disabled={isSubmitting}
                className="px-8"
              >
                {isSubmitting ? "Submitting..." : "Submit LDC Application"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
