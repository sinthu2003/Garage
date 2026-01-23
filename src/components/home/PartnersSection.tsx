import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Award, Shield, Car, Sparkles, Star, CheckCircle,Users } from 'lucide-react';
import { useContent } from '../../admin-portal';

// Icon mapping for trust badges
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Award,
  Shield,
  Car,
  Sparkles,
  Star,
  CheckCircle,
  Users

};

export const PartnersSection = () => {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: false, margin: "-100px" });

  // Get content from context
  const { content } = useContent();
  const partnersContent = content.partners;
  const partners = partnersContent.brands || [];
  const trustBadges = partnersContent.trustBadges;

  // Split partners into two rows for scrolling effect
  const firstRowPartners = partners.slice(0, Math.ceil(partners.length / 2));
  const secondRowPartners = partners.slice(Math.ceil(partners.length / 2));

  return (
    <section ref={sectionRef} id='partners' className="py-12 sm:py-16 lg:py-20 bg-background relative overflow-hidden">
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
            {partnersContent.badge}
          </motion.span>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground tracking-tight mb-4">
            {partnersContent.headline.text.split('').map((char, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                transition={{ delay: i * 0.02 }}
              >
                {char}
              </motion.span>
            ))}
            {' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/60">
              {partnersContent.headline.highlight.split('').map((char, i) => (
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
            {partnersContent.description}
          </motion.p>
        </motion.div>

        {/* Scrolling Brand Logos - Row 1 */}
        <div className="relative mb-6 overflow-hidden">
          {/* Gradient Masks */}
          <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-background to-transparent z-10" />
          <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-background to-transparent z-10" />
          
          <motion.div
            className="flex gap-8 sm:gap-12"
            animate={{ x: ['0%', '-50%'] }}
            transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
          >
            {[...firstRowPartners, ...firstRowPartners].map((partner, idx) => (
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

        {/* Scrolling Brand Logos - Row 2 (Reverse) */}
        {secondRowPartners.length > 0 && (
          <div className="relative mb-6 overflow-hidden">
            {/* Gradient Masks */}
            <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-background to-transparent z-10" />
            <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-background to-transparent z-10" />
            
            <motion.div
              className="flex gap-8 sm:gap-12"
              animate={{ x: ['-50%', '0%'] }}
              transition={{ duration: 45, repeat: Infinity, ease: 'linear' }}
            >
              {[...secondRowPartners, ...secondRowPartners].map((partner, idx) => (
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
        )}

        {/* Brand Count Badge */}
        <motion.div 
          className="text-center mb-8"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ delay: 0.6 }}
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-semibold">
            <Car className="w-4 h-4" />
            {partnersContent.brandCount} {partnersContent.brandCountLabel}
          </span>
        </motion.div>

        {/* Trust Badges */}
        <motion.div 
          className="mt-8 sm:mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ delay: 0.6 }}
        >
          {trustBadges.map((badge, idx) => {
            const IconComponent = iconMap[badge.icon] || Shield;
            
            return (
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
                  <IconComponent className="w-6 h-6 text-primary" />
                </motion.div>
                <div>
                  <p className="font-semibold text-foreground text-sm sm:text-base">{badge.title}</p>
                  <p className="text-xs sm:text-sm text-muted-foreground">{badge.subtitle}</p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};