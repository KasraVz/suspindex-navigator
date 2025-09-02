import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileText } from "lucide-react";
interface RequestScholarshipProps {
  initialData?: any;
}

export function RequestScholarship({ initialData }: RequestScholarshipProps) {
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
            
            
          </div>

          <div className="space-y-2">
            
            
          </div>

          

          <div className="space-y-2">
            <Label htmlFor="scholarshipType">Scholarship Type</Label>
            <Select defaultValue={initialData?.scholarshipType?.toLowerCase().replace(' ', '')}>
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
            <Input 
              id="requestedAmount" 
              type="number" 
              placeholder="1000"
              defaultValue={initialData?.requestedAmount || ""}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="justification">Justification</Label>
            <Textarea id="justification" placeholder="Please explain why you need this scholarship and how it will help your startup..." className="min-h-[120px]" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="businessPlan">Pitch Deck Summary</Label>
            <Textarea id="businessPlan" placeholder="Provide a brief summary of your business plan and goals..." className="min-h-[100px]" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="pitchDeck">Upload Pitch Deck</Label>
            <Input 
              id="pitchDeck" 
              type="file" 
              accept=".pdf,.doc,.docx,.ppt,.pptx" 
              className="cursor-pointer"
            />
            <p className="text-sm text-muted-foreground">Accepted formats: PDF, DOC, DOCX, PPT, PPTX (Max 10MB)</p>
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
    </Card>;
}