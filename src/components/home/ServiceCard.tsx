import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { ArrowUpRight, Check, Wrench } from 'lucide-react';
import type { Service } from '../../types';

interface ServiceCardProps {
  service: Service;
  index: number;
}

// Service images mapping
const serviceImages: Record<string, string> = {
  'Periodic Service': 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=400&h=300&fit=crop',
  'AC Service & Repair': 'https://images.unsplash.com/photo-1635273051427-7c2a37a2c8f9?w=400&h=300&fit=crop',
  'Denting & Painting': 'https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?w=400&h=300&fit=crop',
  'Car Inspection': 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=400&h=300&fit=crop',
  'Wheel Care': 'https://images.unsplash.com/photo-1578844251758-2f71da64c96f?w=400&h=300&fit=crop',
  'Battery Service': 'https://images.unsplash.com/photo-1620714223084-8fcacc6dfd8d?w=400&h=300&fit=crop',
  'Clutch & Body': 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=400&h=300&fit=crop',
  'Insurance Claims': 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=400&h=300&fit=crop',
  'default': 'https://images.unsplash.com/photo-1625047509248-ec889cbff17f?w=400&h=300&fit=crop'
};

export const ServiceCard = ({ service, index }: ServiceCardProps) => {
  const cardRef = useRef(null);
  const isInView = useInView(cardRef, { once: false, margin: "-50px" });

  const imageUrl = serviceImages[service.title] || serviceImages['default'];

  // Different animation directions based on index
  const getAnimationDirection = () => {
    const directions = [
      { x: -100, y: 0, rotate: -10 },
      { x: 0, y: 100, rotate: 5 },
      { x: 100, y: 0, rotate: 10 },
      { x: 0, y: -100, rotate: -5 },
    ];
    return directions[index % 4];
  };

  const direction = getAnimationDirection();

  return (
    <motion.div
      ref={cardRef}
      initial={{ 
        opacity: 0, 
        x: direction.x, 
        y: direction.y, 
        rotateY: direction.rotate,
        scale: 0.8 
      }}
      animate={isInView ? { 
        opacity: 1, 
        x: 0, 
        y: 0, 
        rotateY: 0,
        scale: 1 
      } : { 
        opacity: 0, 
        x: direction.x, 
        y: direction.y, 
        rotateY: direction.rotate,
        scale: 0.8 
      }}
      transition={{
        type: "spring",
        stiffness: 100,
        damping: 20,
        delay: index * 0.1
      }}
      whileHover={{ 
        y: -15, 
        scale: 1.02,
        boxShadow: '0 25px 50px rgba(0,0,0,0.15)'
      }}
      className="group relative bg-white rounded-2xl sm:rounded-3xl overflow-hidden cursor-pointer"
      style={{
        boxShadow: '0 0 0 1px rgba(0,0,0,0.03), 0 2px 40px rgba(0,0,0,0.04)'
      }}
    >
      {/* Image Section */}
      <div className="relative h-36 sm:h-44 overflow-hidden">
        <motion.img 
          src={imageUrl}
          alt={service.title}
          className="w-full h-full object-cover"
          initial={{ scale: 1.3 }}
          animate={isInView ? { scale: 1 } : { scale: 1.3 }}
          transition={{ duration: 0.8 }}
          whileHover={{ scale: 1.15 }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        
        {/* Animated Wrench Icon */}
        <motion.div
          className="absolute top-3 left-3 w-8 h-8 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center"
          initial={{ opacity: 0, rotate: -90 }}
          animate={isInView ? { opacity: 1, rotate: 0 } : { opacity: 0, rotate: -90 }}
          transition={{ delay: 0.3 + index * 0.1 }}
          whileHover={{ rotate: 180 }}
        >
          <Wrench className="w-4 h-4 text-white" />
        </motion.div>
        
        {/* Discount Badge */}
        {service.originalPrice && service.price && (
          <motion.div 
            className="absolute top-3 sm:top-4 right-3 sm:right-4"
            initial={{ scale: 0, rotate: -180 }}
            animate={isInView ? { scale: 1, rotate: 0 } : { scale: 0, rotate: -180 }}
            transition={{ delay: 0.4 + index * 0.1, type: "spring" }}
          >
            <motion.span 
              className="px-2 sm:px-3 py-1 bg-green-500 text-white text-[10px] sm:text-xs font-bold rounded-full shadow-lg"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              {Math.round(((service.originalPrice - service.price) / service.originalPrice) * 100)}% OFF
            </motion.span>
          </motion.div>
        )}
        
        {/* Service Title on Image */}
        <motion.div 
          className="absolute bottom-3 sm:bottom-4 left-3 sm:left-4 right-3 sm:right-4"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ delay: 0.2 + index * 0.1 }}
        >
          <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight drop-shadow-lg">
            {service.title}
          </h3>
        </motion.div>
      </div>
      
      {/* Content */}
      <div className="p-4 sm:p-6">
        {/* Description */}
        <motion.p 
          className="text-xs sm:text-sm text-gray-500 leading-relaxed line-clamp-2 mb-3 sm:mb-4"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ delay: 0.3 + index * 0.1 }}
        >
          {service.description}
        </motion.p>

        {/* Features - Compact */}
        <ul className="space-y-1.5 sm:space-y-2 mb-4 sm:mb-6">
          {service.features.slice(0, 3).map((feature, i) => (
            <motion.li 
              key={i} 
              className="flex items-center gap-2 text-xs sm:text-sm text-gray-600"
              initial={{ opacity: 0, x: -20 }}
              animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
              transition={{ delay: 0.4 + index * 0.1 + i * 0.1 }}
            >
              <motion.div 
                className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0"
                initial={{ scale: 0 }}
                animate={isInView ? { scale: 1 } : { scale: 0 }}
                transition={{ delay: 0.5 + index * 0.1 + i * 0.1, type: "spring" }}
              >
                <Check size={8} className="text-green-600 sm:hidden" strokeWidth={3} />
                <Check size={10} className="text-green-600 hidden sm:block" strokeWidth={3} />
              </motion.div>
              <span className="line-clamp-1">{feature}</span>
            </motion.li>
          ))}
        </ul>

        {/* Pricing Footer */}
        <motion.div 
          className="flex items-end justify-between pt-3 sm:pt-4 border-t border-gray-100"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ delay: 0.5 + index * 0.1 }}
        >
          <div>
            {service.originalPrice && (
              <span className="text-[10px] sm:text-xs text-gray-400 line-through block">
                ₹{service.originalPrice?.toLocaleString()}
              </span>
            )}
            <div className="flex items-baseline gap-1">
              <motion.span 
                className="text-xl sm:text-2xl font-bold text-gray-900"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.5 }}
                transition={{ delay: 0.6 + index * 0.1, type: "spring" }}
              >
                ₹{service.price?.toLocaleString()}
              </motion.span>
              <span className="text-[10px] sm:text-xs text-gray-400">onwards</span>
            </div>
          </div>
          
          {/* Arrow Button */}
          <motion.button 
            className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 group-hover:bg-gradient-to-r group-hover:from-orange-500 group-hover:to-red-500 group-hover:text-white transition-all duration-300"
            whileHover={{ scale: 1.2, rotate: 45 }}
            whileTap={{ scale: 0.9 }}
          >
            <ArrowUpRight size={18} className="sm:hidden" />
            <ArrowUpRight size={20} className="hidden sm:block" />
          </motion.button>
        </motion.div>
      </div>

      {/* Hover Glow Effect */}
      <motion.div
        className="absolute inset-0 rounded-2xl sm:rounded-3xl pointer-events-none"
        initial={{ opacity: 0 }}
        whileHover={{ 
          opacity: 1,
          boxShadow: '0 0 60px rgba(255,87,51,0.2)'
        }}
      />
    </motion.div>
  );
};