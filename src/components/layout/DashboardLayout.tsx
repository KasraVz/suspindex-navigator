import { Outlet } from "react-router-dom";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { DashboardHeader } from "./DashboardHeader";
import { useState } from "react";
import { Notification } from "./Notifications";

const DashboardLayout = () => {
  
  // Notification generator function
  const generateNotification = (index: number): Notification => {
    const notificationTypes: Array<{ type: "info" | "alert", content: string }> = [
      { type: "info", content: "Your certification results are ready" },
      { type: "alert", content: "Exam reminder scheduled" },
      { type: "info", content: "New practice materials available" },
      { type: "alert", content: "Affiliate code unlocked new tests" },
      { type: "info", content: "System maintenance notification" },
      { type: "alert", content: "Payment confirmation received" },
      { type: "info", content: "New features added to platform" },
      { type: "alert", content: "Account security review completed" },
      { type: "info", content: "Course completion certificate available" },
      { type: "alert", content: "Subscription renewal reminder" },
      { type: "info", content: "Weekly progress report generated" },
      { type: "alert", content: "Test score improvement detected" },
      { type: "info", content: "Learning path recommendation updated" },
      { type: "alert", content: "Fast Track program eligibility" },
      { type: "info", content: "Community forum new discussions" },
      { type: "alert", content: "Scholarship application deadline approaching" },
      { type: "info", content: "Performance analytics report ready" },
      { type: "alert", content: "Account verification required" },
      { type: "info", content: "Resource library updated with new content" },
      { type: "alert", content: "Time-sensitive offer available" }
    ];

    const timeOptions = [
      "2 hours ago", "4 hours ago", "6 hours ago", "8 hours ago", "12 hours ago",
      "1 day ago", "2 days ago", "3 days ago", "4 days ago", "5 days ago",
      "1 week ago", "2 weeks ago", "3 weeks ago", "1 month ago", "2 months ago",
      "3 months ago", "4 months ago", "5 months ago", "6 months ago"
    ];

    const template = notificationTypes[index % notificationTypes.length];
    const timeIndex = Math.floor(index / notificationTypes.length) % timeOptions.length;
    
    return {
      id: `notification-${index + 1}`,
      type: template.type,
      content: `${template.content} #${Math.floor(index / notificationTypes.length) + 1}`,
      isRead: Math.random() > 0.7, // 30% chance of being read
      timestamp: timeOptions[timeIndex]
    };
  };

  // Initial notifications
  const getInitialNotifications = (): Notification[] => {
    return Array.from({ length: 4 }, (_, i) => generateNotification(i));
  };

  // State management for notifications
  const [displayedNotifications, setDisplayedNotifications] = useState<Notification[]>(getInitialNotifications);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [totalGenerated, setTotalGenerated] = useState(4);

  const handleMarkAsRead = (id: string) => {
    setDisplayedNotifications(displayedNotifications.map(notification =>
      notification.id === id ? { ...notification, isRead: true } : notification
    ));
  };

  const handleMarkAsUnread = (id: string) => {
    setDisplayedNotifications(displayedNotifications.map(notification =>
      notification.id === id ? { ...notification, isRead: false } : notification
    ));
  };

  const handleMarkAllAsRead = () => {
    setDisplayedNotifications(displayedNotifications.map(notification => 
      ({ ...notification, isRead: true })
    ));
  };

  const handleShowMore = () => {
    setIsLoadingMore(true);
    
    // Simulate API delay for better UX
    setTimeout(() => {
      const nextBatch = Array.from({ length: 4 }, (_, i) => 
        generateNotification(totalGenerated + i)
      );
      
      setDisplayedNotifications(prev => [...prev, ...nextBatch]);
      setTotalGenerated(prev => prev + 4);
      setIsLoadingMore(false);
    }, 300);
  };

  const unreadNotifications = displayedNotifications.filter(n => !n.isRead);

  return (
    <div className="flex min-h-screen w-full bg-muted/30">
      <AppSidebar />
      <div className="flex flex-1 flex-col">
        <DashboardHeader 
          notifications={displayedNotifications}
          unreadNotifications={unreadNotifications}
          onMarkAsRead={handleMarkAsRead}
          onMarkAsUnread={handleMarkAsUnread}
          onMarkAllAsRead={handleMarkAllAsRead}
          onShowMore={handleShowMore}
          hasMore={true}
          isLoadingMore={isLoadingMore}
        />
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;