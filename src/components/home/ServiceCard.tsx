import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { ArrowUpRight, Check, Clock, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { Service } from '../../types';

interface ServiceCardProps {
  service: Service;
  index: number;
}

const serviceImages: Record<string, string> = {
  'Periodic Service': 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=400&h=300&fit=crop',
  'AC Service & Repair': 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400&h=300&fit=crop',
  'Denting & Painting': 'https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?w=400&h=300&fit=crop',
  'Car Inspection': 'https://images.unsplash.com/photo-1632823471565-1ecdf5c6da20?w=400&h=300&fit=crop',
  'Wheel Care': 'https://images.unsplash.com/photo-1578844251758-2f71da64c96f?w=400&h=300&fit=crop',
  'Battery Service': 'https://images.unsplash.com/photo-1620714223084-8fcacc6dfd8d?w=400&h=300&fit=crop',
  'Clutch & Body': 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=400&h=300&fit=crop',
  'Insurance Claims': 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=400&h=300&fit=crop',
  'default': 'https://images.unsplash.com/photo-1625047509248-ec889cbff17f?w=400&h=300&fit=crop'
};

export const ServiceCard = ({ service, index }: ServiceCardProps) => {
  const cardRef = useRef(null);
  const isInView = useInView(cardRef, { once: true, margin: "-80px" });
  const navigate = useNavigate();

  const imageUrl = serviceImages[service.title] || serviceImages['default'];

  // Create URL-friendly slug from service title
  const serviceSlug = service.title.toLowerCase().replace(/\s+/g, '-').replace(/&/g, 'and');

  const handleCardClick = () => {
    navigate(`/services/${serviceSlug}`, { state: { service } });
  };

  const handleBookNow = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Scroll to booking widget or open booking modal
    const bookingWidget = document.getElementById('booking-widget');
    if (bookingWidget) {
      bookingWidget.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      whileHover={{ y: -8 }}
      onClick={handleCardClick}
      className="group relative bg-card rounded-2xl sm:rounded-3xl overflow-hidden cursor-pointer shadow-sm hover:shadow-xl transition-all duration-300 border border-border"
    >
      {/* Image Section */}
      <div className="relative h-40 sm:h-48 overflow-hidden">
        <motion.img 
          src={imageUrl}
          alt={service.title}
          className="w-full h-full object-cover"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.4 }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        
        {/* Quick Info Badges */}
        <div className="absolute top-3 left-3 flex gap-2">
          <span className="px-2 py-1 bg-white/20 backdrop-blur-sm text-white text-[10px] sm:text-xs rounded-full flex items-center gap-1">
            <Clock className="w-3 h-3" />
            2-4 hrs
          </span>
        </div>
        
        {/* Discount Badge */}
        {service.originalPrice && service.price && (
          <motion.div 
            className="absolute top-3 right-3"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.5 }}
            transition={{ delay: index * 0.08 + 0.2 }}
          >
            <span className="px-2.5 py-1 bg-green-500 text-white text-xs font-bold rounded-full shadow-lg">
              {Math.round(((service.originalPrice - service.price) / service.originalPrice) * 100)}% OFF
            </span>
          </motion.div>
        )}
        
        {/* Service Title */}
        <div className="absolute bottom-3 left-3 right-3">
          <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight">
            {service.title}
          </h3>
          <p className="text-white/70 text-xs mt-0.5 flex items-center gap-1">
            <Shield className="w-3 h-3" />
            6 months warranty
          </p>
        </div>
      </div>
      
      {/* Content */}
      <div className="p-4 sm:p-5">
        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed line-clamp-2 mb-3">
          {service.description}
        </p>

        {/* Features */}
        <ul className="space-y-1.5 mb-4">
          {service.features.slice(0, 3).map((feature, i) => (
            <li 
              key={i} 
              className="flex items-center gap-2 text-xs sm:text-sm text-foreground"
            >
              <div className="w-4 h-4 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center flex-shrink-0">
                <Check size={10} className="text-green-600 dark:text-green-400" strokeWidth={3} />
              </div>
              <span className="line-clamp-1">{feature}</span>
            </li>
          ))}
        </ul>

        {/* Pricing Footer */}
        <div className="flex items-end justify-between pt-3 border-t border-border">
          <div>
            {service.originalPrice && (
              <span className="text-xs text-muted-foreground line-through block">
                ₹{service.originalPrice?.toLocaleString()}
              </span>
            )}
            <div className="flex items-baseline gap-1">
              <span className="text-xl sm:text-2xl font-bold text-foreground">
                ₹{service.price?.toLocaleString()}
              </span>
              <span className="text-xs text-muted-foreground">onwards</span>
            </div>
          </div>
          
          {/* Book Now Button */}
          <motion.button 
            onClick={handleBookNow}
            className="px-4 py-2 rounded-full bg-primary text-primary-foreground text-xs sm:text-sm font-semibold flex items-center gap-1.5 hover:opacity-90 transition-all"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Book Now
            <ArrowUpRight size={14} />
          </motion.button>
        </div>
      </div>

      {/* View Details Hint */}
      <div className="absolute inset-0 flex items-center justify-center bg-primary/0 group-hover:bg-primary/5 transition-colors pointer-events-none">
        <motion.span 
          className="px-4 py-2 bg-foreground text-background rounded-full text-sm font-semibold opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300"
        >
          View Details →
        </motion.span>
      </div>
    </motion.div>
  );
};