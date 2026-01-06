import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  SplitSquareHorizontal,
  Type,
  Image,
  ChevronRight,
  ChevronDown,
  Plus,
  Trash2,
  GripVertical,
  Clock,
  IndianRupee,
  Car,
} from 'lucide-react';
import { useBeforeAfterContent } from '../../hooks/useContentHooks';
import { useContent } from '../../context/ContentContext';
import type { BeforeAfterItem } from '../../types/content.types';

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
  const inputClass = `w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl text-sm transition-all bg-secondary border-border text-foreground placeholder-muted-foreground focus:border-primary border focus:outline-none focus:ring-2 focus:ring-primary/20`;

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
    handleUpdate('items', [...(content.items || []), newItem]);
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 pb-4 border-b border-border">
        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center flex-shrink-0">
          <SplitSquareHorizontal className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
        </div>
        <div className="min-w-0">
          <h2 className="text-lg sm:text-xl font-bold text-foreground truncate">
            Before & After Editor
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Transformation showcases with comparison slider
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
                    <label className={labelClass}>CTA Button Text</label>
                    <input
                      type="text"
                      value={content.cta || ''}
                      onChange={(e) => handleUpdate('cta', e.target.value)}
                      placeholder="Get Your Car Transformed"
                      className={inputClass}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className={labelClass}>Select Label</label>
                    <input
                      type="text"
                      value={content.selectLabel || ''}
                      onChange={(e) => handleUpdate('selectLabel', e.target.value)}
                      placeholder="Select Transformation"
                      className={inputClass}
                    />
                  </div>
                </div>

                {/* Preview */}
                <div className="p-3 sm:p-4 rounded-xl bg-secondary">
                  <p className="text-xs uppercase tracking-wider mb-2 text-muted-foreground">
                    Preview
                  </p>
                  <div className="inline-block px-3 py-1 rounded-full bg-violet-100 text-violet-700 text-xs font-medium mb-2">
                    {content.badge || 'Transformations'}
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-foreground">
                    {content.headline?.text || 'Before & After'}
                    {' '}
                    <span className="text-primary">{content.headline?.highlight || 'magic'}</span>
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {content.description}
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Transformation Items */}
      <div className={sectionClass}>
        <button onClick={() => toggleSection('items')} className={sectionHeaderClass}>
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
          <button
            onClick={(e) => {
              e.stopPropagation();
              addNewTransformation();
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
                {content.items?.map((item: BeforeAfterItem, index: number) => (
                  <div
                    key={item.id || index}
                    className="rounded-xl border overflow-hidden border-border bg-card"
                  >
                    {/* Item Header */}
                    <button
                      onClick={() => toggleItem(index)}
                      className="w-full flex items-center justify-between p-3 sm:p-4 text-left hover:bg-secondary/50"
                    >
                      <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                        <GripVertical className="w-4 h-4 cursor-grab text-muted-foreground hidden sm:block" />
                        <div className="flex items-center gap-2 min-w-0 flex-1">
                          {item.afterImage && (
                            <img
                              src={item.afterImage.startsWith('http') ? item.afterImage : `/assets/${item.afterImage}`}
                              alt={item.title}
                              className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg object-cover flex-shrink-0"
                              onError={(e) => { (e.target as HTMLImageElement).src = 'https://via.placeholder.com/48'; }}
                            />
                          )}
                          <div className="min-w-0">
                            <p className="font-medium text-foreground text-sm sm:text-base truncate">
                              {item.title || 'Transformation'}
                            </p>
                            <p className="text-xs sm:text-sm text-muted-foreground truncate">
                              {item.car} • {item.time}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
                        <span className="hidden sm:inline px-2 py-1 rounded-full bg-green-100 text-green-700 text-xs font-medium">
                          {item.savings}
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            const newItems = content.items?.filter((_: BeforeAfterItem, i: number) => i !== index);
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

                    {/* Item Details */}
                    <AnimatePresence>
                      {expandedItems.has(index) && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="p-3 sm:p-4 pt-0 space-y-3 sm:space-y-4 border-t border-border">
                            {/* Basic Info */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                              <div className="space-y-2">
                                <label className={labelClass}>Title</label>
                                <input
                                  type="text"
                                  value={item.title || ''}
                                  onChange={(e) => {
                                    const newItems = [...(content.items || [])];
                                    newItems[index] = { ...newItems[index], title: e.target.value };
                                    handleUpdate('items', newItems);
                                  }}
                                  placeholder="Denting & Painting"
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
                                  onChange={(e) => {
                                    const newItems = [...(content.items || [])];
                                    newItems[index] = { ...newItems[index], car: e.target.value };
                                    handleUpdate('items', newItems);
                                  }}
                                  placeholder="Hyundai Creta"
                                  className={inputClass}
                                />
                              </div>
                            </div>

                            <div className="space-y-2">
                              <label className={labelClass}>Description</label>
                              <textarea
                                value={item.description || ''}
                                onChange={(e) => {
                                  const newItems = [...(content.items || [])];
                                  newItems[index] = { ...newItems[index], description: e.target.value };
                                  handleUpdate('items', newItems);
                                }}
                                placeholder="Complete bumper repair and full body paint restoration..."
                                rows={2}
                                className={inputClass}
                              />
                            </div>

                            {/* Images */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                              <div className="space-y-2">
                                <label className={labelClass}>
                                  <Image className="w-4 h-4 inline mr-1" />
                                  Before Image
                                </label>
                                <input
                                  type="text"
                                  value={item.beforeImage || ''}
                                  onChange={(e) => {
                                    const newItems = [...(content.items || [])];
                                    newItems[index] = { ...newItems[index], beforeImage: e.target.value };
                                    handleUpdate('items', newItems);
                                  }}
                                  placeholder="hyundai-creta-before.png"
                                  className={inputClass}
                                />
                                {item.beforeImage && (
                                  <img
                                    src={item.beforeImage.startsWith('http') ? item.beforeImage : `/assets/${item.beforeImage}`}
                                    alt="Before"
                                    className="w-full h-20 sm:h-24 rounded-lg object-cover mt-2"
                                    onError={(e) => { (e.target as HTMLImageElement).src = 'https://via.placeholder.com/200x100?text=Before'; }}
                                  />
                                )}
                              </div>

                              <div className="space-y-2">
                                <label className={labelClass}>
                                  <Image className="w-4 h-4 inline mr-1" />
                                  After Image
                                </label>
                                <input
                                  type="text"
                                  value={item.afterImage || ''}
                                  onChange={(e) => {
                                    const newItems = [...(content.items || [])];
                                    newItems[index] = { ...newItems[index], afterImage: e.target.value };
                                    handleUpdate('items', newItems);
                                  }}
                                  placeholder="hyundai-creta-after.png"
                                  className={inputClass}
                                />
                                {item.afterImage && (
                                  <img
                                    src={item.afterImage.startsWith('http') ? item.afterImage : `/assets/${item.afterImage}`}
                                    alt="After"
                                    className="w-full h-20 sm:h-24 rounded-lg object-cover mt-2"
                                    onError={(e) => { (e.target as HTMLImageElement).src = 'https://via.placeholder.com/200x100?text=After'; }}
                                  />
                                )}
                              </div>
                            </div>

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
                                  onChange={(e) => {
                                    const newItems = [...(content.items || [])];
                                    newItems[index] = { ...newItems[index], time: e.target.value };
                                    handleUpdate('items', newItems);
                                  }}
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
                                  onChange={(e) => {
                                    const newItems = [...(content.items || [])];
                                    newItems[index] = { ...newItems[index], savings: e.target.value };
                                    handleUpdate('items', newItems);
                                  }}
                                  placeholder="₹8,000"
                                  className={inputClass}
                                />
                              </div>
                            </div>

                            {/* Preview Card */}
                            <div className="p-3 sm:p-4 rounded-xl bg-secondary">
                              <p className="text-xs uppercase tracking-wider mb-3 text-muted-foreground">
                                Comparison Preview
                              </p>
                              <div className="grid grid-cols-2 gap-2 sm:gap-4">
                                <div className="relative">
                                  <span className="absolute top-1 left-1 sm:top-2 sm:left-2 px-1.5 sm:px-2 py-0.5 rounded-full bg-red-500 text-white text-[10px] sm:text-xs">Before</span>
                                  {item.beforeImage ? (
                                    <img
                                      src={item.beforeImage.startsWith('http') ? item.beforeImage : `/assets/${item.beforeImage}`}
                                      alt="Before"
                                      className="w-full h-24 sm:h-32 rounded-lg object-cover"
                                      onError={(e) => { (e.target as HTMLImageElement).src = 'https://via.placeholder.com/200x128?text=Before'; }}
                                    />
                                  ) : (
                                    <div className="w-full h-24 sm:h-32 rounded-lg flex items-center justify-center bg-muted">
                                      <Image className="w-6 h-6 sm:w-8 sm:h-8 opacity-30" />
                                    </div>
                                  )}
                                </div>
                                <div className="relative">
                                  <span className="absolute top-1 left-1 sm:top-2 sm:left-2 px-1.5 sm:px-2 py-0.5 rounded-full bg-green-500 text-white text-[10px] sm:text-xs">After</span>
                                  {item.afterImage ? (
                                    <img
                                      src={item.afterImage.startsWith('http') ? item.afterImage : `/assets/${item.afterImage}`}
                                      alt="After"
                                      className="w-full h-24 sm:h-32 rounded-lg object-cover"
                                      onError={(e) => { (e.target as HTMLImageElement).src = 'https://via.placeholder.com/200x128?text=After'; }}
                                    />
                                  ) : (
                                    <div className="w-full h-24 sm:h-32 rounded-lg flex items-center justify-center bg-muted">
                                      <Image className="w-6 h-6 sm:w-8 sm:h-8 opacity-30" />
                                    </div>
                                  )}
                                </div>
                              </div>
                              <div className="mt-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                                <div className="min-w-0">
                                  <p className="font-medium text-foreground text-sm sm:text-base truncate">
                                    {item.title} - {item.car}
                                  </p>
                                  <p className="text-xs sm:text-sm text-muted-foreground truncate">
                                    {item.description?.substring(0, 50)}...
                                  </p>
                                </div>
                                <div className="text-left sm:text-right flex-shrink-0">
                                  <p className="text-xs text-muted-foreground">
                                    <Clock className="w-3 h-3 inline mr-1" />{item.time}
                                  </p>
                                  <p className="text-green-500 font-bold text-sm sm:text-base">{item.savings}</p>
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
                    <SplitSquareHorizontal className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No transformations added yet</p>
                    <button onClick={addNewTransformation} className="mt-2 text-primary text-sm font-medium">
                      + Add your first transformation
                    </button>
                  </div>
                )}

                {/* Thumbnails Preview */}
                {content.items && content.items.length > 0 && (
                  <div className="p-3 sm:p-4 rounded-xl bg-secondary">
                    <p className="text-xs uppercase tracking-wider mb-3 text-muted-foreground">
                      Selector Preview
                    </p>
                    <div className="flex gap-2 sm:gap-3 overflow-x-auto pb-2 -mx-1 px-1">
                      {content.items.map((item: BeforeAfterItem, i: number) => (
                        <div
                          key={i}
                          className={`flex-shrink-0 w-20 sm:w-24 rounded-lg overflow-hidden border-2 ${
                            i === 0 ? 'border-primary' : 'border-border'
                          }`}
                        >
                          {item.afterImage ? (
                            <img
                              src={item.afterImage.startsWith('http') ? item.afterImage : `/assets/${item.afterImage}`}
                              alt={item.title}
                              className="w-full h-12 sm:h-16 object-cover"
                              onError={(e) => { (e.target as HTMLImageElement).src = 'https://via.placeholder.com/96x64'; }}
                            />
                          ) : (
                            <div className="w-full h-12 sm:h-16 flex items-center justify-center bg-muted">
                              <Image className="w-5 h-5 sm:w-6 sm:h-6 opacity-30" />
                            </div>
                          )}
                          <p className="text-[10px] sm:text-xs p-1 text-center truncate bg-card text-muted-foreground">
                            {item.title}
                          </p>
                        </div>
                      ))}
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

export default BeforeAfterEditor;