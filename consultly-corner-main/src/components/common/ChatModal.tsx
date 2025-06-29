
import React, { useState, useRef, useEffect } from 'react';
import { X, Send, SmilePlus, User, Sparkles, PhoneCall, Loader2, Image as ImageIcon } from 'lucide-react';
import { useAppContext } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useDoctors } from '@/hooks/useDoctors';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { motion, AnimatePresence } from 'framer-motion';

// Emoji picker data
const emojiCategories = [
  { 
    name: 'Smileys',
    emojis: ['😊', '😃', '😄', '😁', '😆', '😅', '😂', '🤣', '😊', '😇', '🙂', '🙃', '😉', '😌', '😍', '🥰', '😘']
  },
  {
    name: 'Gestures',
    emojis: ['👍', '👎', '👌', '🤞', '✌️', '🤟', '🤘', '👏', '🙌', '👐', '🤲', '🙏', '🤝', '💪']
  },
  {
    name: 'Objects',
    emojis: ['❤️', '💕', '💯', '✨', '🔥', '💫', '📱', '💻', '🖥️', '📞', '📷', '🎮', '🎧', '🔋']
  }
];

interface ChatModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ChatModal: React.FC<ChatModalProps> = ({ isOpen, onClose }) => {
  const { user, chats, addMessage, selectedDoctorId, markMessageAsRead } = useAppContext();
  const { getDoctorById, getDoctorResponse } = useDoctors();
  const [message, setMessage] = useState('');
  const [activeTab, setActiveTab] = useState<'ai' | 'agent'>('ai');
  const [waitingForAgent, setWaitingForAgent] = useState(false);
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  const selectedDoctor = selectedDoctorId ? getDoctorById(selectedDoctorId) : null;
  
  const filteredChats = chats.filter(chat => 
    (selectedDoctorId && chat.senderId === selectedDoctorId) || 
    (selectedDoctorId && chat.receiverId === selectedDoctorId) ||
    (!selectedDoctorId)
  );
  
  useEffect(() => {
    // Mark messages as read when opened
    filteredChats.forEach(chat => {
      if (chat.receiverId === user?.id && !chat.isRead) {
        markMessageAsRead(chat.id);
      }
    });
  }, [filteredChats, user, markMessageAsRead]);
  
  useEffect(() => {
    // Scroll to bottom when new messages are added
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [filteredChats]);
  
  useEffect(() => {
    if (activeTab === 'agent' && waitingForAgent) {
      const timer = setTimeout(() => {
        setWaitingForAgent(false);
        
        // Add automated message from agent
        if (user) {
          addMessage({
            id: Date.now().toString(),
            senderId: selectedDoctorId || 'agent-1',
            receiverId: user.id,
            content: "Hello! This is Sarah from support. How can I help you today?",
            timestamp: new Date().toISOString(),
            isRead: true
          });
        }
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [activeTab, waitingForAgent, addMessage, user, selectedDoctorId]);
  
  const getAIResponse = (userMessage: string) => {
    // Simulate AI response
    setIsTyping(true);
    
    setTimeout(() => {
      setIsTyping(false);
      
      if (user) {
        let response;
        
        if (userMessage.toLowerCase().includes('appointment')) {
          response = "You can book an appointment by visiting the Find Doctors page and selecting a specialist. Would you like me to guide you through the process?";
        } else if (userMessage.toLowerCase().includes('symptom')) {
          response = "If you're experiencing symptoms, I recommend using our Symptom Checker tool. It can help analyze your symptoms and suggest appropriate specialists. Would you like to try it?";
        } else if (userMessage.toLowerCase().includes('profile')) {
          response = "You can edit your profile information by visiting your Profile page. You can update personal details like your date of birth, contact information, and bio. Need help finding it?";
        } else if (userMessage.toLowerCase().includes('doctor')) {
          response = "Our platform features various specialists including gynecologists, therapists, and psychiatrists. You can search and filter by specialty on the Find Doctors page. Would you like to see available doctors now?";
        } else if (userMessage.toLowerCase().includes('stress') || userMessage.toLowerCase().includes('anxiety')) {
          response = "I understand that stress and anxiety can be challenging. Our platform has several qualified therapists and psychiatrists who specialize in mental health. Would you like me to help you find a specialist?";
        } else if (userMessage.toLowerCase().includes('pregnancy') || userMessage.toLowerCase().includes('women')) {
          response = "For women's health concerns, we have experienced gynecologists and obstetricians who can provide specialized care. I can help you book an appointment with one of them if you'd like.";
        } else if (userMessage.toLowerCase().includes('thank')) {
          response = "You're welcome! I'm here to assist you with any other questions or needs you might have about WellnessConnect services.";
        } else {
          response = "I'm here to help you navigate WellnessConnect. You can ask me about booking appointments, checking symptoms, finding doctors, or managing your profile. How can I assist you today?";
        }
        
        addMessage({
          id: Date.now().toString(),
          senderId: 'ai-assistant',
          receiverId: user.id,
          content: response,
          timestamp: new Date().toISOString(),
          isRead: true,
          isAI: true
        });
      }
    }, 1500);
  };
  
  const getDoctorReply = (userMessage: string) => {
    if (!selectedDoctorId || !user) return;
    
    setIsTyping(true);
    
    // Simulate typing delay based on message length
    const typingDelay = Math.min(2000, 1000 + userMessage.length * 10);
    
    setTimeout(() => {
      setIsTyping(false);
      
      const doctorResponse = getDoctorResponse(selectedDoctorId, userMessage);
      
      addMessage({
        id: Date.now().toString(),
        senderId: selectedDoctorId,
        receiverId: user.id,
        content: doctorResponse,
        timestamp: new Date().toISOString(),
        isRead: true
      });
    }, typingDelay);
  };
  
  const handleSendMessage = () => {
    if (!message.trim() || !user) return;
    
    // Add user message
    addMessage({
      id: Date.now().toString(),
      senderId: user.id,
      receiverId: selectedDoctorId || (activeTab === 'ai' ? 'ai-assistant' : 'agent-1'),
      content: message,
      timestamp: new Date().toISOString(),
      isRead: true
    });
    
    const currentMessage = message;
    setMessage('');
    
    if (selectedDoctorId) {
      // Get response from doctor
      getDoctorReply(currentMessage);
    } else if (activeTab === 'ai') {
      getAIResponse(currentMessage);
    } else if (!waitingForAgent) {
      setWaitingForAgent(true);
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };
  
  const handleEmojiClick = (emoji: string) => {
    setMessage(prev => prev + emoji);
    setIsEmojiPickerOpen(false);
    inputRef.current?.focus();
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <motion.div 
        className="bg-white rounded-2xl shadow-xl w-full max-w-md md:max-w-lg flex flex-col max-h-[85vh]"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
      >
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center">
            {selectedDoctor ? (
              <div className="flex items-center">
                <Avatar className="h-10 w-10 mr-3">
                  <AvatarImage src={selectedDoctor.imageUrl} alt={selectedDoctor.name} />
                  <AvatarFallback>{selectedDoctor.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold">Dr. {selectedDoctor.name}</h3>
                  <p className="text-xs text-muted-foreground capitalize">{selectedDoctor.specialty}</p>
                </div>
              </div>
            ) : (
              <div>
                <h3 className="font-semibold">WellnessConnect Support</h3>
                <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'ai' | 'agent')} className="w-[250px]">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="ai" className="text-xs">
                      <Sparkles size={14} className="mr-1" /> AI Assistant
                    </TabsTrigger>
                    <TabsTrigger value="agent" className="text-xs">
                      <User size={14} className="mr-1" /> Live Agent
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            )}
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full hover:bg-gray-100">
            <X size={18} />
          </Button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 bg-accent/20">
          <AnimatePresence>
            <div className="space-y-4">
              {!selectedDoctor && activeTab === 'ai' && filteredChats.length === 0 && (
                <motion.div 
                  className="bg-primary/5 rounded-lg p-4 mb-4"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex items-start">
                    <Avatar className="h-8 w-8 mr-3">
                      <AvatarFallback className="bg-primary text-white">AI</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm">
                        Hello! I'm your WellnessConnect AI assistant. I can help you navigate the platform, find doctors, 
                        understand your symptoms, or answer questions about our services. How can I assist you today?
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
              
              {!selectedDoctor && activeTab === 'agent' && filteredChats.length === 0 && (
                <motion.div 
                  className="bg-primary/5 rounded-lg p-4 mb-4"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex items-start">
                    <Avatar className="h-8 w-8 mr-3">
                      <AvatarFallback className="bg-secondary text-white">S</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm">
                        Welcome to WellnessConnect Support. Our team of human agents is here to provide personalized assistance 
                        with appointment scheduling, account issues, or any other questions you might have. 
                        Please send a message to connect with an available agent.
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
              
              {selectedDoctor && filteredChats.length === 0 && (
                <motion.div 
                  className="bg-primary/5 rounded-lg p-4 mb-4"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex items-start">
                    <Avatar className="h-8 w-8 mr-3">
                      <AvatarImage src={selectedDoctor.imageUrl} alt={selectedDoctor.name} />
                      <AvatarFallback>{selectedDoctor.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm">
                        Hello, I'm Dr. {selectedDoctor.name}. Thank you for reaching out. How can I assist you today? 
                        Feel free to ask about appointments, medical concerns, or any questions you might have.
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
              
              {filteredChats.map((chat) => {
                const isUserMessage = chat.senderId === user?.id;
                const isAIMessage = chat.senderId === 'ai-assistant';
                const isAgentMessage = chat.senderId === 'agent-1' || (selectedDoctor && chat.senderId === selectedDoctor.id);
                
                return (
                  <motion.div 
                    key={chat.id} 
                    className={`flex ${isUserMessage ? 'justify-end' : 'justify-start'}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className={`max-w-[80%] ${isUserMessage ? 'bg-primary text-white' : 'bg-white'} rounded-xl p-3 shadow-sm`}>
                      {!isUserMessage && (
                        <div className="flex items-center mb-1">
                          <Avatar className="h-6 w-6 mr-2">
                            {isAIMessage && (
                              <AvatarFallback className="bg-primary text-white text-xs">AI</AvatarFallback>
                            )}
                            {isAgentMessage && (
                              selectedDoctor ? (
                                <AvatarImage src={selectedDoctor.imageUrl} alt={selectedDoctor.name} />
                              ) : (
                                <AvatarFallback className="bg-secondary text-white text-xs">S</AvatarFallback>
                              )
                            )}
                          </Avatar>
                          <span className="text-xs font-semibold">
                            {isAIMessage ? 'AI Assistant' : (selectedDoctor ? `Dr. ${selectedDoctor.name}` : 'Support Agent')}
                          </span>
                        </div>
                      )}
                      <p className={`text-sm ${isUserMessage ? 'text-white' : 'text-foreground'}`}>{chat.content}</p>
                      <div className={`text-xs mt-1 text-right ${isUserMessage ? 'text-white/70' : 'text-muted-foreground'}`}>
                        {new Date(chat.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
              
              {activeTab === 'agent' && waitingForAgent && (
                <motion.div 
                  className="flex justify-center my-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="bg-accent/30 rounded-full px-4 py-2 text-sm flex items-center">
                    <Loader2 size={16} className="mr-2 animate-spin" />
                    Connecting you with a support agent...
                  </div>
                </motion.div>
              )}

              {isTyping && (
                <motion.div 
                  className="flex justify-start"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="bg-white rounded-xl p-3 shadow-sm max-w-[80%]">
                    <div className="flex items-center space-x-1">
                      <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
                      <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
                      <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "600ms" }}></div>
                    </div>
                  </div>
                </motion.div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
          </AnimatePresence>
        </div>
        
        <div className="p-3 border-t">
          <div className="flex items-center">
            <Popover open={isEmojiPickerOpen} onOpenChange={setIsEmojiPickerOpen}>
              <PopoverTrigger asChild>
                <Button variant="outline" size="icon" className="rounded-full mr-2 hover:bg-accent/50">
                  <SmilePlus size={18} />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80 p-2" align="start">
                <div className="max-h-52 overflow-y-auto">
                  {emojiCategories.map((category) => (
                    <div key={category.name} className="mb-3">
                      <h4 className="text-xs text-muted-foreground mb-1">{category.name}</h4>
                      <div className="grid grid-cols-8 gap-1">
                        {category.emojis.map((emoji, index) => (
                          <button
                            key={index}
                            className="text-lg hover:bg-accent p-1 rounded transition-colors"
                            onClick={() => handleEmojiClick(emoji)}
                          >
                            {emoji}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </PopoverContent>
            </Popover>
            
            <Button variant="outline" size="icon" className="rounded-full mr-2 hover:bg-accent/50">
              <ImageIcon size={18} />
            </Button>
            
            <Input
              placeholder="Type a message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1"
              ref={inputRef}
            />
            
            {activeTab === 'agent' && !waitingForAgent && !selectedDoctor && (
              <Button variant="outline" size="icon" className="rounded-full ml-2 text-green-500 hover:bg-green-50 hover:text-green-600" title="Voice call">
                <PhoneCall size={18} />
              </Button>
            )}
            
            <Button 
              variant="default" 
              size="icon" 
              className="rounded-full ml-2 hover:scale-105 transition-transform"
              disabled={!message.trim() || isTyping}
              onClick={handleSendMessage}
            >
              <Send size={18} />
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
