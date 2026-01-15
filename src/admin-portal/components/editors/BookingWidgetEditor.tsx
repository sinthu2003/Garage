import React, { useState, useMemo, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Type, MapPin, Car, Fuel, ChevronRight, ChevronDown, Star, Phone,
  Plus, Trash2, MousePointerClick, GripVertical, Search, X, Loader2,
} from 'lucide-react';
import { useBookingWidgetContent } from '../../hooks/useContentHooks';
import { useContent } from '../../context/ContentContext';
import { ImageUpload } from '../shared/ImageUpload';
import { SectionLoader } from '../shared/Sectionloader';

interface BookingWidgetEditorProps { isDarkMode: boolean; }
interface Brand { id: string; name: string; logo: string; urlName: string; }
interface CarModel { name: string; type: string; image: string; }
interface FuelType { id: string; name: string; icon: string; color: string; }

export const BookingWidgetEditor: React.FC<BookingWidgetEditorProps> = ({ isDarkMode }) => {
  const { updateField } = useContent();
  const content = useBookingWidgetContent();
  const {
    carBrands: apiBrands, carBrandsLoading,
    createBrand: createBrandApi, updateBrand: updateBrandApi, deleteBrand: deleteBrandApi,
    createModel: createModelApi, updateModel: updateModelApi, deleteModel: deleteModelApi,
  } = useContent();

  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(['header', 'labels', 'cities', 'brands', 'fuelTypes', 'cta', 'trustFooter'])
  );
  const [expandedBrands, setExpandedBrands] = useState<Set<number>>(new Set([0]));
  const [expandedModels, setExpandedModels] = useState<Set<string>>(new Set());
  const [brandSearch, setBrandSearch] = useState('');
  const [modelSearch, setModelSearch] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);
  const debounceTimersRef = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());
  const DEBOUNCE_DELAY = 1000;
  const [localBrands, setLocalBrands] = useState<Brand[]>([]);
  const [localModels, setLocalModels] = useState<Record<string, CarModel[]>>({});

  const useNewApi = apiBrands && apiBrands.length > 0;
  const generateId = (name: string) => name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

  const brands: Brand[] = useMemo(() => {
    if (useNewApi) {
      return apiBrands.map((b: any) => ({
        id: b._id || b.id, name: b.name, logo: b.logo || '',
        urlName: b.urlName || b.name?.toLowerCase().replace(/\s+/g, '-') || '',
      }));
    }
    return content.brands || [];
  }, [useNewApi, apiBrands, content.brands]);

  const carModels: Record<string, CarModel[]> = useMemo(() => {
    if (useNewApi) {
      const models: Record<string, CarModel[]> = {};
      apiBrands.forEach((brand: any) => {
        const brandId = brand._id || brand.id;
        models[brandId] = (brand.models || []).map((m: any) => ({
          name: m.name, type: m.type || 'Sedan', image: m.image || '',
        }));
      });
      return models;
    }
    return content.carModels || {};
  }, [useNewApi, apiBrands, content.carModels]);

  const cities: string[] = content.cities || ['Chennai'];
  const fuelTypes: FuelType[] = content.fuelTypes || [
    { id: 'petrol', name: 'Petrol', icon: '⛽', color: '#22C55E' },
    { id: 'diesel', name: 'Diesel', icon: '🛢️', color: '#EAB308' },
    { id: 'cng', name: 'CNG', icon: '💨', color: '#3B82F6' },
    { id: 'electric', name: 'Electric', icon: '⚡', color: '#8B5CF6' },
  ];

  useEffect(() => {
    if (useNewApi && apiBrands) {
      const transformedBrands = apiBrands.map((b: any) => ({
        id: b._id || b.id, name: b.name, logo: b.logo || '',
        urlName: b.urlName || b.name?.toLowerCase().replace(/\s+/g, '-') || '',
      }));
      setLocalBrands(transformedBrands);
      const transformedModels: Record<string, CarModel[]> = {};
      apiBrands.forEach((brand: any) => {
        const brandId = brand._id || brand.id;
        transformedModels[brandId] = (brand.models || []).map((m: any) => ({
          name: m.name, type: m.type || 'Sedan', image: m.image || '',
        }));
      });
      setLocalModels(transformedModels);
    } else {
      setLocalBrands(content.brands || []);
      setLocalModels(content.carModels || {});
    }
  }, [useNewApi, apiBrands, content.brands, content.carModels]);

  useEffect(() => {
    return () => {
      debounceTimersRef.current.forEach(timer => clearTimeout(timer));
      debounceTimersRef.current.clear();
    };
  }, []);

  const displayBrands = localBrands.length > 0 ? localBrands : brands;
  const displayModels = Object.keys(localModels).length > 0 ? localModels : carModels;

  const filteredBrands = useMemo(() => {
    if (!brandSearch.trim()) return displayBrands;
    const searchLower = brandSearch.toLowerCase().trim();
    return displayBrands.filter(brand =>
      brand.name.toLowerCase().includes(searchLower) ||
      (displayModels[brand.id] || []).some(model => model.name.toLowerCase().includes(searchLower))
    );
  }, [displayBrands, brandSearch, displayModels]);

  if (content.isLoading || carBrandsLoading) {
    return <SectionLoader section="Booking Widget" />;
  }

  const toggleSection = (section: string) => {
    const newExpanded = new Set(expandedSections);
    newExpanded.has(section) ? newExpanded.delete(section) : newExpanded.add(section);
    setExpandedSections(newExpanded);
  };

  const toggleBrand = (index: number) => {
    const newExpanded = new Set(expandedBrands);
    newExpanded.has(index) ? newExpanded.delete(index) : newExpanded.add(index);
    setExpandedBrands(newExpanded);
  };

  const toggleModel = (brandId: string, modelIndex: number) => {
    const key = `${brandId}-${modelIndex}`;
    const newExpanded = new Set(expandedModels);
    newExpanded.has(key) ? newExpanded.delete(key) : newExpanded.add(key);
    setExpandedModels(newExpanded);
  };

  const handleUpdate = (path: string, value: unknown) => updateField('bookingWidget', path, value);

  const inputClass = `w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl text-sm transition-all border-border text-foreground placeholder-muted-foreground focus:border-primary border focus:outline-none focus:ring-2 focus:ring-primary/20 ${isDarkMode ? 'bg-secondary/20' : 'bg-background'}`;
  const labelClass = `text-sm font-medium text-muted-foreground`;
  const sectionClass = `rounded-xl border overflow-hidden border-border bg-card`;
  const sectionHeaderClass = `w-full flex items-center justify-between p-3 sm:p-4 text-left transition-colors hover:bg-secondary/50`;

  const getFilteredModels = (brandId: string) => {
    const models = displayModels[brandId] || [];
    const search = modelSearch[brandId]?.toLowerCase().trim();
    if (!search) return models;
    return models.filter(model => model.name.toLowerCase().includes(search) || model.type.toLowerCase().includes(search));
  };

  const setModelSearchForBrand = (brandId: string, value: string) => {
    setModelSearch(prev => ({ ...prev, [brandId]: value }));
  };

  const addBrand = async () => {
    const randomSuffix = Math.random().toString(36).substring(2, 6).toUpperCase();
    const uniqueName = `New Brand ${randomSuffix}`;
    const uniqueUrlName = `new-brand-${randomSuffix.toLowerCase()}`;
    if (useNewApi && createBrandApi) {
      setIsSaving(true);
      try {
        await createBrandApi({ name: uniqueName, logo: '/images/placeholder-brand.png', urlName: uniqueUrlName });
        setExpandedBrands(new Set([0]));
      } catch (error) { console.error('Failed to create brand:', error); }
      finally { setIsSaving(false); }
    } else {
      const newBrand: Brand = { id: `brand-${Date.now()}`, name: uniqueName, logo: '/images/placeholder-brand.png', urlName: uniqueUrlName };
      handleUpdate('brands', [newBrand, ...brands]);
      setExpandedBrands(new Set([0]));
    }
  };

  const updateBrand = (index: number, field: keyof Brand, value: string) => {
    const brandId = displayBrands[index]?.id;
    setLocalBrands(prev => {
      const newBrands = [...prev];
      newBrands[index] = { ...newBrands[index], [field]: value };
      if (field === 'name') newBrands[index].urlName = generateId(value);
      return newBrands;
    });
    if (useNewApi && updateBrandApi && brandId) {
      const timerKey = `brand-${brandId}-${field}`;
      const existingTimer = debounceTimersRef.current.get(timerKey);
      if (existingTimer) clearTimeout(existingTimer);
      const timer = setTimeout(async () => {
        try {
          const updateData: any = { [field]: value };
          if (field === 'name') updateData.urlName = generateId(value);
          await updateBrandApi(brandId, updateData);
        } catch (error) { console.error('Failed to update brand:', error); }
        debounceTimersRef.current.delete(timerKey);
      }, DEBOUNCE_DELAY);
      debounceTimersRef.current.set(timerKey, timer);
    } else {
      const timerKey = `legacy-brand-${index}-${field}`;
      const existingTimer = debounceTimersRef.current.get(timerKey);
      if (existingTimer) clearTimeout(existingTimer);
      const timer = setTimeout(() => {
        const newBrands = [...brands];
        newBrands[index] = { ...newBrands[index], [field]: value };
        if (field === 'name') { newBrands[index].id = generateId(value); newBrands[index].urlName = generateId(value); }
        handleUpdate('brands', newBrands);
        debounceTimersRef.current.delete(timerKey);
      }, DEBOUNCE_DELAY);
      debounceTimersRef.current.set(timerKey, timer);
    }
  };

  const deleteBrand = async (index: number) => {
    if (useNewApi && deleteBrandApi) {
      const brandId = displayBrands[index]?.id;
      if (brandId) {
        setIsSaving(true);
        try { await deleteBrandApi(brandId); }
        catch (error) { console.error('Failed to delete brand:', error); }
        finally { setIsSaving(false); }
      }
    } else {
      const brandId = brands[index].id;
      const newBrands = brands.filter((_, i) => i !== index);
      handleUpdate('brands', newBrands);
      const newCarModels = { ...carModels };
      delete newCarModels[brandId];
      handleUpdate('carModels', newCarModels);
    }
  };

  const addModel = async (brandId: string) => {
    const randomSuffix = Math.random().toString(36).substring(2, 6).toUpperCase();
    const uniqueName = `New Model ${randomSuffix}`;
    if (useNewApi && createModelApi) {
      setIsSaving(true);
      try {
        await createModelApi(brandId, { name: uniqueName, type: 'Sedan', image: '/images/placeholder-car.png' });
        setExpandedModels(new Set([`${brandId}-0`]));
      } catch (error) { console.error('Failed to create model:', error); }
      finally { setIsSaving(false); }
    } else {
      const newModel: CarModel = { name: uniqueName, type: 'Sedan', image: '/images/placeholder-car.png' };
      const brandModels = carModels[brandId] || [];
      handleUpdate('carModels', { ...carModels, [brandId]: [newModel, ...brandModels] });
      setExpandedModels(new Set([`${brandId}-0`]));
    }
  };

  const updateModel = async (brandId: string, modelIndex: number, field: keyof CarModel, value: string) => {
    setLocalModels(prev => {
      const newModels = { ...prev };
      if (newModels[brandId]) {
        newModels[brandId] = [...newModels[brandId]];
        newModels[brandId][modelIndex] = { ...newModels[brandId][modelIndex], [field]: value };
      }
      return newModels;
    });
    if (useNewApi && updateModelApi) {
      const brand = apiBrands?.find((b: any) => (b._id || b.id) === brandId);
      const modelId = brand?.models?.[modelIndex]?._id;
      if (modelId) {
        try { await updateModelApi(modelId, { [field]: value }); }
        catch (error) { console.error('Failed to update model:', error); }
      }
    } else {
      const brandModels = [...(carModels[brandId] || [])];
      brandModels[modelIndex] = { ...brandModels[modelIndex], [field]: value };
      handleUpdate('carModels', { ...carModels, [brandId]: brandModels });
    }
  };

  const deleteModel = async (brandId: string, modelIndex: number) => {
    if (useNewApi && deleteModelApi) {
      const brand = apiBrands?.find((b: any) => (b._id || b.id) === brandId);
      const modelId = brand?.models?.[modelIndex]?._id;
      if (modelId) {
        setIsSaving(true);
        try { await deleteModelApi(modelId); }
        catch (error) { console.error('Failed to delete model:', error); }
        finally { setIsSaving(false); }
      }
    } else {
      const brandModels = (carModels[brandId] || []).filter((_, i) => i !== modelIndex);
      handleUpdate('carModels', { ...carModels, [brandId]: brandModels });
    }
  };

  const addFuelType = () => {
    const newFuel: FuelType = { id: `fuel-${Date.now()}`, name: 'New Fuel', icon: '🔋', color: '#6B7280' };
    handleUpdate('fuelTypes', [newFuel, ...fuelTypes]);
  };

  const updateFuelType = (index: number, field: keyof FuelType, value: string) => {
    const newFuelTypes = [...fuelTypes];
    newFuelTypes[index] = { ...newFuelTypes[index], [field]: value };
    if (field === 'name') newFuelTypes[index].id = generateId(value);
    handleUpdate('fuelTypes', newFuelTypes);
  };

  const deleteFuelType = (index: number) => {
    const newFuelTypes = fuelTypes.filter((_, i) => i !== index);
    handleUpdate('fuelTypes', newFuelTypes);
  };

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
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
              <div className="p-3 sm:p-4 pt-0 space-y-3 sm:space-y-4 border-t border-border">
                <div className="space-y-2">
                  <label className={labelClass}>Widget Title</label>
                  <input type="text" value={content.title || ''} onChange={(e) => handleUpdate('title', e.target.value)} placeholder="Book Your Car Service" className={inputClass} />
                </div>
                <div className="space-y-2">
                  <label className={labelClass}>Subtitle</label>
                  <input type="text" value={content.subtitle || ''} onChange={(e) => handleUpdate('subtitle', e.target.value)} placeholder="Get instant quotes and doorstep service" className={inputClass} />
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
            <motion.div animate={{ rotate: expandedSections.has('labels') ? 90 : 0 }}><ChevronRight className="w-4 h-4 text-muted-foreground" /></motion.div>
            <Type className="w-4 h-4 sm:w-5 sm:h-5 text-violet-500" />
            <span className="font-medium text-foreground text-sm sm:text-base">Step Labels</span>
          </div>
        </button>
        <AnimatePresence>
          {expandedSections.has('labels') && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
              <div className="p-3 sm:p-4 pt-0 space-y-3 sm:space-y-4 border-t border-border">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div className="space-y-2">
                    <label className={labelClass}><MapPin className="w-4 h-4 inline mr-1" />City Label</label>
                    <input type="text" value={content.labels?.city || 'Select City'} onChange={(e) => handleUpdate('labels.city', e.target.value)} placeholder="Select City" className={inputClass} />
                  </div>
                  <div className="space-y-2">
                    <label className={labelClass}><Car className="w-4 h-4 inline mr-1" />Brand Label</label>
                    <input type="text" value={content.labels?.brand || 'Select Brand'} onChange={(e) => handleUpdate('labels.brand', e.target.value)} placeholder="Select Brand" className={inputClass} />
                  </div>
                  <div className="space-y-2">
                    <label className={labelClass}><Car className="w-4 h-4 inline mr-1" />Model Label</label>
                    <input type="text" value={content.labels?.model || 'Select Model'} onChange={(e) => handleUpdate('labels.model', e.target.value)} placeholder="Select Model" className={inputClass} />
                  </div>
                  <div className="space-y-2">
                    <label className={labelClass}><Fuel className="w-4 h-4 inline mr-1" />Fuel Label</label>
                    <input type="text" value={content.labels?.fuel || 'Select Fuel Type'} onChange={(e) => handleUpdate('labels.fuel', e.target.value)} placeholder="Select Fuel Type" className={inputClass} />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className={labelClass}><Phone className="w-4 h-4 inline mr-1" />Phone Label</label>
                  <input type="text" value={(content.labels as any)?.phone || 'Enter Phone Number'} onChange={(e) => handleUpdate('labels.phone', e.target.value)} placeholder="Enter Phone Number" className={inputClass} />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Cities */}
      <div className={sectionClass}>
        <div onClick={() => toggleSection('cities')} role="button" tabIndex={0} className={`${sectionHeaderClass} cursor-pointer`}>
          <div className="flex items-center gap-2 sm:gap-3">
            <motion.div animate={{ rotate: expandedSections.has('cities') ? 90 : 0 }}><ChevronRight className="w-4 h-4 text-muted-foreground" /></motion.div>
            <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-red-500" />
            <span className="font-medium text-foreground text-sm sm:text-base">Cities</span>
            <span className="px-2 py-0.5 rounded-full text-xs bg-secondary text-muted-foreground">{cities.length}</span>
          </div>
          <button onClick={(e) => { e.stopPropagation(); handleUpdate('cities', ['New City', ...cities]); }} className="p-2 rounded-lg bg-secondary hover:bg-secondary/80 text-foreground"><Plus className="w-4 h-4" /></button>
        </div>
        <AnimatePresence>
          {expandedSections.has('cities') && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
              <div className="p-3 sm:p-4 pt-0 space-y-2 border-t border-border">
                {cities.map((city: string, index: number) => (
                  <div key={index} className="flex items-center gap-2">
                    <GripVertical className="w-4 h-4 text-muted-foreground cursor-grab hidden sm:block" />
                    <MapPin className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                    <input type="text" value={city} onChange={(e) => { const newCities = [...cities]; newCities[index] = e.target.value; handleUpdate('cities', newCities); }} placeholder="City Name" className={`flex-1 ${inputClass}`} />
                    <button onClick={() => { const newCities = cities.filter((_: string, i: number) => i !== index); handleUpdate('cities', newCities); }} className="p-2 rounded-lg text-destructive hover:bg-destructive/10 flex-shrink-0" disabled={cities.length <= 1}><Trash2 className="w-4 h-4" /></button>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Car Brands & Models */}
      <div className={sectionClass}>
        <div onClick={() => toggleSection('brands')} role="button" tabIndex={0} className={`${sectionHeaderClass} cursor-pointer`}>
          <div className="flex items-center gap-2 sm:gap-3">
            <motion.div animate={{ rotate: expandedSections.has('brands') ? 90 : 0 }}><ChevronRight className="w-4 h-4 text-muted-foreground" /></motion.div>
            <Car className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" />
            <span className="font-medium text-foreground text-sm sm:text-base">Car Brands & Models</span>
            <span className="px-2 py-0.5 rounded-full text-xs bg-secondary text-muted-foreground">{displayBrands.length}</span>
            {(carBrandsLoading || isSaving) && <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />}
          </div>
          <button onClick={(e) => { e.stopPropagation(); addBrand(); }} disabled={isSaving} className="p-2 rounded-lg bg-secondary hover:bg-secondary/80 text-foreground disabled:opacity-50"><Plus className="w-4 h-4" /></button>
        </div>

        <AnimatePresence>
          {expandedSections.has('brands') && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
              <div className="p-3 sm:p-4 pt-0 space-y-3 border-t border-border">
                {carBrandsLoading && (
                  <div className="text-center py-6 sm:py-8 text-muted-foreground">
                    <Loader2 className="w-8 h-8 mx-auto mb-2 animate-spin text-primary" />
                    <p className="text-sm">Loading brands...</p>
                  </div>
                )}

                {!carBrandsLoading && displayBrands.length > 3 && (
                  <div className="relative mt-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                    <input type="text" value={brandSearch} onChange={(e) => setBrandSearch(e.target.value)} placeholder="Search brands or models..." className="w-full pl-10 pr-10 py-2.5 rounded-xl text-sm bg-secondary border border-border text-foreground placeholder-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all" />
                    {brandSearch && <button onClick={() => setBrandSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-muted text-muted-foreground"><X className="w-4 h-4" /></button>}
                  </div>
                )}

                {!carBrandsLoading && filteredBrands.map((brand) => {
                  const originalIndex = displayBrands.findIndex(b => b.id === brand.id);
                  const brandFolderName = brand.urlName || generateId(brand.name);
                  // S3 FOLDER PATHS - Dynamic based on brand name
                  const brandLogoFolder = 'booking-widget/brands';
                  const modelImageFolder = `booking-widget/models/${brandFolderName}`;

                  return (
                    <div key={brand.id} className="rounded-xl border overflow-hidden border-border bg-card">
                      <div onClick={() => toggleBrand(originalIndex)} role="button" tabIndex={0} className="w-full flex items-center justify-between p-3 sm:p-4 text-left hover:bg-secondary/50 cursor-pointer">
                        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                          <GripVertical className="w-4 h-4 cursor-grab text-muted-foreground hidden sm:block" />
                          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg overflow-hidden bg-secondary flex-shrink-0 flex items-center justify-center border border-border">
                            {brand.logo ? <img src={brand.logo} alt={brand.name} className="w-full h-full object-contain p-1" /> : <Car className="w-5 h-5 text-muted-foreground" />}
                          </div>
                          <div className="min-w-0">
                            <p className="font-medium text-foreground text-sm truncate">{brand.name || 'Untitled Brand'}</p>
                            <p className="text-xs text-muted-foreground">{(displayModels[brand.id] || []).length} models</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
                          <button onClick={(e) => { e.stopPropagation(); deleteBrand(originalIndex); }} disabled={isSaving} className="p-1.5 sm:p-2 rounded-lg text-destructive hover:bg-destructive/10 disabled:opacity-50"><Trash2 className="w-4 h-4" /></button>
                          <motion.div animate={{ rotate: expandedBrands.has(originalIndex) ? 180 : 0 }}><ChevronDown className="w-4 h-4 text-muted-foreground" /></motion.div>
                        </div>
                      </div>

                      <AnimatePresence>
                        {expandedBrands.has(originalIndex) && (
                          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden border-t border-border">
                            <div className="p-3 sm:p-4 space-y-3 sm:space-y-4">
                              {/* Brand Logo Upload - S3: booking-widget/brands/ */}
                              <ImageUpload
                                value={brand.logo || ''}
                                onChange={(url) => updateBrand(originalIndex, 'logo', url)}
                                label="Brand Logo"
                                cloudFolder={brandLogoFolder}
                                helperText={`S3: ${brandLogoFolder}/`}
                                previewHeight="h-40"
                                maxSizeMB={2}
                                maxWidthOrHeight={512}
                              />

                              <div className="space-y-2">
                                <label className={labelClass}>Brand Name</label>
                                <input type="text" value={brand.name} onChange={(e) => updateBrand(originalIndex, 'name', e.target.value)} placeholder="Brand Name" className={inputClass} />
                              </div>

                              {/* Models Section */}
                              <div className="pt-3 border-t border-border">
                                <div className="flex items-center justify-between mb-3">
                                  <label className="text-sm font-semibold text-foreground flex items-center gap-2">
                                    <Car className="w-4 h-4 text-blue-500" />
                                    Car Models
                                    <span className="px-2 py-0.5 rounded-full text-xs bg-secondary text-muted-foreground font-normal">{(displayModels[brand.id] || []).length}</span>
                                  </label>
                                  <button onClick={() => addModel(brand.id)} disabled={isSaving} className="text-xs text-primary font-medium hover:text-primary/80 disabled:opacity-50">+ Add Model</button>
                                </div>

                                {(displayModels[brand.id] || []).length > 3 && (
                                  <div className="relative mb-3">
                                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                                    <input type="text" value={modelSearch[brand.id] || ''} onChange={(e) => setModelSearchForBrand(brand.id, e.target.value)} placeholder="Filter models..." className="w-full pl-8 pr-8 py-1.5 rounded-lg text-xs bg-secondary border-border border focus:outline-none focus:ring-1 focus:ring-primary/30" />
                                    {modelSearch[brand.id] && <button onClick={() => setModelSearchForBrand(brand.id, '')} className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 rounded-full hover:bg-muted text-muted-foreground"><X className="w-3 h-3" /></button>}
                                  </div>
                                )}

                                <div className="space-y-2">
                                  {getFilteredModels(brand.id).map((model, mIdx) => {
                                    const modelKey = `${brand.id}-${mIdx}`;
                                    return (
                                      <div key={modelKey} className="rounded-lg border overflow-hidden border-border bg-secondary/30">
                                        <div onClick={() => toggleModel(brand.id, mIdx)} role="button" tabIndex={0} className="w-full flex items-center justify-between p-2 sm:p-3 text-left hover:bg-secondary/50 cursor-pointer">
                                          <div className="flex items-center gap-2 min-w-0">
                                            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg overflow-hidden bg-card border border-border flex-shrink-0 flex items-center justify-center">
                                              {model.image ? <img src={model.image} className="w-full h-full object-contain p-1" alt={model.name} /> : <Car className="w-5 h-5 text-muted-foreground" />}
                                            </div>
                                            <div className="min-w-0">
                                              <p className="font-medium text-foreground text-xs sm:text-sm truncate">{model.name || 'Untitled Model'}</p>
                                              <p className="text-[10px] sm:text-xs text-muted-foreground">{model.type}</p>
                                            </div>
                                          </div>
                                          <div className="flex items-center gap-1 flex-shrink-0">
                                            <button onClick={(e) => { e.stopPropagation(); deleteModel(brand.id, mIdx); }} disabled={isSaving} className="p-1 sm:p-1.5 rounded-lg text-destructive hover:bg-destructive/10 disabled:opacity-50"><Trash2 className="w-3 h-3 sm:w-4 sm:h-4" /></button>
                                            <motion.div animate={{ rotate: expandedModels.has(modelKey) ? 180 : 0 }}><ChevronDown className="w-3 h-3 sm:w-4 sm:h-4 text-muted-foreground" /></motion.div>
                                          </div>
                                        </div>

                                        <AnimatePresence>
                                          {expandedModels.has(modelKey) && (
                                            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden border-t border-border bg-card">
                                              <div className="p-2 sm:p-3 space-y-3">
                                                {/* Model Image Upload - S3: booking-widget/models/{brand-name}/ */}
                                                <ImageUpload
                                                  value={model.image || ''}
                                                  onChange={(url) => updateModel(brand.id, mIdx, 'image', url)}
                                                  label="Model Image"
                                                  cloudFolder={modelImageFolder}
                                                  helperText={`S3: ${modelImageFolder}/`}
                                                  compact={true}
                                                  previewHeight="h-32"
                                                  maxSizeMB={2}
                                                  maxWidthOrHeight={800}
                                                />
                                                <div className="grid grid-cols-2 gap-2 sm:gap-3">
                                                  <div className="space-y-1">
                                                    <label className="text-[10px] sm:text-xs text-muted-foreground">Model Name</label>
                                                    <input type="text" value={model.name} onChange={(e) => updateModel(brand.id, mIdx, 'name', e.target.value)} className="text-xs p-2 w-full rounded border border-border bg-background" />
                                                  </div>
                                                  <div className="space-y-1">
                                                    <label className="text-[10px] sm:text-xs text-muted-foreground">Type</label>
                                                    <select value={model.type} onChange={(e) => updateModel(brand.id, mIdx, 'type', e.target.value)} className="text-xs p-2 w-full rounded border border-border bg-background">
                                                      {carTypeOptions.map(type => <option key={type} value={type}>{type}</option>)}
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

                                  {(displayModels[brand.id] || []).length === 0 && (
                                    <div className="text-center py-4 text-muted-foreground">
                                      <p className="text-xs">No models added yet</p>
                                      <button onClick={() => addModel(brand.id)} disabled={isSaving} className="mt-1 text-primary text-xs font-medium disabled:opacity-50">+ Add first model</button>
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

                {!carBrandsLoading && displayBrands.length === 0 && (
                  <div className="text-center py-6 sm:py-8 text-muted-foreground">
                    <Car className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No brands added yet</p>
                    <button onClick={addBrand} className="mt-2 text-primary text-sm font-medium">+ Add your first brand</button>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Fuel Types */}
      <div className={sectionClass}>
        <div onClick={() => toggleSection('fuelTypes')} role="button" tabIndex={0} className={`${sectionHeaderClass} cursor-pointer`}>
          <div className="flex items-center gap-2 sm:gap-3">
            <motion.div animate={{ rotate: expandedSections.has('fuelTypes') ? 90 : 0 }}><ChevronRight className="w-4 h-4 text-muted-foreground" /></motion.div>
            <Fuel className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500" />
            <span className="font-medium text-foreground text-sm sm:text-base">Fuel Types</span>
            <span className="px-2 py-0.5 rounded-full text-xs bg-secondary text-muted-foreground">{fuelTypes.length}</span>
          </div>
          <button onClick={(e) => { e.stopPropagation(); addFuelType(); }} className="p-2 rounded-lg bg-secondary hover:bg-secondary/80 text-foreground"><Plus className="w-4 h-4" /></button>
        </div>
        <AnimatePresence>
          {expandedSections.has('fuelTypes') && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
              <div className="p-3 sm:p-4 pt-0 space-y-3 border-t border-border">
                {fuelTypes.map((fuel, index) => (
                  <div key={fuel.id} className="flex items-center gap-2 sm:gap-3">
                    <GripVertical className="w-4 h-4 text-muted-foreground cursor-grab hidden sm:block" />
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0" style={{ backgroundColor: `${fuel.color}20` }}>{fuel.icon}</div>
                    <input type="text" value={fuel.name} onChange={(e) => updateFuelType(index, 'name', e.target.value)} placeholder="Fuel Name" className={`flex-1 ${inputClass}`} />
                    <input type="text" value={fuel.icon} onChange={(e) => updateFuelType(index, 'icon', e.target.value)} className={`w-16 text-center ${inputClass}`} />
                    <input type="color" value={fuel.color} onChange={(e) => updateFuelType(index, 'color', e.target.value)} className="w-8 h-8 rounded cursor-pointer border-0 bg-transparent flex-shrink-0" />
                    <button onClick={() => deleteFuelType(index)} className="p-2 rounded-lg text-destructive hover:bg-destructive/10 flex-shrink-0" disabled={fuelTypes.length <= 1}><Trash2 className="w-4 h-4" /></button>
                  </div>
                ))}
                {fuelTypes.length === 0 && <p className="text-center py-4 text-sm text-muted-foreground">No fuel types. <button onClick={addFuelType} className="text-primary">Add one</button></p>}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* CTA Button */}
      <div className={sectionClass}>
        <button onClick={() => toggleSection('cta')} className={sectionHeaderClass}>
          <div className="flex items-center gap-2 sm:gap-3">
            <motion.div animate={{ rotate: expandedSections.has('cta') ? 90 : 0 }}><ChevronRight className="w-4 h-4 text-muted-foreground" /></motion.div>
            <MousePointerClick className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500" />
            <span className="font-medium text-foreground text-sm sm:text-base">CTA Button</span>
          </div>
        </button>
        <AnimatePresence>
          {expandedSections.has('cta') && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
              <div className="p-3 sm:p-4 pt-0 space-y-3 sm:space-y-4 border-t border-border">
                <div className="space-y-2">
                  <label className={labelClass}>Button Text</label>
                  <input type="text" value={content.ctaText || 'Check Prices For Free'} onChange={(e) => handleUpdate('ctaText', e.target.value)} placeholder="Check Prices For Free" className={inputClass} />
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
            <motion.div animate={{ rotate: expandedSections.has('trustFooter') ? 90 : 0 }}><ChevronRight className="w-4 h-4 text-muted-foreground" /></motion.div>
            <Star className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500" />
            <span className="font-medium text-foreground text-sm sm:text-base">Trust Footer</span>
          </div>
        </button>
        <AnimatePresence>
          {expandedSections.has('trustFooter') && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
              <div className="p-3 sm:p-4 pt-0 space-y-3 sm:space-y-4 border-t border-border">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div className="space-y-2">
                    <label className={labelClass}><Star className="w-4 h-4 inline mr-1 text-yellow-500" />Rating</label>
                    <input type="text" value={content.trustFooter?.rating || '4.8/5'} onChange={(e) => handleUpdate('trustFooter.rating', e.target.value)} placeholder="4.8/5" className={inputClass} />
                  </div>
                  <div className="space-y-2">
                    <label className={labelClass}>Services Count</label>
                    <input type="text" value={content.trustFooter?.servicesCount || '50,000+'} onChange={(e) => handleUpdate('trustFooter.servicesCount', e.target.value)} placeholder="50,000+" className={inputClass} />
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
