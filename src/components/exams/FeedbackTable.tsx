import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageSquare, Eye, Edit3, Trash2, Send, Save, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Mock data for available tests
const availableTests = [
  { testId: "TST001", testName: "FPA", completed: true },
  { testId: "TST002", testName: "GEB", completed: true },
  { testId: "TST003", testName: "EEA", completed: false }
];

// Mock data for submitted feedback with status
const submittedFeedback = [
  {
    id: "FB001",
    testId: "TST001",
    testName: "FPA",
    status: "under_review",
    feedbackText: "The test was well-structured but some questions were ambiguous...",
    uploadedFile: "screenshot.png",
    submittedDate: "2024-01-15",
    adminResponse: null
  },
  {
    id: "FB002",
    testId: "TST002", 
    testName: "GEB",
    status: "action_taken",
    feedbackText: "Found several typos in the questions...",
    uploadedFile: null,
    submittedDate: "2024-01-10",
    adminResponse: "Thank you for the feedback. We have corrected the typos in questions 5, 12, and 18."
  },
  {
    id: "FB003",
    testId: "TST001",
    testName: "FPA",
    status: "rejected",
    feedbackText: "This test is too hard...",
    uploadedFile: null,
    submittedDate: "2024-01-08",
    adminResponse: "The difficulty level is appropriate for this certification level and aligns with industry standards."
  }
];

// Mock data for draft feedback
const draftFeedback = [
  {
    id: "DRAFT001",
    testId: "TST002",
    testName: "GEB",
    feedbackText: "I noticed that question 15 has...",
    uploadedFile: null,
    savedDate: "2024-01-18"
  }
];

const getStatusBadge = (status: string) => {
  const statusConfig = {
    under_review: { label: "Under Review", variant: "secondary" as const },
    reviewed: { label: "Reviewed", variant: "default" as const },
    action_taken: { label: "Action Taken", variant: "default" as const },
    rejected: { label: "Rejected", variant: "destructive" as const }
  };
  
  const config = statusConfig[status as keyof typeof statusConfig];
  return <Badge variant={config.variant}>{config.label}</Badge>;
};

export function FeedbackTable() {
  const [activeTab, setActiveTab] = useState("available");
  const [feedbackText, setFeedbackText] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmitFeedback = async (testId: string, testName: string, isDraft = false) => {
    if (!feedbackText.trim()) {
      toast({
        title: "Error",
        description: "Please enter your feedback before submitting.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast({
      title: isDraft ? "Draft Saved" : "Feedback Submitted",
      description: isDraft 
        ? "Your feedback has been saved as draft." 
        : "Thank you for your feedback. We'll review it shortly."
    });
    
    setFeedbackText("");
    setSelectedFile(null);
    setIsSubmitting(false);
  };

  const handleWithdrawFeedback = async (feedbackId: string) => {
    toast({
      title: "Feedback Withdrawn",
      description: "Your feedback has been successfully withdrawn."
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Exam Feedback Management</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="available">Available Tests</TabsTrigger>
            <TabsTrigger value="submitted">Submitted Feedback</TabsTrigger>
            <TabsTrigger value="drafts">Drafts</TabsTrigger>
          </TabsList>

          <TabsContent value="available" className="mt-6">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Test ID</TableHead>
                  <TableHead>Test Name</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {availableTests.map(test => (
                  <TableRow key={test.testId}>
                    <TableCell className="font-medium">{test.testId}</TableCell>
                    <TableCell>{test.testName}</TableCell>
                    <TableCell>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="sm" disabled={!test.completed}>
                            <MessageSquare className="w-4 h-4 mr-2" />
                            Provide Feedback
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>Provide Feedback for {test.testName}</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-6">
                            <div>
                              <Label htmlFor="feedback-text">Your Feedback</Label>
                              <Textarea 
                                id="feedback-text"
                                value={feedbackText}
                                onChange={(e) => setFeedbackText(e.target.value)}
                                placeholder="Please share your thoughts about this test..."
                                className="min-h-[120px] mt-2"
                              />
                            </div>
                            <div>
                              <Label htmlFor="feedback-file">Upload Document (Optional)</Label>
                              <Input 
                                id="feedback-file"
                                type="file"
                                accept="image/*,.pdf,.doc,.docx"
                                onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                                className="mt-2"
                              />
                              <p className="text-sm text-muted-foreground mt-2">
                                Attach an image or document to support your feedback
                              </p>
                            </div>
                            <div className="flex justify-end space-x-4 pt-6">
                              <Button variant="outline" disabled={isSubmitting}>
                                Cancel
                              </Button>
                              <Button
                                variant="outline"
                                onClick={() => handleSubmitFeedback(test.testId, test.testName, true)}
                                disabled={isSubmitting}
                              >
                                <Save className="w-4 h-4 mr-2" />
                                Save as Draft
                              </Button>
                              <Button
                                onClick={() => handleSubmitFeedback(test.testId, test.testName)}
                                disabled={isSubmitting}
                              >
                                <Send className="w-4 h-4 mr-2" />
                                Submit Feedback
                              </Button>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TabsContent>

          <TabsContent value="submitted" className="mt-6">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Test ID</TableHead>
                  <TableHead>Test Name</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Submitted Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {submittedFeedback.map(feedback => (
                  <TableRow key={feedback.id}>
                    <TableCell className="font-medium">{feedback.testId}</TableCell>
                    <TableCell>{feedback.testName}</TableCell>
                    <TableCell>{getStatusBadge(feedback.status)}</TableCell>
                    <TableCell>{feedback.submittedDate}</TableCell>
                    <TableCell className="space-x-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <Eye className="w-4 h-4 mr-2" />
                            View
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>Feedback Details - {feedback.testName}</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div>
                              <Label className="text-sm font-semibold">Status</Label>
                              <div className="mt-1">{getStatusBadge(feedback.status)}</div>
                            </div>
                            <div>
                              <Label className="text-sm font-semibold">Your Feedback</Label>
                              <p className="mt-1 text-sm bg-muted p-3 rounded-md">{feedback.feedbackText}</p>
                            </div>
                            {feedback.uploadedFile && (
                              <div>
                                <Label className="text-sm font-semibold">Uploaded File</Label>
                                <p className="mt-1 text-sm text-primary">{feedback.uploadedFile}</p>
                              </div>
                            )}
                            {feedback.adminResponse && (
                              <div>
                                <Label className="text-sm font-semibold">Admin Response</Label>
                                <p className="mt-1 text-sm bg-primary/10 p-3 rounded-md">{feedback.adminResponse}</p>
                              </div>
                            )}
                            <div>
                              <Label className="text-sm font-semibold">Submitted Date</Label>
                              <p className="mt-1 text-sm">{feedback.submittedDate}</p>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                      {feedback.status === "under_review" && (
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleWithdrawFeedback(feedback.id)}
                        >
                          <X className="w-4 h-4 mr-2" />
                          Withdraw
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TabsContent>

          <TabsContent value="drafts" className="mt-6">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Test ID</TableHead>
                  <TableHead>Test Name</TableHead>
                  <TableHead>Saved Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {draftFeedback.map(draft => (
                  <TableRow key={draft.id}>
                    <TableCell className="font-medium">{draft.testId}</TableCell>
                    <TableCell>{draft.testName}</TableCell>
                    <TableCell>{draft.savedDate}</TableCell>
                    <TableCell className="space-x-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <Edit3 className="w-4 h-4 mr-2" />
                            Edit
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>Edit Draft - {draft.testName}</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-6">
                            <div>
                              <Label htmlFor="draft-feedback-text">Your Feedback</Label>
                              <Textarea 
                                id="draft-feedback-text"
                                defaultValue={draft.feedbackText}
                                placeholder="Please share your thoughts about this test..."
                                className="min-h-[120px] mt-2"
                              />
                            </div>
                            <div>
                              <Label htmlFor="draft-feedback-file">Upload Document (Optional)</Label>
                              <Input 
                                id="draft-feedback-file"
                                type="file"
                                accept="image/*,.pdf,.doc,.docx"
                                className="mt-2"
                              />
                            </div>
                            <div className="flex justify-end space-x-4 pt-6">
                              <Button variant="outline">Cancel</Button>
                              <Button variant="outline">
                                <Save className="w-4 h-4 mr-2" />
                                Update Draft
                              </Button>
                              <Button>
                                <Send className="w-4 h-4 mr-2" />
                                Submit Feedback
                              </Button>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                      <Button variant="ghost" size="sm">
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}