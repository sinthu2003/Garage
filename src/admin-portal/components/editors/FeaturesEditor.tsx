import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Zap,
  Type,
  Image,
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
  const inputClass = `w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl text-sm transition-all bg-secondary border-border text-foreground placeholder-muted-foreground focus:border-primary border focus:outline-none focus:ring-2 focus:ring-primary/20`;

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
    handleUpdate('items', [...(content.items || []), newFeature]);
  };

  // Get icon component by name
  const getIconComponent = (iconName: string) => {
    const iconOption = iconOptions.find(opt => opt.value === iconName);
    return iconOption?.icon || Star;
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 pb-4 border-b border-border">
        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center flex-shrink-0">
          <Zap className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
        </div>
        <div className="min-w-0">
          <h2 className="text-lg sm:text-xl font-bold text-foreground truncate">
            Features Editor
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Why choose us section with feature cards
          </p>
        </div>
      </div>

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
                    placeholder="We've reimagined car service with technology..."
                    rows={2}
                    className={inputClass}
                  />
                </div>

                {/* Preview */}
                <div className="p-3 sm:p-4 rounded-xl bg-secondary">
                  <p className="text-xs uppercase tracking-wider mb-2 text-muted-foreground">
                    Preview
                  </p>
                  <div className="inline-block px-3 py-1 rounded-full bg-amber-100 text-amber-700 text-xs font-medium mb-2">
                    {content.badge || 'Why Choose Us'}
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-foreground">
                    {content.headline?.line1 || 'Built for'}
                    {' '}
                    <span className="text-primary">{content.headline?.highlight || 'modern car owners'}</span>
                  </h3>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Main Feature Showcase */}
      <div className={sectionClass}>
        <button onClick={() => toggleSection('mainFeature')} className={sectionHeaderClass}>
          <div className="flex items-center gap-2 sm:gap-3">
            <motion.div animate={{ rotate: expandedSections.has('mainFeature') ? 90 : 0 }}>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </motion.div>
            <Image className="w-4 h-4 sm:w-5 sm:h-5 text-purple-500" />
            <span className="font-medium text-foreground text-sm sm:text-base">Main Feature Showcase</span>
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
                  <label className={labelClass}>Badge</label>
                  <input
                    type="text"
                    value={content.mainFeature?.badge || ''}
                    onChange={(e) => handleUpdate('mainFeature.badge', e.target.value)}
                    placeholder="Premium Quality"
                    className={inputClass}
                  />
                </div>

                <div className="space-y-2">
                  <label className={labelClass}>Title</label>
                  <input
                    type="text"
                    value={content.mainFeature?.title || ''}
                    onChange={(e) => handleUpdate('mainFeature.title', e.target.value)}
                    placeholder="State-of-the-art Workshop"
                    className={inputClass}
                  />
                </div>

                <div className="space-y-2">
                  <label className={labelClass}>Description</label>
                  <textarea
                    value={content.mainFeature?.description || ''}
                    onChange={(e) => handleUpdate('mainFeature.description', e.target.value)}
                    placeholder="Our workshops are equipped with the latest diagnostic tools..."
                    rows={2}
                    className={inputClass}
                  />
                </div>

                <div className="space-y-2">
                  <label className={labelClass}>
                    <Image className="w-4 h-4 inline mr-1" />
                    Image
                  </label>
                  <input
                    type="text"
                    value={content.mainFeature?.image || ''}
                    onChange={(e) => handleUpdate('mainFeature.image', e.target.value)}
                    placeholder="CarInspection.jpg"
                    className={inputClass}
                  />
                </div>

                {/* Highlights */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className={labelClass}>Highlights</label>
                    <button
                      onClick={() => {
                        const newHighlights = [...(content.mainFeature?.highlights || []), 'New highlight'];
                        handleUpdate('mainFeature.highlights', newHighlights);
                      }}
                      className="text-sm text-primary font-medium"
                    >
                      + Add
                    </button>
                  </div>
                  <div className="space-y-2">
                    {content.mainFeature?.highlights?.map((highlight: string, index: number) => (
                      <div key={index} className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                        <input
                          type="text"
                          value={highlight}
                          onChange={(e) => {
                            const newHighlights = [...(content.mainFeature?.highlights || [])];
                            newHighlights[index] = e.target.value;
                            handleUpdate('mainFeature.highlights', newHighlights);
                          }}
                          className={`flex-1 ${inputClass}`}
                        />
                        <button
                          onClick={() => {
                            const newHighlights = content.mainFeature?.highlights?.filter((_: string, i: number) => i !== index);
                            handleUpdate('mainFeature.highlights', newHighlights);
                          }}
                          className="p-2 rounded-lg text-destructive hover:bg-destructive/10 flex-shrink-0"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Preview */}
                {content.mainFeature?.image && (
                  <div className="p-3 sm:p-4 rounded-xl bg-secondary">
                    <p className="text-xs uppercase tracking-wider mb-3 text-muted-foreground">
                      Preview
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                      <img
                        src={content.mainFeature.image.startsWith('http') ? content.mainFeature.image : `/assets/${content.mainFeature.image}`}
                        alt="Main Feature"
                        className="w-full sm:w-32 h-24 rounded-xl object-cover"
                        onError={(e) => { (e.target as HTMLImageElement).src = 'https://via.placeholder.com/128x96'; }}
                      />
                      <div className="flex-1 min-w-0">
                        <span className="inline-block px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 text-xs font-medium mb-1">
                          {content.mainFeature?.badge}
                        </span>
                        <h4 className="font-bold text-foreground truncate">
                          {content.mainFeature?.title}
                        </h4>
                        <div className="flex flex-wrap gap-1 sm:gap-2 mt-2">
                          {content.mainFeature?.highlights?.slice(0, 3).map((h: string, i: number) => (
                            <span key={i} className="text-xs px-2 py-1 rounded-full bg-muted text-muted-foreground">
                              {h}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Feature Items */}
      <div className={sectionClass}>
        <button onClick={() => toggleSection('items')} className={sectionHeaderClass}>
          <div className="flex items-center gap-2 sm:gap-3">
            <motion.div animate={{ rotate: expandedSections.has('items') ? 90 : 0 }}>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </motion.div>
            <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500" />
            <span className="font-medium text-foreground text-sm sm:text-base">Feature Cards</span>
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
        </button>

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
                      <button
                        onClick={() => toggleItem(index)}
                        className="w-full flex items-center justify-between p-3 sm:p-4 text-left hover:bg-secondary/50"
                      >
                        <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                          <GripVertical className="w-4 h-4 cursor-grab text-muted-foreground hidden sm:block" />
                          <div 
                            className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                            style={{ backgroundColor: `${feature.color}20` }}
                          >
                            <IconComponent className="w-4 h-4 sm:w-5 sm:h-5" style={{ color: feature.color }} />
                          </div>
                          <div className="min-w-0">
                            <p className="font-medium text-foreground text-sm sm:text-base truncate">
                              {feature.title || 'New Feature'}
                            </p>
                            <p className="text-xs sm:text-sm truncate max-w-[150px] sm:max-w-xs text-muted-foreground">
                              {feature.description?.substring(0, 50)}...
                            </p>
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
                      </button>

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
                                      value={feature.color || '#3B82F6'}
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

                              <div className="space-y-2">
                                <label className={labelClass}>
                                  <Image className="w-4 h-4 inline mr-1" />
                                  Image (Optional)
                                </label>
                                <input
                                  type="text"
                                  value={feature.image || ''}
                                  onChange={(e) => {
                                    const newItems = [...(content.items || [])];
                                    newItems[index] = { ...newItems[index], image: e.target.value };
                                    handleUpdate('items', newItems);
                                  }}
                                  placeholder="6-month-warranty.png"
                                  className={inputClass}
                                />
                              </div>

                              {/* Preview Card */}
                              <div className="p-3 sm:p-4 rounded-xl bg-secondary">
                                <p className="text-xs uppercase tracking-wider mb-3 text-muted-foreground">
                                  Preview
                                </p>
                                <div className="p-3 sm:p-4 rounded-xl bg-card shadow-sm">
                                  <div 
                                    className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center mb-3"
                                    style={{ backgroundColor: `${feature.color}20` }}
                                  >
                                    <IconComponent className="w-5 h-5 sm:w-6 sm:h-6" style={{ color: feature.color }} />
                                  </div>
                                  <h4 className="font-bold mb-1 text-foreground text-sm sm:text-base">
                                    {feature.title || 'Feature Title'}
                                  </h4>
                                  <p className="text-xs sm:text-sm text-muted-foreground">
                                    {feature.description || 'Feature description...'}
                                  </p>
                                </div>
                              </div>
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

                {/* Grid Preview */}
                {content.items && content.items.length > 0 && (
                  <div className="p-3 sm:p-4 rounded-xl bg-secondary">
                    <p className="text-xs uppercase tracking-wider mb-3 text-muted-foreground">
                      Grid Preview ({content.items.length} features)
                    </p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {content.items.map((feature: FeatureItem, i: number) => {
                        const Icon = getIconComponent(feature.icon);
                        return (
                          <div 
                            key={i} 
                            className="p-2 sm:p-3 rounded-lg text-center bg-card"
                          >
                            <Icon className="w-4 h-4 sm:w-5 sm:h-5 mx-auto mb-1" style={{ color: feature.color }} />
                            <p className="text-[10px] sm:text-xs truncate text-muted-foreground">
                              {feature.title}
                            </p>
                          </div>
                        );
                      })}
                    </div>
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