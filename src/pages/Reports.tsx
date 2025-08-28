import { ReportsTable } from "@/components/reports/ReportsTable";

const Reports = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Reports</h1>
        <p className="text-muted-foreground">View and download your test reports and analytics</p>
      </div>
      <ReportsTable />
    </div>
  );
};

export default Reports;