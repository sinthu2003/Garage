import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import {
  MapPin,
  Car,
  Phone,
  ChevronRight,
  ChevronLeft,
  Search,
  X,
  Sparkles,
  CheckCircle2,
  Loader2,
  CheckCircle,
  AlertCircle,
  Wrench,
} from 'lucide-react';
import { useContent } from '../../admin-portal';
import { bookingApi, getErrorMessage } from '../../services/api';

// ============================================
// DUAL API FETCH STRATEGY - S3 FIRST, MONGODB FALLBACK
// ============================================
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

/**
 * Fetch car data with dual strategy:
 * 1. PRIMARY: Try S3-based endpoint (/api/car-data/booking-widget)
 * 2. FALLBACK: If S3 fails, try MongoDB endpoint (/api/car-data/booking-widget-mongo)
 * 
 * This ensures images are always available even if S3 has issues
 */
const fetchBookingWidgetData = async (): Promise<{ brands: any[], carModels: Record<string, any[]> }> => {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(7);
  
  // ✅ PRIMARY: Try S3-based endpoint first
  const s3Url = `${API_BASE_URL}/api/car-data/booking-widget?_t=${timestamp}&_r=${random}&_nocache=true`;
  
  console.log('[BookingWidget] 🔄 PRIMARY: Fetching from S3 endpoint:', s3Url);
  
  try {
    const s3Response = await fetch(s3Url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
      cache: 'no-store',
    });
    
    if (s3Response.ok) {
      const s3Data = await s3Response.json();
      console.log('[BookingWidget] ✅ S3 API Response:', s3Data);
      
      const apiData = s3Data.data || s3Data;
      const brands = apiData.brands || [];
      const carModels = apiData.carModels || {};
      
      // Validate that we have usable data
      if (brands.length > 0) {
        console.log('[BookingWidget] ✅ S3 data is valid, using S3 URLs');
        console.log('[BookingWidget] 📊 Brands:', brands.length);
        console.log('[BookingWidget] 📊 Models:', Object.keys(carModels).length, 'brands with models');
        return { brands, carModels };
      } else {
        console.warn('[BookingWidget] ⚠️ S3 returned empty brands, trying MongoDB fallback');
      }
    } else {
      console.warn('[BookingWidget] ⚠️ S3 endpoint failed with status:', s3Response.status);
    }
  } catch (s3Error) {
    console.warn('[BookingWidget] ⚠️ S3 fetch failed:', s3Error);
  }
  
  // ✅ FALLBACK: Try MongoDB-based endpoint
  const mongoUrl = `${API_BASE_URL}/api/car-data/booking-widget-mongo?_t=${timestamp}&_r=${random}&_nocache=true`;
  
  console.log('[BookingWidget] 🔄 FALLBACK: Fetching from MongoDB endpoint:', mongoUrl);
  
  const mongoResponse = await fetch(mongoUrl, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0',
    },
    cache: 'no-store',
  });
  
  if (!mongoResponse.ok) {
    throw new Error(`Both S3 and MongoDB APIs failed. MongoDB status: ${mongoResponse.status}`);
  }
  
  const mongoData = await mongoResponse.json();
  console.log('[BookingWidget] ✅ MongoDB API Response (FALLBACK):', mongoData);
  
  const apiData = mongoData.data || mongoData;
  const brands = apiData.brands || [];
  const carModels = apiData.carModels || {};
  
  console.log('[BookingWidget] 📊 FALLBACK Brands:', brands.length);
  console.log('[BookingWidget] 📊 FALLBACK Models:', Object.keys(carModels).length, 'brands with models');
  
  return {
    brands,
    carModels
  };
};

// ============================================
// TYPES
// ============================================
type ViewState = 'main' | 'brands' | 'models' | 'fuel';

interface SubmissionResult {
  success: boolean;
  message: string;
}

interface TargetedService {
  id: string;
  name: string;
  price?: number;
}

interface Brand {
  id: string;
  name: string;
  logo: string;
  urlName: string;
}

interface CarModel {
  name: string;
  type: string;
  image: string;
}

interface FuelType {
  id: string;
  name: string;
  icon: string;
  color: string;
}

// ============================================
// COMPONENT
// ============================================
export const BookingWidget = () => {
  const { content } = useContent();
  const location = useLocation();
  const bookingContent = content?.bookingWidget || {};
  const fetchAttempted = useRef(false);

  // ============================================
  // CAR DATA STATE - FETCHED WITH DUAL STRATEGY
  // ============================================
  const [brands, setBrands] = useState<Brand[]>([]);
  const [carModels, setCarModels] = useState<Record<string, CarModel[]>>({});
  const [isLoadingBrands, setIsLoadingBrands] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [, setLastFetchTime] = useState<string>('');
  const [, setDataSource] = useState<'s3' | 'mongodb' | null>(null);

  // Fetch car brands and models with dual API strategy
  const fetchCarData = useCallback(async (force = false) => {
    // Prevent duplicate fetches on mount
    if (!force && fetchAttempted.current && brands.length > 0) {
      console.log('[BookingWidget] ⏭️ Skipping fetch - data already loaded');
      return;
    }
    
    fetchAttempted.current = true;
    setIsLoadingBrands(true);
    setFetchError(null);
    setDataSource(null);

    try {
      const { brands: apiBrands, carModels: apiModels } = await fetchBookingWidgetData();
      
      console.log('[BookingWidget] 📊 Received brands:', apiBrands.length);
      console.log('[BookingWidget] 📊 Received models data:', Object.keys(apiModels).length, 'brands with models');
      
      // Detect data source based on URL format
      const isS3Data = apiBrands.length > 0 && apiBrands[0].logo?.includes('amazonaws.com');
      setDataSource(isS3Data ? 's3' : 'mongodb');
      
      // Transform brands to match our interface
      const transformedBrands: Brand[] = apiBrands.map((b: any) => ({
        id: b.id || b._id || '',
        name: b.name || '',
        logo: b.logo || '',
        urlName: b.urlName || b.name?.toLowerCase().replace(/\s+/g, '-') || '',
      }));

      // Log brand logos for debugging
      transformedBrands.forEach(brand => {
        console.log(`[BookingWidget] 🏷️ ${brand.name}: ${brand.logo}`);
      });

      // Transform models data
      const transformedModels: Record<string, CarModel[]> = {};
      Object.entries(apiModels).forEach(([brandId, models]: [string, any]) => {
        transformedModels[brandId] = (models || []).map((m: any) => ({
          name: m.name || '',
          type: m.type || 'Sedan',
          image: m.image || '',
        }));
        
        console.log(`[BookingWidget] 🚗 ${brandId}: ${transformedModels[brandId].length} models`);
      });

      setBrands(transformedBrands);
      setCarModels(transformedModels);
      setLastFetchTime(new Date().toLocaleTimeString());
      
      console.log(`[BookingWidget] ✅ Successfully loaded all car data from ${isS3Data ? 'S3' : 'MongoDB (fallback)'}`);
      
    } catch (error: any) {
      console.error('[BookingWidget] ❌ Fetch error:', error);
      setFetchError(error.message || 'Failed to load car brands');
      
      // Fallback to content from context
      if (bookingContent.brands?.length > 0) {
        console.log('[BookingWidget] 🔄 Using fallback from context');
        setBrands(bookingContent.brands);
        setCarModels(bookingContent.carModels || {});
      }
    } finally {
      setIsLoadingBrands(false);
    }
  }, [bookingContent.brands, bookingContent.carModels, brands.length]);

  // Fetch on mount - only if data is not already available
  useEffect(() => {
    // ✅ Check if we already have data from ContentContext
    if (bookingContent.brands && bookingContent.brands.length > 0) {
      console.log('[BookingWidget] ✅ Using data from ContentContext (no API call needed)');
      setBrands(bookingContent.brands);
      setCarModels(bookingContent.carModels || {});
      setIsLoadingBrands(false);
      fetchAttempted.current = true;
      return;
    }
    
    // Only fetch if we don't have data
    console.log('[BookingWidget] 🚀 No data in context, fetching from API...');
    fetchCarData();
  }, [bookingContent.brands, bookingContent.carModels]);
  
  // ============================================
  // OTHER STATE
  // ============================================
  const fuelTypes: FuelType[] = bookingContent.fuelTypes || [
    { id: 'petrol', name: 'Petrol', icon: '⛽', color: '#22C55E' },
    { id: 'diesel', name: 'Diesel', icon: '🛢️', color: '#EAB308' },
    { id: 'cng', name: 'CNG', icon: '💨', color: '#3B82F6' },
    { id: 'electric', name: 'Electric', icon: '⚡', color: '#8B5CF6' },
  ];
  const cities: string[] = bookingContent.cities || ['Chennai'];

  const [currentView, setCurrentView] = useState<ViewState>('main');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState(cities[0] || 'Chennai');
  const [isCityOpen, setIsCityOpen] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null);
  const [selectedModel, setSelectedModel] = useState<CarModel | null>(null);
  const [selectedFuel, setSelectedFuel] = useState<FuelType | null>(null);
  const [mobileNumber, setMobileNumber] = useState('');
  const [targetedService, setTargetedService] = useState<TargetedService | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionResult, setSubmissionResult] = useState<SubmissionResult | null>(null);

  // Handle outside trigger to open brand selection
  useEffect(() => {
    const handleOpenSelection = () => {
      if (currentView === 'main') {
        setCurrentView('brands');
      }
    };

    window.addEventListener('open-booking-car-selector', handleOpenSelection);
    return () => window.removeEventListener('open-booking-car-selector', handleOpenSelection);
  }, [currentView]);

  // Capture service from navigation state
  useEffect(() => {
    if (location.state?.selectedService) {
      const s = location.state.selectedService;
      setTargetedService({
        id: s.id || s._id,
        name: s.title || s.name,
        price: s.price
      });
    }
  }, [location.state]);

  // ============================================
  // FILTERED DATA
  // ============================================
  const filteredBrands = brands.filter(brand =>
    brand.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredModels = selectedBrand
    ? (carModels[selectedBrand.id] || []).filter(model =>
        model.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  // ============================================
  // HANDLERS
  // ============================================
  const handleBrandSelect = (brand: Brand) => {
    setSelectedBrand(brand);
    setCurrentView('models');
    setSearchQuery('');
    
    // Log models for this brand
    const brandModels = carModels[brand.id] || [];
    console.log(`[BookingWidget] 🎯 Selected ${brand.name}, found ${brandModels.length} models`);
    brandModels.forEach(model => {
      console.log(`  - ${model.name} (${model.type})`);
    });
  };

  const handleModelSelect = (model: CarModel) => {
    setSelectedModel(model);
    setCurrentView('fuel');
  };

  const handleFuelSelect = (fuel: FuelType) => {
    setSelectedFuel(fuel);
    setCurrentView('main');
  };

  const resetCarSelection = () => {
    setSelectedBrand(null);
    setSelectedModel(null);
    setSelectedFuel(null);
  };

  const clearTargetedService = () => {
    setTargetedService(null);
  };

  const goBack = () => {
    if (currentView === 'brands') setCurrentView('main');
    else if (currentView === 'models') setCurrentView('brands');
    else if (currentView === 'fuel') setCurrentView('models');
    setSearchQuery('');
  };

  const isCarSelected = selectedBrand && selectedModel && selectedFuel;

  const getCarDisplayText = () => {
    if (isCarSelected) {
      return `${selectedBrand?.name} ${selectedModel?.name}`;
    }
    return 'Select your car';
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>, fallbackText: string) => {
    const target = e.target as HTMLImageElement;
    target.onerror = null;
    target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(fallbackText.charAt(0))}&background=FF5733&color=fff&size=56&bold=true`;
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (!isCarSelected || mobileNumber.length !== 10) return;

    setIsSubmitting(true);
    setSubmissionResult(null);

    try {
      const payload = {
        phone: mobileNumber,
        countryCode: '+91',
        city: selectedCity.toLowerCase(),
        brand: selectedBrand!.id,
        brandName: selectedBrand!.name,
        model: selectedModel!.name,
        fuelType: selectedFuel!.name,
        source: targetedService ? 'service_detail' as const : 'booking_widget' as const,
        sourcePage: window.location.pathname,
        service: targetedService ? {
          id: targetedService.id,
          name: targetedService.name,
          price: targetedService.price
        } : undefined
      };

      const result = await bookingApi.submit(payload);

      setSubmissionResult({
        success: true,
        message: result.message || 'Thank you! Our team will contact you within 30 minutes.',
      });

      resetCarSelection();
      setMobileNumber('');
      setTargetedService(null);
    } catch (error) {
      setSubmissionResult({
        success: false,
        message: getErrorMessage(error) || 'Something went wrong. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const closeResultModal = () => {
    setSubmissionResult(null);
  };

  // ============================================
  // LOADING STATE
  // ============================================
  if (isLoadingBrands && brands.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative"
        id="booking-widget"
      >
        <div className="bg-card rounded-3xl shadow-2xl shadow-primary/20 overflow-hidden">
          <div className="h-1.5 bg-gradient-to-r from-primary via-primary/80 to-primary" />
          <div className="p-6 sm:p-8 flex flex-col items-center justify-center min-h-[300px]">
            <Loader2 className="w-8 h-8 animate-spin text-primary mb-4" />
            <p className="text-muted-foreground">Loading car brands...</p>
          </div>
        </div>
      </motion.div>
    );
  }

  // ============================================
  // ERROR STATE
  // ============================================
  if (fetchError && brands.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative"
        id="booking-widget"
      >
        <div className="bg-card rounded-3xl shadow-2xl shadow-primary/20 overflow-hidden">
          <div className="h-1.5 bg-gradient-to-r from-primary via-primary/80 to-primary" />
          <div className="p-6 sm:p-8 flex flex-col items-center justify-center min-h-[300px]">
            <AlertCircle className="w-8 h-8 text-destructive mb-4" />
            <p className="text-muted-foreground mb-2 font-semibold">Failed to load car data</p>
            <p className="text-xs text-muted-foreground">{fetchError}</p>
          </div>
        </div>
      </motion.div>
    );
  }

  // ============================================
  // MAIN RENDER
  // ============================================
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="w-full max-w-md relative"
      id="booking-widget"
    >
      {/* Success/Error Modal */}
      <AnimatePresence>
        {submissionResult && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={closeResultModal}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-card rounded-3xl p-8 max-w-sm w-full shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${
                submissionResult.success
                  ? 'bg-green-100 dark:bg-green-900/30'
                  : 'bg-red-100 dark:bg-red-900/30'
              }`}>
                {submissionResult.success ? (
                  <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
                ) : (
                  <AlertCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
                )}
              </div>
              <h3 className={`text-xl font-bold text-center mb-2 ${
                submissionResult.success ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
              }`}>
                {submissionResult.success ? 'Booking Received!' : 'Oops!'}
              </h3>
              <p className="text-center text-muted-foreground mb-6">
                {submissionResult.message}
              </p>
              <button
                onClick={closeResultModal}
                className={`w-full py-3 rounded-xl font-semibold transition-colors ${
                  submissionResult.success
                    ? 'bg-green-600 hover:bg-green-700 text-white'
                    : 'bg-red-600 hover:bg-red-700 text-white'
                }`}
              >
                {submissionResult.success ? 'Great!' : 'Try Again'}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="bg-card rounded-3xl shadow-2xl shadow-primary/20 overflow-hidden">
        {/* Top Accent Bar */}
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
                    {bookingContent.title || 'Book Your Service'}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {bookingContent.subtitle || 'Get instant quotes for your car'}
                  </p>
                </div>

                {/* Targeted Service Display */}
                {targetedService && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center justify-between p-3 bg-primary/10 border border-primary/20 rounded-xl"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center">
                        <Wrench className="w-4 h-4" />
                      </div>
                      <div className="flex-1">
                        <p className="text-[10px] text-primary font-bold uppercase tracking-wider">Booking For</p>
                        <p className="text-sm font-bold text-foreground leading-tight">{targetedService.name}</p>
                      </div>
                    </div>
                    <button
                      onClick={clearTargetedService}
                      className="p-1.5 hover:bg-black/5 dark:hover:bg-white/10 rounded-full transition-colors"
                    >
                      <X className="w-4 h-4 text-muted-foreground" />
                    </button>
                  </motion.div>
                )}

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
                    <ChevronRight className={`w-5 h-5 text-muted-foreground transition-transform duration-300 ${isCityOpen ? 'rotate-90' : ''}`} />
                  </button>

                  <AnimatePresence>
                    {isCityOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
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
                  </AnimatePresence>
                </div>

                {/* Car Selector */}
                <div>
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">
                    {bookingContent.labels?.brand || 'Select Brand'}
                  </label>
                  <button
                    onClick={() => setCurrentView('brands')}
                    className={`w-full flex items-center justify-between px-4 py-4 border rounded-2xl transition-all ${
                      isCarSelected
                        ? 'bg-primary/5 border-primary/20'
                        : 'bg-secondary/50 border-border hover:border-primary/50 hover:bg-primary/5'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center overflow-hidden ${
                        isCarSelected ? 'bg-card shadow-md border border-primary/20' : 'bg-secondary'
                      }`}>
                        {isCarSelected && selectedBrand ? (
                          <img
                            src={selectedBrand.logo}
                            alt={selectedBrand.name}
                            className="w-7 h-7 object-contain"
                            onError={(e) => handleImageError(e, selectedBrand.name)}
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
                  whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
                  whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
                  disabled={!isCarSelected || mobileNumber.length !== 10 || isSubmitting}
                  onClick={handleSubmit}
                  className="w-full py-4 bg-primary text-primary-foreground text-base font-bold rounded-2xl shadow-lg shadow-primary/30 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none transition-all flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Submitting...</span>
                    </>
                  ) : (
                    <>
                      {targetedService ? `Book ${targetedService.name}` : (bookingContent.ctaText || 'Get Free Quote')}
                      <ChevronRight className="w-5 h-5" />
                    </>
                  )}
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
                {/* Header */}
                <div className="flex items-center gap-3 mb-5">
                  <button
                    onClick={goBack}
                    className="p-2 -ml-2 hover:bg-secondary rounded-xl transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5 text-muted-foreground" />
                  </button>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-foreground">{bookingContent.labels?.brand || 'Select Brand'}</h3>
                    <p className="text-xs text-muted-foreground">
                      {brands.length} brands available
                    </p>
                  </div>
                </div>

                {/* Search */}
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
                          onError={(e) => handleImageError(e, brand.name)}
                        />
                      </div>
                      <span className="text-xs font-semibold text-foreground text-center leading-tight">
                        {brand.name}
                      </span>
                      <span className="text-[10px] text-muted-foreground mt-0.5">
                        {(carModels[brand.id] || []).length} models
                      </span>
                    </motion.button>
                  ))}
                </div>

                {filteredBrands.length === 0 && (
                  <div className="text-center py-10">
                    <Car className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                    <p className="text-muted-foreground font-medium">No brands found</p>
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
                {/* Header */}
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
                      onError={(e) => handleImageError(e, selectedBrand.name)}
                    />
                    <div>
                      <h3 className="text-xl font-bold text-foreground">{bookingContent.labels?.model || 'Select Model'}</h3>
                      <p className="text-xs text-muted-foreground">
                        {selectedBrand.name} • {filteredModels.length} models
                      </p>
                    </div>
                  </div>
                </div>

                {/* Search */}
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

                {/* Model Grid */}
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
                        {model.image ? (
                          <img
                            src={model.image}
                            alt={model.name}
                            className="w-full h-full object-contain mix-blend-multiply dark:mix-blend-normal"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.onerror = null;
                              target.style.display = 'none';
                              target.parentElement!.innerHTML = '<span class="text-3xl">🚗</span>';
                            }}
                          />
                        ) : (
                          <span className="text-3xl">🚗</span>
                        )}
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
                    <p className="text-muted-foreground font-medium">No models found for {selectedBrand.name}</p>
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
                {/* Header */}
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
                    {selectedModel?.image ? (
                      <img
                        src={selectedModel.image}
                        alt={selectedModel.name}
                        className="w-full h-full object-contain"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.onerror = null;
                          target.style.display = 'none';
                          target.parentElement!.innerHTML = '<span class="text-2xl">🚗</span>';
                        }}
                      />
                    ) : (
                      <span className="text-2xl">🚗</span>
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-base font-bold text-foreground">
                      {selectedBrand?.name} {selectedModel?.name}
                    </p>
                    <p className="text-xs text-primary font-medium">
                      {selectedModel?.type} • Almost there!
                    </p>
                  </div>
                  {selectedBrand?.logo && (
                    <img
                      src={selectedBrand.logo}
                      alt={selectedBrand.name}
                      className="w-8 h-8 object-contain opacity-50"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  )}
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

        {/* Trust Footer */}
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

      {/* Scrollbar Styles */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: hsl(var(--border)); border-radius: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: hsl(var(--muted-foreground)); }
      `}</style>
    </motion.div>
  );
};