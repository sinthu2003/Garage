import { useState, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import {
  X,
  ChevronLeft,
  ChevronRight,
  Camera,
  Wrench,
  Car,
  Sparkles,
  Image,
  Warehouse
} from 'lucide-react';
import { useContent } from '../../admin-portal';

// Icon mapping for stats
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Wrench,
  Car,
  Camera,
  Sparkles,
  Image,
  Warehouse
};

export const GallerySection = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedImage, setSelectedImage] = useState<number | string | null>(null);
  const sectionRef = useRef(null);
  const headerRef = useRef(null);
  const isHeaderInView = useInView(headerRef, { once: true, margin: "-50px" });
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  // Get content from context
  const { content } = useContent();
  const galleryContent = content.gallery;
  const categories = galleryContent.categories;
  const galleryImages = galleryContent.images;
  const stats = galleryContent.stats;

  const filteredImages = activeCategory === 'all'
    ? galleryImages
    : galleryImages.filter(img => img.category === activeCategory);

  const handlePrev = () => {
    if (selectedImage !== null) {
      const currentIndex = filteredImages.findIndex(img => img.id === selectedImage);
      const prevIndex = currentIndex === 0 ? filteredImages.length - 1 : currentIndex - 1;
      setSelectedImage(filteredImages[prevIndex].id);
    }
  };

  const handleNext = () => {
    if (selectedImage !== null) {
      const currentIndex = filteredImages.findIndex(img => img.id === selectedImage);
      const nextIndex = currentIndex === filteredImages.length - 1 ? 0 : currentIndex + 1;
      setSelectedImage(filteredImages[nextIndex].id);
    }
  };

  const selectedImageData = galleryImages.find(img => img.id === selectedImage);

  return (
    <section ref={sectionRef} className="py-16 sm:py-20 lg:py-28 bg-gray-50 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full opacity-30"
          style={{ background: 'radial-gradient(circle, rgba(255,87,51,0.08) 0%, transparent 70%)' }}
          animate={isInView ? { scale: [1, 1.2, 1], rotate: [0, 90, 0] } : {}}
          transition={{ duration: 20, repeat: Infinity }}
        />

        {/* Floating Camera Icons */}
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-orange-200"
            style={{ left: `${10 + i * 20}%`, top: `${15 + (i % 3) * 25}%` }}
            animate={isInView ? {
              y: [0, -20, 0],
              rotate: [0, 10, -10, 0],
              opacity: [0.3, 0.6, 0.3]
            } : {}}
            transition={{ duration: 5, repeat: Infinity, delay: i * 0.4 }}
          >
            <Camera size={30 + i * 8} />
          </motion.div>
        ))}
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl relative z-10">
        {/* Header */}
        <motion.div
          ref={headerRef}
          className="text-center max-w-2xl mx-auto mb-10 sm:mb-14"
        >
          <motion.span
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-xs font-semibold uppercase tracking-wider mb-4"
            initial={{ opacity: 0, y: -20, scale: 0.8 }}
            animate={isHeaderInView ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: -20, scale: 0.8 }}
            transition={{ type: "spring" }}
          >
            <motion.div animate={{ rotate: [0, 360] }} transition={{ duration: 3, repeat: Infinity, ease: "linear" }}>
              <Camera className="w-4 h-4" />
            </motion.div>
            {galleryContent.badge}
          </motion.span>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 tracking-tight mb-4 sm:mb-6">
            {galleryContent.headline.line1.split('').map((char, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, y: 50 }}
                animate={isHeaderInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
                transition={{ delay: i * 0.03 }}
              >
                {char}
              </motion.span>
            ))}
            {' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/60">
              {galleryContent.headline.highlight.split('').map((char, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, y: 50, rotate: -10 }}
                  animate={isHeaderInView ? { opacity: 1, y: 0, rotate: 0 } : { opacity: 0, y: 50, rotate: -10 }}
                  transition={{ delay: 0.3 + i * 0.05, type: "spring" }}
                >
                  {char}
                </motion.span>
              ))}
            </span>
          </h2>

          <motion.p
            className="text-gray-500 text-base sm:text-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={isHeaderInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ delay: 0.5 }}
          >
            {galleryContent.description}
          </motion.p>

          {/* Animated Underline */}
          <motion.div
            className="mt-6 mx-auto h-1 rounded-full bg-gradient-to-r from-primary to-primary/60"
            initial={{ width: 0 }}
            animate={isHeaderInView ? { width: 120 } : { width: 0 }}
            transition={{ delay: 0.7, duration: 0.6 }}
          />
        </motion.div>

        {/* Category Filters */}
        <motion.div
          className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={isHeaderInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ delay: 0.5 }}
        >
          {categories.map((cat, idx) => (
            <motion.button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 sm:px-6 py-2 sm:py-2.5 rounded-full text-sm font-semibold transition-all ${activeCategory === cat.id
                  ? 'bg-gradient-to-r from-primary to-primary text-white shadow-lg shadow-primary/30'
                  : 'bg-white text-gray-600 border border-gray-200 hover:border-primary/30 hover:text-primary'
                }`}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={isHeaderInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
              transition={{ delay: 0.6 + idx * 0.1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {cat.label}
            </motion.button>
          ))}
        </motion.div>

        {/* Gallery Grid */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4"
          layout
        >
          <AnimatePresence mode="popLayout">
            {filteredImages.map((image, index) => (
              <motion.div
                key={image.id}
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className={`relative group cursor-pointer overflow-hidden rounded-xl sm:rounded-2xl ${index === 0 || index === 5 ? 'md:col-span-2 md:row-span-2' : ''
                  }`}
                onClick={() => setSelectedImage(image.id)}
                whileHover={{ scale: 1.02 }}
              >
                <div className={`relative overflow-hidden ${index === 0 || index === 5 ? 'h-64 sm:h-80 md:h-full' : 'h-40 sm:h-48'
                  }`}>
                  <motion.img
                    src={image.src}
                    alt={image.alt}
                    className="w-full h-full object-cover"
                    initial={{ scale: 1.2 }}
                    whileInView={{ scale: 1 }}
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.6 }}
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.onerror = null;
                      target.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"><rect fill="%23f3f4f6" width="400" height="300"/><text fill="%239ca3af" font-family="Arial" font-size="14" x="50%" y="50%" text-anchor="middle" dy=".3em">Image not available</text></svg>';
                    }}
                  />

                  {/* Overlay */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  />

                  {/* Content */}
                  <motion.div
                    className="absolute bottom-0 left-0 right-0 p-4 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300"
                  >
                    <h4 className="font-bold text-sm sm:text-base mb-1">{image.title}</h4>
                    <p className="text-white/80 text-xs sm:text-sm">{image.description}</p>
                  </motion.div>

                  {/* View Icon */}
                  <motion.div
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 scale-50 group-hover:scale-100"
                  >
                    <Sparkles className="w-6 h-6 text-white" />
                  </motion.div>

                  {/* Category Badge */}
                  <div className="absolute top-3 left-3">
                    <span className="px-2 py-1 bg-black/50 backdrop-blur-sm text-white text-[10px] sm:text-xs rounded-full capitalize">
                      {image.category.replace('-', ' ')}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Stats Row */}
        <motion.div
          className="mt-12 sm:mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ delay: 0.8 }}
        >
          {stats.map((stat, idx) => {
            const IconComponent = iconMap[stat.icon] || Sparkles;
            
            return (
              <motion.div
                key={idx}
                className="text-center p-4 sm:p-6 bg-white rounded-2xl border border-gray-100 hover:border-primary/20 hover:shadow-lg transition-all"
                initial={{ opacity: 0, y: 20, scale: 0.9 }}
                animate={isInView ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 20, scale: 0.9 }}
                transition={{ delay: 0.9 + idx * 0.1, type: "spring" }}
                whileHover={{ scale: 1.05, y: -5 }}
              >
                <motion.div
                  className="w-12 h-12 mx-auto mb-3 rounded-xl bg-primary/10 flex items-center justify-center"
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.5 }}
                >
                  <IconComponent className="w-6 h-6 text-primary" />
                </motion.div>
                <motion.p
                  className="text-2xl sm:text-3xl font-bold text-gray-900"
                  initial={{ scale: 0 }}
                  animate={isInView ? { scale: 1 } : { scale: 0 }}
                  transition={{ delay: 1 + idx * 0.1, type: "spring" }}
                >
                  {stat.value}
                </motion.p>
                <p className="text-gray-500 text-sm">{stat.label}</p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedImage !== null && selectedImageData && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImage(null)}
          >
            {/* Close Button */}
            <motion.button
              className="absolute top-4 right-4 w-12 h-12 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-colors z-10"
              onClick={() => setSelectedImage(null)}
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
            >
              <X className="w-6 h-6" />
            </motion.button>

            {/* Navigation */}
            <motion.button
              className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-colors"
              onClick={(e) => { e.stopPropagation(); handlePrev(); }}
              whileHover={{ scale: 1.1, x: -5 }}
              whileTap={{ scale: 0.9 }}
            >
              <ChevronLeft className="w-6 h-6" />
            </motion.button>

            <motion.button
              className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-colors"
              onClick={(e) => { e.stopPropagation(); handleNext(); }}
              whileHover={{ scale: 1.1, x: 5 }}
              whileTap={{ scale: 0.9 }}
            >
              <ChevronRight className="w-6 h-6" />
            </motion.button>

            {/* Image */}
            <motion.div
              className="max-w-5xl max-h-[85vh] relative"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={selectedImageData.src}
                alt={selectedImageData.alt}
                className="max-w-full max-h-[75vh] object-contain rounded-2xl"
              />
              <motion.div
                className="mt-4 text-center text-white"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <h3 className="text-xl font-bold mb-1">{selectedImageData.title}</h3>
                <p className="text-white/70">{selectedImageData.description}</p>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};