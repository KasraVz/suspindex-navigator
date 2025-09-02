import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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
import { MessageSquare } from "lucide-react";

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
              <TableHead>Select</TableHead>
              <TableHead>Test ID</TableHead>
              <TableHead>Test Name</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {feedbackTests.map((test) => (
              <TableRow key={test.testId}>
                <TableCell>
                  <Checkbox />
                </TableCell>
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
                        <Textarea
                          placeholder="Please share your thoughts about this test..."
                          className="min-h-[120px]"
                        />
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