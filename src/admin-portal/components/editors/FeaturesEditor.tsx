import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Zap,
  Type,
  ChevronRight,
  ChevronDown,
  Plus,
  Trash2,
  GripVertical,
  Palette,
  Shield,
  Clock,
  MapPin,
  Smartphone,
  Award,
  BadgePercent,
  Star,
  CheckCircle,
} from 'lucide-react';
import { useFeaturesContent } from '../../hooks/useContentHooks';
import { useContent } from '../../context/ContentContext';
import { ImageUpload } from '../shared/ImageUpload';
import type { FeatureItem } from '../../types/content.types';

interface FeaturesEditorProps {
  isDarkMode: boolean;
}

// Icon options for features
const iconOptions = [
  { value: 'Shield', label: 'Shield', icon: Shield },
  { value: 'BadgePercent', label: 'Discount', icon: BadgePercent },
  { value: 'Clock', label: 'Clock', icon: Clock },
  { value: 'MapPin', label: 'Location', icon: MapPin },
  { value: 'Smartphone', label: 'Phone', icon: Smartphone },
  { value: 'Award', label: 'Award', icon: Award },
  { value: 'Zap', label: 'Lightning', icon: Zap },
  { value: 'Star', label: 'Star', icon: Star },
  { value: 'CheckCircle', label: 'Check', icon: CheckCircle },
];

export const FeaturesEditor: React.FC<FeaturesEditorProps> = ({ }) => {
  const { updateField } = useContent();
  const content = useFeaturesContent();
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(['header', 'mainFeature', 'items'])
  );
  const [expandedItems, setExpandedItems] = useState<Set<number>>(new Set());

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
    updateField('features', path, value);
  };

  // Theme-aware styling helpers using CSS variables
  const inputClass = `w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl text-sm transition-all bg-background border-border text-foreground placeholder-muted-foreground focus:border-primary border focus:outline-none focus:ring-2 focus:ring-primary/20`;

  const labelClass = `text-sm font-medium text-muted-foreground`;

  const sectionClass = `rounded-xl border overflow-hidden border-border bg-card`;

  const sectionHeaderClass = `w-full flex items-center justify-between p-3 sm:p-4 text-left transition-colors hover:bg-secondary/50`;

  const addNewFeature = () => {
    const newFeature: FeatureItem = {
      icon: 'Star',
      title: 'New Feature',
      description: 'Feature description goes here...',
      color: '#3B82F6',
      image: '',
    };
    // Add at the beginning of the array
    handleUpdate('items', [newFeature, ...(content.items || [])]);
    // Auto-expand the newly added item (now at index 0)
    setExpandedItems(new Set([0]));
  };

  // Get icon component by name
  const getIconComponent = (iconName: string) => {
    const iconOption = iconOptions.find(opt => opt.value === iconName);
    return iconOption?.icon || Star;
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
                    placeholder="Why Choose Us"
                    className={inputClass}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div className="space-y-2">
                    <label className={labelClass}>Headline Line 1</label>
                    <input
                      type="text"
                      value={content.headline?.line1 || ''}
                      onChange={(e) => handleUpdate('headline.line1', e.target.value)}
                      placeholder="Built for"
                      className={inputClass}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className={labelClass}>Highlighted Text</label>
                    <input
                      type="text"
                      value={content.headline?.highlight || ''}
                      onChange={(e) => handleUpdate('headline.highlight', e.target.value)}
                      placeholder="modern car owners"
                      className={inputClass}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className={labelClass}>Description</label>
                  <textarea
                    value={content.description || ''}
                    onChange={(e) => handleUpdate('description', e.target.value)}
                    placeholder="We've reimagined car service with technology, transparency, and trust."
                    rows={2}
                    className={inputClass}
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Main Feature Card */}
      <div className={sectionClass}>
        <button onClick={() => toggleSection('mainFeature')} className={sectionHeaderClass}>
          <div className="flex items-center gap-2 sm:gap-3">
            <motion.div animate={{ rotate: expandedSections.has('mainFeature') ? 90 : 0 }}>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </motion.div>
            <Star className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500" />
            <span className="font-medium text-foreground text-sm sm:text-base">Main Feature Card</span>
          </div>
        </button>

        <AnimatePresence>
          {expandedSections.has('mainFeature') && (
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
                    value={content.mainFeature?.title || ''}
                    onChange={(e) => handleUpdate('mainFeature.title', e.target.value)}
                    placeholder="6-Month Warranty"
                    className={inputClass}
                  />
                </div>

                <div className="space-y-2">
                  <label className={labelClass}>Description</label>
                  <textarea
                    value={content.mainFeature?.description || ''}
                    onChange={(e) => handleUpdate('mainFeature.description', e.target.value)}
                    placeholder="We stand behind our work with an industry-leading warranty..."
                    rows={3}
                    className={inputClass}
                  />
                </div>

                {/* Feature Image */}
                <ImageUpload
                  value={content.mainFeature?.image || ''}
                  onChange={(url) => handleUpdate('mainFeature.image', url)}
                  label="Feature Image"
                  placeholder="Upload image or enter URL"
                  previewHeight="h-48"
                  maxSizeMB={2}
                  maxWidthOrHeight={1920}
                  helperText="Main feature card image"
                  showAltInput={false}
                  compact={false}
                />

                {/* Gradient Color */}
                <div className="space-y-2">
                  <label className={labelClass}>
                    <Palette className="w-4 h-4 inline mr-1" />
                    Gradient Color
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={content.mainFeature?.gradient?.startsWith('#') ? content.mainFeature.gradient : '#3B82F6'}
                      onChange={(e) => handleUpdate('mainFeature.gradient', e.target.value)}
                      className="w-10 h-10 rounded-lg cursor-pointer border-0"
                    />
                    <input
                      type="text"
                      value={content.mainFeature?.gradient || '#3B82F6'}
                      onChange={(e) => handleUpdate('mainFeature.gradient', e.target.value)}
                      placeholder="#3B82F6"
                      className={`flex-1 ${inputClass}`}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">Use hex color format (e.g., #3B82F6)</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Feature Items */}
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
            <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500" />
            <span className="font-medium text-foreground text-sm sm:text-base">Feature Items</span>
            <span className="px-2 py-0.5 rounded-full text-xs bg-secondary text-muted-foreground">
              {content.items?.length || 0}
            </span>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              addNewFeature();
            }}
            className="p-2 rounded-lg bg-secondary hover:bg-secondary/80 text-foreground"
          >
            <Plus className="w-4 h-4" />
          </button>
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
                {content.items?.map((feature: FeatureItem, index: number) => {
                  const IconComponent = getIconComponent(feature.icon);
                  return (
                    <div
                      key={index}
                      className="rounded-xl border overflow-hidden border-border bg-card"
                    >
                      {/* Feature Header */}
                      <div
                        onClick={() => toggleItem(index)}
                        onKeyDown={(e) => e.key === 'Enter' && toggleItem(index)}
                        role="button"
                        tabIndex={0}
                        className="w-full flex items-center justify-between p-3 sm:p-4 text-left hover:bg-secondary/50 cursor-pointer"
                      >
                        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                          <GripVertical className="w-4 h-4 cursor-grab text-muted-foreground hidden sm:block" />
                          {/* Image thumbnail or icon */}
                          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg overflow-hidden bg-secondary flex-shrink-0 flex items-center justify-center border border-border">
                            {feature.image ? (
                              <img
                                src={feature.image.startsWith('http') || feature.image.startsWith('data:') ? feature.image : `${feature.image}`}
                                alt={feature.title || ''}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).style.display = 'none';
                                }}
                              />
                            ) : (
                              <div
                                className="w-full h-full flex items-center justify-center"
                                style={{ backgroundColor: feature.color?.startsWith('#') ? `${feature.color}20` : '#3B82F620' }}
                              >
                                <IconComponent className="w-5 h-5" style={{ color: feature.color?.startsWith('#') ? feature.color : '#3B82F6' }} />
                              </div>
                            )}
                          </div>
                          <div className="min-w-0">
                            <span className="font-medium text-foreground text-sm sm:text-base truncate block">
                              {feature.title || 'New Feature'}
                            </span>
                            <span className="text-xs text-muted-foreground truncate block">
                              {feature.description?.slice(0, 40) || 'No description'}...
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              const newItems = content.items?.filter((_: FeatureItem, i: number) => i !== index);
                              handleUpdate('items', newItems);
                            }}
                            className="p-1.5 sm:p-2 rounded-lg text-destructive hover:bg-destructive/10"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                          <motion.div animate={{ rotate: expandedItems.has(index) ? 180 : 0 }}>
                            <ChevronDown className="w-4 h-4 text-muted-foreground" />
                          </motion.div>
                        </div>
                      </div>

                      {/* Feature Details */}
                      <AnimatePresence>
                        {expandedItems.has(index) && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden"
                          >
                            <div className="p-3 sm:p-4 pt-0 space-y-3 sm:space-y-4 border-t border-border">
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                                <div className="space-y-2">
                                  <label className={labelClass}>Icon</label>
                                  <select
                                    value={feature.icon || 'Star'}
                                    onChange={(e) => {
                                      const newItems = [...(content.items || [])];
                                      newItems[index] = { ...newItems[index], icon: e.target.value };
                                      handleUpdate('items', newItems);
                                    }}
                                    className={inputClass}
                                  >
                                    {iconOptions.map(opt => (
                                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                                    ))}
                                  </select>
                                </div>

                                <div className="space-y-2">
                                  <label className={labelClass}>
                                    <Palette className="w-4 h-4 inline mr-1" />
                                    Color
                                  </label>
                                  <div className="flex items-center gap-2">
                                    <input
                                      type="color"
                                      value={feature.color?.startsWith('#') ? feature.color : '#3B82F6'}
                                      onChange={(e) => {
                                        const newItems = [...(content.items || [])];
                                        newItems[index] = { ...newItems[index], color: e.target.value };
                                        handleUpdate('items', newItems);
                                      }}
                                      className="w-10 h-10 rounded-lg cursor-pointer border-0"
                                    />
                                    <input
                                      type="text"
                                      value={feature.color || '#3B82F6'}
                                      onChange={(e) => {
                                        const newItems = [...(content.items || [])];
                                        newItems[index] = { ...newItems[index], color: e.target.value };
                                        handleUpdate('items', newItems);
                                      }}
                                      placeholder="#3B82F6"
                                      className={`flex-1 ${inputClass}`}
                                    />
                                  </div>
                                </div>
                              </div>

                              <div className="space-y-2">
                                <label className={labelClass}>Title</label>
                                <input
                                  type="text"
                                  value={feature.title || ''}
                                  onChange={(e) => {
                                    const newItems = [...(content.items || [])];
                                    newItems[index] = { ...newItems[index], title: e.target.value };
                                    handleUpdate('items', newItems);
                                  }}
                                  placeholder="6-Month Warranty"
                                  className={inputClass}
                                />
                              </div>

                              <div className="space-y-2">
                                <label className={labelClass}>Description</label>
                                <textarea
                                  value={feature.description || ''}
                                  onChange={(e) => {
                                    const newItems = [...(content.items || [])];
                                    newItems[index] = { ...newItems[index], description: e.target.value };
                                    handleUpdate('items', newItems);
                                  }}
                                  placeholder="Comprehensive warranty coverage..."
                                  rows={2}
                                  className={inputClass}
                                />
                              </div>

                              <ImageUpload
                                value={feature.image || ''}
                                onChange={(url) => {
                                  const newItems = [...(content.items || [])];
                                  newItems[index] = { ...newItems[index], image: url };
                                  handleUpdate('items', newItems);
                                }}
                                label="Feature Image (Optional)"
                                placeholder="Upload image or enter URL"
                                previewHeight="h-40"
                                maxSizeMB={2}
                                maxWidthOrHeight={1920}
                                helperText="Optional image for this feature"
                                showAltInput={false}
                                compact={false}
                              />
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}

                {(!content.items || content.items.length === 0) && (
                  <div className="text-center py-6 sm:py-8 text-muted-foreground">
                    <Zap className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No features added yet</p>
                    <button onClick={addNewFeature} className="mt-2 text-primary text-sm font-medium">
                      + Add your first feature
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

export default FeaturesEditor;