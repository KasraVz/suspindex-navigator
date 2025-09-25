import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GraduationCap } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Scholarship {
  id: number;
  title: string;
  description: string;
  testType: string;
  deadline: string;
  status: string;
  requirements: string[];
}

interface ScholarshipApplicationDialogProps {
  scholarship: Scholarship;
  children: React.ReactNode;
}

export function ScholarshipApplicationDialog({ scholarship, children }: ScholarshipApplicationDialogProps) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1000));

    toast({
      title: "Application Submitted Successfully!",
      description: `Your application for ${scholarship.title} has been submitted for review.`,
    });

    setIsSubmitting(false);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <GraduationCap className="w-5 h-5" />
            Apply for {scholarship.title}
          </DialogTitle>
          <DialogDescription>
            Please fill out the application form below. All fields are required.
          </DialogDescription>
        </DialogHeader>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Application Form</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="startupName">Startup Name</Label>
                <Input 
                  id="startupName" 
                  placeholder="Enter your startup name"
                  required 
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="website">Website</Label>
                <Input 
                  id="website" 
                  type="url"
                  placeholder="https://your-startup.com"
                  required 
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="industry">Industry</Label>
                <Input 
                  id="industry" 
                  placeholder="e.g., SaaS, FinTech, HealthTech"
                  required 
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="stage">Stage</Label>
                <Input 
                  id="stage" 
                  placeholder="e.g., Pre-seed, Seed, Series A"
                  required 
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="teamSize">Team Size</Label>
                <Input 
                  id="teamSize" 
                  type="number"
                  min="1"
                  placeholder="Number of team members"
                  required 
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="pitch">Pitch</Label>
                <Textarea 
                  id="pitch" 
                  placeholder="Write a brief pitch explaining what your startup does..."
                  className="min-h-[120px]"
                  required 
                />
              </div>

              <div className="flex gap-4 pt-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setOpen(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="flex-1 bg-brand-green hover:bg-brand-green/90 text-white"
                >
                  {isSubmitting ? "Submitting..." : "Submit Application"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
}