import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { OrderProvider } from "@/contexts/OrderContext";
import { BusinessProfileProvider } from "@/contexts/BusinessProfileContext";
import { AffiliationProvider } from "@/contexts/AffiliationContext";
import { VoucherProvider } from "@/contexts/VoucherContext";
import DashboardLayout from "./components/layout/DashboardLayout";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import BookedExams from "./pages/exams/BookedExams";
import ExamHistory from "./pages/exams/ExamHistory";
import ExamFeedback from "./pages/exams/ExamFeedback";
import Reports from "./pages/Reports";
import Certifications from "./pages/Certifications";
import Community from "./pages/Community";
import Referrals from "./pages/Referrals";
import Scholarship from "./pages/Scholarship";
import Support from "./pages/Support";
import FastTrak from "./pages/FastTrak";
import SpecialOffer from "./pages/SpecialOffer";
import PurchasePage from "./pages/PurchasePage";
import MyOrdersPage from "./pages/MyOrdersPage";
import OrderAssessmentsPage from "./pages/OrderAssessmentsPage";
import Leaderboard from "./pages/Leaderboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <BusinessProfileProvider>
        <AffiliationProvider>
          <VoucherProvider>
            <OrderProvider>
              <BrowserRouter>
                <Routes>
                  {/* Redirect root to dashboard */}
                  <Route path="/" element={<Navigate to="/dashboard" replace />} />
                  
                  {/* Dashboard routes */}
                  <Route path="/dashboard" element={
                    <SidebarProvider>
                      <DashboardLayout />
                    </SidebarProvider>
                  }>
                    <Route index element={<Dashboard />} />
                    <Route path="profile" element={<Profile />} />
                    <Route path="exams/booked" element={<BookedExams />} />
                    <Route path="exams/history" element={<ExamHistory />} />
                    <Route path="exams/feedback" element={<ExamFeedback />} />
                    <Route path="reports" element={<Reports />} />
                    <Route path="certifications" element={<Certifications />} />
                    <Route path="community" element={<Community />} />
                    <Route path="leaderboard" element={<Leaderboard />} />
                    <Route path="referrals" element={<Referrals />} />
                    <Route path="scholarship" element={<Scholarship />} />
                    <Route path="support" element={<Support />} />
                    <Route path="fast-trak" element={<FastTrak />} />
                    <Route path="special-offer" element={<SpecialOffer />} />
                    <Route path="purchase" element={<PurchasePage />} />
                    <Route path="orders" element={<MyOrdersPage />} />
                    <Route path="orders/new" element={<OrderAssessmentsPage />} />
                  </Route>

                  {/* Catch all route */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </BrowserRouter>
              <Toaster />
              <Sonner />
            </OrderProvider>
          </VoucherProvider>
        </AffiliationProvider>
      </BusinessProfileProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;