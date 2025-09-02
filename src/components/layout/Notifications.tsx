import { AlertCircle, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export interface Notification {
  id: string;
  type: "alert" | "info";
  content: string;
  isRead: boolean;
  timestamp: string;
  action?: {
    type: "book_now";
    tests: string[];
  };
}

interface NotificationsProps {
  notifications: Notification[];
  onMarkAsRead: (id: string) => void;
}

export function Notifications({ notifications, onMarkAsRead }: NotificationsProps) {
  const navigate = useNavigate();

  const handleBookNow = (notification: Notification) => {
    if (notification.action?.tests) {
      navigate("/dashboard/purchase", { 
        state: { tests: notification.action.tests }
      });
      onMarkAsRead(notification.id);
    }
  };

  return (
    <div className="w-72 sm:w-80 max-h-96 overflow-y-auto">
      <div className="p-3 sm:p-4">
        <h3 className="font-semibold text-sm mb-3">Notifications</h3>
        {notifications.length === 0 ? (
          <p className="text-muted-foreground text-sm">No notifications</p>
        ) : (
          <div className="space-y-2 sm:space-y-3">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-2 sm:p-3 rounded-lg border-l-4 ${
                  notification.type === "alert" 
                    ? "border-l-brand-orange bg-brand-orange/5" 
                    : "border-l-brand-green bg-brand-green/5"
                } ${!notification.isRead ? "bg-opacity-100" : "opacity-60"}`}
              >
                <div className="flex items-start gap-2 sm:gap-3">
                  {notification.type === "alert" ? (
                    <AlertCircle className="h-4 w-4 text-brand-orange flex-shrink-0 mt-0.5" />
                  ) : (
                    <Info className="h-4 w-4 text-brand-green flex-shrink-0 mt-0.5" />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-foreground break-words">{notification.content}</p>
                    <p className="text-xs text-muted-foreground mt-1">{notification.timestamp}</p>
                    {notification.action?.type === "book_now" && (
                      <Button
                        size="sm"
                        className="mt-2 text-xs"
                        onClick={() => handleBookNow(notification)}
                      >
                        Book Now!
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}