
import React from 'react';
import { motion } from 'framer-motion';
import { Search, Calendar, MessageCircle, Activity } from 'lucide-react';

export const HowItWorks: React.FC = () => {
  const steps = [
    {
      icon: <Activity className="h-10 w-10 text-white" />,
      title: "Check Your Symptoms",
      description: "Use our AI-powered symptom checker to get an initial assessment of your health concern.",
      color: "bg-primary"
    },
    {
      icon: <Search className="h-10 w-10 text-white" />,
      title: "Find the Right Doctor",
      description: "Browse through our network of qualified Kenyan doctors and specialists.",
      color: "bg-indigo-500"
    },
    {
      icon: <Calendar className="h-10 w-10 text-white" />,
      title: "Book Your Appointment",
      description: "Choose a convenient time and date for your in-person or virtual consultation.",
      color: "bg-secondary"
    },
    {
      icon: <MessageCircle className="h-10 w-10 text-white" />,
      title: "Get the Care You Need",
      description: "Meet with your doctor, receive a diagnosis, treatment plan, and prescriptions if needed.",
      color: "bg-green-500"
    }
  ];

  return (
    <section className="py-12 mt-12 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-3xl font-bold text-foreground mb-4 sf-display"
          >
            How It Works
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-lg text-muted-foreground max-w-3xl mx-auto"
          >
            Getting the healthcare you need is simple and straightforward with WellnessConnect Kenya
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true, margin: "-50px" }}
              className="relative"
            >
              <div className="flex flex-col items-center">
                <div className={`${step.color} rounded-full p-5 mb-4 shadow-lg`}>
                  {step.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2 text-center">{step.title}</h3>
                <p className="text-muted-foreground text-center">{step.description}</p>
                
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-10 left-[60%] w-[80%] h-0.5 bg-gray-200">
                    <div className="absolute top-0 right-0 h-2.5 w-2.5 rounded-full bg-gray-200 -mt-1"></div>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
