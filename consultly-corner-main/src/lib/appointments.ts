
import { useToast } from "@/hooks/use-toast";
import { v4 as uuidv4 } from 'uuid';

// Define the Appointment interface
export interface Appointment {
  id: string;
  doctorId: string;
  userId: string;
  date: string;
  time: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  type: 'video' | 'in-person';
  createdAt?: string;
  doctorName?: string;
  specialty?: string;
}

// Get appointments from localStorage
export const getAppointments = (): Appointment[] => {
  try {
    const storedAppointments = localStorage.getItem('appointments');
    return storedAppointments ? JSON.parse(storedAppointments) : [];
  } catch (error) {
    console.error('Error getting appointments:', error);
    return [];
  }
};

// Add a new appointment
export const addAppointment = (appointmentData: Omit<Appointment, 'id' | 'createdAt'>): Appointment => {
  try {
    const appointment: Appointment = {
      ...appointmentData,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
    };
    
    const appointments = getAppointments();
    appointments.push(appointment);
    localStorage.setItem('appointments', JSON.stringify(appointments));
    
    return appointment;
  } catch (error) {
    console.error('Error adding appointment:', error);
    throw new Error('Failed to add appointment');
  }
};

// Get appointments for a specific user
export const getUserAppointments = (userId: string): Appointment[] => {
  try {
    const appointments = getAppointments();
    return appointments.filter(appointment => appointment.userId === userId);
  } catch (error) {
    console.error('Error getting user appointments:', error);
    return [];
  }
};

// Get appointments for a specific doctor
export const getDoctorAppointments = (doctorId: string): Appointment[] => {
  try {
    const appointments = getAppointments();
    return appointments.filter(appointment => appointment.doctorId === doctorId);
  } catch (error) {
    console.error('Error getting doctor appointments:', error);
    return [];
  }
};

// Update appointment status
export const updateAppointmentStatus = (appointmentId: string, status: 'pending' | 'confirmed' | 'cancelled'): Appointment | null => {
  try {
    const appointments = getAppointments();
    let updatedAppointment: Appointment | null = null;
    
    const updatedAppointments = appointments.map(appointment => {
      if (appointment.id === appointmentId) {
        updatedAppointment = { ...appointment, status };
        return updatedAppointment;
      }
      return appointment;
    });
    
    if (updatedAppointment) {
      localStorage.setItem('appointments', JSON.stringify(updatedAppointments));
      return updatedAppointment;
    }
    
    return null;
  } catch (error) {
    console.error('Error updating appointment status:', error);
    throw new Error('Failed to update appointment status');
  }
};

// Delete an appointment
export const deleteAppointment = (appointmentId: string): boolean => {
  try {
    const appointments = getAppointments();
    const initialLength = appointments.length;
    const updatedAppointments = appointments.filter(appointment => appointment.id !== appointmentId);
    
    if (updatedAppointments.length === initialLength) {
      return false; // No appointment was removed
    }
    
    localStorage.setItem('appointments', JSON.stringify(updatedAppointments));
    return true;
  } catch (error) {
    console.error('Error deleting appointment:', error);
    throw new Error('Failed to delete appointment');
  }
};

// Get appointment by ID
export const getAppointmentById = (appointmentId: string): Appointment | undefined => {
  try {
    const appointments = getAppointments();
    return appointments.find(appointment => appointment.id === appointmentId);
  } catch (error) {
    console.error('Error getting appointment by ID:', error);
    return undefined;
  }
};
