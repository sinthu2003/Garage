import { motion } from 'framer-motion';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  ChevronRight,
  ArrowUp
} from 'lucide-react';
import { useContent } from '../../admin-portal';
import { useNavigate, useLocation } from 'react-router-dom'; // Import router hooks

// Social icon mapping
const socialIconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  facebook: Facebook,
  twitter: Twitter,
  instagram: Instagram,
  youtube: Youtube,
};

// Default footer links
const defaultFooterLinks = {
  services: [
    { name: 'Periodic Service', href: '#services' },
    { name: 'AC Service & Repair', href: '#services' },
    { name: 'Denting & Painting', href: '#services' },
    { name: 'Car Inspection', href: '#services' },
    { name: 'Wheel Care', href: '#services' },
    { name: 'Battery Service', href: '#services' },
  ],
  company: [
    { name: 'About Us', href: '#' },
    { name: 'Careers', href: '#' },
    { name: 'Blog', href: '/blog' },
    { name: 'Press', href: '#' },
    { name: 'Partners', href: '#' },
  ],
  support: [
    { name: 'Help Center', href: '#' },
    { name: 'Contact Us', href: '#' },
    { name: 'FAQs', href: '#faq' },
    { name: 'Terms of Service', href: '/terms-of-service' },
    { name: 'Privacy Policy', href: '/privacy-policy' },
    { name: 'Warranty Policy', href: '/warranty-policy' },
  ],
  cities: ['Coimbatore', 'Chennai', 'Bangalore', 'Hyderabad', 'Mumbai', 'Delhi', 'Pune', 'Kolkata']
};

export const Footer = () => {
  // Get content from context
  const { content } = useContent();
  const navigate = useNavigate(); // Hook for navigation
  const location = useLocation(); // Hook to check current page

  const footerContent = content.footer;
  const globalBrand = content.global.brand;

  // Use footer content with fallback to global brand
  const brandName = footerContent?.brandName || globalBrand?.name || 'Addax';
  const brandTagline = footerContent?.tagline || globalBrand?.tagline || 'Automotive';
  const logoUrl = footerContent?.logoUrl || globalBrand?.logo || globalBrand?.logoUrl || '/assets/Logo.jpg';
  const description = footerContent?.description || "India's leading car service network offering quality repairs at transparent prices with doorstep convenience.";
  const phoneNumber = footerContent?.phone || globalBrand?.phone || '+91 98765 43210';
  const email = footerContent?.email || globalBrand?.email || 'support@addaxautomotive.in';
  const workingHours = footerContent?.workingHours || 'Mon-Sun: 8AM - 8PM';

  // Handle copyright - can be string or object
  const getCopyrightText = (): string => {
    const copyrightValue = footerContent?.copyright;
    if (!copyrightValue) {
      return `© ${new Date().getFullYear()} ${brandName} ${brandTagline}. All rights reserved.`;
    }
    if (typeof copyrightValue === 'string') {
      return copyrightValue;
    }
    // If it's an object (FooterCopyright type), extract text
    if (typeof copyrightValue === 'object' && 'text' in copyrightValue) {
      return copyrightValue.text || `© ${new Date().getFullYear()} ${brandName} ${brandTagline}. All rights reserved.`;
    }
    return `© ${new Date().getFullYear()} ${brandName} ${brandTagline}. All rights reserved.`;
  };

  const copyright = getCopyrightText();

  // Get links from footer content with proper typing
  const getFooterLinks = () => {
    const links = footerContent?.links;
    if (!links) return defaultFooterLinks;

    // Normalize services links
    const services = Array.isArray(links.services)
      ? links.services.map((link: { name?: string; label?: string; href?: string }) => ({
        name: link.name || link.label || '',
        href: link.href || '#'
      }))
      : defaultFooterLinks.services;

    // Normalize company links
    const company = Array.isArray(links.company)
      ? links.company.map((link: { name?: string; label?: string; href?: string }) => ({
        name: link.name || link.label || '',
        href: link.href || '#'
      }))
      : defaultFooterLinks.company;

    // Normalize support links
    const support = Array.isArray(links.support)
      ? links.support.map((link: { name?: string; label?: string; href?: string }) => ({
        name: link.name || link.label || '',
        href: link.href || '#'
      }))
      : defaultFooterLinks.support;

    // Cities can be string array or undefined
    const cities = Array.isArray(links.cities) ? links.cities : defaultFooterLinks.cities;

    return { services, company, support, cities };
  };

  const footerLinks = getFooterLinks();

  // Get social links from footer or global
  const socialLinks = footerContent?.social || content.global.social || {};

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    // 1. Handle Hash Links (e.g., #services, #faq)
    if (href.startsWith('#') && href !== '#') {
      e.preventDefault();
      const targetId = href.replace('#', '');

      if (location.pathname === '/') {
        // If we are on Home Page - Scroll directly to the section
        const element = document.getElementById(targetId);
        if (element) {
          const offsetTop = element.offsetTop - 80;
          window.scrollTo({ top: offsetTop, behavior: 'smooth' });
        }
      } else {
        // If we are NOT on Home Page - Navigate to Home first
        // The URL will become /#services, and standard browser behavior should handle the jump
        // (Assuming your AppRouter doesn't forcefully scroll to top on hash change)
        navigate(`/${href}`);
      }
    }
    // 2. Handle Internal Page Links (e.g., /contact, /services)
    else if (href.startsWith('/')) {
      e.preventDefault();
      navigate(href);
      window.scrollTo(0, 0); // Ensure we start at the top of the new page
    }
    // 3. External links (http...) will work via default <a> tag behavior
  };

  // Process copyright text with year placeholder
  const processedCopyright = copyright.replace('{year}', new Date().getFullYear().toString());

  return (
    <footer className="bg-gray-900 text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
            backgroundSize: '30px 30px'
          }}
        />
      </div>

      {/* Main Footer Content */}
      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl py-12 sm:py-16">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand Column */}
          <div className="col-span-2 md:col-span-3 lg:col-span-1">
            <a href="/" onClick={(e) => handleLinkClick(e, '/')} className="flex items-center gap-2.5 mb-6">
              <img
                src={logoUrl}
                alt={brandName}
                className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl object-contain bg-white p-1"
              />
              <div className="flex flex-col">
                <span className="text-xl sm:text-2xl font-bold leading-tight">{brandName}</span>
                <span className="text-[10px] sm:text-xs font-semibold text-primary tracking-wider uppercase">{brandTagline}</span>
              </div>
            </a>

            <p className="text-gray-400 text-sm mb-6 leading-relaxed">
              {description}
            </p>

            {/* Contact Info */}
            <div className="space-y-3">
              <a href={`tel:${phoneNumber.replace(/\s/g, '')}`} className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors text-sm">
                <Phone className="w-4 h-4 text-primary" />
                {phoneNumber}
              </a>
              <a href={`mailto:${email}`} className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors text-sm">
                <Mail className="w-4 h-4 text-primary" />
                {email}
              </a>
              <div className="flex items-center gap-3 text-gray-400 text-sm">
                <Clock className="w-4 h-4 text-primary" />
                {workingHours}
              </div>
            </div>

            {/* Social Links */}
            <div className="flex gap-3 mt-6">
              {Object.entries(socialLinks).map(([platform, url]) => {
                const IconComponent = socialIconMap[platform.toLowerCase()];
                if (!IconComponent || !url) return null;

                return (
                  <motion.a
                    key={platform}
                    href={url as string}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.1, y: -2 }}
                    className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-white/10 flex items-center justify-center text-gray-400 hover:bg-primary hover:text-white transition-colors"
                    aria-label={platform}
                  >
                    <IconComponent className="w-4 h-4 sm:w-5 sm:h-5" />
                  </motion.a>
                );
              })}
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-semibold text-white mb-4 sm:mb-5 text-sm sm:text-base">Services</h4>
            <ul className="space-y-2 sm:space-y-3">
              {footerLinks.services.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    onClick={(e) => handleLinkClick(e, link.href)}
                    className="text-gray-400 hover:text-primary transition-colors text-xs sm:text-sm flex items-center gap-1 group"
                  >
                    <ChevronRight className="w-3 h-3 opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold text-white mb-4 sm:mb-5 text-sm sm:text-base">Company</h4>
            <ul className="space-y-2 sm:space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    onClick={(e) => handleLinkClick(e, link.href)}
                    className="text-gray-400 hover:text-primary transition-colors text-xs sm:text-sm flex items-center gap-1 group"
                  >
                    <ChevronRight className="w-3 h-3 opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold text-white mb-4 sm:mb-5 text-sm sm:text-base">Support</h4>
            <ul className="space-y-2 sm:space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    onClick={(e) => handleLinkClick(e, link.href)}
                    className="text-gray-400 hover:text-primary transition-colors text-xs sm:text-sm flex items-center gap-1 group"
                  >
                    <ChevronRight className="w-3 h-3 opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Cities */}
          <div>
            <h4 className="font-semibold text-white mb-4 sm:mb-5 text-sm sm:text-base flex items-center gap-2">
              <MapPin className="w-4 h-4 text-primary" />
              We Serve
            </h4>
            <ul className="space-y-2 sm:space-y-3">
              {footerLinks.cities.map((city) => (
                <li key={city}>
                  <a
                    href="#"
                    onClick={(e) => e.preventDefault()}
                    className="text-gray-400 hover:text-primary transition-colors text-xs sm:text-sm"
                  >
                    {city}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="relative border-t border-white/10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl py-5 sm:py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-gray-400 text-xs sm:text-sm text-center sm:text-left">
              {processedCopyright}
            </p>

            <div className="flex items-center gap-4 sm:gap-6">
              <a
                href={footerContent?.privacyUrl || '#'}
                onClick={(e) => handleLinkClick(e, footerContent?.privacyUrl || '#')}
                className="text-gray-400 hover:text-white text-xs sm:text-sm transition-colors"
              >
                Privacy Policy
              </a>
              <a
                href={footerContent?.termsUrl || '#'}
                onClick={(e) => handleLinkClick(e, footerContent?.termsUrl || '#')}
                className="text-gray-400 hover:text-white text-xs sm:text-sm transition-colors"
              >
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll to Top Button */}
      <motion.button
        onClick={scrollToTop}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="fixed bottom-6 right-6 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-primary text-white flex items-center justify-center shadow-lg shadow-black/30 z-40 border border-primary/30"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
      >
        <ArrowUp className="w-5 h-5" />
      </motion.button>
    </footer>
  );
};