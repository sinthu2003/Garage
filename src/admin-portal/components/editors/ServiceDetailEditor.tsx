import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  Trash2,
  List,
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

interface ServiceDetailEditorProps {
  isDarkMode: boolean;
}

export const ServiceDetailEditor: React.FC<ServiceDetailEditorProps> = ({ }) => {
  const { updateField } = useContent();
  const content = useServicesContent();
  
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const handleUpdate = (path: string, value: unknown) => {
    updateField('services', path, value);
  };

  // Theme-aware styling helpers using CSS variables
  const inputClass = `w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl text-sm transition-all bg-secondary border-border text-foreground placeholder-muted-foreground focus:border-primary border focus:outline-none focus:ring-2 focus:ring-primary/20`;

  const labelClass = `text-sm font-medium text-muted-foreground`;

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
    const newItems = [...(content.items || []), newService];
    handleUpdate('items', newItems);
    
    // Switch to edit mode for the new item immediately
    setEditingIndex(newItems.length - 1);
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
          <List className="w-5 h-5 text-green-500 flex-shrink-0" />
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
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg hover:shadow-lg hover:from-orange-600 hover:to-red-600 transition-all font-medium text-sm w-full sm:w-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Service</span>
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
                <div className="flex flex-wrap items-center gap-2 mt-1 text-xs text-muted-foreground">
                  <span>₹{service.price?.toLocaleString()}</span>
                  <span>•</span>
                  <span>{service.duration || '-'}</span>
                </div>
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

      {/* Desktop Table View */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-secondary">
              <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground w-20">S.No</th>
              <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Service Name</th>
              <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Price</th>
              <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Duration</th>
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
                <td className="px-4 sm:px-6 py-4">
                  ₹{service.price?.toLocaleString()}
                </td>
                <td className="px-4 sm:px-6 py-4">
                  {service.duration || '-'}
                </td>
                <td className="px-4 sm:px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => setEditingIndex(index)}
                      className="p-2 rounded-lg transition-colors hover:bg-blue-500/10 text-blue-500"
                      title="Edit Service"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => deleteService(index)}
                      className="p-2 rounded-lg transition-colors hover:bg-destructive/10 text-destructive"
                      title="Delete Service"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {(!content.items || content.items.length === 0) && (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-muted-foreground italic">
                  No services found. Click "Add New Service" to create one.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

  // 2. Single Service Editor View
  const renderServiceEditor = (index: number) => {
    const service = content.items[index];
    if (!service) return null;

    return (
      <div className="space-y-4 sm:space-y-6">
        {/* Editor Header with Back Button */}
        <div className="flex items-center gap-3 sm:gap-4">
          <button 
            onClick={() => setEditingIndex(null)}
            className="p-2 rounded-xl border transition-all border-border text-muted-foreground hover:bg-secondary flex-shrink-0"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="min-w-0">
            <h2 className="text-lg sm:text-xl font-bold text-foreground truncate">
              Editing: {service.title}
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Make changes to service details, pricing, and content
            </p>
          </div>
        </div>

        <div className={sectionClass}>
          <div className="p-4 sm:p-6 space-y-6 sm:space-y-8 bg-card">
            
            {/* --- BASIC INFO --- */}
            <div className="space-y-3 sm:space-y-4">
              <h4 className={subSectionTitleClass}>Basic Information</h4>
              
              <div className="space-y-2">
                <label className={labelClass}>Service Title</label>
                <input
                  type="text"
                  value={service.title || ''}
                  onChange={(e) => {
                    const newItems = [...(content.items || [])];
                    newItems[index] = { ...newItems[index], title: e.target.value };
                    handleUpdate('items', newItems);
                  }}
                  className={inputClass}
                />
              </div>

              <div className="space-y-2">
                <label className={labelClass}>Short Description (Landing Page)</label>
                <textarea
                  value={service.description || ''}
                  onChange={(e) => {
                    const newItems = [...(content.items || [])];
                    newItems[index] = { ...newItems[index], description: e.target.value };
                    handleUpdate('items', newItems);
                  }}
                  rows={2}
                  className={inputClass}
                />
              </div>

              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                <div className="space-y-2">
                  <label className={labelClass}>Price (₹)</label>
                  <input
                    type="number"
                    value={service.price || 0}
                    onChange={(e) => {
                      const newItems = [...(content.items || [])];
                      newItems[index] = { ...newItems[index], price: Number(e.target.value) };
                      handleUpdate('items', newItems);
                    }}
                    className={inputClass}
                  />
                </div>

                <div className="space-y-2">
                  <label className={labelClass}>Original Price (₹)</label>
                  <input
                    type="number"
                    value={service.originalPrice || 0}
                    onChange={(e) => {
                      const newItems = [...(content.items || [])];
                      newItems[index] = { ...newItems[index], originalPrice: Number(e.target.value) };
                      handleUpdate('items', newItems);
                    }}
                    className={inputClass}
                  />
                </div>
                
                <div className="space-y-2">
                  <label className={labelClass}>Duration</label>
                  <input
                    type="text"
                    value={service.duration || ''}
                    onChange={(e) => {
                      const newItems = [...(content.items || [])];
                      newItems[index] = { ...newItems[index], duration: e.target.value };
                      handleUpdate('items', newItems);
                    }}
                    className={inputClass}
                  />
                </div>

                <div className="space-y-2">
                  <label className={labelClass}>Warranty</label>
                  <input
                    type="text"
                    value={service.warranty || ''}
                    onChange={(e) => {
                      const newItems = [...(content.items || [])];
                      newItems[index] = { ...newItems[index], warranty: e.target.value };
                      handleUpdate('items', newItems);
                    }}
                    className={inputClass}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className={labelClass}>Main Image URL</label>
                <div className="flex gap-3 sm:gap-4">
                  <input
                    type="text"
                    value={service.image || ''}
                    onChange={(e) => {
                      const newItems = [...(content.items || [])];
                      newItems[index] = { ...newItems[index], image: e.target.value };
                      handleUpdate('items', newItems);
                    }}
                    className={`flex-1 ${inputClass}`}
                  />
                  {service.image && (
                    <div className="w-10 h-10 sm:w-12 sm:h-12 flex-shrink-0 rounded-lg overflow-hidden border border-border">
                      <img src={service.image} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>
              </div>
            </div>

            <hr className="border-border" />

            {/* --- FEATURES & INCLUDES --- */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              {/* Landing Page Features */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className={labelClass}>Key Features (Card Highlights)</label>
                  <button
                    onClick={() => {
                      const newItems = [...(content.items || [])];
                      newItems[index] = { ...newItems[index], features: [...(newItems[index].features || []), ''] };
                      handleUpdate('items', newItems);
                    }}
                    className="text-primary text-xs font-bold uppercase hover:underline"
                  >
                    + Add
                  </button>
                </div>
                <div className="space-y-2">
                  {service.features?.map((feat: string, i: number) => (
                    <div key={i} className="flex gap-2">
                      <input
                        value={feat}
                        onChange={(e) => {
                          const newItems = [...(content.items || [])];
                          const newFeat = [...(newItems[index].features || [])];
                          newFeat[i] = e.target.value;
                          newItems[index] = { ...newItems[index], features: newFeat };
                          handleUpdate('items', newItems);
                        }}
                        className={`flex-1 ${inputClass}`}
                        placeholder="Feature..."
                      />
                      <button
                        onClick={() => {
                          const newItems = [...(content.items || [])];
                          const newFeat = newItems[index].features.filter((_: any, idx: number) => idx !== i);
                          newItems[index] = { ...newItems[index], features: newFeat };
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

              {/* Detail Page Includes */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className={subSectionTitleClass}>
                    <CheckCircle2 className="w-4 h-4 text-green-500" /> 
                    What's Included
                  </label>
                  <button
                    onClick={() => {
                      const newItems = [...(content.items || [])];
                      newItems[index] = { ...newItems[index], includes: [...(newItems[index].includes || []), ''] };
                      handleUpdate('items', newItems);
                    }}
                    className="text-green-500 text-xs font-bold uppercase hover:underline"
                  >
                    + Add
                  </button>
                </div>
                <div className="space-y-2">
                  {service.includes?.map((inc: string, i: number) => (
                    <div key={i} className="flex gap-2">
                      <input
                        value={inc}
                        onChange={(e) => {
                          const newItems = [...(content.items || [])];
                          const newInc = [...(newItems[index].includes || [])];
                          newInc[i] = e.target.value;
                          newItems[index] = { ...newItems[index], includes: newInc };
                          handleUpdate('items', newItems);
                        }}
                        className={`flex-1 ${inputClass}`}
                        placeholder="Includes..."
                      />
                      <button
                        onClick={() => {
                          const newItems = [...(content.items || [])];
                          const newInc = (newItems[index].includes || []).filter((_: any, idx: number) => idx !== i);
                          newItems[index] = { ...newItems[index], includes: newInc };
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
            </div>

            <hr className="border-border" />

            {/* --- PROCESS / HOW IT WORKS --- */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label className={subSectionTitleClass}>
                  <Workflow className="w-4 h-4 text-blue-500" />
                  Service Process
                </label>
                <button
                  onClick={() => {
                    const newItems = [...(content.items || [])];
                    newItems[index] = {
                      ...newItems[index],
                      process: [...(newItems[index].process || []), { title: '', description: '' }]
                    };
                    handleUpdate('items', newItems);
                  }}
                  className="text-blue-500 text-xs font-bold uppercase hover:underline"
                >
                  + Add Step
                </button>
              </div>
              <div className="space-y-3 sm:space-y-4">
                {service.process?.map((step: any, i: number) => (
                  <div key={i} className="p-3 sm:p-4 rounded-xl border border-border bg-secondary/30">
                    <div className="flex justify-between mb-2">
                      <span className="text-xs font-bold text-muted-foreground uppercase">Step {i + 1}</span>
                      <button
                        onClick={() => {
                          const newItems = [...(content.items || [])];
                          const newProcess = (newItems[index].process || []).filter((_: any, idx: number) => idx !== i);
                          newItems[index] = { ...newItems[index], process: newProcess };
                          handleUpdate('items', newItems);
                        }}
                        className="text-destructive hover:text-destructive/80"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 sm:gap-3">
                      <input
                        placeholder="Step Title (e.g., Inspection)"
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
                      faqs: [...(newItems[index].faqs || []), { question: '', answer: '' }]
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
                      gallery: [...(newItems[index].gallery || []), '']
                    };
                    handleUpdate('items', newItems);
                  }}
                  className="text-cyan-500 text-xs font-bold uppercase hover:underline"
                >
                  + Add Image
                </button>
              </div>
              <div className="space-y-2">
                {service.gallery?.map((img: string, i: number) => (
                  <div key={i} className="flex gap-2">
                    <input
                      value={img}
                      onChange={(e) => {
                        const newItems = [...(content.items || [])];
                        const newGallery = [...(newItems[index].gallery || [])];
                        newGallery[i] = e.target.value;
                        newItems[index] = { ...newItems[index], gallery: newGallery };
                        handleUpdate('items', newItems);
                      }}
                      className={`flex-1 ${inputClass}`}
                      placeholder="Image URL..."
                    />
                    <button
                      onClick={() => {
                        const newItems = [...(content.items || [])];
                        const newGallery = (newItems[index].gallery || []).filter((_: any, idx: number) => idx !== i);
                        newItems[index] = { ...newItems[index], gallery: newGallery };
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

          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4 sm:space-y-6 w-full">
      {/* Main Header */}
      <div className="flex items-center gap-3 pb-4 border-b border-border">
        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center shadow-lg shadow-orange-500/20 flex-shrink-0">
          <Wrench className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
        </div>
        <div className="min-w-0">
          <h2 className="text-lg sm:text-xl font-bold text-foreground truncate">
            Service Management
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Create, edit, and delete individual service offerings.
          </p>
        </div>
      </div>

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