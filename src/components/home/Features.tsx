import { motion } from 'framer-motion';
import { 
  Shield, 
  Clock, 
  BadgePercent, 
  MapPin, 
  Smartphone, 
  Award, 
  CheckCircle,
  Zap,
  Star,
  Wrench
} from 'lucide-react';
import { useContent } from '../../admin-portal';

// Icon mapping for dynamic icon rendering
const iconMap: Record<string, React.ComponentType<{ className?: string; style?: React.CSSProperties }>> = {
  Shield,
  Clock,
  BadgePercent,
  MapPin,
  Smartphone,
  Award,
  CheckCircle,
  Zap,
  Star,
  Wrench,
};

export const Features = () => {
  // Get content from context
  const { content } = useContent();
  const featuresContent = content.features;

  return (
    <section id='features' className="py-12 sm:py-16 lg:py-24 bg-gray-50 relative overflow-hidden">
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
            {featuresContent.badge}
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 tracking-tight mb-4 sm:mb-6">
            {featuresContent.headline.line1}
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary">
              {featuresContent.headline.highlight}
            </span>
          </h2>
          <p className="text-sm sm:text-base lg:text-lg text-gray-500">
            {featuresContent.description}
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
                src={featuresContent.mainFeature.image}
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
                  {featuresContent.mainFeature.badge}
                </span>
                <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-3 sm:mb-4">
                  {featuresContent.mainFeature.title}
                </h3>
                <p className="text-gray-400 text-sm sm:text-base mb-4 sm:mb-6 leading-relaxed">
                  {featuresContent.mainFeature.description}
                </p>
                <ul className="space-y-2 sm:space-y-3">
                  {featuresContent.mainFeature.highlights.map((item, idx) => (
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
          {featuresContent.items.map((feature, index) => {
            const IconComponent = iconMap[feature.icon] || Award;
            
            return (
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
                  {feature.image ? (
                    <img
                      src={feature.image}
                      alt={feature.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  ) : (
                    <div 
                      className="w-full h-full flex items-center justify-center"
                      style={{ backgroundColor: `${feature.color}15` }}
                    >
                      <IconComponent 
                        className="w-16 h-16 opacity-30"
                        style={{ color: feature.color }}
                      />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div
                    className="absolute bottom-3 sm:bottom-4 left-3 sm:left-4 w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: `${feature.color}20` }}
                  >
                    <IconComponent
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
            );
          })}
        </div>
      </div>
    </section>
  );
};