import React from 'react';
import { Bell, Check, MessageSquare, Calendar, AlertCircle } from 'lucide-react';
import { useAppContext } from '@/context/AppContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from '@/components/ui/button';

export const NotificationDropdown: React.FC = () => {
  const { 
    notifications, 
    markNotificationAsRead, 
    clearNotifications, 
    unreadNotificationsCount,
    user,
    setIsAuthModalOpen,
    setAuthMode,
    setSelectedDoctorId,
    setIsChatModalOpen
  } = useAppContext();
  
  // Filter notifications for current user
  const userNotifications = user 
    ? notifications.filter(n => n.userId === user.id).slice(0, 5) 
    : [];
  
  const handleNotificationClick = (notification: any) => {
    markNotificationAsRead(notification.id);
    
    // If it's a message notification, open the chat with that doctor
    if (notification.type === 'message' && notification.doctorId) {
      setSelectedDoctorId(notification.doctorId);
      setIsChatModalOpen(true);
    }
  };
  
  if (!user) {
    return (
      <Button 
        variant="ghost" 
        size="icon"
        onClick={() => {
          setAuthMode('signin');
          setIsAuthModalOpen(true);
        }}
      >
        <Bell size={20} />
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell size={20} />
          {unreadNotificationsCount > 0 && (
            <span className="absolute top-0 right-0 w-4 h-4 bg-destructive text-destructive-foreground text-xs rounded-full flex items-center justify-center transform translate-x-1 -translate-y-1">
              {unreadNotificationsCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel className="flex items-center justify-between">
          <span>Notifications</span>
          {userNotifications.length > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => clearNotifications()}
              className="h-8 text-xs"
            >
              <Check size={14} className="mr-1" />
              Mark all as read
            </Button>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        {userNotifications.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <div className="mb-2 flex justify-center">
              <Bell size={24} />
            </div>
            <p className="text-sm">No notifications yet</p>
          </div>
        ) : (
          <>
            {userNotifications.map((notification) => (
              <DropdownMenuItem
                key={notification.id}
                className={`py-3 cursor-pointer ${!notification.isRead ? 'bg-accent/40' : ''}`}
                onClick={() => handleNotificationClick(notification)}
              >
                <div className="flex">
                  <div className="mr-3 mt-1">
                    {notification.type === 'message' && (
                      <div className="bg-blue-100 p-2 rounded-full">
                        <MessageSquare size={16} className="text-blue-600" />
                      </div>
                    )}
                    {notification.type === 'appointment' && (
                      <div className="bg-green-100 p-2 rounded-full">
                        <Calendar size={16} className="text-green-600" />
                      </div>
                    )}
                    {notification.type === 'system' && (
                      <div className="bg-purple-100 p-2 rounded-full">
                        <AlertCircle size={16} className="text-purple-600" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-1">
                      <h4 className="text-sm font-medium">{notification.title}</h4>
                      <span className="text-xs text-muted-foreground">
                        {new Date(notification.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">{notification.content}</p>
                  </div>
                </div>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem className="justify-center py-2 text-sm font-medium text-primary">
              View all notifications
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
