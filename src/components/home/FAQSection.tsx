import { useState, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { ChevronDown, Phone, MessageCircle, ArrowRight, Mail, HelpCircle } from 'lucide-react';
import { useContent } from '../../admin-portal';

// Icon mapping for contact cards
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  phone: Phone,
  whatsapp: MessageCircle,
  email: Mail,
  help: HelpCircle,
};

// Color mapping for contact card types
const colorMap: Record<string, { bg: string; hoverBg: string; iconBg: string; iconHoverBg: string; iconColor: string; iconHoverColor: string; borderHover: string }> = {
  phone: {
    bg: 'bg-secondary',
    hoverBg: 'hover:bg-primary/10',
    iconBg: 'bg-primary/10',
    iconHoverBg: 'group-hover:bg-primary',
    iconColor: 'text-primary',
    iconHoverColor: 'group-hover:text-primary-foreground',
    borderHover: 'hover:border-primary/20',
  },
  whatsapp: {
    bg: 'bg-secondary',
    hoverBg: 'hover:bg-green-50 dark:hover:bg-green-900/20',
    iconBg: 'bg-green-100 dark:bg-green-900/30',
    iconHoverBg: 'group-hover:bg-green-500',
    iconColor: 'text-green-500',
    iconHoverColor: 'group-hover:text-white',
    borderHover: 'hover:border-green-200 dark:hover:border-green-800',
  },
  email: {
    bg: 'bg-secondary',
    hoverBg: 'hover:bg-blue-50 dark:hover:bg-blue-900/20',
    iconBg: 'bg-blue-100 dark:bg-blue-900/30',
    iconHoverBg: 'group-hover:bg-blue-500',
    iconColor: 'text-blue-500',
    iconHoverColor: 'group-hover:text-white',
    borderHover: 'hover:border-blue-200 dark:hover:border-blue-800',
  },
};

export const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  // Get content from context
  const { content } = useContent();
  const faqContent = content.faq;
  const faqs = faqContent.items;
  const contactCards = faqContent.contactCards;

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
              {faqContent.badge}
            </span>
            
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground tracking-tight mb-4">
              {faqContent.headline.line1}
              <br />
              <span className="text-primary">
                {faqContent.headline.highlight}
              </span>
            </h2>
            
            <p className="text-muted-foreground text-base sm:text-lg mb-8 max-w-md">
              {faqContent.description}
            </p>

            {/* Contact Cards */}
            <div className="space-y-3">
              {contactCards.map((card, idx) => {
                const IconComponent = iconMap[card.type] || Phone;
                const colors = colorMap[card.type] || colorMap.phone;
                
                return (
                  <motion.a
                    key={idx}
                    href={card.href}
                    target={card.type === 'whatsapp' ? '_blank' : undefined}
                    rel={card.type === 'whatsapp' ? 'noopener noreferrer' : undefined}
                    className={`flex items-center gap-4 p-4 ${colors.bg} rounded-xl ${colors.hoverBg} border border-border ${colors.borderHover} transition-all group`}
                    whileHover={{ x: 5 }}
                    initial={{ opacity: 0, x: -20 }}
                    animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                    transition={{ delay: 0.3 + idx * 0.1 }}
                  >
                    <div className={`w-12 h-12 rounded-xl ${colors.iconBg} flex items-center justify-center ${colors.iconHoverBg} transition-colors`}>
                      <IconComponent className={`w-5 h-5 ${colors.iconColor} ${colors.iconHoverColor} transition-colors`} />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-muted-foreground">{card.label}</p>
                      <p className="font-semibold text-foreground">{card.value}</p>
                    </div>
                    <ArrowRight className={`w-5 h-5 text-muted-foreground group-hover:${colors.iconColor.replace('text-', '')} transition-colors`} />
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