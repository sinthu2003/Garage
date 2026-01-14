import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SectionLoader } from '../shared/Sectionloader';
import {

  Image,
  Type,
  ChevronRight,
  ChevronDown,
  Plus,
  Trash2,
  GripVertical,
  Grid,
  Tag,
  Eye,
  EyeOff,
  BarChart3,
  Wrench,
  Car,
  Camera,
  Sparkles,
} from 'lucide-react';
import { useGalleryContent } from '../../hooks/useContentHooks';
import { useContent } from '../../context/ContentContext';
import { ImageUpload } from '../shared/ImageUpload';
import type { GalleryCategory, GalleryImage, GalleryStat } from '../../types/content.types';

interface GalleryEditorProps {
  isDarkMode: boolean;
}

// Icon options for stats
const statIconOptions = [
  { value: 'Wrench', label: 'Wrench', icon: Wrench },
  { value: 'Car', label: 'Car', icon: Car },
  { value: 'Camera', label: 'Camera', icon: Camera },
  { value: 'Sparkles', label: 'Sparkles', icon: Sparkles },
  { value: 'Image', label: 'Image', icon: Image },
];

export const GalleryEditor: React.FC<GalleryEditorProps> = ({ }) => {
  const { updateField } = useContent();
  const content = useGalleryContent();
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(['header', 'categories', 'images'])
  );
  const [expandedImages, setExpandedImages] = useState<Set<number>>(new Set());
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  // [LAZY LOADING] Show loading state - MUST be after all hooks
  if (content.isLoading) {
    return <SectionLoader section="Gallery" />;
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
    updateField('gallery', path, value);
  };

  // Theme-aware styling helpers using CSS variables
  const inputClass = `w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl text-sm transition-all bg-background border-border text-foreground placeholder-muted-foreground focus:border-primary border focus:outline-none focus:ring-2 focus:ring-primary/20`;

  const labelClass = `text-sm font-medium text-muted-foreground`;

  const sectionClass = `rounded-xl border overflow-hidden border-border bg-card`;

  const sectionHeaderClass = `w-full flex items-center justify-between p-3 sm:p-4 text-left transition-colors hover:bg-secondary/50`;

  const addNewImage = () => {
    const newImage: GalleryImage = {
      id: Date.now(),
      src: '',
      alt: 'New Image',
      category: content.categories?.[0]?.id || 'all',
      title: 'New Image',
      description: 'Image description',
    };
    // Add at the beginning of the array
    handleUpdate('images', [newImage, ...(content.images || [])]);
    // Auto-expand the newly added image (now at index 0)
    setExpandedImages(new Set([0]));
  };

  const addNewCategory = () => {
    const newCategory: GalleryCategory = {
      id: `category-${Date.now()}`,
      label: 'New Category',
    };
    // Add at the beginning of the array
    handleUpdate('categories', [newCategory, ...(content.categories || [])]);
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
                    placeholder="Gallery"
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
                      placeholder="Our work"
                      className={inputClass}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className={labelClass}>Highlighted Text</label>
                    <input
                      type="text"
                      value={content.headline?.highlight || ''}
                      onChange={(e) => handleUpdate('headline.highlight', e.target.value)}
                      placeholder="speaks for itself"
                      className={inputClass}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className={labelClass}>Description</label>
                  <textarea
                    value={content.description || ''}
                    onChange={(e) => handleUpdate('description', e.target.value)}
                    placeholder="Take a look at our state-of-the-art facilities..."
                    rows={2}
                    className={inputClass}
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Categories */}
      <div className={sectionClass}>
        <div 
          onClick={() => toggleSection('categories')} 
          onKeyDown={(e) => e.key === 'Enter' && toggleSection('categories')}
          role="button"
          tabIndex={0}
          className={`${sectionHeaderClass} cursor-pointer`}
        >
          <div className="flex items-center gap-2 sm:gap-3">
            <motion.div animate={{ rotate: expandedSections.has('categories') ? 90 : 0 }}>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </motion.div>
            <Tag className="w-4 h-4 sm:w-5 sm:h-5 text-purple-500" />
            <span className="font-medium text-foreground text-sm sm:text-base">Categories</span>
            <span className="px-2 py-0.5 rounded-full text-xs bg-secondary text-muted-foreground">
              {content.categories?.length || 0}
            </span>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              addNewCategory();
            }}
            className="p-2 rounded-lg bg-secondary hover:bg-secondary/80 text-foreground"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        <AnimatePresence>
          {expandedSections.has('categories') && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="p-3 sm:p-4 pt-0 space-y-2 sm:space-y-3 border-t border-border">
                {content.categories?.map((category: GalleryCategory, index: number) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 sm:gap-3"
                  >
                    <GripVertical className="w-4 h-4 cursor-grab text-muted-foreground hidden sm:block" />
                    <input
                      type="text"
                      value={category.id || ''}
                      onChange={(e) => {
                        const newCategories = [...(content.categories || [])];
                        newCategories[index] = { ...newCategories[index], id: e.target.value };
                        handleUpdate('categories', newCategories);
                      }}
                      placeholder="category-id"
                      className={`w-24 sm:w-32 ${inputClass}`}
                    />
                    <input
                      type="text"
                      value={category.label || ''}
                      onChange={(e) => {
                        const newCategories = [...(content.categories || [])];
                        newCategories[index] = { ...newCategories[index], label: e.target.value };
                        handleUpdate('categories', newCategories);
                      }}
                      placeholder="Category Label"
                      className={`flex-1 ${inputClass}`}
                    />
                    <button
                      onClick={() => {
                        const newCategories = content.categories?.filter((_: GalleryCategory, i: number) => i !== index);
                        handleUpdate('categories', newCategories);
                      }}
                      className="p-2 rounded-lg text-destructive hover:bg-destructive/10 flex-shrink-0"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}

                {(!content.categories || content.categories.length === 0) && (
                  <div className="text-center py-4 text-muted-foreground">
                    <Tag className="w-6 h-6 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No categories added yet</p>
                    <button onClick={addNewCategory} className="mt-2 text-primary text-sm font-medium">
                      + Add category
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Images */}
      <div className={sectionClass}>
        <div 
          onClick={() => toggleSection('images')} 
          onKeyDown={(e) => e.key === 'Enter' && toggleSection('images')}
          role="button"
          tabIndex={0}
          className={`${sectionHeaderClass} cursor-pointer`}
        >
          <div className="flex items-center gap-2 sm:gap-3">
            <motion.div animate={{ rotate: expandedSections.has('images') ? 90 : 0 }}>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </motion.div>
            <Grid className="w-4 h-4 sm:w-5 sm:h-5 text-pink-500" />
            <span className="font-medium text-foreground text-sm sm:text-base">Gallery Images</span>
            <span className="px-2 py-0.5 rounded-full text-xs bg-secondary text-muted-foreground">
              {content.images?.length || 0}
            </span>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              addNewImage();
            }}
            className="p-2 rounded-lg bg-secondary hover:bg-secondary/80 text-foreground"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        <AnimatePresence>
          {expandedSections.has('images') && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="p-3 sm:p-4 pt-0 space-y-3 sm:space-y-4 border-t border-border">
                {content.images?.map((image: GalleryImage, index: number) => (
                  <div
                    key={image.id || index}
                    className="rounded-xl border overflow-hidden border-border bg-card"
                  >
                    {/* Image Header */}
                    <div
                      onClick={() => toggleImage(index)}
                      onKeyDown={(e) => e.key === 'Enter' && toggleImage(index)}
                      role="button"
                      tabIndex={0}
                      className="w-full flex items-center justify-between p-3 sm:p-4 text-left hover:bg-secondary/50 cursor-pointer"
                    >
                      <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                        <GripVertical className="w-4 h-4 cursor-grab text-muted-foreground hidden sm:block" />
                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg overflow-hidden bg-secondary flex-shrink-0">
                          {image.src ? (
                            <img
                              src={image.src.startsWith('http') || image.src.startsWith('data:') ? image.src : `${image.src}`}
                              alt={image.alt || ''}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                (e.target as HTMLImageElement).style.display = 'none';
                              }}
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Image className="w-5 h-5 text-muted-foreground" />
                            </div>
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-foreground text-sm truncate">
                            {image.title || 'Untitled Image'}
                          </p>
                          <p className="text-xs text-muted-foreground truncate">
                            {image.category || 'No category'}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
                        {image.src && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setPreviewImage(image.src);
                            }}
                            className="p-1.5 sm:p-2 rounded-lg hover:bg-secondary text-muted-foreground"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            const newImages = content.images?.filter((_: GalleryImage, i: number) => i !== index);
                            handleUpdate('images', newImages);
                          }}
                          className="p-1.5 sm:p-2 rounded-lg text-destructive hover:bg-destructive/10"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <motion.div animate={{ rotate: expandedImages.has(index) ? 180 : 0 }}>
                          <ChevronDown className="w-4 h-4 text-muted-foreground" />
                        </motion.div>
                      </div>
                    </div>

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
                              value={image.src || ''}
                              onChange={(url) => {
                                const newImages = [...(content.images || [])];
                                newImages[index] = { ...newImages[index], src: url };
                                handleUpdate('images', newImages);
                              }}
                              label="Gallery Image"
                              placeholder="Upload image or enter URL"
                              previewHeight="h-40"
                              maxSizeMB={2}
                              maxWidthOrHeight={1920}
                              helperText="Recommended: High-quality images, 1920x1080px or similar"
                              showAltInput={false}
                              compact={false}
                            />

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                              <div className="space-y-1">
                                <label className="text-xs text-muted-foreground">Title</label>
                                <input
                                  type="text"
                                  value={image.title || ''}
                                  onChange={(e) => {
                                    const newImages = [...(content.images || [])];
                                    newImages[index] = { ...newImages[index], title: e.target.value };
                                    handleUpdate('images', newImages);
                                  }}
                                  placeholder="Engine Repair"
                                  className={inputClass}
                                />
                              </div>

                              <div className="space-y-1">
                                <label className="text-xs text-muted-foreground">Category</label>
                                <select
                                  value={image.category || ''}
                                  onChange={(e) => {
                                    const newImages = [...(content.images || [])];
                                    newImages[index] = { ...newImages[index], category: e.target.value };
                                    handleUpdate('images', newImages);
                                  }}
                                  className={inputClass}
                                >
                                  <option value="">Select category</option>
                                  {content.categories?.map((cat: GalleryCategory) => (
                                    <option key={cat.id} value={cat.id}>{cat.label}</option>
                                  ))}
                                </select>
                              </div>
                            </div>

                            <div className="space-y-1">
                              <label className="text-xs text-muted-foreground">Alt Text (SEO)</label>
                              <input
                                type="text"
                                value={image.alt || ''}
                                onChange={(e) => {
                                  const newImages = [...(content.images || [])];
                                  newImages[index] = { ...newImages[index], alt: e.target.value };
                                  handleUpdate('images', newImages);
                                }}
                                placeholder="Mechanic servicing car engine"
                                className={inputClass}
                              />
                            </div>

                            <div className="space-y-1">
                              <label className="text-xs text-muted-foreground">Description</label>
                              <input
                                type="text"
                                value={image.description || ''}
                                onChange={(e) => {
                                  const newImages = [...(content.images || [])];
                                  newImages[index] = { ...newImages[index], description: e.target.value };
                                  handleUpdate('images', newImages);
                                }}
                                placeholder="Expert engine diagnostics and repair"
                                className={inputClass}
                              />
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}

                {(!content.images || content.images.length === 0) && (
                  <div className="text-center py-6 sm:py-8 text-muted-foreground">
                    <Image className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No images added yet</p>
                    <button onClick={addNewImage} className="mt-2 text-primary text-sm font-medium">
                      + Add your first image
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Stats */}
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
            <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" />
            <span className="font-medium text-foreground text-sm sm:text-base">Gallery Stats</span>
            <span className="px-2 py-0.5 rounded-full text-xs bg-secondary text-muted-foreground">
              {content.stats?.length || 0}
            </span>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              const newStat: GalleryStat = { icon: 'Wrench', value: '100+', label: 'New Stat' };
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
                {content.stats?.map((stat: GalleryStat, index: number) => (
                  <div
                    key={index}
                    className="p-3 rounded-xl border border-border bg-card"
                  >
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 items-center">
                      <select
                        value={stat.icon || 'Wrench'}
                        onChange={(e) => {
                          const newStats = [...(content.stats || [])];
                          newStats[index] = { ...newStats[index], icon: e.target.value };
                          handleUpdate('stats', newStats);
                        }}
                        className={inputClass}
                      >
                        {statIconOptions.map(opt => (
                          <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                      </select>

                      <input
                        type="text"
                        value={stat.value || ''}
                        onChange={(e) => {
                          const newStats = [...(content.stats || [])];
                          newStats[index] = { ...newStats[index], value: e.target.value };
                          handleUpdate('stats', newStats);
                        }}
                        placeholder="500+"
                        className={inputClass}
                      />

                      <input
                        type="text"
                        value={stat.label || ''}
                        onChange={(e) => {
                          const newStats = [...(content.stats || [])];
                          newStats[index] = { ...newStats[index], label: e.target.value };
                          handleUpdate('stats', newStats);
                        }}
                        placeholder="Expert Mechanics"
                        className={`col-span-2 sm:col-span-1 ${inputClass}`}
                      />

                      <button
                        onClick={() => {
                          const newStats = content.stats?.filter((_: GalleryStat, i: number) => i !== index);
                          handleUpdate('stats', newStats);
                        }}
                        className="p-2 rounded-lg text-destructive hover:bg-destructive/10 justify-self-end sm:justify-self-auto"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}

                {(!content.stats || content.stats.length === 0) && (
                  <div className="text-center py-4 text-muted-foreground">
                    <BarChart3 className="w-6 h-6 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No stats added yet</p>
                    <button
                      onClick={() => {
                        const newStat: GalleryStat = { icon: 'Wrench', value: '500+', label: 'Services Done' };
                        handleUpdate('stats', [newStat]);
                      }}
                      className="mt-2 text-primary text-sm font-medium"
                    >
                      + Add stat
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Image Preview Modal */}
      <AnimatePresence>
        {previewImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
            onClick={() => setPreviewImage(null)}
          >
            <motion.img
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              src={previewImage.startsWith('http') || previewImage.startsWith('data:') ? previewImage : `${previewImage}`}
              alt="Preview"
              className="max-w-full max-h-full rounded-xl"
            />
            <button
              onClick={() => setPreviewImage(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-white/10 text-white hover:bg-white/20"
            >
              <EyeOff className="w-5 h-5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default GalleryEditor;