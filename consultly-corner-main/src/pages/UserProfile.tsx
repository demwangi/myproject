
import React, { useState } from 'react';
import { useAppContext } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Calendar, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Edit3, 
  Save, 
  Calendar as CalendarIcon,
  UserCircle,
  CheckCircle
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as DateCalendar } from '@/components/ui/calendar';
import { format } from 'date-fns';

const UserProfile: React.FC = () => {
  const { user, setUser } = useAppContext();
  const { toast } = useToast();
  
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    dob: user?.profile?.dob || '',
    gender: user?.profile?.gender || '',
    phone: user?.profile?.phone || '',
    address: user?.profile?.address || '',
    bio: user?.profile?.bio || ''
  });
  
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    formData.dob ? new Date(formData.dob) : undefined
  );
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleGenderChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      gender: value
    }));
  };
  
  const handleDateChange = (date: Date | undefined) => {
    setSelectedDate(date);
    if (date) {
      setFormData(prev => ({
        ...prev,
        dob: date.toISOString().split('T')[0]
      }));
    }
  };
  
  const handleSave = () => {
    // Update user in context
    setUser({
      ...user!,
      name: formData.name,
      email: formData.email,
      profile: {
        ...user?.profile,
        dob: formData.dob,
        gender: formData.gender,
        phone: formData.phone,
        address: formData.address,
        bio: formData.bio
      }
    });
    
    setIsEditing(false);
    
    toast({
      title: "Profile updated",
      description: "Your profile has been updated successfully",
    });
  };
  
  if (!user) return null;
  
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
  };
  
  return (
    <div className="pt-20 pb-16 min-h-screen">
      <div className="container px-4 mx-auto max-w-4xl">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Profile Header */}
          <div className="bg-gradient-to-r from-primary/90 to-secondary/90 text-white p-8">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="user-avatar h-24 w-24 text-3xl">
                {getInitials(user.name)}
              </div>
              <div className="text-center md:text-left">
                <h1 className="text-2xl font-bold">{user.name}</h1>
                <p className="opacity-90">{user.email}</p>
                <p className="text-sm opacity-80 mt-1">
                  Member since {user.profile?.joinedDate ? format(new Date(user.profile.joinedDate), 'MMM yyyy') : 'Recently'}
                </p>
              </div>
              
              <Button 
                variant="outline" 
                size="sm" 
                className="ml-auto bg-white/20 hover:bg-white/30 border-white/40"
                onClick={() => setIsEditing(!isEditing)}
              >
                {isEditing ? (
                  <>
                    <CheckCircle className="mr-1 h-4 w-4" />
                    Cancel
                  </>
                ) : (
                  <>
                    <Edit3 className="mr-1 h-4 w-4" />
                    Edit Profile
                  </>
                )}
              </Button>
            </div>
          </div>
          
          {/* Profile Content */}
          <div className="p-6">
            {isEditing ? (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-medium">
                      Full Name
                    </label>
                    <div className="relative">
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="pl-10"
                      />
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium">
                      Email Address
                    </label>
                    <div className="relative">
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="pl-10"
                      />
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="dob" className="text-sm font-medium">
                      Date of Birth
                    </label>
                    <div className="relative">
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full justify-start text-left font-normal pl-10"
                          >
                            {selectedDate ? (
                              format(selectedDate, 'PPP')
                            ) : (
                              <span className="text-muted-foreground">Select date of birth</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <DateCalendar
                            mode="single"
                            selected={selectedDate}
                            onSelect={handleDateChange}
                            disabled={(date) => date > new Date() || date < new Date('1900-01-01')}
                            initialFocus
                            className="p-3 pointer-events-auto"
                          />
                        </PopoverContent>
                      </Popover>
                      <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="gender" className="text-sm font-medium">
                      Gender
                    </label>
                    <div className="relative">
                      <Select onValueChange={handleGenderChange} value={formData.gender}>
                        <SelectTrigger className="w-full pl-10">
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectItem value="female">Female</SelectItem>
                            <SelectItem value="male">Male</SelectItem>
                            <SelectItem value="non-binary">Non-binary</SelectItem>
                            <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                      <UserCircle className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="phone" className="text-sm font-medium">
                      Phone Number
                    </label>
                    <div className="relative">
                      <Input
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="pl-10"
                      />
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="address" className="text-sm font-medium">
                      Address
                    </label>
                    <div className="relative">
                      <Input
                        id="address"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        className="pl-10"
                      />
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="bio" className="text-sm font-medium">
                    Bio
                  </label>
                  <Textarea
                    id="bio"
                    name="bio"
                    value={formData.bio}
                    onChange={handleInputChange}
                    placeholder="Tell us a bit about yourself"
                    className="min-h-[120px]"
                  />
                </div>
                
                <div className="flex justify-end">
                  <Button
                    onClick={handleSave}
                    className="bg-primary hover:bg-primary/90 text-white"
                  >
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <h2 className="text-lg font-semibold">Personal Information</h2>
                    
                    <div className="space-y-3">
                      <div className="flex items-start">
                        <User className="h-5 w-5 text-primary mr-3 mt-0.5" />
                        <div>
                          <p className="text-sm text-muted-foreground">Full Name</p>
                          <p>{user.name}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <Mail className="h-5 w-5 text-primary mr-3 mt-0.5" />
                        <div>
                          <p className="text-sm text-muted-foreground">Email Address</p>
                          <p>{user.email}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <Calendar className="h-5 w-5 text-primary mr-3 mt-0.5" />
                        <div>
                          <p className="text-sm text-muted-foreground">Date of Birth</p>
                          <p>{user.profile?.dob ? format(new Date(user.profile.dob), 'MMMM d, yyyy') : 'Not specified'}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <UserCircle className="h-5 w-5 text-primary mr-3 mt-0.5" />
                        <div>
                          <p className="text-sm text-muted-foreground">Gender</p>
                          <p>{user.profile?.gender ? 
                              user.profile.gender.charAt(0).toUpperCase() + user.profile.gender.slice(1) : 
                              'Not specified'}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h2 className="text-lg font-semibold">Contact Information</h2>
                    
                    <div className="space-y-3">
                      <div className="flex items-start">
                        <Phone className="h-5 w-5 text-primary mr-3 mt-0.5" />
                        <div>
                          <p className="text-sm text-muted-foreground">Phone Number</p>
                          <p>{user.profile?.phone || 'Not specified'}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <MapPin className="h-5 w-5 text-primary mr-3 mt-0.5" />
                        <div>
                          <p className="text-sm text-muted-foreground">Address</p>
                          <p>{user.profile?.address || 'Not specified'}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="pt-4 border-t border-gray-100">
                  <h2 className="text-lg font-semibold mb-3">Bio</h2>
                  <p className="text-muted-foreground">
                    {user.profile?.bio || 'No bio provided. Edit your profile to add a bio.'}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
