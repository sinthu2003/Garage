import { useRef } from 'react';
import { ServiceCard } from './ServiceCard';
import { motion, useInView } from 'framer-motion';
import { ArrowRight, Settings, Wrench, Car } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useContent } from '../../admin-portal';

export const ServiceGrid = () => {
  const sectionRef = useRef(null);
  const headerRef = useRef(null);
  const isHeaderInView = useInView(headerRef, { once: true, margin: "-50px" });
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });
  const navigate = useNavigate();

  // [FIX] Get services from API (with resolved images) first, fallback to legacy content
  const { content, services: apiServices } = useContent();
  const servicesContent = content.services;

  // [FIX] Prefer API services (images already resolved), fallback to legacy content.services.items
  const allServices = (apiServices && apiServices.length > 0) 
    ? apiServices 
    : servicesContent.items;

  // Safety check and limit to 8 items for homepage
  const items = allServices || [];
  const displayedServices = items.slice(0, 8);

  if (!items.length) {
    return <div className="text-center p-4">No services available.</div>;
  }
  
  const hasMoreServices = items.length > 8;

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
              {servicesContent.badge}
            </motion.span>

            {/* Title */}
            <motion.h2 
              className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground tracking-tight mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={isHeaderInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              {servicesContent.headline.line1}
              <br />
              <span className="text-primary">
                {servicesContent.headline.highlight}
              </span>
            </motion.h2>

            <motion.p 
              className="text-base lg:text-lg text-muted-foreground leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={isHeaderInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              {servicesContent.description}
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
            {servicesContent.viewAllCta}
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </motion.button>
        </motion.div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-6">
          {displayedServices.map((service: any, index: number) => (
            <ServiceCard 
              key={service._id || service.id || index} 
              service={{
                id: String(service._id || service.id),
                title: service.title,
                description: service.description,
                icon: service.icon || 'Settings',
                price: service.price,
                originalPrice: service.originalPrice,
                image: service.image,
                features: service.features || [],
                category: service.category || 'maintenance',
                duration: service.duration,
                warranty: service.warranty,
                gallery: service.gallery || [],
              }} 
              index={index} 
            />
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
              View All {items.length} Services
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </motion.button>
          </motion.div>
        )}
      </div>
    </section>
  );
};