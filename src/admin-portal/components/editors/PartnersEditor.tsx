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
  Plus,
  Trash2,
  Hash,
  Star,
} from 'lucide-react';
import { usePartnersContent } from '../../hooks/useContentHooks';
import { useContent } from '../../context/ContentContext';
import type { PartnerTrustBadge } from '../../types/content.types';

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
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 pb-4 border-b border-border">
        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center flex-shrink-0">
          <Users className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
        </div>
        <div className="min-w-0">
          <h2 className="text-lg sm:text-xl font-bold text-foreground truncate">
            Partners Editor
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Brand partners and trust badges
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

                {/* Preview */}
                <div className="p-3 sm:p-4 rounded-xl bg-secondary">
                  <p className="text-xs uppercase tracking-wider mb-2 text-muted-foreground">
                    Preview
                  </p>
                  <div className="inline-block px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 text-xs font-medium mb-2">
                    {content.badge || 'Trusted Partners'}
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-foreground">
                    {content.headline?.text || 'We service'}
                    {' '}
                    <span className="text-primary">{content.headline?.highlight || 'all major brands'}</span>
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

      {/* Brand Count */}
      <div className={sectionClass}>
        <button onClick={() => toggleSection('brandCount')} className={sectionHeaderClass}>
          <div className="flex items-center gap-2 sm:gap-3">
            <motion.div animate={{ rotate: expandedSections.has('brandCount') ? 90 : 0 }}>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </motion.div>
            <Hash className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />
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

                {/* Preview */}
                <div className="p-3 sm:p-4 rounded-xl bg-secondary">
                  <p className="text-xs uppercase tracking-wider mb-2 text-muted-foreground">
                    Preview
                  </p>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                    <div className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
                      {content.brandCount || '35+'}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {content.brandCountLabel || 'Car Brands Serviced'}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Trust Badges */}
      <div className={sectionClass}>
        <button onClick={() => toggleSection('trustBadges')} className={sectionHeaderClass}>
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
          <button
            onClick={(e) => {
              e.stopPropagation();
              const newBadge: PartnerTrustBadge = {
                icon: 'Shield',
                title: 'New Badge',
                subtitle: 'Subtitle',
              };
              handleUpdate('trustBadges', [...(content.trustBadges || []), newBadge]);
            }}
            className="p-2 rounded-lg bg-secondary hover:bg-secondary/80 text-foreground"
          >
            <Plus className="w-4 h-4" />
          </button>
        </button>

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

                      {/* Badge Preview */}
                      <div className="mt-3 p-3 rounded-lg flex items-center gap-3 bg-secondary">
                        <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center bg-card">
                          <IconComponent className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-sm text-foreground truncate">
                            {badge.title || 'Title'}
                          </p>
                          <p className="text-xs text-muted-foreground truncate">
                            {badge.subtitle || 'Subtitle'}
                          </p>
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

                {/* Badges Grid Preview */}
                {content.trustBadges && content.trustBadges.length > 0 && (
                  <div className="p-3 sm:p-4 rounded-xl bg-secondary">
                    <p className="text-xs uppercase tracking-wider mb-3 text-muted-foreground">
                      Grid Preview
                    </p>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
                      {content.trustBadges.map((badge: PartnerTrustBadge, i: number) => {
                        const Icon = getIconComponent(badge.icon);
                        return (
                          <div
                            key={i}
                            className="p-2 sm:p-3 rounded-lg text-center bg-card"
                          >
                            <Icon className="w-5 h-5 sm:w-6 sm:h-6 mx-auto mb-1 text-primary" />
                            <p className="text-[10px] sm:text-xs font-medium truncate text-foreground">
                              {badge.title}
                            </p>
                            <p className="text-[10px] sm:text-xs truncate text-muted-foreground">
                              {badge.subtitle}
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

export default PartnersEditor;