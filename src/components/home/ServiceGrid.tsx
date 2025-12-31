import { useRef } from 'react';
import { services } from '../../utils/data';
import { ServiceCard } from './ServiceCard';
import { motion, useInView } from 'framer-motion';
import { ArrowRight, Settings, Wrench, Car, Gauge } from 'lucide-react';

export const ServiceGrid = () => {
  const sectionRef = useRef(null);
  const headerRef = useRef(null);
  const isHeaderInView = useInView(headerRef, { once: true, margin: "-50px" });
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  const floatingIcons = [
    { Icon: Wrench, position: 'left-[5%] top-[15%]', size: 'w-8 h-8', delay: 0 },
    { Icon: Car, position: 'right-[8%] top-[20%]', size: 'w-10 h-10', delay: 0.2 },
    { Icon: Gauge, position: 'left-[8%] bottom-[20%]', size: 'w-7 h-7', delay: 0.4 },
    { Icon: Settings, position: 'right-[5%] bottom-[25%]', size: 'w-9 h-9', delay: 0.6 },
  ];

  return (
    <section id="services" ref={sectionRef} className="py-16 lg:py-24 bg-secondary relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Gradient Orb using theme */}
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
        {floatingIcons.map(({ Icon, position, size, delay }, idx) => (
          <motion.div
            key={idx}
            className={`absolute ${position} text-primary/20 hidden lg:block`}
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 0.6, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ delay: delay + 0.3, duration: 0.5 }}
          >
            <Icon className={size} />
          </motion.div>
        ))}
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
          
          <motion.button 
            className="flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-primary transition-colors group"
            initial={{ opacity: 0, x: 20 }}
            animate={isHeaderInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            whileHover={{ x: 5 }}
          >
            View all services
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </motion.button>
        </motion.div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-6">
          {services.map((service, index) => (
            <ServiceCard key={service.id} service={service} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};