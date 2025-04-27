import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Check, Circle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns'; // Import date-fns function
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card'; // Import Card components
import { ScrollArea } from '@/components/ui/scroll-area';
import { fetchNotifications, markAsRead, markAllAsRead } from '@/store/slices/notificationSlice';
import type { AppDispatch, RootState } from '@/store/store';
import { cn } from '@/lib/utils'; // Import cn utility
import NavBar from "@/components/NavBar";

// Define a type for the notification object
interface NotificationType {
  id: number; // Assuming id is a number
  text: string;
  time: string | number | Date; // Allow for different time representations
  read: boolean;
  // Add other properties if they exist
}

// Placeholder for date formatting - replace with your actual implementation
const formatRelativeTime = (timestamp: string | number | Date): string => {
  try {
    // Attempt to parse the timestamp and format it
    const date = new Date(timestamp);
    // Check if the date is valid before formatting
    if (isNaN(date.getTime())) {
      console.error("Invalid date timestamp:", timestamp);
      return String(timestamp); // Fallback for invalid dates
    }
    return formatDistanceToNow(date, { addSuffix: true });
  } catch (e) {
    console.error("Error formatting date:", e);
    return String(timestamp); // Fallback in case of unexpected errors
  }
};

const Notifications = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { items: notifications, loading: isLoading, error } = useSelector(
    (state: RootState) => state.notifications
  );

  // Use the defined type here
  const unreadCount = notifications.filter((n: NotificationType) => !n.read).length;

  useEffect(() => {
    dispatch(fetchNotifications());
  }, [dispatch]);

  const handleMarkAsRead = (id: number) => {
    dispatch(markAsRead(id));
  };

  const handleMarkAllAsRead = () => {
    dispatch(markAllAsRead());
  };

  return (
    <>
      <NavBar />
    <div className="container mx-auto max-w-3xl p-4 md:p-6 lg:p-8"> {/* Constrained width */}

      <div className="flex items-center justify-between mb-6 pb-4 border-b">
        <h1 className="text-2xl font-semibold tracking-tight">Notifications</h1> {/* Adjusted heading style */}
        {unreadCount > 0 && (
          <Button
            variant="link" // Changed variant for subtlety
            size="sm"
            className="text-sm text-primary px-0" // Adjusted styling
            onClick={handleMarkAllAsRead}
          >
            Mark all as read
          </Button>
        )}
      </div>

      {/* Optional: Add ScrollArea back if needed for very long lists */}
      {isLoading ? (
        <div className="text-center py-10 text-muted-foreground">Loading notifications...</div> // Improved loading text
      ) : error ? (
        <div className="text-center py-10 text-destructive">{error}</div> // Use theme color for error
      ) : notifications.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
          <h3 className="mt-2 text-lg font-medium">All caught up!</h3>
          <p className="mt-1 text-sm">You have no new notifications.</p>
        </div> // Improved empty state
      ) : (
        <div className="space-y-4"> {/* Use space-y for consistent spacing */}
          {/* Use the defined type here */}
          {notifications.map((notification: NotificationType) => (
            <Card
              key={notification.id}
              className={cn(
                "overflow-hidden transition-colors hover:bg-muted/80", // Added hover effect
                notification.read ? 'border-transparent bg-background' : 'border-primary/20 bg-muted/50' // Subtle border for unread
              )}
            >
              <CardContent className="p-4 flex items-start gap-4">
                {/* Unread indicator */}
                {!notification.read && (
                   <Circle className="h-2 w-2 mt-1.5 fill-primary text-primary flex-shrink-0" aria-hidden="true" />
                )}
                 {/* Spacer if read, to maintain alignment */}
                {notification.read && <div className="w-2 flex-shrink-0" aria-hidden="true" />}

                <div className="flex-1">
                  <p className={cn(
                      "text-sm",
                      !notification.read && "font-medium" // Slightly bolder text for unread
                    )}
                  >
                    {notification.text}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {formatRelativeTime(notification.time)} {/* Use formatted time */}
                  </p>
                </div>
                {!notification.read && (
                  <Button
                    variant="ghost"
                    size="icon" // Use icon size
                    className="h-8 w-8 flex-shrink-0" // Ensure it doesn't shrink container
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent card click if needed
                      handleMarkAsRead(notification.id);
                    }}
                    aria-label="Mark as read"
                  >
                    <Check className="h-4 w-4" />
                    <span className="sr-only">Mark as read</span>
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
    </>
  );
};

export default Notifications;