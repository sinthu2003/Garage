import React, { useState, useEffect } from 'react';
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
  Wrench
} from 'lucide-react';
import { useServicesContent } from '../../hooks/useContentHooks';
import { useContent } from '../../context/ContentContext';
import { ImageUpload } from '../shared/ImageUpload';

interface ServiceDetailEditorProps {
  isDarkMode: boolean;
  onEditingIndexChange?: (index: number | null) => void; // Callback to notify parent of editing state
}

export const ServiceDetailEditor: React.FC<ServiceDetailEditorProps> = ({ onEditingIndexChange }) => {
  const { updateField } = useContent();
  const content = useServicesContent();
  
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  // Notify parent whenever editingIndex changes
  useEffect(() => {
    onEditingIndexChange?.(editingIndex);
  }, [editingIndex, onEditingIndexChange]);

  const handleUpdate = (path: string, value: unknown) => {
    updateField('services', path, value);
  };

  // Theme-aware styling helpers using CSS variables
  const inputClass = `w-full px-3 py-2.5 rounded-xl text-sm transition-all bg-background border-border text-foreground placeholder-muted-foreground focus:border-primary border focus:outline-none focus:ring-2 focus:ring-primary/20`;

  const labelClass = `block text-xs sm:text-sm font-medium text-muted-foreground mb-1`;

  const sectionClass = `rounded-xl border overflow-hidden border-border bg-card`;

  const subSectionTitleClass = `text-sm sm:text-md font-semibold mb-3 flex items-center gap-2 text-foreground`;

  // --- Actions ---
  const addNewService = () => {
    const newService = {
      id: `service-${Date.now()}`,
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
    // Add at the beginning of the array
    const newItems = [newService, ...(content.items || [])];
    handleUpdate('items', newItems);
    
    // Switch to edit mode for the new item (now at index 0)
    setEditingIndex(0);
  };

  const deleteService = (index: number) => {
    if (window.confirm('Are you sure you want to delete this service?')) {
      const newItems = content.items?.filter((_: unknown, i: number) => i !== index);
      handleUpdate('items', newItems);
      if (editingIndex === index) setEditingIndex(null);
    }
  };

  // --- Renderers ---

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
            </p>
          </div>
        </div>
        <button
          onClick={addNewService}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all font-medium text-sm w-full sm:w-auto"
        >
          <Plus className="w-4 h-4" />
          <span className="whitespace-nowrap">Add New Service</span>
        </button>
      </div>

      {/* Mobile Card View */}
      <div className="sm:hidden p-3 space-y-3">
        {content.items?.map((service: any, index: number) => (
          <div 
            key={service.id || index} 
            className="p-3 rounded-xl border border-border bg-secondary/30"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-medium text-muted-foreground">
                    #{String(index + 1).padStart(2, '0')}
                  </span>
                </div>
                <p className="font-medium text-foreground truncate">
                  {service.title || 'Untitled Service'}
                </p>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setEditingIndex(index)}
                  className="p-2 rounded-lg text-blue-500 hover:bg-blue-500/10"
                  title="Edit Service"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => deleteService(index)}
                  className="p-2 rounded-lg text-destructive hover:bg-destructive/10"
                  title="Delete Service"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
        {(!content.items || content.items.length === 0) && (
          <div className="text-center py-8 text-muted-foreground">
            <Wrench className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No services found.</p>
            <button onClick={addNewService} className="mt-2 text-primary text-sm font-medium">
              + Add your first service
            </button>
          </div>
        )}
      </div>

      {/* Desktop Table View - Price and Duration columns removed */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-secondary">
              <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground w-20">S.No</th>
              <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Service Name</th>
              <th className="px-4 sm:px-6 py-3 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody className="text-foreground">
            {content.items?.map((service: any, index: number) => (
              <tr key={service.id || index} className="border-b border-border hover:bg-secondary/30 transition-colors">
                <td className="px-4 sm:px-6 py-4 font-medium text-muted-foreground">
                  {String(index + 1).padStart(2, '0')}
                </td>
                <td className="px-4 sm:px-6 py-4 font-medium">
                  {service.title || 'Untitled Service'}
                </td>
                <td className="px-4 sm:px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => setEditingIndex(index)}
                      className="p-2 rounded-lg transition-colors hover:bg-blue-500/10 text-blue-500"
                      title="Edit"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => deleteService(index)}
                      className="p-2 rounded-lg transition-colors hover:bg-destructive/10 text-destructive"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {(!content.items || content.items.length === 0) && (
              <tr>
                <td colSpan={3} className="px-4 sm:px-6 py-8 text-center">
                  <Wrench className="w-8 h-8 mx-auto mb-2 opacity-50 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">No services found.</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

  // 2. Single Service Edit Form
  const renderServiceEditor = (index: number) => {
    const service = content.items?.[index];
    if (!service) return null;

    return (
      <div className={sectionClass}>
        <div className="p-3 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setEditingIndex(null)}
              className="p-2 rounded-lg hover:bg-secondary text-muted-foreground flex-shrink-0"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="min-w-0">
              <h3 className="text-base sm:text-lg font-bold text-foreground truncate">
                Edit: {service.title || 'Untitled Service'}
              </h3>
              <p className="text-xs text-muted-foreground">
                Modify service details, features, and FAQs
              </p>
            </div>
          </div>
        </div>

        <div className="p-3 sm:p-4 space-y-4 sm:space-y-6">
          {/* --- BASIC INFO --- */}
          <div className="space-y-4">
            {/* Title */}
            <div>
              <label className={labelClass}>Service Title</label>
              <input
                type="text"
                value={service.title || ''}
                onChange={(e) => {
                  const newItems = [...(content.items || [])];
                  newItems[index] = { ...newItems[index], title: e.target.value };
                  handleUpdate('items', newItems);
                }}
                placeholder="Full Body Denting & Painting"
                className={inputClass}
              />
            </div>

            {/* Main Image Upload */}
            <ImageUpload
              value={service.image || ''}
              onChange={(url) => {
                const newItems = [...(content.items || [])];
                newItems[index] = { ...newItems[index], image: url };
                handleUpdate('items', newItems);
              }}
              label="Main Service Image"
              placeholder="Upload image or enter URL"
              previewHeight="h-40"
              maxSizeMB={2}
              maxWidthOrHeight={1920}
              helperText="Primary image displayed on service card"
              showAltInput={false}
              compact={false}
            />

            {/* Description - Full width */}
            <div>
              <label className={labelClass}>Description</label>
              <textarea
                value={service.description || ''}
                onChange={(e) => {
                  const newItems = [...(content.items || [])];
                  newItems[index] = { ...newItems[index], description: e.target.value };
                  handleUpdate('items', newItems);
                }}
                rows={3}
                placeholder="Describe the service in detail..."
                className={inputClass}
              />
            </div>

            {/* Price & Original Price - Always 2 columns */}
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              <div>
                <label className={labelClass}>Price (₹)</label>
                <input
                  type="number"
                  value={service.price || ''}
                  onChange={(e) => {
                    const newItems = [...(content.items || [])];
                    newItems[index] = { ...newItems[index], price: Number(e.target.value) };
                    handleUpdate('items', newItems);
                  }}
                  placeholder="999"
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>MRP (₹)</label>
                <input
                  type="number"
                  value={service.originalPrice || ''}
                  onChange={(e) => {
                    const newItems = [...(content.items || [])];
                    newItems[index] = { ...newItems[index], originalPrice: Number(e.target.value) };
                    handleUpdate('items', newItems);
                  }}
                  placeholder="1499"
                  className={inputClass}
                />
              </div>
            </div>

            {/* Duration & Warranty - Always 2 columns */}
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              <div>
                <label className={labelClass}>Duration</label>
                <input
                  type="text"
                  value={service.duration || ''}
                  onChange={(e) => {
                    const newItems = [...(content.items || [])];
                    newItems[index] = { ...newItems[index], duration: e.target.value };
                    handleUpdate('items', newItems);
                  }}
                  placeholder="2-3 hours"
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Warranty</label>
                <input
                  type="text"
                  value={service.warranty || ''}
                  onChange={(e) => {
                    const newItems = [...(content.items || [])];
                    newItems[index] = { ...newItems[index], warranty: e.target.value };
                    handleUpdate('items', newItems);
                  }}
                  placeholder="6 months"
                  className={inputClass}
                />
              </div>
            </div>
          </div>

          <hr className="border-border" />

          {/* --- FEATURES --- */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <label className={subSectionTitleClass}>
                <CheckCircle2 className="w-4 h-4 text-green-500" />
                Service Features
              </label>
              <button
                onClick={() => {
                  const newItems = [...(content.items || [])];
                  newItems[index] = {
                    ...newItems[index],
                    features: ['', ...(newItems[index].features || [])]
                  };
                  handleUpdate('items', newItems);
                }}
                className="text-green-500 text-xs font-bold uppercase hover:underline"
              >
                + Add Feature
              </button>
            </div>
            <div className="space-y-2">
              {service.features?.map((feature: string, i: number) => (
                <div key={i} className="flex gap-2">
                  <input
                    value={feature}
                    onChange={(e) => {
                      const newItems = [...(content.items || [])];
                      const newFeatures = [...(newItems[index].features || [])];
                      newFeatures[i] = e.target.value;
                      newItems[index] = { ...newItems[index], features: newFeatures };
                      handleUpdate('items', newItems);
                    }}
                    className={`flex-1 ${inputClass}`}
                    placeholder="e.g. Premium oil change"
                  />
                  <button
                    onClick={() => {
                      const newItems = [...(content.items || [])];
                      const newFeatures = (newItems[index].features || []).filter((_: any, idx: number) => idx !== i);
                      newItems[index] = { ...newItems[index], features: newFeatures };
                      handleUpdate('items', newItems);
                    }}
                    className="text-destructive hover:bg-destructive/10 p-2 rounded flex-shrink-0"
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
                <CheckCircle2 className="w-4 h-4 text-blue-500" />
                What's Included
              </label>
              <button
                onClick={() => {
                  const newItems = [...(content.items || [])];
                  newItems[index] = {
                    ...newItems[index],
                    includes: ['', ...(newItems[index].includes || [])]
                  };
                  handleUpdate('items', newItems);
                }}
                className="text-blue-500 text-xs font-bold uppercase hover:underline"
              >
                + Add Item
              </button>
            </div>
            <div className="space-y-2">
              {service.includes?.map((item: string, i: number) => (
                <div key={i} className="flex gap-2">
                  <input
                    value={item}
                    onChange={(e) => {
                      const newItems = [...(content.items || [])];
                      const newIncludes = [...(newItems[index].includes || [])];
                      newIncludes[i] = e.target.value;
                      newItems[index] = { ...newItems[index], includes: newIncludes };
                      handleUpdate('items', newItems);
                    }}
                    className={`flex-1 ${inputClass}`}
                    placeholder="e.g. Free pickup & drop"
                  />
                  <button
                    onClick={() => {
                      const newItems = [...(content.items || [])];
                      const newIncludes = (newItems[index].includes || []).filter((_: any, idx: number) => idx !== i);
                      newItems[index] = { ...newItems[index], includes: newIncludes };
                      handleUpdate('items', newItems);
                    }}
                    className="text-destructive hover:bg-destructive/10 p-2 rounded flex-shrink-0"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <hr className="border-border" />

          {/* --- PROCESS --- */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <label className={subSectionTitleClass}>
                <Workflow className="w-4 h-4 text-orange-500" />
                Service Process
              </label>
              <button
                onClick={() => {
                  const newItems = [...(content.items || [])];
                  newItems[index] = {
                    ...newItems[index],
                    process: [{ title: '', description: '' }, ...(newItems[index].process || [])]
                  };
                  handleUpdate('items', newItems);
                }}
                className="text-orange-500 text-xs font-bold uppercase hover:underline"
              >
                + Add Step
              </button>
            </div>
            <div className="space-y-3">
              {service.process?.map((step: any, i: number) => (
                <div key={i} className="flex gap-2 sm:gap-3 items-start">
                  <div className="flex-1 space-y-2">
                    <input
                      placeholder="Step Title"
                      value={step.title}
                      onChange={(e) => {
                        const newItems = [...(content.items || [])];
                        const newProcess = [...(newItems[index].process || [])];
                        newProcess[i] = { ...newProcess[i], title: e.target.value };
                        newItems[index] = { ...newItems[index], process: newProcess };
                        handleUpdate('items', newItems);
                      }}
                      className={inputClass}
                    />
                    <input
                      placeholder="Step Description"
                      value={step.description}
                      onChange={(e) => {
                        const newItems = [...(content.items || [])];
                        const newProcess = [...(newItems[index].process || [])];
                        newProcess[i] = { ...newProcess[i], description: e.target.value };
                        newItems[index] = { ...newItems[index], process: newProcess };
                        handleUpdate('items', newItems);
                      }}
                      className={inputClass}
                    />
                  </div>
                  <button
                    onClick={() => {
                      const newItems = [...(content.items || [])];
                      const newProcess = (newItems[index].process || []).filter((_: any, idx: number) => idx !== i);
                      newItems[index] = { ...newItems[index], process: newProcess };
                      handleUpdate('items', newItems);
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
                  const newItems = [...(content.items || [])];
                  newItems[index] = {
                    ...newItems[index],
                    faqs: [{ question: '', answer: '' }, ...(newItems[index].faqs || [])]
                  };
                  handleUpdate('items', newItems);
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
                        const newItems = [...(content.items || [])];
                        const newFaqs = [...(newItems[index].faqs || [])];
                        newFaqs[i] = { ...newFaqs[i], question: e.target.value };
                        newItems[index] = { ...newItems[index], faqs: newFaqs };
                        handleUpdate('items', newItems);
                      }}
                      className={inputClass}
                    />
                    <textarea
                      placeholder="Answer"
                      value={faq.answer}
                      onChange={(e) => {
                        const newItems = [...(content.items || [])];
                        const newFaqs = [...(newItems[index].faqs || [])];
                        newFaqs[i] = { ...newFaqs[i], answer: e.target.value };
                        newItems[index] = { ...newItems[index], faqs: newFaqs };
                        handleUpdate('items', newItems);
                      }}
                      rows={2}
                      className={inputClass}
                    />
                  </div>
                  <button
                    onClick={() => {
                      const newItems = [...(content.items || [])];
                      const newFaqs = (newItems[index].faqs || []).filter((_: any, idx: number) => idx !== i);
                      newItems[index] = { ...newItems[index], faqs: newFaqs };
                      handleUpdate('items', newItems);
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
                  const newItems = [...(content.items || [])];
                  newItems[index] = {
                    ...newItems[index],
                    gallery: ['', ...(newItems[index].gallery || [])]
                  };
                  handleUpdate('items', newItems);
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
                      const newItems = [...(content.items || [])];
                      const newGallery = [...(newItems[index].gallery || [])];
                      newGallery[i] = url;
                      newItems[index] = { ...newItems[index], gallery: newGallery };
                      handleUpdate('items', newItems);
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
                      const newItems = [...(content.items || [])];
                      const newGallery = (newItems[index].gallery || []).filter((_: any, idx: number) => idx !== i);
                      newItems[index] = { ...newItems[index], gallery: newGallery };
                      handleUpdate('items', newItems);
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