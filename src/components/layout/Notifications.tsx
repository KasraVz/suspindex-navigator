import { AlertCircle, Info, ArrowUp, CheckCheck, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  onMarkAsUnread?: (id: string) => void;
  onMarkAllAsRead?: () => void;
  onNotificationClick?: (notification: Notification) => void;
  onShowMore?: () => void;
  hasMore?: boolean;
  isLoadingMore?: boolean;
}

export function Notifications({ 
  notifications, 
  onMarkAsRead, 
  onMarkAsUnread, 
  onMarkAllAsRead, 
  onNotificationClick, 
  onShowMore, 
  hasMore, 
  isLoadingMore 
}: NotificationsProps) {
  const unreadScrollRef = useRef<HTMLDivElement>(null);
  const allScrollRef = useRef<HTMLDivElement>(null);
  const [showUnreadScrollTop, setShowUnreadScrollTop] = useState(false);
  const [showAllScrollTop, setShowAllScrollTop] = useState(false);
  const [activeTab, setActiveTab] = useState("unread");

  const unreadNotifications = notifications.filter(n => !n.isRead);
  const unreadCount = unreadNotifications.length;

  const handleNotificationClick = (notification: Notification) => {
    if (onNotificationClick) {
      onNotificationClick(notification);
    }
    if (!notification.isRead) {
      onMarkAsRead(notification.id);
    }
  };

  const handleMarkAsUnread = (e: React.MouseEvent, notificationId: string) => {
    e.stopPropagation();
    if (onMarkAsUnread) {
      onMarkAsUnread(notificationId);
    }
  };

  const handleScroll = (ref: React.RefObject<HTMLDivElement>, setShowScroll: (show: boolean) => void) => () => {
    if (ref.current) {
      const scrollTop = ref.current.scrollTop;
      setShowScroll(scrollTop > 100);
    }
  };

  const scrollToTop = (ref: React.RefObject<HTMLDivElement>, setShowScroll: (show: boolean) => void) => () => {
    if (ref.current) {
      ref.current.scrollTo({ top: 0, behavior: 'smooth' });
      setShowScroll(false);
    }
  };

  useEffect(() => {
    const unreadElement = unreadScrollRef.current;
    const allElement = allScrollRef.current;
    
    const unreadScrollHandler = handleScroll(unreadScrollRef, setShowUnreadScrollTop);
    const allScrollHandler = handleScroll(allScrollRef, setShowAllScrollTop);

    if (unreadElement) {
      unreadElement.addEventListener('scroll', unreadScrollHandler);
    }
    if (allElement) {
      allElement.addEventListener('scroll', allScrollHandler);
    }

    return () => {
      if (unreadElement) {
        unreadElement.removeEventListener('scroll', unreadScrollHandler);
      }
      if (allElement) {
        allElement.removeEventListener('scroll', allScrollHandler);
      }
    };
  }, [notifications.length]);

  const renderNotificationList = (notificationsList: Notification[], scrollRef: React.RefObject<HTMLDivElement>, showScrollTop: boolean, scrollToTopFn: () => void) => (
    <div className="w-full max-h-80 overflow-y-auto overflow-x-hidden relative" ref={scrollRef}>
      <div className="p-4">
        {notificationsList.length === 0 ? (
          <p className="text-muted-foreground text-sm">
            {activeTab === "unread" ? "No unread notifications" : "No notifications"}
          </p>
        ) : (
          <>
            <div className="space-y-3">
              {notificationsList.map((notification) => (
                <div
                  key={notification.id}
                  onClick={() => handleNotificationClick(notification)}
                  className={`p-3 rounded-lg border-l-4 overflow-hidden cursor-pointer hover:bg-opacity-70 transition-all relative group ${
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
                    {notification.isRead && onMarkAsUnread && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => handleMarkAsUnread(e, notification.id)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6 p-0 hover:bg-background/50"
                        title="Mark as unread"
                      >
                        <RotateCcw className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
            {hasMore && onShowMore && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onShowMore}
                disabled={isLoadingMore}
                className="w-full mt-3 text-xs text-muted-foreground hover:text-foreground"
              >
                {isLoadingMore ? "Loading..." : "Show More"}
              </Button>
            )}
          </>
        )}
      </div>
      
      {/* Scroll to Top Button */}
      {showScrollTop && (
        <Button
          variant="outline"
          size="sm"
          onClick={scrollToTopFn}
          className="absolute bottom-2 right-2 h-8 w-8 p-0 bg-background/90 backdrop-blur-sm border shadow-lg z-50 hover:bg-background/95"
        >
          <ArrowUp className="h-4 w-4" />
        </Button>
      )}
    </div>
  );

  return (
    <div className="w-full">
      <div className="p-4 pb-0">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-sm">Notifications</h3>
          {unreadCount > 0 && onMarkAllAsRead && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onMarkAllAsRead}
              className="text-xs text-muted-foreground hover:text-foreground h-auto p-1"
              title="Mark all as read"
            >
              <CheckCheck className="h-3 w-3 mr-1" />
              Mark all read
            </Button>
          )}
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="px-4">
          <TabsList className="grid w-full grid-cols-2 h-8">
            <TabsTrigger value="unread" className="text-xs relative">
              Unread
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground text-xs rounded-full h-4 w-4 flex items-center justify-center min-w-4">
                  {unreadCount > 99 ? '99+' : unreadCount}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="all" className="text-xs">
              All
            </TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="unread" className="mt-0">
          {renderNotificationList(
            unreadNotifications, 
            unreadScrollRef, 
            showUnreadScrollTop, 
            scrollToTop(unreadScrollRef, setShowUnreadScrollTop)
          )}
        </TabsContent>
        
        <TabsContent value="all" className="mt-0">
          {renderNotificationList(
            notifications, 
            allScrollRef, 
            showAllScrollTop, 
            scrollToTop(allScrollRef, setShowAllScrollTop)
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}