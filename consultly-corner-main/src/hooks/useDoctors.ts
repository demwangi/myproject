
import { useMemo } from 'react';
import { doctors, Doctor } from '@/data/doctors';
import { getReviewsForDoctor } from '@/data/reviews';
import { ReviewType } from '@/components/common/PatientReview';

export function useDoctors(specialty: string = 'all', searchQuery: string = '') {
  const filteredDoctors = useMemo(() => {
    return doctors.filter(doctor => {
      // Filter by specialty
      const matchesSpecialty = specialty === 'all' || doctor.specialty === specialty;
      
      // Filter by search query (case insensitive)
      const matchesSearch = !searchQuery || 
        doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        doctor.specialty.toLowerCase().includes(searchQuery.toLowerCase()) || 
        doctor.hospital.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doctor.location.address.toLowerCase().includes(searchQuery.toLowerCase());
      
      return matchesSpecialty && matchesSearch;
    });
  }, [specialty, searchQuery]);

  const getDoctorById = (id: string): Doctor | undefined => {
    return doctors.find(doctor => doctor.id === id);
  };

  const getDoctorReviews = (id: string): ReviewType[] => {
    return getReviewsForDoctor(id);
  };
  
  const getDoctorResponse = (doctorId: string, userMessage: string): string => {
    const doctor = getDoctorById(doctorId);
    if (!doctor) return "I'm sorry, there seems to be a connection issue. Please try again later.";
    
    // Create a typing delay effect - simulate AI thinking
    const createThinkingDelay = () => {
      // This would be implemented in the chat component
      return true;
    };
    
    // Generate a more intelligent response based on doctor specialty and user message
    const messageLC = userMessage.toLowerCase();
    
    // Kenya-specific responses
    if (messageLC.includes('nhif') || messageLC.includes('insurance')) {
      return `Yes, I accept NHIF and most major Kenyan insurance providers including Jubilee, AAR, and CIC. For specific inquiries about your coverage, please bring your insurance card to your visit, or our admin staff can help verify your benefits before your appointment.`;
    }
    else if (messageLC.includes('mpesa') || messageLC.includes('payment')) {
      return `We accept various payment methods including M-Pesa, bank transfers, and major credit/debit cards. For M-Pesa payments, you can pay directly at the hospital using our till number which will be provided at registration.`;
    }
    else if (messageLC.includes('location') || messageLC.includes('directions')) {
      return `Our facility is located at ${doctor.hospital} in ${doctor.location.address.split(',').slice(-2)[0].trim()}. We're easily accessible via matatu routes and have ample parking if you're coming with your own vehicle. I can send you precise directions based on your starting point.`;
    }
    else if (messageLC.includes('covid') || messageLC.includes('corona')) {
      return `We're following all Ministry of Health guidelines for COVID-19 safety. All staff are vaccinated, we practice social distancing, and require masks in waiting areas. We also offer telehealth consultations if you prefer to avoid traveling to the clinic.`;
    }
    
    // Common responses for any doctor type
    if (messageLC.includes('appointment')) {
      return `Thank you for your interest in scheduling an appointment. I have availability this week on Wednesday and Friday. You can book through this app, or call our office directly. Remember that you can cancel for free within 1 hour of booking, after which a fee of KSh 500 applies.`;
    } 
    else if (messageLC.includes('symptom') || messageLC.includes('pain')) {
      return `I understand you're experiencing some symptoms. While I can provide some general guidance, it's important that we discuss this in a proper consultation where I can take a full history. Would you like to book an appointment soon? We have reasonable rates and accept NHIF coverage.`;
    }
    else if (messageLC.includes('cost') || messageLC.includes('fee') || messageLC.includes('price')) {
      return `My consultation fee is KSh ${doctor.consultationFee * 140}. Most insurance plans are accepted, including NHIF. The front desk can provide more details about your specific coverage.`;
    }
    else if (messageLC.includes('hello') || messageLC.includes('hi')) {
      return `Hello! I'm Dr. ${doctor.name.split(' ')[1]}, ${doctor.specialty} at ${doctor.hospital}. How can I assist you today?`;
    }
    else if (messageLC.includes('thank')) {
      return `You're welcome. Patient care is my priority, and I'm glad I could help. Feel free to reach out if you have any other questions!`;
    }
    else if (messageLC.includes('experience') || messageLC.includes('qualification')) {
      return `I completed my medical training at ${doctor.education[0]} and have been practicing for ${doctor.experience} years. I specialize in ${doctor.specialty} with particular focus on providing quality healthcare to Kenyan communities.`;
    }
    else if (messageLC.includes('emergency')) {
      return `If you're experiencing a medical emergency, please call emergency services (999) or go to your nearest emergency room immediately. For urgent but non-emergency matters, my office has same-day appointments available.`;
    }
    
    // Specialty-specific responses
    if (doctor.specialty === 'gynecologist') {
      if (messageLC.includes('pregnant') || messageLC.includes('pregnancy')) {
        return `Congratulations! Pregnancy is an exciting time with many changes. I provide comprehensive antenatal care following the Kenya Ministry of Health guidelines, including all necessary screenings and monitoring. Would you like to schedule a prenatal consultation?`;
      }
      if (messageLC.includes('period') || messageLC.includes('menstrual')) {
        return `Menstrual issues are common and often treatable. To better understand your situation, I'd need to know more about your symptoms, regularity, and any pain you're experiencing. We can discuss treatment options available here in Kenya, from medication to lifestyle changes.`;
      }
      if (messageLC.includes('pap') || messageLC.includes('smear') || messageLC.includes('screening')) {
        return `Regular screenings are an important part of preventive care. I recommend pap smears every 3 years for women between 21 and 65, in line with both Kenyan and international guidelines. When was your last screening?`;
      }
    }
    
    else if (doctor.specialty === 'psychiatrist') {
      if (messageLC.includes('anxiety') || messageLC.includes('stress')) {
        return `Anxiety can be challenging to manage on your own. I take a culturally sensitive approach to mental health treatment, understanding the unique pressures faced by Kenyans today. There are various therapeutic approaches and medications that can help. Let's schedule a session to discuss your symptoms and develop a personalized treatment plan.`;
      }
      if (messageLC.includes('depress')) {
        return `I'm sorry to hear you're feeling this way. Depression is treatable with the right approach. Mental health awareness is growing in Kenya, and more people are seeking help, which is a positive step. Would you like to schedule an appointment where we can discuss your symptoms in detail and explore treatment options?`;
      }
      if (messageLC.includes('medication') || messageLC.includes('prescription')) {
        return `Medication can be an effective part of treatment for many conditions. We'll need to discuss your symptoms, history, and any previous medications to determine the right approach for you. All prescriptions I provide are available at major pharmacies across Kenya.`;
      }
      if (messageLC.includes('sleep') || messageLC.includes('insomnia')) {
        return `Sleep difficulties can significantly impact your quality of life and may be connected to other aspects of your mental health. In our session, we can discuss both behavioral techniques and medical interventions available here in Kenya to help improve your sleep.`;
      }
    }
    
    else if (doctor.specialty === 'therapist') {
      if (messageLC.includes('relationship') || messageLC.includes('family') || messageLC.includes('couple')) {
        return `Relationship dynamics can be complex. I provide culturally responsive therapy that respects Kenyan family values while addressing modern relationship challenges. In our sessions, we can work on communication strategies and understanding patterns that may be affecting your relationships.`;
      }
      if (messageLC.includes('trauma') || messageLC.includes('ptsd')) {
        return `Trauma can have long-lasting effects on wellbeing. I use evidence-based approaches adapted to the Kenyan context to help patients process traumatic experiences. We'll work at your pace to develop coping strategies that respect your cultural background and personal experiences.`;
      }
      if (messageLC.includes('cbt') || messageLC.includes('cognitive')) {
        return `Cognitive Behavioral Therapy (CBT) is an effective approach for many conditions and works well across different cultural settings. It helps identify and change negative thought patterns that affect feelings and behaviors. I've adapted these techniques to be culturally appropriate for Kenyan clients.`;
      }
      if (messageLC.includes('grief') || messageLC.includes('loss')) {
        return `I'm sorry for your loss. Grief is a personal journey, and I understand the importance of cultural and community practices in mourning within the Kenyan context. Therapy can provide additional support during this difficult time, respecting your traditions while helping you navigate your emotions.`;
      }
    }
    
    // Default response if nothing specific matches
    return `Thank you for your message. As a healthcare provider practicing in Kenya, I'm committed to delivering quality care that's both affordable and culturally appropriate. Based on my expertise as a ${doctor.specialty}, I'd like to discuss this further during a consultation where we can address your specific health concerns. Would you like to schedule an appointment at ${doctor.hospital}?`;
  };

  return {
    doctors: filteredDoctors,
    getDoctorById,
    getDoctorReviews,
    getDoctorResponse
  };
}
