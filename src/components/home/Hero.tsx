import { motion, animate } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { BookingWidget } from './BookingWidget';
import { ShieldCheck, Zap, Award, Play, Wrench, Car, Users, Star, MapPin } from 'lucide-react';
import { useContent } from '../../admin-portal';

// Icon mapping for dynamic icon rendering
const iconMap: Record<string, React.ComponentType<{ className?: string; strokeWidth?: number; size?: number }>> = {
  ShieldCheck,
  Zap,
  Award,
  Users,
  Star,
  MapPin,
  Wrench,
  Car,
};

// Animated counter component
const AnimatedCounter = ({ value, duration = 2 }: { value: number; duration?: number }) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const controls = animate(0, value, {
      duration,
      ease: "easeOut",
      onUpdate: (latest) => setDisplayValue(Math.floor(latest))
    });
    return () => controls.stop();
  }, [value, duration]);

  return <>{displayValue.toLocaleString()}</>;
};

export const Hero = () => {
  const location = useLocation();
  const { content } = useContent();
  const heroContent = content.hero;

  // Handle scroll to booking when coming from another page
  useEffect(() => {
    const state = location.state as { scrollToBooking?: boolean } | null;
    if (state?.scrollToBooking) {
      setTimeout(() => {
        const bookingWidget = document.getElementById('booking-widget');
        if (bookingWidget) {
          bookingWidget.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 300);
    }
  }, [location.state]);

  // Scroll to booking widget
  const scrollToBooking = () => {
    const bookingWidget = document.getElementById('booking-widget');
    if (bookingWidget) {
      bookingWidget.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { 
        staggerChildren: 0.15,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { 
        type: "spring" as const,
        stiffness: 100,
        damping: 20
      } 
    }
  };

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Background Image with Subtle Zoom */}
      <motion.div 
        className="absolute inset-0 z-0"
        initial={{ scale: 1.05 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
      >
        <img 
          src={heroContent.backgroundImage}
          alt="Professional Car Service Garage"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-900/95 to-gray-900/80" />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-gray-900/50" />
      </motion.div>

      {/* Animated Floating Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-20 left-[10%] text-primary/20"
          animate={{ y: [0, -15, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        >
          <Wrench size={60} />
        </motion.div>
        
        <motion.div
          className="absolute top-40 right-[15%] text-primary/20 hidden lg:block"
          animate={{ y: [0, 12, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        >
          <Car size={80} />
        </motion.div>

        {/* Gradient Orb */}
        <motion.div 
          className="absolute -top-40 -right-40 w-[300px] h-[300px] sm:w-[600px] sm:h-[600px] rounded-full opacity-20 bg-primary/40"
          style={{ filter: 'blur(100px)' }}
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      {/* Grid Pattern */}
      <div 
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px sm:60px 60px'
        }}
      />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl relative z-10 py-20 sm:py-24 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 xl:gap-20 items-center">
          
          {/* Left Content */}
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="text-white space-y-6 sm:space-y-8 text-center lg:text-left"
          >
            {/* Badge */}
            <motion.div variants={itemVariants} className="flex justify-center lg:justify-start">
              <span className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-xs sm:text-sm font-semibold text-primary">
                <motion.span 
                  className="w-2 h-2 rounded-full bg-primary"
                  animate={{ opacity: [1, 0.5, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                {heroContent.badge}
              </span>
            </motion.div>
            
            {/* Headline */}
            <motion.h1 
              variants={itemVariants} 
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-[1.1] tracking-tight"
            >
              {heroContent.headline.line1}
              <br />
              {heroContent.headline.line2}
              <br />
              <span className="text-primary">
                {heroContent.headline.highlight}
              </span>
            </motion.h1>
            
            {/* Subheadline */}
            <motion.p 
              variants={itemVariants} 
              className="text-base sm:text-lg md:text-xl text-gray-300 max-w-lg mx-auto lg:mx-0 leading-relaxed"
            >
              {heroContent.subheadline.split(heroContent.savings.percentage).map((part, index, array) => (
                <span key={index}>
                  {part}
                  {index < array.length - 1 && (
                    <span className="text-primary font-semibold"> {heroContent.savings.percentage}</span>
                  )}
                </span>
              ))}
            </motion.p>

            {/* CTA Buttons */}
            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 pt-2 justify-center lg:justify-start">
              <motion.button 
                onClick={scrollToBooking}
                className="group flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-primary text-primary-foreground font-semibold rounded-full transition-all duration-300 text-sm sm:text-base"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
              >
                {heroContent.cta.primary}
                <svg className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </motion.button>
              
              {/* Watch Video Button */}
              <motion.a 
                href={heroContent.cta.videoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-center gap-2 px-5 sm:px-6 py-3 sm:py-4 bg-white/10 backdrop-blur-sm border border-white/20 text-white font-semibold rounded-full hover:bg-white/20 transition-all duration-300 text-sm sm:text-base cursor-pointer"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
              >
                <Play className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" />
                {heroContent.cta.secondary}
              </motion.a>
            </motion.div>

            {/* Trust Badges - Dynamic from content */}
            <motion.div 
              variants={itemVariants} 
              className="flex flex-wrap gap-4 sm:gap-6 lg:gap-10 pt-6 sm:pt-8 border-t border-white/10 justify-center lg:justify-start"
            >
              {heroContent.stats.map((stat, idx) => {
                const IconComponent = iconMap[stat.icon] || Award;
                return (
                  <motion.div 
                    key={idx} 
                    className="flex items-center gap-2 sm:gap-3"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 + idx * 0.1, duration: 0.5 }}
                    whileHover={{ y: -3 }}
                  >
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center">
                      <IconComponent className="w-5 h-5 sm:w-6 sm:h-6 text-primary" strokeWidth={1.5} />
                    </div>
                    <div>
                      <p className="text-[10px] sm:text-xs text-gray-400 uppercase tracking-wider">{stat.label}</p>
                      <p className="text-sm sm:text-lg font-bold text-white">
                        {stat.prefix || ''}<AnimatedCounter value={stat.value} />{stat.suffix || ''}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          </motion.div>

          {/* Right Widget */}
          <motion.div 
            className="flex justify-center lg:justify-end mt-8 lg:mt-0"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.7, ease: "easeOut" }}
          >
            <BookingWidget />
          </motion.div>
        </div>
      </div>

      {/* Scrolling Brand Logos - Dynamic from content */}
      <motion.div 
        className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-gray-900/90 to-transparent py-4 sm:py-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.6 }}
      >
        <div className="overflow-hidden">
          <motion.div 
            className="flex gap-8 sm:gap-12"
            animate={{ x: ['0%', '-50%'] }}
            transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
          >
            {[...Array(2)].map((_, setIdx) => (
              <div key={setIdx} className="flex gap-8 sm:gap-12 items-center">
                {heroContent.scrollingBrands.map((brand) => (
                  <span 
                    key={brand.name} 
                    className="text-gray-500 font-semibold text-sm sm:text-lg whitespace-nowrap hover:text-white transition-colors duration-300"
                  >
                    {brand.name}
                  </span>
                ))}
              </div>
            ))}
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
};