import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MapPin,
  ChevronRight,
  Plus,
  Trash2,
  GripVertical,
  FileText,
  Building,
  Headphones,
  Copyright,
  Phone,
  Mail,
  Clock,
  Image,
  Share2,
} from 'lucide-react';
import { useFooterContent } from '../../hooks/useContentHooks';
import { useContent } from '../../context/ContentContext';
import { ImageUpload } from '../shared/ImageUpload';
import { SectionLoader } from '../shared/SectionLoader';

interface FooterEditorProps {
  isDarkMode: boolean;
}

export const FooterEditor: React.FC<FooterEditorProps> = ({ }) => {
  const { updateField } = useContent();
  const content = useFooterContent();

  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(['brand', 'contact', 'services', 'company', 'support', 'cities'])
  );

  // [LAZY LOADING] Show loading state - MUST be after all hooks
  if (content.isLoading) {
    return <SectionLoader section="Footer" />;
  }

  const handleUpdate = (path: string, value: unknown) => {
    updateField('footer', path, value);
  };

  const toggleSection = (section: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(section)) {
      newExpanded.delete(section);
    } else {
      newExpanded.add(section);
    }
    setExpandedSections(newExpanded);
  };

  const inputClass = `w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl text-sm transition-all bg-background border-border text-foreground placeholder-muted-foreground focus:border-primary border focus:outline-none focus:ring-2 focus:ring-primary/20`;
  const labelClass = `text-sm font-medium text-muted-foreground`;
  const sectionClass = `rounded-xl border overflow-hidden border-border bg-card`;
  const sectionHeaderClass = `w-full flex items-center justify-between p-3 sm:p-4 text-left transition-colors hover:bg-secondary/50`;

  const LinkEditor = ({
    links,
    path,
    addLabel,
  }: {
    links: Array<{ name?: string; href: string }> | undefined;
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
          handleUpdate(path, [{ name: 'New Link', href: '#' }, ...(links || [])]);
        }}
        className="text-sm text-primary font-medium"
      >
        + {addLabel}
      </button>
    </div>
  );

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Brand / Logo */}
      <div className={sectionClass}>
        <button onClick={() => toggleSection('brand')} className={sectionHeaderClass}>
          <div className="flex items-center gap-2 sm:gap-3">
            <motion.div animate={{ rotate: expandedSections.has('brand') ? 90 : 0 }}>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </motion.div>
            <Image className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" />
            <span className="font-medium text-foreground text-sm sm:text-base">Brand & Description</span>
          </div>
        </button>

        <AnimatePresence>
          {expandedSections.has('brand') && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="p-3 sm:p-4 pt-0 space-y-3 sm:space-y-4 border-t border-border">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div className="space-y-2">
                    <label className={labelClass}>Brand Name</label>
                    <input
                      type="text"
                      value={content.brandName || ''}
                      onChange={(e) => handleUpdate('brandName', e.target.value)}
                      placeholder="Addax"
                      className={inputClass}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className={labelClass}>Tagline</label>
                    <input
                      type="text"
                      value={content.tagline || ''}
                      onChange={(e) => handleUpdate('tagline', e.target.value)}
                      placeholder="Automotive"
                      className={inputClass}
                    />
                  </div>
                </div>

                {/* Logo Image Upload */}
                <ImageUpload
                  value={content.logoUrl || ''}
                  onChange={(url) => handleUpdate('logoUrl', url)}
                  label="Footer Logo"
                  placeholder="Upload image or enter URL"
                  previewHeight="h-40"
                  maxSizeMB={2}
                  maxWidthOrHeight={1920}
                  helperText="Recommended: Transparent PNG or SVG logo"
                  showAltInput={false}
                  compact={false}
                />

                <div className="space-y-2">
                  <label className={labelClass}>Footer Description</label>
                  <textarea
                    value={content.description || ''}
                    onChange={(e) => handleUpdate('description', e.target.value)}
                    placeholder="India's leading car service network offering quality repairs at transparent prices with doorstep convenience."
                    rows={3}
                    className={inputClass}
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Contact Information */}
      <div className={sectionClass}>
        <button onClick={() => toggleSection('contact')} className={sectionHeaderClass}>
          <div className="flex items-center gap-2 sm:gap-3">
            <motion.div animate={{ rotate: expandedSections.has('contact') ? 90 : 0 }}>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </motion.div>
            <Phone className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />
            <span className="font-medium text-foreground text-sm sm:text-base">Contact Information</span>
          </div>
        </button>

        <AnimatePresence>
          {expandedSections.has('contact') && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="p-3 sm:p-4 pt-0 space-y-3 sm:space-y-4 border-t border-border">
                <div className="space-y-2">
                  <label className={labelClass}>
                    <MapPin className="w-4 h-4 inline mr-1" />
                    Address
                  </label>
                  <textarea
                    value={content.contact?.address || ''}
                    onChange={(e) => handleUpdate('contact.address', e.target.value)}
                    placeholder="123 Auto Street, Coimbatore, Tamil Nadu 641001"
                    rows={2}
                    className={inputClass}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div className="space-y-2">
                    <label className={labelClass}>
                      <Phone className="w-4 h-4 inline mr-1" />
                      Phone
                    </label>
                    <input
                      type="text"
                      value={content.contact?.phone || ''}
                      onChange={(e) => handleUpdate('contact.phone', e.target.value)}
                      placeholder="+91 98765 43210"
                      className={inputClass}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className={labelClass}>
                      <Mail className="w-4 h-4 inline mr-1" />
                      Email
                    </label>
                    <input
                      type="email"
                      value={content.contact?.email || ''}
                      onChange={(e) => handleUpdate('contact.email', e.target.value)}
                      placeholder="hello@addax.auto"
                      className={inputClass}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className={labelClass}>
                    <Clock className="w-4 h-4 inline mr-1" />
                    Working Hours
                  </label>
                  <input
                    type="text"
                    value={content.contact?.hours || ''}
                    onChange={(e) => handleUpdate('contact.hours', e.target.value)}
                    placeholder="Mon - Sat: 8:00 AM - 7:00 PM"
                    className={inputClass}
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Social Media Links */}
      <div className={sectionClass}>
        <button onClick={() => toggleSection('social')} className={sectionHeaderClass}>
          <div className="flex items-center gap-2 sm:gap-3">
            <motion.div animate={{ rotate: expandedSections.has('social') ? 90 : 0 }}>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </motion.div>
            <Share2 className="w-4 h-4 sm:w-5 sm:h-5 text-pink-500" />
            <span className="font-medium text-foreground text-sm sm:text-base">Social Media</span>
          </div>
        </button>

        <AnimatePresence>
          {expandedSections.has('social') && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="p-3 sm:p-4 pt-0 space-y-3 sm:space-y-4 border-t border-border">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div className="space-y-2">
                    <label className={labelClass}>Facebook</label>
                    <input
                      type="text"
                      value={content.social?.facebook || ''}
                      onChange={(e) => handleUpdate('social.facebook', e.target.value)}
                      placeholder="https://facebook.com/..."
                      className={inputClass}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className={labelClass}>Instagram</label>
                    <input
                      type="text"
                      value={content.social?.instagram || ''}
                      onChange={(e) => handleUpdate('social.instagram', e.target.value)}
                      placeholder="https://instagram.com/..."
                      className={inputClass}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className={labelClass}>Twitter / X</label>
                    <input
                      type="text"
                      value={content.social?.twitter || ''}
                      onChange={(e) => handleUpdate('social.twitter', e.target.value)}
                      placeholder="https://twitter.com/..."
                      className={inputClass}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className={labelClass}>YouTube</label>
                    <input
                      type="text"
                      value={content.social?.youtube || ''}
                      onChange={(e) => handleUpdate('social.youtube', e.target.value)}
                      placeholder="https://youtube.com/..."
                      className={inputClass}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className={labelClass}>LinkedIn</label>
                    <input
                      type="text"
                      value={(content.social as any)?.linkedin || ''}
                      onChange={(e) => handleUpdate('social.linkedin', e.target.value)}
                      placeholder="https://linkedin.com/..."
                      className={inputClass}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className={labelClass}>WhatsApp</label>
                    <input
                      type="text"
                      value={(content.social as any)?.whatsapp || ''}
                      onChange={(e) => handleUpdate('social.whatsapp', e.target.value)}
                      placeholder="https://wa.me/919876543210"
                      className={inputClass}
                    />
                  </div>
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
            <Building className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-500" />
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
        <div
          onClick={() => toggleSection('cities')}
          onKeyDown={(e) => e.key === 'Enter' && toggleSection('cities')}
          role="button"
          tabIndex={0}
          className={`${sectionHeaderClass} cursor-pointer`}
        >
          <div className="flex items-center gap-2 sm:gap-3">
            <motion.div animate={{ rotate: expandedSections.has('cities') ? 90 : 0 }}>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </motion.div>
            <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-red-500" />
            <span className="font-medium text-foreground text-sm sm:text-base">Service Cities (We Serve)</span>
            <span className="px-2 py-0.5 rounded-full text-xs bg-secondary text-muted-foreground">
              {content.links?.cities?.length || 0}
            </span>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleUpdate('links.cities', ['New City', ...(content.links?.cities || [])]);
            }}
            className="p-2 rounded-lg bg-secondary hover:bg-secondary/80 text-foreground"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

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
                    No cities added. <button onClick={() => handleUpdate('links.cities', ['Coimbatore', 'Chennai', 'Bangalore'])} className="text-primary">Add defaults</button>
                  </p>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Copyright & Bottom Bar */}
      <div className={sectionClass}>
        <button onClick={() => toggleSection('copyright')} className={sectionHeaderClass}>
          <div className="flex items-center gap-2 sm:gap-3">
            <motion.div animate={{ rotate: expandedSections.has('copyright') ? 90 : 0 }}>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </motion.div>
            <Copyright className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />
            <span className="font-medium text-foreground text-sm sm:text-base">Copyright & Bottom Bar</span>
          </div>
        </button>

        <AnimatePresence>
          {expandedSections.has('copyright') && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="p-3 sm:p-4 pt-0 space-y-3 sm:space-y-4 border-t border-border">
                <div className="space-y-2">
                  <label className={labelClass}>Copyright Text</label>
                  <input
                    type="text"
                    value={typeof content.copyright === 'string' ? content.copyright : (content.copyright?.text || '')}
                    onChange={(e) => handleUpdate('copyright', e.target.value)}
                    placeholder="© {year} Addax Automotive. All rights reserved."
                    className={inputClass}
                  />
                  <p className="text-xs text-muted-foreground">
                    Use <code className="px-1 py-0.5 rounded bg-muted">{'{year}'}</code> to auto-insert current year
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div className="space-y-2">
                    <label className={labelClass}>Privacy Policy URL</label>
                    <input
                      type="text"
                      value={content.privacyUrl || ''}
                      onChange={(e) => handleUpdate('privacyUrl', e.target.value)}
                      placeholder="/privacy-policy"
                      className={inputClass}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className={labelClass}>Terms of Service URL</label>
                    <input
                      type="text"
                      value={content.termsUrl || ''}
                      onChange={(e) => handleUpdate('termsUrl', e.target.value)}
                      placeholder="/terms-of-service"
                      className={inputClass}
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default FooterEditor;