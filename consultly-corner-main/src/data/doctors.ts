
import { faker } from '@faker-js/faker';

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  hospital: string;
  rating: number;
  reviewCount: number;
  imageUrl: string;
  bio: string;
  education: string[];
  experience: number;
  languages: string[];
  acceptingNewPatients: boolean;
  consultationFee: number;
  availability: {
    [day: string]: string[];
  };
  location: {
    latitude: number;
    longitude: number;
    address: string;
  };
}

// Generate diverse doctor names and backgrounds
const generateDoctors = (): Doctor[] => {
  const specialties = ['gynecologist', 'psychiatrist', 'therapist'];
  
  // Create diverse hospitals with regions
  const hospitals = [
    // Kenya
    'Kenyatta National Hospital, Nairobi',
    'Aga Khan University Hospital, Nairobi',
    'Nairobi Hospital, Nairobi',
    'MP Shah Hospital, Nairobi',
    // Tanzania
    'Muhimbili National Hospital, Dar es Salaam',
    'Aga Khan Hospital, Dar es Salaam',
    'CCBRT Hospital, Dar es Salaam',
    // Uganda
    'Mulago National Referral Hospital, Kampala',
    'Nakasero Hospital, Kampala',
    'International Hospital Kampala, Kampala',
    // Nigeria
    'Lagos University Teaching Hospital, Lagos',
    'National Hospital Abuja, Abuja',
    // USA
    'Mayo Clinic, Rochester',
    'Cleveland Clinic, Cleveland',
    'Johns Hopkins Hospital, Baltimore',
    // UK
    'Guy\'s and St Thomas\' NHS Foundation, London',
    'Royal London Hospital, London',
    // South Africa
    'Groote Schuur Hospital, Cape Town',
    'Chris Hani Baragwanath Hospital, Johannesburg'
  ];
  
  // Set of diverse names to ensure representation
  const doctorNames = [
    // East African names
    'Amara Okafor', 'Makena Kimani', 'Eshe Githinji', 'Taraji Kamau', 'Zuberi Ochieng',
    'Imani Omondi', 'Jabari Mwangi', 'Kamaria Otieno', 'Jelani Njoroge', 'Zuri Wekesa',
    // West African names
    'Adebayo Okonkwo', 'Folami Nkosi', 'Kwame Adeyemi', 'Nkechi Ademola', 'Olufemi Babatunde', 
    'Chinua Achebe', 'Ngozi Adichie', 'Chiwetel Ejiofor', 'Chimamanda Adichie', 'Wole Soyinka',
    // North African/Arab names
    'Amina Hassan', 'Jamal Khalil', 'Fatima Al-Farsi', 'Hakim Mahfouz', 'Leila Abadi',
    'Omar Abdullah', 'Layla Rahman', 'Zainab Ahmed', 'Mohammed El-Sayed', 'Aisha Mansour',
    // European/American names
    'Sarah Johnson', 'Michael Chen', 'David Kim', 'Maria Rodriguez', 'James Wilson',
    'Robert Garcia', 'Lisa Wong', 'Daniel Martinez', 'Isabella Rossi', 'Elena Petrov',
    // Indian/South Asian names
    'Rajiv Gupta', 'Aisha Patel', 'Lakshmi Sharma', 'Priya Nair', 'Arjun Singh',
    'Deepak Chopra', 'Ravi Kumar', 'Divya Patel', 'Sunita Kaur', 'Vikram Mehta'
  ];
  
  // Generate locations grouped by region
  const regionLocations = {
    'Nairobi': { lat: -1.2921, lng: 36.8219 },
    'Dar es Salaam': { lat: -6.7924, lng: 39.2083 },
    'Kampala': { lat: 0.3476, lng: 32.5825 },
    'Lagos': { lat: 6.5244, lng: 3.3792 },
    'Abuja': { lat: 9.0765, lng: 7.3986 },
    'Rochester': { lat: 44.0121, lng: -92.4802 },
    'Cleveland': { lat: 41.4993, lng: -81.6944 },
    'Baltimore': { lat: 39.2904, lng: -76.6122 },
    'London': { lat: 51.5074, lng: -0.1278 },
    'Cape Town': { lat: -33.9249, lng: 18.4241 },
    'Johannesburg': { lat: -26.2041, lng: 28.0473 }
  };
  
  // Helper to get region from hospital name
  const getRegionFromHospital = (hospital: string): string => {
    const parts = hospital.split(', ');
    return parts.length > 1 ? parts[1] : 'Unknown';
  };
  
  // Generate doctor bio based on specialty and region
  const generateBio = (name: string, specialty: string, region: string): string => {
    const firstName = name.split(' ')[0];
    
    const specialtyDescriptions = {
      'gynecologist': `specializing in women's reproductive health, prenatal care, and obstetrics`,
      'psychiatrist': `specializing in mental health disorders, therapy, and comprehensive psychiatric care`,
      'therapist': `specializing in mental wellness, cognitive behavioral therapy, and emotional well-being`
    };
    
    let regionalExperience = '';
    if (['Nairobi', 'Dar es Salaam', 'Kampala'].includes(region)) {
      regionalExperience = ` With extensive experience serving communities in East Africa, ${firstName} brings a culturally sensitive approach to healthcare.`;
    } else if (['Lagos', 'Abuja'].includes(region)) {
      regionalExperience = ` Having worked extensively across West Africa, ${firstName} understands the unique healthcare needs of the region's diverse population.`;
    }
    
    return `Dr. ${name} is a compassionate and experienced ${specialty} ${specialtyDescriptions[specialty as keyof typeof specialtyDescriptions]}.${regionalExperience} With a patient-centered approach, ${firstName} is dedicated to providing comprehensive and personalized care that addresses both immediate concerns and long-term health goals.`;
  };
  
  return doctorNames.map((name, index) => {
    const specialty = specialties[index % specialties.length];
    const hospital = hospitals[index % hospitals.length];
    const region = getRegionFromHospital(hospital);
    
    // Generate a location within ~5mi of the region center
    const regionCenter = regionLocations[region as keyof typeof regionLocations] || { lat: 0, lng: 0 };
    const latOffset = (Math.random() - 0.5) * 0.05;
    const lngOffset = (Math.random() - 0.5) * 0.05;
    
    // Generate languages based on region
    let languages = ['English'];
    if (['Nairobi', 'Dar es Salaam', 'Kampala'].includes(region)) {
      languages.push('Swahili');
      if (Math.random() > 0.5) languages.push(region === 'Nairobi' ? 'Kikuyu' : region === 'Kampala' ? 'Luganda' : 'Sukuma');
    } else if (['Lagos', 'Abuja'].includes(region)) {
      if (Math.random() > 0.5) languages.push('Yoruba');
      if (Math.random() > 0.5) languages.push('Hausa');
      if (Math.random() > 0.7) languages.push('Igbo');
    } else if (['Rochester', 'Cleveland', 'Baltimore'].includes(region)) {
      if (Math.random() > 0.6) languages.push('Spanish');
    } else if (region === 'London') {
      if (Math.random() > 0.6) languages.push('Hindi');
      if (Math.random() > 0.7) languages.push('French');
    } else if (['Cape Town', 'Johannesburg'].includes(region)) {
      if (Math.random() > 0.5) languages.push('Zulu');
      if (Math.random() > 0.6) languages.push('Afrikaans');
    }
    
    const yearsOfExperience = Math.floor(Math.random() * 20) + 5;
    
    return {
      id: `d${index + 1}`,
      name,
      specialty,
      hospital: hospital.split(', ')[0],
      rating: Number((3.5 + Math.random() * 1.5).toFixed(1)),
      reviewCount: Math.floor(Math.random() * 50) + 10,
      imageUrl: `/doctors/doctor-${(index % 12) + 1}.jpg`,
      bio: generateBio(name, specialty, region),
      education: [
        `M.D., ${faker.company.name()} University, ${2000 + Math.floor(Math.random() * 15)}`,
        `Residency, ${faker.company.name()} Medical Center, ${2005 + Math.floor(Math.random() * 10)}`,
        Math.random() > 0.5 ? `Fellowship, ${faker.company.name()} Hospital, ${2010 + Math.floor(Math.random() * 8)}` : ''
      ].filter(Boolean),
      experience: yearsOfExperience,
      languages,
      acceptingNewPatients: Math.random() > 0.2,
      consultationFee: Math.floor(Math.random() * 150) + 100,
      availability: {
        Monday: Math.random() > 0.3 ? ['9:00 AM', '10:00 AM', '11:00 AM', '2:00 PM', '3:00 PM'].slice(0, Math.floor(Math.random() * 5) + 1) : [],
        Tuesday: Math.random() > 0.3 ? ['9:00 AM', '10:00 AM', '11:00 AM', '2:00 PM', '3:00 PM'].slice(0, Math.floor(Math.random() * 5) + 1) : [],
        Wednesday: Math.random() > 0.3 ? ['9:00 AM', '10:00 AM', '11:00 AM', '2:00 PM', '3:00 PM'].slice(0, Math.floor(Math.random() * 5) + 1) : [],
        Thursday: Math.random() > 0.3 ? ['9:00 AM', '10:00 AM', '11:00 AM', '2:00 PM', '3:00 PM'].slice(0, Math.floor(Math.random() * 5) + 1) : [],
        Friday: Math.random() > 0.3 ? ['9:00 AM', '10:00 AM', '11:00 AM', '2:00 PM', '3:00 PM'].slice(0, Math.floor(Math.random() * 5) + 1) : [],
      },
      location: {
        latitude: regionCenter.lat + latOffset,
        longitude: regionCenter.lng + lngOffset,
        address: `${Math.floor(Math.random() * 999) + 100} ${faker.location.street()}, ${region}, ${region === 'Nairobi' ? 'Kenya' : 
          region === 'Dar es Salaam' ? 'Tanzania' : 
          region === 'Kampala' ? 'Uganda' : 
          region === 'Lagos' || region === 'Abuja' ? 'Nigeria' : 
          region === 'Rochester' || region === 'Cleveland' || region === 'Baltimore' ? 'USA' : 
          region === 'London' ? 'UK' : 
          region === 'Cape Town' || region === 'Johannesburg' ? 'South Africa' : ''}`
      }
    };
  });
};

export const doctors: Doctor[] = generateDoctors();
