import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users,
  Type,
  Shield,
  Award,
  Car,
  Sparkles,
  ChevronRight,
  Trash2,
  Hash,
  Star,
} from 'lucide-react';
import { usePartnersContent } from '../../hooks/useContentHooks';
import { useContent } from '../../context/ContentContext';
import type { PartnerTrustBadge } from '../../types/content.types';
import { SectionLoader } from '../shared/SectionLoader';

interface PartnersEditorProps {
  isDarkMode: boolean;
}

// Icon options for trust badges
const iconOptions = [
  { value: 'Shield', label: 'Shield', icon: Shield },
  { value: 'Award', label: 'Award', icon: Award },
  { value: 'Car', label: 'Car', icon: Car },
  { value: 'Sparkles', label: 'Sparkles', icon: Sparkles },
  { value: 'Star', label: 'Star', icon: Star },
  { value: 'Users', label: 'Users', icon: Users },
];

export const PartnersEditor: React.FC<PartnersEditorProps> = ({ }) => {
  const { updateField } = useContent();
  const content = usePartnersContent();
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(['header', 'trustBadges'])
  );

  // [LAZY LOADING] Show loading state - MUST be after all hooks
  if (content.isLoading) {
    return <SectionLoader section="Partners" />;
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

  const handleUpdate = (path: string, value: unknown) => {
    updateField('partners', path, value);
  };

  // Theme-aware styling helpers using CSS variables
  const inputClass = `w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl text-sm transition-all bg-secondary border-border text-foreground placeholder-muted-foreground focus:border-primary border focus:outline-none focus:ring-2 focus:ring-primary/20`;

  const labelClass = `text-sm font-medium text-muted-foreground`;

  const sectionClass = `rounded-xl border overflow-hidden border-border bg-card`;

  const sectionHeaderClass = `w-full flex items-center justify-between p-3 sm:p-4 text-left transition-colors hover:bg-secondary/50`;

  // Get icon component by name
  const getIconComponent = (iconName: string) => {
    const iconOption = iconOptions.find(opt => opt.value === iconName);
    return iconOption?.icon || Shield;
  };

  return (
    <div className="space-y-4 sm:space-y-6 w-full">
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
                    placeholder="Trusted Partners"
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
                      placeholder="We service"
                      className={inputClass}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className={labelClass}>Highlighted Text</label>
                    <input
                      type="text"
                      value={content.headline?.highlight || ''}
                      onChange={(e) => handleUpdate('headline.highlight', e.target.value)}
                      placeholder="all major brands"
                      className={inputClass}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className={labelClass}>Description</label>
                  <textarea
                    value={content.description || ''}
                    onChange={(e) => handleUpdate('description', e.target.value)}
                    placeholder="Expert mechanics trained for all car makes and models..."
                    rows={2}
                    className={inputClass}
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Brand Count */}
      <div className={sectionClass}>
        <button onClick={() => toggleSection('brandCount')} className={sectionHeaderClass}>
          <div className="flex items-center gap-2 sm:gap-3">
            <motion.div animate={{ rotate: expandedSections.has('brandCount') ? 90 : 0 }}>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </motion.div>
            <Hash className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-500" />
            <span className="font-medium text-foreground text-sm sm:text-base">Brand Count Display</span>
          </div>
        </button>

        <AnimatePresence>
          {expandedSections.has('brandCount') && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="p-3 sm:p-4 pt-0 space-y-3 sm:space-y-4 border-t border-border">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div className="space-y-2">
                    <label className={labelClass}>Brand Count</label>
                    <input
                      type="text"
                      value={content.brandCount || ''}
                      onChange={(e) => handleUpdate('brandCount', e.target.value)}
                      placeholder="35+"
                      className={inputClass}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className={labelClass}>Label</label>
                    <input
                      type="text"
                      value={content.brandCountLabel || ''}
                      onChange={(e) => handleUpdate('brandCountLabel', e.target.value)}
                      placeholder="Car Brands Serviced"
                      className={inputClass}
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Trust Badges */}
      <div className={sectionClass}>
        <div 
          onClick={() => toggleSection('trustBadges')} 
          onKeyDown={(e) => e.key === 'Enter' && toggleSection('trustBadges')}
          role="button"
          tabIndex={0}
          className={`${sectionHeaderClass} cursor-pointer`}
        >
          <div className="flex items-center gap-2 sm:gap-3">
            <motion.div animate={{ rotate: expandedSections.has('trustBadges') ? 90 : 0 }}>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </motion.div>
            <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-purple-500" />
            <span className="font-medium text-foreground text-sm sm:text-base">Trust Badges</span>
            <span className="px-2 py-0.5 rounded-full text-xs bg-secondary text-muted-foreground">
              {content.trustBadges?.length || 0}
            </span>
          </div>
        </div>

        <AnimatePresence>
          {expandedSections.has('trustBadges') && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="p-3 sm:p-4 pt-0 space-y-3 sm:space-y-4 border-t border-border">
                {content.trustBadges?.map((badge: PartnerTrustBadge, index: number) => {
                  const IconComponent = getIconComponent(badge.icon);

                  return (
                    <div
                      key={index}
                      className="p-3 sm:p-4 rounded-xl border border-border bg-card"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <IconComponent className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                          <span className="font-medium text-foreground text-sm sm:text-base">
                            Badge #{index + 1}
                          </span>
                        </div>
                        <button
                          onClick={() => {
                            const newBadges = content.trustBadges?.filter((_: PartnerTrustBadge, i: number) => i !== index);
                            handleUpdate('trustBadges', newBadges);
                          }}
                          className="p-1.5 sm:p-2 rounded-lg text-destructive hover:bg-destructive/10"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3">
                        <div className="space-y-1">
                          <label className="text-xs text-muted-foreground">Icon</label>
                          <select
                            value={badge.icon || 'Shield'}
                            onChange={(e) => {
                              const newBadges = [...(content.trustBadges || [])];
                              newBadges[index] = { ...newBadges[index], icon: e.target.value };
                              handleUpdate('trustBadges', newBadges);
                            }}
                            className={inputClass}
                          >
                            {iconOptions.map(opt => (
                              <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                          </select>
                        </div>

                        <div className="space-y-1">
                          <label className="text-xs text-muted-foreground">Title</label>
                          <input
                            type="text"
                            value={badge.title || ''}
                            onChange={(e) => {
                              const newBadges = [...(content.trustBadges || [])];
                              newBadges[index] = { ...newBadges[index], title: e.target.value };
                              handleUpdate('trustBadges', newBadges);
                            }}
                            placeholder="ISO Certified"
                            className={inputClass}
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-xs text-muted-foreground">Subtitle</label>
                          <input
                            type="text"
                            value={badge.subtitle || ''}
                            onChange={(e) => {
                              const newBadges = [...(content.trustBadges || [])];
                              newBadges[index] = { ...newBadges[index], subtitle: e.target.value };
                              handleUpdate('trustBadges', newBadges);
                            }}
                            placeholder="9001:2015"
                            className={inputClass}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}

                {(!content.trustBadges || content.trustBadges.length === 0) && (
                  <div className="text-center py-6 sm:py-8 text-muted-foreground">
                    <Shield className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No trust badges added yet</p>
                    <button
                      onClick={() => {
                        const newBadge: PartnerTrustBadge = { icon: 'Shield', title: 'ISO Certified', subtitle: '9001:2015' };
                        handleUpdate('trustBadges', [newBadge]);
                      }}
                      className="mt-2 text-primary text-sm font-medium"
                    >
                      + Add your first badge
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

export default PartnersEditor;