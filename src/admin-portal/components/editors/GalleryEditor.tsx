import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  const inputClass = `w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl text-sm transition-all bg-secondary border-border text-foreground placeholder-muted-foreground focus:border-primary border focus:outline-none focus:ring-2 focus:ring-primary/20`;

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
    handleUpdate('images', [...(content.images || []), newImage]);
  };

  const addNewCategory = () => {
    const newCategory: GalleryCategory = {
      id: `category-${Date.now()}`,
      label: 'New Category',
    };
    handleUpdate('categories', [...(content.categories || []), newCategory]);
  };

  // Get icon component by name
  const getIconComponent = (iconName: string) => {
    const iconOption = statIconOptions.find(opt => opt.value === iconName);
    return iconOption?.icon || Wrench;
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 pb-4 border-b border-border">
        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center flex-shrink-0">
          <Image className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
        </div>
        <div className="min-w-0">
          <h2 className="text-lg sm:text-xl font-bold text-foreground truncate">
            Gallery Editor
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Image gallery with categories and stats
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

                {/* Preview */}
                <div className="p-3 sm:p-4 rounded-xl bg-secondary">
                  <p className="text-xs uppercase tracking-wider mb-2 text-muted-foreground">
                    Preview
                  </p>
                  <div className="inline-block px-3 py-1 rounded-full bg-pink-100 text-pink-700 text-xs font-medium mb-2">
                    {content.badge || 'Gallery'}
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-foreground">
                    {content.headline?.line1 || 'Our work'}
                    {' '}
                    <span className="text-primary">{content.headline?.highlight || 'speaks for itself'}</span>
                  </h3>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Categories */}
      <div className={sectionClass}>
        <button onClick={() => toggleSection('categories')} className={sectionHeaderClass}>
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
        </button>

        <AnimatePresence>
          {expandedSections.has('categories') && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="p-3 sm:p-4 pt-0 space-y-3 border-t border-border">
                {content.categories?.map((category: GalleryCategory, index: number) => (
                  <div key={index} className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                    <div className="flex items-center gap-2 sm:gap-3">
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
                        className={`w-full sm:w-32 ${inputClass}`}
                      />
                    </div>
                    <div className="flex items-center gap-2 flex-1">
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
                        disabled={category.id === 'all'}
                      >
                        <Trash2 className={`w-4 h-4 ${category.id === 'all' ? 'opacity-30' : ''}`} />
                      </button>
                    </div>
                  </div>
                ))}

                {/* Category Pills Preview */}
                {content.categories && content.categories.length > 0 && (
                  <div className="p-3 rounded-lg bg-secondary">
                    <p className="text-xs mb-2 text-muted-foreground">Filter Preview</p>
                    <div className="flex flex-wrap gap-2">
                      {content.categories.map((cat: GalleryCategory, i: number) => (
                        <span
                          key={i}
                          className={`px-3 py-1 rounded-full text-xs ${
                            i === 0
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-card text-muted-foreground'
                          }`}
                        >
                          {cat.label}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Gallery Images */}
      <div className={sectionClass}>
        <button onClick={() => toggleSection('images')} className={sectionHeaderClass}>
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
        </button>

        <AnimatePresence>
          {expandedSections.has('images') && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="p-3 sm:p-4 pt-0 space-y-3 sm:space-y-4 border-t border-border">
                {/* Grid Preview */}
                {content.images && content.images.length > 0 && (
                  <div className="p-3 sm:p-4 rounded-xl bg-secondary">
                    <p className="text-xs uppercase tracking-wider mb-3 text-muted-foreground">
                      Gallery Preview ({content.images.length} images)
                    </p>
                    <div className="grid grid-cols-4 sm:grid-cols-6 gap-1 sm:gap-2">
                      {content.images.slice(0, 12).map((img: GalleryImage, i: number) => (
                        <div
                          key={i}
                          className="relative aspect-square rounded-lg overflow-hidden cursor-pointer group"
                          onClick={() => setPreviewImage(img.src)}
                        >
                          <img
                            src={img.src?.startsWith('http') ? img.src : `/assets/${img.src}`}
                            alt={img.alt}
                            className="w-full h-full object-cover"
                            onError={(e) => { (e.target as HTMLImageElement).src = 'https://via.placeholder.com/100'; }}
                          />
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <Eye className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Image List */}
                {content.images?.map((image: GalleryImage, index: number) => (
                  <div
                    key={image.id || index}
                    className="rounded-xl border overflow-hidden border-border bg-card"
                  >
                    {/* Image Header */}
                    <button
                      onClick={() => toggleImage(index)}
                      className="w-full flex items-center justify-between p-2.5 sm:p-3 text-left hover:bg-secondary/50"
                    >
                      <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                        <GripVertical className="w-4 h-4 cursor-grab text-muted-foreground hidden sm:block" />
                        {image.src && (
                          <img
                            src={image.src.startsWith('http') ? image.src : `/assets/${image.src}`}
                            alt={image.alt}
                            className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg object-cover flex-shrink-0"
                            onError={(e) => { (e.target as HTMLImageElement).src = 'https://via.placeholder.com/48'; }}
                          />
                        )}
                        <div className="min-w-0">
                          <p className="font-medium text-sm text-foreground truncate">
                            {image.title || 'Untitled'}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {image.category}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
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
                    </button>

                    {/* Image Details */}
                    <AnimatePresence>
                      {expandedImages.has(index) && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="p-3 sm:p-4 pt-0 space-y-3 border-t border-border">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
                                  placeholder="Engine Service"
                                  className={inputClass}
                                />
                              </div>

                              <div className="space-y-1">
                                <label className="text-xs text-muted-foreground">Category</label>
                                <select
                                  value={image.category || 'all'}
                                  onChange={(e) => {
                                    const newImages = [...(content.images || [])];
                                    newImages[index] = { ...newImages[index], category: e.target.value };
                                    handleUpdate('images', newImages);
                                  }}
                                  className={inputClass}
                                >
                                  {content.categories?.map((cat: GalleryCategory) => (
                                    <option key={cat.id} value={cat.id}>{cat.label}</option>
                                  ))}
                                </select>
                              </div>
                            </div>

                            <div className="space-y-1">
                              <label className="text-xs text-muted-foreground">Image Source</label>
                              <input
                                type="text"
                                value={image.src || ''}
                                onChange={(e) => {
                                  const newImages = [...(content.images || [])];
                                  newImages[index] = { ...newImages[index], src: e.target.value };
                                  handleUpdate('images', newImages);
                                }}
                                placeholder="PeriodicService.jpg or https://..."
                                className={inputClass}
                              />
                            </div>

                            <div className="space-y-1">
                              <label className="text-xs text-muted-foreground">Alt Text</label>
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
        <button onClick={() => toggleSection('stats')} className={sectionHeaderClass}>
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
              handleUpdate('stats', [...(content.stats || []), newStat]);
            }}
            className="p-2 rounded-lg bg-secondary hover:bg-secondary/80 text-foreground"
          >
            <Plus className="w-4 h-4" />
          </button>
        </button>

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

                {/* Stats Preview */}
                {content.stats && content.stats.length > 0 && (
                  <div className="p-3 sm:p-4 rounded-xl bg-secondary">
                    <p className="text-xs uppercase tracking-wider mb-3 text-muted-foreground">
                      Stats Preview
                    </p>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                      {content.stats.map((stat: GalleryStat, i: number) => {
                        const Icon = getIconComponent(stat.icon);
                        return (
                          <div key={i} className="text-center">
                            <Icon className="w-5 h-5 sm:w-6 sm:h-6 mx-auto mb-1 text-primary" />
                            <p className="font-bold text-sm sm:text-base text-foreground">{stat.value}</p>
                            <p className="text-[10px] sm:text-xs text-muted-foreground">{stat.label}</p>
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
              src={previewImage.startsWith('http') ? previewImage : `/assets/${previewImage}`}
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