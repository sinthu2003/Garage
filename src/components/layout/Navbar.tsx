import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Phone, ChevronRight } from 'lucide-react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { useContent } from '../../admin-portal';

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const location = useLocation();
  const navigate = useNavigate();

  // Get content from context
  const { content } = useContent();
  const brand = content.global.brand;
  const navbarContent = content.global.navbar;
  
  // Get nav links from content or use defaults
  const navLinks = navbarContent?.links || [
    { label: 'Services', href: '/services', isRoute: true },
    { label: 'How It Works', href: '#how-it-works' },
    { label: 'Pricing', href: '#pricing' },
    { label: 'Reviews', href: '#testimonials' },
    { label: 'FAQ', href: '#faq' },
  ];

  const isHomePage = location.pathname === '/';
  const showSolidBackground = !isHomePage || isScrolled;

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  // Close menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);

      // Only track sections on homepage
      if (isHomePage) {
        const sections = navLinks.filter((link: { isRoute?: boolean; href: string }) => !link.isRoute).map((link: { href: string }) => link.href.replace('#', ''));
        const scrollPosition = window.scrollY + 100;

        let foundSection = '';
        for (const section of sections) {
          const element = document.getElementById(section);
          if (element) {
            const { offsetTop, offsetHeight } = element;
            if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
              foundSection = section;
              break;
            }
          }
        }
        setActiveSection(foundSection);
      } else {
        // Reset active section when not on homepage
        setActiveSection('');
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isHomePage, navLinks]);

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>, href: string) => {
    if (href.startsWith('/')) {
      return;
    }
    
    e.preventDefault();
    const targetId = href.replace('#', '');
    
    if (!isHomePage) {
      navigate('/', { state: { scrollTo: targetId } });
      setIsMobileMenuOpen(false);
      return;
    }
    
    const element = document.getElementById(targetId);
    if (element) {
      const offsetTop = element.offsetTop - 80;
      window.scrollTo({ top: offsetTop, behavior: 'smooth' });
    }
    
    setIsMobileMenuOpen(false);
  };

  useEffect(() => {
    const state = location.state as { scrollTo?: string } | null;
    if (isHomePage && state?.scrollTo) {
      setTimeout(() => {
        const element = document.getElementById(state.scrollTo!);
        if (element) {
          const offsetTop = element.offsetTop - 80;
          window.scrollTo({ top: offsetTop, behavior: 'smooth' });
        }
        navigate('/', { replace: true, state: {} });
      }, 100);
    }
    
    if (isHomePage && location.hash) {
      const targetId = location.hash.replace('#', '');
      setTimeout(() => {
        const element = document.getElementById(targetId);
        if (element) {
          const offsetTop = element.offsetTop - 80;
          window.scrollTo({ top: offsetTop, behavior: 'smooth' });
        }
      }, 100);
    }
  }, [location.state, location.hash, isHomePage, navigate]);

  const handleLogoClick = (e: React.MouseEvent) => {
    setIsMobileMenuOpen(false);
    if (isHomePage) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Get logo URL
  const logoUrl = brand?.logo || brand?.logoUrl || '/assets/Logo.jpg';
  const brandName = brand?.name || 'Addax';
  const brandTagline = brand?.tagline || 'Automotive';
  const phoneNumber = brand?.phone || '+91 98765 43210';
  const ctaText = navbarContent?.ctaText || 'Book Service';

  return (
    <>
      {/* Main Navbar */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          showSolidBackground ? 'py-2' : 'py-3'
        }`}
      >
        <div 
          className={`absolute inset-0 transition-all duration-300 ${
            showSolidBackground 
              ? 'bg-white shadow-sm border-b border-gray-200' 
              : 'bg-transparent'
          }`} 
        />

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl relative z-10">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link 
              to="/"
              onClick={handleLogoClick}
              className="flex items-center gap-2.5"
            >
              <img 
                src={logoUrl} 
                alt={brandName} 
                className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl object-contain"
              />
              <div className="flex flex-col">
                <span className={`text-lg sm:text-xl font-bold tracking-tight leading-tight transition-colors ${
                  showSolidBackground ? 'text-gray-900' : 'text-white'
                }`}>
                  {brandName}
                </span>
                <span className="text-[10px] sm:text-xs font-semibold tracking-wider uppercase text-primary">
                  {brandTagline}
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-1">
              {navLinks.map((link: { label: string; href: string; isRoute?: boolean }) => {
                const isActive = link.isRoute 
                  ? location.pathname.startsWith(link.href)
                  : activeSection === link.href.replace('#', '');
                
                if (link.isRoute) {
                  return (
                    <Link
                      key={link.label}
                      to={link.href}
                      className={`relative px-4 py-2 text-sm font-medium rounded-full transition-all ${
                        isActive
                          ? 'text-primary bg-gray-100'
                          : showSolidBackground 
                            ? 'text-gray-600 hover:text-gray-900 hover:bg-gray-100' 
                            : 'text-white/80 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      {link.label}
                    </Link>
                  );
                }
                
                return (
                  <a
                    key={link.label}
                    href={link.href}
                    onClick={(e) => scrollToSection(e, link.href)}
                    className={`relative px-4 py-2 text-sm font-medium rounded-full transition-all ${
                      isActive
                        ? 'text-primary bg-gray-100'
                        : showSolidBackground 
                          ? 'text-gray-600 hover:text-gray-900 hover:bg-gray-100' 
                          : 'text-white/80 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    {link.label}
                  </a>
                );
              })}
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-3 sm:gap-4">
              <a 
                href={`tel:${phoneNumber.replace(/\s/g, '')}`}
                className={`hidden md:flex items-center gap-2 text-sm font-medium transition-colors ${
                  showSolidBackground ? 'text-gray-600 hover:text-gray-900' : 'text-white/80 hover:text-white'
                }`}
              >
                <Phone className="w-4 h-4" />
                <span>{phoneNumber}</span>
              </a>

              <Link 
                to="/services"
                className="hidden sm:flex items-center gap-2 px-5 sm:px-6 py-2 sm:py-2.5 bg-primary text-white text-sm font-semibold rounded-full hover:bg-red-600 transition-all"
              >
                {ctaText}
              </Link>

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className={`lg:hidden w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                  showSolidBackground 
                    ? 'bg-gray-100 text-gray-700' 
                    : 'bg-white/10 text-white'
                }`}
                aria-label="Open menu"
              >
                <Menu className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Dark Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/50 z-[60] lg:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            
            {/* Slide-in Menu Panel */}
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed top-0 right-0 bottom-0 w-[85%] max-w-[320px] bg-white z-[70] lg:hidden flex flex-col"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-100">
                <Link 
                  to="/"
                  onClick={handleLogoClick}
                  className="flex items-center gap-2"
                >
                  <img 
                    src={logoUrl} 
                    alt={brandName} 
                    className="w-9 h-9 rounded-lg object-contain"
                  />
                  <div className="flex flex-col">
                    <span className="text-base font-bold text-gray-900 leading-tight">{brandName}</span>
                    <span className="text-[9px] font-semibold text-primary tracking-wider uppercase">{brandTagline}</span>
                  </div>
                </Link>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center text-gray-600"
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Navigation Links */}
              <div className="flex-1 overflow-y-auto p-4">
                <nav className="space-y-1">
                  {navLinks.map((link: { label: string; href: string; isRoute?: boolean }, idx: number) => {
                    const isActive = link.isRoute 
                      ? location.pathname.startsWith(link.href)
                      : activeSection === link.href.replace('#', '');
                    
                    if (link.isRoute) {
                      return (
                        <motion.div 
                          key={link.label}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.05 }}
                        >
                          <Link
                            to={link.href}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className={`flex items-center justify-between px-4 py-3.5 rounded-xl font-medium transition-colors ${
                              isActive 
                                ? 'bg-gray-100 text-primary' 
                                : 'text-gray-700 hover:bg-gray-50'
                            }`}
                          >
                            {link.label}
                            <ChevronRight className="w-4 h-4 text-gray-400" />
                          </Link>
                        </motion.div>
                      );
                    }
                    
                    return (
                      <motion.a
                        key={link.label}
                        href={link.href}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        onClick={(e) => scrollToSection(e, link.href)}
                        className={`flex items-center justify-between px-4 py-3.5 rounded-xl font-medium transition-colors ${
                          isActive 
                            ? 'bg-gray-100 text-primary' 
                            : 'text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        {link.label}
                        <ChevronRight className="w-4 h-4 text-gray-400" />
                      </motion.a>
                    );
                  })}
                </nav>
              </div>

              {/* Footer */}
              <div className="p-4 border-t border-gray-100 bg-gray-50">
                <a 
                  href={`tel:${phoneNumber.replace(/\s/g, '')}`}
                  className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:text-gray-900 transition-colors"
                >
                  <Phone className="w-5 h-5" />
                  <span className="font-medium">{phoneNumber}</span>
                </a>
                <Link 
                  to="/services"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block w-full py-3.5 bg-primary text-white font-semibold rounded-xl hover:bg-red-600 transition-colors text-center mt-2"
                >
                  {ctaText}
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};