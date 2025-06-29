
import React, { useState, useEffect, useRef } from 'react';
import { Send, Paperclip, SmilePlus, User, Bot } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { motion, AnimatePresence } from 'framer-motion';
import { useDoctors } from '@/hooks/useDoctors';
import { useUser } from '@/hooks/useUser';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'doctor';
  timestamp: Date;
}

interface ChatProps {
  doctorId: string;
}

export const Chat: React.FC<ChatProps> = ({ doctorId }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { getDoctorById, getDoctorResponse } = useDoctors();
  const { user } = useUser();
  
  const doctor = getDoctorById(doctorId);
  
  useEffect(() => {
    // Initialize with a welcome message
    if (doctor) {
      setMessages([
        {
          id: '1',
          text: `Hello! I'm Dr. ${doctor.name.split(' ')[1]}. How can I help you today?`,
          sender: 'doctor',
          timestamp: new Date(),
        },
      ]);
    }
  }, [doctor]);
  
  const handleSendMessage = () => {
    if (!inputValue.trim() || !doctor) return;
    
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
    
    // Simulate doctor typing
    setTimeout(() => {
      const response = getDoctorResponse(doctorId, inputValue);
      
      const doctorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response,
        sender: 'doctor',
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, doctorMessage]);
      setIsTyping(false);
    }, 1500);
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  if (!doctor) return <p>Loading chat...</p>;
  
  return (
    <Card className="border shadow-sm">
      <CardContent className="p-0">
        <div className="flex flex-col h-[400px]">
          {/* Chat header */}
          <div className="p-3 border-b bg-muted/20">
            <div className="flex items-center">
              <div className="flex-1">
                <h3 className="font-medium">Chat with Dr. {doctor.name.split(' ')[1]}</h3>
                <p className="text-xs text-muted-foreground">Ask about your symptoms or treatment options</p>
              </div>
            </div>
          </div>
          
          {/* Messages area */}
          <div className="flex-1 overflow-y-auto p-4">
            <AnimatePresence initial={false}>
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className={`mb-4 flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex items-start max-w-[75%] ${message.sender === 'user' ? 'flex-row-reverse' : ''}`}>
                    <div className={`rounded-full p-2 flex-shrink-0 ${message.sender === 'user' ? 'bg-primary ml-2' : 'bg-gray-200 mr-2'}`}>
                      {message.sender === 'user' ? 
                        <User className={`h-4 w-4 ${message.sender === 'user' ? 'text-white' : 'text-gray-700'}`} /> : 
                        <Bot className={`h-4 w-4 text-gray-700`} />
                      }
                    </div>
                    <div 
                      className={`p-3 rounded-lg ${
                        message.sender === 'user' 
                          ? 'bg-primary text-white rounded-tr-none' 
                          : 'bg-white text-gray-800 border rounded-tl-none'
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                      <div className="mt-1 text-xs opacity-70 text-right">
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
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
                  <div className="flex items-start max-w-[75%]">
                    <div className="rounded-full p-2 bg-gray-200 mr-2">
                      <Bot className="h-4 w-4 text-gray-700" />
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
          
          {/* Input area */}
          <div className="border-t p-3">
            <div className="flex items-end gap-2">
              <Textarea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type your message..."
                className="flex-1 min-h-[60px] resize-none"
              />
              <Button 
                onClick={handleSendMessage} 
                className="h-10 w-10 p-0" 
                disabled={!inputValue.trim() || isTyping}
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
