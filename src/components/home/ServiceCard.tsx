import { useRef, memo } from 'react';
import { motion, useInView } from 'framer-motion';
import { ArrowUpRight, Check, Clock, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Service type definition
interface Service {
  id: string;
  title: string;
  description: string;
  icon?: string;
  price: number;
  originalPrice: number;
  image: string;
  features: string[];
  category?: string;
  duration?: string;
  warranty?: string;
  gallery?: string[]; // 👈 Add this optional property
}

interface ServiceCardProps {
  service: Service;
  index: number;
}

// Memoized feature item to prevent re-renders
const FeatureItem = memo(({ feature }: { feature: string }) => (
  <li className="flex items-center gap-2 text-xs sm:text-sm text-foreground">
    <div className="w-4 h-4 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center flex-shrink-0">
      <Check size={10} className="text-green-600 dark:text-green-400" strokeWidth={3} />
    </div>
    <span className="line-clamp-1">{feature}</span>
  </li>
));

FeatureItem.displayName = 'FeatureItem';

export const ServiceCard = memo(({ service, index }: ServiceCardProps) => {
  const cardRef = useRef(null);
  const isInView = useInView(cardRef, { once: true, amount: 0.15 });
  const navigate = useNavigate();

  // Use image from service data (from siteContent.json)
  const imageUrl = service.image;

  // Create URL-friendly slug from service title
  const serviceSlug = service.title.toLowerCase().replace(/\s+/g, '-').replace(/&/g, 'and');

  const handleCardClick = () => {
    navigate(`/services/${serviceSlug}`, { state: { service } });
  };

 const handleBookNow = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate('/', { state: { scrollToBooking: true, selectedService: service } });
  };

  // Pre-calculate discount
  const discountPercent = service.originalPrice && service.price 
    ? Math.round(((service.originalPrice - service.price) / service.originalPrice) * 100)
    : null;

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ 
        duration: 0.5, 
        delay: Math.min(index * 0.08, 0.4),
        ease: [0.25, 0.1, 0.25, 1]
      }}
      whileHover={{ y: -8 }}
      onClick={handleCardClick}
      className="group relative bg-card rounded-2xl sm:rounded-3xl overflow-hidden cursor-pointer shadow-sm hover:shadow-xl border border-border"
      style={{ 
        willChange: isInView ? 'auto' : 'transform, opacity',
        contain: 'layout style paint'
      }}
    >
      {/* Image Section */}
      <div className="relative h-40 sm:h-48 overflow-hidden">
        <motion.div
          className="w-full h-full"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          <img 
            src={imageUrl}
            alt={service.title}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover"
            style={{ willChange: 'transform' }}
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.onerror = null;
              // Fallback to a placeholder gradient
              target.style.display = 'none';
              target.parentElement!.innerHTML = `
                <div class="w-full h-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                  <span class="text-4xl">🔧</span>
                </div>
              `;
            }}
          />
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent pointer-events-none" />
        
        {/* Quick Info Badges */}
        <div className="absolute top-3 left-3 flex gap-2">
          <span className="px-2 py-1 bg-white/20 backdrop-blur-sm text-white text-[10px] sm:text-xs rounded-full flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {service.duration || '2-4 hrs'}
          </span>
        </div>
        
        {/* Discount Badge */}
        {discountPercent && discountPercent > 0 && (
          <motion.div 
            className="absolute top-3 right-3"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.5 }}
            transition={{ delay: Math.min(index * 0.08 + 0.2, 0.6), type: "spring", stiffness: 200 }}
          >
            <span className="px-2.5 py-1 bg-green-500 text-white text-xs font-bold rounded-full shadow-lg">
              {discountPercent}% OFF
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
            {service.warranty || '6 months warranty'}
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
            <FeatureItem key={i} feature={feature} />
          ))}
        </ul>

        {/* Pricing Footer */}
        <div className="flex items-end justify-between pt-3 border-t border-border">
          <div>
            {service.originalPrice && service.originalPrice > service.price && (
              <span className="text-xs text-muted-foreground line-through block">
                ₹{service.originalPrice?.toLocaleString()}
              </span>
            )}
            <div className="flex items-baseline gap-1">
              <span className="text-xl sm:text-2xl font-bold text-foreground">
                {service.price === 0 ? 'Free' : `₹${service.price?.toLocaleString()}`}
              </span>
              {service.price > 0 && (
                <span className="text-xs text-muted-foreground">onwards</span>
              )}
            </div>
          </div>
          
          {/* Book Now Button */}
          <motion.button 
            onClick={handleBookNow}
            className="px-4 py-2 rounded-full bg-primary text-primary-foreground text-xs sm:text-sm font-semibold flex items-center gap-1.5 hover:opacity-90"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
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
});

ServiceCard.displayName = 'ServiceCard';