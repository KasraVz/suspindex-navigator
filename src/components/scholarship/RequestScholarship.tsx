import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileUpload } from "@/components/ui/file-upload";
import { FileText } from "lucide-react";
export function RequestScholarship() {
  return <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="w-5 h-5" />
          Request Custom Scholarship
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input id="fullName" placeholder="Enter your full name" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input id="email" type="email" placeholder="Enter your email address" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="companyName">Startup/Company Name</Label>
            <Input id="companyName" placeholder="Enter your startup or company name" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="businessPlanFile">Business Plan Upload</Label>
            <FileUpload
              accept=".pdf,.doc,.docx"
              onFileSelect={(file) => console.log('Business plan file selected:', file)}
              className="w-full"
            />
            <p className="text-sm text-muted-foreground">
              Upload your business plan (PDF, DOC, or DOCX format, max 20MB)
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="scholarshipType">Scholarship Type</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select scholarship type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="general">General Scholarship</SelectItem>
                <SelectItem value="women">Women Entrepreneurs</SelectItem>
                <SelectItem value="social">Social Impact</SelectItem>
                <SelectItem value="tech">Technology Innovation</SelectItem>
                <SelectItem value="custom">Custom</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="requestedTest">Requested Test</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select requested test" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="FPA">FPA</SelectItem>
                <SelectItem value="EEA">EEA</SelectItem>
                <SelectItem value="GEB">GEB</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="justification">Justification</Label>
            <Textarea id="justification" placeholder="Please explain why you need this scholarship and how it will help your startup..." className="min-h-[120px]" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="businessPlan">Pitch Deck Summary</Label>
            <Textarea id="businessPlan" placeholder="Provide a brief summary of your business plan and goals..." className="min-h-[100px]" />
          </div>

          <div className="flex justify-end">
            <Button type="submit" className="px-8">
              Submit Application
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>;
}