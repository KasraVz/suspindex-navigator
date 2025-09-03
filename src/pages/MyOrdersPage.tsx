import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import { UnifiedOrdersTable } from "@/components/orders/UnifiedOrdersTable";

const MyOrdersPage = () => {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto max-w-7xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">My Orders</h1>
          <p className="text-muted-foreground">View and manage all your test orders with comprehensive status tracking</p>
        </div>
        <Button onClick={() => navigate("/dashboard/orders/new")} size="lg">
          <Plus className="w-4 h-4 mr-2" />
          Order New Assessments
        </Button>
      </div>

      <UnifiedOrdersTable />
    </div>
  );
};

export default MyOrdersPage;