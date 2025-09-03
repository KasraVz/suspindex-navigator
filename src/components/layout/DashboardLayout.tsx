import { Outlet } from "react-router-dom";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { DashboardHeader } from "./DashboardHeader";
import { useState } from "react";
import { Notification } from "./Notifications";
import { useOrders } from "@/contexts/OrderContext";

const DashboardLayout = () => {
  const { cartItems, removeFromCart } = useOrders();
  
  // All available notifications pool
  const allNotifications: Notification[] = [
    {
      id: "1",
      type: "info",
      content: "Your FPA certification results are ready",
      isRead: false,
      timestamp: "2 hours ago"
    },
    {
      id: "2", 
      type: "alert",
      content: "Reminder: EEA exam scheduled for tomorrow",
      isRead: false,
      timestamp: "4 hours ago"
    },
    {
      id: "3",
      type: "info",
      content: "New practice materials available",
      isRead: true,
      timestamp: "1 day ago"
    },
    {
      id: "4",
      type: "alert",
      content: "Your affiliate code has unlocked new tests!",
      isRead: false,
      timestamp: "5 days ago"
    },
    {
      id: "5",
      type: "info",
      content: "System maintenance scheduled for this weekend",
      isRead: false,
      timestamp: "1 week ago"
    },
    {
      id: "6",
      type: "alert",
      content: "Payment confirmation received for recent order",
      isRead: true,
      timestamp: "1 week ago"
    },
    {
      id: "7",
      type: "info",
      content: "New features added to the platform",
      isRead: false,
      timestamp: "2 weeks ago"
    },
    {
      id: "8",
      type: "alert",
      content: "Account security review completed",
      isRead: true,
      timestamp: "2 weeks ago"
    }
  ];

  // State management for notifications
  const [displayedNotifications, setDisplayedNotifications] = useState<Notification[]>(
    allNotifications.slice(0, 4)
  );
  const [hasMoreNotifications, setHasMoreNotifications] = useState(true);

  const handleMarkAsRead = (id: string) => {
    setDisplayedNotifications(displayedNotifications.map(notification =>
      notification.id === id ? { ...notification, isRead: true } : notification
    ));
  };

  const handleShowMore = () => {
    const currentCount = displayedNotifications.length;
    const nextBatch = allNotifications.slice(currentCount, currentCount + 4);
    setDisplayedNotifications(prev => [...prev, ...nextBatch]);
    
    if (currentCount + 4 >= allNotifications.length) {
      setHasMoreNotifications(false);
    }
  };

  const handleRemoveCartItem = (id: string) => {
    removeFromCart(id);
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
          onShowMore={handleShowMore}
          hasMore={hasMoreNotifications}
        />
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;