
import React, { useState } from 'react';
import { Bell, Check, MessageSquare, Calendar, AlertCircle, X, ChevronRight } from 'lucide-react';
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
import { Badge } from '@/components/ui/badge';
import { motion, AnimatePresence } from 'framer-motion';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useDoctors } from '@/hooks/useDoctors';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export const NotificationBell: React.FC = () => {
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
  
  const { getDoctorById } = useDoctors();
  const navigate = useNavigate();
  
  // Filter notifications for current user
  const userNotifications = user 
    ? notifications.filter(n => n.userId === user.id).slice(0, 5) 
    : [];
  
  // All user notifications for the dialog
  const allUserNotifications = user
    ? notifications.filter(n => n.userId === user.id)
    : [];

  const [isOpen, setIsOpen] = useState(false);
  const [showDot, setShowDot] = useState(false);
  const [isAllNotificationsOpen, setIsAllNotificationsOpen] = useState(false);
  
  // Simulate notification dot animation
  React.useEffect(() => {
    if (unreadNotificationsCount > 0) {
      setShowDot(true);
      const timer = setTimeout(() => {
        setShowDot(false);
      }, 10000);
      return () => clearTimeout(timer);
    }
  }, [unreadNotificationsCount]);
  
  const handleNotificationClick = (notification: any) => {
    markNotificationAsRead(notification.id);
    
    // If it's a message notification, open the chat with that doctor
    if (notification.type === 'message' && notification.doctorId) {
      setSelectedDoctorId(notification.doctorId);
      setIsChatModalOpen(true);
      setIsOpen(false);
      setIsAllNotificationsOpen(false);
    }
    
    // If it's an appointment notification, navigate to doctor profile
    if (notification.type === 'appointment' && notification.doctorId) {
      navigate(`/doctor/${notification.doctorId}`);
      setIsOpen(false);
      setIsAllNotificationsOpen(false);
    }
  };
  
  const getIconForType = (type: string) => {
    switch(type) {
      case 'message':
        return <MessageSquare size={16} className="text-blue-600" />;
      case 'appointment':
        return <Calendar size={16} className="text-green-600" />;
      case 'system':
      default:
        return <AlertCircle size={16} className="text-purple-600" />;
    }
  };
  
  const getBackgroundForType = (type: string) => {
    switch(type) {
      case 'message':
        return 'bg-blue-100';
      case 'appointment':
        return 'bg-green-100';
      case 'system':
      default:
        return 'bg-purple-100';
    }
  };
  
  const handleViewAllClick = () => {
    setIsOpen(false);
    setIsAllNotificationsOpen(true);
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
        className="hover:bg-accent/30 transition-colors relative"
      >
        <Bell size={20} />
      </Button>
    );
  }

  const NotificationItem = ({ notification, index }: { notification: any, index: number }) => {
    // Get doctor name if it exists 
    const doctor = notification.doctorId ? getDoctorById(notification.doctorId) : null;
    const doctorName = notification.doctorName || (doctor ? doctor.name : '');
    
    return (
      <motion.div
        key={notification.id}
        initial={{ opacity: 0, x: -5 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, height: 0 }}
        transition={{ delay: index * 0.05 }}
      >
        <DropdownMenuItem
          className={`py-3 px-4 cursor-pointer hover:bg-accent/40 transition-colors relative ${
            !notification.isRead ? 'bg-accent/30' : ''
          }`}
          onClick={() => handleNotificationClick(notification)}
        >
          <div className="flex">
            <div className="mr-3 mt-0.5">
              <div className={`${getBackgroundForType(notification.type)} p-2 rounded-full`}>
                {getIconForType(notification.type)}
              </div>
            </div>
            <div className="flex-1">
              <div className="flex items-start justify-between mb-1">
                <h4 className="text-sm font-medium">{notification.title}</h4>
                <span className="text-xs text-muted-foreground ml-2">
                  {new Date(notification.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">{notification.content}</p>
              
              {notification.type === 'appointment' && (
                <div className="mt-2 flex items-center">
                  <div className="h-1.5 w-1.5 rounded-full bg-green-500 mr-1.5"></div>
                  <span className="text-xs font-medium text-green-600">Upcoming</span>
                </div>
              )}
              
              {notification.type === 'message' && doctorName && (
                <div className="mt-2 flex items-center">
                  <Avatar className="h-4 w-4 mr-1.5">
                    <AvatarFallback className="text-[8px]">
                      {doctorName.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-xs text-muted-foreground">
                    Dr. {doctorName}
                  </span>
                </div>
              )}
              
              {!notification.isRead && (
                <motion.div 
                  className="w-2 h-2 bg-primary rounded-full absolute top-3 right-3"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.2 }}
                ></motion.div>
              )}
            </div>
          </div>
          
          {!notification.isRead && (
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-5 w-5 absolute top-1 right-1 opacity-0 hover:opacity-100 hover:bg-accent transition-opacity rounded-full"
              onClick={(e) => {
                e.stopPropagation();
                markNotificationAsRead(notification.id);
              }}
            >
              <X size={10} />
            </Button>
          )}
        </DropdownMenuItem>
      </motion.div>
    );
  };

  return (
    <>
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="ghost" 
            size="icon" 
            className="relative hover:bg-accent/30 transition-colors"
          >
            <motion.div
              animate={showDot ? { scale: [1, 1.2, 1] } : {}}
              transition={{ repeat: Infinity, duration: 2 }}
            >
              <Bell size={20} className="text-foreground" />
            </motion.div>
            
            <AnimatePresence>
              {unreadNotificationsCount > 0 && (
                <motion.div
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.5, opacity: 0 }}
                  className="absolute top-0 right-0"
                >
                  <Badge 
                    className="bg-red-500 text-white text-xs px-1.5 min-w-5 h-5 flex items-center justify-center rounded-full"
                    variant="destructive"
                  >
                    {unreadNotificationsCount}
                  </Badge>
                </motion.div>
              )}
            </AnimatePresence>
          </Button>
        </DropdownMenuTrigger>
        
        <DropdownMenuContent align="end" className="w-80 p-0 rounded-xl shadow-lg border border-border/30">
          <DropdownMenuLabel className="flex items-center justify-between p-4 border-b">
            <span className="text-lg font-semibold">Notifications</span>
            {userNotifications.length > 0 && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => {
                  clearNotifications();
                  setIsOpen(false);
                }}
                className="h-8 text-xs hover:bg-accent/50 transition-colors"
              >
                <Check size={14} className="mr-1" />
                Mark all as read
              </Button>
            )}
          </DropdownMenuLabel>
          
          {userNotifications.length === 0 ? (
            <motion.div 
              className="text-center py-10 text-muted-foreground"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <div className="mb-3 flex justify-center">
                <Bell size={32} className="text-muted-foreground/50" />
              </div>
              <p className="text-sm mb-1">No notifications yet</p>
              <p className="text-xs text-muted-foreground/70">We'll notify you when something important happens</p>
            </motion.div>
          ) : (
            <div className="max-h-[350px] overflow-y-auto">
              <AnimatePresence>
                {userNotifications.map((notification, index) => (
                  <NotificationItem 
                    key={notification.id} 
                    notification={notification} 
                    index={index} 
                  />
                ))}
              </AnimatePresence>
              
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                className="justify-center py-3 text-sm font-medium text-primary hover:bg-accent/30 transition-colors"
                onClick={handleViewAllClick}
              >
                View all notifications <ChevronRight size={16} className="ml-1" />
              </DropdownMenuItem>
            </div>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* All Notifications Dialog */}
      <Dialog open={isAllNotificationsOpen} onOpenChange={setIsAllNotificationsOpen}>
        <DialogContent className="sm:max-w-[500px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl">All Notifications</DialogTitle>
          </DialogHeader>
          
          <div className="flex justify-end mb-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={clearNotifications}
              className="text-xs"
            >
              <Check size={14} className="mr-1" />
              Mark all as read
            </Button>
          </div>
          
          <div className="space-y-1">
            {allUserNotifications.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <div className="mb-3 flex justify-center">
                  <Bell size={32} className="text-muted-foreground/50" />
                </div>
                <p className="text-sm mb-1">No notifications yet</p>
                <p className="text-xs text-muted-foreground/70">We'll notify you when something important happens</p>
              </div>
            ) : (
              <AnimatePresence>
                {allUserNotifications.map((notification, index) => (
                  <div 
                    key={notification.id}
                    className={`p-3 cursor-pointer hover:bg-accent/40 transition-colors relative rounded-lg mb-2 ${
                      !notification.isRead ? 'bg-accent/30' : 'bg-background'
                    }`}
                    onClick={() => handleNotificationClick(notification)}
                  >
                    <NotificationItem notification={notification} index={index} />
                  </div>
                ))}
              </AnimatePresence>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
