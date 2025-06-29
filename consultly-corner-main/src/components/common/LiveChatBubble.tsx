import React, { useState } from 'react';
import { MessageSquare, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useAppContext } from '@/context/AppContext';

export const LiveChatBubble: React.FC = () => {
  const [isGreetingVisible, setIsGreetingVisible] = useState(false);
  const { setIsChatModalOpen, setSelectedDoctorId } = useAppContext();
  
  const handleBubbleClick = () => {
    if (isGreetingVisible) {
      // If greeting is visible, open the chat modal
      setSelectedDoctorId(null); // Reset selected doctor to show AI assistant
      setIsChatModalOpen(true);
      setIsGreetingVisible(false);
    } else {
      // Otherwise, show the greeting
      setIsGreetingVisible(true);
      
      // Auto-hide the greeting after 10 seconds
      setTimeout(() => {
        setIsGreetingVisible(false);
      }, 10000);
    }
  };
  
  const handleCloseGreeting = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsGreetingVisible(false);
  };

  return (
    <div className="relative">
      <AnimatePresence>
        {isGreetingVisible && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            className="absolute bottom-16 right-0 bg-white rounded-xl shadow-xl p-4 w-72 mb-2"
          >
            <Button 
              variant="ghost" 
              size="icon" 
              className="absolute top-2 right-2 h-6 w-6 rounded-full hover:bg-accent"
              onClick={handleCloseGreeting}
            >
              <X size={14} />
            </Button>
            <h4 className="font-medium mb-2">Hello there! 👋</h4>
            <p className="text-sm text-muted-foreground mb-3">
              Need help with something? Our support team is here for you.
            </p>
            <Button 
              variant="default" 
              size="sm" 
              className="w-full"
              onClick={() => {
                setSelectedDoctorId(null);
                setIsChatModalOpen(true);
                setIsGreetingVisible(false);
              }}
            >
              Chat with us
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
      
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="bg-primary text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-shadow"
        onClick={handleBubbleClick}
        aria-label="Chat with support"
      >
        <MessageSquare className="h-6 w-6" />
      </motion.button>
    </div>
  );
};
