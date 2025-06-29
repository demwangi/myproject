
import { ReviewType } from '@/components/common/PatientReview';

// Sample patient reviews for doctors
export const doctorReviews: Record<string, ReviewType[]> = {
  "d1": [
    {
      id: "r1",
      patientName: "Amara Okafor",
      patientAvatar: "/doctors/patient-1.jpg",
      rating: 5,
      date: "June 12, 2024",
      content: "Dr. Amara Okafor was incredibly attentive and knowledgeable. She took the time to listen to all my concerns and provided clear explanations. I felt comfortable throughout the entire appointment.",
      helpful: 24,
      notHelpful: 1
    },
    {
      id: "r2",
      patientName: "Chioma Nwosu",
      patientAvatar: "/doctors/patient-2.jpg",
      rating: 4,
      date: "May 28, 2024",
      content: "Very professional and caring doctor. The wait time was a bit long, but the quality of care made up for it. Would definitely recommend Dr. Okafor to others.",
      helpful: 18,
      notHelpful: 2
    },
    {
      id: "r3",
      patientName: "Fatima Ibrahim",
      patientAvatar: "/doctors/patient-3.jpg",
      rating: 5,
      date: "April 15, 2024",
      content: "Dr. Okafor has been my gynecologist for years. She's always been excellent at explaining complex medical terms in simple language. I trust her completely with my health.",
      helpful: 32,
      notHelpful: 0
    }
  ],
  "d2": [
    {
      id: "r4",
      patientName: "Nadia Ahmed",
      patientAvatar: "/doctors/patient-4.jpg",
      rating: 5,
      date: "June 5, 2024",
      content: "Dr. Adebayo Okonkwo has helped me so much with my anxiety. He creates a safe space for discussing difficult topics and has given me practical strategies that actually work in my daily life.",
      helpful: 41,
      notHelpful: 3
    },
    {
      id: "r5",
      patientName: "Daniel Mensah",
      patientAvatar: "/doctors/patient-5.jpg",
      rating: 4,
      date: "May 10, 2024",
      content: "Very knowledgeable psychiatrist. Dr. Okonkwo takes a holistic approach to mental health and considers lifestyle factors along with medication when appropriate.",
      helpful: 22,
      notHelpful: 1
    }
  ],
  "d3": [
    {
      id: "r6",
      patientName: "Zainab Diallo",
      patientAvatar: "/doctors/patient-6.jpg",
      rating: 5,
      date: "June 18, 2024",
      content: "Dr. Folami Nkosi is an amazing therapist. She's helped me work through some difficult trauma with patience and skill. Her cognitive behavioral therapy techniques have been life-changing.",
      helpful: 36,
      notHelpful: 2
    },
    {
      id: "r7",
      patientName: "Kwame Asante",
      patientAvatar: "/doctors/patient-7.jpg",
      rating: 5,
      date: "April 22, 2024",
      content: "I've been seeing Dr. Nkosi for depression for about 6 months, and the improvement in my quality of life has been dramatic. She's compassionate but also challenges me when needed.",
      helpful: 29,
      notHelpful: 0
    },
    {
      id: "r8",
      patientName: "Esther Mutanga",
      patientAvatar: "/doctors/patient-8.jpg",
      rating: 4,
      date: "March 15, 2024",
      content: "Dr. Nkosi provides a perfect balance of listening and advice. She remembers details from previous sessions and builds on them, making therapy feel like a continuous journey.",
      helpful: 17,
      notHelpful: 1
    }
  ],
  "d4": [
    {
      id: "r9",
      patientName: "Aisha Mohammed",
      patientAvatar: "/doctors/patient-9.jpg",
      rating: 5,
      date: "May 30, 2024",
      content: "Dr. Makena Kimani is extremely knowledgeable and thorough. She spent a lot of time answering all my questions and made me feel at ease during my examination.",
      helpful: 31,
      notHelpful: 2
    },
    {
      id: "r10",
      patientName: "Lina Abebe",
      patientAvatar: "/doctors/patient-10.jpg",
      rating: 3,
      date: "April 10, 2024",
      content: "Dr. Kimani is very professional, but I had to wait quite a long time for my appointment. The care itself was good, just be prepared for potential delays.",
      helpful: 14,
      notHelpful: 8
    }
  ],
  "d5": [
    {
      id: "r11",
      patientName: "Ngozi Eze",
      patientAvatar: "/doctors/patient-11.jpg",
      rating: 5,
      date: "June 8, 2024",
      content: "Dr. Imani Omondi helped me work through my postpartum depression with such compassion. She's an excellent listener and offers practical advice that's easy to implement.",
      helpful: 39,
      notHelpful: 1
    },
    {
      id: "r12",
      patientName: "Tendai Moyo",
      patientAvatar: "/doctors/patient-12.jpg",
      rating: 5,
      date: "May 12, 2024",
      content: "I've been dealing with anxiety for years, and Dr. Omondi is the first therapist who's really helped me make progress. Her approach is evidence-based but also personalized.",
      helpful: 27,
      notHelpful: 2
    }
  ]
};

// Generate reviews for all doctors who don't have them
const generateReviewsForAllDoctors = () => {
  const allDoctorIds = Array.from({ length: 50 }, (_, i) => `d${i + 1}`);
  const patientNames = [
    "John Kamau", "Grace Muthoni", "Ibrahim Hassan", "Wanjiku Njoroge", "Samuel Osei",
    "Victoria Adeyemi", "Emmanuel Onyango", "Fatima Ali", "David Owusu", "Sarah Kigongo",
    "Michael Tutu", "Esther Acheng", "Daniel Mensah", "Rebecca Okoth", "Paul Ndungu",
    "Elizabeth Mutua", "Joseph Okoro", "Aisha Mohammed", "Peter Njenga", "Mary Otieno"
  ];

  const reviewContents = [
    "Very professional and knowledgeable doctor. I felt comfortable during my entire visit.",
    "Excellent bedside manner. The doctor took time to explain everything clearly.",
    "I was very impressed with the level of care I received. Highly recommend!",
    "The doctor was patient and addressed all my concerns. Very satisfied with my visit.",
    "Great experience overall. The doctor was thorough and compassionate.",
    "The doctor was running a bit late, but the quality of care made up for it.",
    "I appreciated how the doctor listened carefully to my symptoms before diagnosing.",
    "Friendly, professional, and made me feel at ease. Would definitely go back.",
    "The doctor explained my treatment options clearly and helped me make an informed decision.",
    "Very satisfied with my appointment. The doctor was attentive and knowledgeable."
  ];

  const updatedReviews = { ...doctorReviews };

  allDoctorIds.forEach(docId => {
    if (!updatedReviews[docId]) {
      // Generate 1-3 random reviews for this doctor
      const reviewCount = Math.floor(Math.random() * 3) + 1;
      updatedReviews[docId] = Array.from({ length: reviewCount }, (_, i) => {
        // Generate random date within the last 3 months
        const date = new Date();
        date.setDate(date.getDate() - Math.floor(Math.random() * 90));
        const formattedDate = date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
        
        return {
          id: `r-${docId}-${i}`,
          patientName: patientNames[Math.floor(Math.random() * patientNames.length)],
          patientAvatar: `/doctors/patient-${(Math.floor(Math.random() * 12) + 1)}.jpg`,
          rating: Math.floor(Math.random() * 2) + 4, // 4 or 5 stars mostly
          date: formattedDate,
          content: reviewContents[Math.floor(Math.random() * reviewContents.length)],
          helpful: Math.floor(Math.random() * 30) + 5,
          notHelpful: Math.floor(Math.random() * 5)
        };
      });
    }
  });

  return updatedReviews;
};

// Export with generated reviews for all doctors
export const allDoctorReviews = generateReviewsForAllDoctors();

// If no reviews exist for a doctor, return an empty array
export const getReviewsForDoctor = (doctorId: string): ReviewType[] => {
  return allDoctorReviews[doctorId] || [];
};
