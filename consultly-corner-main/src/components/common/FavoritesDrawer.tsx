
import React from 'react';
import { X, Star, Heart, Calendar, MapPin } from 'lucide-react';
import { useAppContext } from '@/context/AppContext';
import { useDoctors } from '@/hooks/useDoctors';
import { Button } from '@/components/ui/button';

interface FavoritesDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FavoritesDrawer: React.FC<FavoritesDrawerProps> = ({ isOpen, onClose }) => {
  const { favoriteDoctors, removeFromFavorites, setSelectedDoctorId, setIsAppointmentModalOpen } = useAppContext();
  const { getDoctorById } = useDoctors();
  
  const favoriteDoctorsList = favoriteDoctors
    .map(id => getDoctorById(id))
    .filter(doctor => doctor !== undefined);
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex justify-end">
      <div className="bg-white w-full max-w-md h-full overflow-y-auto animate-slide-in-right">
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center">
            <Heart className="text-primary mr-2" size={20} />
            <h2 className="text-xl font-semibold">Favorite Doctors</h2>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X size={20} />
          </Button>
        </div>
        
        <div className="p-4">
          {favoriteDoctorsList.length === 0 ? (
            <div className="text-center py-12">
              <Heart className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
              <h3 className="text-lg font-medium mb-1">No favorites yet</h3>
              <p className="text-muted-foreground">
                Add doctors to your favorites to quickly find them later
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {favoriteDoctorsList.map(doctor => (
                <div key={doctor?.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start">
                    <img 
                      src={doctor?.imageUrl} 
                      alt={doctor?.name} 
                      className="h-16 w-16 rounded-lg object-cover mr-4"
                    />
                    <div className="flex-1">
                      <h3 className="font-medium">{doctor?.name}</h3>
                      <p className="text-sm text-muted-foreground capitalize">{doctor?.specialty}</p>
                      
                      <div className="flex items-center mt-1 mb-2">
                        <div className="flex items-center text-yellow-500">
                          <Star className="fill-current h-4 w-4" />
                          <span className="ml-1 text-xs font-medium">{doctor?.rating}</span>
                        </div>
                        <span className="mx-2 text-muted-foreground text-xs">•</span>
                        <div className="flex items-center text-xs text-muted-foreground">
                          <MapPin size={12} className="mr-1" />
                          <span className="truncate">{doctor?.hospital}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between mt-3 pt-3 border-t">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="text-red-500 hover:text-red-600 hover:bg-red-50"
                      onClick={() => doctor && removeFromFavorites(doctor.id)}
                    >
                      Remove
                    </Button>
                    
                    <div className="flex space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          if (doctor) {
                            setSelectedDoctorId(doctor.id);
                            setIsAppointmentModalOpen(true);
                            onClose();
                          }
                        }}
                      >
                        <Calendar className="h-4 w-4 mr-1" />
                        Book
                      </Button>
                      <Button 
                        variant="default" 
                        size="sm"
                        onClick={() => {
                          if (doctor) {
                            window.location.href = `/doctor/${doctor.id}`;
                          }
                        }}
                      >
                        View
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
