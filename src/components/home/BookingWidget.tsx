import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MapPin,
  Car,
  Phone,
  ChevronRight,
  ChevronLeft,
  Search,
  X,
  Sparkles,
  CheckCircle2
} from 'lucide-react';
import { useContent } from '../../admin-portal';

type ViewState = 'main' | 'brands' | 'models' | 'fuel';

export const BookingWidget = () => {
  // Get content from context
  const { content } = useContent();
  const bookingContent = content.bookingWidget;

  // Extract data from content
  const brands = bookingContent.brands;
  const carModels = bookingContent.carModels as Record<string, { name: string; type: string; image: string }[]>;
  const fuelTypes = bookingContent.fuelTypes;
  // const cities = bookingContent.cities;

  const [currentView, setCurrentView] = useState<ViewState>('main');
  const [searchQuery, setSearchQuery] = useState('');
  // const [selectedCity, setSelectedCity] = useState(cities[0] || 'Chennai');
  const [selectedCity] = useState('Chennai');
  const [isCityOpen, setIsCityOpen] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState<typeof brands[0] | null>(null);
  const [selectedModel, setSelectedModel] = useState<{ name: string; type: string; image: string } | null>(null);
  const [selectedFuel, setSelectedFuel] = useState<typeof fuelTypes[0] | null>(null);
  const [mobileNumber, setMobileNumber] = useState('');

  // Handle outside trigger to open brand selection
  useEffect(() => {
    const handleOpenSelection = () => {
      // If we are on main view, switch to brands to start selection
      if (currentView === 'main') {
        setCurrentView('brands');
      }
      // If we are already on brands/models/fuel, we usually don't need to do anything
      // as the user is already interacting.
    };

    window.addEventListener('open-booking-car-selector', handleOpenSelection);
    return () => window.removeEventListener('open-booking-car-selector', handleOpenSelection);
  }, [currentView]);

  const filteredBrands = brands.filter(brand =>
    brand.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredModels = selectedBrand
    ? (carModels[selectedBrand.id] || []).filter(model =>
      model.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
    : [];

  const handleBrandSelect = (brand: typeof brands[0]) => {
    setSelectedBrand(brand);
    setCurrentView('models');
    setSearchQuery('');
  };

  const handleModelSelect = (model: { name: string; type: string; image: string }) => {
    setSelectedModel(model);
    setCurrentView('fuel');
  };

  const handleFuelSelect = (fuel: typeof fuelTypes[0]) => {
    setSelectedFuel(fuel);
    setCurrentView('main');
  };

  const resetCarSelection = () => {
    setSelectedBrand(null);
    setSelectedModel(null);
    setSelectedFuel(null);
  };

  const goBack = () => {
    if (currentView === 'brands') {
      setCurrentView('main');
    } else if (currentView === 'models') {
      setCurrentView('brands');
    } else if (currentView === 'fuel') {
      setCurrentView('models');
    }
    setSearchQuery('');
  };

  const isCarSelected = selectedBrand && selectedModel && selectedFuel;

  const getCarDisplayText = () => {
    if (isCarSelected) {
      return `${selectedBrand?.name} ${selectedModel?.name}`;
    }
    return 'Select your car';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="w-full max-w-md relative"
      id="booking-widget"
    >
      <div className="bg-card rounded-3xl shadow-2xl shadow-primary/20 overflow-hidden">
        {/* Top Accent Bar - Themeable */}
        <motion.div
          className="h-1.5 bg-gradient-to-r from-primary via-primary/80 to-primary bg-[length:200%_100%]"
          animate={{ backgroundPosition: ['0% 0%', '100% 0%', '0% 0%'] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
        />

        <div className="p-6 sm:p-8">
          <AnimatePresence mode="wait">
            {/* ==================== MAIN VIEW ==================== */}
            {currentView === 'main' && (
              <motion.div
                key="main"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.25 }}
                className="space-y-5"
              >
                {/* Header */}
                <div>
                  <h3 className="text-2xl font-bold text-foreground tracking-tight">
                    {bookingContent.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {bookingContent.subtitle}
                  </p>
                </div>

                {/* City Selector */}
                <div className="relative">
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">
                    {bookingContent.labels?.city || 'Select City'}
                  </label>
                  <button
                    onClick={() => setIsCityOpen(!isCityOpen)}
                    className="w-full flex items-center justify-between px-4 py-4 bg-secondary/50 border border-border rounded-2xl hover:border-primary/50 hover:bg-primary/5 transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
                        <MapPin className="w-5 h-5 text-primary-foreground" />
                      </div>
                      <span className="text-base font-semibold text-foreground">{selectedCity}</span>
                    </div>
                    <ChevronRight className={`w-5 h-5 text-muted-foreground transition-transform duration-300 ${isCityOpen ? '' : ''}`} />
                  </button>

                  {/* <AnimatePresence>
                    {isCityOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-2xl shadow-xl overflow-hidden z-30 max-h-52 overflow-y-auto custom-scrollbar"
                      >
                        {cities.map((city) => (
                          <button
                            key={city}
                            onClick={() => { setSelectedCity(city); setIsCityOpen(false); }}
                            className={`w-full px-4 py-3.5 text-left text-sm font-medium transition-all flex items-center justify-between ${
                              selectedCity === city 
                                ? 'text-primary bg-primary/10' 
                                : 'text-muted-foreground hover:bg-secondary'
                            }`}
                          >
                            {city}
                            {selectedCity === city && <CheckCircle2 className="w-4 h-4 text-primary" />}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence> */}
                </div>

                {/* Car Selector */}
                <div>
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">
                    {bookingContent.labels?.brand || 'Select Brand'}
                  </label>
                  <button
                    onClick={() => setCurrentView('brands')}
                    className={`w-full flex items-center justify-between px-4 py-4 border rounded-2xl transition-all ${isCarSelected
                      ? 'bg-primary/5 border-primary/20'
                      : 'bg-secondary/50 border-border hover:border-primary/50 hover:bg-primary/5'
                      }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center overflow-hidden ${isCarSelected
                        ? 'bg-card shadow-md border border-primary/20'
                        : 'bg-secondary'
                        }`}>
                        {isCarSelected && selectedBrand ? (
                          <img
                            src={selectedBrand.logo}
                            alt={selectedBrand.name}
                            className="w-7 h-7 object-contain"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.onerror = null;
                              target.src = `https://ui-avatars.com/api/?name=${selectedBrand.name.charAt(0)}&background=FF5733&color=fff&size=56&bold=true`;
                            }}
                          />
                        ) : (
                          <Car className="w-5 h-5 text-muted-foreground" />
                        )}
                      </div>
                      <div className="text-left">
                        <span className={`text-base font-semibold block ${isCarSelected ? 'text-foreground' : 'text-muted-foreground'}`}>
                          {getCarDisplayText()}
                        </span>
                        {isCarSelected && selectedFuel && (
                          <span className="text-xs text-primary font-medium">{selectedFuel.name} • {selectedModel?.type}</span>
                        )}
                      </div>
                    </div>
                    {isCarSelected ? (
                      <button
                        onClick={(e) => { e.stopPropagation(); resetCarSelection(); }}
                        className="p-2 hover:bg-destructive/10 rounded-full transition-colors group"
                      >
                        <X className="w-4 h-4 text-muted-foreground group-hover:text-destructive" />
                      </button>
                    ) : (
                      <ChevronRight className="w-5 h-5 text-muted-foreground" />
                    )}
                  </button>
                </div>

                {/* Mobile Number */}
                <div>
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">
                    {bookingContent.labels?.phone || 'Mobile Number'}
                  </label>
                  <div className="flex items-center gap-3 px-4 py-4 bg-secondary/50 border border-border rounded-2xl focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 transition-all">
                    <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center">
                      <Phone className="w-5 h-5 text-muted-foreground" />
                    </div>
                    <span className="text-base font-semibold text-muted-foreground">+91</span>
                    <input
                      type="tel"
                      value={mobileNumber}
                      onChange={(e) => setMobileNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
                      placeholder={bookingContent.placeholders?.phone || 'Enter your mobile number'}
                      className="flex-1 bg-transparent outline-none text-base font-semibold text-foreground placeholder-muted-foreground"
                    />
                    {mobileNumber.length === 10 && (
                      <CheckCircle2 className="w-5 h-5 text-green-500" />
                    )}
                  </div>
                </div>

                {/* Submit Button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={!isCarSelected || mobileNumber.length !== 10}
                  className="w-full py-4 bg-primary text-primary-foreground text-base font-bold rounded-2xl shadow-lg shadow-primary/30 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none transition-all flex items-center justify-center gap-2"
                >
                  {bookingContent.ctaText}
                  <ChevronRight className="w-5 h-5" />
                </motion.button>
              </motion.div>
            )}

            {/* ==================== BRAND SELECTION VIEW ==================== */}
            {currentView === 'brands' && (
              <motion.div
                key="brands"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
              >
                {/* Header with Back */}
                <div className="flex items-center gap-3 mb-5">
                  <button
                    onClick={goBack}
                    className="p-2 -ml-2 hover:bg-secondary rounded-xl transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5 text-muted-foreground" />
                  </button>
                  <div>
                    <h3 className="text-xl font-bold text-foreground">{bookingContent.labels?.brand || 'Select Brand'}</h3>
                    <p className="text-xs text-muted-foreground">Choose your car manufacturer</p>
                  </div>
                </div>

                {/* Search Bar */}
                <div className="flex items-center gap-3 px-4 py-3 bg-secondary rounded-xl mb-5">
                  <Search className="w-5 h-5 text-muted-foreground" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={bookingContent.placeholders?.brand || 'Search car brand...'}
                    className="flex-1 bg-transparent outline-none text-sm font-medium text-foreground placeholder-muted-foreground"
                    autoFocus
                  />
                  {searchQuery && (
                    <button onClick={() => setSearchQuery('')} className="p-1 hover:bg-border rounded-full">
                      <X className="w-4 h-4 text-muted-foreground" />
                    </button>
                  )}
                </div>

                {/* Brand Grid */}
                <div className="grid grid-cols-3 gap-3 max-h-[340px] overflow-y-auto pr-1 custom-scrollbar">
                  {filteredBrands.map((brand, idx) => (
                    <motion.button
                      key={brand.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: idx * 0.02 }}
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleBrandSelect(brand)}
                      className="flex flex-col items-center p-4 bg-secondary/30 hover:bg-primary/5 border-2 border-transparent hover:border-primary/20 rounded-2xl transition-all"
                    >
                      <div className="w-14 h-14 mb-2 flex items-center justify-center">
                        <img
                          src={brand.logo}
                          alt={brand.name}
                          className="w-full h-full object-contain"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.onerror = null;
                            target.src = `https://ui-avatars.com/api/?name=${brand.name.charAt(0)}&background=FF5733&color=fff&size=56&bold=true`;
                          }}
                        />
                      </div>
                      <span className="text-xs font-semibold text-foreground text-center leading-tight">
                        {brand.name}
                      </span>
                    </motion.button>
                  ))}
                </div>

                {filteredBrands.length === 0 && (
                  <div className="text-center py-10">
                    <Car className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                    <p className="text-muted-foreground font-medium">No brands found</p>
                    <p className="text-sm text-muted-foreground/80">Try a different search term</p>
                  </div>
                )}
              </motion.div>
            )}

            {/* ==================== MODEL SELECTION VIEW ==================== */}
            {currentView === 'models' && selectedBrand && (
              <motion.div
                key="models"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
              >
                {/* Header with Back */}
                <div className="flex items-center gap-3 mb-5">
                  <button
                    onClick={goBack}
                    className="p-2 -ml-2 hover:bg-secondary rounded-xl transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5 text-muted-foreground" />
                  </button>
                  <div className="flex items-center gap-3">
                    <img
                      src={selectedBrand.logo}
                      alt={selectedBrand.name}
                      className="w-10 h-10 object-contain"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.onerror = null;
                        target.src = `https://ui-avatars.com/api/?name=${selectedBrand.name.charAt(0)}&background=FF5733&color=fff&size=40&bold=true`;
                      }}
                    />
                    <div>
                      <h3 className="text-xl font-bold text-foreground">{bookingContent.labels?.model || 'Select Model'}</h3>
                      <p className="text-xs text-muted-foreground">{selectedBrand.name} models</p>
                    </div>
                  </div>
                </div>

                {/* Search Bar */}
                <div className="flex items-center gap-3 px-4 py-3 bg-secondary rounded-xl mb-5">
                  <Search className="w-5 h-5 text-muted-foreground" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={bookingContent.placeholders?.model || 'Search model...'}
                    className="flex-1 bg-transparent outline-none text-sm font-medium text-foreground placeholder-muted-foreground"
                  />
                  {searchQuery && (
                    <button onClick={() => setSearchQuery('')} className="p-1 hover:bg-border rounded-full">
                      <X className="w-4 h-4 text-muted-foreground" />
                    </button>
                  )}
                </div>

                {/* Model Grid with Car Images */}
                <div className="grid grid-cols-2 gap-3 max-h-[340px] overflow-y-auto pr-1 custom-scrollbar">
                  {filteredModels.map((model, idx) => (
                    <motion.button
                      key={model.name}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.03 }}
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleModelSelect(model)}
                      className="flex flex-col items-center p-3 bg-secondary/30 hover:bg-primary/5 border-2 border-transparent hover:border-primary/20 rounded-2xl transition-all text-center"
                    >
                      <div className="w-full h-16 mb-2 flex items-center justify-center">
                        <img
                          src={model.image}
                          alt={model.name}
                          className="w-full h-full object-contain"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.onerror = null;
                            target.style.display = 'none';
                            target.parentElement!.innerHTML = '<span class="text-3xl">🚗</span>';
                          }}
                        />
                      </div>
                      <span className="text-sm font-semibold text-foreground block truncate w-full">
                        {model.name}
                      </span>
                      <span className="text-xs text-muted-foreground">{model.type}</span>
                    </motion.button>
                  ))}
                </div>

                {filteredModels.length === 0 && (
                  <div className="text-center py-10">
                    <Car className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                    <p className="text-muted-foreground font-medium">No models found</p>
                    <p className="text-sm text-muted-foreground/80">Try a different search term</p>
                  </div>
                )}
              </motion.div>
            )}

            {/* ==================== FUEL TYPE SELECTION VIEW ==================== */}
            {currentView === 'fuel' && (
              <motion.div
                key="fuel"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
              >
                {/* Header with Back */}
                <div className="flex items-center gap-3 mb-5">
                  <button
                    onClick={goBack}
                    className="p-2 -ml-2 hover:bg-secondary rounded-xl transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5 text-muted-foreground" />
                  </button>
                  <div>
                    <h3 className="text-xl font-bold text-foreground">{bookingContent.labels?.fuel || 'Select Fuel Type'}</h3>
                    <p className="text-xs text-muted-foreground">Choose your fuel type</p>
                  </div>
                </div>

                {/* Selected Car Summary */}
                <div className="flex items-center gap-4 p-4 bg-primary/5 border border-primary/20 rounded-2xl mb-5">
                  <div className="w-16 h-12 flex items-center justify-center">
                    <img
                      src={selectedModel?.image}
                      alt={selectedModel?.name}
                      className="w-full h-full object-contain"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.onerror = null;
                        target.style.display = 'none';
                        target.parentElement!.innerHTML = '<span class="text-2xl">🚗</span>';
                      }}
                    />
                  </div>
                  <div className="flex-1">
                    <p className="text-base font-bold text-foreground">
                      {selectedBrand?.name} {selectedModel?.name}
                    </p>
                    <p className="text-xs text-primary font-medium">
                      {selectedModel?.type} • Almost there!
                    </p>
                  </div>
                  <img
                    src={selectedBrand?.logo}
                    alt={selectedBrand?.name}
                    className="w-8 h-8 object-contain opacity-50"
                  />
                </div>

                {/* Fuel Type Options */}
                <div className="space-y-3">
                  {fuelTypes.map((fuel, idx) => (
                    <motion.button
                      key={fuel.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      whileHover={{ x: 4 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleFuelSelect(fuel)}
                      className="w-full flex items-center justify-between p-4 bg-secondary/30 hover:bg-primary/5 border-2 border-transparent hover:border-primary/20 rounded-2xl transition-all group"
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
                          style={{ backgroundColor: `${fuel.color}15` }}
                        >
                          {fuel.icon}
                        </div>
                        <span className="text-base font-semibold text-foreground">{fuel.name}</span>
                      </div>
                      <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Trust Footer - Only on main view */}
        {currentView === 'main' && (
          <div className="px-6 sm:px-8 py-4 bg-secondary/20 border-t border-border">
            <div className="flex items-center justify-center gap-6 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-primary" />
                <span className="font-semibold">{bookingContent.trustFooter?.rating || '4.8/5'}</span> Rating
              </span>
              <span className="w-1 h-1 rounded-full bg-border" />
              <span><span className="font-semibold">{bookingContent.trustFooter?.servicesCount || '50,000+'}</span> Services</span>
            </div>
          </div>
        )}
      </div>

      {/* Custom Scrollbar Styles */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: hsl(var(--border));
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: hsl(var(--muted-foreground));
        }
      `}</style>
    </motion.div>
  );
};