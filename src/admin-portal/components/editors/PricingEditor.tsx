import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  DollarSign,
  Type,
  ChevronRight,
  Plus,
  Trash2,
  Percent,
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
  const inputClass = `w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl text-sm transition-all bg-background border-border text-foreground placeholder-muted-foreground focus:border-primary border focus:outline-none focus:ring-2 focus:ring-primary/20`;

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
        <button onClick={() => toggleSection('items')} className={sectionHeaderClass}>
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
                {/* Table Header - Desktop Only */}
                <div className="hidden sm:grid grid-cols-12 gap-2 text-xs font-medium text-muted-foreground px-2">
                  <div className="col-span-4">Service</div>
                  <div className="col-span-2 text-center">Market ₹</div>
                  <div className="col-span-2 text-center">Our ₹</div>
                  <div className="col-span-2 text-center">Savings</div>
                  <div className="col-span-2 text-center">Actions</div>
                </div>

                {content.items?.map((item: { service: string; market: number; ours: number; image?: string }, index: number) => (
                  <div key={index} className="rounded-xl bg-secondary/50 p-3 sm:p-4">
                    {/* Mobile Layout */}
                    <div className="sm:hidden space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-foreground">Item #{index + 1}</span>
                        <button
                          onClick={() => {
                            const newItems = content.items?.filter((_: unknown, i: number) => i !== index);
                            handleUpdate('items', newItems);
                          }}
                          className="p-1.5 rounded-lg text-destructive hover:bg-destructive/10"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] text-muted-foreground">Service Name</label>
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
                      <div className="grid grid-cols-3 gap-2">
                        <div className="space-y-1">
                          <label className="text-[10px] text-muted-foreground">Market ₹</label>
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
                            className={`${inputClass} py-2 text-center`}
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] text-muted-foreground">Our ₹</label>
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
    type="text"
    inputMode="numeric"
    value={
      item.market !== undefined && item.market !== null
        ? String(item.market)
        : ''
    }
    onChange={(e) => {
      const newItems = [...(content.items || [])];
      const numValue = e.target.value === '' ? 0 : Number(e.target.value);
      newItems[index] = {
        ...newItems[index],
        market: numValue,
      };
      handleUpdate('items', newItems);
    }}
    placeholder="0"
    className={`${inputClass} py-2 text-center`}
  />
</div>


                      <div className="col-span-2">
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

                {/* Total Savings Summary */}
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