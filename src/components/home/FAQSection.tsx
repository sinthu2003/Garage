import { useState, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { ChevronDown, Phone, MessageCircle, ArrowRight, Mail } from 'lucide-react';
import { useFAQContent } from '../../admin-portal/hooks/useContentHooks';
import type { FAQItem, FAQContactCard } from '../../admin-portal/types/content.types';

export const FAQSection = () => {
  const content = useFAQContent();
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  const faqs = content.items || [];

  const getContactStyles = (type: string) => {
    switch (type) {
      case 'whatsapp':
        return {
          container: "hover:bg-green-50 dark:hover:bg-green-900/20 hover:border-green-200 dark:hover:border-green-800",
          iconBg: "bg-green-100 dark:bg-green-900/30 group-hover:bg-green-500",
          icon: "text-green-500 group-hover:text-white",
          arrow: "group-hover:text-green-500",
          Icon: MessageCircle
        };
      case 'email':
        return {
          container: "hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:border-blue-200 dark:hover:border-blue-800",
          iconBg: "bg-blue-100 dark:bg-blue-900/30 group-hover:bg-blue-500",
          icon: "text-blue-500 group-hover:text-white",
          arrow: "group-hover:text-blue-500",
          Icon: Mail
        };
      default:
        return {
          container: "hover:bg-primary/10 hover:border-primary/20",
          iconBg: "bg-primary/10 group-hover:bg-primary",
          icon: "text-primary group-hover:text-primary-foreground",
          arrow: "group-hover:text-primary",
          Icon: Phone
        };
    }
  };

  return (
    <section id="faq" ref={sectionRef} className="py-16 sm:py-20 lg:py-24 bg-background relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full opacity-30 bg-primary/5"
          style={{ filter: 'blur(100px)' }}
        />
        <div
          className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full opacity-20 bg-primary/5"
          style={{ filter: 'blur(80px)' }}
        />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl relative z-10">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-start">

          {/* Left - Contact Details */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <div>
              <motion.span 
                className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-semibold uppercase tracking-wider mb-4"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
                transition={{ delay: 0.1 }}
              >
                {content.badge || 'FAQ'}
              </motion.span>

              <motion.h2 
                className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground tracking-tight mb-4"
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ delay: 0.2 }}
              >
                {content.headline?.line1 || 'Frequently Asked'}
                <br />
                <span className="text-primary">{content.headline?.highlight || 'Questions'}</span>
              </motion.h2>

              <motion.p 
                className="text-muted-foreground text-base sm:text-lg mb-6 max-w-md"
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ delay: 0.3 }}
              >
                {content.description || "Everything you need to know about our car service. Can't find your answer? Contact us."}
              </motion.p>
            </div>

            {/* Contact Cards */}
            <div className="space-y-3">
              {(content.contactCards || []).map((card: FAQContactCard, idx: number) => {
                const styles = getContactStyles(card.type);
                const { Icon } = styles;
                return (
                  <motion.a
                    key={idx}
                    href={card.href}
                    target={card.type === 'whatsapp' || card.type === 'email' ? "_blank" : undefined}
                    rel={card.type === 'whatsapp' || card.type === 'email' ? "noopener noreferrer" : undefined}
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                    transition={{ delay: 0.4 + idx * 0.1 }}
                    className={`flex items-center gap-4 p-4 bg-secondary rounded-xl border border-border transition-all group ${styles.container}`}
                    whileHover={{ x: 5 }}
                  >
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${styles.iconBg}`}>
                      <Icon className={`w-5 h-5 transition-colors ${styles.icon}`} />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-muted-foreground">{card.label}</p>
                      <p className="font-semibold text-foreground">{card.value}</p>
                    </div>
                    <ArrowRight className={`w-5 h-5 text-muted-foreground transition-colors ${styles.arrow}`} />
                  </motion.a>
                );
              })}
            </div>
          </motion.div>

          {/* Right - FAQ Accordion */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 30 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="space-y-3">
              {faqs.map((faq: FAQItem, index: number) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className={`rounded-xl border overflow-hidden transition-all ${openIndex === index
                    ? 'border-primary/20 bg-primary/5 shadow-sm'
                    : 'border-border bg-card hover:border-border'
                    }`}
                >
                  <button
                    onClick={() => setOpenIndex(openIndex === index ? null : index)}
                    className="w-full flex items-center justify-between p-4 sm:p-5 text-left"
                  >
                    <span className={`font-semibold pr-4 text-sm sm:text-base ${openIndex === index ? 'text-primary' : 'text-foreground'
                      }`}>
                      {faq.question}
                    </span>
                    <motion.div
                      animate={{ rotate: openIndex === index ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                      className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${openIndex === index ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground'
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
                        <div className="px-4 sm:px-5 pb-4 sm:pb-5">
                          <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
                            {faq.answer}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};