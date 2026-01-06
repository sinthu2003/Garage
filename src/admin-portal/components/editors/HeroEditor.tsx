import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Home,
  Type,
  Image,
  Play,
  BarChart3,
  ChevronRight,
  Plus,
  Trash2,
  GripVertical,
  Eye,
  EyeOff,
} from 'lucide-react';
import { useHeroContent } from '../../hooks/useContentHooks';
import { useContent } from '../../context/ContentContext';
import type { HeroStat, HeroScrollingBrand } from '../../types/content.types';

interface HeroEditorProps {
  isDarkMode: boolean;
}

export const HeroEditor: React.FC<HeroEditorProps> = ({ }) => {
  const { updateField } = useContent();
  const content = useHeroContent();
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(['headline', 'stats'])
  );
  const [showImagePreview, setShowImagePreview] = useState(false);

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
    updateField('hero', path, value);
  };

  // Theme-aware styling helpers using CSS variables
  const inputClass = `w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl text-sm transition-all bg-secondary border-border text-foreground placeholder-muted-foreground focus:border-primary border focus:outline-none focus:ring-2 focus:ring-primary/20`;

  const labelClass = `text-sm font-medium text-muted-foreground`;

  const sectionClass = `rounded-xl border overflow-hidden border-border bg-card`;

  const sectionHeaderClass = `w-full flex items-center justify-between p-3 sm:p-4 text-left transition-colors hover:bg-secondary/50`;

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 pb-4 border-b border-border">
        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center flex-shrink-0">
          <Home className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
        </div>
        <div className="min-w-0">
          <h2 className="text-lg sm:text-xl font-bold text-foreground truncate">
            Hero Section Editor
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Main banner, headlines, CTAs, and statistics
          </p>
        </div>
      </div>

      {/* Badge */}
      <div className="space-y-2">
        <label className={labelClass}>
          <span className="flex items-center gap-2">
            <Type className="w-4 h-4" />
            Badge Text
          </span>
        </label>
        <input
          type="text"
          value={content.badge || ''}
          onChange={(e) => handleUpdate('badge', e.target.value)}
          placeholder="#1 Car Service in Coimbatore"
          className={inputClass}
        />
        <p className="text-xs text-muted-foreground">
          Small badge shown above the headline
        </p>
      </div>

      {/* Headline Section */}
      <div className={sectionClass}>
        <button onClick={() => toggleSection('headline')} className={sectionHeaderClass}>
          <div className="flex items-center gap-2 sm:gap-3">
            <motion.div animate={{ rotate: expandedSections.has('headline') ? 90 : 0 }}>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </motion.div>
            <Type className="w-4 h-4 sm:w-5 sm:h-5 text-pink-500" />
            <span className="font-medium text-foreground text-sm sm:text-base">Headline</span>
          </div>
        </button>

        <AnimatePresence>
          {expandedSections.has('headline') && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="p-3 sm:p-4 pt-0 space-y-3 sm:space-y-4 border-t border-border">
                <div className="space-y-2">
                  <label className={labelClass}>Line 1</label>
                  <input
                    type="text"
                    value={content.headline?.line1 || ''}
                    onChange={(e) => handleUpdate('headline.line1', e.target.value)}
                    placeholder="Premium Car"
                    className={inputClass}
                  />
                </div>

                <div className="space-y-2">
                  <label className={labelClass}>Line 2</label>
                  <input
                    type="text"
                    value={content.headline?.line2 || ''}
                    onChange={(e) => handleUpdate('headline.line2', e.target.value)}
                    placeholder="Service at"
                    className={inputClass}
                  />
                </div>

                <div className="space-y-2">
                  <label className={labelClass}>Highlighted Text (Colored)</label>
                  <input
                    type="text"
                    value={content.headline?.highlight || ''}
                    onChange={(e) => handleUpdate('headline.highlight', e.target.value)}
                    placeholder="Your Doorstep."
                    className={inputClass}
                  />
                  <p className="text-xs text-muted-foreground">
                    This text will be shown in the primary/accent color
                  </p>
                </div>

                {/* Live Preview */}
                <div className="p-3 sm:p-4 rounded-xl bg-secondary">
                  <p className="text-xs uppercase tracking-wider mb-2 text-muted-foreground">
                    Preview
                  </p>
                  <h3 className="text-xl sm:text-2xl font-bold text-foreground">
                    {content.headline?.line1 || 'Premium Car'}
                    <br />
                    {content.headline?.line2 || 'Service at'}
                    <br />
                    <span className="text-primary">{content.headline?.highlight || 'Your Doorstep.'}</span>
                  </h3>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Subheadline */}
      <div className="space-y-2">
        <label className={labelClass}>Subheadline</label>
        <textarea
          value={content.subheadline || ''}
          onChange={(e) => handleUpdate('subheadline', e.target.value)}
          placeholder="Experience transparent pricing, real-time tracking, and savings up to"
          rows={2}
          className={inputClass}
        />
      </div>

      {/* Savings */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        <div className="space-y-2">
          <label className={labelClass}>Savings Percentage</label>
          <input
            type="text"
            value={content.savings?.percentage || ''}
            onChange={(e) => handleUpdate('savings.percentage', e.target.value)}
            placeholder="40%"
            className={inputClass}
          />
        </div>
        <div className="space-y-2">
          <label className={labelClass}>Savings Text</label>
          <input
            type="text"
            value={content.savings?.text || ''}
            onChange={(e) => handleUpdate('savings.text', e.target.value)}
            placeholder="compared to authorized service centers."
            className={inputClass}
          />
        </div>
      </div>

      {/* CTA Buttons */}
      <div className={sectionClass}>
        <button onClick={() => toggleSection('cta')} className={sectionHeaderClass}>
          <div className="flex items-center gap-2 sm:gap-3">
            <motion.div animate={{ rotate: expandedSections.has('cta') ? 90 : 0 }}>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </motion.div>
            <Play className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />
            <span className="font-medium text-foreground text-sm sm:text-base">Call-to-Action Buttons</span>
          </div>
        </button>

        <AnimatePresence>
          {expandedSections.has('cta') && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="p-3 sm:p-4 pt-0 space-y-3 sm:space-y-4 border-t border-border">
                <div className="space-y-2">
                  <label className={labelClass}>Primary Button Text</label>
                  <input
                    type="text"
                    value={content.cta?.primary || ''}
                    onChange={(e) => handleUpdate('cta.primary', e.target.value)}
                    placeholder="Get Free Quote"
                    className={inputClass}
                  />
                </div>

                <div className="space-y-2">
                  <label className={labelClass}>Secondary Button Text</label>
                  <input
                    type="text"
                    value={content.cta?.secondary || ''}
                    onChange={(e) => handleUpdate('cta.secondary', e.target.value)}
                    placeholder="Watch Video"
                    className={inputClass}
                  />
                </div>

                <div className="space-y-2">
                  <label className={labelClass}>Video URL</label>
                  <input
                    type="url"
                    value={content.cta?.videoUrl || ''}
                    onChange={(e) => handleUpdate('cta.videoUrl', e.target.value)}
                    placeholder="https://www.youtube.com/..."
                    className={inputClass}
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Background Image */}
      <div className={sectionClass}>
        <button onClick={() => toggleSection('background')} className={sectionHeaderClass}>
          <div className="flex items-center gap-2 sm:gap-3">
            <motion.div animate={{ rotate: expandedSections.has('background') ? 90 : 0 }}>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </motion.div>
            <Image className="w-4 h-4 sm:w-5 sm:h-5 text-purple-500" />
            <span className="font-medium text-foreground text-sm sm:text-base">Background Image</span>
          </div>
        </button>

        <AnimatePresence>
          {expandedSections.has('background') && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="p-3 sm:p-4 pt-0 space-y-3 sm:space-y-4 border-t border-border">
                <div className="space-y-2">
                  <label className={labelClass}>Image URL</label>
                  <input
                    type="text"
                    value={content.backgroundImage || ''}
                    onChange={(e) => handleUpdate('backgroundImage', e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className={inputClass}
                  />
                </div>

                {content.backgroundImage && (
                  <div className="space-y-2">
                    <button
                      onClick={() => setShowImagePreview(!showImagePreview)}
                      className="flex items-center gap-2 text-sm text-muted-foreground"
                    >
                      {showImagePreview ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      {showImagePreview ? 'Hide Preview' : 'Show Preview'}
                    </button>

                    {showImagePreview && (
                      <div className="relative rounded-xl overflow-hidden aspect-video">
                        <img
                          src={content.backgroundImage}
                          alt="Background Preview"
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://via.placeholder.com/800x400?text=Image+Error';
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-900/80 to-transparent" />
                      </div>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Stats Section */}
      <div className={sectionClass}>
        <div
          onClick={() => toggleSection('stats')}
          className={`${sectionHeaderClass} cursor-pointer`}
          role="button"
        >
          <div className="flex items-center gap-2 sm:gap-3">
            <motion.div animate={{ rotate: expandedSections.has('stats') ? 90 : 0 }}>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </motion.div>
            <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" />
            <span className="font-medium text-foreground text-sm sm:text-base">Statistics</span>
            <span className="px-2 py-0.5 rounded-full text-xs bg-secondary text-muted-foreground">
              {content.stats?.length || 0}
            </span>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              const newStat: HeroStat = { icon: 'Star', label: 'New Stat', value: '0', prefix: '', suffix: '' };
              handleUpdate('stats', [...(content.stats || []), newStat]);
            }}
            className="p-2 rounded-lg bg-secondary hover:bg-secondary/80 text-foreground"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        <AnimatePresence>
          {expandedSections.has('stats') && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="p-3 sm:p-4 pt-0 space-y-3 sm:space-y-4 border-t border-border">
                {content.stats?.map((stat: HeroStat, index: number) => (
                  <div
                    key={index}
                    className="p-3 sm:p-4 rounded-xl border border-border bg-card"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <GripVertical className="w-4 h-4 cursor-grab text-muted-foreground hidden sm:block" />
                        <span className="font-medium text-foreground text-sm sm:text-base">
                          Stat #{index + 1}
                        </span>
                      </div>
                      <button
                        onClick={() => {
                          const newStats = content.stats?.filter((_: HeroStat, i: number) => i !== index);
                          handleUpdate('stats', newStats);
                        }}
                        className="p-1.5 sm:p-2 rounded-lg text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-2 sm:gap-3">
                      <div className="space-y-1">
                        <label className="text-xs text-muted-foreground">Icon Name</label>
                        <select
                          value={stat.icon || 'Star'}
                          onChange={(e) => {
                            const newStats = [...(content.stats || [])];
                            newStats[index] = { ...newStats[index], icon: e.target.value };
                            handleUpdate('stats', newStats);
                          }}
                          className={inputClass}
                        >
                          <option value="ShieldCheck">Shield Check</option>
                          <option value="Zap">Zap (Lightning)</option>
                          <option value="Award">Award</option>
                          <option value="Star">Star</option>
                          <option value="Users">Users</option>
                          <option value="Clock">Clock</option>
                          <option value="MapPin">Location</option>
                          <option value="Wrench">Wrench</option>
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs text-muted-foreground">Label</label>
                        <input
                          type="text"
                          value={stat.label || ''}
                          onChange={(e) => {
                            const newStats = [...(content.stats || [])];
                            newStats[index] = { ...newStats[index], label: e.target.value };
                            handleUpdate('stats', newStats);
                          }}
                          placeholder="Warranty"
                          className={inputClass}
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs text-muted-foreground">Prefix</label>
                        <input
                          type="text"
                          value={stat.prefix || ''}
                          onChange={(e) => {
                            const newStats = [...(content.stats || [])];
                            newStats[index] = { ...newStats[index], prefix: e.target.value };
                            handleUpdate('stats', newStats);
                          }}
                          placeholder="₹"
                          className={inputClass}
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs text-muted-foreground">Value</label>
                        <input
                          type="text"
                          value={stat.value || ''}
                          onChange={(e) => {
                            const newStats = [...(content.stats || [])];
                            newStats[index] = { ...newStats[index], value: e.target.value };
                            handleUpdate('stats', newStats);
                          }}
                          placeholder="50000"
                          className={inputClass}
                        />
                      </div>

                      <div className="col-span-2 space-y-1">
                        <label className="text-xs text-muted-foreground">Suffix</label>
                        <input
                          type="text"
                          value={stat.suffix || ''}
                          onChange={(e) => {
                            const newStats = [...(content.stats || [])];
                            newStats[index] = { ...newStats[index], suffix: e.target.value };
                            handleUpdate('stats', newStats);
                          }}
                          placeholder="+"
                          className={inputClass}
                        />
                      </div>
                    </div>

                    {/* Stat Preview */}
                    <div className="mt-3 p-3 rounded-lg bg-secondary">
                      <p className="text-xs text-muted-foreground">Preview</p>
                      <p className="text-base sm:text-lg font-bold text-foreground">
                        {stat.prefix}{stat.value}{stat.suffix}
                      </p>
                      <p className="text-xs text-muted-foreground">{stat.label}</p>
                    </div>
                  </div>
                ))}

                {(!content.stats || content.stats.length === 0) && (
                  <div className="text-center py-6 sm:py-8 text-muted-foreground">
                    <BarChart3 className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No statistics added yet</p>
                    <button
                      onClick={() => {
                        const newStat: HeroStat = { icon: 'Star', label: 'New Stat', value: '100', prefix: '', suffix: '+' };
                        handleUpdate('stats', [newStat]);
                      }}
                      className="mt-2 text-primary text-sm font-medium"
                    >
                      + Add your first stat
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Scrolling Brands */}
      <div className={sectionClass}>
        <div
          onClick={() => toggleSection('brands')}
          className={`${sectionHeaderClass} cursor-pointer`}
          role="button"
        >
          <div className="flex items-center gap-2 sm:gap-3">
            <motion.div animate={{ rotate: expandedSections.has('brands') ? 90 : 0 }}>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </motion.div>
            <span className="font-medium text-foreground text-sm sm:text-base">Scrolling Brands</span>
            <span className="px-2 py-0.5 rounded-full text-xs bg-secondary text-muted-foreground">
              {content.scrollingBrands?.length || 0}
            </span>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              const newBrand: HeroScrollingBrand = { name: 'New Brand' };
              handleUpdate('scrollingBrands', [...(content.scrollingBrands || []), newBrand]);
            }}
            className="p-2 rounded-lg bg-secondary hover:bg-secondary/80 text-foreground"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        <AnimatePresence>
          {expandedSections.has('brands') && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="p-3 sm:p-4 pt-0 space-y-2 border-t border-border">
                {content.scrollingBrands?.map((brand: HeroScrollingBrand, index: number) => (
                  <div key={index} className="flex items-center gap-2">
                    <GripVertical className="w-4 h-4 cursor-grab text-muted-foreground hidden sm:block" />
                    <input
                      type="text"
                      value={brand.name || ''}
                      onChange={(e) => {
                        const newBrands = [...(content.scrollingBrands || [])];
                        newBrands[index] = { ...newBrands[index], name: e.target.value };
                        handleUpdate('scrollingBrands', newBrands);
                      }}
                      className={`flex-1 ${inputClass}`}
                    />
                    <button
                      onClick={() => {
                        const newBrands = content.scrollingBrands?.filter((_: HeroScrollingBrand, i: number) => i !== index);
                        handleUpdate('scrollingBrands', newBrands);
                      }}
                      className="p-2 rounded-lg text-destructive hover:bg-destructive/10 flex-shrink-0"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}

                {(!content.scrollingBrands || content.scrollingBrands.length === 0) && (
                  <div className="text-center py-6 text-muted-foreground">
                    <p className="text-sm">No brands added yet</p>
                    <button
                      onClick={() => {
                        const newBrand: HeroScrollingBrand = { name: 'Maruti Suzuki' };
                        handleUpdate('scrollingBrands', [newBrand]);
                      }}
                      className="mt-2 text-primary text-sm font-medium"
                    >
                      + Add your first brand
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

export default HeroEditor;