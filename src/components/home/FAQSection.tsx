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
    <section id="faq" ref={sectionRef} className="py-16 sm:py-20 lg:py-24 bg-background relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div 
          className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full opacity-30 bg-primary/5"
          style={{ filter: 'blur(100px)' }}
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
            <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-semibold uppercase tracking-wider mb-4">
              FAQ
            </span>
            
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground tracking-tight mb-4">
              Frequently Asked
              <br />
              <span className="text-primary">
                Questions
              </span>
            </h2>
            
            <p className="text-muted-foreground text-base sm:text-lg mb-8 max-w-md">
              Everything you need to know about our car service. Can't find your answer? Contact us.
            </p>

            {/* Contact Cards */}
            <div className="space-y-3">
              <motion.a
                href="tel:+919876543210"
                className="flex items-center gap-4 p-4 bg-secondary rounded-xl hover:bg-primary/10 border border-border hover:border-primary/20 transition-all group"
                whileHover={{ x: 5 }}
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary transition-colors">
                  <Phone className="w-5 h-5 text-primary group-hover:text-primary-foreground transition-colors" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">Call us at</p>
                  <p className="font-semibold text-foreground">+91 98765 43210</p>
                </div>
                <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
              </motion.a>

              <motion.a
                href="#"
                className="flex items-center gap-4 p-4 bg-secondary rounded-xl hover:bg-green-50 dark:hover:bg-green-900/20 border border-border hover:border-green-200 dark:hover:border-green-800 transition-all group"
                whileHover={{ x: 5 }}
              >
                <div className="w-12 h-12 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center group-hover:bg-green-500 transition-colors">
                  <MessageCircle className="w-5 h-5 text-green-500 group-hover:text-white transition-colors" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">Chat with us</p>
                  <p className="font-semibold text-foreground">WhatsApp Support</p>
                </div>
                <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-green-500 transition-colors" />
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
                    ? 'border-primary/20 bg-primary/5 shadow-sm' 
                    : 'border-border bg-card hover:border-border'
                }`}
              >
                <button
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                  className="w-full flex items-center justify-between p-5 text-left"
                >
                  <span className={`font-semibold pr-4 ${
                    openIndex === index ? 'text-primary' : 'text-foreground'
                  }`}>
                    {faq.question}
                  </span>
                  <motion.div
                    animate={{ rotate: openIndex === index ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                      openIndex === index ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground'
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
                        <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
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