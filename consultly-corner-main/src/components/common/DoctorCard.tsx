
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Star, MapPin, Clock, CheckCircle, Award, Calendar, Video } from 'lucide-react';
import { Doctor } from '@/data/doctors';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useToast } from '@/hooks/use-toast';
import { useAppContext } from '@/context/AppContext';

// Array of Kenyan/African doctor images
const KENYAN_DOCTOR_IMAGES = [
  'https://images.unsplash.com/photo-1559035636-a99258c3d0cf?q=80&w=1374&auto=format&fit=crop', // African doctor 1
  'https://images.unsplash.com/photo-1582750433449-648ed127bb54?q=80&w=1374&auto=format&fit=crop', // African doctor 2
  'https://images.unsplash.com/photo-1579202673506-ca3ce28943ef?q=80&w=1587&auto=format&fit=crop', // African doctor 3
  'https://images.unsplash.com/photo-1621608835794-0de6cb258058?q=80&w=1374&auto=format&fit=crop', // African doctor 4
  'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=1470&auto=format&fit=crop', // African doctor 5
  'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=1470&auto=format&fit=crop', // African doctor 6
  'https://images.unsplash.com/photo-1594824476967-48c8b964273f?q=80&w=1374&auto=format&fit=crop', // African doctor 7
  'https://images.unsplash.com/photo-1571772996211-2f02974dc681?q=80&w=1470&auto=format&fit=crop', // African doctor 8
];

interface DoctorCardProps {
  doctor: Doctor;
  className?: string;
}

export const DoctorCard: React.FC<DoctorCardProps> = ({ doctor, className }) => {
  const [imageError, setImageError] = useState(false);
  const { toast } = useToast();
  const { user, addAppointment } = useAppContext();
  
  // Get a consistent placeholder image based on doctor id
  const getPlaceholderImage = () => {
    const index = parseInt(doctor.id.replace(/\D/g, '')) % KENYAN_DOCTOR_IMAGES.length;
    return KENYAN_DOCTOR_IMAGES[index];
  };
  
  // Get next available slot (first day with availability)
  const getNextAvailableSlot = () => {
    const days = Object.keys(doctor.availability);
    for (const day of days) {
      if (doctor.availability[day].length > 0) {
        return `${day}, ${doctor.availability[day][0]}`;
      }
    }
    return "No availability";
  };

  const handleScheduleClick = (e: React.MouseEvent) => {
    // Show the cancellation policy
    toast({
      title: "Appointment Policy",
      description: "You can cancel appointments for free within 1 hour of booking. After that, a cancellation fee of KSh 500 applies.",
      duration: 5000,
    });
  };

  // Always use Kenyan doctor images
  const doctorImage = getPlaceholderImage();

  return (
    <motion.div 
      className={cn('h-full', className)}
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3 }}
    >
      <div className="doctor-card overflow-hidden border border-border/40 h-full bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow group">
        <div className="relative h-52 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-transparent z-10"></div>
          <img
            src={doctorImage}
            alt={doctor.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            loading="lazy"
            style={{ objectPosition: 'center' }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent pointer-events-none z-10"></div>
          <div className="absolute bottom-3 left-3 right-3 z-20">
            <h3 className="text-lg font-semibold text-white line-clamp-1">{doctor.name}</h3>
            <div className="flex items-center text-white/90 text-sm">
              <Badge variant="outline" className="text-xs bg-white/20 text-white border-white/40 mr-2">
                {doctor.specialty}
              </Badge>
              <div className="flex items-center">
                <Star className="fill-yellow-400 stroke-yellow-400 h-3.5 w-3.5 mr-1" />
                <span>{doctor.rating}</span>
                <span className="mx-1 opacity-60">•</span>
                <span className="text-xs opacity-80">{doctor.reviewCount} reviews</span>
              </div>
            </div>
          </div>
          
          <div className="absolute top-3 right-3 flex gap-2 z-20">
            <Badge className="bg-primary/90 hover:bg-primary text-white font-medium">
              KSh {doctor.consultationFee * 140}
            </Badge>
            
            <TooltipProvider delayDuration={300}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Badge variant="outline" className="bg-white/20 hover:bg-white/30 border-white/40 text-white">
                    <Video size={14} className="mr-1" />
                    Video
                  </Badge>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Video consultation available</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
        
        <div className="p-4 flex flex-col h-[calc(100%-13rem)]">
          <div className="space-y-2 mb-4">
            <div className="flex items-center text-sm text-muted-foreground">
              <MapPin size={14} className="mr-1 text-primary flex-shrink-0" />
              <span className="truncate">{doctor.hospital}</span>
            </div>
            
            <div className="flex items-center text-sm">
              <Award size={14} className="mr-1 text-primary flex-shrink-0" />
              <span>{doctor.experience} years experience</span>
            </div>
            
            <div className="flex items-center text-sm">
              <Clock size={14} className="mr-1 text-primary flex-shrink-0" />
              <span>Next available: {getNextAvailableSlot()}</span>
            </div>
            
            {doctor.acceptingNewPatients && (
              <div className="flex items-center text-sm text-emerald-600">
                <CheckCircle size={14} className="mr-1 flex-shrink-0" />
                <span>Accepting new patients</span>
              </div>
            )}
          </div>
          
          <div className="mt-auto pt-4 border-t border-border/30 grid grid-cols-2 gap-2">
            <Button 
              variant="outline" 
              size="sm"
              className="flex items-center justify-center gap-1"
              asChild
            >
              <Link to={`/doctor/${doctor.id}?schedule=true`} onClick={handleScheduleClick}>
                <Calendar size={14} />
                <span>Schedule</span>
              </Link>
            </Button>
            
            <Button 
              variant="default" 
              size="sm"
              className="flex items-center gap-1"
              asChild
            >
              <Link to={`/doctor/${doctor.id}`}>
                <span>View Profile</span>
                <motion.span 
                  animate={{ x: [0, 4, 0] }}
                  transition={{ repeat: Infinity, duration: 1.5, repeatDelay: 2 }}
                >
                  →
                </motion.span>
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
