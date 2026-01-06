import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutGrid,
  Type,
  MapPin,
  ChevronRight,
  Plus,
  Trash2,
  GripVertical,
  FileText,
  Building,
  Headphones,
  Copyright,
} from 'lucide-react';
import { useFooterContent } from '../../hooks/useContentHooks';
import { useContent } from '../../context/ContentContext';

interface FooterEditorProps {
  isDarkMode: boolean;
}

export const FooterEditor: React.FC<FooterEditorProps> = ({ }) => {
  const { updateField } = useContent();
  const content = useFooterContent();
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(['description', 'services', 'company', 'support', 'cities'])
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
    updateField('footer', path, value);
  };

  // Theme-aware styling helpers using CSS variables
  const inputClass = `w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl text-sm transition-all bg-secondary border-border text-foreground placeholder-muted-foreground focus:border-primary border focus:outline-none focus:ring-2 focus:ring-primary/20`;

  const labelClass = `text-sm font-medium text-muted-foreground`;

  const sectionClass = `rounded-xl border overflow-hidden border-border bg-card`;

  const sectionHeaderClass = `w-full flex items-center justify-between p-3 sm:p-4 text-left transition-colors hover:bg-secondary/50`;

  // Link editor component
  const LinkEditor = ({
    links,
    path,
    addLabel,
  }: {
    links: Array<{ name: string; href: string }> | undefined;
    path: string;
    addLabel: string;
  }) => (
    <div className="space-y-3">
      {links?.map((link, index) => (
        <div key={index} className="flex flex-col sm:flex-row sm:items-center gap-2">
          <div className="flex items-center gap-2 flex-1">
            <GripVertical className="w-4 h-4 cursor-grab text-muted-foreground hidden sm:block flex-shrink-0" />
            <input
              type="text"
              value={link.name || ''}
              onChange={(e) => {
                const newLinks = [...(links || [])];
                newLinks[index] = { ...newLinks[index], name: e.target.value };
                handleUpdate(path, newLinks);
              }}
              placeholder="Link Name"
              className={`flex-1 ${inputClass}`}
            />
          </div>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={link.href || ''}
              onChange={(e) => {
                const newLinks = [...(links || [])];
                newLinks[index] = { ...newLinks[index], href: e.target.value };
                handleUpdate(path, newLinks);
              }}
              placeholder="#section or /page"
              className={`flex-1 sm:w-40 ${inputClass}`}
            />
            <button
              onClick={() => {
                const newLinks = links?.filter((_: unknown, i: number) => i !== index);
                handleUpdate(path, newLinks);
              }}
              className="p-2 rounded-lg text-destructive hover:bg-destructive/10 flex-shrink-0"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      ))}
      <button
        onClick={() => {
          handleUpdate(path, [...(links || []), { name: 'New Link', href: '#' }]);
        }}
        className="text-sm text-primary font-medium"
      >
        + {addLabel}
      </button>
    </div>
  );

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 pb-4 border-b border-border">
        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-gray-600 to-gray-800 flex items-center justify-center flex-shrink-0">
          <LayoutGrid className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
        </div>
        <div className="min-w-0">
          <h2 className="text-lg sm:text-xl font-bold text-foreground truncate">
            Footer Editor
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Footer links, cities, and copyright
          </p>
        </div>
      </div>

      {/* Description */}
      <div className={sectionClass}>
        <button onClick={() => toggleSection('description')} className={sectionHeaderClass}>
          <div className="flex items-center gap-2 sm:gap-3">
            <motion.div animate={{ rotate: expandedSections.has('description') ? 90 : 0 }}>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </motion.div>
            <Type className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" />
            <span className="font-medium text-foreground text-sm sm:text-base">Description & Copyright</span>
          </div>
        </button>

        <AnimatePresence>
          {expandedSections.has('description') && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="p-3 sm:p-4 pt-0 space-y-3 sm:space-y-4 border-t border-border">
                <div className="space-y-2">
                  <label className={labelClass}>Footer Description</label>
                  <textarea
                    value={content.description || ''}
                    onChange={(e) => handleUpdate('description', e.target.value)}
                    placeholder="India's leading car service network..."
                    rows={3}
                    className={inputClass}
                  />
                </div>

                <div className="space-y-2">
                  <label className={labelClass}>
                    <Copyright className="w-4 h-4 inline mr-1" />
                    Copyright Text
                  </label>
                  <input
                    type="text"
                    value={content.copyright || ''}
                    onChange={(e) => handleUpdate('copyright', e.target.value)}
                    placeholder="© {year} Addax Automotive. All rights reserved."
                    className={inputClass}
                  />
                  <p className="text-xs text-muted-foreground">
                    Use <code className="px-1 py-0.5 rounded bg-muted">{'{year}'}</code> to auto-insert current year
                  </p>
                </div>

                {/* Copyright Preview */}
                <div className="p-3 rounded-lg bg-secondary">
                  <p className="text-sm text-muted-foreground">
                    {(content.copyright || '© {year} Addax Automotive').replace('{year}', new Date().getFullYear().toString())}
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Services Links */}
      <div className={sectionClass}>
        <button onClick={() => toggleSection('services')} className={sectionHeaderClass}>
          <div className="flex items-center gap-2 sm:gap-3">
            <motion.div animate={{ rotate: expandedSections.has('services') ? 90 : 0 }}>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </motion.div>
            <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500" />
            <span className="font-medium text-foreground text-sm sm:text-base">Services Links</span>
            <span className="px-2 py-0.5 rounded-full text-xs bg-secondary text-muted-foreground">
              {content.links?.services?.length || 0}
            </span>
          </div>
        </button>

        <AnimatePresence>
          {expandedSections.has('services') && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="p-3 sm:p-4 pt-0 border-t border-border">
                <LinkEditor
                  links={content.links?.services}
                  path="links.services"
                  addLabel="Add Service Link"
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Company Links */}
      <div className={sectionClass}>
        <button onClick={() => toggleSection('company')} className={sectionHeaderClass}>
          <div className="flex items-center gap-2 sm:gap-3">
            <motion.div animate={{ rotate: expandedSections.has('company') ? 90 : 0 }}>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </motion.div>
            <Building className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />
            <span className="font-medium text-foreground text-sm sm:text-base">Company Links</span>
            <span className="px-2 py-0.5 rounded-full text-xs bg-secondary text-muted-foreground">
              {content.links?.company?.length || 0}
            </span>
          </div>
        </button>

        <AnimatePresence>
          {expandedSections.has('company') && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="p-3 sm:p-4 pt-0 border-t border-border">
                <LinkEditor
                  links={content.links?.company}
                  path="links.company"
                  addLabel="Add Company Link"
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Support Links */}
      <div className={sectionClass}>
        <button onClick={() => toggleSection('support')} className={sectionHeaderClass}>
          <div className="flex items-center gap-2 sm:gap-3">
            <motion.div animate={{ rotate: expandedSections.has('support') ? 90 : 0 }}>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </motion.div>
            <Headphones className="w-4 h-4 sm:w-5 sm:h-5 text-purple-500" />
            <span className="font-medium text-foreground text-sm sm:text-base">Support Links</span>
            <span className="px-2 py-0.5 rounded-full text-xs bg-secondary text-muted-foreground">
              {content.links?.support?.length || 0}
            </span>
          </div>
        </button>

        <AnimatePresence>
          {expandedSections.has('support') && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="p-3 sm:p-4 pt-0 border-t border-border">
                <LinkEditor
                  links={content.links?.support}
                  path="links.support"
                  addLabel="Add Support Link"
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Cities */}
      <div className={sectionClass}>
        <button onClick={() => toggleSection('cities')} className={sectionHeaderClass}>
          <div className="flex items-center gap-2 sm:gap-3">
            <motion.div animate={{ rotate: expandedSections.has('cities') ? 90 : 0 }}>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </motion.div>
            <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-red-500" />
            <span className="font-medium text-foreground text-sm sm:text-base">Service Cities</span>
            <span className="px-2 py-0.5 rounded-full text-xs bg-secondary text-muted-foreground">
              {content.links?.cities?.length || 0}
            </span>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleUpdate('links.cities', [...(content.links?.cities || []), 'New City']);
            }}
            className="p-2 rounded-lg bg-secondary hover:bg-secondary/80 text-foreground"
          >
            <Plus className="w-4 h-4" />
          </button>
        </button>

        <AnimatePresence>
          {expandedSections.has('cities') && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="p-3 sm:p-4 pt-0 space-y-3 border-t border-border">
                {content.links?.cities?.map((city: string, index: number) => (
                  <div key={index} className="flex items-center gap-2">
                    <GripVertical className="w-4 h-4 cursor-grab text-muted-foreground hidden sm:block" />
                    <MapPin className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                    <input
                      type="text"
                      value={city || ''}
                      onChange={(e) => {
                        const newCities = [...(content.links?.cities || [])];
                        newCities[index] = e.target.value;
                        handleUpdate('links.cities', newCities);
                      }}
                      placeholder="City Name"
                      className={`flex-1 ${inputClass}`}
                    />
                    <button
                      onClick={() => {
                        const newCities = content.links?.cities?.filter((_: unknown, i: number) => i !== index);
                        handleUpdate('links.cities', newCities);
                      }}
                      className="p-2 rounded-lg text-destructive hover:bg-destructive/10 flex-shrink-0"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}

                {(!content.links?.cities || content.links.cities.length === 0) && (
                  <p className="text-center py-4 text-sm text-muted-foreground">
                    No cities added. <button onClick={() => handleUpdate('links.cities', ['Coimbatore'])} className="text-primary">Add one</button>
                  </p>
                )}

                {/* Cities Preview */}
                {content.links?.cities && content.links.cities.length > 0 && (
                  <div className="p-3 sm:p-4 rounded-xl bg-secondary">
                    <p className="text-xs uppercase tracking-wider mb-3 text-muted-foreground">
                      Cities Preview
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {content.links.cities.map((city: string, i: number) => (
                        <span
                          key={i}
                          className="px-3 py-1 rounded-full text-xs sm:text-sm bg-card text-muted-foreground"
                        >
                          📍 {city}
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

      {/* Footer Preview */}
      <div className="p-3 sm:p-4 rounded-xl bg-secondary">
        <p className="text-xs uppercase tracking-wider mb-4 text-muted-foreground">
          Footer Layout Preview
        </p>
        <div className="p-4 sm:p-6 rounded-xl bg-gray-800">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 text-sm">
            {/* Brand Column */}
            <div className="col-span-2 sm:col-span-1">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
                  <span className="text-white font-bold text-sm">A</span>
                </div>
                <span className="font-bold text-white">Addax</span>
              </div>
              <p className="text-gray-400 text-xs line-clamp-3">
                {content.description?.substring(0, 80)}...
              </p>
            </div>

            {/* Services */}
            <div>
              <p className="font-semibold text-white mb-2 text-xs sm:text-sm">Services</p>
              <div className="space-y-1">
                {content.links?.services?.slice(0, 4).map((link: { name: string; href: string }, i: number) => (
                  <p key={i} className="text-gray-400 text-[10px] sm:text-xs truncate">{link.name}</p>
                ))}
              </div>
            </div>

            {/* Company */}
            <div>
              <p className="font-semibold text-white mb-2 text-xs sm:text-sm">Company</p>
              <div className="space-y-1">
                {content.links?.company?.slice(0, 4).map((link: { name: string; href: string }, i: number) => (
                  <p key={i} className="text-gray-400 text-[10px] sm:text-xs truncate">{link.name}</p>
                ))}
              </div>
            </div>

            {/* Cities */}
            <div>
              <p className="font-semibold text-white mb-2 text-xs sm:text-sm">Cities</p>
              <div className="flex flex-wrap gap-1">
                {content.links?.cities?.slice(0, 6).map((city: string, i: number) => (
                  <span key={i} className="text-gray-400 text-[10px] sm:text-xs">{city}{i < 5 ? ',' : ''}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Copyright */}
          <div className="mt-4 sm:mt-6 pt-4 border-t border-gray-700">
            <p className="text-gray-500 text-[10px] sm:text-xs text-center">
              {(content.copyright || '© {year} Addax Automotive').replace('{year}', new Date().getFullYear().toString())}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FooterEditor;