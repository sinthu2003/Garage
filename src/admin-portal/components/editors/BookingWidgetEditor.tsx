import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CalendarCheck,
  Type,
  MapPin,
  Car,
  Fuel,
  ChevronRight,
  Star,
  Wrench,
  Settings,
} from 'lucide-react';
import { useBookingWidgetContent } from '../../hooks/useContentHooks';
import { useContent } from '../../context/ContentContext';

interface BookingWidgetEditorProps {
  isDarkMode: boolean;
}

export const BookingWidgetEditor: React.FC<BookingWidgetEditorProps> = ({ }) => {
  const { updateField } = useContent();
  const content = useBookingWidgetContent();
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(['header', 'steps', 'trustBadges'])
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
    updateField('bookingWidget', path, value);
  };

  // Theme-aware styling helpers using CSS variables
  const inputClass = `w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl text-sm transition-all bg-secondary border-border text-foreground placeholder-muted-foreground focus:border-primary border focus:outline-none focus:ring-2 focus:ring-primary/20`;

  const labelClass = `text-sm font-medium text-muted-foreground`;

  const sectionClass = `rounded-xl border overflow-hidden border-border bg-card`;

  const sectionHeaderClass = `w-full flex items-center justify-between p-3 sm:p-4 text-left transition-colors hover:bg-secondary/50`;

  // Step icons
  const stepIcons = {
    location: MapPin,
    brand: Car,
    model: Settings,
    fuel: Fuel,
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 pb-4 border-b border-border">
        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-purple-500 to-violet-500 flex items-center justify-center flex-shrink-0">
          <CalendarCheck className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
        </div>
        <div className="min-w-0">
          <h2 className="text-lg sm:text-xl font-bold text-foreground truncate">
            Booking Widget Editor
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Booking form labels, placeholders, and trust badges
          </p>
        </div>
      </div>

      {/* Widget Header */}
      <div className={sectionClass}>
        <button onClick={() => toggleSection('header')} className={sectionHeaderClass}>
          <div className="flex items-center gap-2 sm:gap-3">
            <motion.div animate={{ rotate: expandedSections.has('header') ? 90 : 0 }}>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </motion.div>
            <Type className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" />
            <span className="font-medium text-foreground text-sm sm:text-base">Widget Header</span>
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
                  <label className={labelClass}>Widget Title</label>
                  <input
                    type="text"
                    value={content.title || ''}
                    onChange={(e) => handleUpdate('title', e.target.value)}
                    placeholder="Book Your Service"
                    className={inputClass}
                  />
                </div>

                <div className="space-y-2">
                  <label className={labelClass}>Subtitle</label>
                  <input
                    type="text"
                    value={content.subtitle || ''}
                    onChange={(e) => handleUpdate('subtitle', e.target.value)}
                    placeholder="Get instant quote in 60 seconds"
                    className={inputClass}
                  />
                </div>

                {/* Preview */}
                <div className="p-3 sm:p-4 rounded-xl bg-secondary">
                  <p className="text-xs uppercase tracking-wider mb-3 text-muted-foreground">
                    Widget Header Preview
                  </p>
                  <div className="p-3 sm:p-4 rounded-xl bg-card text-center">
                    <h3 className="text-lg sm:text-xl font-bold text-foreground">
                      {content.title || 'Book Your Service'}
                    </h3>
                    <p className="text-xs sm:text-sm mt-1 text-muted-foreground">
                      {content.subtitle || 'Get instant quote in 60 seconds'}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Booking Steps */}
      <div className={sectionClass}>
        <button onClick={() => toggleSection('steps')} className={sectionHeaderClass}>
          <div className="flex items-center gap-2 sm:gap-3">
            <motion.div animate={{ rotate: expandedSections.has('steps') ? 90 : 0 }}>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </motion.div>
            <Wrench className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />
            <span className="font-medium text-foreground text-sm sm:text-base">Booking Steps</span>
          </div>
        </button>

        <AnimatePresence>
          {expandedSections.has('steps') && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="p-3 sm:p-4 pt-0 space-y-4 sm:space-y-6 border-t border-border">
                {/* Step 1: Location */}
                <div className="p-3 sm:p-4 rounded-xl border border-border bg-card">
                  <div className="flex items-center gap-2 mb-3">
                    <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-red-500" />
                    <span className="font-medium text-foreground text-sm sm:text-base">
                      Step 1: Location
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs text-muted-foreground">Title</label>
                      <input
                        type="text"
                        value={content.steps?.location?.title || ''}
                        onChange={(e) => handleUpdate('steps.location.title', e.target.value)}
                        placeholder="Select Your City"
                        className={inputClass}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs text-muted-foreground">Placeholder</label>
                      <input
                        type="text"
                        value={content.steps?.location?.placeholder || ''}
                        onChange={(e) => handleUpdate('steps.location.placeholder', e.target.value)}
                        placeholder="Search city..."
                        className={inputClass}
                      />
                    </div>
                  </div>
                </div>

                {/* Step 2: Brand */}
                <div className="p-3 sm:p-4 rounded-xl border border-border bg-card">
                  <div className="flex items-center gap-2 mb-3">
                    <Car className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" />
                    <span className="font-medium text-foreground text-sm sm:text-base">
                      Step 2: Brand
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs text-muted-foreground">Title</label>
                      <input
                        type="text"
                        value={content.steps?.brand?.title || ''}
                        onChange={(e) => handleUpdate('steps.brand.title', e.target.value)}
                        placeholder="Select Your Brand"
                        className={inputClass}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs text-muted-foreground">Placeholder</label>
                      <input
                        type="text"
                        value={content.steps?.brand?.placeholder || ''}
                        onChange={(e) => handleUpdate('steps.brand.placeholder', e.target.value)}
                        placeholder="Search brand..."
                        className={inputClass}
                      />
                    </div>
                  </div>
                </div>

                {/* Step 3: Model */}
                <div className="p-3 sm:p-4 rounded-xl border border-border bg-card">
                  <div className="flex items-center gap-2 mb-3">
                    <Settings className="w-4 h-4 sm:w-5 sm:h-5 text-purple-500" />
                    <span className="font-medium text-foreground text-sm sm:text-base">
                      Step 3: Model
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs text-muted-foreground">Title</label>
                      <input
                        type="text"
                        value={content.steps?.model?.title || ''}
                        onChange={(e) => handleUpdate('steps.model.title', e.target.value)}
                        placeholder="Select Your Model"
                        className={inputClass}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs text-muted-foreground">Placeholder</label>
                      <input
                        type="text"
                        value={content.steps?.model?.placeholder || ''}
                        onChange={(e) => handleUpdate('steps.model.placeholder', e.target.value)}
                        placeholder="Search model..."
                        className={inputClass}
                      />
                    </div>
                  </div>
                </div>

                {/* Step 4: Fuel */}
                <div className="p-3 sm:p-4 rounded-xl border border-border bg-card">
                  <div className="flex items-center gap-2 mb-3">
                    <Fuel className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />
                    <span className="font-medium text-foreground text-sm sm:text-base">
                      Step 4: Fuel Type
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs text-muted-foreground">Title</label>
                      <input
                        type="text"
                        value={content.steps?.fuel?.title || ''}
                        onChange={(e) => handleUpdate('steps.fuel.title', e.target.value)}
                        placeholder="Select Fuel Type"
                        className={inputClass}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs text-muted-foreground">Subtitle</label>
                      <input
                        type="text"
                        value={content.steps?.fuel?.subtitle || ''}
                        onChange={(e) => handleUpdate('steps.fuel.subtitle', e.target.value)}
                        placeholder="Choose your car's fuel type"
                        className={inputClass}
                      />
                    </div>
                  </div>
                </div>

                {/* Steps Preview */}
                <div className="p-3 sm:p-4 rounded-xl bg-secondary">
                  <p className="text-xs uppercase tracking-wider mb-3 text-muted-foreground">
                    Steps Flow Preview
                  </p>
                  <div className="flex items-center justify-between overflow-x-auto pb-2">
                    {['location', 'brand', 'model', 'fuel'].map((step, i) => {
                      const Icon = stepIcons[step as keyof typeof stepIcons];
                      const colors = ['text-red-500', 'text-blue-500', 'text-purple-500', 'text-green-500'];
                      const bgColors = [
                        'bg-red-500/10',
                        'bg-blue-500/10',
                        'bg-purple-500/10',
                        'bg-green-500/10',
                      ];

                      return (
                        <React.Fragment key={step}>
                          <div className="flex flex-col items-center flex-shrink-0">
                            <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center ${bgColors[i]}`}>
                              <Icon className={`w-5 h-5 sm:w-6 sm:h-6 ${colors[i]}`} />
                            </div>
                            <p className="text-[10px] sm:text-xs mt-2 text-center text-muted-foreground">
                              {content.steps?.[step as keyof typeof content.steps]?.title?.split(' ').pop() || step}
                            </p>
                          </div>
                          {i < 3 && (
                            <div className="flex-1 h-0.5 mx-1 sm:mx-2 bg-border min-w-[20px]" />
                          )}
                        </React.Fragment>
                      );
                    })}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Trust Badges */}
      <div className={sectionClass}>
        <button onClick={() => toggleSection('trustBadges')} className={sectionHeaderClass}>
          <div className="flex items-center gap-2 sm:gap-3">
            <motion.div animate={{ rotate: expandedSections.has('trustBadges') ? 90 : 0 }}>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </motion.div>
            <Star className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500" />
            <span className="font-medium text-foreground text-sm sm:text-base">Trust Badges</span>
          </div>
        </button>

        <AnimatePresence>
          {expandedSections.has('trustBadges') && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="p-3 sm:p-4 pt-0 space-y-3 sm:space-y-4 border-t border-border">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div className="space-y-2">
                    <label className={labelClass}>
                      <Star className="w-4 h-4 inline mr-1 text-yellow-500" />
                      Rating Display
                    </label>
                    <input
                      type="text"
                      value={content.trustBadges?.rating || ''}
                      onChange={(e) => handleUpdate('trustBadges.rating', e.target.value)}
                      placeholder="4.8/5"
                      className={inputClass}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className={labelClass}>
                      <Wrench className="w-4 h-4 inline mr-1 text-blue-500" />
                      Services Count
                    </label>
                    <input
                      type="text"
                      value={content.trustBadges?.services || ''}
                      onChange={(e) => handleUpdate('trustBadges.services', e.target.value)}
                      placeholder="50,000+"
                      className={inputClass}
                    />
                  </div>
                </div>

                {/* Trust Badges Preview */}
                <div className="p-3 sm:p-4 rounded-xl bg-secondary">
                  <p className="text-xs uppercase tracking-wider mb-3 text-muted-foreground">
                    Trust Badges Preview
                  </p>
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center bg-yellow-500/10">
                        <Star className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500" fill="currentColor" />
                      </div>
                      <div>
                        <p className="font-bold text-sm sm:text-base text-foreground">
                          {content.trustBadges?.rating || '4.8/5'}
                        </p>
                        <p className="text-xs text-muted-foreground">Rating</p>
                      </div>
                    </div>
                    <div className="hidden sm:block w-px h-10 bg-border" />
                    <div className="w-full sm:w-auto h-px sm:h-10 bg-border sm:hidden" />
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center bg-blue-500/10">
                        <Wrench className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" />
                      </div>
                      <div>
                        <p className="font-bold text-sm sm:text-base text-foreground">
                          {content.trustBadges?.services || '50,000+'}
                        </p>
                        <p className="text-xs text-muted-foreground">Services</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Full Widget Preview */}
      <div className="p-3 sm:p-4 rounded-xl bg-secondary">
        <p className="text-xs uppercase tracking-wider mb-4 text-muted-foreground">
          Full Widget Preview
        </p>
        <div className="p-4 sm:p-6 rounded-2xl bg-card shadow-xl max-w-sm mx-auto">
          {/* Header */}
          <div className="text-center mb-4 sm:mb-6">
            <h3 className="text-lg sm:text-xl font-bold text-foreground">
              {content.title || 'Book Your Service'}
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground">
              {content.subtitle || 'Get instant quote in 60 seconds'}
            </p>
          </div>

          {/* Steps */}
          <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-6">
            {['location', 'brand', 'model', 'fuel'].map((step, i) => {
              const Icon = stepIcons[step as keyof typeof stepIcons];
              const stepData = content.steps?.[step as keyof typeof content.steps];

              return (
                <div
                  key={step}
                  className={`p-2.5 sm:p-3 rounded-xl border ${
                    i === 0
                      ? 'border-primary bg-primary/10'
                      : 'border-border'
                  }`}
                >
                  <div className="flex items-center gap-2 sm:gap-3">
                    <Icon className={`w-4 h-4 sm:w-5 sm:h-5 ${i === 0 ? 'text-primary' : 'text-muted-foreground'}`} />
                    <span className="text-xs sm:text-sm text-foreground">
                      {stepData?.title || `Select ${step}`}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* CTA Button */}
          <button className="w-full py-2.5 sm:py-3 rounded-xl bg-gradient-to-r from-primary to-primary/80 text-primary-foreground font-semibold text-sm sm:text-base">
            Get Free Quote
          </button>

          {/* Trust Badges */}
          <div className="flex items-center justify-center gap-3 sm:gap-4 mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-border">
            <div className="flex items-center gap-1">
              <Star className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-500" fill="currentColor" />
              <span className="text-xs sm:text-sm font-medium text-foreground">
                {content.trustBadges?.rating || '4.8/5'}
              </span>
            </div>
            <div className="w-px h-3 sm:h-4 bg-border" />
            <span className="text-xs sm:text-sm text-muted-foreground">
              {content.trustBadges?.services || '50,000+'} services
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingWidgetEditor;