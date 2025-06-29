import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, MessageCircle, Activity, ArrowRight, Heart, Brain, Salad, Sunrise, Droplets, Apple, Zap, Leaf, Bell, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAppContext } from '@/context/AppContext';
import { useDoctors } from '@/hooks/useDoctors';
import { HealthTip, HealthTipProps } from '@/components/common/HealthTip';
import { motion, AnimatePresence } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { AppFeatures } from '@/components/home/AppFeatures';
import { TestimonialsSection } from '@/components/home/TestimonialsSection';
import { HowItWorks } from '@/components/home/HowItWorks';

const healthTips: HealthTipProps[] = [
  {
    title: "Mental Wellness Check",
    content: "Take a moment to reflect on your mental health. Regular meditation can help reduce stress.",
    icon: <Brain className="h-10 w-10 text-purple-500" />,
    color: "bg-purple-50"
  },
  {
    title: "Women's Health Update",
    content: "Regular gynecological check-ups are essential for preventive care and early detection.",
    icon: <Heart className="h-10 w-10 text-pink-500" />,
    color: "bg-pink-50"
  },
  {
    title: "Self-Care Reminder",
    content: "Remember to prioritize your wellbeing. Schedule time for activities that bring you joy.",
    icon: <Sunrise className="h-10 w-10 text-amber-500" />,
    color: "bg-amber-50"
  },
  {
    title: "Hydration Reminder",
    content: "Staying hydrated improves energy levels, brain function, and overall health. Aim for 8 glasses daily.",
    icon: <Droplets className="h-10 w-10 text-blue-500" />,
    color: "bg-blue-50"
  },
  {
    title: "Nutrition Advice",
    content: "Including more colorful vegetables in your diet increases your intake of essential nutrients and antioxidants.",
    icon: <Salad className="h-10 w-10 text-green-500" />,
    color: "bg-green-50"
  },
  {
    title: "Sleep Hygiene Tips",
    content: "Create a consistent sleep schedule and avoid screens before bedtime for better quality rest.",
    icon: <Zap className="h-10 w-10 text-indigo-500" />,
    color: "bg-indigo-50"
  },
  {
    title: "Immunity Boost",
    content: "Regular physical activity, a balanced diet, and adequate sleep all contribute to a stronger immune system.",
    icon: <Apple className="h-10 w-10 text-red-500" />,
    color: "bg-red-50"
  },
  {
    title: "Mindfulness Practice",
    content: "Take five minutes daily for mindful breathing to reduce anxiety and improve mental clarity.",
    icon: <Leaf className="h-10 w-10 text-teal-500" />,
    color: "bg-teal-50"
  }
];

// Enhanced background animation component with Kenyan-inspired colors
const BackgroundAnimation = () => {
  return (
    <div className="fixed inset-0 -z-10 opacity-20 overflow-hidden">
      <div className="absolute w-full h-full">
        {/* Animated blobs with Kenyan-inspired colors */}
        {[...Array(25)].map((_, index) => (
          <motion.div
            key={index}
            className="absolute rounded-full"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              width: `${Math.random() * 300 + 100}px`,
              height: `${Math.random() * 300 + 100}px`,
              background: index % 3 === 0 
                ? 'linear-gradient(120deg, rgba(234,67,53,0.3), rgba(234,67,53,0.1))' // Red (Kenya flag)
                : index % 3 === 1
                ? 'linear-gradient(120deg, rgba(0,114,41,0.3), rgba(0,114,41,0.1))' // Green (Kenya flag)
                : 'linear-gradient(120deg, rgba(0,0,0,0.2), rgba(0,0,0,0.05))', // Black (Kenya flag)
              filter: 'blur(8px)',
            }}
            animate={{
              x: [0, Math.random() * 100 - 50, 0],
              y: [0, Math.random() * 100 - 50, 0],
              scale: [1, Math.random() * 0.4 + 1.1, 1],
              opacity: [0.2, 0.3, 0.2],
            }}
            transition={{
              repeat: Infinity,
              duration: Math.random() * 20 + 20,
              ease: "easeInOut",
            }}
          />
        ))}
        
        {/* Additional Kenya-inspired geometric shapes */}
        {[...Array(15)].map((_, index) => (
          <motion.div
            key={`shape-${index}`}
            className="absolute"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              width: `${Math.random() * 60 + 20}px`,
              height: `${Math.random() * 60 + 20}px`,
              borderRadius: index % 2 === 0 ? '0%' : '50%',
              borderTop: index % 5 === 0 ? '3px solid rgba(0,114,41,0.3)' : 'none', // Green
              borderRight: index % 5 === 1 ? '3px solid rgba(234,67,53,0.3)' : 'none', // Red
              borderBottom: index % 5 === 2 ? '3px solid rgba(255,255,255,0.3)' : 'none', // White
              borderLeft: index % 5 === 3 ? '3px solid rgba(0,0,0,0.3)' : 'none', // Black
              transform: `rotate(${Math.random() * 360}deg)`,
            }}
            animate={{
              rotate: [0, 360],
              opacity: [0.1, 0.3, 0.1],
            }}
            transition={{
              repeat: Infinity,
              duration: Math.random() * 30 + 30,
              ease: "linear",
            }}
          />
        ))}
      </div>
    </div>
  );
};

// Kenyan Maasai-inspired patterns for decoration
const KenyanPatternDecoration = () => {
  return (
    <div className="absolute opacity-10 pointer-events-none">
      <div className="absolute top-20 left-10 w-40 h-40">
        <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
          <pattern id="maasai-pattern" patternUnits="userSpaceOnUse" width="20" height="20">
            <rect width="10" height="10" fill="#cf0000" />
            <rect x="10" y="10" width="10" height="10" fill="#cf0000" />
            <rect x="10" y="0" width="10" height="10" fill="#000" />
            <rect x="0" y="10" width="10" height="10" fill="#000" />
          </pattern>
          <circle cx="50" cy="50" r="40" fill="url(#maasai-pattern)" />
        </svg>
      </div>
      <div className="absolute bottom-20 right-10 w-40 h-40">
        <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
          <pattern id="maasai-pattern2" patternUnits="userSpaceOnUse" width="20" height="20">
            <rect width="10" height="10" fill="#006600" />
            <rect x="10" y="10" width="10" height="10" fill="#006600" />
            <rect x="10" y="0" width="10" height="10" fill="#000" />
            <rect x="0" y="10" width="10" height="10" fill="#000" />
          </pattern>
          <rect x="10" y="10" width="80" height="80" fill="url(#maasai-pattern2)" />
        </svg>
      </div>
    </div>
  );
};

const Home: React.FC = () => {
  const navigate = useNavigate();
  const { user, appointments, setIsChatModalOpen, setSelectedDoctorId, notifications } = useAppContext();
  const { getDoctorById } = useDoctors();
  const [displayedTips, setDisplayedTips] = useState<HealthTipProps[]>([]);
  const [tipIndex, setTipIndex] = useState(0);

  // Get upcoming appointments
  const upcomingAppointments = appointments.filter(
    app => new Date(`${app.date} ${app.time}`) > new Date()
  ).sort((a, b) => 
    new Date(`${a.date} ${a.time}`).getTime() - new Date(`${b.date} ${b.time}`).getTime()
  ).slice(0, 3);
  
  // Get recent notifications
  const recentNotifications = user 
    ? notifications
        .filter(n => n.userId === user.id)
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
        .slice(0, 3)
    : [];

  // Rotate health tips every 30 seconds
  useEffect(() => {
    setDisplayedTips(healthTips.slice(0, 3));
    
    const interval = setInterval(() => {
      setTipIndex(prevIndex => {
        const nextIndex = (prevIndex + 1) % (healthTips.length - 2);
        setDisplayedTips(healthTips.slice(nextIndex, nextIndex + 3));
        return nextIndex;
      });
    }, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const navigateToSymptomChecker = () => {
    navigate('/symptom-checker');
  };

  const navigateToFindDoctors = () => {
    navigate('/find-doctors');
  };

  const handleChatClick = () => {
    setSelectedDoctorId(null); // For general chat
    setIsChatModalOpen(true);
  };
  
  const getNotificationIcon = (type: string) => {
    switch(type) {
      case 'message':
        return <MessageCircle className="h-4 w-4 text-blue-600" />;
      case 'appointment':
        return <Calendar className="h-4 w-4 text-green-600" />;
      case 'system':
      default:
        return <Bell className="h-4 w-4 text-purple-600" />;
    }
  };

  return (
    <div className="pt-20 pb-16 min-h-screen">
      <BackgroundAnimation />
      <KenyanPatternDecoration />
      <div className="container mx-auto px-4">
        {/* Hero section with enhanced background effect */}
        <section className="mb-12 relative">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1587854692152-cbe660dbde88?q=80&w=2669&auto=format&fit=crop')] opacity-[0.03] bg-cover bg-center rounded-3xl"></div>
          
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-white/70 to-purple-100/30 rounded-3xl"></div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10">
            <div className="lg:col-span-2">
              <motion.div 
                className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-100 p-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <h1 className="text-3xl font-bold sf-display mb-3 bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-600">
                  Welcome{user ? `, ${user.name.split(' ')[0]}` : ' to WellnessConnect Kenya'}
                </h1>
                <p className="text-muted-foreground mb-6">
                  Here's what's happening with your health
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <motion.button
                    whileHover={{ scale: 1.05, y: -5 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={navigateToFindDoctors}
                    className="bg-gradient-to-br from-primary/10 to-purple-100/30 rounded-xl p-5 text-left hover:shadow-md transition-all"
                  >
                    <Calendar className="h-10 w-10 mb-3 text-primary" />
                    <h3 className="font-medium text-lg mb-1">Book Appointment</h3>
                    <p className="text-sm text-muted-foreground">Schedule a visit with a specialist</p>
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.05, y: -5 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={navigateToSymptomChecker}
                    className="bg-gradient-to-br from-primary/10 to-purple-100/30 rounded-xl p-5 text-left hover:shadow-md transition-all"
                  >
                    <Activity className="h-10 w-10 mb-3 text-primary" />
                    <h3 className="font-medium text-lg mb-1">Check Symptoms</h3>
                    <p className="text-sm text-muted-foreground">Find out what might be causing your symptoms</p>
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.05, y: -5 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleChatClick}
                    className="bg-gradient-to-br from-primary/10 to-purple-100/30 rounded-xl p-5 text-left hover:shadow-md transition-all"
                  >
                    <MessageCircle className="h-10 w-10 mb-3 text-primary" />
                    <h3 className="font-medium text-lg mb-1">Chat with AI</h3>
                    <p className="text-sm text-muted-foreground">Get medical assistance through AI</p>
                  </motion.button>
                </div>
                
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold">Upcoming Appointments</h2>
                  {appointments.length > 0 && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-primary flex items-center"
                      onClick={() => navigate('/user-profile')}
                    >
                      View all <ChevronRight size={16} />
                    </Button>
                  )}
                </div>
                
                {upcomingAppointments.length > 0 ? (
                  <div className="mt-4 space-y-3">
                    {upcomingAppointments.map((appointment, index) => {
                      const doctor = getDoctorById(appointment.doctorId);
                      const appointmentDate = new Date(`${appointment.date} ${appointment.time}`);
                      const isToday = new Date().toDateString() === appointmentDate.toDateString();
                      const isTomorrow = new Date(Date.now() + 86400000).toDateString() === appointmentDate.toDateString();
                      
                      const relativeDay = isToday 
                        ? 'Today' 
                        : isTomorrow 
                          ? 'Tomorrow' 
                          : appointment.date;
                          
                      return (
                        <motion.div 
                          key={appointment.id} 
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.1 }}
                          className="flex items-center p-4 rounded-xl border border-gray-100 bg-gradient-to-r from-white to-gray-50/30 hover:shadow-md transition-all cursor-pointer"
                          onClick={() => navigate(`/doctor/${appointment.doctorId}`)}
                        >
                          <div className={`w-1 h-14 rounded-full ${
                            appointment.status === 'confirmed' 
                              ? 'bg-green-500' 
                              : appointment.status === 'pending' 
                                ? 'bg-yellow-500' 
                                : 'bg-red-500'
                          } mr-4`} />
                          
                          <Avatar className="h-12 w-12 mr-4">
                            <AvatarFallback>{doctor?.name.charAt(0)}</AvatarFallback>
                            {doctor?.imageUrl && (
                              <AvatarImage 
                                src={doctor.imageUrl} 
                                alt={doctor?.name} 
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  target.style.display = 'none';
                                }}
                              />
                            )}
                          </Avatar>
                          
                          <div className="flex-1">
                            <p className="font-medium">Dr. {doctor?.name}</p>
                            <p className="text-sm text-muted-foreground capitalize">{doctor?.specialty}</p>
                          </div>
                          
                          <div className="text-right">
                            <p className="font-medium">{relativeDay}</p>
                            <p className="text-sm text-muted-foreground">{appointment.time}</p>
                          </div>
                          
                          <div className={`ml-4 px-3 py-1 rounded-full text-xs font-medium capitalize
                            ${appointment.status === 'confirmed' 
                              ? 'bg-green-100 text-green-800' 
                              : appointment.status === 'pending' 
                                ? 'bg-yellow-100 text-yellow-800' 
                                : 'bg-red-100 text-red-800'
                            }`}>
                            {appointment.status}
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                ) : (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="mt-4 p-8 rounded-xl border border-dashed border-gray-200 text-center bg-background"
                  >
                    <p className="text-muted-foreground mb-3">You don't have any upcoming appointments</p>
                    <Button 
                      onClick={navigateToFindDoctors}
                      className="bg-primary hover:bg-primary/90 text-white hover:scale-105 transition-all"
                    >
                      Book an Appointment
                    </Button>
                  </motion.div>
                )}
              </motion.div>
            </div>
            
            <div className="lg:col-span-1">
              <div className="grid grid-cols-1 gap-6 h-full">
                <motion.div 
                  className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-100 p-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold">Health Tips</h2>
                  </div>
                  
                  <div className="space-y-4">
                    {displayedTips.map((tip, index) => (
                      <motion.div
                        key={`${tip.title}-${tipIndex}-${index}`}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                      >
                        <HealthTip 
                          title={tip.title}
                          content={tip.content}
                          icon={tip.icon}
                          color={tip.color}
                        />
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
                
                {user && (
                  <motion.div
                    className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-100 p-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-lg font-semibold">Recent Notifications</h2>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-primary flex items-center text-xs"
                        onClick={() => navigate('/user-profile')}
                      >
                        All <ChevronRight size={14} />
                      </Button>
                    </div>
                    
                    <div className="space-y-3">
                      {recentNotifications.length > 0 ? (
                        <AnimatePresence>
                          {recentNotifications.map((notification, index) => (
                            <motion.div
                              key={notification.id}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.3, delay: index * 0.1 }}
                              className={`p-3 rounded-lg cursor-pointer ${
                                !notification.isRead ? 'bg-accent/30' : 'bg-accent/10'
                              } hover:bg-accent/40 transition-colors`}
                              onClick={() => {
                                if (notification.doctorId) {
                                  navigate(`/doctor/${notification.doctorId}`);
                                }
                              }}
                            >
                              <div className="flex items-start gap-3">
                                <div className={`p-2 rounded-full ${
                                  notification.type === 'message' 
                                    ? 'bg-blue-100' 
                                    : notification.type === 'appointment' 
                                      ? 'bg-green-100' 
                                      : 'bg-purple-100'
                                }`}>
                                  {getNotificationIcon(notification.type)}
                                </div>
                                <div className="flex-1">
                                  <p className="text-sm font-medium mb-1">{notification.title}</p>
                                  <p className="text-xs text-muted-foreground">{notification.content}</p>
                                  <p className="text-xs text-muted-foreground mt-1">
                                    {new Date(notification.timestamp).toLocaleString([], {
                                      hour: '2-digit',
                                      minute: '2-digit',
                                      day: 'numeric',
                                      month: 'short'
                                    })}
                                  </p>
                                </div>
                                {!notification.isRead && (
                                  <div className="w-2 h-2 bg-primary rounded-full mt-1" />
                                )}
                              </div>
                            </motion.div>
                          ))}
                        </AnimatePresence>
                      ) : (
                        <div className="text-center py-4 text-muted-foreground">
                          <p className="text-sm">No recent notifications</p>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        </section>
        
        {/* New Sections */}
        <HowItWorks />
        <AppFeatures />
        <TestimonialsSection />
        
        {/* Call to Action */}
        <motion.section 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="py-12 mt-12 text-center px-4"
        >
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-6 sf-display">Ready to take control of your health?</h2>
            <p className="text-lg text-muted-foreground mb-8">
              Join thousands of Kenyans who are managing their health more effectively with WellnessConnect Kenya.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={navigateToFindDoctors}
                size="lg"
                className="bg-primary hover:bg-primary/90 text-white"
              >
                Find a Doctor
              </Button>
              <Button 
                onClick={navigateToSymptomChecker}
                variant="outline"
                size="lg"
              >
                Check Your Symptoms
              </Button>
            </div>
          </div>
        </motion.section>
      </div>
    </div>
  );
};

export default Home;
