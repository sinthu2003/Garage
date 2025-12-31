import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Phone, ChevronDown } from 'lucide-react';
import Logo from '../../assets/Logo.jpg';

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

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>, href: string) => {
    e.preventDefault();
    const targetId = href.replace('#', '');
    const element = document.getElementById(targetId);
    
    if (element) {
      const offsetTop = element.offsetTop - 80;
      window.scrollTo({ top: offsetTop, behavior: 'smooth' });
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
          isScrolled ? 'py-2' : 'py-3'
        }`}
      >
        <div 
          className={`absolute inset-0 transition-all duration-300 ${
            isScrolled 
              ? 'bg-background/90 backdrop-blur-xl shadow-sm border-b border-border' 
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
              <img 
                src={Logo} 
                alt="Addax Automotive" 
                className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl object-contain"
              />
              <div className="flex flex-col">
                <span className={`text-lg sm:text-xl font-bold tracking-tight leading-tight transition-colors ${
                  isScrolled ? 'text-foreground' : 'text-white'
                }`}>
                  Addax
                </span>
                <span className="text-[10px] sm:text-xs font-semibold tracking-wider uppercase text-primary">
                  Automotive
                </span>
              </div>
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
                        ? 'text-primary'
                        : isScrolled 
                          ? 'text-muted-foreground hover:text-foreground hover:bg-secondary' 
                          : 'text-white/80 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    {link.label}
                    {isActive && (
                      <motion.div
                        layoutId="navbar-active"
                        className={`absolute inset-0 rounded-full -z-10 ${
                          isScrolled ? 'bg-primary/10' : 'bg-white/10'
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
              <a 
                href="tel:+919876543210" 
                className={`hidden md:flex items-center gap-2 text-sm font-medium transition-colors ${
                  isScrolled ? 'text-muted-foreground hover:text-foreground' : 'text-white/80 hover:text-white'
                }`}
              >
                <Phone className="w-4 h-4" />
                <span>+91 98765 43210</span>
              </a>

              {/* CTA Button - Uses theme primary */}
              <button 
                onClick={(e) => scrollToSection(e, '#services')}
                className="hidden sm:flex items-center gap-2 px-6 py-2.5 bg-primary text-primary-foreground text-sm font-semibold rounded-full hover:opacity-90 hover:shadow-lg transition-all duration-300"
              >
                Book Service
              </button>

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className={`lg:hidden w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                  isScrolled ? 'bg-secondary text-foreground' : 'bg-white/10 text-white'
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
            <div 
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25 }}
              className="absolute top-0 right-0 bottom-0 w-80 bg-background shadow-2xl"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-2.5">
                    <img 
                      src={Logo} 
                      alt="Addax Automotive" 
                      className="w-10 h-10 rounded-xl object-contain"
                    />
                    <div className="flex flex-col">
                      <span className="text-lg font-bold text-foreground leading-tight">Addax</span>
                      <span className="text-[10px] font-semibold text-primary tracking-wider uppercase">Automotive</span>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center text-foreground"
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
                            ? 'bg-primary/10 text-primary' 
                            : 'text-foreground hover:bg-secondary'
                        }`}
                      >
                        {link.label}
                        <ChevronDown className="w-4 h-4 -rotate-90 opacity-40" />
                      </motion.a>
                    );
                  })}
                </nav>

                <div className="mt-8 pt-8 border-t border-border space-y-4">
                  <a 
                    href="tel:+919876543210" 
                    className="flex items-center gap-3 px-4 py-3 text-muted-foreground"
                  >
                    <Phone className="w-5 h-5" />
                    <span className="font-medium">+91 98765 43210</span>
                  </a>
                  <button 
                    onClick={(e) => scrollToSection(e, '#services')}
                    className="w-full py-4 bg-primary text-primary-foreground font-semibold rounded-xl hover:opacity-90 transition-opacity"
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