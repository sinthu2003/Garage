import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Type,
  MapPin,
  Car,
  Fuel,
  ChevronRight,
  Star,
  Phone,
  Plus,
  Trash2,
  MousePointerClick,
  Image,
  GripVertical,
} from 'lucide-react';
import { useBookingWidgetContent } from '../../hooks/useContentHooks';
import { useContent } from '../../context/ContentContext';

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
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(['header', 'labels', 'cities', 'brands', 'fuelTypes', 'cta', 'trustFooter'])
  );
  const [selectedBrandForModels, setSelectedBrandForModels] = useState<string | null>(null);

  const toggleSection = (section: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(section)) {
      newExpanded.delete(section);
    } else {
      newExpanded.add(section);
    }
    setExpandedSections(newExpanded);
  };

  const handleUpdate = (path: string, value: unknown) => {
    updateField('bookingWidget', path, value);
  };

  // Theme-aware styling helpers
  const inputClass = `w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl text-sm transition-all bg-background border-border text-foreground placeholder-muted-foreground focus:border-primary border focus:outline-none focus:ring-2 focus:ring-primary/20`;

  const labelClass = `text-sm font-medium text-muted-foreground`;

  const sectionClass = `rounded-xl border overflow-hidden border-border bg-card`;

  const sectionHeaderClass = `w-full flex items-center justify-between p-3 sm:p-4 text-left transition-colors hover:bg-secondary/50`;

  // Default data
  const cities: string[] = content.cities || ['Chennai'];
  const brands: Brand[] = content.brands || [];
  const carModels: Record<string, CarModel[]> = content.carModels || {};
  const fuelTypes: FuelType[] = content.fuelTypes || [
    { id: 'petrol', name: 'Petrol', icon: '⛽', color: '#22C55E' },
    { id: 'diesel', name: 'Diesel', icon: '🛢️', color: '#EAB308' },
    { id: 'cng', name: 'CNG', icon: '💨', color: '#3B82F6' },
    { id: 'electric', name: 'Electric', icon: '⚡', color: '#8B5CF6' },
  ];

  // Generate ID from name
  const generateId = (name: string) => name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

  // Add new brand
  const addBrand = () => {
    const newBrand: Brand = {
      id: `brand-${Date.now()}`,
      name: 'New Brand',
      logo: '',
      urlName: 'new-brand',
    };
    handleUpdate('brands', [...brands, newBrand]);
  };

  // Update brand
  const updateBrand = (index: number, field: keyof Brand, value: string) => {
    const newBrands = [...brands];
    newBrands[index] = { ...newBrands[index], [field]: value };
    
    // Auto-update id and urlName when name changes
    if (field === 'name') {
      newBrands[index].id = generateId(value);
      newBrands[index].urlName = generateId(value);
    }
    
    handleUpdate('brands', newBrands);
  };

  // Delete brand
  const deleteBrand = (index: number) => {
    const brandId = brands[index].id;
    const newBrands = brands.filter((_, i) => i !== index);
    handleUpdate('brands', newBrands);
    
    // Also remove models for this brand
    const newCarModels = { ...carModels };
    delete newCarModels[brandId];
    handleUpdate('carModels', newCarModels);
    
    if (selectedBrandForModels === brandId) {
      setSelectedBrandForModels(null);
    }
  };

  // Add new model to brand
  const addModel = (brandId: string) => {
    const newModel: CarModel = {
      name: 'New Model',
      type: 'Sedan',
      image: '',
    };
    const brandModels = carModels[brandId] || [];
    handleUpdate('carModels', {
      ...carModels,
      [brandId]: [...brandModels, newModel],
    });
  };

  // Update model
  const updateModel = (brandId: string, modelIndex: number, field: keyof CarModel, value: string) => {
    const brandModels = [...(carModels[brandId] || [])];
    brandModels[modelIndex] = { ...brandModels[modelIndex], [field]: value };
    handleUpdate('carModels', {
      ...carModels,
      [brandId]: brandModels,
    });
  };

  // Delete model
  const deleteModel = (brandId: string, modelIndex: number) => {
    const brandModels = (carModels[brandId] || []).filter((_, i) => i !== modelIndex);
    handleUpdate('carModels', {
      ...carModels,
      [brandId]: brandModels,
    });
  };

  // Add new fuel type
  const addFuelType = () => {
    const newFuel: FuelType = {
      id: `fuel-${Date.now()}`,
      name: 'New Fuel',
      icon: '🔋',
      color: '#6B7280',
    };
    handleUpdate('fuelTypes', [...fuelTypes, newFuel]);
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
                  <label className={labelClass}>Title</label>
                  <input
                    type="text"
                    value={content.title || 'Book Your Service'}
                    onChange={(e) => handleUpdate('title', e.target.value)}
                    placeholder="Book Your Service"
                    className={inputClass}
                  />
                </div>

                <div className="space-y-2">
                  <label className={labelClass}>Subtitle</label>
                  <input
                    type="text"
                    value={content.subtitle || 'Get instant quotes & doorstep service'}
                    onChange={(e) => handleUpdate('subtitle', e.target.value)}
                    placeholder="Get instant quotes & doorstep service"
                    className={inputClass}
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Form Labels */}
      <div className={sectionClass}>
        <button onClick={() => toggleSection('labels')} className={sectionHeaderClass}>
          <div className="flex items-center gap-2 sm:gap-3">
            <motion.div animate={{ rotate: expandedSections.has('labels') ? 90 : 0 }}>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </motion.div>
            <Type className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />
            <span className="font-medium text-foreground text-sm sm:text-base">Form Labels & Placeholders</span>
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
              <div className="p-3 sm:p-4 pt-0 space-y-4 border-t border-border">
                {/* City Selector */}
                <div className="p-3 rounded-xl border border-border bg-secondary/30">
                  <div className="flex items-center gap-2 mb-3">
                    <MapPin className="w-4 h-4 text-red-500" />
                    <span className="font-medium text-foreground text-sm">City Selector</span>
                  </div>
                  <input
                    type="text"
                    value={content.labels?.city || 'Select City'}
                    onChange={(e) => handleUpdate('labels.city', e.target.value)}
                    placeholder="Select City"
                    className={inputClass}
                  />
                </div>

                {/* Car Selector */}
                <div className="p-3 rounded-xl border border-border bg-secondary/30">
                  <div className="flex items-center gap-2 mb-3">
                    <Car className="w-4 h-4 text-blue-500" />
                    <span className="font-medium text-foreground text-sm">Car Selector</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs text-muted-foreground">Label</label>
                      <input
                        type="text"
                        value={content.labels?.car || 'Select Your Car'}
                        onChange={(e) => handleUpdate('labels.car', e.target.value)}
                        placeholder="Select Your Car"
                        className={inputClass}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs text-muted-foreground">Placeholder</label>
                      <input
                        type="text"
                        value={content.labels?.carPlaceholder || 'Select your car'}
                        onChange={(e) => handleUpdate('labels.carPlaceholder', e.target.value)}
                        placeholder="Select your car"
                        className={inputClass}
                      />
                    </div>
                  </div>
                </div>

                {/* Mobile Number */}
                <div className="p-3 rounded-xl border border-border bg-secondary/30">
                  <div className="flex items-center gap-2 mb-3">
                    <Phone className="w-4 h-4 text-green-500" />
                    <span className="font-medium text-foreground text-sm">Mobile Number</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs text-muted-foreground">Label</label>
                      <input
                        type="text"
                        value={content.labels?.mobile || 'Mobile Number'}
                        onChange={(e) => handleUpdate('labels.mobile', e.target.value)}
                        placeholder="Mobile Number"
                        className={inputClass}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs text-muted-foreground">Placeholder</label>
                      <input
                        type="text"
                        value={content.labels?.mobilePlaceholder || 'Enter your mobile number'}
                        onChange={(e) => handleUpdate('labels.mobilePlaceholder', e.target.value)}
                        placeholder="Enter your mobile number"
                        className={inputClass}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs text-muted-foreground">Country Code</label>
                      <input
                        type="text"
                        value={content.labels?.countryCode || '+91'}
                        onChange={(e) => handleUpdate('labels.countryCode', e.target.value)}
                        placeholder="+91"
                        className={inputClass}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Service Cities */}
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
            <span className="font-medium text-foreground text-sm sm:text-base">Service Cities</span>
            <span className="px-2 py-0.5 rounded-full text-xs bg-secondary text-muted-foreground">
              {cities.length}
            </span>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleUpdate('cities', [...cities, 'New City']);
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
              <div className="p-3 sm:p-4 pt-0 space-y-3 border-t border-border">
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

      {/* Car Brands */}
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
            <span className="font-medium text-foreground text-sm sm:text-base">Car Brands</span>
            <span className="px-2 py-0.5 rounded-full text-xs bg-secondary text-muted-foreground">
              {brands.length}
            </span>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              addBrand();
            }}
            className="p-2 rounded-lg bg-secondary hover:bg-secondary/80 text-foreground"
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
              <div className="p-3 sm:p-4 pt-0 space-y-3 border-t border-border max-h-[500px] overflow-y-auto">
                {brands.length === 0 && (
                  <p className="text-center py-4 text-sm text-muted-foreground">
                    No brands added. <button onClick={addBrand} className="text-primary">Add one</button>
                  </p>
                )}
                
                {brands.map((brand, index) => (
                  <div key={brand.id} className="p-3 rounded-xl border border-border bg-secondary/30">
                    <div className="flex items-start gap-3">
                      {/* Brand Logo Preview */}
                      <div className="w-12 h-12 rounded-xl bg-card border border-border flex items-center justify-center flex-shrink-0 overflow-hidden">
                        {brand.logo ? (
                          <img 
                            src={brand.logo} 
                            alt={brand.name} 
                            className="w-10 h-10 object-contain"
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display = 'none';
                            }}
                          />
                        ) : (
                          <Car className="w-6 h-6 text-muted-foreground" />
                        )}
                      </div>
                      
                      <div className="flex-1 space-y-3">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          <div className="space-y-1">
                            <label className="text-xs text-muted-foreground">Brand Name</label>
                            <input
                              type="text"
                              value={brand.name}
                              onChange={(e) => updateBrand(index, 'name', e.target.value)}
                              placeholder="Brand Name"
                              className={inputClass}
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-xs text-muted-foreground">
                              <Image className="w-3 h-3 inline mr-1" />
                              Logo URL
                            </label>
                            <input
                              type="text"
                              value={brand.logo}
                              onChange={(e) => updateBrand(index, 'logo', e.target.value)}
                              placeholder="https://..."
                              className={inputClass}
                            />
                          </div>
                        </div>
                        
                        {/* Models for this brand */}
                        <div className="pt-2 border-t border-border">
                          <button
                            onClick={() => setSelectedBrandForModels(
                              selectedBrandForModels === brand.id ? null : brand.id
                            )}
                            className="flex items-center gap-2 text-sm text-primary hover:text-primary/80"
                          >
                            <ChevronRight className={`w-4 h-4 transition-transform ${selectedBrandForModels === brand.id ? 'rotate-90' : ''}`} />
                            Manage Models ({(carModels[brand.id] || []).length})
                          </button>
                          
                          <AnimatePresence>
                            {selectedBrandForModels === brand.id && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="overflow-hidden"
                              >
                                <div className="mt-3 space-y-2">
                                  {(carModels[brand.id] || []).map((model, modelIndex) => (
                                    <div key={modelIndex} className="flex items-center gap-2 p-2 rounded-lg bg-card">
                                      <div className="w-10 h-8 rounded bg-secondary flex items-center justify-center overflow-hidden">
                                        {model.image ? (
                                          <img src={model.image} alt={model.name} className="w-full h-full object-contain mix-blend-multiply" />
                                        ) : (
                                          <Car className="w-4 h-4 text-muted-foreground" />
                                        )}
                                      </div>
                                      <input
                                        type="text"
                                        value={model.name}
                                        onChange={(e) => updateModel(brand.id, modelIndex, 'name', e.target.value)}
                                        placeholder="Model Name"
                                        className={`flex-1 ${inputClass} !py-2`}
                                      />
                                      <select
                                        value={model.type}
                                        onChange={(e) => updateModel(brand.id, modelIndex, 'type', e.target.value)}
                                        className={`w-28 ${inputClass} !py-2`}
                                      >
                                        {carTypeOptions.map(type => (
                                          <option key={type} value={type}>{type}</option>
                                        ))}
                                      </select>
                                      <input
                                        type="text"
                                        value={model.image}
                                        onChange={(e) => updateModel(brand.id, modelIndex, 'image', e.target.value)}
                                        placeholder="Image URL"
                                        className={`w-32 ${inputClass} !py-2 hidden sm:block`}
                                      />
                                      <button
                                        onClick={() => deleteModel(brand.id, modelIndex)}
                                        className="p-1.5 rounded text-destructive hover:bg-destructive/10"
                                      >
                                        <Trash2 className="w-4 h-4" />
                                      </button>
                                    </div>
                                  ))}
                                  
                                  <button
                                    onClick={() => addModel(brand.id)}
                                    className="w-full py-2 text-sm text-primary border border-dashed border-primary/30 rounded-lg hover:bg-primary/5"
                                  >
                                    + Add Model
                                  </button>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </div>
                      
                      <button
                        onClick={() => deleteBrand(index)}
                        className="p-2 rounded-lg text-destructive hover:bg-destructive/10 flex-shrink-0"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
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