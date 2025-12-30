import { motion } from 'framer-motion';
import { BookingWidget } from './BookingWidget';
import { ShieldCheck, Zap, Award, Play, Wrench, Car } from 'lucide-react';

export const Hero = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { 
        staggerChildren: 0.15,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { 
        type: "spring" as const,
        stiffness: 100,
        damping: 20
      } 
    }
  };

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Background Image - Professional Garage */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1625047509248-ec889cbff17f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
          alt="Professional Car Service Garage"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-900/95 to-gray-900/80" />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-gray-900/50" />
      </div>

      {/* Animated Floating Car Parts */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Floating Wrench */}
        <motion.div
          className="absolute top-20 left-[10%] text-orange-500/20"
          animate={{ 
            y: [0, -20, 0],
            rotate: [0, 10, 0]
          }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        >
          <Wrench size={60} />
        </motion.div>
        
        {/* Floating Car Icon */}
        <motion.div
          className="absolute top-40 right-[15%] text-blue-500/20 hidden lg:block"
          animate={{ 
            y: [0, 15, 0],
            x: [0, 10, 0]
          }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        >
          <Car size={80} />
        </motion.div>

        {/* Gradient Orbs */}
        <motion.div 
          className="absolute -top-40 -right-40 w-[300px] h-[300px] sm:w-[600px] sm:h-[600px] rounded-full opacity-20"
          style={{
            background: 'radial-gradient(circle, rgba(255,87,51,0.4) 0%, transparent 70%)'
          }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.3, 0.2]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div 
          className="absolute -bottom-40 -left-40 w-[250px] h-[250px] sm:w-[500px] sm:h-[500px] rounded-full opacity-15"
          style={{
            background: 'radial-gradient(circle, rgba(59,130,246,0.3) 0%, transparent 70%)'
          }}
          animate={{
            scale: [1.2, 1, 1.2],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      {/* Grid Pattern Overlay */}
      <div 
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px sm:60px 60px'
        }}
      />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl relative z-10 py-20 sm:py-24 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 xl:gap-20 items-center">
          
          {/* Left Content */}
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="text-white space-y-6 sm:space-y-8 text-center lg:text-left"
          >
            {/* Badge */}
            <motion.div variants={itemVariants} className="flex justify-center lg:justify-start">
              <span className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-xs sm:text-sm font-semibold text-orange-400">
                <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
                #1 Car Service in Coimbatore
              </span>
            </motion.div>
            
            {/* Headline */}
            <motion.h1 
              variants={itemVariants} 
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-[1.1] tracking-tight"
            >
              Premium Car
              <br />
              Service at
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-orange-500 to-red-500">
                Your Doorstep.
              </span>
            </motion.h1>
            
            {/* Subheadline */}
            <motion.p 
              variants={itemVariants} 
              className="text-base sm:text-lg md:text-xl text-gray-300 max-w-lg mx-auto lg:mx-0 leading-relaxed"
            >
              Experience transparent pricing, real-time tracking, and savings up to 
              <span className="text-orange-400 font-semibold"> 40%</span> compared to authorized service centers.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 pt-2 justify-center lg:justify-start">
              <button className="group flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold rounded-full hover:shadow-lg hover:shadow-orange-500/25 transition-all duration-300 hover:scale-105 text-sm sm:text-base">
                Get Free Quote
                <svg className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </button>
              <button className="group flex items-center justify-center gap-2 px-5 sm:px-6 py-3 sm:py-4 bg-white/10 backdrop-blur-sm border border-white/20 text-white font-semibold rounded-full hover:bg-white/20 transition-all duration-300 text-sm sm:text-base">
                <Play className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" />
                Watch Video
              </button>
            </motion.div>

            {/* Trust Badges */}
            <motion.div 
              variants={itemVariants} 
              className="flex flex-wrap gap-4 sm:gap-6 lg:gap-10 pt-6 sm:pt-8 border-t border-white/10 justify-center lg:justify-start"
            >
              {[
                { icon: ShieldCheck, label: "Warranty", value: "6 Months" },
                { icon: Zap, label: "Avg Savings", value: "₹4,500" },
                { icon: Award, label: "Customers", value: "50,000+" },
              ].map((item, idx) => (
                <motion.div 
                  key={idx} 
                  className="flex items-center gap-2 sm:gap-3"
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center">
                    <item.icon className="w-5 h-5 sm:w-6 sm:h-6 text-orange-400" strokeWidth={1.5} />
                  </div>
                  <div>
                    <p className="text-[10px] sm:text-xs text-gray-400 uppercase tracking-wider">{item.label}</p>
                    <p className="text-sm sm:text-lg font-bold text-white">{item.value}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right Widget */}
          <motion.div 
            className="flex justify-center lg:justify-end mt-8 lg:mt-0"
            initial={{ opacity: 0, y: 60, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <BookingWidget />
          </motion.div>
        </div>
      </div>

      {/* Scrolling Brand Logos */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-gray-900/90 to-transparent py-4 sm:py-6">
        <div className="overflow-hidden">
          <motion.div 
            className="flex gap-8 sm:gap-12"
            animate={{ x: ['0%', '-50%'] }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          >
            {[...Array(2)].map((_, setIdx) => (
              <div key={setIdx} className="flex gap-8 sm:gap-12 items-center">
                {['Maruti Suzuki', 'Hyundai', 'Honda', 'Tata', 'Toyota', 'Mahindra', 'Kia', 'MG'].map((brand) => (
                  <span key={brand} className="text-gray-500 font-semibold text-sm sm:text-lg whitespace-nowrap hover:text-white transition-colors">
                    {brand}
                  </span>
                ))}
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};