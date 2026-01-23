import React, { useState, useEffect } from 'react';
import { SectionLoader } from '../shared/SectionLoader';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Type,
  Search,
  Link,
  ChevronRight,
  AlertTriangle,
  Wrench,
  Home,
  Phone,
  Plus,
  Trash2,
  Filter,
  MousePointerClick,
} from 'lucide-react';
import { usePagesContent } from '../../hooks/useContentHooks';
import { useContent } from '../../context/ContentContext';

interface PagesEditorProps {
  isDarkMode: boolean;
  onPageChange?: (page: 'services' | 'notFound') => void;
}

// Default categories for Services page
const defaultCategories = [
  { id: 'all', label: 'All', icon: 'Sparkles' },
  { id: 'maintenance', label: 'Maintenance', icon: 'Wrench' },
  { id: 'repair', label: 'Repairs', icon: 'Settings' },
  { id: 'cosmetic', label: 'Cosmetic', icon: 'Paintbrush' },
  { id: 'inspection', label: 'Inspection', icon: 'Gauge' },
  { id: 'Wheels', label: 'Wheels', icon: 'Disc' },
  { id: 'Electrical', label: 'Electrical', icon: 'Plug' },
  { id: 'AirVent', label: 'AC', icon: 'AirVent' },
];

// Default quick links for 404 page
const defaultQuickLinks = [
  { name: 'Services', href: '/services' },
  { name: 'Pricing', href: '/#pricing' },
  { name: 'About Us', href: '/#about' },
  { name: 'Contact', href: '/#contact' },
];

export const PagesEditor: React.FC<PagesEditorProps> = ({ onPageChange }) => {
  const { updateField } = useContent();
  const content = usePagesContent();
  const [activePage, setActivePage] = useState<'services' | 'notFound'>('services');
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(['header', 'categories', 'cta', 'title', 'buttons', 'quickLinks'])
  );

  // Simple update function - debouncing handled by ContentContext
  const handleUpdate = (path: string, value: unknown) => {
    updateField('pages', path, value);
  };

  // Call onPageChange on mount and when activePage changes
  useEffect(() => {
    onPageChange?.(activePage);
  }, [activePage, onPageChange]);

  // [LAZY LOADING] Show loading state - MUST be after all hooks
  if (content.isLoading) {
    return <SectionLoader section="Pages" />;
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

  const handlePageChange = (page: 'services' | 'notFound') => {
    setActivePage(page);
  };

  // Theme-aware styling helpers using CSS variables
  const inputClass = `w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl text-sm transition-all bg-background border-border text-foreground placeholder-muted-foreground focus:border-primary border focus:outline-none focus:ring-2 focus:ring-primary/20`;

  const labelClass = `text-sm font-medium text-muted-foreground`;

  const sectionClass = `rounded-xl border overflow-hidden border-border bg-card`;

  const categories = content.services?.categories || defaultCategories;
  const quickLinks = content.notFound?.quickLinks || defaultQuickLinks;

  const addCategory = () => {
    const newCategories = [
      { id: `cat-${Date.now()}`, label: 'New Category', icon: 'Sparkles' },
      ...categories
    ];
    handleUpdate('services.categories', newCategories);
  };

  const updateCategory = (index: number, field: string, value: string) => {
    const newCats = [...categories];
    newCats[index] = { ...newCats[index], [field]: value };
    handleUpdate('services.categories', newCats);
  };

  const deleteCategory = (index: number) => {
    const newCats = categories.filter((_: unknown, i: number) => i !== index);
    handleUpdate('services.categories', newCats);
  };

  const updateQuickLink = (index: number, field: string, value: string) => {
    const newLinks = [...quickLinks];
    newLinks[index] = { ...newLinks[index], [field]: value };
    handleUpdate('notFound.quickLinks', newLinks);
  };

  const deleteQuickLink = (index: number) => {
    const newLinks = quickLinks.filter((_: unknown, i: number) => i !== index);
    handleUpdate('notFound.quickLinks', newLinks);
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Page Tabs */}
      <div className="flex gap-2 p-1 bg-secondary/50 rounded-xl">
        <button
          onClick={() => handlePageChange('services')}
          className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
            activePage === 'services'
              ? 'bg-primary text-primary-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
          }`}
        >
          <Wrench className="w-4 h-4" />
          Services Page
        </button>
        <button
          onClick={() => handlePageChange('notFound')}
          className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
            activePage === 'notFound'
              ? 'bg-primary text-primary-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
          }`}
        >
          <AlertTriangle className="w-4 h-4" />
          404 Page
        </button>
      </div>

      <AnimatePresence mode="wait">
        {/* ==================== SERVICES PAGE ==================== */}
        {activePage === 'services' && (
          <motion.div
            key="services"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="space-y-4"
          >
            {/* Route indicator */}
            <div className="flex items-center gap-2 px-3 py-2 bg-secondary/50 rounded-lg">
              <span className="text-xs text-muted-foreground">Route:</span>
              <code className="text-xs font-mono text-primary">/services</code>
            </div>

            {/* Page Header */}
            <div className={sectionClass}>
              <div 
                onClick={() => toggleSection('header')} 
                onKeyDown={(e) => e.key === 'Enter' && toggleSection('header')}
                role="button"
                tabIndex={0}
                className="w-full flex items-center justify-between p-3 sm:p-4 text-left transition-colors hover:bg-secondary/50 cursor-pointer"
              >
                <div className="flex items-center gap-2 sm:gap-3">
                  <motion.div animate={{ rotate: expandedSections.has('header') ? 90 : 0 }}>
                    <ChevronRight className="w-4 h-4 text-muted-foreground" />
                  </motion.div>
                  <Type className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" />
                  <span className="font-medium text-foreground text-sm sm:text-base">Page Header</span>
                </div>
              </div>

              <AnimatePresence>
                {expandedSections.has('header') && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="p-3 sm:p-4 pt-0 space-y-3 sm:space-y-4 border-t border-border">
                      {/* Page Title */}
                      <div className="space-y-2">
                        <label className={labelClass}>Page Title</label>
                        <input
                          type="text"
                          value={content.services?.title || ''}
                          onChange={(e) => handleUpdate('services.title', e.target.value)}
                          placeholder="Our Services"
                          className={inputClass}
                        />
                      </div>

                      {/* Page Description */}
                      <div className="space-y-2">
                        <label className={labelClass}>Page Description</label>
                        <input
                          type="text"
                          value={content.services?.description || ''}
                          onChange={(e) => handleUpdate('services.description', e.target.value)}
                          placeholder="Professional car care services at transparent prices"
                          className={inputClass}
                        />
                      </div>

                      {/* Search Placeholder */}
                      <div className="space-y-2">
                        <label className={labelClass}>
                          <Search className="w-4 h-4 inline mr-1" />
                          Search Placeholder
                        </label>
                        <input
                          type="text"
                          value={content.services?.searchPlaceholder || ''}
                          onChange={(e) => handleUpdate('services.searchPlaceholder', e.target.value)}
                          placeholder="Search services..."
                          className={inputClass}
                        />
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Category Filters */}
            <div className={sectionClass}>
              <div 
                className="w-full flex items-center justify-between p-3 sm:p-4 text-left transition-colors hover:bg-secondary/50"
              >
                <div 
                  onClick={() => toggleSection('categories')}
                  onKeyDown={(e) => e.key === 'Enter' && toggleSection('categories')}
                  role="button"
                  tabIndex={0}
                  className="flex items-center gap-2 sm:gap-3 flex-1 cursor-pointer"
                >
                  <motion.div animate={{ rotate: expandedSections.has('categories') ? 90 : 0 }}>
                    <ChevronRight className="w-4 h-4 text-muted-foreground" />
                  </motion.div>
                  <Filter className="w-4 h-4 sm:w-5 sm:h-5 text-purple-500" />
                  <span className="font-medium text-foreground text-sm sm:text-base">Category Filters</span>
                  <span className="px-2 py-0.5 rounded-full text-xs bg-secondary text-muted-foreground">
                    {categories.length}
                  </span>
                </div>
                <button
                  onClick={addCategory}
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
                    <div className="p-3 sm:p-4 pt-0 space-y-3 border-t border-border">
                      {categories.map((cat: { id: string; label: string; icon: string }, index: number) => (
                        <div key={cat.id} className="flex items-center gap-2">
                          {/* Category label */}
                          <input
                            type="text"
                            value={cat.label}
                            onChange={(e) => updateCategory(index, 'label', e.target.value)}
                            placeholder="Category Label"
                            className={`flex-1 ${inputClass}`}
                          />
                          {/* Icon dropdown */}
                          <select
                            value={cat.icon}
                            onChange={(e) => updateCategory(index, 'icon', e.target.value)}
                            className={`w-32 ${inputClass}`}
                          >
                            <option value="Sparkles">✨ All</option>
                            <option value="Wrench">🔧 Wrench</option>
                            <option value="AirVent">❄️ AC</option>
                            <option value="Settings">⚙️ Settings</option>
                            <option value="Paintbrush">🎨 Paint</option>
                            <option value="Gauge">📊 Gauge</option>
                            <option value="Disc">🛞 Wheels</option>
                            <option value="Plug">⚡ Electrical</option>
                          </select>
                          {/* Delete button */}
                          <button
                            onClick={() => deleteCategory(index)}
                            className="p-2 rounded-lg text-destructive hover:bg-destructive/10 flex-shrink-0"
                            disabled={categories.length <= 1}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* CTA Section */}
            <div className={sectionClass}>
              <div 
                onClick={() => toggleSection('cta')} 
                onKeyDown={(e) => e.key === 'Enter' && toggleSection('cta')}
                role="button"
                tabIndex={0}
                className="w-full flex items-center justify-between p-3 sm:p-4 text-left transition-colors hover:bg-secondary/50 cursor-pointer"
              >
                <div className="flex items-center gap-2 sm:gap-3">
                  <motion.div animate={{ rotate: expandedSections.has('cta') ? 90 : 0 }}>
                    <ChevronRight className="w-4 h-4 text-muted-foreground" />
                  </motion.div>
                  <Phone className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />
                  <span className="font-medium text-foreground text-sm sm:text-base">Bottom CTA Section</span>
                </div>
              </div>

              <AnimatePresence>
                {expandedSections.has('cta') && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="p-3 sm:p-4 pt-0 space-y-3 sm:space-y-4 border-t border-border">
                      {/* CTA Title */}
                      <div className="space-y-2">
                        <label className={labelClass}>CTA Title</label>
                        <input
                          type="text"
                          value={content.services?.cta?.title || ''}
                          onChange={(e) => handleUpdate('services.cta.title', e.target.value)}
                          placeholder="Can't find what you're looking for?"
                          className={inputClass}
                        />
                      </div>

                      {/* CTA Description */}
                      <div className="space-y-2">
                        <label className={labelClass}>CTA Description</label>
                        <textarea
                          value={content.services?.cta?.description || ''}
                          onChange={(e) => handleUpdate('services.cta.description', e.target.value)}
                          placeholder="Contact us for custom service packages..."
                          rows={2}
                          className={inputClass}
                        />
                      </div>

                      {/* Buttons Section */}
                      <div className="pt-2 border-t border-border">
                        <div className="flex items-center gap-2 mb-3">
                          <MousePointerClick className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm font-medium text-muted-foreground">Action Buttons</span>
                        </div>

                        <div className="grid grid-cols-1 gap-4">
                          {/* Primary Button */}
                          <div className="p-3 rounded-lg bg-secondary/30 space-y-3">
                            <div className="flex items-center gap-2">
                              <div className="w-3 h-3 rounded-full bg-primary"></div>
                              <span className="text-xs font-medium text-foreground">Primary Button (Red)</span>
                            </div>
                            <input
                              type="text"
                              value={content.services?.cta?.primaryButton || ''}
                              onChange={(e) => handleUpdate('services.cta.primaryButton', e.target.value)}
                              placeholder="Contact Us"
                              className={inputClass}
                            />
                          </div>

                          {/* Secondary Button */}
                          <div className="p-3 rounded-lg bg-secondary/30 space-y-3">
                            <div className="flex items-center gap-2">
                              <div className="w-3 h-3 rounded-full bg-secondary border border-border"></div>
                              <span className="text-xs font-medium text-foreground">Secondary Button (Outline)</span>
                            </div>
                            <input
                              type="text"
                              value={content.services?.cta?.secondaryButton || ''}
                              onChange={(e) => handleUpdate('services.cta.secondaryButton', e.target.value)}
                              placeholder="Call Now"
                              className={inputClass}
                            />
                          </div>

                          {/* Phone Number */}
                          <div className="space-y-2">
                            <label className={labelClass}>
                              <Phone className="w-4 h-4 inline mr-1" />
                              Phone Number (for Call button)
                            </label>
                            <input
                              type="text"
                              value={content.services?.cta?.phone || ''}
                              onChange={(e) => handleUpdate('services.cta.phone', e.target.value)}
                              placeholder="+91 98765 43210"
                              className={inputClass}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}

        {/* ==================== 404 PAGE ==================== */}
        {activePage === 'notFound' && (
          <motion.div
            key="notFound"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            {/* Route indicator */}
            <div className="flex items-center gap-2 px-3 py-2 bg-secondary/50 rounded-lg">
              <span className="text-xs text-muted-foreground">Route:</span>
              <code className="text-xs font-mono text-primary">/404</code>
            </div>

            {/* Page Content */}
            <div className={sectionClass}>
              <div 
                onClick={() => toggleSection('title')} 
                onKeyDown={(e) => e.key === 'Enter' && toggleSection('title')}
                role="button"
                tabIndex={0}
                className="w-full flex items-center justify-between p-3 sm:p-4 text-left transition-colors hover:bg-secondary/50 cursor-pointer"
              >
                <div className="flex items-center gap-2 sm:gap-3">
                  <motion.div animate={{ rotate: expandedSections.has('title') ? 90 : 0 }}>
                    <ChevronRight className="w-4 h-4 text-muted-foreground" />
                  </motion.div>
                  <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500" />
                  <span className="font-medium text-foreground text-sm sm:text-base">Page Content</span>
                </div>
              </div>

              <AnimatePresence>
                {expandedSections.has('title') && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="p-3 sm:p-4 pt-0 space-y-3 sm:space-y-4 border-t border-border">
                      {/* Error Title */}
                      <div className="space-y-2">
                        <label className={labelClass}>Error Title</label>
                        <input
                          type="text"
                          value={content.notFound?.title || ''}
                          onChange={(e) => handleUpdate('notFound.title', e.target.value)}
                          placeholder="Page Not Found"
                          className={inputClass}
                        />
                      </div>

                      {/* Error Description */}
                      <div className="space-y-2">
                        <label className={labelClass}>Error Description</label>
                        <textarea
                          value={content.notFound?.description || ''}
                          onChange={(e) => handleUpdate('notFound.description', e.target.value)}
                          placeholder="Looks like you've taken a wrong turn..."
                          rows={2}
                          className={inputClass}
                        />
                      </div>

                      {/* Search Placeholder */}
                      <div className="space-y-2">
                        <label className={labelClass}>
                          <Search className="w-4 h-4 inline mr-1" />
                          Search Placeholder
                        </label>
                        <input
                          type="text"
                          value={content.notFound?.searchPlaceholder || ''}
                          onChange={(e) => handleUpdate('notFound.searchPlaceholder', e.target.value)}
                          placeholder="Search for services..."
                          className={inputClass}
                        />
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Action Buttons */}
            <div className={sectionClass}>
              <div 
                onClick={() => toggleSection('buttons')} 
                onKeyDown={(e) => e.key === 'Enter' && toggleSection('buttons')}
                role="button"
                tabIndex={0}
                className="w-full flex items-center justify-between p-3 sm:p-4 text-left transition-colors hover:bg-secondary/50 cursor-pointer"
              >
                <div className="flex items-center gap-2 sm:gap-3">
                  <motion.div animate={{ rotate: expandedSections.has('buttons') ? 90 : 0 }}>
                    <ChevronRight className="w-4 h-4 text-muted-foreground" />
                  </motion.div>
                  <Home className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500" />
                  <span className="font-medium text-foreground text-sm sm:text-base">Action Buttons</span>
                </div>
              </div>

              <AnimatePresence>
                {expandedSections.has('buttons') && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="p-3 sm:p-4 pt-0 space-y-3 sm:space-y-4 border-t border-border">
                      <div className="grid grid-cols-1 gap-4">
                        {/* Primary Button */}
                        <div className="p-3 rounded-lg bg-secondary/30 space-y-3">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-primary"></div>
                            <span className="text-xs font-medium text-foreground">Primary Button (Red)</span>
                          </div>
                          <input
                            type="text"
                            value={content.notFound?.primaryButton || ''}
                            onChange={(e) => handleUpdate('notFound.primaryButton', e.target.value)}
                            placeholder="Back to Home"
                            className={inputClass}
                          />
                        </div>

                        {/* Secondary Button */}
                        <div className="p-3 rounded-lg bg-secondary/30 space-y-3">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-secondary border border-border"></div>
                            <span className="text-xs font-medium text-foreground">Secondary Button (Outline)</span>
                          </div>
                          <input
                            type="text"
                            value={content.notFound?.secondaryButton || ''}
                            onChange={(e) => handleUpdate('notFound.secondaryButton', e.target.value)}
                            placeholder="Go Back"
                            className={inputClass}
                          />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Quick Links */}
            <div className={sectionClass}>
              <div 
                className="w-full flex items-center justify-between p-3 sm:p-4 text-left transition-colors hover:bg-secondary/50"
              >
                <div 
                  onClick={() => toggleSection('quickLinks')}
                  onKeyDown={(e) => e.key === 'Enter' && toggleSection('quickLinks')}
                  role="button"
                  tabIndex={0}
                  className="flex items-center gap-2 sm:gap-3 flex-1 cursor-pointer"
                >
                  <motion.div animate={{ rotate: expandedSections.has('quickLinks') ? 90 : 0 }}>
                    <ChevronRight className="w-4 h-4 text-muted-foreground" />
                  </motion.div>
                  <Link className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" />
                  <span className="font-medium text-foreground text-sm sm:text-base">Quick Links</span>
                  <span className="px-2 py-0.5 rounded-full text-xs bg-secondary text-muted-foreground">
                    {quickLinks.length}
                  </span>
                </div>
              </div>

              <AnimatePresence>
                {expandedSections.has('quickLinks') && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="p-3 sm:p-4 pt-0 space-y-3 border-t border-border">
                      <p className="text-xs text-muted-foreground">
                        Links shown at the bottom of the 404 page
                      </p>
                      
                      {quickLinks.map((link: { name: string; href: string }, index: number) => (
                        <div key={index} className="flex items-center gap-2">
                          {/* Quick link name */}
                          <input
                            type="text"
                            value={link.name}
                            onChange={(e) => updateQuickLink(index, 'name', e.target.value)}
                            placeholder="Link Name"
                            className={`flex-1 ${inputClass}`}
                          />
                          {/* Quick link href */}
                          <input
                            type="text"
                            value={link.href}
                            onChange={(e) => updateQuickLink(index, 'href', e.target.value)}
                            placeholder="/page or #section"
                            className={`w-32 sm:w-40 ${inputClass}`}
                          />
                          {/* Delete button */}
                          <button
                            onClick={() => deleteQuickLink(index)}
                            className="p-2 rounded-lg text-destructive hover:bg-destructive/10 flex-shrink-0"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}

                      {quickLinks.length === 0 && (
                        <p className="text-center py-4 text-sm text-muted-foreground">
                          No quick links.{' '}
                          <button 
                            onClick={() => handleUpdate('notFound.quickLinks', defaultQuickLinks)} 
                            className="text-primary hover:underline"
                          >
                            Add defaults
                          </button>
                        </p>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PagesEditor;