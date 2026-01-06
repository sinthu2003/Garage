import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  DollarSign,
  Type,
  Image,
  ChevronRight,
  Plus,
  Trash2,
  Percent,
  List,
  CheckCircle,
  TrendingDown,
} from 'lucide-react';
import { usePricingContent } from '../../hooks/useContentHooks';
import { useContent } from '../../context/ContentContext';

interface PricingEditorProps {
  isDarkMode: boolean;
}

export const PricingEditor: React.FC<PricingEditorProps> = ({ }) => {
  const { updateField } = useContent();
  const content = usePricingContent();
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(['header', 'items'])
  );

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
    updateField('pricing', path, value);
  };

  // Theme-aware styling helpers using CSS variables
  const inputClass = `w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl text-sm transition-all bg-secondary border-border text-foreground placeholder-muted-foreground focus:border-primary border focus:outline-none focus:ring-2 focus:ring-primary/20`;

  const labelClass = `text-sm font-medium text-muted-foreground`;

  const sectionClass = `rounded-xl border overflow-hidden border-border bg-card`;

  const sectionHeaderClass = `w-full flex items-center justify-between p-3 sm:p-4 text-left transition-colors hover:bg-secondary/50`;

  const addNewPriceItem = () => {
    const newItem = {
      service: 'New Service',
      market: 1000,
      ours: 700,
      image: '',
    };
    handleUpdate('items', [...(content.items || []), newItem]);
  };

  // Calculate savings
  const calculateSavings = (market: number, ours: number) => {
    if (market <= 0) return 0;
    return Math.round(((market - ours) / market) * 100);
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 pb-4 border-b border-border">
        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-teal-500 to-emerald-500 flex items-center justify-center flex-shrink-0">
          <DollarSign className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
        </div>
        <div className="min-w-0">
          <h2 className="text-lg sm:text-xl font-bold text-foreground truncate">
            Pricing Editor
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Price comparison table and savings highlights
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

                {/* Preview */}
                <div className="p-3 sm:p-4 rounded-xl bg-secondary">
                  <p className="text-xs uppercase tracking-wider mb-2 text-muted-foreground">
                    Preview
                  </p>
                  <div className="inline-block px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-medium mb-2">
                    {content.badge || 'Save Up to 40%'}
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-foreground">
                    {content.headline?.line1 || 'Transparent'}
                    <br />
                    {content.headline?.line2 || 'pricing.'}
                    <span className="text-muted-foreground">
                      {' '}{content.headline?.muted || 'No surprises.'}
                    </span>
                  </h3>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Highlights */}
      <div className={sectionClass}>
        <button onClick={() => toggleSection('highlights')} className={sectionHeaderClass}>
          <div className="flex items-center gap-2 sm:gap-3">
            <motion.div animate={{ rotate: expandedSections.has('highlights') ? 90 : 0 }}>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </motion.div>
            <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />
            <span className="font-medium text-foreground text-sm sm:text-base">Highlights</span>
            <span className="px-2 py-0.5 rounded-full text-xs bg-secondary text-muted-foreground">
              {content.highlights?.length || 0}
            </span>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleUpdate('highlights', [...(content.highlights || []), 'New highlight']);
            }}
            className="p-2 rounded-lg bg-secondary hover:bg-secondary/80 text-foreground"
          >
            <Plus className="w-4 h-4" />
          </button>
        </button>

        <AnimatePresence>
          {expandedSections.has('highlights') && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="p-3 sm:p-4 pt-0 space-y-2 border-t border-border">
                {content.highlights?.map((highlight: string, index: number) => (
                  <div key={index} className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                    <input
                      type="text"
                      value={highlight}
                      onChange={(e) => {
                        const newHighlights = [...(content.highlights || [])];
                        newHighlights[index] = e.target.value;
                        handleUpdate('highlights', newHighlights);
                      }}
                      className={`flex-1 ${inputClass}`}
                    />
                    <button
                      onClick={() => {
                        const newHighlights = content.highlights?.filter((_: unknown, i: number) => i !== index);
                        handleUpdate('highlights', newHighlights);
                      }}
                      className="p-2 rounded-lg text-destructive hover:bg-destructive/10 flex-shrink-0"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}

                {(!content.highlights || content.highlights.length === 0) && (
                  <p className="text-center py-4 text-sm text-muted-foreground">
                    No highlights. <button onClick={() => handleUpdate('highlights', ['New highlight'])} className="text-primary">Add one</button>
                  </p>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Feature Image */}
      <div className={sectionClass}>
        <button onClick={() => toggleSection('featureImage')} className={sectionHeaderClass}>
          <div className="flex items-center gap-2 sm:gap-3">
            <motion.div animate={{ rotate: expandedSections.has('featureImage') ? 90 : 0 }}>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </motion.div>
            <Image className="w-4 h-4 sm:w-5 sm:h-5 text-purple-500" />
            <span className="font-medium text-foreground text-sm sm:text-base">Feature Image Card</span>
          </div>
        </button>

        <AnimatePresence>
          {expandedSections.has('featureImage') && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="p-3 sm:p-4 pt-0 space-y-3 sm:space-y-4 border-t border-border">
                <div className="space-y-2">
                  <label className={labelClass}>Subtitle</label>
                  <input
                    type="text"
                    value={content.featureImage?.subtitle || ''}
                    onChange={(e) => handleUpdate('featureImage.subtitle', e.target.value)}
                    placeholder="Why pay more?"
                    className={inputClass}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div className="space-y-2">
                    <label className={labelClass}>Title</label>
                    <input
                      type="text"
                      value={content.featureImage?.title || ''}
                      onChange={(e) => handleUpdate('featureImage.title', e.target.value)}
                      placeholder="Same Quality,"
                      className={inputClass}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className={labelClass}>Highlight</label>
                    <input
                      type="text"
                      value={content.featureImage?.highlight || ''}
                      onChange={(e) => handleUpdate('featureImage.highlight', e.target.value)}
                      placeholder="Better Price."
                      className={inputClass}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className={labelClass}>Image</label>
                  <input
                    type="text"
                    value={content.featureImage?.image || ''}
                    onChange={(e) => handleUpdate('featureImage.image', e.target.value)}
                    placeholder="WeService.jpg"
                    className={inputClass}
                  />
                </div>

                {content.featureImage?.image && (
                  <div className="relative rounded-xl overflow-hidden aspect-video">
                    <img
                      src={content.featureImage.image.startsWith('http') ? content.featureImage.image : `/assets/${content.featureImage.image}`}
                      alt="Feature"
                      className="w-full h-full object-cover"
                      onError={(e) => { (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x200?text=Image'; }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-3 sm:bottom-4 left-3 sm:left-4 text-white">
                      <p className="text-xs opacity-80">{content.featureImage?.subtitle}</p>
                      <p className="text-base sm:text-lg font-bold">
                        {content.featureImage?.title} <span className="text-orange-400">{content.featureImage?.highlight}</span>
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Price Comparison Items */}
      <div className={sectionClass}>
        <button onClick={() => toggleSection('items')} className={sectionHeaderClass}>
          <div className="flex items-center gap-2 sm:gap-3">
            <motion.div animate={{ rotate: expandedSections.has('items') ? 90 : 0 }}>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </motion.div>
            <List className="w-4 h-4 sm:w-5 sm:h-5 text-teal-500" />
            <span className="font-medium text-foreground text-sm sm:text-base">Price Comparison Table</span>
            <span className="px-2 py-0.5 rounded-full text-xs bg-secondary text-muted-foreground">
              {content.items?.length || 0}
            </span>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              addNewPriceItem();
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
                {/* Table Header - Hidden on mobile */}
                <div className="hidden sm:grid grid-cols-12 gap-2 px-4 py-2 rounded-lg text-xs font-medium uppercase tracking-wider bg-secondary text-muted-foreground">
                  <div className="col-span-4">Service</div>
                  <div className="col-span-2 text-center">Market ₹</div>
                  <div className="col-span-2 text-center">Our ₹</div>
                  <div className="col-span-2 text-center">Savings</div>
                  <div className="col-span-2 text-center">Actions</div>
                </div>

                {content.items?.map((item: { service: string; market: number; ours: number; image?: string }, index: number) => (
                  <div
                    key={index}
                    className="p-3 rounded-xl border border-border bg-card"
                  >
                    {/* Mobile Layout */}
                    <div className="sm:hidden space-y-3">
                      <div className="flex items-center justify-between">
                        <input
                          type="text"
                          value={item.service || ''}
                          onChange={(e) => {
                            const newItems = [...(content.items || [])];
                            newItems[index] = { ...newItems[index], service: e.target.value };
                            handleUpdate('items', newItems);
                          }}
                          placeholder="Service name"
                          className={`flex-1 ${inputClass} py-2`}
                        />
                        <button
                          onClick={() => {
                            const newItems = content.items?.filter((_: unknown, i: number) => i !== index);
                            handleUpdate('items', newItems);
                          }}
                          className="ml-2 p-2 rounded-lg text-destructive hover:bg-destructive/10"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        <div className="space-y-1">
                          <label className="text-[10px] text-muted-foreground">Market ₹</label>
                          <input
                            type="number"
                            value={item.market || 0}
                            onChange={(e) => {
                              const newItems = [...(content.items || [])];
                              newItems[index] = { ...newItems[index], market: Number(e.target.value) };
                              handleUpdate('items', newItems);
                            }}
                            className={`${inputClass} py-2 text-center`}
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] text-muted-foreground">Our ₹</label>
                          <input
                            type="number"
                            value={item.ours || 0}
                            onChange={(e) => {
                              const newItems = [...(content.items || [])];
                              newItems[index] = { ...newItems[index], ours: Number(e.target.value) };
                              handleUpdate('items', newItems);
                            }}
                            className={`${inputClass} py-2 text-center`}
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] text-muted-foreground">Savings</label>
                          <div className="flex items-center justify-center h-[42px]">
                            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-green-100 text-green-700 text-xs font-medium">
                              <TrendingDown className="w-3 h-3" />
                              {calculateSavings(item.market, item.ours)}%
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Desktop Layout */}
                    <div className="hidden sm:grid grid-cols-12 gap-2 items-center">
                      <div className="col-span-4">
                        <input
                          type="text"
                          value={item.service || ''}
                          onChange={(e) => {
                            const newItems = [...(content.items || [])];
                            newItems[index] = { ...newItems[index], service: e.target.value };
                            handleUpdate('items', newItems);
                          }}
                          placeholder="Service name"
                          className={`${inputClass} py-2`}
                        />
                      </div>

                      <div className="col-span-2">
                        <input
                          type="number"
                          value={item.market || 0}
                          onChange={(e) => {
                            const newItems = [...(content.items || [])];
                            newItems[index] = { ...newItems[index], market: Number(e.target.value) };
                            handleUpdate('items', newItems);
                          }}
                          className={`${inputClass} py-2 text-center`}
                        />
                      </div>

                      <div className="col-span-2">
                        <input
                          type="number"
                          value={item.ours || 0}
                          onChange={(e) => {
                            const newItems = [...(content.items || [])];
                            newItems[index] = { ...newItems[index], ours: Number(e.target.value) };
                            handleUpdate('items', newItems);
                          }}
                          className={`${inputClass} py-2 text-center`}
                        />
                      </div>

                      <div className="col-span-2 text-center">
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-green-100 text-green-700 text-sm font-medium">
                          <TrendingDown className="w-3 h-3" />
                          {calculateSavings(item.market, item.ours)}%
                        </span>
                      </div>

                      <div className="col-span-2 flex justify-center gap-1">
                        <button
                          onClick={() => {
                            const newItems = content.items?.filter((_: unknown, i: number) => i !== index);
                            handleUpdate('items', newItems);
                          }}
                          className="p-2 rounded-lg text-destructive hover:bg-destructive/10"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
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

                {/* Total Savings Preview */}
                {content.items && content.items.length > 0 && (
                  <div className="p-3 sm:p-4 rounded-xl bg-green-500/10 border border-green-500/20">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs sm:text-sm text-green-700 dark:text-green-400">
                          Total Potential Savings
                        </p>
                        <p className="text-xl sm:text-2xl font-bold text-green-800 dark:text-green-300">
                          ₹{content.items.reduce((acc: number, item: { market: number; ours: number }) => acc + (item.market - item.ours), 0).toLocaleString()}
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