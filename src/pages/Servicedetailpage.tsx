import { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Check, 
  Clock, 
  Shield, 
  Star, 
  Phone,
  MessageCircle,
  ChevronDown,
  BadgePercent,
  Users,
  Calendar,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useContent } from '../admin-portal';

// Import local assets - Main images
import PeriodicServiceImg from '../assets/PeriodicService.jpg';
import PeriodicService1Img from '../assets/PeriodicService1.jpg';
import PeriodicService2Img from '../assets/PeriodicService2.jpg';

import ACServiceImg from '../assets/ACService.jpg';
import ACService1Img from '../assets/ACService1.jpg';
import ACService2Img from '../assets/ACService2.jpg';

import DentingImg from '../assets/Denting.jpg';
import Denting1Img from '../assets/Denting1.jpg';
import Denting2Img from '../assets/Denting2.jpg';

import CarInspectionImg from '../assets/CarInspection.jpg';
import CarInspection1Img from '../assets/CarInspection1.jpg';
import CarInspection2Img from '../assets/CarInspection2.jpg';

import WheelCareImg from '../assets/Wheelcare.jpg';
import WheelCare1Img from '../assets/WheelCare1.jpg';
import WheelCare2Img from '../assets/WheelCare2.jpg';

import BatteryServiceImg from '../assets/BatteryService.jpg';
import BatteryService1Img from '../assets/BatteryService1.jpg';
import BatteryService2Img from '../assets/BatteryService2.jpg';


import ClutchBody1Img from '../assets/ClutchBody1.jpg';

import InsuranceClaimsImg from '../assets/InsuranceClaims.jpg';
import InsuranceClaims1Img from '../assets/InsuranceClaims1.jpg';
import InsuranceClaims2Img from '../assets/InsuranceClaims2.jpg';

// Type definitions for extended service data
interface ProcessStep {
  step: number;
  title: string;
  description: string;
}

interface FAQ {
  question: string;
  answer: string;
}

interface ExtendedServiceData {
  duration: string;
  warranty: string;
  includes: string[];
  process: ProcessStep[];
  faqs: FAQ[];
}

// Extended service data with SERVICE-SPECIFIC process steps (fallback data)
const serviceExtendedData: Record<string, ExtendedServiceData> = {
  'Periodic Service': {
    duration: '3-4 hours',
    warranty: '6 months / 10,000 km',
    includes: [
      'Engine oil replacement (fully synthetic)',
      'Oil filter replacement',
      'Air filter cleaning/replacement',
      'Spark plug inspection',
      'Brake fluid top-up',
      'Coolant top-up',
      'Wiper fluid refill',
      'Battery health check',
      'Tire pressure adjustment',
      'Multi-point inspection (50+ checks)',
      'Interior vacuuming',
      'Exterior wash'
    ],
    process: [
      { step: 1, title: 'Book Online', description: 'Select your car model and preferred time slot' },
      { step: 2, title: 'Free Pickup', description: 'We collect your car from your doorstep' },
      { step: 3, title: 'Multi-Point Check', description: '50+ point inspection of your vehicle' },
      { step: 4, title: 'Oil & Filter Change', description: 'Replace engine oil and filters' },
      { step: 5, title: 'Quality Check', description: 'Supervisor inspects all work done' },
      { step: 6, title: 'Delivery', description: 'Car delivered sanitized and sparkling clean' }
    ],
    faqs: [
      { question: 'How often should I get periodic service?', answer: 'Every 10,000 km or 6 months, whichever comes first.' },
      { question: 'Do you use genuine parts?', answer: 'Yes, we only use OEM or equivalent quality parts with warranty.' },
      { question: 'Is pickup and drop free?', answer: 'Yes, pickup and drop is complimentary within city limits.' }
    ]
  },
  'AC Service & Repair': {
    duration: '2-3 hours',
    warranty: '3 months',
    includes: [
      'AC gas top-up (R134a)',
      'Compressor check',
      'Condenser cleaning',
      'Evaporator cleaning',
      'Cabin filter replacement',
      'Blower motor check',
      'Temperature sensor check',
      'Leak detection',
      'AC performance test'
    ],
    process: [
      { step: 1, title: 'Diagnosis', description: 'Check AC cooling and identify issues' },
      { step: 2, title: 'Gas Check', description: 'Measure refrigerant level and pressure' },
      { step: 3, title: 'Cleaning', description: 'Clean condenser and evaporator coils' },
      { step: 4, title: 'Gas Refill', description: 'Top up refrigerant gas if needed' },
      { step: 5, title: 'Testing', description: 'Verify cooling performance at all vents' }
    ],
    faqs: [
      { question: 'How do I know if my AC needs gas?', answer: 'If cooling is weak or AC takes longer to cool, it likely needs gas.' },
      { question: 'How long does AC gas last?', answer: 'Typically 2-3 years, but depends on usage and leaks.' }
    ]
  },
  'Denting & Painting': {
    duration: '2-5 days',
    warranty: '1 year',
    includes: [
      'Dent removal',
      'Surface preparation',
      'Primer application',
      'Base coat painting',
      'Clear coat finish',
      'Color matching',
      'Buffing and polishing',
      'Quality inspection'
    ],
    process: [
      { step: 1, title: 'Damage Assessment', description: 'Evaluate dents and scratches thoroughly' },
      { step: 2, title: 'Dent Removal', description: 'Professional dent pulling and smoothing' },
      { step: 3, title: 'Surface Prep', description: 'Sand, clean and prepare for painting' },
      { step: 4, title: 'Color Matching', description: 'Computer-aided exact color matching' },
      { step: 5, title: 'Paint Application', description: 'Apply primer, base coat and clear coat' },
      { step: 6, title: 'Polish & Finish', description: 'Buff and polish for showroom finish' }
    ],
    faqs: [
      { question: 'How long does denting and painting take?', answer: 'Minor dents take 1-2 days, major repairs may take 3-5 days.' },
      { question: 'Do you match the original color?', answer: 'Yes, we use computerized color matching for perfect results.' }
    ]
  },
  'Car Inspection': {
    duration: '1-2 hours',
    warranty: 'Report validity 30 days',
    includes: [
      'Engine diagnostics',
      'Brake system check',
      'Suspension inspection',
      'Electrical system test',
      'Fluid levels check',
      'Tire condition assessment',
      'Body inspection',
      'Road test',
      'Detailed report'
    ],
    process: [
      { step: 1, title: 'Visual Inspection', description: 'Check exterior and interior condition' },
      { step: 2, title: 'Engine Check', description: 'Inspect engine components and fluids' },
      { step: 3, title: 'OBD Scan', description: 'Run diagnostic scan for error codes' },
      { step: 4, title: 'Underbody Check', description: 'Inspect suspension, brakes and chassis' },
      { step: 5, title: 'Road Test', description: 'Test drive to check performance' },
      { step: 6, title: 'Report Generation', description: 'Detailed inspection report with photos' }
    ],
    faqs: [
      { question: 'When should I get my car inspected?', answer: 'Before buying a used car or annually for maintenance.' },
      { question: 'What does the inspection report include?', answer: 'Complete assessment of all systems with photos and recommendations.' }
    ]
  },
  'Wheel Care': {
    duration: '1-2 hours',
    warranty: '3 months',
    includes: [
      'Wheel alignment',
      'Wheel balancing',
      'Tire rotation',
      'Tire pressure check',
      'Tread depth measurement',
      'Rim inspection',
      'Valve replacement',
      'Nitrogen filling'
    ],
    process: [
      { step: 1, title: 'Initial Check', description: 'Inspect tire condition and wear pattern' },
      { step: 2, title: 'Wheel Removal', description: 'Remove wheels for detailed inspection' },
      { step: 3, title: 'Alignment Check', description: 'Measure camber, caster and toe angles' },
      { step: 4, title: 'Precision Alignment', description: 'Adjust to manufacturer specifications' },
      { step: 5, title: 'Wheel Balancing', description: 'Computer-aided dynamic balancing' },
      { step: 6, title: 'Road Test', description: 'Verify smooth handling and steering' }
    ],
    faqs: [
      { question: 'How often should I get wheel alignment?', answer: 'Every 10,000 km or when you notice uneven tire wear.' },
      { question: 'What are signs of wheel imbalance?', answer: 'Vibration in steering wheel, especially at high speeds.' }
    ]
  },
  'Battery Service': {
    duration: '30 mins - 1 hour',
    warranty: 'Up to 60 months (battery dependent)',
    includes: [
      'Battery health test',
      'Terminal cleaning',
      'Voltage check',
      'Charging system test',
      'Battery replacement',
      'Jump start service',
      'Disposal of old battery'
    ],
    process: [
      { step: 1, title: 'Battery Testing', description: 'Check battery health and cold cranking amps' },
      { step: 2, title: 'Voltage Check', description: 'Measure voltage under load and rest' },
      { step: 3, title: 'Terminal Cleaning', description: 'Clean corrosion from terminals' },
      { step: 4, title: 'Alternator Test', description: 'Verify charging system output' },
      { step: 5, title: 'Replacement', description: 'Install new battery if required' }
    ],
    faqs: [
      { question: 'How long does a car battery last?', answer: 'Typically 3-5 years depending on usage and climate.' },
      { question: 'How do I know if my battery needs replacement?', answer: 'Slow cranking, dim lights, or battery warning light are common signs.' }
    ]
  },
  'Clutch & Body': {
    duration: '4-8 hours',
    warranty: '6 months / 10,000 km',
    includes: [
      'Clutch plate replacement',
      'Pressure plate inspection',
      'Release bearing check',
      'Flywheel inspection',
      'Clutch cable adjustment',
      'Gear shifting test',
      'Road test'
    ],
    process: [
      { step: 1, title: 'Symptom Analysis', description: 'Diagnose clutch slipping or hard shifting' },
      { step: 2, title: 'Gearbox Removal', description: 'Carefully remove transmission assembly' },
      { step: 3, title: 'Component Inspection', description: 'Check clutch plate, pressure plate, bearing' },
      { step: 4, title: 'Parts Replacement', description: 'Install new clutch kit components' },
      { step: 5, title: 'Reassembly', description: 'Reinstall gearbox with proper alignment' },
      { step: 6, title: 'Road Test', description: 'Test smooth engagement and gear shifts' }
    ],
    faqs: [
      { question: 'How do I know if my clutch needs replacement?', answer: 'Slipping clutch, difficulty shifting, or burning smell are common signs.' },
      { question: 'How long does clutch replacement take?', answer: 'Typically 4-8 hours depending on the vehicle model.' }
    ]
  },
  'Insurance Claims': {
    duration: 'Varies',
    warranty: 'As per insurance policy',
    includes: [
      'Claim documentation',
      'Survey coordination',
      'Repair estimation',
      'Insurance liaison',
      'Cashless facility',
      'Quality repairs',
      'Final inspection'
    ],
    process: [
      { step: 1, title: 'Claim Registration', description: 'Register claim with insurance company' },
      { step: 2, title: 'Documentation', description: 'Collect FIR, license, RC and photos' },
      { step: 3, title: 'Survey', description: 'Coordinate with insurance surveyor' },
      { step: 4, title: 'Approval', description: 'Get repair estimate sanctioned' },
      { step: 5, title: 'Repair Work', description: 'Complete repairs as per approval' },
      { step: 6, title: 'Settlement', description: 'Cashless settlement or reimbursement' }
    ],
    faqs: [
      { question: 'Do you offer cashless claims?', answer: 'Yes, we are empaneled with all major insurance companies.' },
      { question: 'How long does the claim process take?', answer: 'Typically 3-7 days for approval, repairs depend on damage extent.' }
    ]
  }
};

// Default data for services without extended info
const defaultExtendedData: ExtendedServiceData = {
  duration: '2-4 hours',
  warranty: '6 months',
  includes: ['Professional service', 'Quality parts', 'Expert mechanics', 'Warranty coverage'],
  process: [
    { step: 1, title: 'Book', description: 'Schedule your service online' },
    { step: 2, title: 'Pickup', description: 'Free doorstep pickup' },
    { step: 3, title: 'Service', description: 'Expert service with updates' },
    { step: 4, title: 'Delivery', description: 'Car delivered clean and serviced' }
  ],
  faqs: [
    { question: 'Do you provide warranty?', answer: 'Yes, all services come with warranty.' },
    { question: 'Is pickup free?', answer: 'Yes, pickup and drop is complimentary.' }
  ]
};

// Service images mapping with multiple images per service
const serviceImages: Record<string, string[]> = {
  'Periodic Service': [PeriodicServiceImg, PeriodicService1Img, PeriodicService2Img],
  'AC Service & Repair': [ACServiceImg, ACService1Img, ACService2Img],
  'Denting & Painting': [DentingImg, Denting1Img, Denting2Img],
  'Car Inspection': [CarInspectionImg, CarInspection1Img, CarInspection2Img],
  'Wheel Care': [WheelCareImg, WheelCare1Img, WheelCare2Img],
  'Battery Service': [BatteryServiceImg, BatteryService1Img, BatteryService2Img],
  'Clutch & Body': [ ClutchBody1Img],
  'Insurance Claims': [InsuranceClaimsImg, InsuranceClaims1Img, InsuranceClaims2Img],
  'default': [PeriodicServiceImg, PeriodicService1Img, PeriodicService2Img]
};

export const ServiceDetailPage = () => {
  const { serviceSlug } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [activeImage, setActiveImage] = useState(0);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true });

  // Get content from context
  const { content } = useContent();
  const services = content.services.items;
  const globalContent = content.global;

  // Get service from state or find by slug
  const service = location.state?.service || services.find((s: { title: string; }) => 
    s.title.toLowerCase().replace(/\s+/g, '-').replace(/&/g, 'and') === serviceSlug
  );

  // Get extended data - prefer from service.process/faqs/includes if available, else use fallback
  const getExtendedData = (): ExtendedServiceData => {
    if (!service) return defaultExtendedData;
    
    const fallbackData = serviceExtendedData[service.title] || defaultExtendedData;
    
    return {
      duration: service.duration || fallbackData.duration,
      warranty: service.warranty || fallbackData.warranty,
      includes: service.includes || fallbackData.includes,
      process: service.process?.map((p: { title: string; description: string }, idx: number) => ({ 
        step: idx + 1, 
        title: p.title, 
        description: p.description 
      })) || fallbackData.process,
      faqs: service.faqs || fallbackData.faqs
    };
  };

  const extendedData = getExtendedData();

  // Get images
  const images = service ? 
    (serviceImages[service.title] || serviceImages['default']) : 
    serviceImages['default'];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [serviceSlug]);

  // Auto-advance gallery
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveImage((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [images.length]);

  const nextImage = () => {
    setActiveImage((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setActiveImage((prev) => (prev - 1 + images.length) % images.length);
  };

  if (!service) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Service not found</h1>
          <button 
            onClick={() => navigate('/services')}
            className="px-6 py-3 bg-primary text-primary-foreground rounded-full"
          >
            View All Services
          </button>
        </div>
      </div>
    );
  }

  const handleBookNow = () => {
    navigate('/', { state: { scrollToBooking: true, selectedService: service } });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Back Button - with proper top padding for fixed navbar */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl pt-24 sm:pt-28">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Services</span>
        </button>
      </div>

      {/* Hero Section */}
      <section className="relative pb-8 sm:pb-12 lg:pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-start">
            
            {/* Image Gallery */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              {/* Main Image */}
              <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden mb-4 aspect-[4/3] group">
                <motion.img 
                  key={activeImage}
                  src={images[activeImage]}
                  alt={service.title}
                  className="w-full h-full object-cover"
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4 }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                
                {/* Navigation Arrows */}
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 dark:bg-gray-800/90 flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white dark:hover:bg-gray-700"
                >
                  <ChevronLeft className="w-5 h-5 text-foreground" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 dark:bg-gray-800/90 flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white dark:hover:bg-gray-700"
                >
                  <ChevronRight className="w-5 h-5 text-foreground" />
                </button>

                {/* Image Counter */}
                <div className="absolute bottom-4 right-4 px-3 py-1.5 bg-black/60 backdrop-blur-sm rounded-full text-white text-sm">
                  {activeImage + 1} / {images.length}
                </div>

                {/* Badges */}
                <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                  <span className="px-3 py-1.5 bg-white/20 backdrop-blur-md text-white text-xs rounded-full flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    {extendedData.duration}
                  </span>
                  <span className="px-3 py-1.5 bg-white/20 backdrop-blur-md text-white text-xs rounded-full flex items-center gap-1.5">
                    <Shield className="w-3.5 h-3.5" />
                    {extendedData.warranty}
                  </span>
                </div>
              </div>

              {/* Thumbnail Gallery */}
              <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                {images.map((img, idx) => (
                  <motion.button
                    key={idx}
                    onClick={() => setActiveImage(idx)}
                    className={`relative flex-shrink-0 w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden transition-all ${
                      activeImage === idx 
                        ? 'ring-2 ring-primary ring-offset-2 ring-offset-background' 
                        : 'opacity-60 hover:opacity-100'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <img 
                      src={img} 
                      alt={`${service.title} ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                    {activeImage === idx && (
                      <div className="absolute inset-0 bg-primary/10" />
                    )}
                  </motion.button>
                ))}
              </div>
            </motion.div>

            {/* Service Info */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              {/* Title */}
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-3">
                {service.title}
              </h1>

              {/* Rating & Stats */}
              <div className="flex flex-wrap items-center gap-4 mb-4">
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star 
                      key={star} 
                      className={`w-4 h-4 ${star <= 4 ? 'fill-yellow-400 text-yellow-400' : 'fill-yellow-400/50 text-yellow-400/50'}`} 
                    />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">4.8 (2,340 reviews)</span>
                <span className="text-sm text-muted-foreground flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  5,000+ serviced
                </span>
              </div>

              {/* Description */}
              <p className="text-muted-foreground text-base sm:text-lg leading-relaxed mb-6">
                {service.description}
              </p>

              {/* Quick Features */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                <div className="flex items-center gap-2 p-3 bg-secondary/50 rounded-xl">
                  <Clock className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-xs text-muted-foreground">Duration</p>
                    <p className="text-sm font-semibold text-foreground">{extendedData.duration}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 p-3 bg-secondary/50 rounded-xl">
                  <Shield className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-xs text-muted-foreground">Warranty</p>
                    <p className="text-sm font-semibold text-foreground">{extendedData.warranty}</p>
                  </div>
                </div>
              </div>

              {/* Price */}
              <div className="p-6 bg-secondary/50 rounded-2xl mb-6">
                <div className="flex items-end justify-between mb-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Starting from</p>
                    {service.originalPrice && (
                      <span className="text-lg text-muted-foreground line-through mr-2">
                        ₹{service.originalPrice.toLocaleString()}
                      </span>
                    )}
                    <span className="text-4xl font-bold text-foreground">
                      ₹{service.price?.toLocaleString()}
                    </span>
                  </div>
                  {service.originalPrice && service.price && (
                    <span className="px-3 py-1 bg-green-500 text-white text-sm font-bold rounded-full flex items-center gap-1">
                      <BadgePercent className="w-4 h-4" />
                      Save ₹{(service.originalPrice - service.price).toLocaleString()}
                    </span>
                  )}
                </div>

                <motion.button
                  onClick={handleBookNow}
                  className="w-full py-4 bg-primary text-primary-foreground rounded-full text-lg font-semibold flex items-center justify-center gap-2"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Calendar className="w-5 h-5" />
                  Book This Service
                </motion.button>

                <div className="flex items-center justify-center gap-4 mt-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Check className="w-4 h-4 text-green-500" />
                    Free pickup
                  </span>
                  <span className="flex items-center gap-1">
                    <Check className="w-4 h-4 text-green-500" />
                    Pay later
                  </span>
                </div>
              </div>

              {/* Quick Contact */}
              <div className="flex gap-3">
                <a 
                  href={`tel:${globalContent.brand.phone}`}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-secondary rounded-xl text-foreground font-medium hover:bg-secondary/80 transition-colors"
                >
                  <Phone className="w-4 h-4" />
                  Call Now
                </a>
                <a 
                  href={`https://wa.me/${globalContent.brand.phone.replace(/\D/g, '')}`}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-green-500 text-white rounded-xl font-medium hover:bg-green-600 transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                  WhatsApp
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* What's Included */}
      <section ref={sectionRef} className="py-12 sm:py-16 bg-secondary/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-8">
              What's Included
            </h2>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {extendedData.includes.map((item: string, idx: number) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: idx * 0.05 }}
                  className="flex items-start gap-3 p-4 bg-card rounded-xl border border-border"
                >
                  <div className="w-6 h-6 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="w-4 h-4 text-green-600 dark:text-green-400" />
                  </div>
                  <span className="text-foreground">{item}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* How It Works - Premium Redesigned UI */}
      <section className="py-16 sm:py-20 bg-white dark:bg-gray-950">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-3">
              How It Works
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our streamlined process ensures quality service for your {service.title.toLowerCase()}
            </p>
          </motion.div>

          {/* Process Steps - Desktop */}
          <div className="hidden lg:block">
            {/* Timeline Container */}
            <div className="relative">
              {/* Horizontal Line */}
              <div className="absolute top-7 left-[8%] right-[8%] h-0.5 bg-gray-200 dark:bg-gray-800" />
              
              {/* Progress Line (animated) */}
              <motion.div 
                className="absolute top-7 left-[8%] h-0.5 bg-primary"
                initial={{ width: 0 }}
                whileInView={{ width: '84%' }}
                viewport={{ once: true }}
                transition={{ duration: 1.5, ease: "easeOut" }}
              />

              {/* Steps Grid */}
              <div 
                className="grid gap-4"
                style={{ 
                  gridTemplateColumns: `repeat(${Math.min(extendedData.process.length, 6)}, 1fr)` 
                }}
              >
                {extendedData.process.slice(0, 6).map((step: ProcessStep, idx: number) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.15 }}
                    className="relative flex flex-col items-center text-center"
                  >
                    {/* Step Number Circle */}
                    <motion.div
                      className="relative z-10 w-14 h-14 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-lg font-bold shadow-lg shadow-primary/25"
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: idx * 0.15 + 0.2, type: "spring", stiffness: 200 }}
                    >
                      {step.step}
                    </motion.div>

                    {/* Content */}
                    <div className="mt-6">
                      <h3 className="text-base font-semibold text-foreground mb-2">
                        {step.title}
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Second Row if more than 6 steps */}
            {extendedData.process.length > 6 && (
              <div className="relative mt-16">
                <div className="absolute top-7 left-[8%] right-[8%] h-0.5 bg-gray-200 dark:bg-gray-800" />
                <motion.div 
                  className="absolute top-7 left-[8%] h-0.5 bg-primary"
                  initial={{ width: 0 }}
                  whileInView={{ width: '84%' }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, ease: "easeOut", delay: 0.5 }}
                />
                <div 
                  className="grid gap-4"
                  style={{ 
                    gridTemplateColumns: `repeat(${extendedData.process.length - 6}, 1fr)` 
                  }}
                >
                  {extendedData.process.slice(6).map((step: ProcessStep, idx: number) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: idx * 0.15 + 0.5 }}
                      className="relative flex flex-col items-center text-center"
                    >
                      <motion.div
                        className="relative z-10 w-14 h-14 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-lg font-bold shadow-lg shadow-primary/25"
                        initial={{ scale: 0 }}
                        whileInView={{ scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: idx * 0.15 + 0.7, type: "spring", stiffness: 200 }}
                      >
                        {step.step}
                      </motion.div>
                      <div className="mt-6">
                        <h3 className="text-base font-semibold text-foreground mb-2">
                          {step.title}
                        </h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {step.description}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Process Steps - Tablet */}
          <div className="hidden sm:block lg:hidden">
            <div className="grid sm:grid-cols-2 gap-6">
              {extendedData.process.map((step: ProcessStep, idx: number) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: idx % 2 === 0 ? -20 : 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="relative flex gap-4 p-5 bg-card rounded-2xl border border-border hover:border-primary/30 hover:shadow-lg transition-all"
                >
                  {/* Step Number */}
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-lg font-bold">
                    {step.step}
                  </div>
                  
                  {/* Content */}
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-1">
                      {step.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {step.description}
                    </p>
                  </div>

                  {/* Connector Arrow (for even items) */}
                  {idx % 2 === 0 && idx < extendedData.process.length - 1 && (
                    <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 text-primary">
                      <ChevronRight className="w-6 h-6" />
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>

          {/* Process Steps - Mobile */}
          <div className="sm:hidden">
            <div className="relative">
              {/* Vertical Line */}
              <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-800" />
              
              {/* Animated Progress Line */}
              <motion.div 
                className="absolute left-6 top-0 w-0.5 bg-primary"
                initial={{ height: 0 }}
                whileInView={{ height: '100%' }}
                viewport={{ once: true }}
                transition={{ duration: 1.5, ease: "easeOut" }}
              />
              
              <div className="space-y-6">
                {extendedData.process.map((step: ProcessStep, idx: number) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                    className="relative flex gap-4 pl-2"
                  >
                    {/* Step Number */}
                    <motion.div
                      className="relative z-10 flex-shrink-0 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold shadow-md"
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: idx * 0.1 + 0.2, type: "spring" }}
                    >
                      {step.step}
                    </motion.div>
                    
                    {/* Content Card */}
                    <div className="flex-1 pb-6">
                      <div className="p-4 bg-card rounded-xl border border-border">
                        <h3 className="text-base font-semibold text-foreground mb-1">
                          {step.title}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-12 sm:py-16 bg-secondary/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-8 text-center">
            Frequently Asked Questions
          </h2>

          <div className="space-y-3">
            {extendedData.faqs.map((faq: FAQ, idx: number) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className={`rounded-xl border overflow-hidden transition-all ${
                  openFaq === idx ? 'border-primary/30 bg-primary/5' : 'border-border bg-card'
                }`}
              >
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full flex items-center justify-between p-5 text-left"
                >
                  <span className={`font-semibold ${openFaq === idx ? 'text-primary' : 'text-foreground'}`}>
                    {faq.question}
                  </span>
                  <motion.div
                    animate={{ rotate: openFaq === idx ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronDown className="w-5 h-5 text-muted-foreground" />
                  </motion.div>
                </button>

                {openFaq === idx && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="px-5 pb-5">
                      <p className="text-muted-foreground">{faq.answer}</p>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Custom scrollbar hide */}
      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};