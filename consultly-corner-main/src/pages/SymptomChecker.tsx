
import React from 'react';
import { motion } from 'framer-motion';
import { Activity, AlertCircle, Heart, Brain, MessageSquare } from 'lucide-react';
import { SymptomCheckerEnhanced } from '@/components/common/SymptomCheckerEnhanced';

const SymptomChecker: React.FC = () => {
  return (
    <div className="pt-24 pb-16">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8 text-center"
          >
            <div className="inline-block p-3 bg-primary/10 rounded-full mb-4">
              <MessageSquare className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-3xl font-bold mb-3 tracking-tight">AI Symptom Checker</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Chat with our AI to describe your symptoms in detail. Our smart assistant will analyze your condition 
              and suggest possible causes, while connecting you with the right healthcare professionals in Kenya.
            </p>
          </motion.div>
          
          <div className="bg-white rounded-2xl shadow-sm border p-6">
            <SymptomCheckerEnhanced />
          </div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-8 p-4 bg-accent rounded-lg border border-accent/50 flex items-start"
          >
            <AlertCircle className="h-5 w-5 text-primary mr-3 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-medium mb-1">Important Healthcare Notice</h3>
              <p className="text-sm text-muted-foreground">
                This symptom checker is designed to guide you but is not a replacement for professional medical advice. 
                If you're experiencing severe symptoms like chest pain, difficulty breathing, or severe bleeding, 
                please seek emergency medical care immediately by visiting your nearest hospital or calling emergency services.
              </p>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4"
          >
            <div className="bg-gradient-to-b from-green-50 to-white p-5 rounded-xl border border-green-100 flex flex-col">
              <h3 className="font-medium mb-3 flex items-center">
                <Heart className="h-5 w-5 text-green-600 mr-2" />
                Common Symptoms
              </h3>
              <ul className="text-sm text-muted-foreground space-y-2 flex-grow">
                <li>• Fever, chills and sweating</li>
                <li>• Cough and sore throat</li>
                <li>• Shortness of breath</li>
                <li>• Fatigue and body aches</li>
                <li>• Headaches and dizziness</li>
              </ul>
            </div>
            
            <div className="bg-gradient-to-b from-blue-50 to-white p-5 rounded-xl border border-blue-100 flex flex-col">
              <h3 className="font-medium mb-3 flex items-center">
                <Heart className="h-5 w-5 text-blue-600 mr-2" />
                Tracking Symptoms
              </h3>
              <ul className="text-sm text-muted-foreground space-y-2 flex-grow">
                <li>• Note when symptoms started</li>
                <li>• Track severity (mild, moderate, severe)</li>
                <li>• Record how long symptoms last</li>
                <li>• Note any triggers or patterns</li>
                <li>• Track medication effectiveness</li>
              </ul>
            </div>
            
            <div className="bg-gradient-to-b from-indigo-50 to-white p-5 rounded-xl border border-indigo-100 flex flex-col">
              <h3 className="font-medium mb-3 flex items-center">
                <Brain className="h-5 w-5 text-indigo-600 mr-2" />
                AI Powered Insights
              </h3>
              <ul className="text-sm text-muted-foreground space-y-2 flex-grow">
                <li>• Advanced condition matching</li>
                <li>• Personalized health recommendations</li>
                <li>• Intelligent specialist referrals</li>
                <li>• Context-aware symptom analysis</li>
                <li>• Severity assessment guidance</li>
              </ul>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default SymptomChecker;
