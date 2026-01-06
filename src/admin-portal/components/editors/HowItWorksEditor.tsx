import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Layers,
  Type,
  Image,
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
  const inputClass = `w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl text-sm transition-all bg-secondary border-border text-foreground placeholder-muted-foreground focus:border-primary border focus:outline-none focus:ring-2 focus:ring-primary/20`;

  const labelClass = `text-sm font-medium text-muted-foreground`;

  const sectionClass = `rounded-xl border overflow-hidden border-border bg-card`;

  const sectionHeaderClass = `w-full flex items-center justify-between p-3 sm:p-4 text-left transition-colors hover:bg-secondary/50`;

  const addNewStep = () => {
    const stepNumber = (content.steps?.length || 0) + 1;
    const newStep: HowItWorksStep = {
      number: stepNumber.toString().padStart(2, '0'),
      icon: 'CheckCircle',
      title: 'New Step',
      description: 'Step description goes here...',
      color: '#3B82F6',
      image: '',
    };
    handleUpdate('steps', [...(content.steps || []), newStep]);
  };

  // Get icon component by name
  const getIconComponent = (iconName: string) => {
    const iconOption = iconOptions.find(opt => opt.value === iconName);
    return iconOption?.icon || CheckCircle;
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 pb-4 border-b border-border">
        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center flex-shrink-0">
          <Layers className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
        </div>
        <div className="min-w-0">
          <h2 className="text-lg sm:text-xl font-bold text-foreground truncate">
            How It Works Editor
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Process steps with icons and descriptions
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

                {/* Preview */}
                <div className="p-3 sm:p-4 rounded-xl bg-secondary">
                  <p className="text-xs uppercase tracking-wider mb-2 text-muted-foreground">
                    Preview
                  </p>
                  <div className="inline-block px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-medium mb-2">
                    {content.badge || 'How It Works'}
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-foreground">
                    {content.headline?.line1 || 'Car service in'}
                    {' '}
                    <span className="text-primary">{content.headline?.highlight || '4 simple steps.'}</span>
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

      {/* Process Steps */}
      <div className={sectionClass}>
        <button onClick={() => toggleSection('steps')} className={sectionHeaderClass}>
          <div className="flex items-center gap-2 sm:gap-3">
            <motion.div animate={{ rotate: expandedSections.has('steps') ? 90 : 0 }}>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </motion.div>
            <Hash className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-500" />
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
        </button>

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
                  const IconComponent = getIconComponent(step.icon);

                  return (
                    <div
                      key={index}
                      className="rounded-xl border overflow-hidden border-border bg-card"
                    >
                      {/* Step Header */}
                      <button
                        onClick={() => toggleItem(index)}
                        className="w-full flex items-center justify-between p-3 sm:p-4 text-left hover:bg-secondary/50"
                      >
                        <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                          <GripVertical className="w-4 h-4 cursor-grab text-muted-foreground hidden sm:block" />
                          <div
                            className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center text-white font-bold text-xs sm:text-sm flex-shrink-0"
                            style={{ backgroundColor: step.color || '#3B82F6' }}
                          >
                            {step.number || (index + 1).toString().padStart(2, '0')}
                          </div>
                          <div className="min-w-0">
                            <p className="font-medium text-foreground text-sm sm:text-base truncate">
                              {step.title || 'Step Title'}
                            </p>
                            <p className="text-xs sm:text-sm text-muted-foreground">
                              Step {index + 1}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              const newSteps = content.steps?.filter((_: HowItWorksStep, i: number) => i !== index);
                              handleUpdate('steps', newSteps);
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

                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                                <div className="space-y-2">
                                  <label className={labelClass}>
                                    <Palette className="w-4 h-4 inline mr-1" />
                                    Color
                                  </label>
                                  <div className="flex items-center gap-2">
                                    <input
                                      type="color"
                                      value={step.color || '#3B82F6'}
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
                                      className={`flex-1 ${inputClass}`}
                                    />
                                  </div>
                                </div>

                                <div className="space-y-2">
                                  <label className={labelClass}>
                                    <Image className="w-4 h-4 inline mr-1" />
                                    Image
                                  </label>
                                  <input
                                    type="text"
                                    value={step.image || ''}
                                    onChange={(e) => {
                                      const newSteps = [...(content.steps || [])];
                                      newSteps[index] = { ...newSteps[index], image: e.target.value };
                                      handleUpdate('steps', newSteps);
                                    }}
                                    placeholder="SelectLocation.jpg"
                                    className={inputClass}
                                  />
                                </div>
                              </div>

                              {/* Preview Card */}
                              <div className="p-3 sm:p-4 rounded-xl bg-secondary">
                                <p className="text-xs uppercase tracking-wider mb-3 text-muted-foreground">
                                  Preview
                                </p>
                                <div className="flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-4">
                                  <div
                                    className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center text-white font-bold flex-shrink-0"
                                    style={{ backgroundColor: step.color || '#3B82F6' }}
                                  >
                                    {step.number || (index + 1).toString().padStart(2, '0')}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                      <IconComponent className="w-4 h-4 sm:w-5 sm:h-5" style={{ color: step.color }} />
                                      <h4 className="font-bold text-foreground text-sm sm:text-base truncate">
                                        {step.title || 'Step Title'}
                                      </h4>
                                    </div>
                                    <p className="text-xs sm:text-sm text-muted-foreground">
                                      {step.description || 'Step description...'}
                                    </p>
                                  </div>
                                  {step.image && (
                                    <img
                                      src={step.image.startsWith('http') ? step.image : `/assets/${step.image}`}
                                      alt={step.title}
                                      className="w-full sm:w-20 h-16 rounded-lg object-cover"
                                      onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                                    />
                                  )}
                                </div>
                              </div>
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

                {/* Timeline Preview */}
                {content.steps && content.steps.length > 0 && (
                  <div className="p-3 sm:p-4 rounded-xl bg-secondary">
                    <p className="text-xs uppercase tracking-wider mb-4 text-muted-foreground">
                      Timeline Preview
                    </p>
                    <div className="flex items-center justify-between overflow-x-auto pb-2 -mx-1 px-1">
                      {content.steps.map((step: HowItWorksStep, i: number) => (
                        <React.Fragment key={i}>
                          <div className="flex flex-col items-center flex-shrink-0">
                            <div
                              className="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-white text-xs sm:text-sm font-bold"
                              style={{ backgroundColor: step.color }}
                            >
                              {step.number}
                            </div>
                            <p className="text-[10px] sm:text-xs mt-1 text-center max-w-[60px] sm:max-w-[80px] truncate text-muted-foreground">
                              {step.title}
                            </p>
                          </div>
                          {i < (content.steps?.length || 0) - 1 && (
                            <div className="flex-1 h-0.5 mx-1 sm:mx-2 bg-border min-w-[20px]" />
                          )}
                        </React.Fragment>
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

export default HowItWorksEditor;