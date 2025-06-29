
import React from 'react';
import { ChevronRight, Shield, Lock, FileText } from 'lucide-react';
import { motion } from 'framer-motion';

const PrivacyPolicy: React.FC = () => {
  return (
    <div className="pt-20 pb-16 min-h-screen">
      <div className="container px-4 mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center mb-8">
            <Shield className="h-10 w-10 text-primary mr-3" />
            <h1 className="text-3xl font-bold">Privacy Policy</h1>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
            <div className="prose max-w-none">
              <p className="text-muted-foreground mb-6">
                Last updated: June 20, 2024
              </p>
              
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <Lock className="h-5 w-5 mr-2 text-primary" />
                Overview
              </h2>
              <p className="mb-6">
                WellnessConnect is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our platform. Please read this privacy policy carefully. If you do not agree with the terms of this privacy policy, please do not access the application.
              </p>
              
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <FileText className="h-5 w-5 mr-2 text-primary" />
                Information We Collect
              </h2>
              <p className="mb-4">
                We collect information that you provide directly to us when you:
              </p>
              <ul className="list-disc pl-6 mb-6 space-y-2">
                <li>Register for an account</li>
                <li>Fill in forms on our platform</li>
                <li>Correspond with healthcare providers</li>
                <li>Schedule appointments</li>
                <li>Provide medical information</li>
                <li>Participate in surveys or promotions</li>
              </ul>
              
              <h2 className="text-xl font-semibold mb-4">How We Use Your Information</h2>
              <p className="mb-4">
                We may use the information we collect about you for various purposes, including to:
              </p>
              <ul className="list-disc pl-6 mb-6 space-y-2">
                <li>Provide, maintain, and improve our services</li>
                <li>Connect you with appropriate healthcare providers</li>
                <li>Process and manage appointments</li>
                <li>Send you technical notices and support messages</li>
                <li>Respond to your comments, questions, and requests</li>
                <li>Personalize content and experiences</li>
                <li>Monitor and analyze trends and usage</li>
                <li>Detect, investigate, and prevent fraud and other illegal activities</li>
              </ul>
              
              <h2 className="text-xl font-semibold mb-4">Sharing Your Information</h2>
              <p className="mb-4">
                We may share the personal information we collect with:
              </p>
              <ul className="list-disc pl-6 mb-6 space-y-2">
                <li>Healthcare providers you choose to connect with</li>
                <li>Service providers who perform services on our behalf</li>
                <li>As required by law or to protect rights and interests</li>
              </ul>
              
              <h2 className="text-xl font-semibold mb-4">Data Security</h2>
              <p className="mb-6">
                We have implemented appropriate technical and organizational security measures designed to protect the security of any personal information we process. However, please also remember that we cannot guarantee that the internet itself is 100% secure. Although we will do our best to protect your personal information, transmission of personal information to and from our platform is at your own risk.
              </p>
              
              <h2 className="text-xl font-semibold mb-4">Your Rights</h2>
              <p className="mb-4">
                Depending on your location, you may have certain rights regarding your personal information, such as:
              </p>
              <ul className="list-disc pl-6 mb-6 space-y-2">
                <li>Right to access your personal information</li>
                <li>Right to correct inaccurate information</li>
                <li>Right to request deletion of your information</li>
                <li>Right to restrict or object to processing</li>
                <li>Right to data portability</li>
              </ul>
              
              <h2 className="text-xl font-semibold mb-4">Updates to This Policy</h2>
              <p className="mb-6">
                We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date.
              </p>
              
              <h2 className="text-xl font-semibold mb-4">Contact Us</h2>
              <p className="mb-6">
                If you have questions or concerns about this Privacy Policy, please contact us at privacy@wellnessconnect.com.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
