import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Phone, ChevronDown, Car } from 'lucide-react';

const navLinks = [
  { label: 'Services', href: '#services' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'How It Works', href: '#how-it-works' },
  { label: 'Testimonials', href: '#testimonials' },
];

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);

      // Detect active section
      const sections = navLinks.map(link => link.href.replace('#', ''));
      const scrollPosition = window.scrollY + 100;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Smooth scroll to section
  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>, href: string) => {
    e.preventDefault();
    const targetId = href.replace('#', '');
    const element = document.getElementById(targetId);
    
    if (element) {
      const offsetTop = element.offsetTop - 80;
      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth'
      });
    }
    
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled ? 'py-3' : 'py-4'
        }`}
      >
        {/* Background */}
        <div 
          className={`absolute inset-0 transition-all duration-300 ${
            isScrolled 
              ? 'bg-white/90 backdrop-blur-xl shadow-sm border-b border-gray-100' 
              : 'bg-transparent'
          }`} 
        />

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl relative z-10">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <a 
              href="#" 
              onClick={(e) => {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="flex items-center gap-2.5"
            >
              {/* <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center shadow-lg shadow-orange-500/20">
                <Car className="w-5 h-5 text-white" />
              </div> */}
              <span className={`text-xl font-bold tracking-tight transition-colors ${
                isScrolled ? 'text-gray-900' : 'text-white'
              }`}>
                AutoCare<span className="text-orange-500 pl-0.5">PRO</span>
              </span>
            </a>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => {
                const isActive = activeSection === link.href.replace('#', '');
                return (
                  <a
                    key={link.label}
                    href={link.href}
                    onClick={(e) => scrollToSection(e, link.href)}
                    className={`relative px-4 py-2 text-sm font-medium rounded-full transition-all ${
                      isActive
                        ? isScrolled 
                          ? 'text-orange-600' 
                          : 'text-orange-400'
                        : isScrolled 
                          ? 'text-gray-600 hover:text-gray-900 hover:bg-gray-100' 
                          : 'text-white/80 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    {link.label}
                    {isActive && (
                      <motion.div
                        layoutId="navbar-active"
                        className={`absolute inset-0 rounded-full -z-10 ${
                          isScrolled ? 'bg-orange-100' : 'bg-white/10'
                        }`}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      />
                    )}
                  </a>
                );
              })}
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-4">
              {/* Phone */}
              <a 
                href="tel:+919876543210" 
                className={`hidden md:flex items-center gap-2 text-sm font-medium transition-colors ${
                  isScrolled ? 'text-gray-600 hover:text-gray-900' : 'text-white/80 hover:text-white'
                }`}
              >
                <Phone className="w-4 h-4" />
                <span>+91 98765 43210</span>
              </a>

              {/* CTA */}
              <button 
                onClick={(e) => scrollToSection(e, '#services')}
                className="hidden sm:flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-orange-500 to-red-500 text-white text-sm font-semibold rounded-full hover:shadow-lg hover:shadow-orange-500/25 transition-all duration-300"
              >
                Book Service
              </button>

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className={`lg:hidden w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                  isScrolled ? 'bg-gray-100 text-gray-600' : 'bg-white/10 text-white'
                }`}
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 lg:hidden"
          >
            {/* Overlay */}
            <div 
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            
            {/* Menu */}
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25 }}
              className="absolute top-0 right-0 bottom-0 w-80 bg-white shadow-2xl"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
                      <Car className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-xl font-bold text-gray-900">
                      AutoCare<span className="text-orange-500">PRO</span>
                    </span>
                  </div>
                  <button
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-gray-600"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <nav className="space-y-1">
                  {navLinks.map((link, idx) => {
                    const isActive = activeSection === link.href.replace('#', '');
                    return (
                      <motion.a
                        key={link.label}
                        href={link.href}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        onClick={(e) => scrollToSection(e, link.href)}
                        className={`flex items-center justify-between px-4 py-4 rounded-xl font-medium transition-colors ${
                          isActive 
                            ? 'bg-orange-50 text-orange-600' 
                            : 'text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        {link.label}
                        <ChevronDown className="w-4 h-4 -rotate-90 opacity-40" />
                      </motion.a>
                    );
                  })}
                </nav>

                <div className="mt-8 pt-8 border-t border-gray-100 space-y-4">
                  <a 
                    href="tel:+919876543210" 
                    className="flex items-center gap-3 px-4 py-3 text-gray-600"
                  >
                    <Phone className="w-5 h-5" />
                    <span className="font-medium">+91 98765 43210</span>
                  </a>
                  <button 
                    onClick={(e) => scrollToSection(e, '#services')}
                    className="w-full py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold rounded-xl"
                  >
                    Book Service Now
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};