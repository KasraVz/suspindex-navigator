import { FeedbackTable } from "@/components/exams/FeedbackTable";

const ExamFeedback = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Exam Feedback</h1>
        <p className="text-muted-foreground">Provide feedback on your completed tests</p>
      </div>
      <FeedbackTable />
    </div>
  );
};

export default ExamFeedback;