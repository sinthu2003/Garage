import React, { useState, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Type,
  MapPin,
  Car,
  Fuel,
  ChevronRight,
  ChevronDown,
  Star,
  Phone,
  Plus,
  Trash2,
  MousePointerClick,
  GripVertical,
  Search,
  X,
  Loader2,
} from 'lucide-react';
import { useBookingWidgetContent } from '../../hooks/useContentHooks';
import { useContent } from '../../context/ContentContext';
import { ImageUpload } from '../shared/ImageUpload';
import { SectionLoader } from '../shared/SectionLoader';

interface BookingWidgetEditorProps {
  isDarkMode: boolean;
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

export const BookingWidgetEditor: React.FC<BookingWidgetEditorProps> = ({ }) => {
  const { updateField } = useContent();
  const content = useBookingWidgetContent();

  // [NEW] Get car data from separate API collection (if available)
  const {
    carBrands: apiBrands,
    carBrandsLoading,
    createBrand: createBrandApi,
    updateBrand: updateBrandApi,
    deleteBrand: deleteBrandApi,
    createModel: createModelApi,
    updateModel: updateModelApi,
    deleteModel: deleteModelApi,
  } = useContent();

  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(['header', 'labels', 'cities', 'brands', 'fuelTypes', 'cta', 'trustFooter'])
  );
  const [expandedBrands, setExpandedBrands] = useState<Set<number>>(new Set([0]));
  const [expandedModels, setExpandedModels] = useState<Set<string>>(new Set());
  
  // Search state
  const [brandSearch, setBrandSearch] = useState('');
  const [modelSearch, setModelSearch] = useState<Record<string, string>>({});

  // [NEW] Saving state for async operations
  const [isSaving, setIsSaving] = useState(false);

  // [FIX] Debounce timers ref - prevents too many API calls
const debounceTimersRef = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());
  const DEBOUNCE_DELAY = 1000; // ms

  // [FIX] Local state for brands/models being edited - allows immediate UI updates
  const [localBrands, setLocalBrands] = useState<Brand[]>([]);
  const [localModels, setLocalModels] = useState<Record<string, CarModel[]>>({});

  // [NEW] Determine which data source to use - API if available, otherwise legacy content
  const useNewApi = apiBrands && apiBrands.length > 0;

  // [NEW] Transform API brands to legacy format OR use legacy content
  const brands: Brand[] = useMemo(() => {
    if (useNewApi) {
      return apiBrands.map((b: any) => ({
        id: b._id || b.id,
        name: b.name,
        logo: b.logo || '',
        urlName: b.urlName || b.name?.toLowerCase().replace(/\s+/g, '-') || '',
      }));
    }
    return content.brands || [];
  }, [useNewApi, apiBrands, content.brands]);

  // [NEW] Transform API models OR use legacy content
  const carModels: Record<string, CarModel[]> = useMemo(() => {
    if (useNewApi) {
      const models: Record<string, CarModel[]> = {};
      apiBrands.forEach((brand: any) => {
        const brandId = brand._id || brand.id;
        models[brandId] = (brand.models || []).map((m: any) => ({
          name: m.name,
          type: m.type || 'Sedan',
          image: m.image || '',
        }));
      });
      return models;
    }
    return content.carModels || {};
  }, [useNewApi, apiBrands, content.carModels]);

  // Default data - moved before loading check since filteredBrands uses brands
  const cities: string[] = content.cities || ['Chennai'];
  const fuelTypes: FuelType[] = content.fuelTypes || [
    { id: 'petrol', name: 'Petrol', icon: '⛽', color: '#22C55E' },
    { id: 'diesel', name: 'Diesel', icon: '🛢️', color: '#EAB308' },
    { id: 'cng', name: 'CNG', icon: '💨', color: '#3B82F6' },
    { id: 'electric', name: 'Electric', icon: '⚡', color: '#8B5CF6' },
  ];

  // [FIX] Sync local brands/models with API data when it changes
  React.useEffect(() => {
    if (useNewApi && apiBrands) {
      const transformedBrands = apiBrands.map((b: any) => ({
        id: b._id || b.id,
        name: b.name,
        logo: b.logo || '',
        urlName: b.urlName || b.name?.toLowerCase().replace(/\s+/g, '-') || '',
      }));
      setLocalBrands(transformedBrands);
      
      const transformedModels: Record<string, CarModel[]> = {};
      apiBrands.forEach((brand: any) => {
        const brandId = brand._id || brand.id;
        transformedModels[brandId] = (brand.models || []).map((m: any) => ({
          name: m.name,
          type: m.type || 'Sedan',
          image: m.image || '',
        }));
      });
      setLocalModels(transformedModels);
    } else {
      setLocalBrands(content.brands || []);
      setLocalModels(content.carModels || {});
    }
  }, [useNewApi, apiBrands, content.brands, content.carModels]);

  // [FIX] Cleanup debounce timers on unmount
  React.useEffect(() => {
    return () => {
      debounceTimersRef.current.forEach(timer => clearTimeout(timer));
      debounceTimersRef.current.clear();
    };
  }, []);

  // [FIX] Use local state for brands/models - falls back to computed if local is empty
  const displayBrands = localBrands.length > 0 ? localBrands : brands;
  const displayModels = Object.keys(localModels).length > 0 ? localModels : carModels;

  // Filtered brands based on search - MUST be before loading check (it's a hook!)
  const filteredBrands = useMemo(() => {
    if (!brandSearch.trim()) return displayBrands;
    const searchLower = brandSearch.toLowerCase().trim();
    return displayBrands.filter(brand => 
      brand.name.toLowerCase().includes(searchLower) ||
      // Also search in models
      (displayModels[brand.id] || []).some(model => 
        model.name.toLowerCase().includes(searchLower)
      )
    );
  }, [displayBrands, brandSearch, displayModels]);

  // [LAZY LOADING] Show loading state - MUST be after ALL hooks (useState, useMemo, useEffect, etc.)
  if (content.isLoading || carBrandsLoading) {
    return <SectionLoader section="Booking Widget" />;
  }

  const toggleSection = (section: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(section)) {
      newExpanded.delete(section);
    } else {
      newExpanded.add(section);
    }
    setExpandedSections(newExpanded);
  };

  const toggleBrand = (index: number) => {
    const newExpanded = new Set(expandedBrands);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedBrands(newExpanded);
  };

  const toggleModel = (brandId: string, modelIndex: number) => {
    const key = `${brandId}-${modelIndex}`;
    const newExpanded = new Set(expandedModels);
    if (newExpanded.has(key)) {
      newExpanded.delete(key);
    } else {
      newExpanded.add(key);
    }
    setExpandedModels(newExpanded);
  };

  const handleUpdate = (path: string, value: unknown) => {
    updateField('bookingWidget', path, value);
  };

  // Theme-aware styling helpers
  const inputClass = `w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl text-sm transition-all bg-background border-border text-foreground placeholder-muted-foreground focus:border-primary border focus:outline-none focus:ring-2 focus:ring-primary/20`;

  const labelClass = `text-sm font-medium text-muted-foreground`;

  const sectionClass = `rounded-xl border overflow-hidden border-border bg-card`;

  const sectionHeaderClass = `w-full flex items-center justify-between p-3 sm:p-4 text-left transition-colors hover:bg-secondary/50`;

  // Get filtered models for a specific brand
  const getFilteredModels = (brandId: string) => {
    const models = carModels[brandId] || [];
    const search = modelSearch[brandId]?.toLowerCase().trim();
    if (!search) return models;
    return models.filter(model => 
      model.name.toLowerCase().includes(search) ||
      model.type.toLowerCase().includes(search)
    );
  };

  // Update model search for a specific brand
  const setModelSearchForBrand = (brandId: string, value: string) => {
    setModelSearch(prev => ({ ...prev, [brandId]: value }));
  };

  // Generate ID from name
  const generateId = (name: string) => name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

  // [UPDATED] Add new brand - uses new API if available
  const addBrand = async () => {
    // [FIX] Generate unique name to avoid duplicate conflicts
    const randomSuffix = Math.random().toString(36).substring(2, 6).toUpperCase();
    const uniqueName = `New Brand ${randomSuffix}`;
    const uniqueUrlName = `new-brand-${randomSuffix.toLowerCase()}`;
    
    if (useNewApi && createBrandApi) {
      setIsSaving(true);
      try {
        // [FIX] Include placeholder logo to pass backend validation
        await createBrandApi({ 
          name: uniqueName, 
          logo: '/images/placeholder-brand.png',
          urlName: uniqueUrlName 
        });
        setExpandedBrands(new Set([0]));
      } catch (error) {
        console.error('Failed to create brand:', error);
      } finally {
        setIsSaving(false);
      }
    } else {
      // Legacy fallback
      const newBrand: Brand = {
        id: `brand-${Date.now()}`,
        name: uniqueName,
        logo: '/images/placeholder-brand.png',
        urlName: uniqueUrlName,
      };
      handleUpdate('brands', [newBrand, ...brands]);
      setExpandedBrands(new Set([0]));
    }
  };

  // [FIX] Update brand - with debouncing to prevent too many API calls
  const updateBrand = (index: number, field: keyof Brand, value: string) => {
    const brandId = displayBrands[index]?.id;
    
    // [FIX] Update local state immediately for responsive UI
    setLocalBrands(prev => {
      const newBrands = [...prev];
      newBrands[index] = { ...newBrands[index], [field]: value };
      if (field === 'name') {
        newBrands[index].urlName = generateId(value);
      }
      return newBrands;
    });

    // [FIX] Debounce the API call
    if (useNewApi && updateBrandApi && brandId) {
      const timerKey = `brand-${brandId}-${field}`;
      const existingTimer = debounceTimersRef.current.get(timerKey);
      if (existingTimer) clearTimeout(existingTimer);
      
      const timer = setTimeout(async () => {
        try {
          const updateData: any = { [field]: value };
          if (field === 'name') updateData.urlName = generateId(value);
          await updateBrandApi(brandId, updateData);
          console.log(`[Debounced] Updated brand ${brandId}:`, updateData);
        } catch (error) {
          console.error('Failed to update brand:', error);
        }
        debounceTimersRef.current.delete(timerKey);
      }, DEBOUNCE_DELAY);
      
      debounceTimersRef.current.set(timerKey, timer);
    } else {
      // Legacy fallback - also debounce
      const timerKey = `legacy-brand-${index}-${field}`;
      const existingTimer = debounceTimersRef.current.get(timerKey);
      if (existingTimer) clearTimeout(existingTimer);
      
      const timer = setTimeout(() => {
        const newBrands = [...brands];
        newBrands[index] = { ...newBrands[index], [field]: value };
        if (field === 'name') {
          newBrands[index].id = generateId(value);
          newBrands[index].urlName = generateId(value);
        }
        handleUpdate('brands', newBrands);
        debounceTimersRef.current.delete(timerKey);
      }, DEBOUNCE_DELAY);
      
      debounceTimersRef.current.set(timerKey, timer);
    }
  };

  // [UPDATED] Delete brand - uses new API if available
  const deleteBrand = async (index: number) => {
    if (useNewApi && deleteBrandApi) {
      const brandId = brands[index]?.id;
      if (brandId) {
        setIsSaving(true);
        try {
          // API signature: deleteBrandApi(id)
          await deleteBrandApi(brandId);
        } catch (error) {
          console.error('Failed to delete brand:', error);
        } finally {
          setIsSaving(false);
        }
      }
    } else {
      // Legacy fallback
      const brandId = brands[index].id;
      const newBrands = brands.filter((_, i) => i !== index);
      handleUpdate('brands', newBrands);
      const newCarModels = { ...carModels };
      delete newCarModels[brandId];
      handleUpdate('carModels', newCarModels);
    }
  };

  // [UPDATED] Add new model to brand - uses new API if available
  const addModel = async (brandId: string) => {
    // [FIX] Generate unique name to avoid duplicate conflicts
    const randomSuffix = Math.random().toString(36).substring(2, 6).toUpperCase();
    const uniqueName = `New Model ${randomSuffix}`;
    
    if (useNewApi && createModelApi) {
      setIsSaving(true);
      try {
        // [FIX] Include placeholder image
        await createModelApi(brandId, { 
          name: uniqueName, 
          type: 'Sedan', 
          image: '/images/placeholder-car.png' 
        });
        setExpandedModels(new Set([`${brandId}-0`]));
      } catch (error) {
        console.error('Failed to create model:', error);
      } finally {
        setIsSaving(false);
      }
    } else {
      // Legacy fallback
      const newModel: CarModel = {
        name: uniqueName,
        type: 'Sedan',
        image: '/images/placeholder-car.png',
      };
      const brandModels = carModels[brandId] || [];
      handleUpdate('carModels', {
        ...carModels,
        [brandId]: [newModel, ...brandModels],
      });
      setExpandedModels(new Set([`${brandId}-0`]));
    }
  };

  // [UPDATED] Update model - uses new API if available
  const updateModel = async (brandId: string, modelIndex: number, field: keyof CarModel, value: string) => {
    if (useNewApi && updateModelApi) {
      const brand = apiBrands?.find((b: any) => (b._id || b.id) === brandId);
      const modelId = brand?.models?.[modelIndex]?._id;
      if (modelId) {
        try {
          // API signature: updateModelApi(modelId, data)
          await updateModelApi(modelId, { [field]: value });
        } catch (error) {
          console.error('Failed to update model:', error);
        }
      }
    } else {
      // Legacy fallback
      const brandModels = [...(carModels[brandId] || [])];
      brandModels[modelIndex] = { ...brandModels[modelIndex], [field]: value };
      handleUpdate('carModels', {
        ...carModels,
        [brandId]: brandModels,
      });
    }
  };

  // [UPDATED] Delete model - uses new API if available
  const deleteModel = async (brandId: string, modelIndex: number) => {
    if (useNewApi && deleteModelApi) {
      const brand = apiBrands?.find((b: any) => (b._id || b.id) === brandId);
      const modelId = brand?.models?.[modelIndex]?._id;
      if (modelId) {
        setIsSaving(true);
        try {
          // API signature: deleteModelApi(modelId)
          await deleteModelApi(modelId);
        } catch (error) {
          console.error('Failed to delete model:', error);
        } finally {
          setIsSaving(false);
        }
      }
    } else {
      // Legacy fallback
      const brandModels = (carModels[brandId] || []).filter((_, i) => i !== modelIndex);
      handleUpdate('carModels', {
        ...carModels,
        [brandId]: brandModels,
      });
    }
  };

  // Add new fuel type
  const addFuelType = () => {
    const newFuel: FuelType = {
      id: `fuel-${Date.now()}`,
      name: 'New Fuel',
      icon: '🔋',
      color: '#6B7280',
    };
    // Add at the beginning of the array
    handleUpdate('fuelTypes', [newFuel, ...fuelTypes]);
  };

  // Update fuel type
  const updateFuelType = (index: number, field: keyof FuelType, value: string) => {
    const newFuelTypes = [...fuelTypes];
    newFuelTypes[index] = { ...newFuelTypes[index], [field]: value };
    
    if (field === 'name') {
      newFuelTypes[index].id = generateId(value);
    }
    
    handleUpdate('fuelTypes', newFuelTypes);
  };

  // Delete fuel type
  const deleteFuelType = (index: number) => {
    const newFuelTypes = fuelTypes.filter((_, i) => i !== index);
    handleUpdate('fuelTypes', newFuelTypes);
  };

  // Car type options
  const carTypeOptions = ['Hatchback', 'Sedan', 'SUV', 'MPV', 'Sports', 'Electric', 'Luxury', 'Van', 'Mini SUV'];

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Widget Header */}
      <div className={sectionClass}>
        <button onClick={() => toggleSection('header')} className={sectionHeaderClass}>
          <div className="flex items-center gap-2 sm:gap-3">
            <motion.div animate={{ rotate: expandedSections.has('header') ? 90 : 0 }}>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </motion.div>
            <Type className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" />
            <span className="font-medium text-foreground text-sm sm:text-base">Widget Header</span>
          </div>
        </button>

        <AnimatePresence>
          {expandedSections.has('header') && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="p-3 sm:p-4 pt-0 space-y-3 sm:space-y-4 border-t border-border">
                <div className="space-y-2">
                  <label className={labelClass}>Widget Title</label>
                  <input
                    type="text"
                    value={content.title || ''}
                    onChange={(e) => handleUpdate('title', e.target.value)}
                    placeholder="Book Your Car Service"
                    className={inputClass}
                  />
                </div>

                <div className="space-y-2">
                  <label className={labelClass}>Subtitle</label>
                  <input
                    type="text"
                    value={content.subtitle || ''}
                    onChange={(e) => handleUpdate('subtitle', e.target.value)}
                    placeholder="Get instant quotes and doorstep service"
                    className={inputClass}
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Step Labels */}
      <div className={sectionClass}>
        <button onClick={() => toggleSection('labels')} className={sectionHeaderClass}>
          <div className="flex items-center gap-2 sm:gap-3">
            <motion.div animate={{ rotate: expandedSections.has('labels') ? 90 : 0 }}>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </motion.div>
            <Type className="w-4 h-4 sm:w-5 sm:h-5 text-violet-500" />
            <span className="font-medium text-foreground text-sm sm:text-base">Step Labels</span>
          </div>
        </button>

        <AnimatePresence>
          {expandedSections.has('labels') && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="p-3 sm:p-4 pt-0 space-y-3 sm:space-y-4 border-t border-border">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div className="space-y-2">
                    <label className={labelClass}>
                      <MapPin className="w-4 h-4 inline mr-1" />
                      City Label
                    </label>
                    <input
                      type="text"
                      value={content.labels?.city || 'Select City'}
                      onChange={(e) => handleUpdate('labels.city', e.target.value)}
                      placeholder="Select City"
                      className={inputClass}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className={labelClass}>
                      <Car className="w-4 h-4 inline mr-1" />
                      Brand Label
                    </label>
                    <input
                      type="text"
                      value={content.labels?.brand || 'Select Brand'}
                      onChange={(e) => handleUpdate('labels.brand', e.target.value)}
                      placeholder="Select Brand"
                      className={inputClass}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className={labelClass}>
                      <Car className="w-4 h-4 inline mr-1" />
                      Model Label
                    </label>
                    <input
                      type="text"
                      value={content.labels?.model || 'Select Model'}
                      onChange={(e) => handleUpdate('labels.model', e.target.value)}
                      placeholder="Select Model"
                      className={inputClass}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className={labelClass}>
                      <Fuel className="w-4 h-4 inline mr-1" />
                      Fuel Label
                    </label>
                    <input
                      type="text"
                      value={content.labels?.fuel || 'Select Fuel Type'}
                      onChange={(e) => handleUpdate('labels.fuel', e.target.value)}
                      placeholder="Select Fuel Type"
                      className={inputClass}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className={labelClass}>
                    <Phone className="w-4 h-4 inline mr-1" />
                    Phone Label
                  </label>
                  <input
                    type="text"
                    value={(content.labels as any)?.phone || 'Enter Phone Number'}
                    onChange={(e) => handleUpdate('labels.phone', e.target.value)}
                    placeholder="Enter Phone Number"
                    className={inputClass}
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Cities */}
      <div className={sectionClass}>
        <div 
          onClick={() => toggleSection('cities')} 
          onKeyDown={(e) => e.key === 'Enter' && toggleSection('cities')}
          role="button"
          tabIndex={0}
          className={`${sectionHeaderClass} cursor-pointer`}
        >
          <div className="flex items-center gap-2 sm:gap-3">
            <motion.div animate={{ rotate: expandedSections.has('cities') ? 90 : 0 }}>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </motion.div>
            <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-red-500" />
            <span className="font-medium text-foreground text-sm sm:text-base">Cities</span>
            <span className="px-2 py-0.5 rounded-full text-xs bg-secondary text-muted-foreground">
              {cities.length}
            </span>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleUpdate('cities', ['New City', ...cities]);
            }}
            className="p-2 rounded-lg bg-secondary hover:bg-secondary/80 text-foreground"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        <AnimatePresence>
          {expandedSections.has('cities') && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="p-3 sm:p-4 pt-0 space-y-2 border-t border-border">
                {cities.map((city: string, index: number) => (
                  <div key={index} className="flex items-center gap-2">
                    <GripVertical className="w-4 h-4 text-muted-foreground cursor-grab hidden sm:block" />
                    <MapPin className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => {
                        const newCities = [...cities];
                        newCities[index] = e.target.value;
                        handleUpdate('cities', newCities);
                      }}
                      placeholder="City Name"
                      className={`flex-1 ${inputClass}`}
                    />
                    <button
                      onClick={() => {
                        const newCities = cities.filter((_: string, i: number) => i !== index);
                        handleUpdate('cities', newCities);
                      }}
                      className="p-2 rounded-lg text-destructive hover:bg-destructive/10 flex-shrink-0"
                      disabled={cities.length <= 1}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Car Brands - GalleryEditor Pattern */}
      <div className={sectionClass}>
        <div 
          onClick={() => toggleSection('brands')} 
          onKeyDown={(e) => e.key === 'Enter' && toggleSection('brands')}
          role="button"
          tabIndex={0}
          className={`${sectionHeaderClass} cursor-pointer`}
        >
          <div className="flex items-center gap-2 sm:gap-3">
            <motion.div animate={{ rotate: expandedSections.has('brands') ? 90 : 0 }}>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </motion.div>
            <Car className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" />
            <span className="font-medium text-foreground text-sm sm:text-base">Car Brands & Models</span>
            <span className="px-2 py-0.5 rounded-full text-xs bg-secondary text-muted-foreground">
              {brands.length}
            </span>
            {/* [NEW] Loading indicator */}
            {(carBrandsLoading || isSaving) && (
              <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
            )}
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              addBrand();
            }}
            disabled={isSaving}
            className="p-2 rounded-lg bg-secondary hover:bg-secondary/80 text-foreground disabled:opacity-50"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        <AnimatePresence>
          {expandedSections.has('brands') && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="p-3 sm:p-4 pt-0 space-y-3 border-t border-border">
                {/* [NEW] Loading State */}
                {carBrandsLoading && (
                  <div className="text-center py-6 sm:py-8 text-muted-foreground">
                    <Loader2 className="w-8 h-8 mx-auto mb-2 animate-spin text-primary" />
                    <p className="text-sm">Loading brands...</p>
                  </div>
                )}

                {/* Brand Search */}
                {!carBrandsLoading && brands.length > 3 && (
                  <div className="relative mt-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                    <input
                      type="text"
                      value={brandSearch}
                      onChange={(e) => setBrandSearch(e.target.value)}
                      placeholder="Search brands or models..."
                      className="w-full pl-10 pr-10 py-2.5 rounded-xl text-sm bg-secondary border border-border text-foreground placeholder-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                    />
                    {brandSearch && (
                      <button
                        onClick={() => setBrandSearch('')}
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-muted text-muted-foreground"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                )}

                {/* Search Results Count */}
                {!carBrandsLoading && brandSearch && (
                  <p className="text-xs text-muted-foreground">
                    Found {filteredBrands.length} of {brands.length} brands
                  </p>
                )}

                {!carBrandsLoading && brands.length === 0 && (
                  <div className="text-center py-6 sm:py-8 text-muted-foreground">
                    <Car className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No brands added yet</p>
                    <button onClick={addBrand} className="mt-2 text-primary text-sm font-medium">
                      + Add your first brand
                    </button>
                  </div>
                )}

                {/* No search results */}
                {!carBrandsLoading && brands.length > 0 && filteredBrands.length === 0 && brandSearch && (
                  <div className="text-center py-6 text-muted-foreground">
                    <Search className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No brands match "{brandSearch}"</p>
                    <button 
                      onClick={() => setBrandSearch('')}
                      className="mt-2 text-primary text-sm font-medium"
                    >
                      Clear search
                    </button>
                  </div>
                )}
                
                {!carBrandsLoading && filteredBrands.map((brand) => {
                  // Find original index for expand state
                  const originalIndex = brands.findIndex(b => b.id === brand.id);
                  return (
                  <div
                    key={brand.id}
                    className="rounded-xl border overflow-hidden border-border bg-card"
                  >
                    {/* Brand Header */}
                    <div
                      onClick={() => toggleBrand(originalIndex)}
                      onKeyDown={(e) => e.key === 'Enter' && toggleBrand(originalIndex)}
                      role="button"
                      tabIndex={0}
                      className="w-full flex items-center justify-between p-3 sm:p-4 text-left hover:bg-secondary/50 cursor-pointer"
                    >
                      <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                        <GripVertical className="w-4 h-4 cursor-grab text-muted-foreground hidden sm:block" />
                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg overflow-hidden bg-secondary flex-shrink-0 flex items-center justify-center border border-border">
                          {brand.logo ? (
                            <img
                              src={brand.logo.startsWith('http') || brand.logo.startsWith('data:') ? brand.logo : `${brand.logo}`}
                              alt={brand.name || ''}
                              className="w-full h-full object-contain p-1"
                              onError={(e) => {
                                (e.target as HTMLImageElement).style.display = 'none';
                              }}
                            />
                          ) : (
                            <Car className="w-5 h-5 text-muted-foreground" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-foreground text-sm truncate">
                            {brand.name || 'Untitled Brand'}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {(carModels[brand.id] || []).length} models
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteBrand(originalIndex);
                          }}
                          disabled={isSaving}
                          className="p-1.5 sm:p-2 rounded-lg text-destructive hover:bg-destructive/10 disabled:opacity-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <motion.div animate={{ rotate: expandedBrands.has(originalIndex) ? 180 : 0 }}>
                          <ChevronDown className="w-4 h-4 text-muted-foreground" />
                        </motion.div>
                      </div>
                    </div>

                    {/* Brand Details */}
                    <AnimatePresence>
                      {expandedBrands.has(originalIndex) && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden border-t border-border"
                        >
                          <div className="p-3 sm:p-4 space-y-3 sm:space-y-4">
                            {/* Brand Logo Upload */}
                            <ImageUpload
                              value={brand.logo || ''}
                              onChange={(url) => updateBrand(originalIndex, 'logo', url)}
                              label="Brand Logo"
                              placeholder="Upload image or enter URL"
                              previewHeight="h-40"
                              maxSizeMB={2}
                              maxWidthOrHeight={1920}
                              helperText="Recommended: Transparent PNG logo"
                              showAltInput={false}
                              compact={false}
                            />

                            {/* Brand Name */}
                            <div className="space-y-2">
                              <label className={labelClass}>Brand Name</label>
                              <input
                                type="text"
                                value={brand.name}
                                onChange={(e) => updateBrand(originalIndex, 'name', e.target.value)}
                                placeholder="Brand Name"
                                className={inputClass}
                              />
                            </div>

                            {/* Models Section */}
                            <div className="pt-3 border-t border-border">
                              <div className="flex items-center justify-between mb-3">
                                <label className="text-sm font-semibold text-foreground flex items-center gap-2">
                                  <Car className="w-4 h-4 text-blue-500" />
                                  Car Models
                                  <span className="px-2 py-0.5 rounded-full text-xs bg-secondary text-muted-foreground font-normal">
                                    {(carModels[brand.id] || []).length}
                                  </span>
                                </label>
                                <button
                                  onClick={() => addModel(brand.id)}
                                  disabled={isSaving}
                                  className="text-xs text-primary font-medium hover:text-primary/80 disabled:opacity-50"
                                >
                                  + Add Model
                                </button>
                              </div>

                              {/* Model Search */}
                              {(carModels[brand.id] || []).length > 3 && (
                                <div className="relative mb-3">
                                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
                                  <input
                                    type="text"
                                    value={modelSearch[brand.id] || ''}
                                    onChange={(e) => setModelSearchForBrand(brand.id, e.target.value)}
                                    placeholder="Search models..."
                                    className="w-full pl-9 pr-9 py-2 rounded-lg text-xs bg-secondary/50 border border-border text-foreground placeholder-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                                  />
                                  {modelSearch[brand.id] && (
                                    <button
                                      onClick={() => setModelSearchForBrand(brand.id, '')}
                                      className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 rounded-full hover:bg-muted text-muted-foreground"
                                    >
                                      <X className="w-3.5 h-3.5" />
                                    </button>
                                  )}
                                </div>
                              )}

                              {/* Model Search Results Count */}
                              {modelSearch[brand.id] && (
                                <p className="text-[10px] text-muted-foreground mb-2">
                                  Found {getFilteredModels(brand.id).length} of {(carModels[brand.id] || []).length} models
                                </p>
                              )}

                              <div className="space-y-2">
                                {getFilteredModels(brand.id).map((model) => {
                                  // Find original index for expand state and actions
                                  const originalModelIndex = (carModels[brand.id] || []).findIndex(m => m.name === model.name && m.type === model.type);
                                  return (
                                  <div
                                    key={originalModelIndex}
                                    className="rounded-lg border overflow-hidden border-border bg-secondary/30"
                                  >
                                    {/* Model Header */}
                                    <div
                                      onClick={() => toggleModel(brand.id, originalModelIndex)}
                                      onKeyDown={(e) => e.key === 'Enter' && toggleModel(brand.id, originalModelIndex)}
                                      role="button"
                                      tabIndex={0}
                                      className="w-full flex items-center justify-between p-2 sm:p-3 text-left hover:bg-secondary/50 cursor-pointer"
                                    >
                                      <div className="flex items-center gap-2 min-w-0">
                                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg overflow-hidden bg-card border border-border flex-shrink-0 flex items-center justify-center">
                                          {model.image ? (
                                            <img
                                              src={model.image.startsWith('http') || model.image.startsWith('data:') ? model.image : `${model.image}`}
                                              alt={model.name || ''}
                                              className="w-full h-full object-contain p-1"
                                              onError={(e) => {
                                                (e.target as HTMLImageElement).style.display = 'none';
                                              }}
                                            />
                                          ) : (
                                            <Car className="w-5 h-5 text-muted-foreground" />
                                          )}
                                        </div>
                                        <div className="min-w-0">
                                          <p className="font-medium text-foreground text-xs sm:text-sm truncate">
                                            {model.name || 'Untitled Model'}
                                          </p>
                                          <p className="text-[10px] sm:text-xs text-muted-foreground">
                                            {model.type}
                                          </p>
                                        </div>
                                      </div>
                                      <div className="flex items-center gap-1 flex-shrink-0">
                                        <button
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            deleteModel(brand.id, originalModelIndex);
                                          }}
                                          disabled={isSaving}
                                          className="p-1 sm:p-1.5 rounded-lg text-destructive hover:bg-destructive/10 disabled:opacity-50"
                                        >
                                          <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                                        </button>
                                        <motion.div animate={{ rotate: expandedModels.has(`${brand.id}-${originalModelIndex}`) ? 180 : 0 }}>
                                          <ChevronDown className="w-3 h-3 sm:w-4 sm:h-4 text-muted-foreground" />
                                        </motion.div>
                                      </div>
                                    </div>

                                    {/* Model Details */}
                                    <AnimatePresence>
                                      {expandedModels.has(`${brand.id}-${originalModelIndex}`) && (
                                        <motion.div
                                          initial={{ height: 0, opacity: 0 }}
                                          animate={{ height: 'auto', opacity: 1 }}
                                          exit={{ height: 0, opacity: 0 }}
                                          className="overflow-hidden border-t border-border"
                                        >
                                          <div className="p-2 sm:p-3 space-y-3">
                                            {/* Model Image Upload */}
                                            <ImageUpload
                                              value={model.image || ''}
                                              onChange={(url) => updateModel(brand.id, originalModelIndex, 'image', url)}
                                              label="Model Image"
                                              placeholder="Upload image or enter URL"
                                              previewHeight="h-40"
                                              maxSizeMB={2}
                                              maxWidthOrHeight={1920}
                                              helperText="Car model image"
                                              showAltInput={false}
                                              compact={false}
                                            />

                                            {/* Model Name & Type */}
                                            <div className="grid grid-cols-2 gap-2 sm:gap-3">
                                              <div className="space-y-1">
                                                <label className="text-xs text-muted-foreground">Model Name</label>
                                                <input
                                                  type="text"
                                                  value={model.name}
                                                  onChange={(e) => updateModel(brand.id, originalModelIndex, 'name', e.target.value)}
                                                  placeholder="Model Name"
                                                  className={inputClass}
                                                />
                                              </div>
                                              <div className="space-y-1">
                                                <label className="text-xs text-muted-foreground">Type</label>
                                                <select
                                                  value={model.type}
                                                  onChange={(e) => updateModel(brand.id, originalModelIndex, 'type', e.target.value)}
                                                  className={inputClass}
                                                >
                                                  {carTypeOptions.map(type => (
                                                    <option key={type} value={type}>{type}</option>
                                                  ))}
                                                </select>
                                              </div>
                                            </div>
                                          </div>
                                        </motion.div>
                                      )}
                                    </AnimatePresence>
                                  </div>
                                  );
                                })}

                                {/* No model search results */}
                                {(carModels[brand.id] || []).length > 0 && getFilteredModels(brand.id).length === 0 && modelSearch[brand.id] && (
                                  <div className="text-center py-3 text-muted-foreground">
                                    <p className="text-xs">No models match "{modelSearch[brand.id]}"</p>
                                    <button 
                                      onClick={() => setModelSearchForBrand(brand.id, '')}
                                      className="mt-1 text-primary text-xs font-medium"
                                    >
                                      Clear search
                                    </button>
                                  </div>
                                )}

                                {(carModels[brand.id] || []).length === 0 && (
                                  <div className="text-center py-4 text-muted-foreground">
                                    <p className="text-xs">No models added yet</p>
                                    <button
                                      onClick={() => addModel(brand.id)}
                                      disabled={isSaving}
                                      className="mt-1 text-primary text-xs font-medium disabled:opacity-50"
                                    >
                                      + Add first model
                                    </button>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Fuel Types */}
      <div className={sectionClass}>
        <div 
          onClick={() => toggleSection('fuelTypes')} 
          onKeyDown={(e) => e.key === 'Enter' && toggleSection('fuelTypes')}
          role="button"
          tabIndex={0}
          className={`${sectionHeaderClass} cursor-pointer`}
        >
          <div className="flex items-center gap-2 sm:gap-3">
            <motion.div animate={{ rotate: expandedSections.has('fuelTypes') ? 90 : 0 }}>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </motion.div>
            <Fuel className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500" />
            <span className="font-medium text-foreground text-sm sm:text-base">Fuel Types</span>
            <span className="px-2 py-0.5 rounded-full text-xs bg-secondary text-muted-foreground">
              {fuelTypes.length}
            </span>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              addFuelType();
            }}
            className="p-2 rounded-lg bg-secondary hover:bg-secondary/80 text-foreground"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        <AnimatePresence>
          {expandedSections.has('fuelTypes') && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="p-3 sm:p-4 pt-0 space-y-3 border-t border-border">
                {fuelTypes.map((fuel, index) => (
                  <div key={fuel.id} className="flex items-center gap-2 sm:gap-3">
                    <GripVertical className="w-4 h-4 text-muted-foreground cursor-grab hidden sm:block" />
                    
                    {/* Icon Preview */}
                    <div 
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                      style={{ backgroundColor: `${fuel.color}20` }}
                    >
                      {fuel.icon}
                    </div>
                    
                    <input
                      type="text"
                      value={fuel.name}
                      onChange={(e) => updateFuelType(index, 'name', e.target.value)}
                      placeholder="Fuel Name"
                      className={`flex-1 ${inputClass}`}
                    />
                    
                    <input
                      type="text"
                      value={fuel.icon}
                      onChange={(e) => updateFuelType(index, 'icon', e.target.value)}
                      placeholder="🔋"
                      className={`w-16 text-center ${inputClass}`}
                    />
                    
                    <div className="flex items-center gap-1">
                      <input
                        type="color"
                        value={fuel.color}
                        onChange={(e) => updateFuelType(index, 'color', e.target.value)}
                        className="w-8 h-8 rounded cursor-pointer border-0 bg-transparent"
                      />
                    </div>
                    
                    <button
                      onClick={() => deleteFuelType(index)}
                      className="p-2 rounded-lg text-destructive hover:bg-destructive/10 flex-shrink-0"
                      disabled={fuelTypes.length <= 1}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                
                {fuelTypes.length === 0 && (
                  <p className="text-center py-4 text-sm text-muted-foreground">
                    No fuel types. <button onClick={addFuelType} className="text-primary">Add one</button>
                  </p>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* CTA Button */}
      <div className={sectionClass}>
        <button onClick={() => toggleSection('cta')} className={sectionHeaderClass}>
          <div className="flex items-center gap-2 sm:gap-3">
            <motion.div animate={{ rotate: expandedSections.has('cta') ? 90 : 0 }}>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </motion.div>
            <MousePointerClick className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500" />
            <span className="font-medium text-foreground text-sm sm:text-base">CTA Button</span>
          </div>
        </button>

        <AnimatePresence>
          {expandedSections.has('cta') && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="p-3 sm:p-4 pt-0 space-y-3 sm:space-y-4 border-t border-border">
                <div className="space-y-2">
                  <label className={labelClass}>Button Text</label>
                  <input
                    type="text"
                    value={content.ctaText || 'Check Prices For Free'}
                    onChange={(e) => handleUpdate('ctaText', e.target.value)}
                    placeholder="Check Prices For Free"
                    className={inputClass}
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Trust Footer */}
      <div className={sectionClass}>
        <button onClick={() => toggleSection('trustFooter')} className={sectionHeaderClass}>
          <div className="flex items-center gap-2 sm:gap-3">
            <motion.div animate={{ rotate: expandedSections.has('trustFooter') ? 90 : 0 }}>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </motion.div>
            <Star className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500" />
            <span className="font-medium text-foreground text-sm sm:text-base">Trust Footer</span>
          </div>
        </button>

        <AnimatePresence>
          {expandedSections.has('trustFooter') && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="p-3 sm:p-4 pt-0 space-y-3 sm:space-y-4 border-t border-border">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div className="space-y-2">
                    <label className={labelClass}>
                      <Star className="w-4 h-4 inline mr-1 text-yellow-500" />
                      Rating
                    </label>
                    <input
                      type="text"
                      value={content.trustFooter?.rating || '4.8/5'}
                      onChange={(e) => handleUpdate('trustFooter.rating', e.target.value)}
                      placeholder="4.8/5"
                      className={inputClass}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className={labelClass}>Services Count</label>
                    <input
                      type="text"
                      value={content.trustFooter?.servicesCount || '50,000+'}
                      onChange={(e) => handleUpdate('trustFooter.servicesCount', e.target.value)}
                      placeholder="50,000+"
                      className={inputClass}
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default BookingWidgetEditor;