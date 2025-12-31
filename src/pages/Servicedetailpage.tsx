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
  Calendar
} from 'lucide-react';
import { services } from '../utils/data';

// Extended service data with more details
const serviceExtendedData: Record<string, {
  duration: string;
  warranty: string;
  includes: string[];
  process: { step: number; title: string; description: string }[];
  faqs: { question: string; answer: string }[];
}> = {
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
      { step: 3, title: 'Service', description: 'Expert mechanics service your car with genuine parts' },
      { step: 4, title: 'Quality Check', description: 'Supervisor inspects all work done' },
      { step: 5, title: 'Delivery', description: 'Car delivered back, sanitized and sparkling clean' }
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
  // Add more services as needed...
};

// Default data for services without extended info
const defaultExtendedData = {
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

const serviceImages: Record<string, string[]> = {
  'Periodic Service': [
    'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=800&q=80',
    'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=800&q=80',
    'https://images.unsplash.com/photo-1625047509248-ec889cbff17f?w=800&q=80'
  ],
  'AC Service & Repair': [
    'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=800&q=80',
    'https://images.unsplash.com/photo-1635273051427-7c2a37a2c8f9?w=800&q=80'
  ],
  'default': [
    'https://images.unsplash.com/photo-1625047509248-ec889cbff17f?w=800&q=80'
  ]
};

export const ServiceDetailPage = () => {
  const { serviceSlug } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [activeImage, setActiveImage] = useState(0);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true });

  // Get service from state or find by slug
  const service = location.state?.service || services.find(s => 
    s.title.toLowerCase().replace(/\s+/g, '-').replace(/&/g, 'and') === serviceSlug
  );

  // Get extended data
  const extendedData = service ? 
    (serviceExtendedData[service.title] || defaultExtendedData) : 
    defaultExtendedData;

  // Get images
  const images = service ? 
    (serviceImages[service.title] || serviceImages['default']) : 
    serviceImages['default'];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [serviceSlug]);

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
              <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden mb-4 aspect-[4/3]">
                <motion.img 
                  key={activeImage}
                  src={images[activeImage]}
                  alt={service.title}
                  className="w-full h-full object-cover"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                />
                
                {/* Discount Badge */}
                {service.originalPrice && service.price && (
                  <div className="absolute top-4 right-4">
                    <span className="px-4 py-2 bg-green-500 text-white font-bold rounded-full flex items-center gap-2">
                      <BadgePercent className="w-4 h-4" />
                      {Math.round(((service.originalPrice - service.price) / service.originalPrice) * 100)}% OFF
                    </span>
                  </div>
                )}
              </div>

              {/* Thumbnail Gallery */}
              {images.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-2">
                  {images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImage(idx)}
                      className={`flex-shrink-0 w-20 h-16 rounded-xl overflow-hidden border-2 transition-all ${
                        activeImage === idx ? 'border-primary' : 'border-transparent opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </motion.div>

            {/* Service Info */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              {/* Badges */}
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="px-3 py-1.5 bg-primary/10 text-primary text-xs font-semibold rounded-full flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  {extendedData.duration}
                </span>
                <span className="px-3 py-1.5 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 text-xs font-semibold rounded-full flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5" />
                  {extendedData.warranty} warranty
                </span>
                <span className="px-3 py-1.5 bg-secondary text-muted-foreground text-xs font-semibold rounded-full flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5" />
                  500+ bookings
                </span>
              </div>

              {/* Title */}
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground tracking-tight mb-4">
                {service.title}
              </h1>

              {/* Rating */}
              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">4.8 (2,340 reviews)</span>
              </div>

              {/* Description */}
              <p className="text-muted-foreground text-base sm:text-lg leading-relaxed mb-6">
                {service.description}
              </p>

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
                    <span className="px-3 py-1 bg-green-500 text-white text-sm font-bold rounded-full">
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
                  href="tel:+919876543210"
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-secondary rounded-xl text-foreground font-medium hover:bg-secondary/80 transition-colors"
                >
                  <Phone className="w-4 h-4" />
                  Call Now
                </a>
                <a 
                  href="https://wa.me/919876543210"
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
              {extendedData.includes.map((item, idx) => (
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

      {/* How It Works */}
      <section className="py-12 sm:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-8">
            How It Works
          </h2>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {extendedData.process.map((step, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="relative"
              >
                {/* Connector Line */}
                {idx < extendedData.process.length - 1 && (
                  <div className="hidden lg:block absolute top-6 left-1/2 w-full h-0.5 bg-border" />
                )}
                
                <div className="relative z-10 text-center">
                  <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-lg font-bold">
                    {step.step}
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">{step.title}</h3>
                  <p className="text-sm text-muted-foreground">{step.description}</p>
                </div>
              </motion.div>
            ))}
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
            {extendedData.faqs.map((faq, idx) => (
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

    </div>
  );
};