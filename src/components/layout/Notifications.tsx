import { AlertCircle, Info, ArrowUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRef, useState, useEffect } from "react";

export interface Notification {
  id: string;
  type: "alert" | "info";
  content: string;
  isRead: boolean;
  timestamp: string;
  link?: string;
}

interface NotificationsProps {
  notifications: Notification[];
  onMarkAsRead: (id: string) => void;
  onNotificationClick?: (notification: Notification) => void;
  onShowMore?: () => void;
  hasMore?: boolean;
}

export function Notifications({ notifications, onMarkAsRead, onNotificationClick, onShowMore, hasMore }: NotificationsProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showScrollTop, setShowScrollTop] = useState(false);

  const handleNotificationClick = (notification: Notification) => {
    if (onNotificationClick) {
      onNotificationClick(notification);
    }
    onMarkAsRead(notification.id);
  };

  const handleScroll = () => {
    if (scrollRef.current) {
      setShowScrollTop(scrollRef.current.scrollTop > 100);
    }
  };

  const scrollToTop = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const scrollElement = scrollRef.current;
    if (scrollElement) {
      scrollElement.addEventListener('scroll', handleScroll);
      return () => scrollElement.removeEventListener('scroll', handleScroll);
    }
  }, []);

  return (
    <div className="w-full max-h-96 overflow-y-auto overflow-x-hidden relative" ref={scrollRef}>
      <div className="p-4">
        <h3 className="font-semibold text-sm mb-3">Notifications</h3>
        {notifications.length === 0 ? (
          <p className="text-muted-foreground text-sm">No notifications</p>
        ) : (
          <>
            <div className="space-y-3">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  onClick={() => handleNotificationClick(notification)}
                  className={`p-3 rounded-lg border-l-4 overflow-hidden cursor-pointer hover:bg-opacity-70 transition-all ${
                    notification.type === "alert" 
                      ? "border-l-brand-orange bg-brand-orange/5" 
                      : "border-l-brand-green bg-brand-green/5"
                  } ${!notification.isRead ? "bg-opacity-100" : "opacity-60"}`}
                >
                  <div className="flex items-start gap-3">
                    {notification.type === "alert" ? (
                      <AlertCircle className="h-4 w-4 text-brand-orange flex-shrink-0 mt-0.5" />
                    ) : (
                      <Info className="h-4 w-4 text-brand-green flex-shrink-0 mt-0.5" />
                    )}
                    <div className="flex-1 min-w-0 overflow-hidden">
                      <p className="text-sm text-foreground break-words">{notification.content}</p>
                      <p className="text-xs text-muted-foreground mt-1">{notification.timestamp}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {hasMore && onShowMore && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onShowMore}
                className="w-full mt-3 text-xs text-muted-foreground hover:text-foreground"
              >
                Show More
              </Button>
            )}
          </>
        )}
        
        {/* Scroll to Top Button */}
        {showScrollTop && (
          <Button
            variant="outline"
            size="sm"
            onClick={scrollToTop}
            className="absolute bottom-4 right-4 h-8 w-8 p-0 bg-background/80 backdrop-blur-sm border shadow-lg"
          >
            <ArrowUp className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}