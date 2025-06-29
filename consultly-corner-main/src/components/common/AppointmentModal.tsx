
import React, { useState } from 'react';
import { X, Calendar, Clock, ArrowRight } from 'lucide-react';
import { useAppContext } from '@/context/AppContext';
import { useDoctors } from '@/hooks/useDoctors';
import { Button } from './Button';
import { useToast } from '@/hooks/use-toast';

interface AppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AppointmentModal: React.FC<AppointmentModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { selectedDoctorId, user, setIsAuthModalOpen, setAuthMode, addNotification } = useAppContext();
  const { getDoctorById } = useDoctors();
  const { toast } = useToast();
  const doctor = selectedDoctorId ? getDoctorById(selectedDoctorId) : null;

  const [currentStep, setCurrentStep] = useState(1);
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [appointmentType, setAppointmentType] = useState<'video' | 'in-person'>('video');
  const [isLoading, setIsLoading] = useState(false);

  const handleNextStep = () => {
    // If user is not logged in and tries to proceed to final step, prompt signin
    if (currentStep === 2 && !user) {
      onClose();
      setAuthMode('signin');
      setIsAuthModalOpen(true);
      toast({
        title: "Authentication required",
        description: "Please sign in or create an account to book an appointment",
      });
      return;
    }
    setCurrentStep(prev => prev + 1);
  };

  const handlePrevStep = () => {
    setCurrentStep(prev => prev - 1);
  };

  const handleBookAppointment = () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      onClose();
      
      // Add appointment notification
      if (user && doctor) {
        addNotification({
          id: Date.now().toString(),
          userId: user.id,
          title: "Appointment Confirmed",
          content: `Your appointment with ${doctor.name} on ${selectedDay} at ${selectedTime} has been confirmed.`,
          timestamp: new Date().toISOString(),
          isRead: false,
          type: 'appointment'
        });
      }
      
      // Show success toast
      toast({
        title: "Appointment Booked",
        description: `Your appointment with Dr. ${doctor?.name} on ${selectedDay} at ${selectedTime} has been confirmed.`,
      });
      
      // Reset form state
      setCurrentStep(1);
      setSelectedDay(null);
      setSelectedTime(null);
      setAppointmentType('video');
    }, 1500);
  };

  if (!isOpen || !doctor) return null;

  // Get available days (exclude days with no availability)
  const availableDays = Object.entries(doctor.availability)
    .filter(([_, slots]) => slots.length > 0)
    .map(([day]) => day);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose}></div>
      
      <div 
        className="relative bg-card w-full max-w-md rounded-2xl shadow-xl overflow-hidden animate-slide-up"
        onClick={e => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h3 className="text-lg font-medium">Book Appointment</h3>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-accent focus:outline-none focus:ring-1 focus:ring-primary transition-colors"
          >
            <X size={18} />
          </button>
        </div>
        
        {/* Progress indicator */}
        <div className="w-full bg-muted h-1">
          <div 
            className="bg-primary h-1 transition-all duration-300" 
            style={{ width: `${(currentStep / 3) * 100}%` }}
          ></div>
        </div>
        
        {/* Modal Body */}
        <div className="p-5">
          {currentStep === 1 && (
            <div className="space-y-4">
              <div className="flex items-center space-x-4 mb-6">
                <img 
                  src={doctor.imageUrl} 
                  alt={doctor.name} 
                  className="w-16 h-16 rounded-full object-cover border border-border"
                />
                <div>
                  <h4 className="font-medium">{doctor.name}</h4>
                  <p className="text-sm text-muted-foreground capitalize">{doctor.specialty}</p>
                </div>
              </div>
              
              <h5 className="font-medium mb-3 flex items-center">
                <Calendar size={18} className="mr-2 text-primary" />
                Select Day
              </h5>
              
              <div className="grid grid-cols-2 gap-2">
                {availableDays.map((day) => (
                  <button
                    key={day}
                    className={`p-3 rounded-lg border text-left transition-colors ${
                      selectedDay === day
                        ? 'border-primary bg-primary/5 text-primary'
                        : 'border-border hover:border-primary/50'
                    }`}
                    onClick={() => setSelectedDay(day)}
                  >
                    {day}
                  </button>
                ))}
              </div>
            </div>
          )}
          
          {currentStep === 2 && (
            <div className="space-y-4">
              <h5 className="font-medium mb-3 flex items-center">
                <Clock size={18} className="mr-2 text-primary" />
                Select Time
              </h5>
              
              {selectedDay && (
                <div className="grid grid-cols-3 gap-2">
                  {doctor.availability[selectedDay].map((time) => (
                    <button
                      key={time}
                      className={`p-2 rounded-lg border text-center text-sm transition-colors ${
                        selectedTime === time
                          ? 'border-primary bg-primary/5 text-primary'
                          : 'border-border hover:border-primary/50'
                      }`}
                      onClick={() => setSelectedTime(time)}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
          
          {currentStep === 3 && (
            <div className="space-y-4">
              <h5 className="font-medium mb-3">Appointment Type</h5>
              
              <div className="grid grid-cols-2 gap-3">
                <button
                  className={`p-3 rounded-lg border text-center transition-colors ${
                    appointmentType === 'video'
                      ? 'border-primary bg-primary/5 text-primary'
                      : 'border-border hover:border-primary/50'
                  }`}
                  onClick={() => setAppointmentType('video')}
                >
                  <span className="block font-medium">Video Call</span>
                  <span className="text-xs text-muted-foreground">Meet online</span>
                </button>
                
                <button
                  className={`p-3 rounded-lg border text-center transition-colors ${
                    appointmentType === 'in-person'
                      ? 'border-primary bg-primary/5 text-primary'
                      : 'border-border hover:border-primary/50'
                  }`}
                  onClick={() => setAppointmentType('in-person')}
                >
                  <span className="block font-medium">In Person</span>
                  <span className="text-xs text-muted-foreground">Visit clinic</span>
                </button>
              </div>
              
              <div className="mt-6 bg-muted/50 p-4 rounded-lg">
                <h6 className="font-medium mb-2">Appointment Summary</h6>
                <div className="text-sm space-y-1">
                  <p>
                    <span className="text-muted-foreground">Doctor:</span> {doctor.name}
                  </p>
                  <p>
                    <span className="text-muted-foreground">Date:</span> {selectedDay}
                  </p>
                  <p>
                    <span className="text-muted-foreground">Time:</span> {selectedTime}
                  </p>
                  <p>
                    <span className="text-muted-foreground">Type:</span> {appointmentType === 'video' ? 'Video Call' : 'In Person'}
                  </p>
                  <p>
                    <span className="text-muted-foreground">Fee:</span> ${doctor.consultationFee}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Modal Footer */}
        <div className="flex justify-between p-4 border-t border-border">
          {currentStep > 1 ? (
            <Button variant="outline" onClick={handlePrevStep}>
              Back
            </Button>
          ) : (
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
          )}
          
          {currentStep < 3 ? (
            <Button 
              onClick={handleNextStep}
              disabled={currentStep === 1 && !selectedDay || currentStep === 2 && !selectedTime}
              rightIcon={<ArrowRight size={16} />}
            >
              Continue
            </Button>
          ) : (
            <Button 
              onClick={handleBookAppointment}
              isLoading={isLoading}
            >
              Book Appointment
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
