
import React from 'react';
import { Stethoscope, Calendar, MessageCircle, Activity, Shield, Clock, CreditCard, HeartPulse } from 'lucide-react';
import { FeatureCard } from '@/components/common/FeatureCard';
import { motion } from 'framer-motion';

export const AppFeatures: React.FC = () => {
  const features = [
    {
      title: "Expert Doctors",
      description: "Connect with top-rated, experienced Kenyan doctors and specialists for quality healthcare.",
      icon: <Stethoscope className="h-10 w-10 text-purple-600" />,
      color: "bg-purple-50"
    },
    {
      title: "Easy Scheduling",
      description: "Book, reschedule, or cancel appointments with just a few taps. Free cancellation within 1 hour.",
      icon: <Calendar className="h-10 w-10 text-blue-600" />,
      color: "bg-blue-50"
    },
    {
      title: "AI Chat Support",
      description: "Get instant answers about symptoms, conditions, and health advice from our AI assistant.",
      icon: <MessageCircle className="h-10 w-10 text-green-600" />,
      color: "bg-green-50"
    },
    {
      title: "Symptom Checker",
      description: "Identify possible conditions based on your symptoms with our advanced diagnostic tool.",
      icon: <Activity className="h-10 w-10 text-red-600" />,
      color: "bg-red-50"
    },
    {
      title: "Secure & Private",
      description: "Your health data is protected with advanced encryption and strict privacy controls.",
      icon: <Shield className="h-10 w-10 text-amber-600" />,
      color: "bg-amber-50"
    },
    {
      title: "24/7 Availability",
      description: "Access healthcare services anytime, day or night, including weekends and holidays.",
      icon: <Clock className="h-10 w-10 text-indigo-600" />,
      color: "bg-indigo-50"
    },
    {
      title: "NHIF Integration",
      description: "Connect your NHIF card for seamless payments and claims at supported facilities.",
      icon: <CreditCard className="h-10 w-10 text-teal-600" />,
      color: "bg-teal-50"
    },
    {
      title: "Health Tracking",
      description: "Monitor your health metrics, medication schedules, and appointment history.",
      icon: <HeartPulse className="h-10 w-10 text-pink-600" />,
      color: "bg-pink-50"
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };

  return (
    <section className="py-12 bg-background/70 backdrop-blur-sm rounded-3xl border border-accent/20 mt-12 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-white/50 to-background/50 pointer-events-none"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-12">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-3xl font-bold text-foreground mb-4 sf-display bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary"
          >
            Why Choose WellnessConnect Kenya
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-lg text-muted-foreground max-w-3xl mx-auto"
          >
            Our digital health platform connects you with top Kenyan healthcare providers, offering convenient access to quality care, whenever and wherever you need it.
          </motion.p>
        </div>
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {features.map((feature, index) => (
            <motion.div key={index} variants={itemVariants}>
              <FeatureCard
                title={feature.title}
                description={feature.description}
                icon={feature.icon}
                color={feature.color}
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
