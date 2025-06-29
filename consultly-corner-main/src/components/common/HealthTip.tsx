
import React from 'react';
import { ArrowRight, Heart, Brain, Zap, Apple, Moon, Sun, Leaf, Droplets, Activity, Utensils } from 'lucide-react';
import { motion } from 'framer-motion';

export interface HealthTipProps {
  title: string;
  content: string;
  icon: React.ReactNode;
  color: string;
  onClick?: () => void;
}

export const HealthTip: React.FC<HealthTipProps> = ({ title, content, icon, color, onClick }) => {
  return (
    <motion.div 
      className={`p-4 rounded-xl ${color} border border-border/30 shadow-sm`}
      whileHover={{ scale: 1.03, y: -3 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
      onClick={onClick}
    >
      <motion.div 
        className="mb-3"
        whileHover={{ rotate: [0, -10, 10, -10, 0] }}
        transition={{ duration: 0.5 }}
      >
        {icon}
      </motion.div>
      <h3 className="font-medium mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground mb-3">
        {content}
      </p>
      <motion.button 
        className="text-primary text-sm font-medium flex items-center hover:underline"
        whileHover={{ x: 5 }}
        transition={{ duration: 0.2 }}
      >
        Learn more <ArrowRight className="h-3 w-3 ml-1" />
      </motion.button>
    </motion.div>
  );
};

// Array of health tips that can be used throughout the application
export const healthTips = [
  {
    title: "Mental Wellness Check",
    content: "Take a moment to reflect on your mental health. Regular meditation can help reduce stress and anxiety.",
    icon: <Brain className="h-6 w-6 text-purple-600" />,
    color: "bg-purple-50"
  },
  {
    title: "Women's Health Update",
    content: "Regular gynecological check-ups are essential for preventive care and early detection of health issues.",
    icon: <Heart className="h-6 w-6 text-pink-600" />,
    color: "bg-pink-50"
  },
  {
    title: "Self-Care Reminder",
    content: "Remember to prioritize your wellbeing. Schedule time for activities that bring you joy and relaxation.",
    icon: <Leaf className="h-6 w-6 text-emerald-600" />,
    color: "bg-emerald-50"
  },
  {
    title: "Stay Hydrated",
    content: "Drinking enough water improves energy, brain function, and helps maintain overall health.",
    icon: <Droplets className="h-6 w-6 text-blue-600" />,
    color: "bg-blue-50"
  },
  {
    title: "Heart Health",
    content: "Regular exercise can decrease your risk of heart disease and improve your cardiovascular health.",
    icon: <Activity className="h-6 w-6 text-red-600" />,
    color: "bg-red-50"
  },
  {
    title: "Nutrition Matters",
    content: "Include a variety of fruits and vegetables in your diet for essential vitamins and minerals.",
    icon: <Apple className="h-6 w-6 text-green-600" />,
    color: "bg-green-50"
  },
  {
    title: "Quality Sleep",
    content: "Aim for 7-9 hours of quality sleep each night to support your mental and physical health.",
    icon: <Moon className="h-6 w-6 text-indigo-600" />,
    color: "bg-indigo-50"
  },
  {
    title: "Morning Routine",
    content: "Start your day with a balanced breakfast to fuel your body and improve concentration.",
    icon: <Sun className="h-6 w-6 text-amber-600" />,
    color: "bg-amber-50"
  },
  {
    title: "Energy Boost",
    content: "Short breaks throughout your day can help maintain energy levels and improve productivity.",
    icon: <Zap className="h-6 w-6 text-yellow-600" />,
    color: "bg-yellow-50"
  },
  {
    title: "Balanced Diet",
    content: "Focus on a balanced diet with lean proteins, whole grains, and plenty of vegetables for optimal health.",
    icon: <Utensils className="h-6 w-6 text-orange-600" />,
    color: "bg-orange-50"
  }
];

// Function to get random health tips
export const getRandomHealthTips = (count: number = 3) => {
  const shuffled = [...healthTips].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};
