import { BookedTestsTable } from "@/components/exams/BookedTestsTable";

const BookedExams = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Booked Tests</h1>
        <p className="text-muted-foreground">View and manage your scheduled examinations</p>
      </div>
      <BookedTestsTable />
    </div>
  );
};

export default BookedExams;