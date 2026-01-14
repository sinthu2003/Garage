import React from 'react';
import { useServicesContent } from '../../hooks/useContentHooks';
import { useContent } from '../../context/ContentContext';
import { SectionLoader } from '../shared/Sectionloader';

interface ServicesEditorProps {
  isDarkMode: boolean;
}

export const ServicesEditor: React.FC<ServicesEditorProps> = ({ }) => {
  const { updateField } = useContent();
  const content = useServicesContent();

  // [LAZY LOADING] Show loading state
  if (content.isLoading) {
    return <SectionLoader section="Services" />;
  }

  const handleUpdate = (path: string, value: unknown) => {
    updateField('services', path, value);
  };

  // Theme-aware styling helpers using CSS variables
  const inputClass = `w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl text-sm transition-all bg-secondary border-border text-foreground placeholder-muted-foreground focus:border-primary border focus:outline-none focus:ring-2 focus:ring-primary/20`;

  const labelClass = `text-sm font-medium text-muted-foreground`;

  const sectionClass = `rounded-xl border overflow-hidden border-border bg-card`;

  return (
    <div className="space-y-4 sm:space-y-6 w-full">
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
        </div>
      </div>
    </div>
  );
};

export default ServicesEditor;