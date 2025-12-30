import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';

// Enhanced data with CAR IMAGES instead of user photos
const testimonials = [
  {
    id: 1,
    name: "Rajesh Kumar",
    role: "Business Owner",
    location: "Coimbatore",
    image: "https://images.unsplash.com/photo-1609521263047-28b99b30e646?q=80&w=1000&auto=format&fit=crop",
    carModel: "Hyundai Creta",
    service: "General Service",
    rating: 5,
    content: "I was skeptical about online car service, but they proved me wrong. The free pickup and drop was a lifesaver. My Creta feels brand new, and the bill was 30% less than the showroom quote."
  },
  {
    id: 2,
    name: "Priya Sundaram",
    role: "Software Engineer",
    location: "Chennai",
    image: "https://images.unsplash.com/photo-1542362567-b07e54358753?q=80&w=1000&auto=format&fit=crop",
    carModel: "Maruti Swift",
    service: "Denting & Painting",
    rating: 5,
    content: "Had a nasty scratch on the bumper. Their paint matching technology is incredible. You literally cannot tell there was a dent. Highly recommended for body work!"
  },
  {
    id: 3,
    name: "Arun Vijay",
    role: "Doctor",
    location: "Bangalore",
    image: "https://images.unsplash.com/photo-1617469767053-d3b523a0b982?q=80&w=1000&auto=format&fit=crop",
    carModel: "Honda City",
    service: "AC Repair",
    rating: 4,
    content: "The AC cooling coil replacement was done professionally. They sent me photos of the old part vs the new part on WhatsApp which built a lot of trust."
  },
  {
    id: 4,
    name: "Sneha Reddy",
    role: "Architect",
    location: "Hyderabad",
    image: "https://images.unsplash.com/photo-1615906655593-ad0386982a0f?q=80&w=1000&auto=format&fit=crop",
    carModel: "Tata Nexon",
    service: "Periodic Service",
    rating: 5,
    content: "Very transparent pricing. No hidden charges at the end. The mechanic explained everything clearly before starting the work. Best service app in India."
  }
];

export const Testimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  // Auto-advance carousel
  useEffect(() => {
    const timer = setInterval(() => {
      nextSlide();
    }, 6000);
    return () => clearInterval(timer);
  }, [currentIndex]);

  const slideVariants = {
    hidden: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.8
    }),
    visible: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring" as const,
        stiffness: 300,
        damping: 30
      }
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.8,
      transition: {
        duration: 0.5
      }
    })
  };

  const nextSlide = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevSlide = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <section id="testimonials" className="py-24 relative overflow-hidden bg-gray-900">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?q=80&w=2000&auto=format&fit=crop" 
          alt="Happy Driver Background" 
          className="w-full h-full object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-gray-900 via-gray-900/90 to-gray-900" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl relative z-10">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16 space-y-4"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/10">
            <div className="flex -space-x-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="w-6 h-6 rounded-full bg-orange-500 border-2 border-gray-900 flex items-center justify-center text-[8px] text-white font-bold">
                  ★
                </div>
              ))}
            </div>
            <span className="text-orange-400 text-xs font-bold uppercase tracking-wider">
              Trusted by 50,000+ Owners
            </span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
            Loved by drivers,
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-500">
              Approved by mechanics.
            </span>
          </h2>
        </motion.div>

        {/* Carousel Content */}
        <div className="relative max-w-4xl mx-auto min-h-[400px]">
          <AnimatePresence initial={false} custom={direction} mode="wait">
            <motion.div
              key={currentIndex}
              custom={direction}
              variants={slideVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="w-full"
            >
              <div className="bg-white rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row">
                
                {/* Left: Image Side (Desktop) - NOW SHOWING THE CAR */}
                <div className="md:w-2/5 relative h-64 md:h-auto overflow-hidden bg-gray-900">
                   <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-red-500/10 z-10 mix-blend-overlay" />
                   <img 
                    src={testimonials[currentIndex].image} 
                    alt={`${testimonials[currentIndex].carModel} - ${testimonials[currentIndex].name}`}
                    className="w-full h-full object-cover transform scale-105 transition-transform duration-1000 hover:scale-110"
                   />
                   {/* Image Overlay - Updated to emphasize Car Model */}
                   <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/90 via-black/50 to-transparent z-20 text-white">
                     <div className="inline-block px-3 py-1 bg-orange-600 rounded-full text-xs font-bold mb-2 shadow-sm">
                        {testimonials[currentIndex].carModel}
                     </div>
                     <p className="text-lg font-bold">{testimonials[currentIndex].name}</p>
                     <p className="text-sm text-gray-300 opacity-80">{testimonials[currentIndex].location}</p>
                   </div>
                </div>

                {/* Right: Content Side */}
                <div className="md:w-3/5 p-8 md:p-12 flex flex-col justify-center relative bg-white">
                  <Quote className="absolute top-8 right-8 text-orange-100 w-20 h-20 -rotate-12" />
                  
                  <div className="relative z-10">
                    <div className="flex items-center gap-1 mb-6">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={`w-5 h-5 ${i < testimonials[currentIndex].rating ? 'text-orange-500 fill-orange-500' : 'text-gray-300'}`} 
                        />
                      ))}
                    </div>

                    <p className="text-xl md:text-2xl text-gray-700 leading-relaxed font-medium mb-8">
                      "{testimonials[currentIndex].content}"
                    </p>

                    <div className="flex flex-wrap gap-4 pt-8 border-t border-gray-100">
                      {/* Car Model Badge (Redundant here but good for mobile view if image stacks) */}
                      <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 px-4 py-2 rounded-lg md:hidden">
                        <span className="text-lg">🚗</span>
                        <span className="font-semibold">{testimonials[currentIndex].carModel}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 px-4 py-2 rounded-lg">
                        <span className="text-lg">🔧</span>
                        <span className="font-semibold">{testimonials[currentIndex].service}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation Buttons */}
          <button 
            onClick={prevSlide}
            className="absolute top-1/2 -left-4 md:-left-12 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white flex items-center justify-center hover:bg-white hover:text-gray-900 transition-all z-20"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button 
            onClick={nextSlide}
            className="absolute top-1/2 -right-4 md:-right-12 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white flex items-center justify-center hover:bg-white hover:text-gray-900 transition-all z-20"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>

        {/* Bottom Stats */}
        <div className="mt-16 flex justify-center gap-2">
          {testimonials.map((_, i) => (
            <button
              key={i}
              onClick={() => {
                setDirection(i > currentIndex ? 1 : -1);
                setCurrentIndex(i);
              }}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === currentIndex ? 'w-8 bg-orange-500' : 'w-2 bg-gray-700 hover:bg-gray-600'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};