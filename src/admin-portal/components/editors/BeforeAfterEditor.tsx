import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  SplitSquareHorizontal,
  Type,
  ChevronRight,
  ChevronDown,
  GripVertical,
  Clock,
  IndianRupee,
  Car,
  MousePointerClick,
} from 'lucide-react';
import { useBeforeAfterContent } from '../../hooks/useContentHooks';
import { useContent } from '../../context/ContentContext';
import { ImageUpload } from '../shared/ImageUpload';
import type { BeforeAfterItem } from '../../types/content.types';
import { SectionLoader } from '../shared/SectionLoader';

interface BeforeAfterEditorProps {
  isDarkMode: boolean;
}

export const BeforeAfterEditor: React.FC<BeforeAfterEditorProps> = ({ }) => {
  const { updateField } = useContent();
  const content = useBeforeAfterContent();
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(['header', 'items'])
  );
  const [expandedItems, setExpandedItems] = useState<Set<number>>(new Set([0]));

  // [LAZY LOADING] Show loading state - MUST be after all hooks
  if (content.isLoading) {
    return <SectionLoader section="Before & After" />;
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

  const toggleItem = (index: number) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedItems(newExpanded);
  };

  const handleUpdate = (path: string, value: unknown) => {
    updateField('beforeAfter', path, value);
  };

  // Theme-aware styling helpers using CSS variables
  const inputClass = `w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl text-sm transition-all bg-background border-border text-foreground placeholder-muted-foreground focus:border-primary border focus:outline-none focus:ring-2 focus:ring-primary/20`;

  const labelClass = `text-sm font-medium text-muted-foreground`;

  const sectionClass = `rounded-xl border overflow-hidden border-border bg-card`;

  const sectionHeaderClass = `w-full flex items-center justify-between p-3 sm:p-4 text-left transition-colors hover:bg-secondary/50`;

  const addNewTransformation = () => {
    const newItem: BeforeAfterItem = {
      id: Date.now(),
      title: 'New Transformation',
      car: 'Car Model',
      beforeImage: '',
      afterImage: '',
      description: 'Transformation description',
      time: '1 Day',
      savings: '₹5,000',
    };
    handleUpdate('items', [newItem, ...(content.items || [])]);
    setExpandedItems(new Set([0]));
  };

  // Update item field
  const updateItemField = (index: number, field: keyof BeforeAfterItem, value: unknown) => {
    const newItems = [...(content.items || [])];
    newItems[index] = { ...newItems[index], [field]: value };
    handleUpdate('items', newItems);
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Section Header Content */}
      <div className={sectionClass}>
        <button onClick={() => toggleSection('header')} className={sectionHeaderClass}>
          <div className="flex items-center gap-2 sm:gap-3">
            <motion.div animate={{ rotate: expandedSections.has('header') ? 90 : 0 }}>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </motion.div>
            <Type className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" />
            <span className="font-medium text-foreground text-sm sm:text-base">Section Header</span>
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
                  <label className={labelClass}>Badge Text</label>
                  <input
                    type="text"
                    value={content.badge || ''}
                    onChange={(e) => handleUpdate('badge', e.target.value)}
                    placeholder="Transformations"
                    className={inputClass}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div className="space-y-2">
                    <label className={labelClass}>Headline Text</label>
                    <input
                      type="text"
                      value={content.headline?.text || ''}
                      onChange={(e) => handleUpdate('headline.text', e.target.value)}
                      placeholder="Before & After"
                      className={inputClass}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className={labelClass}>Highlighted Text</label>
                    <input
                      type="text"
                      value={content.headline?.highlight || ''}
                      onChange={(e) => handleUpdate('headline.highlight', e.target.value)}
                      placeholder="magic"
                      className={inputClass}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className={labelClass}>Description</label>
                  <textarea
                    value={content.description || ''}
                    onChange={(e) => handleUpdate('description', e.target.value)}
                    placeholder="Drag the slider to see the incredible transformations..."
                    rows={2}
                    className={inputClass}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div className="space-y-2">
                    <label className={labelClass}>Before Label</label>
                    <input
                      type="text"
                      value={content.beforeLabel || ''}
                      onChange={(e) => handleUpdate('beforeLabel', e.target.value)}
                      placeholder="Before"
                      className={inputClass}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className={labelClass}>After Label</label>
                    <input
                      type="text"
                      value={content.afterLabel || ''}
                      onChange={(e) => handleUpdate('afterLabel', e.target.value)}
                      placeholder="After"
                      className={inputClass}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className={labelClass}>Select Transformation Label</label>
                  <input
                    type="text"
                    value={content.selectLabel || ''}
                    onChange={(e) => handleUpdate('selectLabel', e.target.value)}
                    placeholder="Select a transformation"
                    className={inputClass}
                  />
                </div>

                {/* CTA Button */}
                <div className="space-y-2">
                  <label className={labelClass}>
                    <MousePointerClick className="w-4 h-4 inline mr-1" />
                    CTA Button Text
                  </label>
                  <input
                    type="text"
                    value={content.cta || ''}
                    onChange={(e) => handleUpdate('cta', e.target.value)}
                    placeholder="Get Your Car Transformed"
                    className={inputClass}
                  />
                  <p className="text-xs text-muted-foreground">
                    This button navigates to the Booking Widget section
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Transformation Items */}
      <div className={sectionClass}>
        <div 
          onClick={() => toggleSection('items')} 
          onKeyDown={(e) => e.key === 'Enter' && toggleSection('items')}
          role="button"
          tabIndex={0}
          className={`${sectionHeaderClass} cursor-pointer`}
        >
          <div className="flex items-center gap-2 sm:gap-3">
            <motion.div animate={{ rotate: expandedSections.has('items') ? 90 : 0 }}>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </motion.div>
            <SplitSquareHorizontal className="w-4 h-4 sm:w-5 sm:h-5 text-violet-500" />
            <span className="font-medium text-foreground text-sm sm:text-base">Transformations</span>
            <span className="px-2 py-0.5 rounded-full text-xs bg-secondary text-muted-foreground">
              {content.items?.length || 0}
            </span>
          </div>
          
        </div>

        <AnimatePresence>
          {expandedSections.has('items') && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="p-3 sm:p-4 pt-0 space-y-3 sm:space-y-4 border-t border-border">
                {content.items?.map((item: BeforeAfterItem, index: number) => (
                  <div
                    key={item.id || index}
                    className="rounded-xl border overflow-hidden border-border bg-card"
                  >
                    {/* Item Header */}
                    <div
                      onClick={() => toggleItem(index)}
                      onKeyDown={(e) => e.key === 'Enter' && toggleItem(index)}
                      role="button"
                      tabIndex={0}
                      className="w-full flex items-center justify-between p-3 sm:p-4 text-left hover:bg-secondary/50 cursor-pointer"
                    >
                      <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                        <GripVertical className="w-4 h-4 cursor-grab text-muted-foreground hidden sm:block" />
                        <div className="flex gap-1 flex-shrink-0">
                          {/* Before Image Thumbnail */}
                          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg overflow-hidden bg-secondary">
                            {item.beforeImage ? (
                              <img
                                src={item.beforeImage.startsWith('http') || item.beforeImage.startsWith('data:') ? item.beforeImage : `${item.beforeImage}`}
                                alt="Before"
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).style.display = 'none';
                                }}
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground">B</div>
                            )}
                          </div>
                          {/* After Image Thumbnail */}
                          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg overflow-hidden bg-secondary">
                            {item.afterImage ? (
                              <img
                                src={item.afterImage.startsWith('http') || item.afterImage.startsWith('data:') ? item.afterImage : `${item.afterImage}`}
                                alt="After"
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).style.display = 'none';
                                }}
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground">A</div>
                            )}
                          </div>
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-foreground text-sm truncate">
                            {item.title || 'Untitled Transformation'}
                          </p>
                          <p className="text-xs text-muted-foreground truncate">
                            {item.car || 'No car specified'}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
                  
                        <motion.div animate={{ rotate: expandedItems.has(index) ? 180 : 0 }}>
                          <ChevronDown className="w-4 h-4 text-muted-foreground" />
                        </motion.div>
                      </div>
                    </div>

                    {/* Item Details */}
                    <AnimatePresence>
                      {expandedItems.has(index) && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden border-t border-border"
                        >
                          <div className="p-3 sm:p-4 space-y-3 sm:space-y-4">
                            {/* Title & Car */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                              <div className="space-y-2">
                                <label className={labelClass}>Title</label>
                                <input
                                  type="text"
                                  value={item.title || ''}
                                  onChange={(e) => updateItemField(index, 'title', e.target.value)}
                                  placeholder="Full Body Denting"
                                  className={inputClass}
                                />
                              </div>

                              <div className="space-y-2">
                                <label className={labelClass}>
                                  <Car className="w-4 h-4 inline mr-1" />
                                  Car Model
                                </label>
                                <input
                                  type="text"
                                  value={item.car || ''}
                                  onChange={(e) => updateItemField(index, 'car', e.target.value)}
                                  placeholder="Hyundai i20"
                                  className={inputClass}
                                />
                              </div>
                            </div>

                            {/* Description */}
                            <div className="space-y-2">
                              <label className={labelClass}>Description</label>
                              <textarea
                                value={item.description || ''}
                                onChange={(e) => updateItemField(index, 'description', e.target.value)}
                                placeholder="Complete restoration from accident damage..."
                                rows={2}
                                className={inputClass}
                              />
                            </div>

                            {/* Before Image */}
                            <ImageUpload
                              value={item.beforeImage || ''}
                              onChange={(url) => {
                                const newItems = [...(content.items || [])];
                                newItems[index] = { ...newItems[index], beforeImage: url };
                                handleUpdate('items', newItems);
                              }}
                              label="Before Image"
                              placeholder="Upload image or enter URL"
                              previewHeight="h-40"
                              maxSizeMB={2}
                              maxWidthOrHeight={1920}
                              helperText="Image showing the condition before service"
                              showAltInput={false}
                              compact={false}
                            />

                            {/* After Image */}
                            <ImageUpload
                              value={item.afterImage || ''}
                              onChange={(url) => {
                                const newItems = [...(content.items || [])];
                                newItems[index] = { ...newItems[index], afterImage: url };
                                handleUpdate('items', newItems);
                              }}
                              label="After Image"
                              placeholder="Upload image or enter URL"
                              previewHeight="h-40"
                              maxSizeMB={2}
                              maxWidthOrHeight={1920}
                              helperText="Image showing the result after service"
                              showAltInput={false}
                              compact={false}
                            />

                            {/* Time & Savings */}
                            <div className="grid grid-cols-2 gap-3 sm:gap-4">
                              <div className="space-y-2">
                                <label className={labelClass}>
                                  <Clock className="w-4 h-4 inline mr-1" />
                                  Time Taken
                                </label>
                                <input
                                  type="text"
                                  value={item.time || ''}
                                  onChange={(e) => updateItemField(index, 'time', e.target.value)}
                                  placeholder="2 Days"
                                  className={inputClass}
                                />
                              </div>

                              <div className="space-y-2">
                                <label className={labelClass}>
                                  <IndianRupee className="w-4 h-4 inline mr-1" />
                                  Savings
                                </label>
                                <input
                                  type="text"
                                  value={item.savings || ''}
                                  onChange={(e) => updateItemField(index, 'savings', e.target.value)}
                                  placeholder="₹8,000"
                                  className={inputClass}
                                />
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}

                {(!content.items || content.items.length === 0) && (
                  <div className="text-center py-6 sm:py-8 text-muted-foreground">
                    <SplitSquareHorizontal className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No transformations added yet</p>
                    <button onClick={addNewTransformation} className="mt-2 text-primary text-sm font-medium">
                      + Add your first transformation
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default BeforeAfterEditor;