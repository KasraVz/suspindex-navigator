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
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { MessageSquare, Eye, Edit3, Trash2, Send, Save, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface TestData {
  testId: string;
  testName: string;
  completed: boolean;
}

interface FeedbackData {
  id: string;
  testId: string;
  testName: string;
  status: string;
  feedbackText: string;
  uploadedFile: string | null;
  submittedDate: string;
  adminResponse: string | null;
  withdrawnDate?: string;
}

interface DraftData {
  id: string;
  testId: string;
  testName: string;
  feedbackText: string;
  uploadedFile: string | null;
  savedDate: string;
}

// Initial mock data for available tests
const initialAvailableTests: TestData[] = [
  { testId: "TST001", testName: "FPA", completed: true },
  { testId: "TST002", testName: "GEB", completed: true },
  { testId: "TST003", testName: "EEA", completed: false }
];

// Initial mock data for submitted feedback with status
const initialSubmittedFeedback: FeedbackData[] = [
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

// Initial mock data for draft feedback
const initialDraftFeedback: DraftData[] = [
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
    rejected: { label: "Rejected", variant: "destructive" as const },
    withdrawn: { label: "Withdrawn", variant: "outline" as const }
  };
  
  const config = statusConfig[status as keyof typeof statusConfig];
  return <Badge variant={config.variant}>{config.label}</Badge>;
};

export function FeedbackTable() {
  const [activeTab, setActiveTab] = useState("available");
  const [feedbackText, setFeedbackText] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [availableTests, setAvailableTests] = useState<TestData[]>(initialAvailableTests);
  const [submittedFeedback, setSubmittedFeedback] = useState<FeedbackData[]>(initialSubmittedFeedback);
  const [draftFeedback, setDraftFeedback] = useState<DraftData[]>(initialDraftFeedback);
  const { toast } = useToast();

  // Helper function to check if a test has active (non-withdrawn/non-rejected) feedback
  const hasActiveFeedback = (testId: string) => {
    return submittedFeedback.some(feedback => 
      feedback.testId === testId && 
      feedback.status !== 'withdrawn' && 
      feedback.status !== 'rejected'
    );
  };

  // Helper function to get feedback button text and state
  const getFeedbackButtonState = (test: TestData) => {
    if (!test.completed) {
      return { text: "Complete Test First", disabled: true };
    }
    
    const hasActive = hasActiveFeedback(test.testId);
    const hasWithdrawnOrRejected = submittedFeedback.some(feedback => 
      feedback.testId === test.testId && 
      (feedback.status === 'withdrawn' || feedback.status === 'rejected')
    );
    
    if (hasActive) {
      return { text: "Feedback Already Submitted", disabled: true };
    }
    
    if (hasWithdrawnOrRejected) {
      return { text: "Provide Feedback Again", disabled: false };
    }
    
    return { text: "Provide Feedback", disabled: false };
  };

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
    
    if (!isDraft) {
      // Create new feedback entry
      const newFeedback: FeedbackData = {
        id: `FB${Date.now()}`,
        testId,
        testName,
        status: "under_review",
        feedbackText,
        uploadedFile: selectedFile?.name || null,
        submittedDate: new Date().toISOString().split('T')[0],
        adminResponse: null
      };
      
      setSubmittedFeedback(prev => [...prev, newFeedback]);
    } else {
      // Save as draft
      const newDraft: DraftData = {
        id: `DRAFT${Date.now()}`,
        testId,
        testName,
        feedbackText,
        uploadedFile: selectedFile?.name || null,
        savedDate: new Date().toISOString().split('T')[0]
      };
      
      setDraftFeedback(prev => [...prev, newDraft]);
    }
    
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
    // Update the feedback status to withdrawn
    setSubmittedFeedback(prev => 
      prev.map(feedback => 
        feedback.id === feedbackId 
          ? { 
              ...feedback, 
              status: "withdrawn",
              withdrawnDate: new Date().toISOString().split('T')[0]
            }
          : feedback
      )
    );
    
    toast({
      title: "Feedback Withdrawn",
      description: "Your feedback has been successfully withdrawn. You can now submit new feedback for this test."
    });
  };

  const handleDeleteDraft = (draftId: string) => {
    setDraftFeedback(prev => prev.filter(draft => draft.id !== draftId));
    toast({
      title: "Draft Deleted",
      description: "Your draft has been deleted successfully."
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
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            disabled={getFeedbackButtonState(test).disabled}
                          >
                            <MessageSquare className="w-4 h-4 mr-2" />
                            {getFeedbackButtonState(test).text}
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
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="sm"
                            >
                              <X className="w-4 h-4 mr-2" />
                              Withdraw
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Withdraw Feedback?</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to withdraw your feedback for {feedback.testName}? 
                                This action will allow you to submit new feedback for this test.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleWithdrawFeedback(feedback.id)}>
                                Withdraw Feedback
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
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
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Draft?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete this draft feedback for {draft.testName}? 
                              This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDeleteDraft(draft.id)}>
                              Delete Draft
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
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