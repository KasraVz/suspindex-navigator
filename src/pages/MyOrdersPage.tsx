import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import { UnifiedOrdersTable } from "@/components/orders/UnifiedOrdersTable";
import { default as UnpaidOrdersTable } from "@/components/orders/UnpaidOrdersTable";
import { useOrders } from "@/contexts/OrderContext";
import { Badge } from "@/components/ui/badge";

const MyOrdersPage = () => {
  const navigate = useNavigate();
  const { unpaidOrders } = useOrders();
  
  const unpaidCount = unpaidOrders.length;

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

      <Tabs defaultValue="unpaid" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="unpaid" className="relative">
            Unpaid Orders
            {unpaidCount > 0 && (
              <Badge variant="secondary" className="ml-2 h-5 px-2 text-xs">
                {unpaidCount}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="all">All Orders</TabsTrigger>
        </TabsList>
        <TabsContent value="unpaid">
          <UnpaidOrdersTable />
        </TabsContent>
        <TabsContent value="all">
          <UnifiedOrdersTable />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MyOrdersPage;