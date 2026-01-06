import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText,
  Type,
  Search,
  Link,
  ChevronRight,
  AlertTriangle,
  Wrench,
  Home,
  ArrowRight,
} from 'lucide-react';
import { usePagesContent } from '../../hooks/useContentHooks';
import { useContent } from '../../context/ContentContext';

interface PagesEditorProps {
  isDarkMode: boolean;
}

export const PagesEditor: React.FC<PagesEditorProps> = ({ isDarkMode }) => {
  const { updateField } = useContent();
  const content = usePagesContent();
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(['services', 'notFound'])
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
    updateField('pages', path, value);
  };

  // Styling helpers
  const inputClass = `w-full px-4 py-3 rounded-xl text-sm transition-all ${
    isDarkMode
      ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:border-orange-500'
      : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400 focus:border-orange-500'
  } border focus:outline-none focus:ring-2 focus:ring-orange-500/20`;

  const labelClass = `text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`;

  const sectionClass = `rounded-xl border overflow-hidden ${
    isDarkMode ? 'border-gray-700 bg-gray-800/50' : 'border-gray-200 bg-gray-50'
  }`;

  const sectionHeaderClass = `w-full flex items-center justify-between p-4 text-left transition-colors ${
    isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
  }`;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 pb-4 border-b border-gray-200 dark:border-gray-700">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center">
          <FileText className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Pages Editor
          </h2>
          <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            Services page and 404 Not Found page content
          </p>
        </div>
      </div>

      {/* Services Page */}
      <div className={sectionClass}>
        <button onClick={() => toggleSection('services')} className={sectionHeaderClass}>
          <div className="flex items-center gap-3">
            <motion.div animate={{ rotate: expandedSections.has('services') ? 90 : 0 }}>
              <ChevronRight className="w-4 h-4" />
            </motion.div>
            <Wrench className="w-5 h-5 text-orange-500" />
            <span className="font-medium">Services Page</span>
            <span className={`px-2 py-0.5 rounded-full text-xs ${isDarkMode ? 'bg-orange-900/30 text-orange-400' : 'bg-orange-100 text-orange-700'}`}>
              /services
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
              <div className={`p-4 pt-0 space-y-4 border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                {/* Page Header */}
                <div className="space-y-4">
                  <h4 className={`font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Page Header
                  </h4>
                  
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

                  <div className="space-y-2">
                    <label className={labelClass}>Page Description</label>
                    <textarea
                      value={content.services?.description || ''}
                      onChange={(e) => handleUpdate('services.description', e.target.value)}
                      placeholder="Comprehensive car care solutions for every need..."
                      rows={2}
                      className={inputClass}
                    />
                  </div>
                </div>

                {/* CTA Section */}
                <div className={`p-4 rounded-xl border ${isDarkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'}`}>
                  <h4 className={`font-medium mb-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Bottom CTA Section
                  </h4>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className={labelClass}>CTA Title</label>
                      <input
                        type="text"
                        value={content.services?.ctaSection?.title || ''}
                        onChange={(e) => handleUpdate('services.ctaSection.title', e.target.value)}
                        placeholder="Can't find what you're looking for?"
                        className={inputClass}
                      />
                    </div>

                    <div className="space-y-2">
                      <label className={labelClass}>CTA Description</label>
                      <textarea
                        value={content.services?.ctaSection?.description || ''}
                        onChange={(e) => handleUpdate('services.ctaSection.description', e.target.value)}
                        placeholder="Contact us for custom service packages..."
                        rows={2}
                        className={inputClass}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className={labelClass}>Primary Button</label>
                        <input
                          type="text"
                          value={content.services?.ctaSection?.primaryCta || ''}
                          onChange={(e) => handleUpdate('services.ctaSection.primaryCta', e.target.value)}
                          placeholder="Contact Us"
                          className={inputClass}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className={labelClass}>Secondary Button</label>
                        <input
                          type="text"
                          value={content.services?.ctaSection?.secondaryCta || ''}
                          onChange={(e) => handleUpdate('services.ctaSection.secondaryCta', e.target.value)}
                          placeholder="Call Now"
                          className={inputClass}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Preview */}
                <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
                  <p className={`text-xs uppercase tracking-wider mb-4 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                    Services Page Preview
                  </p>
                  
                  {/* Page Header Preview */}
                  <div className={`p-6 rounded-xl mb-4 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
                    <div className="flex items-center gap-2 mb-2">
                      <Wrench className="w-5 h-5 text-orange-500" />
                      <span className={`text-xs px-2 py-0.5 rounded-full ${isDarkMode ? 'bg-orange-900/30 text-orange-400' : 'bg-orange-100 text-orange-700'}`}>
                        /services
                      </span>
                    </div>
                    <h3 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {content.services?.title || 'Our Services'}
                    </h3>
                    <p className={`mt-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      {content.services?.description || 'Comprehensive car care solutions...'}
                    </p>
                  </div>

                  {/* CTA Preview */}
                  <div className={`p-6 rounded-xl ${isDarkMode ? 'bg-gradient-to-r from-orange-900/50 to-red-900/50' : 'bg-gradient-to-r from-orange-50 to-red-50'}`}>
                    <h4 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {content.services?.ctaSection?.title || "Can't find what you're looking for?"}
                    </h4>
                    <p className={`mt-1 text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      {content.services?.ctaSection?.description || 'Contact us for custom service packages...'}
                    </p>
                    <div className="flex gap-3 mt-4">
                      <button className="px-4 py-2 rounded-lg bg-orange-500 text-white text-sm font-medium">
                        {content.services?.ctaSection?.primaryCta || 'Contact Us'}
                      </button>
                      <button className={`px-4 py-2 rounded-lg text-sm font-medium ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-white text-gray-900'}`}>
                        {content.services?.ctaSection?.secondaryCta || 'Call Now'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 404 Not Found Page */}
      <div className={sectionClass}>
        <button onClick={() => toggleSection('notFound')} className={sectionHeaderClass}>
          <div className="flex items-center gap-3">
            <motion.div animate={{ rotate: expandedSections.has('notFound') ? 90 : 0 }}>
              <ChevronRight className="w-4 h-4" />
            </motion.div>
            <AlertTriangle className="w-5 h-5 text-red-500" />
            <span className="font-medium">404 Not Found Page</span>
            <span className={`px-2 py-0.5 rounded-full text-xs ${isDarkMode ? 'bg-red-900/30 text-red-400' : 'bg-red-100 text-red-700'}`}>
              Error Page
            </span>
          </div>
        </button>

        <AnimatePresence>
          {expandedSections.has('notFound') && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className={`p-4 pt-0 space-y-4 border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                {/* Main Content */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className={labelClass}>
                      <Type className="w-4 h-4 inline mr-1" />
                      Error Title
                    </label>
                    <input
                      type="text"
                      value={content.notFound?.title || ''}
                      onChange={(e) => handleUpdate('notFound.title', e.target.value)}
                      placeholder="Page not found"
                      className={inputClass}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className={labelClass}>Error Description</label>
                    <textarea
                      value={content.notFound?.description || ''}
                      onChange={(e) => handleUpdate('notFound.description', e.target.value)}
                      placeholder="Sorry, we couldn't find the page you're looking for..."
                      rows={2}
                      className={inputClass}
                    />
                  </div>
                </div>

                {/* Search */}
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

                {/* CTAs */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className={labelClass}>
                      <Home className="w-4 h-4 inline mr-1" />
                      Primary CTA
                    </label>
                    <input
                      type="text"
                      value={content.notFound?.primaryCta || ''}
                      onChange={(e) => handleUpdate('notFound.primaryCta', e.target.value)}
                      placeholder="Go to Homepage"
                      className={inputClass}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className={labelClass}>
                      <ArrowRight className="w-4 h-4 inline mr-1" />
                      Secondary CTA
                    </label>
                    <input
                      type="text"
                      value={content.notFound?.secondaryCta || ''}
                      onChange={(e) => handleUpdate('notFound.secondaryCta', e.target.value)}
                      placeholder="Contact Support"
                      className={inputClass}
                    />
                  </div>
                </div>

                {/* Quick Links */}
                <div className={`p-4 rounded-xl border ${isDarkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'}`}>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className={`font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      <Link className="w-4 h-4 inline mr-1" />
                      Quick Links
                    </h4>
                    <button
                      onClick={() => {
                        const newLinks = [...(content.notFound?.quickLinks || []), { name: 'New Link', href: '/' }];
                        handleUpdate('notFound.quickLinks', newLinks);
                      }}
                      className="text-sm text-orange-500 font-medium"
                    >
                      + Add Link
                    </button>
                  </div>

                  <div className="space-y-2">
                    {content.notFound?.quickLinks?.map((link: { name: string; href: string }, index: number) => (
                      <div key={index} className="flex items-center gap-2">
                        <input
                          type="text"
                          value={link.name || ''}
                          onChange={(e) => {
                            const newLinks = [...(content.notFound?.quickLinks || [])];
                            newLinks[index] = { ...newLinks[index], name: e.target.value };
                            handleUpdate('notFound.quickLinks', newLinks);
                          }}
                          placeholder="Link Name"
                          className={`flex-1 ${inputClass}`}
                        />
                        <input
                          type="text"
                          value={link.href || ''}
                          onChange={(e) => {
                            const newLinks = [...(content.notFound?.quickLinks || [])];
                            newLinks[index] = { ...newLinks[index], href: e.target.value };
                            handleUpdate('notFound.quickLinks', newLinks);
                          }}
                          placeholder="/page"
                          className={`w-32 ${inputClass}`}
                        />
                        <button
                          onClick={() => {
                            const newLinks = content.notFound?.quickLinks?.filter((_: unknown, i: number) => i !== index);
                            handleUpdate('notFound.quickLinks', newLinks);
                          }}
                          className="p-2 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                        >
                          ×
                        </button>
                      </div>
                    ))}

                    {(!content.notFound?.quickLinks || content.notFound.quickLinks.length === 0) && (
                      <p className={`text-center py-3 text-sm ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                        No quick links added
                      </p>
                    )}
                  </div>
                </div>

                {/* 404 Page Preview */}
                <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
                  <p className={`text-xs uppercase tracking-wider mb-4 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                    404 Page Preview
                  </p>
                  
                  <div className={`p-8 rounded-xl text-center ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
                    {/* 404 Graphic */}
                    <div className="mb-6">
                      <span className={`text-8xl font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent`}>
                        404
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className={`text-2xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {content.notFound?.title || 'Page not found'}
                    </h3>

                    {/* Description */}
                    <p className={`mb-6 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      {content.notFound?.description || "Sorry, we couldn't find the page you're looking for."}
                    </p>

                    {/* Search */}
                    <div className={`flex items-center gap-2 p-3 rounded-xl mb-6 max-w-md mx-auto ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                      <Search className={`w-5 h-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-400'}`} />
                      <span className={`text-sm ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                        {content.notFound?.searchPlaceholder || 'Search for services...'}
                      </span>
                    </div>

                    {/* CTAs */}
                    <div className="flex items-center justify-center gap-3 mb-6">
                      <button className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-red-500 text-white font-medium">
                        {content.notFound?.primaryCta || 'Go to Homepage'}
                      </button>
                      <button className={`px-5 py-2.5 rounded-xl font-medium ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-900'}`}>
                        {content.notFound?.secondaryCta || 'Contact Support'}
                      </button>
                    </div>

                    {/* Quick Links */}
                    {content.notFound?.quickLinks && content.notFound.quickLinks.length > 0 && (
                      <div className={`pt-6 border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                        <p className={`text-sm mb-3 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          Popular pages:
                        </p>
                        <div className="flex items-center justify-center gap-4">
                          {content.notFound.quickLinks.map((link: { name: string; href: string }, i: number) => (
                            <span
                              key={i}
                              className="text-orange-500 text-sm font-medium hover:underline cursor-pointer"
                            >
                              {link.name}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
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

export default PagesEditor;