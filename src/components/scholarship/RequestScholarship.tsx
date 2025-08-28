import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileText } from "lucide-react";

export function RequestScholarship() {
  return (
    <Card>
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
              <Label htmlFor="firstName">First Name</Label>
              <Input id="firstName" placeholder="Enter your first name" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input id="lastName" placeholder="Enter your last name" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input id="email" type="email" placeholder="Enter your email" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="company">Company/Startup Name</Label>
            <Input id="company" placeholder="Enter your company name" />
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
                <SelectItem value="custom">Custom Request</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="requestedAmount">Requested Amount (USD)</Label>
            <Input id="requestedAmount" type="number" placeholder="1000" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="justification">Justification</Label>
            <Textarea 
              id="justification"
              placeholder="Please explain why you need this scholarship and how it will help your startup..."
              className="min-h-[120px]"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="businessPlan">Business Plan Summary</Label>
            <Textarea 
              id="businessPlan"
              placeholder="Provide a brief summary of your business plan and goals..."
              className="min-h-[100px]"
            />
          </div>

          <div className="flex gap-4">
            <Button type="button" variant="outline" className="flex-1 border-brand-gold text-brand-gold hover:bg-brand-gold hover:text-white">
              Save Draft
            </Button>
            <Button type="submit" className="flex-1 bg-brand-orange hover:bg-brand-orange/90 text-white">
              Submit Application
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}