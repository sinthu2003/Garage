import { motion } from 'framer-motion';
import { Check, ArrowRight, TrendingDown, BadgePercent } from 'lucide-react';

const pricingData = [
  { 
    service: 'Car Inspection', 
    market: 800, 
    ours: 499, 
    image: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=80&h=80&fit=crop'
  },
  { 
    service: 'General Service', 
    market: 4500, 
    ours: 2999, 
    image: 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=80&h=80&fit=crop'
  },
  { 
    service: 'AC Gas Top-up', 
    market: 2200, 
    ours: 1499, 
    image: 'https://images.unsplash.com/photo-1635273051427-7c2a37a2c8f9?w=80&h=80&fit=crop'
  },
  { 
    service: 'Wheel Alignment', 
    market: 1200, 
    ours: 699, 
    image: 'https://images.unsplash.com/photo-1578844251758-2f71da64c96f?w=80&h=80&fit=crop'
  },
  { 
    service: 'Brake Pads', 
    market: 2500, 
    ours: 1800, 
    image: 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=80&h=80&fit=crop'
  },
];

export const PricingTable = () => {
  const calculateSaving = (market: number, ours: number) => {
    return Math.round(((market - ours) / market) * 100);
  };

  const totalMarket = pricingData.reduce((acc, item) => acc + item.market, 0);
  const totalOurs = pricingData.reduce((acc, item) => acc + item.ours, 0);

  return (
    <section id="pricing" className="py-12 sm:py-16 lg:py-24 bg-background relative overflow-hidden">
      {/* Background */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-primary/5 to-transparent hidden lg:block" />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl relative z-10">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 xl:gap-20 items-center">
          
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 text-[10px] sm:text-xs font-semibold uppercase tracking-wider mb-4 sm:mb-6">
              <TrendingDown className="w-3 h-3" />
              Save Up to 40%
            </span>
            
            <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-foreground tracking-tight mb-4 sm:mb-6">
              Transparent
              <br />
              pricing.
              <br />
              <span className="text-muted-foreground/50">No surprises.</span>
            </h2>
            
            <p className="text-sm sm:text-base lg:text-lg text-muted-foreground leading-relaxed mb-6 sm:mb-8">
              We operate centrally to minimize overheads and pass the savings directly to you. 
              Compare our prices with authorized service centers.
            </p>

            {/* Comparison Image */}
            <motion.div
              className="relative rounded-xl sm:rounded-2xl overflow-hidden mb-6 sm:mb-8 h-40 sm:h-48 lg:h-56"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <img 
                src="https://images.unsplash.com/photo-1625047509248-ec889cbff17f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                alt="Car Service Workshop"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-gray-900/80 to-transparent" />
              <div className="absolute inset-0 flex items-center p-4 sm:p-6">
                <div>
                  <p className="text-white/70 text-xs sm:text-sm mb-1">Why pay more?</p>
                  <p className="text-white text-lg sm:text-xl lg:text-2xl font-bold">Same Quality,</p>
                  <p className="text-primary text-lg sm:text-xl lg:text-2xl font-bold">Better Price.</p>
                </div>
              </div>
            </motion.div>
            
            {/* Key Features */}
            <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
              {[
                'Upfront quotes before service',
                'No hidden charges ever',
                'Price match guarantee',
              ].map((item, idx) => (
                <motion.div 
                  key={idx}
                  className="flex items-center gap-2 sm:gap-3"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center flex-shrink-0">
                    <Check className="w-3 h-3 sm:w-4 sm:h-4 text-green-600 dark:text-green-400" strokeWidth={2.5} />
                  </div>
                  <span className="text-sm sm:text-base text-foreground font-medium">{item}</span>
                </motion.div>
              ))}
            </div>
            
            <button className="inline-flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-foreground text-background font-semibold rounded-full hover:opacity-90 transition-all duration-300 hover:shadow-lg text-sm sm:text-base group">
              View Full Rate Card
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>

          {/* Right - Pricing Cards */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-2 sm:space-y-3"
          >
            {pricingData.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08 }}
                whileHover={{ x: 8 }}
                className="group flex items-center justify-between p-3 sm:p-4 lg:p-5 bg-secondary rounded-xl sm:rounded-2xl border border-border hover:border-primary/20 hover:bg-primary/5 transition-all cursor-pointer"
              >
                <div className="flex items-center gap-3 sm:gap-4">
                  {/* Service Image */}
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-lg sm:rounded-xl overflow-hidden flex-shrink-0">
                    <img 
                      src={item.image}
                      alt={item.service}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground text-sm sm:text-base">{item.service}</h4>
                    <div className="flex items-center gap-2 sm:gap-3 mt-0.5">
                      <span className="text-xs sm:text-sm text-muted-foreground line-through">₹{item.market}</span>
                      <span className="text-sm sm:text-base font-bold text-foreground">₹{item.ours}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 sm:gap-4">
                  <span className="px-2 sm:px-3 py-1 sm:py-1.5 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 text-[10px] sm:text-xs font-bold rounded-full whitespace-nowrap">
                    {calculateSaving(item.market, item.ours)}% off
                  </span>
                  <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all hidden sm:block" />
                </div>
              </motion.div>
            ))}
            
            {/* Total Savings Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="mt-4 sm:mt-6 p-4 sm:p-6 bg-foreground rounded-xl sm:rounded-2xl text-background relative overflow-hidden"
            >
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute inset-0" style={{
                  backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)',
                  backgroundSize: '20px 20px'
                }} />
              </div>
              
              <div className="relative flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm opacity-70 mb-1">Average savings per year</p>
                  <p className="text-2xl sm:text-3xl lg:text-4xl font-bold">₹{((totalMarket - totalOurs) * 2).toLocaleString()}+</p>
                </div>
                <motion.div 
                  className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl bg-primary/20 flex items-center justify-center"
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <BadgePercent className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};