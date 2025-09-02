import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MessageSquare, Upload } from "lucide-react";

const feedbackTests = [
  { testId: "TST001", testName: "FPA", completed: true },
  { testId: "TST002", testName: "GEB", completed: true },
  { testId: "TST003", testName: "EEA", completed: false },
];

export function FeedbackTable() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Exam Feedback</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Test ID</TableHead>
              <TableHead>Test Name</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {feedbackTests.map((test) => (
              <TableRow key={test.testId}>
                <TableCell className="font-medium">{test.testId}</TableCell>
                <TableCell>{test.testName}</TableCell>
                <TableCell>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="ghost" size="sm" disabled={!test.completed}>
                        <MessageSquare className="w-4 h-4 mr-2" />
                        Feedback
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Provide Feedback for {test.testName}</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="feedback-text">Your Feedback</Label>
                          <Textarea
                            id="feedback-text"
                            placeholder="Please share your thoughts about this test..."
                            className="min-h-[120px]"
                          />
                        </div>
                        <div>
                          <Label htmlFor="feedback-image">Upload Image (Optional)</Label>
                          <div className="mt-2">
                            <Input
                              id="feedback-image"
                              type="file"
                              accept="image/*"
                              className="file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/80"
                            />
                            <p className="text-sm text-muted-foreground mt-1">
                              Attach an image to support your feedback
                            </p>
                          </div>
                        </div>
                        <div className="flex justify-end space-x-2">
                          <Button variant="outline">Cancel</Button>
                          <Button>Submit Feedback</Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}