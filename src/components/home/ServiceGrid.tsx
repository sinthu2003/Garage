import { useRef } from 'react';
import { services } from '../../utils/data';
import { ServiceCard } from './ServiceCard';
import { motion, useInView } from 'framer-motion';
import { ArrowRight, Settings, Wrench, Car } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const ServiceGrid = () => {
  const sectionRef = useRef(null);
  const headerRef = useRef(null);
  const isHeaderInView = useInView(headerRef, { once: true, margin: "-50px" });
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });
  const navigate = useNavigate();

  // Show only first 8 services on homepage
  const displayedServices = services.slice(0, 8);
  const hasMoreServices = services.length > 8;

  const handleViewAll = () => {
    navigate('/services');
  };

  return (
    <section id="services" ref={sectionRef} className="py-16 lg:py-24 bg-secondary relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Gradient Orb */}
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full opacity-40 bg-primary/5"
          style={{ filter: 'blur(100px)' }}
        />
        
        {/* Dot Pattern */}
        <div 
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage: 'radial-gradient(circle, hsl(var(--primary) / 0.15) 1px, transparent 1px)',
            backgroundSize: '24px 24px'
          }}
        />

        {/* Floating Icons */}
        <motion.div
          className="absolute left-[5%] top-[15%] text-primary/20 hidden lg:block"
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 5, repeat: Infinity }}
        >
          <Wrench className="w-8 h-8" />
        </motion.div>
        <motion.div
          className="absolute right-[8%] top-[20%] text-primary/20 hidden lg:block"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 6, repeat: Infinity }}
        >
          <Car className="w-10 h-10" />
        </motion.div>
      </div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl relative z-10">
        {/* Section Header */}
        <motion.div 
          ref={headerRef}
          className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12 lg:mb-16"
        >
          <div className="max-w-xl">
            {/* Badge */}
            <motion.span 
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-xs font-semibold uppercase tracking-wider mb-4"
              initial={{ opacity: 0, x: -20 }}
              animate={isHeaderInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
              transition={{ duration: 0.4 }}
            >
              <Settings className="w-4 h-4" />
              Our Services
            </motion.span>

            {/* Title */}
            <motion.h2 
              className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground tracking-tight mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={isHeaderInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              Everything your
              <br />
              <span className="text-primary">
                car needs.
              </span>
            </motion.h2>

            <motion.p 
              className="text-base lg:text-lg text-muted-foreground leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={isHeaderInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              From routine maintenance to complex repairs, our expert mechanics 
              deliver quality service at transparent prices.
            </motion.p>
          </div>
          
          {/* View All Button - Desktop */}
          <motion.button 
            onClick={handleViewAll}
            className="hidden md:flex items-center gap-2 px-6 py-3 bg-foreground text-background rounded-full text-sm font-semibold hover:opacity-90 transition-all group"
            initial={{ opacity: 0, x: 20 }}
            animate={isHeaderInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            View All Services
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </motion.button>
        </motion.div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-6">
          {displayedServices.map((service, index) => (
            <ServiceCard key={service.id} service={service} index={index} />
          ))}
        </div>

        {/* View All Button - Mobile & Tablet */}
        {hasMoreServices && (
          <motion.div 
            className="mt-10 text-center md:hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ delay: 0.5 }}
          >
            <motion.button 
              onClick={handleViewAll}
              className="inline-flex items-center gap-2 px-8 py-4 bg-foreground text-background rounded-full font-semibold hover:opacity-90 transition-all group"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              View All {services.length} Services
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </motion.button>
          </motion.div>
        )}

        {/* Quick Stats */}
        {/* <motion.div 
          className="mt-12 lg:mt-16 grid grid-cols-2 md:grid-cols-4 gap-4"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ delay: 0.6 }}
        >
          {[
            { icon: Wrench, value: '500+', label: 'Expert Mechanics' },
            { icon: Car, value: '50,000+', label: 'Cars Serviced' },
            { icon: Gauge, value: '40%', label: 'Avg Savings' },
            { icon: Sparkles, value: '4.8★', label: 'Customer Rating' },
          ].map((stat, idx) => (
            <motion.div
              key={idx}
              className="text-center p-4 sm:p-5 bg-card rounded-2xl border border-border"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ delay: 0.7 + idx * 0.1 }}
              whileHover={{ y: -3 }}
            >
              <div className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-2 sm:mb-3 rounded-xl bg-primary/10 flex items-center justify-center">
                <stat.icon className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
              </div>
              <p className="text-xl sm:text-2xl font-bold text-foreground">{stat.value}</p>
              <p className="text-xs sm:text-sm text-muted-foreground">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div> */}
      </div>
    </section>
  );
};