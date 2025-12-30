import { useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { ArrowRight, Sparkles, CheckCircle, Star } from 'lucide-react';

// Before/After transformations with realistic car service images
const transformations = [
  {
    id: 1,
    title: 'Denting & Painting',
    car: 'Hyundai Creta',
    before: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=600&q=80',
    after: 'https://images.unsplash.com/photo-1609521263047-28b99b30e646?w=600&q=80',
    description: 'Complete bumper repair and full body paint restoration with color matching',
    time: '2 Days',
    savings: '₹8,000'
  },
  {
    id: 2,
    title: 'Full Car Detailing',
    car: 'Honda City',
    before: 'https://images.unsplash.com/photo-1489824904134-891ab64532f1?w=600&q=80',
    after: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=600&q=80',
    description: 'Deep exterior polish, ceramic coating and paint protection applied',
    time: '1 Day',
    savings: '₹3,500'
  },
  {
    id: 3,
    title: 'Interior Deep Clean',
    car: 'Toyota Fortuner',
    before: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=600&q=80',
    after: 'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?w=600&q=80',
    description: 'Complete interior steam cleaning, leather conditioning and sanitization',
    time: '4 Hours',
    savings: '₹2,000'
  },
];

// Comparison slider component
const ComparisonSlider = ({ before, after, title }: { before: string; after: string; title: string }) => {
  const [sliderPosition, setSliderPosition] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.min(Math.max((x / rect.width) * 100, 0), 100);
    setSliderPosition(percentage);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    handleMove(e.clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    handleMove(e.touches[0].clientX);
  };

  return (
    <div 
      ref={containerRef}
      className="relative w-full h-64 sm:h-80 rounded-2xl overflow-hidden cursor-ew-resize select-none"
      onMouseMove={handleMouseMove}
      onTouchMove={handleTouchMove}
    >
      {/* After Image (Background) */}
      <img 
        src={after} 
        alt={`${title} After`}
        className="absolute inset-0 w-full h-full object-cover"
      />
      
      {/* Before Image (Clipped) */}
      <div 
        className="absolute inset-0 overflow-hidden"
        style={{ width: `${sliderPosition}%` }}
      >
        <img 
          src={before} 
          alt={`${title} Before`}
          className="absolute inset-0 w-full h-full object-cover"
          style={{ 
            width: containerRef.current ? containerRef.current.offsetWidth : '100%',
            maxWidth: 'none'
          }}
        />
      </div>

      {/* Slider Line */}
      <div 
        className="absolute top-0 bottom-0 w-1 bg-white shadow-lg"
        style={{ left: `${sliderPosition}%`, transform: 'translateX(-50%)' }}
      >
        {/* Slider Handle */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-xl flex items-center justify-center">
          <div className="flex items-center gap-0.5">
            <div className="w-0 h-0 border-t-4 border-b-4 border-r-4 border-transparent border-r-gray-400" />
            <div className="w-0 h-0 border-t-4 border-b-4 border-l-4 border-transparent border-l-gray-400" />
          </div>
        </div>
      </div>

      {/* Labels */}
      <div className="absolute top-4 left-4 px-3 py-1 bg-red-500 text-white text-xs font-bold rounded-full">
        BEFORE
      </div>
      <div className="absolute top-4 right-4 px-3 py-1 bg-green-500 text-white text-xs font-bold rounded-full">
        AFTER
      </div>
    </div>
  );
};

export const BeforeAfterSection = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const sectionRef = useRef(null);
  const headerRef = useRef(null);
  const isHeaderInView = useInView(headerRef, { once: true, margin: "-50px" });
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  return (
    <section ref={sectionRef} className="py-16 sm:py-20 lg:py-28 bg-white relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          className="absolute top-1/4 left-0 w-[500px] h-[500px] rounded-full opacity-30"
          style={{ background: 'radial-gradient(circle, rgba(16,185,129,0.1) 0%, transparent 70%)' }}
          animate={isInView ? { scale: [1, 1.2, 1], x: [0, 50, 0] } : {}}
          transition={{ duration: 15, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-1/4 right-0 w-[400px] h-[400px] rounded-full opacity-30"
          style={{ background: 'radial-gradient(circle, rgba(255,87,51,0.1) 0%, transparent 70%)' }}
          animate={isInView ? { scale: [1.2, 1, 1.2] } : {}}
          transition={{ duration: 12, repeat: Infinity }}
        />

        {/* Floating Sparkles */}
        {[...Array(10)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-orange-200"
            style={{ left: `${10 + i * 10}%`, top: `${20 + (i % 4) * 20}%` }}
            animate={isInView ? { 
              y: [0, -15, 0], 
              rotate: [0, 180, 360],
              opacity: [0.3, 0.6, 0.3]
            } : {}}
            transition={{ duration: 4, repeat: Infinity, delay: i * 0.3 }}
          >
            <Sparkles size={16 + i * 2} />
          </motion.div>
        ))}
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl relative z-10">
        {/* Header */}
        <motion.div 
          ref={headerRef}
          className="text-center max-w-2xl mx-auto mb-12 sm:mb-16"
        >
          <motion.span 
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-100 text-green-600 text-xs font-semibold uppercase tracking-wider mb-4"
            initial={{ opacity: 0, y: -20, scale: 0.8 }}
            animate={isHeaderInView ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: -20, scale: 0.8 }}
            transition={{ type: "spring" }}
          >
            <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 2, repeat: Infinity }}>
              <Sparkles className="w-4 h-4" />
            </motion.div>
            Transformations
          </motion.span>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 tracking-tight mb-4 sm:mb-6">
            {"Before & After ".split('').map((char, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, y: 50 }}
                animate={isHeaderInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
                transition={{ delay: i * 0.03 }}
              >
                {char}
              </motion.span>
            ))}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-emerald-500">
              {"magic".split('').map((char, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, y: 50, rotate: -10 }}
                  animate={isHeaderInView ? { opacity: 1, y: 0, rotate: 0 } : { opacity: 0, y: 50, rotate: -10 }}
                  transition={{ delay: 0.4 + i * 0.05, type: "spring" }}
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
            transition={{ delay: 0.6 }}
          >
            Drag the slider to see the incredible transformations we've achieved
          </motion.p>

          {/* Animated Underline */}
          <motion.div
            className="mt-6 mx-auto h-1 rounded-full bg-gradient-to-r from-green-500 to-emerald-500"
            initial={{ width: 0 }}
            animate={isHeaderInView ? { width: 120 } : { width: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
          />
        </motion.div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left - Comparison Slider */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
            transition={{ duration: 0.6 }}
          >
            <ComparisonSlider 
              before={transformations[activeIndex].before}
              after={transformations[activeIndex].after}
              title={transformations[activeIndex].title}
            />

            {/* Service Details */}
            <motion.div 
              className="mt-6 p-6 bg-gray-50 rounded-2xl"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ delay: 0.3 }}
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{transformations[activeIndex].title}</h3>
                  <p className="text-gray-500">{transformations[activeIndex].car}</p>
                </div>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                  ))}
                </div>
              </div>
              
              <p className="text-gray-600 mb-4">{transformations[activeIndex].description}</p>
              
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-sm"><strong>Time:</strong> {transformations[activeIndex].time}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-sm"><strong>Saved:</strong> {transformations[activeIndex].savings}</span>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Right - Transformation Cards */}
          <motion.div 
            className="space-y-4"
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Transformation</h3>
            
            {transformations.map((item, idx) => (
              <motion.div
                key={item.id}
                onClick={() => setActiveIndex(idx)}
                className={`flex items-center gap-4 p-4 rounded-2xl cursor-pointer transition-all ${
                  activeIndex === idx 
                    ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg shadow-orange-500/30' 
                    : 'bg-gray-50 hover:bg-gray-100'
                }`}
                initial={{ opacity: 0, x: 30 }}
                animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 30 }}
                transition={{ delay: 0.4 + idx * 0.1 }}
                whileHover={{ scale: 1.02, x: 5 }}
                whileTap={{ scale: 0.98 }}
              >
                {/* Thumbnail */}
                <div className="w-20 h-16 rounded-xl overflow-hidden flex-shrink-0 relative">
                  <img 
                    src={item.after} 
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                  {activeIndex === idx && (
                    <motion.div 
                      className="absolute inset-0 bg-white/20"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1">
                  <h4 className={`font-semibold ${activeIndex === idx ? 'text-white' : 'text-gray-900'}`}>
                    {item.title}
                  </h4>
                  <p className={`text-sm ${activeIndex === idx ? 'text-white/80' : 'text-gray-500'}`}>
                    {item.car}
                  </p>
                </div>

                {/* Arrow */}
                <motion.div
                  animate={activeIndex === idx ? { x: [0, 5, 0] } : {}}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <ArrowRight className={`w-5 h-5 ${activeIndex === idx ? 'text-white' : 'text-gray-400'}`} />
                </motion.div>
              </motion.div>
            ))}

            {/* CTA */}
            <motion.button 
              className="w-full mt-6 flex items-center justify-center gap-2 px-6 py-4 bg-gray-900 text-white font-semibold rounded-full hover:bg-black transition-all group"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ delay: 0.8 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Get Your Car Transformed
              <motion.div
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <ArrowRight className="w-5 h-5" />
              </motion.div>
            </motion.button>
          </motion.div>
        </div>
      </div>
    </section>
  );
};