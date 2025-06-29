
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, HelpCircle, Search } from 'lucide-react';
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Input } from '@/components/ui/input';

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: 'general' | 'appointments' | 'doctors' | 'account';
}

const faqs: FAQ[] = [
  {
    id: 'faq1',
    question: 'How do I schedule an appointment with a doctor?',
    answer: 'You can schedule an appointment by visiting the Find Doctors page, selecting a doctor, and clicking on the "Book Appointment" button on their profile. You\'ll be prompted to select a date, time, and appointment type.',
    category: 'appointments'
  },
  {
    id: 'faq2',
    question: 'Can I cancel or reschedule my appointment?',
    answer: 'Yes, you can cancel or reschedule appointments from your profile page under "My Appointments". Please note that some doctors may have cancellation policies that include fees for last-minute cancellations.',
    category: 'appointments'
  },
  {
    id: 'faq3',
    question: 'How do I message my doctor?',
    answer: 'You can message your doctor directly from their profile page by clicking on the "Chat with Doctor" button. You\'ll be able to see your conversation history and send new messages.',
    category: 'doctors'
  },
  {
    id: 'faq4',
    question: 'Is my medical information secure?',
    answer: 'Yes, we take the security of your medical information very seriously. We use industry-standard encryption and security protocols to protect your data. Please refer to our Privacy Policy for more details.',
    category: 'general'
  },
  {
    id: 'faq5',
    question: 'How do I update my profile information?',
    answer: 'You can update your profile information by navigating to the Profile page and clicking on the "Edit Profile" button. From there, you can update your personal details, contact information, and medical history.',
    category: 'account'
  },
  {
    id: 'faq6',
    question: 'What types of specialists are available on WellnessConnect?',
    answer: 'WellnessConnect offers access to various specialists including gynecologists, psychiatrists, therapists, and more. You can filter doctors by specialty on the Find Doctors page.',
    category: 'doctors'
  },
  {
    id: 'faq7',
    question: 'How do I leave a review for a doctor?',
    answer: 'After your appointment, you\'ll receive a notification inviting you to leave a review. Alternatively, you can visit the doctor\'s profile and scroll to the reviews section to leave your feedback.',
    category: 'doctors'
  },
  {
    id: 'faq8',
    question: 'What payment methods are accepted?',
    answer: 'WellnessConnect accepts various payment methods including credit/debit cards, mobile payments, and in some regions, health insurance. The available options will be displayed during the checkout process.',
    category: 'appointments'
  },
  {
    id: 'faq9',
    question: 'How do I reset my password?',
    answer: 'If you\'ve forgotten your password, click on the "Forgot Password" link on the login page. You\'ll receive an email with instructions to reset your password.',
    category: 'account'
  },
  {
    id: 'faq10',
    question: 'Is the AI assistant medically trained?',
    answer: 'The AI assistant can provide general information and help you navigate the platform, but it does not replace medical advice. Always consult with qualified healthcare professionals for medical concerns.',
    category: 'general'
  },
  {
    id: 'faq11',
    question: 'Can I add doctors to my favorites list?',
    answer: 'Yes, you can add doctors to your favorites by clicking the heart icon on their profile or doctor card. You can access your favorites list from the heart icon in the navigation.',
    category: 'doctors'
  },
  {
    id: 'faq12',
    question: 'How do I use the Symptom Checker?',
    answer: 'Navigate to the Symptom Checker page from the main menu. Enter your symptoms and follow the prompts to receive suggestions about possible conditions and appropriate specialists to consult.',
    category: 'general'
  }
];

const FAQs: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  
  const filteredFAQs = faqs.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });
  
  const categories = [
    { id: 'all', name: 'All FAQs' },
    { id: 'general', name: 'General' },
    { id: 'appointments', name: 'Appointments' },
    { id: 'doctors', name: 'Doctors' },
    { id: 'account', name: 'Account & Profile' }
  ];

  return (
    <div className="pt-20 pb-16 min-h-screen">
      <div className="container px-4 mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center mb-8">
            <HelpCircle className="h-10 w-10 text-primary mr-3" />
            <h1 className="text-3xl font-bold">Frequently Asked Questions</h1>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-1">
              <div className="bg-white rounded-xl shadow-sm p-5 sticky top-24">
                <h2 className="text-lg font-semibold mb-4">Categories</h2>
                <nav className="space-y-2">
                  {categories.map(category => (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                        selectedCategory === category.id 
                          ? 'bg-primary text-white font-medium'
                          : 'hover:bg-accent/50 text-foreground'
                      }`}
                    >
                      {category.name}
                    </button>
                  ))}
                </nav>
              </div>
            </div>
            
            <div className="md:col-span-3">
              <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                <div className="relative mb-6">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
                  <Input
                    type="text"
                    placeholder="Search frequently asked questions..."
                    className="pl-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                
                {filteredFAQs.length > 0 ? (
                  <Accordion type="single" collapsible className="w-full">
                    {filteredFAQs.map((faq, index) => (
                      <motion.div
                        key={faq.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <AccordionItem value={faq.id} className="border-b">
                          <AccordionTrigger className="text-left hover:no-underline py-4">
                            <span className="font-medium">{faq.question}</span>
                          </AccordionTrigger>
                          <AccordionContent>
                            <p className="text-muted-foreground pb-2">{faq.answer}</p>
                          </AccordionContent>
                        </AccordionItem>
                      </motion.div>
                    ))}
                  </Accordion>
                ) : (
                  <div className="text-center py-8">
                    <HelpCircle className="h-12 w-12 text-muted-foreground/50 mx-auto mb-3" />
                    <h3 className="text-lg font-medium mb-1">No matching questions found</h3>
                    <p className="text-muted-foreground">Try adjusting your search query</p>
                  </div>
                )}
              </div>
              
              <div className="bg-accent/20 rounded-xl p-6">
                <h3 className="text-lg font-semibold mb-2">Can't find what you're looking for?</h3>
                <p className="text-muted-foreground mb-4">
                  Our support team is here to help. Feel free to reach out with any questions or concerns.
                </p>
                <div className="flex items-center space-x-2">
                  <button className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg transition-colors">
                    Contact Support
                  </button>
                  <button className="bg-white hover:bg-accent/80 border border-border px-4 py-2 rounded-lg transition-colors">
                    Chat with AI Assistant
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default FAQs;
