
import React from 'react';
import { motion } from 'framer-motion';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Star } from 'lucide-react';

interface Testimonial {
  id: number;
  name: string;
  location: string;
  comment: string;
  rating: number;
  image?: string;
}

export const TestimonialsSection: React.FC = () => {
  const testimonials: Testimonial[] = [
    {
      id: 1,
      name: "Grace Wanjiku",
      location: "Nairobi",
      comment: "I was feeling unwell late at night and used the symptom checker. It recommended I see a doctor urgently, and I was able to book a virtual consultation for the next morning. The doctor diagnosed my condition accurately and prescribed medication that helped me recover quickly.",
      rating: 5,
      image: "https://images.unsplash.com/photo-1522529599102-193c0d76b5b6?q=80&w=1374&auto=format&fit=crop"
    },
    {
      id: 2,
      name: "Daniel Omondi",
      location: "Mombasa",
      comment: "The app helped me find a specialist for my chronic condition. I was able to check their reviews, qualifications, and book an appointment within minutes. The reminder feature ensured I didn't miss my appointment. Great service!",
      rating: 5,
      image: "https://images.unsplash.com/photo-1506634572416-48cdfe530110?q=80&w=1470&auto=format&fit=crop"
    },
    {
      id: 3,
      name: "Sarah Kimani",
      location: "Kisumu",
      comment: "As a busy professional, finding time to visit a doctor was always challenging. This app has been a lifesaver! I can chat with doctors, schedule appointments after work hours, and even get prescriptions delivered. Highly recommend!",
      rating: 4,
      image: "https://images.unsplash.com/photo-1581992652564-44c42f5ad3ad?q=80&w=1470&auto=format&fit=crop"
    }
  ];

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <section className="py-12 bg-gradient-to-br from-purple-50 to-blue-50 rounded-3xl mt-12 relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-primary/30 blur-3xl"></div>
        <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-secondary/30 blur-3xl"></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-12">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-3xl font-bold text-foreground mb-4 sf-display"
          >
            What Our Users Say
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-lg text-muted-foreground max-w-3xl mx-auto"
          >
            Hear from patients across Kenya who have transformed their healthcare experience with our app
          </motion.p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true, margin: "-50px" }}
              className="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col h-full"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center">
                  <Avatar className="h-12 w-12 mr-4">
                    {testimonial.image && (
                      <AvatarImage src={testimonial.image} alt={testimonial.name} />
                    )}
                    <AvatarFallback>{testimonial.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.location}</p>
                  </div>
                </div>
                <div className="flex">
                  {renderStars(testimonial.rating)}
                </div>
              </div>
              <p className="text-gray-700 flex-grow italic">"{testimonial.comment}"</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
