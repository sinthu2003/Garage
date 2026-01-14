import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SectionLoader } from '../shared/SectionLoader';
 import { DollarSign,
  Type,
  ChevronRight,
  ChevronDown,
  Trash2,
  Percent,
  TrendingDown,
  GripVertical,
  Image as ImageIcon,
} from 'lucide-react';
import { usePricingContent } from '../../hooks/useContentHooks';
import { useContent } from '../../context/ContentContext';
import { ImageUpload } from '../shared/ImageUpload';

interface PricingEditorProps {
  isDarkMode: boolean;
}

interface PriceItem {
  service: string;
  market: number;
  ours: number;
  image?: string;
}

export const PricingEditor: React.FC<PricingEditorProps> = ({ }) => {
  const { updateField } = useContent();
  const content = usePricingContent();
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(['header', 'items'])
  );
  const [expandedItems, setExpandedItems] = useState<Set<number>>(new Set([0]));

  // [LAZY LOADING] Show loading state - MUST be after all hooks
  if (content.isLoading) {
    return <SectionLoader section="Pricing" />;
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
    updateField('pricing', path, value);
  };

  // Theme-aware styling helpers using CSS variables
  const inputClass = `w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl text-sm transition-all bg-background border-border text-foreground placeholder-muted-foreground focus:border-primary border focus:outline-none focus:ring-2 focus:ring-primary/20`;

  const labelClass = `text-sm font-medium text-muted-foreground`;

  const sectionClass = `rounded-xl border overflow-hidden border-border bg-card`;

  const sectionHeaderClass = `w-full flex items-center justify-between p-3 sm:p-4 text-left transition-colors hover:bg-secondary/50`;

  const addNewPriceItem = () => {
    const newItem: PriceItem = {
      service: 'New Service',
      market: 1000,
      ours: 700,
      image: '',
    };
    // Add at the beginning of the array
    handleUpdate('items', [newItem, ...(content.items || [])]);
    // Auto-expand the newly added item (now at index 0)
    setExpandedItems(new Set([0]));
  };

  // Calculate savings
  const calculateSavings = (market: number, ours: number) => {
    if (market <= 0) return 0;
    return Math.round(((market - ours) / market) * 100);
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
                    placeholder="Save Up to 40%"
                    className={inputClass}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                  <div className="space-y-2">
                    <label className={labelClass}>Headline Line 1</label>
                    <input
                      type="text"
                      value={content.headline?.line1 || ''}
                      onChange={(e) => handleUpdate('headline.line1', e.target.value)}
                      placeholder="Transparent"
                      className={inputClass}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className={labelClass}>Line 2</label>
                    <input
                      type="text"
                      value={content.headline?.line2 || ''}
                      onChange={(e) => handleUpdate('headline.line2', e.target.value)}
                      placeholder="pricing."
                      className={inputClass}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className={labelClass}>Muted Text</label>
                    <input
                      type="text"
                      value={content.headline?.muted || ''}
                      onChange={(e) => handleUpdate('headline.muted', e.target.value)}
                      placeholder="No surprises."
                      className={inputClass}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className={labelClass}>Description</label>
                  <textarea
                    value={content.description || ''}
                    onChange={(e) => handleUpdate('description', e.target.value)}
                    placeholder="We operate centrally to minimize overheads..."
                    rows={2}
                    className={inputClass}
                  />
                </div>

                <div className="space-y-2">
                  <label className={labelClass}>CTA Button Text</label>
                  <input
                    type="text"
                    value={content.cta || ''}
                    onChange={(e) => handleUpdate('cta', e.target.value)}
                    placeholder="Book Now"
                    className={inputClass}
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Price Items */}
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
            <DollarSign className="w-4 h-4 sm:w-5 sm:h-5 text-teal-500" />
            <span className="font-medium text-foreground text-sm sm:text-base">Price Items</span>
            <span className="px-2 py-0.5 rounded-full text-xs bg-secondary text-muted-foreground">
              {content.items?.length || 0}
            </span>
          </div>
          {/* <button
            onClick={(e) => {
              e.stopPropagation();
              addNewPriceItem();
            }}
            className="p-2 rounded-lg bg-secondary hover:bg-secondary/80 text-foreground"
          >
            <Plus className="w-4 h-4" />
          </button> */}
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
                {content.items?.map((item: PriceItem, index: number) => (
                  <div
                    key={index}
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
                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg overflow-hidden bg-secondary flex-shrink-0 flex items-center justify-center">
                          {item.image ? (
                            <img
                              src={item.image.startsWith('http') || item.image.startsWith('data:') ? item.image : `${item.image}`}
                              alt={item.service || ''}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                (e.target as HTMLImageElement).style.display = 'none';
                              }}
                            />
                          ) : (
                            <ImageIcon className="w-5 h-5 text-muted-foreground" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-foreground text-sm truncate">
                            {item.service || 'Untitled Service'}
                          </p>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <span>₹{item.ours?.toLocaleString() || 0}</span>
                            <span className="inline-flex items-center gap-0.5 text-green-600">
                              <TrendingDown className="w-3 h-3" />
                              {calculateSavings(item.market, item.ours)}%
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            const newItems = content.items?.filter((_: PriceItem, i: number) => i !== index);
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
                            {/* Service Image Upload */}
                            <ImageUpload
                              value={item.image || ''}
                              onChange={(url) => {
                                const newItems = [...(content.items || [])];
                                newItems[index] = { ...newItems[index], image: url };
                                handleUpdate('items', newItems);
                              }}
                              label="Pricing Image"
                              placeholder="Upload image or enter URL"
                              previewHeight="h-40"
                              maxSizeMB={2}
                              maxWidthOrHeight={1920}
                              helperText="Image displayed on the pricing card"
                              showAltInput={false}
                              compact={false}
                            />

                            {/* Service Name */}
                            <div className="space-y-2">
                              <label className={labelClass}>Service Name</label>
                              <input
                                type="text"
                                value={item.service || ''}
                                onChange={(e) => {
                                  const newItems = [...(content.items || [])];
                                  newItems[index] = { ...newItems[index], service: e.target.value };
                                  handleUpdate('items', newItems);
                                }}
                                placeholder="Service name"
                                className={inputClass}
                              />
                            </div>

                            {/* Pricing */}
                            <div className="grid grid-cols-3 gap-3 sm:gap-4">
                              <div className="space-y-2">
                                <label className={labelClass}>Market Price (₹)</label>
                                <input
                                  type="text"
                                  inputMode="numeric"
                                  value={item.market !== undefined && item.market !== null ? String(item.market) : ''}
                                  onChange={(e) => {
                                    const newItems = [...(content.items || [])];
                                    const numValue = e.target.value === '' ? 0 : Number(e.target.value);
                                    newItems[index] = { ...newItems[index], market: numValue };
                                    handleUpdate('items', newItems);
                                  }}
                                  placeholder="0"
                                  className={inputClass}
                                />
                              </div>

                              <div className="space-y-2">
                                <label className={labelClass}>Our Price (₹)</label>
                                <input
                                  type="text"
                                  inputMode="numeric"
                                  value={item.ours !== undefined && item.ours !== null ? String(item.ours) : ''}
                                  onChange={(e) => {
                                    const newItems = [...(content.items || [])];
                                    const numValue = e.target.value === '' ? 0 : Number(e.target.value);
                                    newItems[index] = { ...newItems[index], ours: numValue };
                                    handleUpdate('items', newItems);
                                  }}
                                  placeholder="0"
                                  className={inputClass}
                                />
                              </div>

                              <div className="space-y-2">
                                <label className={labelClass}>Savings</label>
                                <div className="flex items-center h-[42px] sm:h-[46px]">
                                  <span className="inline-flex items-center gap-1 px-3 py-2 rounded-xl bg-green-100 text-green-700 text-sm font-medium">
                                    <TrendingDown className="w-4 h-4" />
                                    {calculateSavings(item.market, item.ours)}%
                                  </span>
                                </div>
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
                    <DollarSign className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No price items added yet</p>
                    <button onClick={addNewPriceItem} className="mt-2 text-primary text-sm font-medium">
                      + Add your first price item
                    </button>
                  </div>
                )}

                {/* Total Savings Summary */}
                {content.items && content.items.length > 0 && (
                  <div className="p-3 sm:p-4 rounded-xl bg-green-500/10 border border-green-500/20">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs sm:text-sm text-green-700 dark:text-green-400">
                          Total Potential Savings
                        </p>
                        <p className="text-xl sm:text-2xl font-bold text-green-800 dark:text-green-300">
                          ₹{content.items.reduce((acc: number, item: PriceItem) => acc + (item.market - item.ours), 0).toLocaleString()}
                        </p>
                      </div>
                      <Percent className="w-8 h-8 sm:w-10 sm:h-10 text-green-500" />
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Savings Card */}
      <div className={sectionClass}>
        <button onClick={() => toggleSection('savingsCard')} className={sectionHeaderClass}>
          <div className="flex items-center gap-2 sm:gap-3">
            <motion.div animate={{ rotate: expandedSections.has('savingsCard') ? 90 : 0 }}>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </motion.div>
            <Percent className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500" />
            <span className="font-medium text-foreground text-sm sm:text-base">Savings Calculator Card</span>
          </div>
        </button>

        <AnimatePresence>
          {expandedSections.has('savingsCard') && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="p-3 sm:p-4 pt-0 space-y-3 sm:space-y-4 border-t border-border">
                <div className="space-y-2">
                  <label className={labelClass}>Label Text</label>
                  <input
                    type="text"
                    value={content.savingsCard?.label || ''}
                    onChange={(e) => handleUpdate('savingsCard.label', e.target.value)}
                    placeholder="Average savings per year"
                    className={inputClass}
                  />
                </div>

                <div className="space-y-2">
                  <label className={labelClass}>Multiplier (for annual calculation)</label>
                  <input
                    type="number"
                    value={content.savingsCard?.multiplier || 2}
                    onChange={(e) => handleUpdate('savingsCard.multiplier', Number(e.target.value))}
                    min={1}
                    max={12}
                    className={inputClass}
                  />
                  <p className="text-xs text-muted-foreground">
                    How many times per year a customer typically services their car
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default PricingEditor;