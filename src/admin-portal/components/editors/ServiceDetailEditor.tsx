import React, { useState, useEffect, useCallback, useRef } from 'react';
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
  AlertTriangle,
  X,
} from 'lucide-react';
import { useServicesContent } from '../../hooks/useContentHooks';
import { useContent } from '../../context/ContentContext';
import { ImageUpload } from '../shared/ImageUpload';

interface ServiceDetailEditorProps {
  isDarkMode: boolean;
  onEditingIndexChange?: (index: number | null) => void;
  onLocalServiceChange?: (service: any | null) => void; // ✅ Callback to pass localService to parent for preview
  showNotification?: (type: 'success' | 'error', message: string) => void;
}

// Delete confirmation state interface
interface DeleteConfirmation {
  isOpen: boolean;
  serviceIndex: number | null;
  serviceTitle: string;
}

export const ServiceDetailEditor: React.FC<ServiceDetailEditorProps> = ({ 
  onEditingIndexChange,
  onLocalServiceChange, // ✅ Receive callback from parent
  showNotification 
}) => {
  // ✅ DEBUG: Log on mount to verify props are received
  useEffect(() => {
    console.log('🟣 ServiceDetailEditor MOUNTED');
    console.log('🟣 onLocalServiceChange prop received:', typeof onLocalServiceChange);
    console.log('🟣 onEditingIndexChange prop received:', typeof onEditingIndexChange);
  }, []);

  const { updateField } = useContent();
  
  // Get services from separate collection + loading functions
  const {
    services,
    servicesLoading,
    loadServices,
    createService,
    updateService: updateServiceApi,
    deleteService: deleteServiceApi,
  } = useContent();

  // Fallback to content.services if new API not available
  const legacyContent = useServicesContent();
  
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // ==================== DEBOUNCE SETUP ====================
  // This editor saves DIRECTLY to live website, so we need our own debounce
  const DEBOUNCE_DELAY = 5000; // 2 seconds
  const debounceTimersRef = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());

  // ✅ LOCAL STATE for the service being edited - allows immediate UI updates for preview
  const [localService, setLocalService] = useState<any>(null);
  
  // Delete confirmation modal state
  const [deleteConfirmation, setDeleteConfirmation] = useState<DeleteConfirmation>({
    isOpen: false,
    serviceIndex: null,
    serviceTitle: '',
  });

  // Determine which data source to use
  const useNewApi = services && services.length > 0;
  const servicesList = useNewApi ? services : (legacyContent?.items || []);

  // Helper to get service ID (works for both new API and legacy)
  const getServiceId = (service: any): string | undefined => {
    return service?._id || service?.id;
  };

  // Load services if not loaded yet
  useEffect(() => {
    if (!services || services.length === 0) {
      loadServices?.();
    }
  }, []);

  // ✅ Sync local service state ONLY when editingIndex changes
  // IMPORTANT: Removed servicesList from dependencies to prevent overwriting local edits
  useEffect(() => {
    if (editingIndex !== null && servicesList[editingIndex]) {
      setLocalService({ ...servicesList[editingIndex] });
    } else {
      setLocalService(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editingIndex]); // Only sync when editingIndex changes, NOT when servicesList updates

  // ✅ FIXED: Notify parent whenever localService changes (for live preview)
  useEffect(() => {
    console.log('🟡 onLocalServiceChange useEffect triggered');
    console.log('🟡 localService:', localService?.title, 'price:', localService?.price);
    console.log('🟡 typeof onLocalServiceChange:', typeof onLocalServiceChange);
    
    if (typeof onLocalServiceChange === 'function') {
      console.log('🟡 ✅ CALLING onLocalServiceChange with localService...');
      onLocalServiceChange(localService);
      console.log('🟡 ✅ onLocalServiceChange CALLED successfully!');
    } else {
      console.log('🔴 ❌ ERROR: onLocalServiceChange is NOT a function!');
      console.log('🔴 ❌ Actual value:', onLocalServiceChange);
    }
  }, [localService, onLocalServiceChange]);

  // ✅ Cleanup timers on unmount
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

  // Handle update for backward compatibility (legacy)
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
    // Generate unique title with timestamp + random suffix to avoid duplicate conflicts
    const randomSuffix = Math.random().toString(36).substring(2, 6).toUpperCase();
    const uniqueTitle = `New Service ${randomSuffix}`;
    
    // Complete service data matching backend validation requirements
    const newServiceData = {
      title: uniqueTitle,
      description: 'Service description goes here. Add more details about what this service includes and its benefits.',
      price: 999,
      originalPrice: 1499,
      image: '/images/placeholder-service.jpg',
      gallery: [],
      features: ['Feature 1'],
      includes: ['Standard Inspection'],
      process: [{ title: 'Step 1', description: 'Description of this step' }],
      faqs: [{ question: 'Common question?', answer: 'Answer to the question.' }],
      duration: '1-2 hours',
      warranty: '3 months',
      category: 'general',
    };

    if (useNewApi && createService) {
      setIsSaving(true);
      try {
        await createService(newServiceData);
        setEditingIndex(0);
        showNotification?.('success', 'Service created successfully');
      } catch (error: any) {
        console.error('Failed to create service:', error);
        const errorMsg = error?.response?.data?.message || error?.message || 'Failed to create service';
        showNotification?.('error', errorMsg);
      } finally {
        setIsSaving(false);
      }
    } else {
      const newService = {
        id: `service-${Date.now()}`,
        ...newServiceData,
      };
      const newItems = [newService, ...(legacyContent?.items || [])];
      handleUpdate('items', newItems);
      setEditingIndex(0);
      showNotification?.('success', 'Service added');
    }
  };

  // Open delete confirmation modal
  const openDeleteConfirmation = (index: number) => {
    const service = servicesList[index];
    setDeleteConfirmation({
      isOpen: true,
      serviceIndex: index,
      serviceTitle: service?.title || 'this service',
    });
  };

  // Close delete confirmation modal
  const closeDeleteConfirmation = () => {
    setDeleteConfirmation({
      isOpen: false,
      serviceIndex: null,
      serviceTitle: '',
    });
  };

  // Confirm and execute delete (IMMEDIATE - no debounce needed)
  const confirmDelete = async () => {
    const index = deleteConfirmation.serviceIndex;
    if (index === null) return;

    const service = servicesList[index];
    const serviceId = getServiceId(service);

    closeDeleteConfirmation();

    if (useNewApi && deleteServiceApi && serviceId) {
      setIsSaving(true);
      try {
        await deleteServiceApi(serviceId);
        if (editingIndex === index) setEditingIndex(null);
        showNotification?.('success', 'Service deleted successfully');
      } catch (error: any) {
        console.error('Failed to delete service:', error);
        showNotification?.('error', error?.message || 'Failed to delete service');
      } finally {
        setIsSaving(false);
      }
    } else {
      const newItems = legacyContent?.items?.filter((_: unknown, i: number) => i !== index);
      handleUpdate('items', newItems);
      if (editingIndex === index) setEditingIndex(null);
      showNotification?.('success', 'Service deleted');
    }
  };

  // ✅ DEBOUNCED - Update service field with local state for preview + debounced API call
  const updateServiceField = useCallback((index: number, field: string, value: unknown) => {
    console.log('🔵 updateServiceField called:', { field, value });

    const service = servicesList[index];
    const serviceId = getServiceId(service);

    // 1. Update local state IMMEDIATELY for responsive preview
    setLocalService((prev: any) => {
      const updated = prev ? { ...prev, [field]: value } : null;
      console.log('🟢 localService updated:', updated?.title, 'price:', updated?.price);
      return updated;
    });

    // 2. DEBOUNCE the API call to live website
    const timerKey = `service-${serviceId}-${field}`;
    const existingTimer = debounceTimersRef.current.get(timerKey);
    if (existingTimer) clearTimeout(existingTimer);

    const timer = setTimeout(async () => {
      if (useNewApi && updateServiceApi && serviceId) {
        try {
          await updateServiceApi(serviceId, { [field]: value });
        } catch (error) {
          console.error('[updateServiceField] API Error:', error);
          showNotification?.('error', 'Failed to save changes');
        }
      } else {
        // Legacy fallback
        const newItems = [...(legacyContent?.items || [])];
        newItems[index] = { ...newItems[index], [field]: value };
        handleUpdate('items', newItems);
      }
      debounceTimersRef.current.delete(timerKey);
    }, DEBOUNCE_DELAY);

    debounceTimersRef.current.set(timerKey, timer);
  }, [servicesList, useNewApi, updateServiceApi, legacyContent?.items, showNotification]);

  // ⚡ IMMEDIATE - Update service field (for images, dropdowns - no debounce)
  const updateServiceFieldImmediate = useCallback(async (index: number, field: string, value: unknown) => {
    const service = servicesList[index];
    const serviceId = getServiceId(service);

    // 1. Update local state immediately for preview
    setLocalService((prev: any) => prev ? { ...prev, [field]: value } : null);

    // 2. Update API immediately (no debounce for images/critical fields)
    if (useNewApi && updateServiceApi && serviceId) {
      try {
        await updateServiceApi(serviceId, { [field]: value });
      } catch (error) {
        console.error('[updateServiceFieldImmediate] API Error:', error);
        showNotification?.('error', 'Failed to save changes');
      }
    } else {
      const newItems = [...(legacyContent?.items || [])];
      newItems[index] = { ...newItems[index], [field]: value };
      handleUpdate('items', newItems);
    }
  }, [servicesList, useNewApi, updateServiceApi, legacyContent?.items, showNotification]);

  // Delete Confirmation Modal Component
  const DeleteConfirmationModal = () => {
    if (!deleteConfirmation.isOpen) return null;

    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={closeDeleteConfirmation}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', duration: 0.3 }}
            className="bg-card border border-border rounded-2xl shadow-2xl max-w-md w-full p-6"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-start gap-4 mb-4">
              <div className="p-3 rounded-full bg-destructive/10">
                <AlertTriangle className="w-6 h-6 text-destructive" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-foreground">Delete Service</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Are you sure you want to delete <span className="font-semibold text-foreground">"{deleteConfirmation.serviceTitle}"</span>? This action cannot be undone.
                </p>
              </div>
              <button
                onClick={closeDeleteConfirmation}
                className="p-2 rounded-lg hover:bg-muted transition-colors"
              >
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>

            {/* Actions */}
            <div className="flex gap-3 mt-6">
              <button
                onClick={closeDeleteConfirmation}
                className="flex-1 px-4 py-2.5 rounded-xl border border-border text-foreground font-medium hover:bg-muted transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={isSaving}
                className="flex-1 px-4 py-2.5 rounded-xl bg-destructive text-destructive-foreground font-medium hover:bg-destructive/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isSaving ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Trash2 className="w-4 h-4" />
                )}
                Delete
              </button>
            </div>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    );
  };

  // Show loading state
  if (servicesLoading && (!services || services.length === 0)) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <span className="ml-3 text-muted-foreground">Loading services...</span>
      </div>
    );
  }

  // 1. Services List View
  const renderServicesList = () => (
    <div className="space-y-0">
      {/* Sticky Header - outside the overflow container */}
      <div className="sticky top-0 z-20 p-3 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border border-border bg-card rounded-xl shadow-sm mb-4">
        <div className="flex items-center gap-3">
          <div className="min-w-0">
            <h3 className="text-base sm:text-lg font-bold text-foreground truncate">
              Existing Services
            </h3>
            <p className="text-xs text-muted-foreground">
              Manage your individual service offerings
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

      {/* Content */}
      <div className={sectionClass}>
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

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setEditingIndex(index)}
                  className="p-2 rounded-lg hover:bg-primary/10 text-primary transition-colors"
                  title="Edit Service"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => openDeleteConfirmation(index)}
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
    </div>
  );

  // 2. Service Editor View
  const renderServiceEditor = (index: number) => {
    // Use localService for preview (immediate updates), fallback to servicesList
    const service = localService || servicesList[index];
    if (!service) {
      setEditingIndex(null);
      return null;
    }

    return (
      <div className="space-y-4">
        {/* Sticky Header */}
        <div className="sticky top-0 z-20 flex items-center gap-3 py-3 px-4 border border-border rounded-xl bg-card shadow-sm">
          <button
            onClick={() => setEditingIndex(null)}
            className="p-2 rounded-lg hover:bg-muted transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-bold text-foreground truncate">
              Edit: {service.title}
            </h3>
            <p className="text-xs text-muted-foreground">
              Changes auto-save after 2 seconds
            </p>
          </div>
        </div>

        <div className={sectionClass}>
          <div className="p-4 space-y-6">
            {/* BASIC INFO */}
            <div className="space-y-4">
              <h4 className={subSectionTitleClass}>
                <Wrench className="w-4 h-4 text-primary" />
                Basic Information
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* 🎯 DEBOUNCED - Service Title */}
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
                {/* 🎯 DEBOUNCED - Category */}
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

              {/* 🎯 DEBOUNCED - Description */}
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
                {/* 🎯 DEBOUNCED - Price */}
                <div>
                  <label className={labelClass}>Price (₹)</label>
                  <input
                    type="number"
                    value={service.price || 0}
                    onChange={(e) => updateServiceField(index, 'price', Number(e.target.value))}
                    className={inputClass}
                  />
                </div>
                {/* 🎯 DEBOUNCED - Original Price */}
                <div>
                  <label className={labelClass}>MRP(₹)</label>
                  <input
                    type="number"
                    value={service.originalPrice || 0}
                    onChange={(e) => updateServiceField(index, 'originalPrice', Number(e.target.value))}
                    className={inputClass}
                  />
                </div>
                {/* 🎯 DEBOUNCED - Duration */}
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
                {/* 🎯 DEBOUNCED - Warranty */}
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

              {/* ⚡ IMMEDIATE - Main Image */}
              <div>
                <label className={labelClass}>Main Image</label>
                <ImageUpload
                  value={service.image || ''}
                  onChange={(url) => updateServiceFieldImmediate(index, 'image', url)}
                  label="Service Image"
                  placeholder="Upload image or enter URL"
                  previewHeight="h-48"
                />
              </div>
            </div>

            <hr className="border-border" />

            {/* FEATURES */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label className={subSectionTitleClass}>
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                  Features
                </label>
                {/* ⚡ IMMEDIATE - Add Feature button */}
                <button
                  onClick={() => {
                    const newFeatures = ['', ...(service.features || [])];
                    updateServiceFieldImmediate(index, 'features', newFeatures);
                  }}
                  className="text-green-500 text-xs font-bold uppercase hover:underline"
                >
                  + Add Feature
                </button>
              </div>
              <div className="space-y-2">
                {service.features?.map((feature: string, i: number) => (
                  <div key={i} className="flex gap-2 items-center">
                    {/* 🎯 DEBOUNCED - Feature text */}
                    <input
                      value={feature}
                      onChange={(e) => {
                        const newFeatures = [...(service.features || [])];
                        newFeatures[i] = e.target.value;
                        updateServiceField(index, 'features', newFeatures);
                      }}
                      className={inputClass}
                      placeholder="Feature description"
                    />
                    {/* ⚡ IMMEDIATE - Delete button */}
                    <button
                      onClick={() => {
                        const newFeatures = (service.features || []).filter((_: any, idx: number) => idx !== i);
                        updateServiceFieldImmediate(index, 'features', newFeatures);
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

            {/* INCLUDES */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label className={subSectionTitleClass}>
                  <Layers className="w-4 h-4 text-blue-500" />
                  What's Included
                </label>
                {/* ⚡ IMMEDIATE - Add Item button */}
                <button
                  onClick={() => {
                    const newIncludes = ['', ...(service.includes || [])];
                    updateServiceFieldImmediate(index, 'includes', newIncludes);
                  }}
                  className="text-blue-500 text-xs font-bold uppercase hover:underline"
                >
                  + Add Item
                </button>
              </div>
              <div className="space-y-2">
                {service.includes?.map((item: string, i: number) => (
                  <div key={i} className="flex gap-2 items-center">
                    {/* 🎯 DEBOUNCED - Include text */}
                    <input
                      value={item}
                      onChange={(e) => {
                        const newIncludes = [...(service.includes || [])];
                        newIncludes[i] = e.target.value;
                        updateServiceField(index, 'includes', newIncludes);
                      }}
                      className={inputClass}
                      placeholder="Included item"
                    />
                    {/* ⚡ IMMEDIATE - Delete button */}
                    <button
                      onClick={() => {
                        const newIncludes = (service.includes || []).filter((_: any, idx: number) => idx !== i);
                        updateServiceFieldImmediate(index, 'includes', newIncludes);
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

            {/* PROCESS STEPS */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label className={subSectionTitleClass}>
                  <Workflow className="w-4 h-4 text-orange-500" />
                  Process Steps
                </label>
                {/* ⚡ IMMEDIATE - Add Step button */}
                <button
                  onClick={() => {
                    const newProcess = [{ title: '', description: '' }, ...(service.process || [])];
                    updateServiceFieldImmediate(index, 'process', newProcess);
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
                      {/* 🎯 DEBOUNCED - Step title */}
                      <input
                        placeholder="Step title"
                        value={step.title}
                        onChange={(e) => {
                          const newProcess = [...(service.process || [])];
                          newProcess[i] = { ...newProcess[i], title: e.target.value };
                          updateServiceField(index, 'process', newProcess);
                        }}
                        className={inputClass}
                      />
                      {/* 🎯 DEBOUNCED - Step description */}
                      <textarea
                        placeholder="Step description"
                        rows={2}
                        value={step.description}
                        onChange={(e) => {
                          const newProcess = [...(service.process || [])];
                          newProcess[i] = { ...newProcess[i], description: e.target.value };
                          updateServiceField(index, 'process', newProcess);
                        }}
                        className={inputClass}
                      />
                    </div>
                    {/* ⚡ IMMEDIATE - Delete button */}
                    <button
                      onClick={() => {
                        const newProcess = (service.process || []).filter((_: any, idx: number) => idx !== i);
                        updateServiceFieldImmediate(index, 'process', newProcess);
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

            {/* FAQS */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label className={subSectionTitleClass}>
                  <HelpCircle className="w-4 h-4 text-purple-500" />
                  Service FAQs
                </label>
                {/* ⚡ IMMEDIATE - Add FAQ button */}
                <button
                  onClick={() => {
                    const newFaqs = [{ question: '', answer: '' }, ...(service.faqs || [])];
                    updateServiceFieldImmediate(index, 'faqs', newFaqs);
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
                      {/* 🎯 DEBOUNCED - FAQ question */}
                      <input
                        placeholder="Question"
                        value={faq.question}
                        onChange={(e) => {
                          const newFaqs = [...(service.faqs || [])];
                          newFaqs[i] = { ...newFaqs[i], question: e.target.value };
                          updateServiceField(index, 'faqs', newFaqs);
                        }}
                        className={inputClass}
                      />
                      {/* 🎯 DEBOUNCED - FAQ answer */}
                      <textarea
                        placeholder="Answer"
                        value={faq.answer}
                        onChange={(e) => {
                          const newFaqs = [...(service.faqs || [])];
                          newFaqs[i] = { ...newFaqs[i], answer: e.target.value };
                          updateServiceField(index, 'faqs', newFaqs);
                        }}
                        rows={2}
                        className={inputClass}
                      />
                    </div>
                    {/* ⚡ IMMEDIATE - Delete button */}
                    <button
                      onClick={() => {
                        const newFaqs = (service.faqs || []).filter((_: any, idx: number) => idx !== i);
                        updateServiceFieldImmediate(index, 'faqs', newFaqs);
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

            {/* GALLERY */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label className={subSectionTitleClass}>
                  <Layers className="w-4 h-4 text-cyan-500" />
                  Detail Page Gallery
                </label>
                {/* ⚡ IMMEDIATE - Add Image button */}
                <button
                  onClick={() => {
                    const newGallery = ['', ...(service.gallery || [])];
                    updateServiceFieldImmediate(index, 'gallery', newGallery);
                  }}
                  className="text-cyan-500 text-xs font-bold uppercase hover:underline"
                >
                  + Add Image
                </button>
              </div>
              <div className="space-y-4">
                {service.gallery?.map((img: string, i: number) => (
                  <div key={i} className="relative">
                    {/* ⚡ IMMEDIATE - Gallery image upload */}
                    <ImageUpload
                      value={img}
                      onChange={(url) => {
                        const newGallery = [...(service.gallery || [])];
                        newGallery[i] = url;
                        updateServiceFieldImmediate(index, 'gallery', newGallery);
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
                    {/* ⚡ IMMEDIATE - Delete image button */}
                    <button
                      onClick={() => {
                        const newGallery = (service.gallery || []).filter((_: any, idx: number) => idx !== i);
                        updateServiceFieldImmediate(index, 'gallery', newGallery);
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
      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal />

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