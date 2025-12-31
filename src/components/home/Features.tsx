import { motion } from 'framer-motion';
import { Shield, Clock, BadgePercent, MapPin, Smartphone, Award, CheckCircle } from 'lucide-react';

const features = [
  {
    icon: Shield,
    title: '6-Month Warranty',
    description: 'Comprehensive warranty coverage on all parts and labor for your peace of mind.',
    color: '#3B82F6',
    image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400&h=300&fit=crop'
  },
  {
    icon: BadgePercent,
    title: 'Save up to 40%',
    description: 'Get the same quality service at prices much lower than authorized centers.',
    color: '#10B981',
    image: 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=400&h=300&fit=crop'
  },
  {
    icon: Clock,
    title: 'Quick Turnaround',
    description: 'Most services completed within the same day. No more long waiting times.',
    color: '#FF5733',
    image: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=400&h=300&fit=crop'
  },
  {
    icon: MapPin,
    title: 'Free Pickup & Drop',
    description: 'Doorstep service with complimentary pickup and delivery at your convenience.',
    color: '#8B5CF6',
    image: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=300&fit=crop'
  },
  {
    icon: Smartphone,
    title: 'Real-time Updates',
    description: 'Track your service progress with live updates, photos, and notifications.',
    color: '#EC4899',
    image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&h=300&fit=crop'
  },
  {
    icon: Award,
    title: 'Expert Mechanics',
    description: '500+ certified professionals with years of experience across all brands.',
    color: '#F59E0B',
    image: 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=400&h=300&fit=crop'
  }
];

export const Features = () => {
  return (
    <section className="py-12 sm:py-16 lg:py-24 bg-gray-50 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div 
          className="absolute top-0 right-0 w-[300px] sm:w-[600px] h-[300px] sm:h-[600px] rounded-full opacity-30"
          style={{
            background: 'radial-gradient(circle, rgba(255,87,51,0.08) 0%, transparent 70%)'
          }}
        />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl relative z-10">
        {/* Header */}
        <motion.div 
          className="text-center max-w-2xl mx-auto mb-10 sm:mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-primary/10 text-primary text-[10px] sm:text-xs font-semibold uppercase tracking-wider mb-3 sm:mb-4">
            Why Choose Us
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 tracking-tight mb-4 sm:mb-6">
            Built for
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary">modern car owners.</span>
          </h2>
          <p className="text-sm sm:text-base lg:text-lg text-gray-500">
            We've reimagined car service with technology, transparency, and trust.
          </p>
        </motion.div>

        {/* Main Feature Highlight */}
        <motion.div
          className="relative rounded-2xl sm:rounded-3xl overflow-hidden mb-10 sm:mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="grid lg:grid-cols-2">
            {/* Image Side */}
            <div className="relative h-64 sm:h-80 lg:h-auto">
              <img 
                src="https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                alt="Car Service Workshop"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent to-gray-900/50 lg:hidden" />
            </div>
            
            {/* Content Side */}
            <div className="bg-gray-900 p-6 sm:p-8 lg:p-12 flex flex-col justify-center">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
              >
                <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/20 text-primary text-xs font-semibold mb-4 sm:mb-6">
                  <Award className="w-4 h-4" />
                  Premium Quality
                </span>
                <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-3 sm:mb-4">
                  State-of-the-art Workshop with Modern Equipment
                </h3>
                <p className="text-gray-400 text-sm sm:text-base mb-4 sm:mb-6 leading-relaxed">
                  Our workshops are equipped with the latest diagnostic tools and equipment 
                  to ensure your car receives the best possible care.
                </p>
                <ul className="space-y-2 sm:space-y-3">
                  {['Advanced Diagnostics', 'Genuine Parts', 'Trained Technicians'].map((item, idx) => (
                    <motion.li 
                      key={idx}
                      className="flex items-center gap-2 sm:gap-3 text-gray-300 text-sm sm:text-base"
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.3 + idx * 0.1 }}
                    >
                      <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 flex-shrink-0" />
                      {item}
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -8 }}
              className="group bg-white rounded-xl sm:rounded-2xl overflow-hidden border border-gray-100 hover:shadow-xl hover:border-gray-200 transition-all duration-300"
            >
              {/* Image */}
              <div className="relative h-32 sm:h-40 overflow-hidden">
                <img 
                  src={feature.image}
                  alt={feature.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div 
                  className="absolute bottom-3 sm:bottom-4 left-3 sm:left-4 w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: `${feature.color}20` }}
                >
                  <feature.icon 
                    className="w-5 h-5 sm:w-6 sm:h-6"
                    style={{ color: feature.color }}
                  />
                </div>
              </div>

              {/* Content */}
              <div className="p-4 sm:p-6">
                <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-1 sm:mb-2">
                  {feature.title}
                </h3>
                <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};