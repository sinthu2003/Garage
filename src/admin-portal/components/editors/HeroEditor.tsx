import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Type,
  Play,
  BarChart3,
  ChevronRight,
  ChevronDown,
  Plus,
  Trash2,
  GripVertical,
  Images,
  Clock,
} from 'lucide-react';
import { useHeroContent } from '../../hooks/useContentHooks';
import { useContent } from '../../context/ContentContext';
import { ImageUpload } from '../shared/ImageUpload';
import type { HeroStat, HeroScrollingBrand } from '../../types/content.types';
import { SectionLoader } from '../shared/Sectionloader';

// Type for background images
interface BackgroundImage {
  url: string;
  alt: string;
}

interface HeroEditorProps {
  isDarkMode: boolean;
}

export const HeroEditor: React.FC<HeroEditorProps> = ({ }) => {
  const { updateField } = useContent();
  const content = useHeroContent();
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(['headline', 'stats'])
  );
  const [expandedImages, setExpandedImages] = useState<Set<number>>(new Set([0]));

  // [LAZY LOADING] Show loading state - MUST be after all hooks
  if (content.isLoading) {
    return <SectionLoader section="Hero" />;
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

  const toggleImage = (index: number) => {
    const newExpanded = new Set(expandedImages);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedImages(newExpanded);
  };

  const handleUpdate = (path: string, value: unknown) => {
    updateField('hero', path, value);
  };

  // Theme-aware styling helpers using CSS variables
  const inputClass = `w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl text-sm transition-all bg-secondary border-border text-foreground placeholder-muted-foreground focus:border-primary border focus:outline-none focus:ring-2 focus:ring-primary/20`;

  const labelClass = `text-sm font-medium text-muted-foreground`;

  const sectionClass = `rounded-xl border overflow-hidden border-border bg-card`;

  const sectionHeaderClass = `w-full flex items-center justify-between p-3 sm:p-4 text-left transition-colors hover:bg-secondary/50`;

  // Get background images array or initialize empty
  const backgroundImages: BackgroundImage[] = content.backgroundImages || [];

  const addNewBackgroundImage = () => {
    if (backgroundImages.length < 10) {
      const newImage: BackgroundImage = { url: '', alt: '' };
      // Add at the beginning of the array
      handleUpdate('backgroundImages', [newImage, ...backgroundImages]);
      // Auto-expand the newly added image (now at index 0)
      setExpandedImages(new Set([0]));
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
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

      {/* ============== BACKGROUND IMAGES SLIDER ============== */}
      <div className={sectionClass}>
        <div 
          onClick={() => toggleSection('backgroundImages')} 
          onKeyDown={(e) => e.key === 'Enter' && toggleSection('backgroundImages')}
          role="button"
          tabIndex={0}
          className={`${sectionHeaderClass} cursor-pointer`}
        >
          <div className="flex items-center gap-2 sm:gap-3">
            <motion.div animate={{ rotate: expandedSections.has('backgroundImages') ? 90 : 0 }}>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </motion.div>
            <Images className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" />
            <span className="font-medium text-foreground text-sm sm:text-base">Background Slider Images</span>
            <span className="px-2 py-0.5 rounded-full text-xs bg-secondary text-muted-foreground">
              {backgroundImages.length}
            </span>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              addNewBackgroundImage();
            }}
            disabled={backgroundImages.length >= 10}
            className={`p-2 rounded-lg bg-secondary hover:bg-secondary/80 text-foreground ${
              backgroundImages.length >= 10 ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            title={backgroundImages.length >= 10 ? 'Maximum 10 images allowed' : 'Add new image'}
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        <AnimatePresence>
          {expandedSections.has('backgroundImages') && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="p-3 sm:p-4 pt-0 space-y-4 border-t border-border">
                {/* Slider Settings */}
                <div className="p-3 rounded-xl bg-secondary/30 border border-border">
                  <div className="flex items-center gap-2 mb-3">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm font-medium text-foreground">Slider Settings</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs text-muted-foreground">Slide Duration (seconds)</label>
                      <input
                        type="number"
                        min="1"
                        max="30"
                        value={content.sliderSettings?.duration || 5}
                        onChange={(e) => handleUpdate('sliderSettings.duration', parseInt(e.target.value) || 5)}
                        className={inputClass}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs text-muted-foreground">Transition Effect</label>
                      <select
                        value={content.sliderSettings?.transition || 'fade'}
                        onChange={(e) => handleUpdate('sliderSettings.transition', e.target.value)}
                        className={inputClass}
                      >
                        <option value="fade">Fade</option>
                        <option value="slide">Slide</option>
                        <option value="zoom">Zoom</option>
                      </select>
                    </div>
                  </div>
                  <div className="mt-3 flex flex-wrap items-center gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={content.sliderSettings?.autoPlay !== false}
                        onChange={(e) => handleUpdate('sliderSettings.autoPlay', e.target.checked)}
                        className="w-4 h-4 rounded border-border text-primary focus:ring-primary/20"
                      />
                      <span className="text-sm text-muted-foreground">Auto Play</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={content.sliderSettings?.showIndicators !== false}
                        onChange={(e) => handleUpdate('sliderSettings.showIndicators', e.target.checked)}
                        className="w-4 h-4 rounded border-border text-primary focus:ring-primary/20"
                      />
                      <span className="text-sm text-muted-foreground">Show Indicators</span>
                    </label>
                  </div>
                </div>

                {/* Background Images List - GalleryEditor Pattern */}
                <div className="space-y-3">
                  {backgroundImages.map((image: BackgroundImage, index: number) => (
                    <div
                      key={index}
                      id={`background-image-${index}`}
                      className="rounded-xl border overflow-hidden border-border bg-card"
                    >
                      {/* Image Header */}
                      <button
                        onClick={() => toggleImage(index)}
                        className="w-full flex items-center justify-between p-3 sm:p-4 text-left hover:bg-secondary/50"
                      >
                        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                          <GripVertical className="w-4 h-4 cursor-grab text-muted-foreground hidden sm:block" />
                          <div className="w-12 h-12 sm:w-16 sm:h-10 rounded-lg overflow-hidden bg-secondary flex-shrink-0">
                            {image.url ? (
                              <img
                                src={image.url.startsWith('http') || image.url.startsWith('data:') ? image.url : `/assets/${image.url}`}
                                alt={image.alt || `Slide ${index + 1}`}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).style.display = 'none';
                                }}
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <Images className="w-5 h-5 text-muted-foreground" />
                              </div>
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="font-medium text-foreground text-sm truncate">
                              Slide {index + 1}
                            </p>
                            <p className="text-xs text-muted-foreground truncate">
                              {image.alt || 'No description'}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              const newImages = backgroundImages.filter((_: BackgroundImage, i: number) => i !== index);
                              handleUpdate('backgroundImages', newImages);
                            }}
                            className="p-1.5 sm:p-2 rounded-lg text-destructive hover:bg-destructive/10"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                          <motion.div animate={{ rotate: expandedImages.has(index) ? 180 : 0 }}>
                            <ChevronDown className="w-4 h-4 text-muted-foreground" />
                          </motion.div>
                        </div>
                      </button>

                      {/* Image Details */}
                      <AnimatePresence>
                        {expandedImages.has(index) && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden border-t border-border"
                          >
                            <div className="p-3 sm:p-4 space-y-3 sm:space-y-4">
                              {/* Image Upload */}
                              <ImageUpload
                                value={image.url || ''}
                                onChange={(url) => {
                                  const newImages = [...backgroundImages];
                                  newImages[index] = { ...newImages[index], url };
                                  handleUpdate('backgroundImages', newImages);
                                }}
                                label="Slide Image"
                                placeholder="Upload image or enter URL"
                                previewHeight="h-40"
                                maxSizeMB={2}
                                maxWidthOrHeight={1920}
                                helperText="Recommended: 1920x1080px, high-quality image"
                                showAltInput={false}
                                compact={false}
                              />

                              {/* Alt Text */}
                              <div className="space-y-2">
                                <label className={labelClass}>Image Description (Alt Text)</label>
                                <input
                                  type="text"
                                  value={image.alt || ''}
                                  onChange={(e) => {
                                    const newImages = [...backgroundImages];
                                    newImages[index] = { ...newImages[index], alt: e.target.value };
                                    handleUpdate('backgroundImages', newImages);
                                  }}
                                  placeholder="Describe the image for accessibility"
                                  className={inputClass}
                                />
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ))}

                  {backgroundImages.length === 0 && (
                    <div className="text-center py-6 sm:py-8 text-muted-foreground">
                      <Images className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">No background images added yet</p>
                      <div className="flex flex-col sm:flex-row items-center justify-center gap-2 mt-3">
                        <button 
                          onClick={addNewBackgroundImage} 
                          className="text-primary text-sm font-medium"
                        >
                          + Add your first image
                        </button>
                        <span className="text-muted-foreground hidden sm:inline">or</span>
                        <button
                          onClick={() => {
                            const defaultImages: BackgroundImage[] = [
                              { url: 'https://images.unsplash.com/photo-1625047509248-ec889cbff17f?w=1920&q=80', alt: 'Professional Car Service Garage' },
                              { url: 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=1920&q=80', alt: 'Car Engine Repair' },
                              { url: 'https://images.unsplash.com/photo-1530046339160-ce3e530c7d2f?w=1920&q=80', alt: 'Auto Mechanic Working' },
                            ];
                            handleUpdate('backgroundImages', defaultImages);
                            // Auto-expand first image
                            setExpandedImages(new Set([0]));
                          }}
                          className="px-3 py-1.5 bg-primary/10 text-primary border border-primary/20 rounded-lg text-sm font-medium hover:bg-primary/20 transition-colors"
                        >
                          Load Sample Images
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Stats Section */}
      <div className={sectionClass}>
        <div
          onClick={() => toggleSection('stats')}
          onKeyDown={(e) => e.key === 'Enter' && toggleSection('stats')}
          role="button"
          tabIndex={0}
          className={`${sectionHeaderClass} cursor-pointer`}
        >
          <div className="flex items-center gap-2 sm:gap-3">
            <motion.div animate={{ rotate: expandedSections.has('stats') ? 90 : 0 }}>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </motion.div>
            <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500" />
            <span className="font-medium text-foreground text-sm sm:text-base">Statistics</span>
            <span className="px-2 py-0.5 rounded-full text-xs bg-secondary text-muted-foreground">
              {content.stats?.length || 0}
            </span>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              const newStat: HeroStat = { icon: 'Star', label: 'New Stat', value: '100', prefix: '', suffix: '+' };
              // Add at the beginning of the array
              handleUpdate('stats', [newStat, ...(content.stats || [])]);
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
              <div className="p-3 sm:p-4 pt-0 space-y-3 border-t border-border">
                {content.stats?.map((stat: HeroStat, index: number) => (
                  <div
                    key={index}
                    className="p-3 rounded-xl border border-border bg-secondary/30"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <GripVertical className="w-4 h-4 cursor-grab text-muted-foreground hidden sm:block" />
                        <span className="text-sm font-medium text-foreground">
                          {stat.label || 'Untitled Stat'}
                        </span>
                      </div>
                      <button
                        onClick={() => {
                          const newStats = content.stats?.filter((_: HeroStat, i: number) => i !== index);
                          handleUpdate('stats', newStats);
                        }}
                        className="p-1.5 rounded-lg text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
                      <div className="space-y-1">
                        <label className="text-xs text-muted-foreground">Icon</label>
                        <select
                          value={stat.icon || 'Star'}
                          onChange={(e) => {
                            const newStats = [...(content.stats || [])];
                            newStats[index] = { ...newStats[index], icon: e.target.value };
                            handleUpdate('stats', newStats);
                          }}
                          className={inputClass}
                        >
                          <option value="Award">Award</option>
                          <option value="Calendar">Calendar</option>
                          <option value="CheckCircle">Check</option>
                          <option value="Clock">Clock</option>
                          <option value="Heart">Heart</option>
                          <option value="ShieldCheck">Shield</option>
                          <option value="Star">Star</option>
                          <option value="Users">Users</option>
                          <option value="Zap">Zap</option>
                          <option value="MapPin">Location</option>
                          <option value="Wrench">Wrench</option>
                          <option value="Car">Car</option>
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
              // Add at the beginning of the array
              handleUpdate('scrollingBrands', [newBrand, ...(content.scrollingBrands || [])]);
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
                        const defaultBrands: HeroScrollingBrand[] = [
                          { name: 'Maruti Suzuki' },
                          { name: 'Hyundai' },
                          { name: 'Honda' },
                          { name: 'Tata' },
                          { name: 'Toyota' },
                          { name: 'Mahindra' },
                          { name: 'Kia' },
                          { name: 'MG' },
                        ];
                        handleUpdate('scrollingBrands', defaultBrands);
                      }}
                      className="mt-2 text-primary text-sm font-medium"
                    >
                      + Add default brands
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