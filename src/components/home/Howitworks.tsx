import { motion } from 'framer-motion';
import { MapPin, Calendar, Wrench, CheckCircle, ArrowRight } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

// Import local assets - path from src/components/home/ to src/assets/
import SelectLocationImg from '../../assets/SelectLocation.jpg';
import BookaSlotImg from '../../assets/BookaSlot.jpg';
import WeServiceImg from '../../assets/WeService.jpg';
import CardeliveredImg from '../../assets/Cardelivered.jpg';

const steps = [
  {
    number: '01',
    icon: MapPin,
    title: 'Select Location',
    description: 'Choose your city and preferred service location. We cover all major cities.',
    color: '#FF5733',
    image: SelectLocationImg
  },
  {
    number: '02',
    icon: Calendar,
    title: 'Book a Slot',
    description: 'Pick a convenient date and time. Free doorstep pickup available.',
    color: '#3B82F6',
    image: BookaSlotImg
  },
  {
    number: '03',
    icon: Wrench,
    title: 'We Service',
    description: 'Expert mechanics work on your car with real-time progress updates.',
    color: '#10B981',
    image: WeServiceImg
  },
  {
    number: '04',
    icon: CheckCircle,
    title: 'Car Delivered',
    description: 'Your car delivered back to you, sanitized and sparkling clean.',
    color: '#8B5CF6',
    image: CardeliveredImg
  }
];

// Optimized animation variants with proper typing
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1
    }
  }
} as const;

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'tween' as const,
      duration: 0.4,
      ease: 'easeOut' as const
    }
  }
};

const mobileItemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      type: 'tween' as const,
      duration: 0.3,
      ease: 'easeOut' as const
    }
  }
};

export const HowItWorks = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  // Handle Book Now click
  const handleBookNow = () => {
    if (isHomePage) {
      const bookingWidget = document.getElementById('booking-widget');
      if (bookingWidget) {
        bookingWidget.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    } else {
      navigate('/', { state: { scrollToBooking: true } });
    }
  };

  return (
    <section id="how-it-works" className="py-12 sm:py-16 lg:py-24 bg-white relative overflow-hidden">
      {/* Background - Simplified, no animation */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] sm:w-[800px] h-[400px] sm:h-[800px] rounded-full opacity-30"
          style={{
            background: 'radial-gradient(circle, rgba(255,87,51,0.05) 0%, transparent 60%)'
          }}
        />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl relative z-10">
        {/* Header */}
        <motion.div
          className="text-center max-w-2xl mx-auto mb-10 sm:mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          <span className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-gray-100 text-gray-600 text-[10px] sm:text-xs font-semibold uppercase tracking-wider mb-3 sm:mb-4">
            How It Works
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 tracking-tight mb-4 sm:mb-6">
            Car service in
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary">4 simple steps.</span>
          </h2>
          <p className="text-sm sm:text-base lg:text-lg text-gray-500">
            We've simplified car maintenance so you can focus on what matters most.
          </p>
        </motion.div>

        {/* Steps - Desktop Timeline */}
        <div className="hidden lg:block relative">
          {/* Timeline Line - Simplified animation */}
          <div className="absolute top-24 left-0 right-0 h-1 bg-gray-100 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-primary via-primary to-primary"
              style={{ willChange: 'width' }}
              initial={{ width: '0%' }}
              whileInView={{ width: '100%' }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 1, ease: 'easeOut' }}
            />
          </div>

          <motion.div
            className="grid grid-cols-4 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            {steps.map((step) => (
              <motion.div
                key={step.number}
                variants={itemVariants}
                className="relative"
                style={{ willChange: 'opacity, transform' }}
              >
                {/* Step Number Circle */}
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-6 relative z-10 shadow-lg transition-transform duration-300 hover:scale-110"
                  style={{ backgroundColor: step.color }}
                >
                  <span className="text-white font-bold text-sm">{step.number}</span>
                </div>

                {/* Image Card - Using CSS transitions instead of Framer Motion */}
                <div className="relative rounded-2xl overflow-hidden mb-6 h-40 group transition-transform duration-300 hover:-translate-y-1">
                  <img
                    src={step.image}
                    alt={step.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div
                    className="absolute bottom-4 left-4 w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: `${step.color}30` }}
                  >
                    <step.icon className="w-5 h-5" style={{ color: step.color }} />
                  </div>
                </div>

                {/* Content */}
                <h3 className="text-lg font-bold text-gray-900 mb-2 text-center">
                  {step.title}
                </h3>
                <p className="text-sm text-gray-500 text-center leading-relaxed">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Steps - Mobile/Tablet View */}
        <motion.div
          className="lg:hidden space-y-6 sm:space-y-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          {steps.map((step, index) => (
            <motion.div
              key={step.number}
              variants={mobileItemVariants}
              className="flex gap-4 sm:gap-6"
              style={{ willChange: 'opacity, transform' }}
            >
              {/* Left: Number & Line */}
              <div className="flex flex-col items-center">
                <div
                  className="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center shadow-lg flex-shrink-0 transition-transform duration-300 hover:scale-110"
                  style={{ backgroundColor: step.color }}
                >
                  <span className="text-white font-bold text-xs sm:text-sm">{step.number}</span>
                </div>
                {index < steps.length - 1 && (
                  <div className="w-0.5 flex-1 mt-2" style={{ backgroundColor: `${step.color}30` }} />
                )}
              </div>

              {/* Right: Content */}
              <div className="flex-1 pb-6 sm:pb-8">
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                  {/* Image */}
                  <div className="sm:w-32 h-24 sm:h-24 rounded-xl overflow-hidden flex-shrink-0">
                    <img
                      src={step.image}
                      alt={step.title}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>

                  {/* Text */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1 sm:mb-2">
                      <step.icon className="w-4 h-4 sm:w-5 sm:h-5" style={{ color: step.color }} />
                      <h3 className="text-base sm:text-lg font-bold text-gray-900">
                        {step.title}
                      </h3>
                    </div>
                    <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div
          className="text-center mt-10 sm:mt-16"
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
        >
          <button
            onClick={handleBookNow}
            className="inline-flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-gray-900 text-white font-semibold rounded-full hover:bg-black transition-all duration-300 text-sm sm:text-base hover:shadow-xl group"
          >
            Book Your Service Now
            <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform duration-300" />
          </button>
        </motion.div>
      </div>
    </section>
  );
};