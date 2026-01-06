import React from 'react';
import { Layout } from 'lucide-react';
import { useServicesContent } from '../../hooks/useContentHooks';
import { useContent } from '../../context/ContentContext';

interface ServicesEditorProps {
  isDarkMode: boolean;
}

export const ServicesEditor: React.FC<ServicesEditorProps> = ({ }) => {
  const { updateField } = useContent();
  const content = useServicesContent();

  const handleUpdate = (path: string, value: unknown) => {
    updateField('services', path, value);
  };

  // Theme-aware styling helpers using CSS variables
  const inputClass = `w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl text-sm transition-all bg-secondary border-border text-foreground placeholder-muted-foreground focus:border-primary border focus:outline-none focus:ring-2 focus:ring-primary/20`;

  const labelClass = `text-sm font-medium text-muted-foreground`;

  const sectionClass = `rounded-xl border overflow-hidden border-border bg-card`;

  return (
    <div className="space-y-4 sm:space-y-6 w-full">
      {/* Header */}
      <div className="flex items-center gap-3 pb-4 border-b border-border">
        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center shadow-lg shadow-orange-500/20 flex-shrink-0">
          <Layout className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
        </div>
        <div className="min-w-0">
          <h2 className="text-lg sm:text-xl font-bold text-foreground truncate">
            Services Landing Page
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Configure how the services section appears on the homepage
          </p>
        </div>
      </div>

      {/* Landing Page Settings */}
      <div className={sectionClass}>
        <div className="p-4 sm:p-6 border-b border-border">
          <h3 className="text-base sm:text-lg font-bold text-foreground">
            Section Content
          </h3>
        </div>
        
        <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
          {/* Badge Text */}
          <div className="space-y-2">
            <label className={labelClass}>Badge Text</label>
            <input
              type="text"
              value={content.badge || ''}
              onChange={(e) => handleUpdate('badge', e.target.value)}
              placeholder="Our Services"
              className={inputClass}
            />
          </div>

          {/* Headlines */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div className="space-y-2">
              <label className={labelClass}>Headline Line 1</label>
              <input
                type="text"
                value={content.headline?.line1 || ''}
                onChange={(e) => handleUpdate('headline.line1', e.target.value)}
                placeholder="Everything your"
                className={inputClass}
              />
            </div>
            <div className="space-y-2">
              <label className={labelClass}>Highlighted Text</label>
              <input
                type="text"
                value={content.headline?.highlight || ''}
                onChange={(e) => handleUpdate('headline.highlight', e.target.value)}
                placeholder="car needs."
                className={inputClass}
              />
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className={labelClass}>Description</label>
            <textarea
              value={content.description || ''}
              onChange={(e) => handleUpdate('description', e.target.value)}
              placeholder="From routine maintenance to complex repairs..."
              rows={3}
              className={inputClass}
            />
          </div>

          {/* View All Button */}
          <div className="space-y-2">
            <label className={labelClass}>View All Button Text</label>
            <input
              type="text"
              value={content.viewAllCta || ''}
              onChange={(e) => handleUpdate('viewAllCta', e.target.value)}
              placeholder="View All Services"
              className={inputClass}
            />
          </div>

          {/* Preview */}
          <div className="p-3 sm:p-4 rounded-xl bg-secondary">
            <p className="text-xs uppercase tracking-wider mb-2 text-muted-foreground">
              Preview
            </p>
            <div className="inline-block px-3 py-1 rounded-full bg-red-100 text-red-700 text-xs font-medium mb-2">
              {content.badge || 'Our Services'}
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-foreground">
              {content.headline?.line1 || 'Everything your'}
              {' '}
              <span className="text-primary">{content.headline?.highlight || 'car needs.'}</span>
            </h3>
            <p className="mt-2 text-xs sm:text-sm text-muted-foreground line-clamp-2">
              {content.description || 'From routine maintenance to complex repairs...'}
            </p>
            {content.viewAllCta && (
              <button className="mt-3 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium">
                {content.viewAllCta}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServicesEditor;