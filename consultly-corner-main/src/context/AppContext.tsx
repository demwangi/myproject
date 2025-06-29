
import React, { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';

type Specialty = 'gynecologist' | 'psychiatrist' | 'therapist' | 'all';

export interface UserProfile {
  dob: string;
  gender: string;
  phone: string;
  address: string;
  bio: string;
  joinedDate: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  profile?: UserProfile;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: string;
  isRead: boolean;
  isAI?: boolean;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  content: string;
  timestamp: string;
  isRead: boolean;
  type: 'appointment' | 'message' | 'system';
  doctorId?: string;
  doctorName?: string;
}

interface AppContextType {
  selectedSpecialty: Specialty;
  setSelectedSpecialty: (specialty: Specialty) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  isAppointmentModalOpen: boolean;
  setIsAppointmentModalOpen: (isOpen: boolean) => void;
  isChatModalOpen: boolean;
  setIsChatModalOpen: (isOpen: boolean) => void;
  selectedDoctorId: string | null;
  setSelectedDoctorId: (id: string | null) => void;
  user: User | null;
  setUser: (user: User | null) => void;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (isOpen: boolean) => void;
  authMode: 'signin' | 'signup';
  setAuthMode: (mode: 'signin' | 'signup') => void;
  chats: Message[];
  addMessage: (message: Message) => void;
  markMessageAsRead: (messageId: string) => void;
  notifications: Notification[];
  addNotification: (notification: Notification) => void;
  markNotificationAsRead: (notificationId: string) => void;
  clearNotifications: () => void;
  unreadNotificationsCount: number;
  favoriteDoctors: string[];
  addToFavorites: (doctorId: string) => void;
  removeFromFavorites: (doctorId: string) => void;
  isFavorite: (doctorId: string) => boolean;
  appointments: Appointment[];
  addAppointment: (appointment: Appointment) => void;
}

export interface Appointment {
  id: string;
  doctorId: string;
  userId: string;
  date: string;
  time: string;
  type: 'video' | 'in-person';
  status: 'confirmed' | 'pending' | 'completed' | 'cancelled';
  notes?: string;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [selectedSpecialty, setSelectedSpecialty] = useState<Specialty>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAppointmentModalOpen, setIsAppointmentModalOpen] = useState(false);
  const [isChatModalOpen, setIsChatModalOpen] = useState(false);
  const [selectedDoctorId, setSelectedDoctorId] = useState<string | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [chats, setChats] = useState<Message[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  
  // Load user from localStorage on initial render
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('wellnessConnectUser');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  
  // Save user to localStorage whenever it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem('wellnessConnectUser', JSON.stringify(user));
    } else {
      localStorage.removeItem('wellnessConnectUser');
    }
  }, [user]);
  
  const [favoriteDoctors, setFavoriteDoctors] = useState<string[]>(() => {
    // Load favorites from localStorage on initial render
    const savedFavorites = localStorage.getItem('favoriteDoctors');
    return savedFavorites ? JSON.parse(savedFavorites) : [];
  });

  // Save favorites to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('favoriteDoctors', JSON.stringify(favoriteDoctors));
  }, [favoriteDoctors]);

  const addToFavorites = useCallback((doctorId: string) => {
    setFavoriteDoctors(prev => [...prev, doctorId]);
    
    if (user) {
      addNotification({
        id: Date.now().toString(),
        userId: user.id,
        title: 'Doctor Added to Favorites',
        content: 'You can easily find this doctor in your favorites list.',
        timestamp: new Date().toISOString(),
        isRead: false,
        type: 'system'
      });
    }
  }, [user]);

  const removeFromFavorites = useCallback((doctorId: string) => {
    setFavoriteDoctors(prev => prev.filter(id => id !== doctorId));
  }, []);

  const isFavorite = useCallback((doctorId: string) => {
    return favoriteDoctors.includes(doctorId);
  }, [favoriteDoctors]);

  // Calculate unread notifications count
  const unreadNotificationsCount = notifications.filter(n => !n.isRead && n.userId === user?.id).length;

  const addMessage = useCallback((message: Message) => {
    setChats(prev => [...prev, message]);
    
    // Only create notification for new messages from system, not doctor chats
    if (message.receiverId === user?.id && message.senderId !== user?.id && message.senderId === 'system') {
      addNotification({
        id: Date.now().toString(),
        userId: user.id,
        title: 'System Message',
        content: message.content.substring(0, 50) + (message.content.length > 50 ? '...' : ''),
        timestamp: message.timestamp,
        isRead: false,
        type: 'system'
      });
    }
  }, [user]);

  const markMessageAsRead = useCallback((messageId: string) => {
    setChats(prev => 
      prev.map(msg => 
        msg.id === messageId ? { ...msg, isRead: true } : msg
      )
    );
  }, []);

  const addNotification = useCallback((notification: Notification) => {
    setNotifications(prev => [notification, ...prev]);
  }, []);

  const markNotificationAsRead = useCallback((notificationId: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === notificationId ? { ...notif, isRead: true } : notif
      )
    );
  }, []);

  const clearNotifications = useCallback(() => {
    setNotifications(prev => prev.map(notif => ({ ...notif, isRead: true })));
  }, []);
  
  const addAppointment = useCallback((appointment: Appointment) => {
    setAppointments(prev => [...prev, appointment]);
    
    if (user) {
      addNotification({
        id: Date.now().toString(),
        userId: user.id,
        title: 'New Appointment',
        content: `You have a new ${appointment.status} appointment on ${appointment.date} at ${appointment.time}.`,
        timestamp: new Date().toISOString(),
        isRead: false,
        type: 'appointment',
        doctorId: appointment.doctorId
      });
    }
  }, [user]);

  // Memoized context value to prevent unnecessary rerenders
  const contextValue = React.useMemo(() => ({
    selectedSpecialty,
    setSelectedSpecialty,
    searchQuery,
    setSearchQuery,
    isAppointmentModalOpen,
    setIsAppointmentModalOpen,
    isChatModalOpen,
    setIsChatModalOpen,
    selectedDoctorId,
    setSelectedDoctorId,
    user,
    setUser,
    isAuthModalOpen,
    setIsAuthModalOpen,
    authMode,
    setAuthMode,
    chats,
    addMessage,
    markMessageAsRead,
    notifications,
    addNotification,
    markNotificationAsRead,
    clearNotifications,
    unreadNotificationsCount,
    favoriteDoctors,
    addToFavorites,
    removeFromFavorites,
    isFavorite,
    appointments,
    addAppointment
  }), [
    selectedSpecialty, searchQuery, isAppointmentModalOpen, isChatModalOpen,
    selectedDoctorId, user, isAuthModalOpen, authMode, chats, notifications,
    unreadNotificationsCount, favoriteDoctors, appointments,
    addMessage, markMessageAsRead, addNotification, markNotificationAsRead,
    clearNotifications, addToFavorites, removeFromFavorites, isFavorite, addAppointment
  ]);

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
