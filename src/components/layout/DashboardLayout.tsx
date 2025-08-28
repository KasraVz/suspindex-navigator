import { Outlet } from "react-router-dom";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { DashboardHeader } from "./DashboardHeader";

const DashboardLayout = () => {
  return (
    <div className="flex min-h-screen w-full bg-muted/30">
      <AppSidebar />
      <div className="flex flex-1 flex-col">
        <DashboardHeader />
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;