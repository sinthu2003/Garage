import { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { 
  Phone, 
  MessageCircle, 
  Mail, 
  MapPin, 
  Send,
  CheckCircle,
  Calendar,
  Clock,
  AlertCircle
} from 'lucide-react';
import { useFAQContent } from '../admin-portal';
import { bookingApi } from '../services/api';

// Default business hours if not set in content
const defaultBusinessHours = [
  { day: 'Monday - Friday', hours: '8:00 AM - 7:00 PM' },
  { day: 'Saturday', hours: '9:00 AM - 5:00 PM' },
  { day: 'Sunday', hours: 'Closed' }
];

// Default service options
const defaultServiceOptions = [
  { value: 'general-service', label: 'General Service' },
  { value: 'ac-service', label: 'AC Service & Repair' },
  { value: 'brake-service', label: 'Brake Service' },
  { value: 'battery-replacement', label: 'Battery Replacement' },
  { value: 'tyre-service', label: 'Tyre Service' },
  { value: 'denting-painting', label: 'Denting & Painting' },
  { value: 'engine-repair', label: 'Engine Repair' },
  { value: 'other', label: 'Other' },
];

export const ContactUsPage = () => {
  const content = useFAQContent();
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-50px" });

  // Get content values with defaults
  const businessHours = content.businessHours || defaultBusinessHours;
  const serviceOptions = content.contactPage?.serviceOptions || defaultServiceOptions;
  const formTitle = content.contactPage?.formTitle || 'Send us a Message';
  const formSubtitle = content.contactPage?.formSubtitle || "We'll get back to you within 24 hours";
  const submitButton = content.contactPage?.submitButton || 'Send Message';
  const successMessage = content.contactPage?.successMessage || 'Thank you for contacting us. We\'ll respond soon.';
  const callNowHref = content.contactPage?.callNowHref || 'tel:+919876543210';
  const whatsappHref = content.contactPage?.whatsappHref || 'https://wa.me/919876543210';
  const emailHref = content.contactPage?.emailHref || 'mailto:info@addaxauto.com';

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (error) setError(null);
  };

const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    
    try {
      // FIX: Changed submitContact to contact to match the API definition
      const result = await bookingApi.contact({
        name: formData.name,
        email: formData.email,
        phone: formData.phone || '', // Ensure it's a string, as API expects string
        // The following fields might trigger type errors if not in ContactSubmitData interface
        // You can remove them if strict typing is enforced, or cast as any if backend accepts them
        // countryCode: '+91',
        service: formData.service || undefined,
        message: formData.message,
        // source: 'contact_page',
        // sourcePage: window.location.pathname,
      } as any); // Casting to 'any' allows passing extra fields (like source) if the backend supports them but types don't

      console.log('Contact form submitted successfully:', result);
      
      setIsSubmitted(true);
      
      // Reset form after showing success
      setTimeout(() => {
        setFormData({ name: '', email: '', phone: '', service: '', message: '' });
        setIsSubmitted(false);
      }, 3000);

    } catch (err: any) {
      console.error('Contact form submission error:', err);
      
      // Extract validation errors if available
      let errorMessage = 'Failed to send message. Please try again or contact us directly.';
      
      if (err?.response?.data?.errors?.length > 0) {
        // Show first validation error
        errorMessage = err.response.data.errors[0].message;
      } else if (err?.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section ref={sectionRef} className="py-10 sm:py-12 lg:py-16 bg-background relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full opacity-20 bg-primary/5"
          style={{ filter: 'blur(80px)' }}
        />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl relative z-10">
        {/* Page Header - Compact */}
        <motion.div 
          className="text-center max-w-2xl mx-auto mb-8 sm:mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
        >
          <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold uppercase tracking-wider mb-3">
            {content.contactBadge || 'Contact Us'}
          </span>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground tracking-tight mb-2">
            {content.contactHeadline?.line1 || 'Get in'}
            <span className="text-primary"> {content.contactHeadline?.highlight || ' Touch'}</span>
          </h1>

          <p className="text-muted-foreground text-sm sm:text-base">
            {content.contactDescription || "Visit our service center or reach out to us. We're here to help with all your car service needs."}
          </p>
        </motion.div>

        {/* Main Content - Equal Height Columns */}
        <div className="grid lg:grid-cols-2 gap-6 lg:gap-8 items-stretch">
          {/* Left Column - Map & Business Hours */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col gap-4"
          >
            {/* Map */}
            {content.mapEmbedUrl && (
              <div className="rounded-xl overflow-hidden border border-border shadow-sm flex-1 flex flex-col bg-card">
                <div className="p-3 border-b border-border">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                      <MapPin className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground text-sm">Our Location</h3>
                      <p className="text-xs text-muted-foreground">Find us on the map</p>
                    </div>
                  </div>
                </div>
                
                {(() => {
                  let finalUrl = content.mapEmbedUrl;

                  if (finalUrl.includes('google.com/maps/place/')) {
                    const parts = finalUrl.split('/place/');
                    if (parts.length > 1) {
                      const placeInfo = parts[1].split('/@');
                      const placeName = placeInfo[0];
                      if (placeInfo.length > 1) {
                        const coords = placeInfo[1].split(',');
                        if (coords.length >= 2) {
                          finalUrl = `https://maps.google.com/maps?q=${placeName || coords.slice(0, 2).join(',')}&t=&z=15&ie=UTF8&iwloc=&output=embed`;
                        }
                      } else {
                        finalUrl = `https://maps.google.com/maps?q=${placeName}&t=&z=15&ie=UTF8&iwloc=&output=embed`;
                      }
                    }
                  } else if (finalUrl.includes('google.com/maps') && !finalUrl.includes('embed')) {
                    finalUrl += '&output=embed';
                  }

                  return (
                    <iframe
                      src={finalUrl}
                      width="100%"
                      height="100%"
                      style={{ border: 0, minHeight: '280px' }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      title="Addax Automotive Location"
                      className="w-full flex-1"
                    />
                  );
                })()}
              </div>
            )}

            {/* Business Hours - Compact */}
            <div className="p-4 bg-card rounded-xl border border-border">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Clock className="w-4 h-4 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground text-sm">Business Hours</h3>
              </div>
              
              <div className="space-y-2">
                {businessHours.map((item: { day: string; hours: string }, idx: number) => (
                  <div key={idx} className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{item.day}</span>
                    <span className={`font-medium ${item.hours.toLowerCase() === 'closed' ? 'text-red-500' : 'text-foreground'}`}>
                      {item.hours}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Right Column - Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="h-full"
          >
            <div className="bg-card rounded-xl border border-border p-5 sm:p-6 shadow-sm h-full flex flex-col">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h2 className="font-semibold text-foreground">{formTitle}</h2>
                  <p className="text-xs text-muted-foreground">{formSubtitle}</p>
                </div>
              </div>

              {isSubmitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-8 flex-1 flex flex-col justify-center"
                >
                  <div className="w-14 h-14 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-3">
                    <CheckCircle className="w-7 h-7 text-green-500" />
                  </div>
                  <h3 className="text-lg font-bold text-foreground mb-1">Message Sent!</h3>
                  <p className="text-muted-foreground text-sm">{successMessage}</p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4 flex-1 flex flex-col">
                  {/* Error Message */}
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400 text-sm"
                    >
                      <AlertCircle className="w-4 h-4 flex-shrink-0" />
                      <span>{error}</span>
                    </motion.div>
                  )}

                  {/* Name Input */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      placeholder="Enter your full name"
                      className="w-full px-3 py-2.5 bg-secondary/50 border border-border rounded-lg text-foreground text-sm placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                    />
                  </div>

                  {/* Email & Phone Row */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1.5">
                        Email <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        placeholder="your@email.com"
                        className="w-full px-3 py-2.5 bg-secondary/50 border border-border rounded-lg text-foreground text-sm placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1.5">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="+91 98765 43210"
                        className="w-full px-3 py-2.5 bg-secondary/50 border border-border rounded-lg text-foreground text-sm placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                      />
                    </div>
                  </div>

                  {/* Service Selection */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">
                      Service Interested In
                    </label>
                    <select
                      name="service"
                      value={formData.service}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2.5 bg-secondary/50 border border-border rounded-lg text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all appearance-none cursor-pointer"
                    >
                      <option value="">Select a service</option>
                      {serviceOptions.map((option: { value: string; label: string }) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Message */}
                  <div className="flex-1 flex flex-col">
                    <label className="block text-sm font-medium text-foreground mb-1.5">
                      Message <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                      minLength={10}
                      maxLength={5000}
                      rows={3}
                      placeholder="Tell us about your car service needs... (min 10 characters)"
                      className="w-full px-3 py-2.5 bg-secondary/50 border border-border rounded-lg text-foreground text-sm placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all resize-none flex-1 min-h-[80px]"
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full flex items-center justify-center gap-2 px-5 py-3 bg-primary text-primary-foreground font-semibold rounded-lg hover:opacity-90 transition-all disabled:opacity-70 disabled:cursor-not-allowed text-sm"
                  >
                    {isSubmitting ? (
                      <>
                        <motion.div
                          className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full"
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                        />
                        Sending...
                      </>
                    ) : (
                      <>
                        {submitButton}
                        <Send className="w-4 h-4" />
                      </>
                    )}
                  </button>

                  {/* Quick Contact Options */}
                  <div className="pt-3 border-t border-border">
                    <p className="text-center text-xs text-muted-foreground mb-2">
                      Or reach us directly
                    </p>
                    <div className="flex flex-wrap justify-center gap-2">
                      <a
                        href={callNowHref}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-secondary rounded-full text-xs font-medium text-foreground hover:bg-primary/10 hover:text-primary transition-all"
                      >
                        <Phone className="w-3 h-3" />
                        Call Now
                      </a>
                      <a
                        href={whatsappHref}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-green-100 dark:bg-green-900/30 rounded-full text-xs font-medium text-green-600 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-900/50 transition-all"
                      >
                        <MessageCircle className="w-3 h-3" />
                        WhatsApp
                      </a>
                      <a
                        href={emailHref}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-100 dark:bg-blue-900/30 rounded-full text-xs font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-all"
                      >
                        <Mail className="w-3 h-3" />
                        Email
                      </a>
                    </div>
                  </div>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};