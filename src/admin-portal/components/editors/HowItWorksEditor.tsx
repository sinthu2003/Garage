import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Layers,
  Type,
  ChevronRight,
  ChevronDown,
  Plus,
  Trash2,
  GripVertical,
  Palette,
  MapPin,
  Calendar,
  Wrench,
  CheckCircle,
  Play,
  Hash,
} from 'lucide-react';
import { useHowItWorksContent } from '../../hooks/useContentHooks';
import { useContent } from '../../context/ContentContext';
import { ImageUpload } from '../shared/ImageUpload';
import type { HowItWorksStep } from '../../types/content.types';

interface HowItWorksEditorProps {
  isDarkMode: boolean;
}

// Icon options for steps
const iconOptions = [
  { value: 'MapPin', label: 'Location', icon: MapPin },
  { value: 'Calendar', label: 'Calendar', icon: Calendar },
  { value: 'Wrench', label: 'Wrench', icon: Wrench },
  { value: 'CheckCircle', label: 'Check', icon: CheckCircle },
  { value: 'Play', label: 'Play', icon: Play },
  { value: 'Layers', label: 'Layers', icon: Layers },
];

export const HowItWorksEditor: React.FC<HowItWorksEditorProps> = ({ }) => {
  const { updateField } = useContent();
  const content = useHowItWorksContent();
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(['header', 'steps'])
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
    updateField('howItWorks', path, value);
  };

  // Theme-aware styling helpers using CSS variables
  const inputClass = `w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl text-sm transition-all bg-background border-border text-foreground placeholder-muted-foreground focus:border-primary border focus:outline-none focus:ring-2 focus:ring-primary/20`;

  const labelClass = `text-sm font-medium text-muted-foreground`;

  const sectionClass = `rounded-xl border overflow-hidden border-border bg-card`;

  const sectionHeaderClass = `w-full flex items-center justify-between p-3 sm:p-4 text-left transition-colors hover:bg-secondary/50`;

  const addNewStep = () => {
    const newStep: HowItWorksStep = {
      number: '01',
      icon: 'CheckCircle',
      title: 'New Step',
      description: 'Step description goes here...',
      color: '#3B82F6',
      image: '',
    };
    // Add at the beginning and renumber all steps
    const existingSteps = content.steps || [];
    const updatedSteps = [newStep, ...existingSteps].map((step, index) => ({
      ...step,
      number: (index + 1).toString().padStart(2, '0'),
    }));
    handleUpdate('steps', updatedSteps);
    // Auto-expand the newly added step (now at index 0)
    setExpandedItems(new Set([0]));
  };

  // Get icon component by name

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
                    placeholder="How It Works"
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
                      placeholder="Car service in"
                      className={inputClass}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className={labelClass}>Highlighted Text</label>
                    <input
                      type="text"
                      value={content.headline?.highlight || ''}
                      onChange={(e) => handleUpdate('headline.highlight', e.target.value)}
                      placeholder="4 simple steps."
                      className={inputClass}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className={labelClass}>Description</label>
                  <textarea
                    value={content.description || ''}
                    onChange={(e) => handleUpdate('description', e.target.value)}
                    placeholder="We've simplified car maintenance so you can focus on what matters most."
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
                    placeholder="Book Your Service Now"
                    className={inputClass}
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Steps */}
      <div className={sectionClass}>
        <div 
          onClick={() => toggleSection('steps')} 
          onKeyDown={(e) => e.key === 'Enter' && toggleSection('steps')}
          role="button"
          tabIndex={0}
          className={`${sectionHeaderClass} cursor-pointer`}
        >
          <div className="flex items-center gap-2 sm:gap-3">
            <motion.div animate={{ rotate: expandedSections.has('steps') ? 90 : 0 }}>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </motion.div>
            <Layers className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-500" />
            <span className="font-medium text-foreground text-sm sm:text-base">Process Steps</span>
            <span className="px-2 py-0.5 rounded-full text-xs bg-secondary text-muted-foreground">
              {content.steps?.length || 0}
            </span>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              addNewStep();
            }}
            className="p-2 rounded-lg bg-secondary hover:bg-secondary/80 text-foreground"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        <AnimatePresence>
          {expandedSections.has('steps') && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="p-3 sm:p-4 pt-0 space-y-3 sm:space-y-4 border-t border-border">
                {content.steps?.map((step: HowItWorksStep, index: number) => {
                  return (
                    <div
                      key={index}
                      className="rounded-xl border overflow-hidden border-border bg-card"
                    >
                      {/* Step Header */}
                      <div
                        onClick={() => toggleItem(index)}
                        onKeyDown={(e) => e.key === 'Enter' && toggleItem(index)}
                        role="button"
                        tabIndex={0}
                        className="w-full flex items-center justify-between p-3 sm:p-4 text-left hover:bg-secondary/50 cursor-pointer"
                      >
                        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                          <GripVertical className="w-4 h-4 cursor-grab text-muted-foreground hidden sm:block" />
                          {/* Image thumbnail or step number */}
                          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg overflow-hidden bg-secondary flex-shrink-0 flex items-center justify-center border border-border">
                            {step.image ? (
                              <img
                                src={step.image.startsWith('http') || step.image.startsWith('data:') ? step.image : `${step.image}`}
                                alt={step.title || ''}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).style.display = 'none';
                                }}
                              />
                            ) : (
                              <div
                                className="w-full h-full flex items-center justify-center text-white font-bold text-sm"
                                style={{ backgroundColor: step.color?.startsWith('#') ? step.color : '#3B82F6' }}
                              >
                                {step.number || (index + 1).toString().padStart(2, '0')}
                              </div>
                            )}
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <span
                                className="px-2 py-0.5 rounded text-xs font-bold text-white"
                                style={{ backgroundColor: step.color?.startsWith('#') ? step.color : '#3B82F6' }}
                              >
                                {step.number || (index + 1).toString().padStart(2, '0')}
                              </span>
                              <span className="font-medium text-foreground text-sm sm:text-base truncate">
                                {step.title || 'New Step'}
                              </span>
                            </div>
                            <span className="text-xs text-muted-foreground truncate block mt-0.5">
                              {step.description?.slice(0, 40) || 'No description'}...
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              const newSteps = content.steps?.filter((_: HowItWorksStep, i: number) => i !== index);
                              // Renumber remaining steps
                              const renumbered = newSteps?.map((s: HowItWorksStep, idx: number) => ({
                                ...s,
                                number: (idx + 1).toString().padStart(2, '0'),
                              }));
                              handleUpdate('steps', renumbered);
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

                      {/* Step Details */}
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
                                  <label className={labelClass}>
                                    <Hash className="w-4 h-4 inline mr-1" />
                                    Step Number
                                  </label>
                                  <input
                                    type="text"
                                    value={step.number || ''}
                                    onChange={(e) => {
                                      const newSteps = [...(content.steps || [])];
                                      newSteps[index] = { ...newSteps[index], number: e.target.value };
                                      handleUpdate('steps', newSteps);
                                    }}
                                    placeholder="01"
                                    className={inputClass}
                                  />
                                </div>

                                <div className="space-y-2">
                                  <label className={labelClass}>Icon</label>
                                  <select
                                    value={step.icon || 'CheckCircle'}
                                    onChange={(e) => {
                                      const newSteps = [...(content.steps || [])];
                                      newSteps[index] = { ...newSteps[index], icon: e.target.value };
                                      handleUpdate('steps', newSteps);
                                    }}
                                    className={inputClass}
                                  >
                                    {iconOptions.map(opt => (
                                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                                    ))}
                                  </select>
                                </div>
                              </div>

                              <div className="space-y-2">
                                <label className={labelClass}>Title</label>
                                <input
                                  type="text"
                                  value={step.title || ''}
                                  onChange={(e) => {
                                    const newSteps = [...(content.steps || [])];
                                    newSteps[index] = { ...newSteps[index], title: e.target.value };
                                    handleUpdate('steps', newSteps);
                                  }}
                                  placeholder="Select Location"
                                  className={inputClass}
                                />
                              </div>

                              <div className="space-y-2">
                                <label className={labelClass}>Description</label>
                                <textarea
                                  value={step.description || ''}
                                  onChange={(e) => {
                                    const newSteps = [...(content.steps || [])];
                                    newSteps[index] = { ...newSteps[index], description: e.target.value };
                                    handleUpdate('steps', newSteps);
                                  }}
                                  placeholder="Choose your city and preferred service location..."
                                  rows={2}
                                  className={inputClass}
                                />
                              </div>

                              {/* Color */}
                              <div className="space-y-2">
                                <label className={labelClass}>
                                  <Palette className="w-4 h-4 inline mr-1" />
                                  Step Color
                                </label>
                                <div className="flex items-center gap-2">
                                  <input
                                    type="color"
                                    value={step.color?.startsWith('#') ? step.color : '#3B82F6'}
                                    onChange={(e) => {
                                      const newSteps = [...(content.steps || [])];
                                      newSteps[index] = { ...newSteps[index], color: e.target.value };
                                      handleUpdate('steps', newSteps);
                                    }}
                                    className="w-10 h-10 rounded-lg cursor-pointer border-0"
                                  />
                                  <input
                                    type="text"
                                    value={step.color || '#3B82F6'}
                                    onChange={(e) => {
                                      const newSteps = [...(content.steps || [])];
                                      newSteps[index] = { ...newSteps[index], color: e.target.value };
                                      handleUpdate('steps', newSteps);
                                    }}
                                    placeholder="#3B82F6"
                                    className={`flex-1 ${inputClass}`}
                                  />
                                </div>
                              </div>

                              {/* Step Image */}
                              <ImageUpload
                                value={step.image || ''}
                                onChange={(url) => {
                                  const newSteps = [...(content.steps || [])];
                                  newSteps[index] = { ...newSteps[index], image: url };
                                  handleUpdate('steps', newSteps);
                                }}
                                label="Step Image"
                                placeholder="Upload image or enter URL"
                                previewHeight="h-48"
                                maxSizeMB={2}
                                maxWidthOrHeight={1920}
                                helperText="Image illustrating this step"
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

                {(!content.steps || content.steps.length === 0) && (
                  <div className="text-center py-6 sm:py-8 text-muted-foreground">
                    <Layers className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No steps added yet</p>
                    <button onClick={addNewStep} className="mt-2 text-primary text-sm font-medium">
                      + Add your first step
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

export default HowItWorksEditor;