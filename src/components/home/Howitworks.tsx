import { motion } from 'framer-motion';
import { MapPin, Calendar, Wrench, CheckCircle, ArrowRight } from 'lucide-react';

const steps = [
  {
    number: '01',
    icon: MapPin,
    title: 'Select Location',
    description: 'Choose your city and preferred service location. We cover all major cities.',
    color: '#FF5733',
    image: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=300&fit=crop'
  },
  {
    number: '02',
    icon: Calendar,
    title: 'Book a Slot',
    description: 'Pick a convenient date and time. Free doorstep pickup available.',
    color: '#3B82F6',
    image: 'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=400&h=300&fit=crop'
  },
  {
    number: '03',
    icon: Wrench,
    title: 'We Service',
    description: 'Expert mechanics work on your car with real-time progress updates.',
    color: '#10B981',
    image: 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=400&h=300&fit=crop'
  },
  {
    number: '04',
    icon: CheckCircle,
    title: 'Car Delivered',
    description: 'Your car delivered back to you, sanitized and sparkling clean.',
    color: '#8B5CF6',
    image: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=400&h=300&fit=crop'
  }
];

export const HowItWorks = () => {
  return (
    <section id="how-it-works" className="py-12 sm:py-16 lg:py-24 bg-white relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] sm:w-[800px] h-[400px] sm:h-[800px] rounded-full opacity-30"
          style={{
            background: 'radial-gradient(circle, rgba(255,87,51,0.05) 0%, transparent 60%)'
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
          <span className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-gray-100 text-gray-600 text-[10px] sm:text-xs font-semibold uppercase tracking-wider mb-3 sm:mb-4">
            How It Works
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 tracking-tight mb-4 sm:mb-6">
            Car service in
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-500">4 simple steps.</span>
          </h2>
          <p className="text-sm sm:text-base lg:text-lg text-gray-500">
            We've simplified car maintenance so you can focus on what matters most.
          </p>
        </motion.div>

        {/* Steps - Desktop Timeline */}
        <div className="hidden lg:block relative">
          {/* Timeline Line */}
          <div className="absolute top-24 left-0 right-0 h-1 bg-gray-100">
            <motion.div 
              className="h-full bg-gradient-to-r from-orange-500 via-blue-500 to-purple-500"
              initial={{ width: '0%' }}
              whileInView={{ width: '100%' }}
              viewport={{ once: true }}
              transition={{ duration: 1.5, ease: 'easeOut' }}
            />
          </div>

          <div className="grid grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="relative"
              >
                {/* Step Number Circle */}
                <motion.div 
                  className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-6 relative z-10 shadow-lg"
                  style={{ backgroundColor: step.color }}
                  whileHover={{ scale: 1.1 }}
                >
                  <span className="text-white font-bold text-sm">{step.number}</span>
                </motion.div>

                {/* Image Card */}
                <motion.div 
                  className="relative rounded-2xl overflow-hidden mb-6 h-40 group"
                  whileHover={{ y: -5 }}
                >
                  <img 
                    src={step.image} 
                    alt={step.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div 
                    className="absolute bottom-4 left-4 w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: `${step.color}30` }}
                  >
                    <step.icon className="w-5 h-5" style={{ color: step.color }} />
                  </div>
                </motion.div>

                {/* Content */}
                <h3 className="text-lg font-bold text-gray-900 mb-2 text-center">
                  {step.title}
                </h3>
                <p className="text-sm text-gray-500 text-center leading-relaxed">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Steps - Mobile/Tablet View */}
        <div className="lg:hidden space-y-6 sm:space-y-8">
          {steps.map((step, index) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: index * 0.1 }}
              className="flex gap-4 sm:gap-6"
            >
              {/* Left: Number & Line */}
              <div className="flex flex-col items-center">
                <motion.div 
                  className="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center shadow-lg flex-shrink-0"
                  style={{ backgroundColor: step.color }}
                  whileHover={{ scale: 1.1 }}
                >
                  <span className="text-white font-bold text-xs sm:text-sm">{step.number}</span>
                </motion.div>
                {index < steps.length - 1 && (
                  <div className="w-0.5 flex-1 mt-2" style={{ backgroundColor: `${step.color}30` }} />
                )}
              </div>

              {/* Right: Content */}
              <div className="flex-1 pb-6 sm:pb-8">
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                  {/* Image */}
                  <div className="sm:w-32 h-24 sm:h-24 rounded-xl overflow-hidden flex-shrink-0">
                    <img 
                      src={step.image} 
                      alt={step.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  {/* Text */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1 sm:mb-2">
                      <step.icon className="w-4 h-4 sm:w-5 sm:h-5" style={{ color: step.color }} />
                      <h3 className="text-base sm:text-lg font-bold text-gray-900">
                        {step.title}
                      </h3>
                    </div>
                    <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div 
          className="text-center mt-10 sm:mt-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
        >
          <button className="inline-flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-gray-900 text-white font-semibold rounded-full hover:bg-black transition-all text-sm sm:text-base hover:shadow-xl group">
            Book Your Service Now
            <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </motion.div>
      </div>
    </section>
  );
};