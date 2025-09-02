import { Outlet } from "react-router-dom";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { DashboardHeader } from "./DashboardHeader";
import { useState } from "react";
import { Notification } from "./Notifications";
import { CartItem } from "./Cart";

const DashboardLayout = () => {
  // State management for notifications and cart
  const [notifications, setNotifications] = useState<Notification[]>([
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
      timestamp: "5 days ago",
      action: {
        type: "book_now",
        tests: ["FPA", "EEA", "GEB"]
      }
    }
  ]);

  const [cartItems, setCartItems] = useState<CartItem[]>([
    { id: "1", name: "FPA Advanced Certification", price: 75 },
    { id: "2", name: "Security Module Assessment", price: 50 }
  ]);

  const handleMarkAsRead = (id: string) => {
    setNotifications(notifications.map(notification =>
      notification.id === id ? { ...notification, isRead: true } : notification
    ));
  };

  const handleRemoveCartItem = (id: string) => {
    setCartItems(cartItems.filter(item => item.id !== id));
  };

  const unreadNotifications = notifications.filter(n => !n.isRead);

  return (
    <div className="flex min-h-screen w-full bg-muted/30">
      <AppSidebar />
      <div className="flex flex-1 flex-col">
        <DashboardHeader 
          notifications={notifications}
          unreadNotifications={unreadNotifications}
          cartItems={cartItems}
          onMarkAsRead={handleMarkAsRead}
          onRemoveCartItem={handleRemoveCartItem}
        />
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;