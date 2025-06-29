
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Stethoscope, Send, AlertCircle, CheckCircle, Loader2, MessageSquare, User, Bot, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { useDoctors } from '@/hooks/useDoctors';
import { useToast } from '@/hooks/use-toast';
import { v4 as uuidv4 } from 'uuid';
import { Appointment, addAppointment } from '@/lib/appointments';
import { useUser } from '@/hooks/useUser';

interface Symptom {
  id: string;
  name: string;
}

interface Condition {
  id: string;
  name: string;
  description: string;
  severity: 'low' | 'medium' | 'high';
  specialty: string;
}

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  isAnalysis?: boolean;
  conditions?: Condition[];
  doctors?: any[];
}

// Mock data for symptoms
const availableSymptoms: Symptom[] = [
  { id: 's1', name: 'Headache' },
  { id: 's2', name: 'Fever' },
  { id: 's3', name: 'Cough' },
  { id: 's4', name: 'Sore throat' },
  { id: 's5', name: 'Shortness of breath' },
  { id: 's6', name: 'Fatigue' },
  { id: 's7', name: 'Nausea' },
  { id: 's8', name: 'Dizziness' },
  { id: 's9', name: 'Chest pain' },
  { id: 's10', name: 'Back pain' },
  { id: 's11', name: 'Joint pain' },
  { id: 's12', name: 'Rash' },
  { id: 's13', name: 'Abdominal pain' },
  { id: 's14', name: 'Diarrhea' },
  { id: 's15', name: 'Loss of appetite' },
];

// Mock data for conditions
const possibleConditions: Record<string, Condition[]> = {
  's1': [
    { id: 'c1', name: 'Tension headache', description: 'Common headache with mild to moderate pain', severity: 'low', specialty: 'General Practitioner' },
    { id: 'c2', name: 'Migraine', description: 'Severe headache often with nausea and sensitivity to light', severity: 'medium', specialty: 'Neurologist' },
    { id: 'c3', name: 'Cluster headache', description: 'Extremely painful headaches occurring in clusters', severity: 'high', specialty: 'Neurologist' },
  ],
  's2': [
    { id: 'c4', name: 'Common cold', description: 'Viral infection with mild fever and upper respiratory symptoms', severity: 'low', specialty: 'General Practitioner' },
    { id: 'c5', name: 'Influenza', description: 'Viral infection with high fever, body aches, and fatigue', severity: 'medium', specialty: 'General Practitioner' },
    { id: 'c6', name: 'Malaria', description: 'Parasitic infection with cycles of fever, chills, and sweats', severity: 'high', specialty: 'Infectious Disease' },
  ],
  's3': [
    { id: 'c7', name: 'Common cold', description: 'Viral infection with mild cough and congestion', severity: 'low', specialty: 'General Practitioner' },
    { id: 'c8', name: 'Bronchitis', description: 'Inflammation of the bronchial tubes with persistent cough', severity: 'medium', specialty: 'Pulmonologist' },
    { id: 'c9', name: 'Pneumonia', description: 'Infection of the lungs with cough, fever, and difficulty breathing', severity: 'high', specialty: 'Pulmonologist' },
  ],
  's5': [
    { id: 'c10', name: 'Anxiety', description: 'Feeling of worry or fear that can cause physical symptoms', severity: 'medium', specialty: 'Psychiatrist' },
    { id: 'c11', name: 'Asthma', description: 'Chronic condition with recurring episodes of breathlessness', severity: 'medium', specialty: 'Pulmonologist' },
    { id: 'c12', name: 'Pneumonia', description: 'Infection of the lungs with cough, fever, and difficulty breathing', severity: 'high', specialty: 'Pulmonologist' },
  ],
  's9': [
    { id: 'c13', name: 'Acid reflux', description: 'Stomach acid flows back into the esophagus causing pain', severity: 'low', specialty: 'Gastroenterologist' },
    { id: 'c14', name: 'Angina', description: 'Reduced blood flow to the heart causing chest pain', severity: 'medium', specialty: 'Cardiologist' },
    { id: 'c15', name: 'Heart attack', description: 'Blocked blood flow to the heart requiring immediate attention', severity: 'high', specialty: 'Cardiologist' },
  ],
};

// Default to the first symptom's conditions for any symptom not in our mock data
const defaultConditions = possibleConditions['s1'];

// Helper function to get greeting based on time of day
const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
};

const emergencySymptoms = [
  'chest pain', 'difficulty breathing', 'severe bleeding', 'unconscious', 'stroke', 
  'heart attack', 'severe burn', 'seizure', 'suicide', 'poisoning'
];

export const SymptomCheckerEnhanced: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: `${getGreeting()}! I'm your AI health assistant. Please describe your symptoms, and I'll help analyze them. For example, you can say "I've had a headache and fever for 2 days".`,
      sender: 'ai',
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [analyzedSymptoms, setAnalyzedSymptoms] = useState<Symptom[]>([]);
  const [showAppointmentForm, setShowAppointmentForm] = useState<{show: boolean, doctorId: string} | null>(null);
  const [appointmentDate, setAppointmentDate] = useState('');
  const [appointmentTime, setAppointmentTime] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { doctors } = useDoctors();
  const { toast } = useToast();
  const { user } = useUser();

  // Function to detect emergency situations
  const checkForEmergency = (text: string) => {
    const lowercaseText = text.toLowerCase();
    return emergencySymptoms.some(symptom => lowercaseText.includes(symptom));
  };

  // Function to find symptoms in user text
  const findSymptoms = (text: string) => {
    const lowercaseText = text.toLowerCase();
    return availableSymptoms.filter(symptom => 
      lowercaseText.includes(symptom.name.toLowerCase())
    );
  };

  // Function to analyze symptoms and return conditions
  const analyzeSymptoms = (symptoms: Symptom[]) => {
    if (symptoms.length === 0) return [];
    
    // Get conditions for the first detected symptom, or default if not found
    const mainSymptom = symptoms[0];
    const matchedConditions = possibleConditions[mainSymptom.id] || defaultConditions;
    
    // If multiple symptoms, prioritize more severe conditions
    if (symptoms.length > 1) {
      return [...matchedConditions].sort((a, b) => {
        const severityMap = { high: 3, medium: 2, low: 1 };
        return severityMap[b.severity] - severityMap[a.severity];
      });
    }
    
    return matchedConditions;
  };

  // Function to find recommended doctors based on condition
  const findRecommendedDoctors = (condition: Condition) => {
    return doctors.filter(doctor => 
      doctor.specialty.toLowerCase() === condition.specialty.toLowerCase() ||
      doctor.specialty.toLowerCase().includes(condition.specialty.toLowerCase()) ||
      condition.specialty.toLowerCase().includes(doctor.specialty.toLowerCase())
    ).slice(0, 3);
  };

  // Handle appointment booking
  const handleBookAppointment = (doctorId: string) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to book an appointment",
        variant: "destructive"
      });
      return;
    }

    setShowAppointmentForm({show: true, doctorId});
  };

  // Submit appointment
  const submitAppointment = () => {
    if (!showAppointmentForm || !appointmentDate || !appointmentTime || !user) {
      toast({
        title: "Missing Information",
        description: "Please fill in all appointment details",
        variant: "destructive"
      });
      return;
    }
    
    const newAppointment: Appointment = {
      id: uuidv4(),
      doctorId: showAppointmentForm.doctorId,
      userId: typeof user === 'string' ? user : user.id,
      date: appointmentDate,
      time: appointmentTime,
      status: 'pending',
      type: 'in-person'
    };
    
    addAppointment(newAppointment);
    
    toast({
      title: "Appointment Booked",
      description: `Your appointment has been scheduled for ${appointmentDate} at ${appointmentTime}`,
    });
    
    setShowAppointmentForm(null);
    setAppointmentDate('');
    setAppointmentTime('');
    
    // Add confirmation message to chat
    setMessages(prev => [...prev, {
      id: Date.now().toString(),
      text: `✅ Success! Your appointment has been scheduled for ${appointmentDate} at ${appointmentTime}. You can view and manage all your appointments in your profile.`,
      sender: 'ai',
      timestamp: new Date()
    }]);
  };

  // Function to generate AI response based on user message
  const generateAIResponse = (userText: string, detectedSymptoms: Symptom[]) => {
    const isEmergency = checkForEmergency(userText);
    
    if (isEmergency) {
      return {
        text: "⚠️ EMERGENCY ALERT: Based on what you've described, you may be experiencing a medical emergency. Please seek immediate medical attention by visiting your nearest emergency room or calling emergency services. Don't wait for symptoms to worsen.",
        isAnalysis: false,
        conditions: [],
        doctors: []
      };
    }
    
    if (detectedSymptoms.length === 0) {
      return {
        text: "I couldn't identify specific symptoms from your description. Could you please provide more details about how you're feeling? For example, do you have pain, fever, cough, fatigue, or other symptoms? When did they start, and how severe are they?",
        isAnalysis: false,
        conditions: [],
        doctors: []
      };
    }
    
    const matchedConditions = analyzeSymptoms(detectedSymptoms);
    const symptomsList = detectedSymptoms.map(s => s.name).join(', ');
    
    let responseText = `Based on your symptoms of ${symptomsList}, here's my analysis:\n\n`;
    
    // Add formatted conditions to the response
    matchedConditions.forEach((condition, index) => {
      responseText += `${index + 1}. **${condition.name}** (${condition.severity} severity): ${condition.description}\n`;
    });
    
    // Find recommended doctors for the most likely condition
    const recommendedDoctors = findRecommendedDoctors(matchedConditions[0]);
    
    responseText += `\nBased on your symptoms, I recommend consulting with a ${matchedConditions[0]?.specialty || 'healthcare professional'}.`;
    
    if (recommendedDoctors.length > 0) {
      responseText += ` I've found ${recommendedDoctors.length} specialists who might be able to help with your condition.`;
    }
    
    responseText += `\n\nRemember, this is not a definitive diagnosis. For proper medical advice, please consult with a healthcare professional.`;
    
    return {
      text: responseText,
      isAnalysis: true,
      conditions: matchedConditions,
      doctors: recommendedDoctors
    };
  };

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;
    
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);
    
    // Detect symptoms from user input
    const detectedSymptoms = findSymptoms(inputValue);
    setAnalyzedSymptoms(detectedSymptoms);
    
    // Simulate AI thinking time
    setTimeout(() => {
      const aiResponse = generateAIResponse(inputValue, detectedSymptoms);
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: aiResponse.text,
        sender: 'ai',
        timestamp: new Date(),
        isAnalysis: aiResponse.isAnalysis,
        conditions: aiResponse.conditions,
        doctors: aiResponse.doctors
      };
      
      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
      
      // If conditions were found, show a toast notification
      if (aiResponse.conditions && aiResponse.conditions.length > 0) {
        toast({
          title: "Symptom Analysis Complete",
          description: `${aiResponse.conditions.length} possible conditions identified.`,
        });
      }
    }, 1500);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleFindDoctors = (specialty: string) => {
    navigate(`/find-doctors?specialty=${specialty}`);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'text-red-600 bg-red-50';
      case 'medium':
        return 'text-amber-600 bg-amber-50';
      case 'low':
        return 'text-green-600 bg-green-50';
      default:
        return 'text-blue-600 bg-blue-50';
    }
  };

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="max-w-4xl mx-auto flex flex-col h-[600px]">
      {/* Chat Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 bg-gray-50 rounded-t-xl border border-b-0">
        <AnimatePresence>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className={`mb-4 flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex items-start max-w-[80%] ${message.sender === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className={`rounded-full p-2 flex-shrink-0 ${message.sender === 'user' ? 'bg-primary ml-2' : 'bg-gray-200 mr-2'}`}>
                  {message.sender === 'user' ? 
                    <User className={`h-5 w-5 ${message.sender === 'user' ? 'text-white' : 'text-gray-700'}`} /> : 
                    <Bot className={`h-5 w-5 ${message.sender === 'ai' ? 'text-gray-700' : 'text-white'}`} />
                  }
                </div>
                <div 
                  className={`p-3 rounded-lg ${
                    message.sender === 'user' 
                      ? 'bg-primary text-white rounded-tr-none' 
                      : 'bg-white text-gray-800 border rounded-tl-none'
                  }`}
                >
                  <div className="whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: message.text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br/>') }} />
                  
                  {/* Render analyzed conditions if present */}
                  {message.isAnalysis && message.conditions && message.conditions.length > 0 && (
                    <div className="mt-4 pt-3 border-t border-gray-200">
                      <div className="space-y-2">
                        {message.conditions.slice(0, 3).map((condition) => (
                          <div key={condition.id} className="flex justify-between items-center">
                            <div className="flex items-center">
                              <Badge className={`mr-2 ${getSeverityColor(condition.severity)}`}>
                                {condition.severity.charAt(0).toUpperCase() + condition.severity.slice(1)}
                              </Badge>
                              <span className="font-medium">{condition.name}</span>
                            </div>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleFindDoctors(condition.specialty)}
                              className="text-xs"
                            >
                              Find {condition.specialty}
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Render recommended doctors if present */}
                  {message.doctors && message.doctors.length > 0 && (
                    <div className="mt-4 pt-3 border-t border-gray-200">
                      <h4 className="text-sm font-medium mb-2">Recommended Specialists:</h4>
                      <div className="space-y-3">
                        {message.doctors.map((doctor) => (
                          <div key={doctor.id} className="flex justify-between items-center bg-gray-50 p-2 rounded-md">
                            <div className="flex items-center">
                              <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden mr-2">
                                <img src={doctor.imageUrl} alt={doctor.name} className="w-full h-full object-cover" />
                              </div>
                              <div>
                                <div className="font-medium text-sm">{doctor.name}</div>
                                <div className="text-xs text-gray-500">{doctor.specialty} • {doctor.hospital}</div>
                              </div>
                            </div>
                            <div className="flex space-x-2">
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => navigate(`/doctor/${doctor.id}`)}
                                className="text-xs"
                              >
                                View Profile
                              </Button>
                              <Button 
                                size="sm" 
                                variant="default"
                                onClick={() => handleBookAppointment(doctor.id)}
                                className="text-xs"
                              >
                                <Calendar className="h-3 w-3 mr-1" />
                                Book
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
          {isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-start mb-4"
            >
              <div className="flex items-start">
                <div className="rounded-full p-2 bg-gray-200 mr-2">
                  <Bot className="h-5 w-5 text-gray-700" />
                </div>
                <div className="p-3 rounded-lg bg-white text-gray-800 border rounded-tl-none flex items-center">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
          <div ref={messagesEndRef} />
        </AnimatePresence>
      </div>
      
      {/* Appointment booking form */}
      {showAppointmentForm && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-4 border-t border-b"
        >
          <h3 className="font-medium mb-2">Book Appointment</h3>
          <div className="grid grid-cols-2 gap-3 mb-3">
            <div>
              <label htmlFor="date" className="text-sm text-gray-600 block mb-1">Date</label>
              <input
                type="date"
                id="date"
                className="w-full p-2 border rounded-md"
                min={new Date().toISOString().split('T')[0]}
                value={appointmentDate}
                onChange={(e) => setAppointmentDate(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="time" className="text-sm text-gray-600 block mb-1">Time</label>
              <select
                id="time"
                className="w-full p-2 border rounded-md"
                value={appointmentTime}
                onChange={(e) => setAppointmentTime(e.target.value)}
              >
                <option value="">Select time</option>
                <option value="09:00 AM">09:00 AM</option>
                <option value="10:00 AM">10:00 AM</option>
                <option value="11:00 AM">11:00 AM</option>
                <option value="01:00 PM">01:00 PM</option>
                <option value="02:00 PM">02:00 PM</option>
                <option value="03:00 PM">03:00 PM</option>
                <option value="04:00 PM">04:00 PM</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end space-x-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setShowAppointmentForm(null)}
            >
              Cancel
            </Button>
            <Button 
              variant="default" 
              size="sm"
              onClick={submitAppointment}
              disabled={!appointmentDate || !appointmentTime}
            >
              Confirm Booking
            </Button>
          </div>
        </motion.div>
      )}
      
      {/* Input Area */}
      <div className="p-4 border rounded-b-xl bg-white">
        <div className="flex">
          <Textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Describe your symptoms in detail..."
            className="resize-none min-h-[60px]"
          />
          <Button 
            onClick={handleSendMessage} 
            className="ml-2 self-end" 
            size="icon"
            disabled={isTyping || !inputValue.trim()}
          >
            <Send className="h-5 w-5" />
          </Button>
        </div>
        <div className="mt-2 text-xs text-muted-foreground">
          <AlertCircle className="h-3 w-3 inline-block mr-1" />
          This is not a replacement for professional medical advice. For severe symptoms, seek immediate care.
        </div>
      </div>
    </div>
  );
};
