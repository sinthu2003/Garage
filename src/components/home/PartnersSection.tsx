import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Award, Shield, Car, Sparkles } from 'lucide-react';

// Car brand partners
const partners = [
  { name: 'Maruti Suzuki', logo: 'https://www.carlogos.org/car-logos/suzuki-logo.png' },
  { name: 'Hyundai', logo: 'https://www.carlogos.org/car-logos/hyundai-logo.png' },
  { name: 'Honda', logo: 'https://www.carlogos.org/car-logos/honda-logo.png' },
  { name: 'Tata', logo: 'https://www.carlogos.org/car-logos/tata-logo.png' },
  { name: 'Toyota', logo: 'https://www.carlogos.org/car-logos/toyota-logo.png' },
  { name: 'Mahindra', logo: 'https://www.carlogos.org/car-logos/mahindra-logo.png' },
  { name: 'Kia', logo: 'https://www.carlogos.org/car-logos/kia-logo.png' },
  { name: 'MG', logo: 'https://www.carlogos.org/car-logos/mg-logo.png' },
  { name: 'Volkswagen', logo: 'https://www.carlogos.org/car-logos/volkswagen-logo.png' },
  { name: 'Skoda', logo: 'https://www.carlogos.org/car-logos/skoda-logo.png' },
  { name: 'BMW', logo: 'https://www.carlogos.org/car-logos/bmw-logo.png' },
  { name: 'Audi', logo: 'https://www.carlogos.org/car-logos/audi-logo.png' },
  { name: 'Mercedes-Benz', logo: 'https://www.carlogos.org/car-logos/mercedes-benz-logo.png' },
  { name: 'Ford', logo: 'https://www.carlogos.org/car-logos/ford-logo.png' },
  { name: 'Renault', logo: 'https://www.carlogos.org/car-logos/renault-logo.png' },
  { name: 'Nissan', logo: 'https://www.carlogos.org/car-logos/nissan-logo.png' },
];

// Trust badges
const trustBadges = [
  { icon: Shield, title: 'ISO Certified', subtitle: '9001:2015' },
  { icon: Award, title: 'Best Service', subtitle: 'Award 2024' },
  { icon: Car, title: 'All Brands', subtitle: 'Covered' },
  { icon: Sparkles, title: '4.8 Rating', subtitle: 'Google Reviews' },
];

export const PartnersSection = () => {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: false, margin: "-100px" });

  return (
    <section ref={sectionRef} className="py-12 sm:py-16 lg:py-20 bg-white relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-30"
          style={{ background: 'radial-gradient(circle, rgba(255,87,51,0.05) 0%, transparent 60%)' }}
          animate={isInView ? { scale: [1, 1.2, 1] } : {}}
          transition={{ duration: 10, repeat: Infinity }}
        />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl relative z-10">
        {/* Header */}
        <motion.div 
          className="text-center mb-10 sm:mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
        >
          <motion.span 
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gray-100 text-gray-600 text-xs font-semibold uppercase tracking-wider mb-4"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
            transition={{ delay: 0.2 }}
          >
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 3, repeat: Infinity, ease: "linear" }}>
              <Car className="w-4 h-4" />
            </motion.div>
            Trusted Partners
          </motion.span>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 tracking-tight mb-4">
            {"We service ".split('').map((char, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                transition={{ delay: i * 0.02 }}
              >
                {char}
              </motion.span>
            ))}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-500">
              {"all major brands".split('').map((char, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                  transition={{ delay: 0.3 + i * 0.02 }}
                >
                  {char}
                </motion.span>
              ))}
            </span>
          </h2>

          <motion.p 
            className="text-gray-500 max-w-xl mx-auto"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ delay: 0.5 }}
          >
            Expert mechanics trained for all car makes and models
          </motion.p>
        </motion.div>

        {/* Scrolling Brand Logos - Row 1 */}
        <div className="relative mb-6 overflow-hidden">
          {/* Gradient Masks */}
          <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-white to-transparent z-10" />
          <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-white to-transparent z-10" />
          
          <motion.div
            className="flex gap-8 sm:gap-12"
            animate={{ x: ['0%', '-50%'] }}
            transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
          >
            {[...partners, ...partners].map((partner, idx) => (
              <motion.div
                key={idx}
                className="flex-shrink-0 w-24 h-16 sm:w-32 sm:h-20 bg-gray-50 rounded-xl flex items-center justify-center p-4 border border-gray-100 hover:border-orange-200 hover:shadow-lg transition-all cursor-pointer"
                whileHover={{ scale: 1.1, y: -5 }}
              >
                <img 
                  src={partner.logo} 
                  alt={partner.name}
                  className="max-w-full max-h-full object-contain filter grayscale hover:grayscale-0 transition-all"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    target.parentElement!.innerHTML = `<span class="text-gray-400 text-sm font-semibold">${partner.name}</span>`;
                  }}
                />
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Scrolling Brand Logos - Row 2 (Reverse) */}
        <div className="relative overflow-hidden">
          {/* Gradient Masks */}
          <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-white to-transparent z-10" />
          <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-white to-transparent z-10" />
          
          <motion.div
            className="flex gap-8 sm:gap-12"
            animate={{ x: ['-50%', '0%'] }}
            transition={{ duration: 35, repeat: Infinity, ease: 'linear' }}
          >
            {[...partners.slice().reverse(), ...partners.slice().reverse()].map((partner, idx) => (
              <motion.div
                key={idx}
                className="flex-shrink-0 w-24 h-16 sm:w-32 sm:h-20 bg-gray-50 rounded-xl flex items-center justify-center p-4 border border-gray-100 hover:border-orange-200 hover:shadow-lg transition-all cursor-pointer"
                whileHover={{ scale: 1.1, y: -5 }}
              >
                <img 
                  src={partner.logo} 
                  alt={partner.name}
                  className="max-w-full max-h-full object-contain filter grayscale hover:grayscale-0 transition-all"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    target.parentElement!.innerHTML = `<span class="text-gray-400 text-sm font-semibold">${partner.name}</span>`;
                  }}
                />
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Trust Badges */}
        <motion.div 
          className="mt-12 sm:mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ delay: 0.6 }}
        >
          {trustBadges.map((badge, idx) => (
            <motion.div
              key={idx}
              className="flex items-center gap-3 p-4 rounded-2xl bg-gray-50 border border-gray-100 hover:border-orange-200 hover:shadow-md transition-all cursor-pointer"
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={isInView ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 20, scale: 0.9 }}
              transition={{ delay: 0.7 + idx * 0.1, type: "spring" }}
              whileHover={{ scale: 1.05, y: -3 }}
            >
              <motion.div 
                className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center"
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
              >
                <badge.icon className="w-6 h-6 text-orange-500" />
              </motion.div>
              <div>
                <p className="font-semibold text-gray-900 text-sm sm:text-base">{badge.title}</p>
                <p className="text-xs sm:text-sm text-gray-500">{badge.subtitle}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};