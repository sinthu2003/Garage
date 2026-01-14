import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  Trash2,
  Edit,
  ArrowLeft,
  CheckCircle2,
  Workflow,
  HelpCircle,
  Layers,
  Wrench,
  Loader2,
} from 'lucide-react';
import { useServicesContent } from '../../hooks/useContentHooks';
import { useContent } from '../../context/ContentContext';
import { ImageUpload } from '../shared/ImageUpload';

interface ServiceDetailEditorProps {
  isDarkMode: boolean;
  onEditingIndexChange?: (index: number | null) => void;
}

export const ServiceDetailEditor: React.FC<ServiceDetailEditorProps> = ({ onEditingIndexChange }) => {
  const { updateField } = useContent();
  
  // [NEW] Get services from separate collection + loading functions
  const {
    services,
    servicesLoading,
    loadServices,
    createService,
    updateService: updateServiceApi,
    deleteService: deleteServiceApi,
  } = useContent();

  // [LEGACY] Fallback to content.services if new API not available
  const legacyContent = useServicesContent();
  
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // [FIX] Local state for the service being edited - allows immediate UI updates
  const [localService, setLocalService] = useState<any>(null);
  
  // [FIX] Debounce timers ref - prevents too many API calls
const debounceTimersRef = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());
  const DEBOUNCE_DELAY = 1000; // ms

  // [FIX] Determine which data source to use
  // Only use legacy if services array is empty AND not currently loading
  const useNewApi = services && services.length > 0;
  const servicesList = useNewApi ? services : (legacyContent?.items || []);

  // Helper to get service ID (works for both new API and legacy)
  const getServiceId = (service: any): string | undefined => {
    return service?._id || service?.id;
  };

  // [FIX] Load services if not loaded yet
  // This ensures services are loaded even if AdminPage's useEffect hasn't triggered yet
  useEffect(() => {
    if (!services || services.length === 0) {
      loadServices?.();
    }
  }, []);  // Only run once on mount

  // [FIX] Sync local service state when editingIndex changes
  useEffect(() => {
    if (editingIndex !== null && servicesList[editingIndex]) {
      setLocalService({ ...servicesList[editingIndex] });
    } else {
      setLocalService(null);
    }
  }, [editingIndex, servicesList]);

  // [FIX] Cleanup debounce timers on unmount
  useEffect(() => {
    return () => {
      debounceTimersRef.current.forEach(timer => clearTimeout(timer));
      debounceTimersRef.current.clear();
    };
  }, []);

  // Notify parent whenever editingIndex changes
  useEffect(() => {
    onEditingIndexChange?.(editingIndex);
  }, [editingIndex, onEditingIndexChange]);

  // [LEGACY] Handle update for backward compatibility
  const handleUpdate = (path: string, value: unknown) => {
    updateField('services', path, value);
  };

  // Theme-aware styling helpers using CSS variables
  const inputClass = `w-full px-3 py-2.5 rounded-xl text-sm transition-all bg-background border-border text-foreground placeholder-muted-foreground focus:border-primary border focus:outline-none focus:ring-2 focus:ring-primary/20`;

  const labelClass = `block text-xs sm:text-sm font-medium text-muted-foreground mb-1`;

  const sectionClass = `rounded-xl border overflow-hidden border-border bg-card`;

  const subSectionTitleClass = `text-sm sm:text-md font-semibold mb-3 flex items-center gap-2 text-foreground`;

  // --- Actions ---
  const addNewService = async () => {
    const newServiceData = {
      title: 'New Service',
      description: 'Service description goes here',
      price: 999,
      originalPrice: 1499,
      image: '',
      gallery: [],
      features: ['Feature 1'],
      includes: ['Standard Inspection'],
      process: [{ title: 'Step 1', description: 'Description' }],
      faqs: [{ question: 'Question?', answer: 'Answer.' }],
      duration: '1-2 hours',
      warranty: '3 months',
    };

    if (useNewApi && createService) {
      // [NEW] Use new API
      setIsSaving(true);
      try {
        await createService(newServiceData);
        setEditingIndex(0); // New service added at beginning
      } catch (error) {
        console.error('Failed to create service:', error);
        alert('Failed to create service. Please try again.');
      } finally {
        setIsSaving(false);
      }
    } else {
      // [LEGACY] Fallback
      const newService = {
        id: `service-${Date.now()}`,
        ...newServiceData,
      };
      const newItems = [newService, ...(legacyContent?.items || [])];
      handleUpdate('items', newItems);
      setEditingIndex(0);
    }
  };

  const deleteService = async (index: number) => {
    if (!window.confirm('Are you sure you want to delete this service?')) return;

    const service = servicesList[index];
    const serviceId = getServiceId(service);

    if (useNewApi && deleteServiceApi && serviceId) {
      // [NEW] Use new API
      setIsSaving(true);
      try {
        await deleteServiceApi(serviceId);
        if (editingIndex === index) setEditingIndex(null);
      } catch (error) {
        console.error('Failed to delete service:', error);
        alert('Failed to delete service. Please try again.');
      } finally {
        setIsSaving(false);
      }
    } else {
      // [LEGACY] Fallback
      const newItems = legacyContent?.items?.filter((_: unknown, i: number) => i !== index);
      handleUpdate('items', newItems);
      if (editingIndex === index) setEditingIndex(null);
    }
  };

  // [FIX] Update service field - with debouncing to prevent too many API calls
  const updateServiceField = useCallback((index: number, field: string, value: unknown) => {
    const service = servicesList[index];
    const serviceId = getServiceId(service);

    // [FIX] Update local state immediately for responsive UI
    setLocalService((prev: any) => prev ? { ...prev, [field]: value } : null);

    // [FIX] Debounce the API call
    const timerKey = `service-${serviceId}-${field}`;
    const existingTimer = debounceTimersRef.current.get(timerKey);
    if (existingTimer) clearTimeout(existingTimer);

    const timer = setTimeout(async () => {
      if (useNewApi && updateServiceApi && serviceId) {
        try {
          console.log('[Debounced] Updating service:', serviceId, { [field]: value });
          await updateServiceApi(serviceId, { [field]: value });
        } catch (error) {
          console.error('[updateServiceField] API Error:', error);
        }
      } else {
        // [LEGACY] Fallback
        const newItems = [...(legacyContent?.items || [])];
        newItems[index] = { ...newItems[index], [field]: value };
        handleUpdate('items', newItems);
      }
      debounceTimersRef.current.delete(timerKey);
    }, DEBOUNCE_DELAY);

    debounceTimersRef.current.set(timerKey, timer);
  }, [servicesList, useNewApi, updateServiceApi, legacyContent?.items, handleUpdate]);

  // [FIX] Update nested service field - with debouncing to prevent too many API calls
  const updateServiceNestedField = useCallback((index: number, field: string, nestedValue: unknown) => {
    const service = servicesList[index];
    const serviceId = getServiceId(service);

    // [FIX] Update local state immediately for responsive UI
    setLocalService((prev: any) => prev ? { ...prev, [field]: nestedValue } : null);

    // [FIX] Debounce the API call
    const timerKey = `service-${serviceId}-${field}`;
    const existingTimer = debounceTimersRef.current.get(timerKey);
    if (existingTimer) clearTimeout(existingTimer);

    const timer = setTimeout(async () => {
      if (useNewApi && updateServiceApi && serviceId) {
        try {
          console.log('[Debounced] Updating nested field:', serviceId, field);
          await updateServiceApi(serviceId, { [field]: nestedValue });
        } catch (error) {
          console.error('[updateServiceNestedField] API Error:', error);
        }
      } else {
        // [LEGACY] Fallback
        const newItems = [...(legacyContent?.items || [])];
        newItems[index] = { ...newItems[index], [field]: nestedValue };
        handleUpdate('items', newItems);
      }
      debounceTimersRef.current.delete(timerKey);
    }, DEBOUNCE_DELAY);

    debounceTimersRef.current.set(timerKey, timer);
  }, [servicesList, useNewApi, updateServiceApi, legacyContent?.items, handleUpdate]);

  // --- Renderers ---

  // Show loading state while services are being fetched
  if (servicesLoading && (!services || services.length === 0)) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <span className="ml-3 text-muted-foreground">Loading services...</span>
      </div>
    );
  }

  // 1. Services List View (Cards on mobile, Table on desktop)
  const renderServicesList = () => (
    <div className={sectionClass}>
      <div className="p-3 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="min-w-0">
            <h3 className="text-base sm:text-lg font-bold text-foreground truncate">
              Existing Services
            </h3>
            <p className="text-xs text-muted-foreground">
              Manage your individual service offerings
              {/* [DEBUG] Show which mode is active */}
              {/* <span className="ml-2 text-xs px-2 py-0.5 rounded bg-primary/10 text-primary">
                {useNewApi ? '🔗 API Mode' : '📁 Legacy Mode'}
              </span> */}
            </p>
          </div>
        </div>
        <button
          onClick={addNewService}
          disabled={isSaving || servicesLoading}
          className="flex items-center whitespace-nowrap justify-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all font-medium text-sm w-full sm:w-auto disabled:opacity-50"
        >
          {isSaving ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Plus className="w-4 h-4" />
          )}
          Add New Service
        </button>
      </div>

      {/* Services List */}
      <div className="divide-y divide-border">
        {servicesList.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">
            <Wrench className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No services found. Click "Add New Service" to create one.</p>
          </div>
        ) : (
          servicesList.map((service: any, index: number) => (
            <div
              key={getServiceId(service) || index}
              className="p-3 sm:p-4 flex items-center gap-3 hover:bg-muted/50 transition-colors"
            >
              {/* Service Image */}
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                {service.image ? (
                  <img
                    src={service.image}
                    alt={service.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Wrench className="w-6 h-6 text-muted-foreground" />
                  </div>
                )}
              </div>

              {/* Service Info */}
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-foreground truncate">
                  {service.title}
                </h4>
                <p className="text-sm text-muted-foreground line-clamp-1">
                  {service.description}
                </p>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-sm font-bold text-primary">
                    ₹{service.price?.toLocaleString()}
                  </span>
                  {service.originalPrice > service.price && (
                    <span className="text-xs text-muted-foreground line-through">
                      ₹{service.originalPrice?.toLocaleString()}
                    </span>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setEditingIndex(index)}
                  className="p-2 rounded-lg hover:bg-primary/10 text-primary transition-colors"
                  title="Edit Service"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => deleteService(index)}
                  disabled={isSaving}
                  className="p-2 rounded-lg hover:bg-destructive/10 text-destructive transition-colors disabled:opacity-50"
                  title="Delete Service"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );

  // 2. Service Editor View
  const renderServiceEditor = (index: number) => {
    // [FIX] Use localService for responsive UI, fallback to servicesList
    const service = localService || servicesList[index];
    if (!service) {
      setEditingIndex(null);
      return null;
    }

    return (
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center gap-3 pb-3 border-b border-border">
          <button
            onClick={() => setEditingIndex(null)}
            className="p-2 rounded-lg hover:bg-muted transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-foreground">
              Edit: {service.title}
            </h3>
            {/* <p className="text-xs text-muted-foreground">
              ID: {getServiceId(service)}
              <span className="ml-2 text-xs px-2 py-0.5 rounded bg-primary/10 text-primary">
                {useNewApi ? '🔗 API Mode' : '📁 Legacy Mode'}
              </span>
            </p> */}
          </div>
        </div>

        {/* Editor Form */}
        <div className={sectionClass}>
          <div className="p-4 space-y-6">
            {/* --- BASIC INFO --- */}
            <div className="space-y-4">
              <h4 className={subSectionTitleClass}>
                <Wrench className="w-4 h-4 text-primary" />
                Basic Information
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Service Title</label>
                  <input
                    type="text"
                    value={service.title || ''}
                    onChange={(e) => updateServiceField(index, 'title', e.target.value)}
                    className={inputClass}
                    placeholder="e.g., Periodic Service"
                  />
                </div>
                <div>
                  <label className={labelClass}>Category</label>
                  <input
                    type="text"
                    value={service.category || ''}
                    onChange={(e) => updateServiceField(index, 'category', e.target.value)}
                    className={inputClass}
                    placeholder="e.g., maintenance"
                  />
                </div>
              </div>

              <div>
                <label className={labelClass}>Description</label>
                <textarea
                  value={service.description || ''}
                  onChange={(e) => updateServiceField(index, 'description', e.target.value)}
                  rows={3}
                  className={inputClass}
                  placeholder="Describe this service..."
                />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div>
                  <label className={labelClass}>Price (₹)</label>
                  <input
                    type="number"
                    value={service.price || 0}
                    onChange={(e) => updateServiceField(index, 'price', Number(e.target.value))}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>MRP(₹)</label>
                  <input
                    type="number"
                    value={service.originalPrice || 0}
                    onChange={(e) => updateServiceField(index, 'originalPrice', Number(e.target.value))}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Duration</label>
                  <input
                    type="text"
                    value={service.duration || ''}
                    onChange={(e) => updateServiceField(index, 'duration', e.target.value)}
                    className={inputClass}
                    placeholder="e.g., 2-3 hours"
                  />
                </div>
                <div>
                  <label className={labelClass}>Warranty</label>
                  <input
                    type="text"
                    value={service.warranty || ''}
                    onChange={(e) => updateServiceField(index, 'warranty', e.target.value)}
                    className={inputClass}
                    placeholder="e.g., 6 months"
                  />
                </div>
              </div>

              {/* Main Image */}
              <div>
                <label className={labelClass}>Main Image</label>
                <ImageUpload
                  value={service.image || ''}
                  onChange={(url) => updateServiceField(index, 'image', url)}
                  label="Service Image"
                  placeholder="Upload image or enter URL"
                  previewHeight="h-48"
                />
              </div>
            </div>

            <hr className="border-border" />

            {/* --- FEATURES --- */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label className={subSectionTitleClass}>
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                  Features
                </label>
                <button
                  onClick={() => {
                    const newFeatures = ['', ...(service.features || [])];
                    updateServiceNestedField(index, 'features', newFeatures);
                  }}
                  className="text-green-500 text-xs font-bold uppercase hover:underline"
                >
                  + Add Feature
                </button>
              </div>
              <div className="space-y-2">
                {service.features?.map((feature: string, i: number) => (
                  <div key={i} className="flex gap-2 items-center">
                    <input
                      value={feature}
                      onChange={(e) => {
                        const newFeatures = [...(service.features || [])];
                        newFeatures[i] = e.target.value;
                        updateServiceNestedField(index, 'features', newFeatures);
                      }}
                      className={inputClass}
                      placeholder="Feature description"
                    />
                    <button
                      onClick={() => {
                        const newFeatures = (service.features || []).filter((_: any, idx: number) => idx !== i);
                        updateServiceNestedField(index, 'features', newFeatures);
                      }}
                      className="text-destructive hover:bg-destructive/10 p-2 rounded"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <hr className="border-border" />

            {/* --- INCLUDES --- */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label className={subSectionTitleClass}>
                  <Layers className="w-4 h-4 text-blue-500" />
                  What's Included
                </label>
                <button
                  onClick={() => {
                    const newIncludes = ['', ...(service.includes || [])];
                    updateServiceNestedField(index, 'includes', newIncludes);
                  }}
                  className="text-blue-500 text-xs font-bold uppercase hover:underline"
                >
                  + Add Item
                </button>
              </div>
              <div className="space-y-2">
                {service.includes?.map((item: string, i: number) => (
                  <div key={i} className="flex gap-2 items-center">
                    <input
                      value={item}
                      onChange={(e) => {
                        const newIncludes = [...(service.includes || [])];
                        newIncludes[i] = e.target.value;
                        updateServiceNestedField(index, 'includes', newIncludes);
                      }}
                      className={inputClass}
                      placeholder="Included item"
                    />
                    <button
                      onClick={() => {
                        const newIncludes = (service.includes || []).filter((_: any, idx: number) => idx !== i);
                        updateServiceNestedField(index, 'includes', newIncludes);
                      }}
                      className="text-destructive hover:bg-destructive/10 p-2 rounded"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <hr className="border-border" />

            {/* --- PROCESS STEPS --- */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label className={subSectionTitleClass}>
                  <Workflow className="w-4 h-4 text-orange-500" />
                  Process Steps
                </label>
                <button
                  onClick={() => {
                    const newProcess = [{ title: '', description: '' }, ...(service.process || [])];
                    updateServiceNestedField(index, 'process', newProcess);
                  }}
                  className="text-orange-500 text-xs font-bold uppercase hover:underline"
                >
                  + Add Step
                </button>
              </div>
              <div className="space-y-3">
                {service.process?.map((step: any, i: number) => (
                  <div key={i} className="flex gap-2 sm:gap-3 items-start">
                    <div className="w-6 h-6 rounded-full bg-orange-500/20 text-orange-500 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-2">
                      {i + 1}
                    </div>
                    <div className="flex-1 space-y-2">
                      <input
                        placeholder="Step title"
                        value={step.title}
                        onChange={(e) => {
                          const newProcess = [...(service.process || [])];
                          newProcess[i] = { ...newProcess[i], title: e.target.value };
                          updateServiceNestedField(index, 'process', newProcess);
                        }}
                        className={inputClass}
                      />
                      <textarea
                        placeholder="Step description"
                        rows={2}
                        value={step.description}
                        onChange={(e) => {
                          const newProcess = [...(service.process || [])];
                          newProcess[i] = { ...newProcess[i], description: e.target.value };
                          updateServiceNestedField(index, 'process', newProcess);
                        }}
                        className={inputClass}
                      />
                    </div>
                    <button
                      onClick={() => {
                        const newProcess = (service.process || []).filter((_: any, idx: number) => idx !== i);
                        updateServiceNestedField(index, 'process', newProcess);
                      }}
                      className="mt-2 text-destructive hover:bg-destructive/10 p-2 rounded flex-shrink-0"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <hr className="border-border" />

            {/* --- FAQS --- */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label className={subSectionTitleClass}>
                  <HelpCircle className="w-4 h-4 text-purple-500" />
                  Service FAQs
                </label>
                <button
                  onClick={() => {
                    const newFaqs = [{ question: '', answer: '' }, ...(service.faqs || [])];
                    updateServiceNestedField(index, 'faqs', newFaqs);
                  }}
                  className="text-purple-500 text-xs font-bold uppercase hover:underline"
                >
                  + Add FAQ
                </button>
              </div>
              <div className="space-y-3">
                {service.faqs?.map((faq: any, i: number) => (
                  <div key={i} className="flex gap-2 sm:gap-3 items-start">
                    <div className="flex-1 space-y-2">
                      <input
                        placeholder="Question"
                        value={faq.question}
                        onChange={(e) => {
                          const newFaqs = [...(service.faqs || [])];
                          newFaqs[i] = { ...newFaqs[i], question: e.target.value };
                          updateServiceNestedField(index, 'faqs', newFaqs);
                        }}
                        className={inputClass}
                      />
                      <textarea
                        placeholder="Answer"
                        value={faq.answer}
                        onChange={(e) => {
                          const newFaqs = [...(service.faqs || [])];
                          newFaqs[i] = { ...newFaqs[i], answer: e.target.value };
                          updateServiceNestedField(index, 'faqs', newFaqs);
                        }}
                        rows={2}
                        className={inputClass}
                      />
                    </div>
                    <button
                      onClick={() => {
                        const newFaqs = (service.faqs || []).filter((_: any, idx: number) => idx !== i);
                        updateServiceNestedField(index, 'faqs', newFaqs);
                      }}
                      className="mt-2 text-destructive hover:bg-destructive/10 p-2 rounded flex-shrink-0"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <hr className="border-border" />

            {/* --- GALLERY --- */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label className={subSectionTitleClass}>
                  <Layers className="w-4 h-4 text-cyan-500" />
                  Detail Page Gallery
                </label>
                <button
                  onClick={() => {
                    const newGallery = ['', ...(service.gallery || [])];
                    updateServiceNestedField(index, 'gallery', newGallery);
                  }}
                  className="text-cyan-500 text-xs font-bold uppercase hover:underline"
                >
                  + Add Image
                </button>
              </div>
              <div className="space-y-4">
                {service.gallery?.map((img: string, i: number) => (
                  <div key={i} className="relative">
                    <ImageUpload
                      value={img}
                      onChange={(url) => {
                        const newGallery = [...(service.gallery || [])];
                        newGallery[i] = url;
                        updateServiceNestedField(index, 'gallery', newGallery);
                      }}
                      label={`Gallery Image ${i + 1}`}
                      placeholder="Upload image or enter URL"
                      previewHeight="h-40"
                      maxSizeMB={2}
                      maxWidthOrHeight={1920}
                      helperText="Additional image for service detail page"
                      showAltInput={false}
                      compact={false}
                    />
                    <button
                      onClick={() => {
                        const newGallery = (service.gallery || []).filter((_: any, idx: number) => idx !== i);
                        updateServiceNestedField(index, 'gallery', newGallery);
                      }}
                      className="absolute top-0 right-0 text-destructive hover:bg-destructive/10 p-2 rounded"
                      title="Remove image"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                {(!service.gallery || service.gallery.length === 0) && (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No gallery images added yet. Click "+ Add Image" to add images.
                  </p>
                )}
              </div>
            </div>

          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4 sm:space-y-6 w-full">
      <AnimatePresence mode="wait">
        <motion.div
          key={editingIndex !== null ? 'edit' : 'list'}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {editingIndex !== null ? renderServiceEditor(editingIndex) : renderServicesList()}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default ServiceDetailEditor;