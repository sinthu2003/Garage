import { useRef } from 'react';
import { services } from '../../utils/data';
import { ServiceCard } from './ServiceCard';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Wrench, Settings, Gauge, Car } from 'lucide-react';

export const ServiceGrid = () => {
  const sectionRef = useRef(null);
  const headerRef = useRef(null);
  const isHeaderInView = useInView(headerRef, { once: false, margin: "-50px" });
  const isInView = useInView(sectionRef, { once: false, margin: "-100px" });

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], [0, -100]);

  // Floating tool icons
  const floatingTools = [
    { icon: Wrench, x: '5%', y: '20%', size: 40 },
    { icon: Settings, x: '95%', y: '30%', size: 50 },
    { icon: Gauge, x: '8%', y: '70%', size: 35 },
    { icon: Car, x: '92%', y: '80%', size: 45 },
  ];

  return (
    <section id="services" ref={sectionRef} className="py-20 lg:py-28 bg-gray-50 relative overflow-hidden">
      {/* Animated Background Elements */}
      <motion.div className="absolute inset-0" style={{ y: backgroundY }}>
        {/* Subtle gradient */}
        <motion.div 
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-white to-transparent"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
          transition={{ duration: 1 }}
        />
        
        {/* Animated Dot pattern */}
        <motion.div 
          className="absolute inset-0"
          style={{
            backgroundImage: 'radial-gradient(circle, rgba(255,87,51,0.1) 1px, transparent 1px)',
            backgroundSize: '32px 32px'
          }}
          animate={{ 
            backgroundPosition: ['0px 0px', '32px 32px']
          }}
          transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
        />

        {/* Floating Tool Icons */}
        {floatingTools.map((tool, idx) => (
          <motion.div
            key={idx}
            className="absolute text-orange-200"
            style={{ left: tool.x, top: tool.y }}
            initial={{ opacity: 0, scale: 0, rotate: -180 }}
            animate={isInView ? { 
              opacity: 0.5, 
              scale: 1, 
              rotate: 0,
              y: [0, -15, 0],
            } : { opacity: 0, scale: 0, rotate: -180 }}
            transition={{
              opacity: { duration: 0.5, delay: idx * 0.2 },
              scale: { duration: 0.5, delay: idx * 0.2 },
              rotate: { duration: 0.8, delay: idx * 0.2 },
              y: { duration: 4, repeat: Infinity, ease: "easeInOut", delay: idx * 0.5 }
            }}
          >
            <tool.icon size={tool.size} />
          </motion.div>
        ))}
      </motion.div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl relative z-10">
        {/* Section Header */}
        <motion.div 
          ref={headerRef}
          className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-16"
        >
          <div className="max-w-xl">
            {/* Badge */}
            <motion.span 
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-100 text-orange-600 text-xs font-semibold uppercase tracking-wider mb-4"
              initial={{ opacity: 0, x: -50, scale: 0.8 }}
              animate={isHeaderInView ? { opacity: 1, x: 0, scale: 1 } : { opacity: 0, x: -50, scale: 0.8 }}
              transition={{ type: "spring" }}
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              >
                <Settings className="w-4 h-4" />
              </motion.div>
              Our Services
            </motion.span>

            {/* Title with letter animation */}
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 tracking-tight mb-4">
              {"Everything your".split(' ').map((word, wi) => (
                <span key={wi}>
                  {word.split('').map((char, ci) => (
                    <motion.span
                      key={ci}
                      initial={{ opacity: 0, y: 50 }}
                      animate={isHeaderInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
                      transition={{ delay: wi * 0.1 + ci * 0.03 }}
                    >
                      {char}
                    </motion.span>
                  ))}
                  {' '}
                </span>
              ))}
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-500">
                {"car needs.".split('').map((char, i) => (
                  <motion.span
                    key={i}
                    initial={{ opacity: 0, y: 50, rotate: -10 }}
                    animate={isHeaderInView ? { opacity: 1, y: 0, rotate: 0 } : { opacity: 0, y: 50, rotate: -10 }}
                    transition={{ delay: 0.5 + i * 0.05, type: "spring" }}
                  >
                    {char}
                  </motion.span>
                ))}
              </span>
            </h2>

            <motion.p 
              className="text-lg text-gray-500 leading-relaxed"
              initial={{ opacity: 0, y: 30 }}
              animate={isHeaderInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ delay: 0.8 }}
            >
              From routine maintenance to complex repairs, our expert mechanics 
              deliver quality service at transparent prices.
            </motion.p>
          </div>
          
          <motion.button 
            className="flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-orange-500 transition-colors group"
            initial={{ opacity: 0, x: 50 }}
            animate={isHeaderInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
            transition={{ delay: 0.6 }}
            whileHover={{ x: 10 }}
          >
            View all services
            <motion.div
              animate={{ x: [0, 5, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <ArrowRight className="w-4 h-4" />
            </motion.div>
          </motion.button>
        </motion.div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => (
            <ServiceCard key={service.id} service={service} index={index} />
          ))}
        </div>


      </div>
    </section>
  );
};