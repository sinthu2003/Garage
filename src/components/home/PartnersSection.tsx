import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Award, Shield, Car, Sparkles } from 'lucide-react';

// Complete list of all car brands available in India
const partners = [
  // Mass Market - Indian Brands
  { name: 'Maruti Suzuki', logo: 'https://www.carlogos.org/car-logos/suzuki-logo.png' },
  { name: 'Tata', logo: 'https://www.carlogos.org/car-logos/tata-logo.png' },
  { name: 'Mahindra', logo: 'https://www.carlogos.org/car-logos/mahindra-logo.png' },
  
  // Mass Market - Korean Brands
  { name: 'Hyundai', logo: 'https://www.carlogos.org/car-logos/hyundai-logo.png' },
  { name: 'Kia', logo: 'https://www.carlogos.org/car-logos/kia-logo.png' },
  
  // Mass Market - Japanese Brands
  { name: 'Toyota', logo: 'https://www.carlogos.org/car-logos/toyota-logo.png' },
  { name: 'Honda', logo: 'https://www.carlogos.org/car-logos/honda-logo.png' },
  { name: 'Nissan', logo: 'https://www.carlogos.org/car-logos/nissan-logo.png' },
  { name: 'Isuzu', logo: 'https://www.carlogos.org/car-logos/isuzu-logo.png' },
  
  // Mass Market - European Brands
  { name: 'Volkswagen', logo: 'https://www.carlogos.org/car-logos/volkswagen-logo.png' },
  { name: 'Skoda', logo: 'https://www.carlogos.org/car-logos/skoda-logo.png' },
  { name: 'Renault', logo: 'https://www.carlogos.org/car-logos/renault-logo.png' },
  { name: 'Citroen', logo: 'https://www.carlogos.org/car-logos/citroen-logo.png' },
  
  // Mass Market - American Brands
  { name: 'Jeep', logo: 'https://www.carlogos.org/car-logos/jeep-logo.png' },
  
  // Mass Market - Chinese Brands
  { name: 'MG', logo: 'https://www.carlogos.org/car-logos/mg-logo.png' },
  { name: 'BYD', logo: 'https://www.carlogos.org/car-logos/byd-logo.png' },
  
  // Premium Brands - German
  { name: 'BMW', logo: 'https://www.carlogos.org/car-logos/bmw-logo.png' },
  { name: 'Mercedes-Benz', logo: 'https://www.carlogos.org/car-logos/mercedes-benz-logo.png' },
  { name: 'Audi', logo: 'https://www.carlogos.org/car-logos/audi-logo.png' },
  { name: 'Porsche', logo: 'https://www.carlogos.org/car-logos/porsche-logo.png' },
  
  // Premium Brands - British
  { name: 'Jaguar', logo: 'https://www.carlogos.org/car-logos/jaguar-logo.png' },
  { name: 'Land Rover', logo: 'https://www.carlogos.org/car-logos/land-rover-logo.png' },
  { name: 'Mini', logo: 'https://www.carlogos.org/car-logos/mini-logo.png' },
  { name: 'Bentley', logo: 'https://www.carlogos.org/car-logos/bentley-logo.png' },
  { name: 'Rolls-Royce', logo: 'https://www.carlogos.org/car-logos/rolls-royce-logo.png' },
  { name: 'Aston Martin', logo: 'https://www.carlogos.org/car-logos/aston-martin-logo.png' },
  { name: 'McLaren', logo: 'https://www.carlogos.org/car-logos/mclaren-logo.png' },
  { name: 'Lotus', logo: 'https://www.carlogos.org/car-logos/lotus-logo.png' },
  
  // Premium Brands - Swedish
  { name: 'Volvo', logo: 'https://www.carlogos.org/car-logos/volvo-logo.png' },
  
  // Premium Brands - Japanese Luxury
  { name: 'Lexus', logo: 'https://www.carlogos.org/car-logos/lexus-logo.png' },
  
  // Premium Brands - Italian
  { name: 'Lamborghini', logo: 'https://www.carlogos.org/car-logos/lamborghini-logo.png' },
  { name: 'Ferrari', logo: 'https://www.carlogos.org/car-logos/ferrari-logo.png' },
  { name: 'Maserati', logo: 'https://www.carlogos.org/car-logos/maserati-logo.png' },
  
  // Other Brands
  { name: 'Force Motors', logo: 'https://www.carlogos.org/car-logos/force-logo.png' },
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
    <section ref={sectionRef} className="py-12 sm:py-16 lg:py-20 bg-background relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-30"
          style={{ background: 'radial-gradient(circle, hsl(var(--primary) / 0.05) 0%, transparent 60%)' }}
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
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary text-muted-foreground text-xs font-semibold uppercase tracking-wider mb-4"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
            transition={{ delay: 0.2 }}
          >
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 3, repeat: Infinity, ease: "linear" }}>
              <Car className="w-4 h-4" />
            </motion.div>
            Trusted Partners
          </motion.span>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground tracking-tight mb-4">
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
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/60">
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
            className="text-muted-foreground max-w-xl mx-auto"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ delay: 0.5 }}
          >
            Expert mechanics trained for all car makes and models - from budget hatchbacks to luxury supercars
          </motion.p>
        </motion.div>

        {/* Scrolling Brand Logos - Row 1 (First half of brands) */}
        <div className="relative mb-6 overflow-hidden">
          {/* Gradient Masks */}
          <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-background to-transparent z-10" />
          <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-background to-transparent z-10" />
          
          <motion.div
            className="flex gap-8 sm:gap-12"
            animate={{ x: ['0%', '-50%'] }}
            transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
          >
            {[...partners.slice(0, 17), ...partners.slice(0, 17)].map((partner, idx) => (
              <motion.div
                key={idx}
                className="flex-shrink-0 w-24 h-16 sm:w-32 sm:h-20 bg-card rounded-xl flex items-center justify-center p-4 border border-border hover:border-primary/30 hover:shadow-lg transition-all cursor-pointer"
                whileHover={{ scale: 1.1, y: -5 }}
              >
                <img
                  src={partner.logo}
                  alt={partner.name}
                  className="max-w-full max-h-full object-contain transition-all duration-300 hover:scale-110"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    target.parentElement!.innerHTML = `<span class="text-muted-foreground text-xs sm:text-sm font-semibold text-center">${partner.name}</span>`;
                  }}
                />
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Scrolling Brand Logos - Row 2 (Second half of brands - Reverse) */}
        <div className="relative mb-6 overflow-hidden">
          {/* Gradient Masks */}
          <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-background to-transparent z-10" />
          <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-background to-transparent z-10" />
          
          <motion.div
            className="flex gap-8 sm:gap-12"
            animate={{ x: ['-50%', '0%'] }}
            transition={{ duration: 45, repeat: Infinity, ease: 'linear' }}
          >
            {[...partners.slice(17), ...partners.slice(17)].map((partner, idx) => (
              <motion.div
                key={idx}
                className="flex-shrink-0 w-24 h-16 sm:w-32 sm:h-20 bg-card rounded-xl flex items-center justify-center p-4 border border-border hover:border-primary/30 hover:shadow-lg transition-all cursor-pointer"
                whileHover={{ scale: 1.1, y: -5 }}
              >
                <img
                  src={partner.logo}
                  alt={partner.name}
                  className="max-w-full max-h-full object-contain transition-all duration-300 hover:scale-110"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    target.parentElement!.innerHTML = `<span class="text-muted-foreground text-xs sm:text-sm font-semibold text-center">${partner.name}</span>`;
                  }}
                />
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Brand Count Badge */}
        <motion.div 
          className="text-center mb-8"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ delay: 0.6 }}
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-semibold">
            <Car className="w-4 h-4" />
            {partners.length}+ Car Brands Serviced
          </span>
        </motion.div>

        {/* Trust Badges */}
        <motion.div 
          className="mt-8 sm:mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ delay: 0.6 }}
        >
          {trustBadges.map((badge, idx) => (
            <motion.div
              key={idx}
              className="flex items-center gap-3 p-4 rounded-2xl bg-card border border-border hover:border-primary/30 hover:shadow-md transition-all cursor-pointer"
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={isInView ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 20, scale: 0.9 }}
              transition={{ delay: 0.7 + idx * 0.1, type: "spring" }}
              whileHover={{ scale: 1.05, y: -3 }}
            >
              <motion.div 
                className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center"
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
              >
                <badge.icon className="w-6 h-6 text-primary" />
              </motion.div>
              <div>
                <p className="font-semibold text-foreground text-sm sm:text-base">{badge.title}</p>
                <p className="text-xs sm:text-sm text-muted-foreground">{badge.subtitle}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};