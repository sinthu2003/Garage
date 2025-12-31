import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { ArrowUpRight, Check, Wrench } from 'lucide-react';
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

  const imageUrl = serviceImages[service.title] || serviceImages['default'];

  const directions = [
    { x: -40, y: 20 },
    { x: 0, y: 40 },
    { x: 40, y: 20 },
    { x: 0, y: 40 },
  ];
  const dir = directions[index % 4];

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, x: dir.x, y: dir.y }}
      animate={isInView ? { opacity: 1, x: 0, y: 0 } : { opacity: 0, x: dir.x, y: dir.y }}
      transition={{ 
        duration: 0.5, 
        delay: index * 0.08,
        ease: [0.25, 0.46, 0.45, 0.94]
      }}
      whileHover={{ 
        y: -12,
        transition: { duration: 0.3 }
      }}
      className="group relative bg-card rounded-2xl sm:rounded-3xl overflow-hidden cursor-pointer shadow-sm hover:shadow-2xl transition-shadow duration-300 border border-border"
    >
      {/* Image Section */}
      <div className="relative h-36 sm:h-44 overflow-hidden">
        <motion.img 
          src={imageUrl}
          alt={service.title}
          className="w-full h-full object-cover"
          whileHover={{ scale: 1.08 }}
          transition={{ duration: 0.4 }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        
        {/* Wrench Icon */}
        <motion.div
          className="absolute top-3 left-3 w-8 h-8 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.5 }}
          transition={{ delay: index * 0.08 + 0.2, duration: 0.3 }}
        >
          <Wrench className="w-4 h-4 text-white" />
        </motion.div>
        
        {/* Discount Badge - Uses theme success color */}
        {service.originalPrice && service.price && (
          <motion.div 
            className="absolute top-3 right-3"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.5 }}
            transition={{ delay: index * 0.08 + 0.25, duration: 0.3 }}
          >
            <span className="px-2.5 py-1 bg-green-500 text-white text-xs font-bold rounded-full shadow-lg">
              {Math.round(((service.originalPrice - service.price) / service.originalPrice) * 100)}% OFF
            </span>
          </motion.div>
        )}
        
        {/* Service Title */}
        <motion.div 
          className="absolute bottom-3 left-3 right-3"
          initial={{ opacity: 0, y: 10 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
          transition={{ delay: index * 0.08 + 0.15, duration: 0.3 }}
        >
          <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight">
            {service.title}
          </h3>
        </motion.div>
      </div>
      
      {/* Content */}
      <div className="p-4 sm:p-5">
        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed line-clamp-2 mb-3">
          {service.description}
        </p>

        {/* Features */}
        <ul className="space-y-2 mb-4">
          {service.features.slice(0, 3).map((feature, i) => (
            <motion.li 
              key={i} 
              className="flex items-center gap-2 text-xs sm:text-sm text-foreground"
              initial={{ opacity: 0, x: -10 }}
              animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -10 }}
              transition={{ delay: index * 0.08 + 0.3 + i * 0.05, duration: 0.3 }}
            >
              <div className="w-4 h-4 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center flex-shrink-0">
                <Check size={10} className="text-green-600 dark:text-green-400" strokeWidth={3} />
              </div>
              <span className="line-clamp-1">{feature}</span>
            </motion.li>
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
          
          {/* Arrow Button - Uses theme primary */}
          <motion.button 
            className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-secondary flex items-center justify-center text-muted-foreground group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <ArrowUpRight size={18} />
          </motion.button>
        </div>
      </div>

      {/* Hover Border Glow - Uses theme primary */}
      <div className="absolute inset-0 rounded-2xl sm:rounded-3xl border-2 border-transparent group-hover:border-primary/30 transition-colors duration-300 pointer-events-none" />
    </motion.div>
  );
};