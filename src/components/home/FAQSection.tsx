import { useState, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { ChevronDown, Phone, MessageCircle, ArrowRight } from 'lucide-react';

const faqs = [
  {
    question: "How does doorstep car service work?",
    answer: "Simply book a service through our app or website. Our mechanic will arrive at your location with all tools and equipment. After service completion, pay online or cash."
  },
  {
    question: "What warranty do you provide?",
    answer: "We provide 6-month/10,000 km warranty on all services and parts. Any defects in workmanship or parts are fixed free of charge."
  },
  {
    question: "Are your mechanics certified?",
    answer: "Yes! All mechanics are trained and certified with 5+ years average experience. They undergo background checks and continuous training."
  },
  {
    question: "Do you use genuine spare parts?",
    answer: "We source parts directly from authorized dealers and OEM suppliers. Every part comes with documentation and warranty."
  },
  {
    question: "Can I track my service in real-time?",
    answer: "Yes! Get real-time updates with photos and videos of service progress. Chat directly with your mechanic through our app."
  },
  {
    question: "How much can I save compared to authorized centers?",
    answer: "Save 30-40% on average compared to authorized service centers while maintaining the same quality standards."
  }
];

export const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  return (
    <section ref={sectionRef} className="py-16 sm:py-20 lg:py-24 bg-white relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div 
          className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full opacity-30"
          style={{ background: 'radial-gradient(circle, rgba(255,87,51,0.05) 0%, transparent 70%)' }}
        />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl relative z-10">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-start">
          
          {/* Left - Header & Contact */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
            transition={{ duration: 0.6 }}
            className="lg:sticky lg:top-32"
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-orange-100 text-orange-600 text-xs font-semibold uppercase tracking-wider mb-4">
              FAQ
            </span>
            
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 tracking-tight mb-4">
              Frequently Asked
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-500">
                Questions
              </span>
            </h2>
            
            <p className="text-gray-500 text-base sm:text-lg mb-8 max-w-md">
              Everything you need to know about our car service. Can't find your answer? Contact us.
            </p>

            {/* Contact Cards */}
            <div className="space-y-3">
              <motion.a
                href="tel:+919876543210"
                className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-orange-50 hover:border-orange-200 border border-gray-100 transition-all group"
                whileHover={{ x: 5 }}
              >
                <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center group-hover:bg-orange-500 transition-colors">
                  <Phone className="w-5 h-5 text-orange-500 group-hover:text-white transition-colors" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-500">Call us at</p>
                  <p className="font-semibold text-gray-900">+91 98765 43210</p>
                </div>
                <ArrowRight className="w-5 h-5 text-gray-300 group-hover:text-orange-500 transition-colors" />
              </motion.a>

              <motion.a
                href="#"
                className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-orange-50 hover:border-orange-200 border border-gray-100 transition-all group"
                whileHover={{ x: 5 }}
              >
                <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center group-hover:bg-green-500 transition-colors">
                  <MessageCircle className="w-5 h-5 text-green-500 group-hover:text-white transition-colors" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-500">Chat with us</p>
                  <p className="font-semibold text-gray-900">WhatsApp Support</p>
                </div>
                <ArrowRight className="w-5 h-5 text-gray-300 group-hover:text-green-500 transition-colors" />
              </motion.a>
            </div>
          </motion.div>

          {/* Right - FAQ Accordion */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 30 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-3"
          >
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                className={`rounded-xl border overflow-hidden transition-all ${
                  openIndex === index 
                    ? 'border-orange-200 bg-orange-50/50 shadow-sm' 
                    : 'border-gray-100 bg-white hover:border-gray-200'
                }`}
              >
                <button
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                  className="w-full flex items-center justify-between p-5 text-left"
                >
                  <span className={`font-semibold pr-4 ${
                    openIndex === index ? 'text-orange-600' : 'text-gray-900'
                  }`}>
                    {faq.question}
                  </span>
                  <motion.div
                    animate={{ rotate: openIndex === index ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                      openIndex === index ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-500'
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </motion.div>
                </button>

                <AnimatePresence>
                  {openIndex === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="px-5 pb-5">
                        <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                          {faq.answer}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};