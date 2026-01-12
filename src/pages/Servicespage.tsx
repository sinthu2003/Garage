import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  ArrowRight,
  Check,
  Clock,
  Shield,
  Wrench,
  Sparkles,
  Settings,
  Paintbrush,
  Gauge,
  Phone,
  X
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useContent } from '../admin-portal';

// Service categories with icons
const defaultCategories = [
  { id: 'all', label: 'All', icon: 'Sparkles' },
  { id: 'maintenance', label: 'Maintenance', icon: 'Wrench' },
  { id: 'repair', label: 'Repairs', icon: 'Settings' },
  { id: 'cosmetic', label: 'Cosmetic', icon: 'Paintbrush' },
  { id: 'inspection', label: 'Inspection', icon: 'Gauge' },
];

// Icon mapping
const iconMap: Record<string, React.FC<{ className?: string }>> = {
  Sparkles,
  Wrench,
  Settings,
  Paintbrush,
  Gauge,
};

// Map services to categories (fallback if category not in JSON)
const serviceCategoryMap: Record<string, string> = {
  'Periodic Service': 'maintenance',
  'AC Service & Repair': 'repair',
  'Denting & Painting': 'cosmetic',
  'Car Inspection': 'inspection',
  'Wheel Care': 'maintenance',
  'Battery Service': 'repair',
  'Clutch & Body': 'repair',
  'Insurance Claims': 'inspection',
};

export const ServicesPage = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const sectionRef = useRef(null);
  const navigate = useNavigate();

  // Get content from context - images are already resolved by ContentContext
  const { content } = useContent();
  const services = content.services.items;
  const globalContent = content.global;
  const pagesContent = content.pages?.services;

  // Use categories from CMS or fallback to defaults
  const categories = pagesContent?.categories || defaultCategories;

  // Filter services based on category and search
  const filteredServices = services.filter(service => {
    // Use category from JSON if available, otherwise fallback to serviceCategoryMap
    const serviceCategory = service.category || serviceCategoryMap[service.title];
    const matchesCategory = activeCategory === 'all' || serviceCategory === activeCategory;
    const matchesSearch = service.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleServiceClick = (service: typeof services[0]) => {
    const serviceSlug = service.title.toLowerCase().replace(/\s+/g, '-').replace(/&/g, 'and');
    navigate(`/services/${serviceSlug}`, { state: { service } });
  };

  const handleBookNow = (e: React.MouseEvent, service: typeof services[0]) => {
    e.stopPropagation();
    navigate('/', { state: { scrollToBooking: true, selectedService: service } });
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      {/* Compact Header Section */}
      <section className="pt-24 sm:pt-28 pb-6 sm:pb-8 bg-white dark:bg-gray-950">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
            <a href="/" className="hover:text-primary transition-colors">Home</a>
            <span>/</span>
            <span className="text-foreground font-medium">Services</span>
          </div>

          {/* Title & Search Row */}
          <div className="flex flex-col items-center text-center gap-6 sm:gap-8">
            <div className="max-w-3xl mx-auto">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground tracking-tight mb-4">
                {pagesContent?.title || 'Our Services'}
              </h1>
              <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto">
                {pagesContent?.description || 'Professional car care services at transparent prices'}
              </p>
            </div>

            {/* Search Bar - Centered */}
            <div className="relative w-full max-w-md mx-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                placeholder={pagesContent?.searchPlaceholder || 'Search services...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-12 py-3.5 bg-background border border-border rounded-full text-base text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all shadow-sm hover:shadow-md"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-1.5 hover:bg-secondary rounded-full transition-colors"
                >
                  <X className="w-4 h-4 text-muted-foreground" />
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Category Filters - Sticky */}
      <div className="sticky top-16 z-30 bg-white dark:bg-gray-950 border-b border-border py-3">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {categories.map((cat: { id: string; label: string; icon?: string }) => {
              const IconComponent = iconMap[cat.icon || 'Sparkles'] || Sparkles;
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${isActive
                      ? 'bg-primary text-primary-foreground shadow-sm'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-200'
                    }`}
                >
                  <IconComponent className="w-4 h-4" />
                  {cat.label}
                </button>
              );
            })}

            {/* Results count */}
            <span className="ml-auto text-sm text-muted-foreground whitespace-nowrap pl-4">
              {filteredServices.length} services
            </span>
          </div>
        </div>
      </div>

      {/* Services Grid Section */}
      <section ref={sectionRef} className="py-6 sm:py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          {/* Services Grid - Original cards with features */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            <AnimatePresence mode="popLayout">
              {filteredServices.map((service, index) => {
                // Use image from siteContent.json (already resolved by ContentContext)
                const imageUrl = service.image || '';

                return (
                  <motion.div
                    key={service.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    onClick={() => handleServiceClick(service)}
                    className="group bg-card rounded-2xl sm:rounded-3xl overflow-hidden cursor-pointer shadow-sm hover:shadow-xl transition-all duration-300 border border-border"
                  >
                    {/* Image */}
                    <div className="relative h-48 sm:h-56 overflow-hidden">
                      <motion.img
                        src={imageUrl}
                        alt={service.title}
                        className="w-full h-full object-cover"
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.4 }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                      {/* Badges */}
                      <div className="absolute top-4 left-4 flex gap-2">
                        <span className="px-3 py-1.5 bg-white/20 backdrop-blur-sm text-white text-xs rounded-full flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5" />
                          {service.duration || '2-4 hrs'}
                        </span>
                        <span className="px-3 py-1.5 bg-white/20 backdrop-blur-sm text-white text-xs rounded-full flex items-center gap-1.5">
                          <Shield className="w-3.5 h-3.5" />
                          {service.warranty || 'Warranty'}
                        </span>
                      </div>

                      {/* Discount */}
                      {service.originalPrice && service.price && (
                        <div className="absolute top-4 right-4">
                          <span className="px-3 py-1.5 bg-green-500 text-white text-xs font-bold rounded-full">
                            {Math.round(((service.originalPrice - service.price) / service.originalPrice) * 100)}% OFF
                          </span>
                        </div>
                      )}

                      {/* Title Overlay */}
                      <div className="absolute bottom-4 left-4 right-4">
                        <h3 className="text-xl sm:text-2xl font-bold text-white mb-1">
                          {service.title}
                        </h3>
                        <p className="text-white/70 text-sm line-clamp-1">
                          {service.description}
                        </p>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-5 sm:p-6">
                      {/* Features */}
                      <ul className="space-y-2 mb-5">
                        {service.features.slice(0, 4).map((feature, i) => (
                          <li key={i} className="flex items-center gap-2 text-sm text-foreground">
                            <div className="w-5 h-5 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center flex-shrink-0">
                              <Check size={12} className="text-green-600 dark:text-green-400" strokeWidth={3} />
                            </div>
                            <span className="line-clamp-1">{feature}</span>
                          </li>
                        ))}
                      </ul>

                      {/* Footer */}
                      <div className="flex items-end justify-between pt-4 border-t border-border">
                        <div>
                          {service.originalPrice && (
                            <span className="text-sm text-muted-foreground line-through block">
                              ₹{service.originalPrice?.toLocaleString()}
                            </span>
                          )}
                          <div className="flex items-baseline gap-1">
                            <span className="text-2xl sm:text-3xl font-bold text-foreground">
                              ₹{service.price?.toLocaleString()}
                            </span>
                            <span className="text-sm text-muted-foreground">onwards</span>
                          </div>
                        </div>

                        <motion.button
                          onClick={(e) => handleBookNow(e, service)}
                          className="px-5 py-2.5 bg-primary text-primary-foreground rounded-full text-sm font-semibold flex items-center gap-2 hover:opacity-90 transition-all"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          Book Now
                          <ArrowRight className="w-4 h-4" />
                        </motion.button>
                      </div>
                    </div>


                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          {/* No Results */}
          {filteredServices.length === 0 && (
            <motion.div
              className="text-center py-16"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-secondary flex items-center justify-center">
                <Search className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">No services found</h3>
              <p className="text-muted-foreground">Try adjusting your search or filter criteria</p>
              <button
                onClick={() => { setSearchQuery(''); setActiveCategory('all'); }}
                className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-full text-sm font-medium"
              >
                Clear filters
              </button>
            </motion.div>
          )}
        </div>
      </section>

      {/* CTA Section - Now using CMS content */}
      <section className="py-16 sm:py-20 bg-secondary">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-4">
              {pagesContent?.cta?.title || pagesContent?.ctaSection?.title || "Can't find what you're looking for?"}
            </h2>
            <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
              {pagesContent?.cta?.description || pagesContent?.ctaSection?.description || "Contact us for custom service requirements. Our experts are ready to help with any car-related needs."}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {/* Primary CTA Button - Now using CMS content */}
              <motion.button
                className="px-8 py-4 bg-primary text-primary-foreground rounded-full font-semibold flex items-center justify-center gap-2"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                {pagesContent?.cta?.primaryButton || pagesContent?.cta?.primaryCta || pagesContent?.ctaSection?.primaryCta || 'Get Free Quote'}
                <ArrowRight className="w-5 h-5" />
              </motion.button>

              {/* Secondary CTA Button - Now using CMS content */}
              <motion.a
                href={`tel:${pagesContent?.cta?.phone || globalContent.brand.phone}`}
                className="px-8 py-4 bg-secondary text-foreground rounded-full font-semibold border border-border hover:border-primary/30 transition-colors flex items-center justify-center gap-2"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <Phone className="w-5 h-5" />
                {pagesContent?.cta?.secondaryCta || pagesContent?.ctaSection?.secondaryCta || `Call: ${pagesContent?.cta?.phone || globalContent.brand.phone}`}
              </motion.a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Custom scrollbar hide */}
      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default ServicesPage;