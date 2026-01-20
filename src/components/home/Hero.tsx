import { motion, animate, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { BookingWidget } from './BookingWidget';
import { ShieldCheck, Zap, Award, Play, Wrench, Car, Users, Star, MapPin, ChevronRight } from 'lucide-react';
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

// Default fallback images if none configured
const defaultBackgroundImages = [
  {
    url: "https://images.unsplash.com/photo-1625047509248-ec889cbff17f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80",
    alt: "Professional Car Service Garage"
  }
];

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

  // Background slider state
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Get background images from content or use defaults
  const backgroundImages = heroContent.backgroundImages && heroContent.backgroundImages.length > 0
    ? heroContent.backgroundImages
    : heroContent.backgroundImage
      ? [{ url: heroContent.backgroundImage, alt: 'Hero Background' }]
      : defaultBackgroundImages;

  // Get slider settings from content or use defaults
  const sliderSettings = {
    duration: heroContent.sliderSettings?.duration || 5,
    transition: heroContent.sliderSettings?.transition || 'fade',
    autoPlay: heroContent.sliderSettings?.autoPlay !== false,
    showIndicators: heroContent.sliderSettings?.showIndicators !== true,
  };

  // Auto-slide background images
  useEffect(() => {
    if (!sliderSettings.autoPlay || backgroundImages.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % backgroundImages.length);
    }, sliderSettings.duration * 1000);

    return () => clearInterval(interval);
  }, [backgroundImages.length, sliderSettings.autoPlay, sliderSettings.duration]);

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

  // Scroll to booking widget with car selector trigger
  const scrollToBooking = () => {
    const bookingWidget = document.getElementById('booking-widget');
    if (bookingWidget) {
      bookingWidget.scrollIntoView({ behavior: 'smooth', block: 'center' });
      // Trigger opening of car selector after scroll starts
      setTimeout(() => {
        window.dispatchEvent(new Event('open-booking-car-selector'));
      }, 500);
    }
  };

  // Get transition variants based on settings
  const getImageTransition = () => {
    switch (sliderSettings.transition) {
      case 'slide':
        return {
          initial: { opacity: 0, x: 100 },
          animate: { opacity: 1, x: 0 },
          exit: { opacity: 0, x: -100 },
        };
      case 'zoom':
        return {
          initial: { opacity: 0, scale: 1.2 },
          animate: { opacity: 1, scale: 1 },
          exit: { opacity: 0, scale: 0.9 },
        };
      case 'fade':
      default:
        return {
          initial: { opacity: 0, scale: 1.1 },
          animate: { opacity: 1, scale: 1 },
          exit: { opacity: 0 },
        };
    }
  };

  const imageTransition = getImageTransition();

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

  // Slide indicators component (reusable)
  const SlideIndicators = ({ className = "" }: { className?: string }) => {
    if (!sliderSettings.showIndicators || backgroundImages.length <= 1) return null;

    return (
      <div className={`flex gap-2 ${className}`}>
        {backgroundImages.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentImageIndex(idx)}
            className={`h-2 rounded-full transition-all duration-300 ${
              idx === currentImageIndex
                ? 'bg-primary w-6'
                : 'bg-white/40 hover:bg-white/60 w-2'
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    );
  };

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-gray-900">
      {/* ============== SLIDING BACKGROUND IMAGES ============== */}
      <div className="absolute inset-0 z-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentImageIndex}
            initial={imageTransition.initial}
            animate={imageTransition.animate}
            exit={imageTransition.exit}
            transition={{ duration: 1.2, ease: "easeInOut" }}
            className="absolute inset-0"
          >
            <img
              src={backgroundImages[currentImageIndex]?.url}
              alt={backgroundImages[currentImageIndex]?.alt || 'Hero Background'}
              className="w-full h-full object-cover"
            />
          </motion.div>
        </AnimatePresence>

        {/* Dark Overlay - Responsive: heavier on mobile for readability, lighter on desktop */}
        <div className="absolute inset-0 bg-gradient-to-b from-gray-900/60 via-gray-900/40 to-gray-900/70 md:hidden z-10" />
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900/50 via-gray-900/20 to-gray-900/50 hidden md:block lg:hidden z-10" />
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900/40 via-gray-900/15 to-gray-900/40 hidden lg:block z-10" />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/30 via-transparent to-gray-900/20 hidden lg:block z-10" />
      </div>

      {/* Image Indicators - Desktop position */}
      <SlideIndicators className="absolute bottom-24 sm:bottom-20 left-1/2 -translate-x-1/2 z-20 hidden lg:flex" />

      {/* ============== FLOATING ELEMENTS ============== */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-20">
        {/* Wrench - visible on tablet and up */}
        <motion.div
          className="absolute top-20 left-[10%] text-primary/20 hidden md:block"
          animate={{ y: [0, -15, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        >
          <Wrench size={60} />
        </motion.div>

        {/* Car - Desktop only */}
        <motion.div
          className="absolute top-40 right-[15%] text-primary/20 hidden lg:block"
          animate={{ y: [0, 12, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        >
          <Car size={80} />
        </motion.div>

        {/* Gradient Orb */}
        <motion.div
          className="absolute -top-40 -right-40 w-[300px] h-[300px] sm:w-[400px] sm:h-[400px] lg:w-[600px] lg:h-[600px] rounded-full opacity-20 bg-primary/40"
          style={{ filter: 'blur(100px)' }}
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      {/* Grid Pattern - Tablet and up */}
      <div
        className="absolute inset-0 opacity-[0.02] z-20 hidden md:block"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px'
        }}
      />

      {/* ============================================================== */}
      {/* ==================== MOBILE LAYOUT (< md) ==================== */}
      {/* ============================================================== */}
      <div className="md:hidden relative z-20 w-full min-h-screen">
        <div className="px-4 pt-20 pb-6">

          {/* Top Content - Centered */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-white text-center"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="mb-4 flex justify-center"
            >
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold text-primary">
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                {heroContent.badge}
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-[28px] sm:text-3xl font-bold leading-tight mb-4"
            >
              {heroContent.headline.line1} {heroContent.headline.line2}
              <br />
              <span className="text-primary">{heroContent.headline.highlight}</span>
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-sm text-gray-300 leading-relaxed mb-6 max-w-sm mx-auto px-2"
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

            {/* CTA Buttons - Stacked on mobile */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-col gap-3 mb-6 px-4"
            >
              <motion.button
                onClick={scrollToBooking}
                className="flex items-center justify-center gap-2 px-6 py-3.5 bg-primary text-white font-semibold rounded-full text-sm w-full"
                whileTap={{ scale: 0.98 }}
              >
                {heroContent.cta.primary}
                <ChevronRight className="w-4 h-4" />
              </motion.button>

              <motion.a
                href={heroContent.cta.videoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 px-5 py-3 bg-white/10 border border-white/20 text-white font-medium rounded-full text-sm w-full"
                whileTap={{ scale: 0.98 }}
              >
                <Play className="w-4 h-4" fill="currentColor" />
                {heroContent.cta.secondary}
              </motion.a>
            </motion.div>

            {/* Stats Row */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="flex items-center justify-center gap-6 py-4 mb-6"
            >
              {heroContent.stats.slice(0, 3).map((stat, idx) => {
                const IconComponent = iconMap[stat.icon] || Award;
                return (
                  <div key={idx} className="flex flex-col items-center text-center">
                    <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center mb-2">
                      <IconComponent className="w-5 h-5 text-primary" strokeWidth={1.5} />
                    </div>
                    <p className="text-[10px] text-gray-400 uppercase tracking-wide mb-0.5">{stat.label}</p>
                    <p className="text-sm font-bold text-white">
                      {stat.prefix || ''}{stat.value}{stat.suffix || ''}
                    </p>
                  </div>
                );
              })}
            </motion.div>
          </motion.div>

          {/* Booking Widget - Full size, naturally positioned */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            id="booking-widget-mobile"
          >
            <div className="mobile-booking-widget">
              <BookingWidget />
            </div>
          </motion.div>

          {/* Slide Indicators - Mobile */}
          <SlideIndicators className="justify-center mt-6" />
        </div>
      </div>

      {/* ============================================================== */}
      {/* ==================== TABLET LAYOUT (md to lg) ================ */}
      {/* ============================================================== */}
      <div className="hidden md:flex lg:hidden relative z-20 min-h-screen items-center px-6 py-20">
        <div className="w-full grid grid-cols-2 gap-6 items-center">

          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="text-white space-y-4"
          >
            {/* Badge */}
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-xs font-semibold text-primary">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              {heroContent.badge}
            </span>

            {/* Headline */}
            <h1 className="text-3xl font-bold leading-tight">
              {heroContent.headline.line1}
              <br />
              {heroContent.headline.line2}
              <br />
              <span className="text-primary">{heroContent.headline.highlight}</span>
            </h1>

            {/* Subheadline */}
            <p className="text-sm text-gray-300 leading-relaxed max-w-sm">
              {heroContent.subheadline.split(heroContent.savings.percentage).map((part, index, array) => (
                <span key={index}>
                  {part}
                  {index < array.length - 1 && (
                    <span className="text-primary font-semibold"> {heroContent.savings.percentage}</span>
                  )}
                </span>
              ))}
            </p>

            {/* CTA Buttons */}
            <div className="flex gap-3 pt-2">
              <motion.button
                onClick={scrollToBooking}
                className="flex items-center justify-center gap-2 px-5 py-2.5 bg-primary text-white font-semibold rounded-full text-sm"
                whileTap={{ scale: 0.98 }}
              >
                {heroContent.cta.primary}
                <ChevronRight className="w-4 h-4" />
              </motion.button>

              <motion.a
                href={heroContent.cta.videoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 px-4 py-2.5 bg-white/10 border border-white/20 text-white font-medium rounded-full text-sm"
                whileTap={{ scale: 0.98 }}
              >
                <Play className="w-4 h-4" fill="currentColor" />
                {heroContent.cta.secondary}
              </motion.a>
            </div>

            {/* Stats */}
            <div className="flex gap-5 pt-4 border-t border-white/10">
              {heroContent.stats.slice(0, 3).map((stat, idx) => {
                const IconComponent = iconMap[stat.icon] || Award;
                return (
                  <div key={idx} className="flex items-center gap-2">
                    <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center">
                      <IconComponent className="w-4 h-4 text-primary" strokeWidth={1.5} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white">
                        {stat.prefix || ''}{stat.value}{stat.suffix || ''}
                      </p>
                      <p className="text-[9px] text-gray-400 uppercase">{stat.label}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>

          {/* Right Widget */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="flex justify-end"
          >
            <div className="w-full max-w-sm tablet-booking-widget">
              <BookingWidget />
            </div>
          </motion.div>
        </div>

        {/* Slide Indicators - Tablet */}
        <SlideIndicators className="absolute bottom-8 left-1/2 -translate-x-1/2" />
      </div>

      {/* ============================================================== */}
      {/* ==================== DESKTOP LAYOUT (lg+) ==================== */}
      {/* ============================================================== */}
      <div className="hidden lg:block container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl relative z-20 py-20 sm:py-24 lg:py-32">
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
                        {stat.prefix || ''}<AnimatedCounter value={parseInt(stat.value.toString()) || 0} />{stat.suffix || ''}
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
            id="booking-widget"
          >
            <BookingWidget />
          </motion.div>
        </div>
      </div>

      {/* ============== MOBILE/TABLET BOOKING WIDGET STYLES ============== */}
      <style>{`
        /* ========== MOBILE WIDGET STYLES - Clean & Consistent ========== */
        .mobile-booking-widget > div {
          max-width: 100%;
        }

        .mobile-booking-widget .rounded-3xl {
          border-radius: 1.25rem;
        }

        .mobile-booking-widget .p-6,
        .mobile-booking-widget .sm\\:p-8 {
          padding: 1.25rem !important;
        }

        .mobile-booking-widget h3.text-2xl {
          font-size: 1.125rem !important;
          line-height: 1.5rem !important;
        }

        .mobile-booking-widget .text-sm {
          font-size: 0.8125rem !important;
        }

        .mobile-booking-widget .text-xs {
          font-size: 0.6875rem !important;
        }

        .mobile-booking-widget .text-base {
          font-size: 0.875rem !important;
        }

        .mobile-booking-widget .py-4 {
          padding-top: 0.75rem !important;
          padding-bottom: 0.75rem !important;
        }

        .mobile-booking-widget .px-4 {
          padding-left: 0.875rem !important;
          padding-right: 0.875rem !important;
        }

        .mobile-booking-widget .gap-5 {
          gap: 0.875rem !important;
        }

        .mobile-booking-widget .space-y-5 > * + * {
          margin-top: 0.875rem !important;
        }

        .mobile-booking-widget .w-10,
        .mobile-booking-widget .h-10 {
          width: 2.25rem !important;
          height: 2.25rem !important;
        }

        .mobile-booking-widget .w-5,
        .mobile-booking-widget .h-5 {
          width: 1rem !important;
          height: 1rem !important;
        }

        .mobile-booking-widget .rounded-2xl {
          border-radius: 0.875rem !important;
        }

        .mobile-booking-widget .rounded-xl {
          border-radius: 0.625rem !important;
        }

        .mobile-booking-widget .mb-2 {
          margin-bottom: 0.375rem !important;
        }

        .mobile-booking-widget .gap-3 {
          gap: 0.5rem !important;
        }

        .mobile-booking-widget label {
          font-size: 0.6875rem !important;
          margin-bottom: 0.25rem !important;
        }

        /* Trust footer */
        .mobile-booking-widget .px-6.py-4,
        .mobile-booking-widget .sm\\:px-8 {
          padding: 0.75rem 1rem !important;
        }

        .mobile-booking-widget .gap-6 {
          gap: 1rem !important;
        }

        .mobile-booking-widget .w-4,
        .mobile-booking-widget .h-4 {
          width: 0.875rem !important;
          height: 0.875rem !important;
        }

        /* Selection views */
        .mobile-booking-widget .max-h-\\[340px\\] {
          max-height: 280px !important;
        }

        /* Brand grid */
        .mobile-booking-widget .grid-cols-3 {
          gap: 0.625rem !important;
        }

        .mobile-booking-widget .grid-cols-3 > button {
          padding: 0.625rem !important;
        }

        .mobile-booking-widget .grid-cols-3 .w-14,
        .mobile-booking-widget .grid-cols-3 .h-14 {
          width: 2.75rem !important;
          height: 2.75rem !important;
        }

        .mobile-booking-widget .grid-cols-3 .mb-2 {
          margin-bottom: 0.25rem !important;
        }

        /* Model grid */
        .mobile-booking-widget .grid-cols-2 {
          gap: 0.625rem !important;
        }

        .mobile-booking-widget .grid-cols-2 > button {
          padding: 0.625rem !important;
        }

        .mobile-booking-widget .grid-cols-2 .h-16 {
          height: 3.5rem !important;
        }

        /* Accent bar */
        .mobile-booking-widget .h-1\\.5 {
          height: 0.25rem !important;
        }

        /* ========== SMALL MOBILE (< 375px) ========== */
        @media (max-width: 374px) {
          .mobile-booking-widget .p-6,
          .mobile-booking-widget .sm\\:p-8 {
            padding: 1rem !important;
          }

          .mobile-booking-widget h3.text-2xl {
            font-size: 1rem !important;
          }

          .mobile-booking-widget .text-sm {
            font-size: 0.75rem !important;
          }

          .mobile-booking-widget .grid-cols-3 .w-14,
          .mobile-booking-widget .grid-cols-3 .h-14 {
            width: 2.25rem !important;
            height: 2.25rem !important;
          }

          .mobile-booking-widget .max-h-\\[340px\\] {
            max-height: 240px !important;
          }
        }

        /* ========== TABLET WIDGET STYLES ========== */
        .tablet-booking-widget .p-6,
        .tablet-booking-widget .sm\\:p-8 {
          padding: 1.5rem !important;
        }

        .tablet-booking-widget h3.text-2xl {
          font-size: 1.375rem !important;
        }

        .tablet-booking-widget .text-sm {
          font-size: 0.875rem !important;
        }

        .tablet-booking-widget .space-y-5 > * + * {
          margin-top: 1.125rem !important;
        }

        .tablet-booking-widget .max-h-\\[340px\\] {
          max-height: 260px !important;
        }

        .tablet-booking-widget .py-4 {
          padding-top: 0.875rem !important;
          padding-bottom: 0.875rem !important;
        }
      `}</style>
    </section>
  );
};
