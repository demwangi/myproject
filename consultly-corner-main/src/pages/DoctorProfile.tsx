
// src/pages/DoctorProfile.tsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Calendar as CalendarIcon } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { DayPicker } from "react-day-picker"
import { addAppointment, Appointment } from '@/lib/appointments';
import { useToast } from "@/hooks/use-toast"
import { useUser } from '@/hooks/useUser';
import { Doctor } from '@/data/doctors';
import { useDoctors } from '@/hooks/useDoctors';
import { ReviewCard } from '@/components/common/ReviewCard';
import { Chat } from '@/components/common/Chat';
import { Skeleton } from "@/components/ui/skeleton"
import { ReviewType } from '@/components/common/PatientReview';

const DoctorProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user: currentUser } = useUser();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [selectedType, setSelectedType] = useState<'video' | 'in-person'>('in-person');
  const { getDoctorById, getDoctorReviews } = useDoctors();
  const [doctor, setDoctor] = useState<Doctor | undefined>(undefined);
  const [reviews, setReviews] = useState<ReviewType[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (id) {
      const fetchDoctor = async () => {
        setIsLoading(true);
        const fetchedDoctor = getDoctorById(id);
        setDoctor(fetchedDoctor);
        setIsLoading(false);
      };
      fetchDoctor();
    }
  }, [id, getDoctorById]);

  useEffect(() => {
    if (id) {
      const fetchReviews = async () => {
        const fetchedReviews = getDoctorReviews(id);
        setReviews(fetchedReviews);
      };
      fetchReviews();
    }
  }, [id, getDoctorReviews]);

  const handleBookAppointment = () => {
    if (!selectedDate || !selectedTime || !selectedType) {
      toast({
        title: "Missing information",
        description: "Please select a date, time, and appointment type",
        variant: "destructive"
      });
      return;
    }

    if (!currentUser) {
      toast({
        title: "Authentication Required",
        description: "Please log in to book an appointment",
        variant: "destructive"
      });
      return;
    }

    // Generate unique ID
    const appointmentId = `appt-${Date.now()}`;
    
    const appointment: Appointment = {
      id: appointmentId,
      doctorId: id || '',
      userId: typeof currentUser === 'string' ? currentUser : currentUser.id,
      date: selectedDate,
      time: selectedTime,
      status: 'pending',
      type: selectedType,
    };
    
    addAppointment(appointment);
    toast({
      title: "Appointment Booked",
      description: `Your appointment with Dr. ${doctor?.name} is confirmed for ${selectedDate} at ${selectedTime}`,
    });
    
    setIsDialogOpen(false);
    // Reset form
    setSelectedDate('');
    setSelectedTime('');
    setSelectedType('in-person');
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-10">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Doctor's Profile Section */}
          <div className="md:w-1/3">
            <Card className="shadow-md">
              <CardContent className="p-4 flex flex-col items-center">
                <Skeleton className="w-32 h-32 rounded-full mb-4" />
                <Skeleton className="h-8 w-3/4 mb-2" />
                <Skeleton className="h-6 w-1/2 mb-4" />
                <Skeleton className="h-5 w-full mb-2" />
                <Skeleton className="h-5 w-full mb-2" />
                <Skeleton className="h-5 w-full mb-4" />
                <Skeleton className="h-10 w-full" />
              </CardContent>
            </Card>
          </div>

          {/* Doctor's Details and Booking Section */}
          <div className="md:w-2/3">
            <Card className="shadow-md">
              <CardContent className="p-6">
                <Skeleton className="h-8 w-1/2 mb-4" />
                <Skeleton className="h-5 w-full mb-3" />
                <Skeleton className="h-5 w-full mb-3" />
                <Skeleton className="h-5 w-2/3 mb-4" />
                <Skeleton className="h-10 w-full" />
                <div className="mt-6">
                  <Skeleton className="h-8 w-1/3 mb-4" />
                  <Skeleton className="h-5 w-full mb-3" />
                  <Skeleton className="h-5 w-full mb-3" />
                  <Skeleton className="h-5 w-2/3 mb-4" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10">
      {doctor ? (
        <div className="flex flex-col md:flex-row gap-8">
          {/* Doctor's Profile Section */}
          <div className="md:w-1/3">
            <Card className="shadow-md">
              <CardContent className="p-4 flex flex-col items-center">
                <Avatar className="w-32 h-32 rounded-full mb-4">
                  <AvatarImage src={doctor.imageUrl} alt={doctor.name} />
                  <AvatarFallback>{doctor.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <h2 className="text-2xl font-semibold">{doctor.name}</h2>
                <p className="text-muted-foreground">{doctor.specialty}</p>
                <div className="flex items-center mt-2">
                  <Badge variant="secondary">
                    {doctor.rating} Rating ({doctor.reviewCount} Reviews)
                  </Badge>
                </div>
                <p className="text-muted-foreground mt-4 text-center">{doctor.bio}</p>
                <Button className="mt-4 w-full" onClick={() => navigate('/find-doctors')}>
                  View Other Doctors
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Doctor's Details and Booking Section */}
          <div className="md:w-2/3">
            <Card className="shadow-md">
              <CardContent className="p-6">
                <h2 className="text-2xl font-semibold mb-4">About Dr. {doctor.name.split(' ')[1]}</h2>
                <p className="text-muted-foreground mb-3">
                  <strong>Hospital:</strong> {doctor.hospital}
                </p>
                <p className="text-muted-foreground mb-3">
                  <strong>Experience:</strong> {doctor.experience} years
                </p>
                <p className="text-muted-foreground mb-4">
                  <strong>Languages:</strong> {doctor.languages.join(', ')}
                </p>

                <h3 className="text-xl font-semibold mb-3">Book Appointment</h3>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="default">
                      <Calendar className="mr-2 h-4 w-4" />
                      Book Appointment
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Book Appointment</DialogTitle>
                      <DialogDescription>
                        Choose the date, time and type of appointment.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="date" className="text-right">
                          Date
                        </Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-[240px] pl-3 text-left font-normal",
                                !selectedDate && "text-muted-foreground"
                              )}
                            >
                              {selectedDate ? (
                                format(new Date(selectedDate), "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <DayPicker
                              mode="single"
                              selected={selectedDate ? new Date(selectedDate) : undefined}
                              onSelect={(date) => setSelectedDate(date ? format(date, 'yyyy-MM-dd') : '')}
                              disabled={(date) =>
                                date < new Date()
                              }
                              className="border-0 shadow-sm"
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="time" className="text-right">
                          Time
                        </Label>
                        <Input
                          id="time"
                          value={selectedTime}
                          onChange={(e) => setSelectedTime(e.target.value)}
                          className="col-span-3"
                          type="time"
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="type" className="text-right">
                          Type
                        </Label>
                        <Select onValueChange={(value) => setSelectedType(value as "video" | "in-person")}>
                          <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="video">Video Call</SelectItem>
                            <SelectItem value="in-person">In-Person</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <Button onClick={handleBookAppointment}>Book Appointment</Button>
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>
          </div>
        </div>
      ) : (
        <p>Doctor not found.</p>
      )}
      
      {/* Reviews Section */}
      {reviews && reviews.length > 0 && (
        <div className="mt-8">
          <h2 className="text-2xl font-semibold mb-4">Patient Reviews</h2>
          <div className="space-y-4">
            {reviews.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </div>
        </div>
      )}
      
      {/* Chat Section */}
      {doctor && (
        <div className="mt-8">
          <h2 className="text-2xl font-semibold mb-4">Chat with Dr. {doctor.name.split(' ')[1]}</h2>
          <Chat doctorId={doctor.id} />
        </div>
      )}
    </div>
  );
};

export default DoctorProfile;
