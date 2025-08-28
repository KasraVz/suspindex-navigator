import { TestHistoryTable } from "@/components/exams/TestHistoryTable";

const ExamHistory = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Test History</h1>
        <p className="text-muted-foreground">Review your completed examinations and results</p>
      </div>
      <TestHistoryTable />
    </div>
  );
};

export default ExamHistory;