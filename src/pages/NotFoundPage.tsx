import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Home, ArrowLeft, Search, Car, Wrench, AlertTriangle } from 'lucide-react';
import { useContent } from '../admin-portal';

export const NotFoundPage = () => {
  // Get content from context
  const { content } = useContent();
  const pagesContent = content.pages?.notFound;

  // Default quick links if none provided
  const defaultQuickLinks = [
    { name: 'Services', href: '/services' },
    { name: 'Pricing', href: '/#pricing' },
    { name: 'About Us', href: '/#about' },
    { name: 'Contact', href: '/#contact' },
  ];

  const quickLinks = pagesContent?.quickLinks || defaultQuickLinks;

  return (
    // Base background using theme variables (white/black depending on mode)
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center relative overflow-hidden transition-colors duration-300">
      
      {/* Animated Background */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Gradient Orbs - Using CSS variables for primary color */}
        <motion.div
          className="absolute -top-40 -left-40 w-96 h-96 rounded-full opacity-20 blur-3xl"
          style={{ background: 'radial-gradient(circle, hsl(var(--primary)) 0%, transparent 70%)' }}
          animate={{ scale: [1, 1.3, 1], rotate: [0, 180, 360] }}
          transition={{ duration: 15, repeat: Infinity }}
        />
        <motion.div
          className="absolute -bottom-40 -right-40 w-[500px] h-[500px] rounded-full opacity-15 blur-3xl"
          style={{ background: 'radial-gradient(circle, hsl(var(--primary)) 0%, transparent 70%)' }}
          animate={{ scale: [1.2, 1, 1.2] }}
          transition={{ duration: 12, repeat: Infinity }}
        />

        {/* Floating Car Parts - Using muted foreground for subtle visibility */}
        {[Wrench, Car, AlertTriangle].map((Icon, i) => (
          <motion.div
            key={i}
            className="absolute text-muted-foreground/10"
            style={{ left: `${20 + i * 30}%`, top: `${25 + i * 20}%` }}
            animate={{ 
              y: [0, -30, 0], 
              rotate: [0, 15, -15, 0]
            }}
            transition={{ duration: 5, repeat: Infinity, delay: i * 0.5 }}
          >
            <Icon size={60 + i * 20} />
          </motion.div>
        ))}

        {/* Grid Pattern - Adapting to current text color */}
        <motion.div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(hsl(var(--foreground)) 1px, transparent 1px),
                             linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)`,
            backgroundSize: '50px 50px'
          }}
          animate={{ backgroundPosition: ['0px 0px', '50px 50px'] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl relative z-10 text-center">
        {/* 404 Number */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", duration: 0.8 }}
        >
          <h1 className="text-[150px] sm:text-[200px] lg:text-[250px] font-bold leading-none flex justify-center items-center">
            {/* Gradient Text for first 4 - Using Primary and Destructive colors */}
            <motion.span 
              className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-destructive"
              animate={{ 
                backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
              }}
              transition={{ duration: 5, repeat: Infinity }}
              style={{ backgroundSize: '200% 200%' }}
            >
              4
            </motion.span>
            
            {/* Middle 0 - Using muted foreground */}
            <motion.span 
              className="text-muted-foreground/20"
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
              0
            </motion.span>
            
            {/* Gradient Text for second 4 */}
            <motion.span 
              className="bg-clip-text text-transparent bg-gradient-to-r from-destructive to-primary"
              animate={{ 
                backgroundPosition: ['100% 50%', '0% 50%', '100% 50%']
              }}
              transition={{ duration: 5, repeat: Infinity }}
              style={{ backgroundSize: '200% 200%' }}
            >
              4
            </motion.span>
          </h1>
        </motion.div>

        {/* Message - Now using CMS content */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-4">
            {pagesContent?.title || 'Oops! Road Not Found'}
          </h2>
          <p className="text-muted-foreground text-base sm:text-lg mb-8 max-w-md mx-auto">
            {pagesContent?.description || "Looks like you've taken a wrong turn. The page you're looking for doesn't exist or has been moved."}
          </p>
        </motion.div>

        {/* Search Box - Using CMS content for placeholder */}
        <motion.div
          className="mb-8 max-w-md mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input 
              type="text"
              placeholder={pagesContent?.searchPlaceholder || 'Search for services...'}
              className="w-full pl-12 pr-4 py-4 bg-secondary/50 backdrop-blur-sm border border-border rounded-full text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
            />
          </div>
        </motion.div>

        {/* Action Buttons - Now using CMS content */}
        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <Link to="/">
            <motion.button 
              className="flex items-center justify-center gap-2 px-8 py-4 bg-primary text-primary-foreground font-semibold rounded-full transition-all group hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/25"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Home className="w-5 h-5" />
              {pagesContent?.primaryButton || 'Back to Home'}
              <motion.span
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                →
              </motion.span>
            </motion.button>
          </Link>

          <motion.button 
            onClick={() => window.history.back()}
            className="flex items-center justify-center gap-2 px-8 py-4 bg-secondary text-secondary-foreground border border-border font-semibold rounded-full hover:bg-secondary/80 transition-all"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <ArrowLeft className="w-5 h-5" />
            {pagesContent?.secondaryButton || 'Go Back'}
          </motion.button>
        </motion.div>

        {/* Quick Links - Now using CMS content */}
        <motion.div
          className="mt-12 pt-8 border-t border-border"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
        >
          <p className="text-muted-foreground text-sm mb-4">Quick Links</p>
          <div className="flex flex-wrap gap-4 justify-center">
            {quickLinks.map((link: { name: string; href: string }, idx: number) => (
              <motion.a
                key={idx}
                href={link.href}
                className="text-muted-foreground hover:text-primary text-sm transition-colors"
                whileHover={{ scale: 1.1 }}
              >
                {link.name}
              </motion.a>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default NotFoundPage;