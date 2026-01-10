import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HelpCircle,
  Phone,
  MessageCircle,
  Mail,
  ChevronRight,
  ChevronDown,
  Plus,
  Trash2,
  GripVertical,
  MapPin,
  Type,
  Clock,
  FileText,
  Send,
} from 'lucide-react';
import { useFAQContent } from '../../hooks/useContentHooks';
import { useContent } from '../../context/ContentContext';
import type { FAQContactCard, FAQItem, BusinessHour, ContactServiceOption } from '../../types/content.types';

interface FAQEditorProps {
  isDarkMode: boolean;
  onPageChange?: (page: 'faqSection' | 'contactPage') => void;
}

// Contact type options
const contactTypeOptions = [
  { value: 'phone', label: 'Phone', icon: Phone },
  { value: 'whatsapp', label: 'WhatsApp', icon: MessageCircle },
  { value: 'email', label: 'Email', icon: Mail },
];

// Tab configuration
type TabId = 'faqSection' | 'contactPage';

const tabs: { id: TabId; label: string; icon: React.FC<{ className?: string }> }[] = [
  { id: 'faqSection', label: 'FAQ Section', icon: HelpCircle },
  { id: 'contactPage', label: 'Contact Page', icon: Phone },
];

export const FAQEditor: React.FC<FAQEditorProps> = ({ onPageChange }) => {
  const { updateField } = useContent();
  const content = useFAQContent();
  const [activeTab, setActiveTab] = useState<TabId>('faqSection');
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(['faqHeader', 'contactHeader', 'map', 'contactCards', 'items', 'businessHours', 'contactForm', 'quickButtons'])
  );
  const [expandedFAQs, setExpandedFAQs] = useState<Set<number>>(new Set([0]));

  // Notify parent when tab changes
  useEffect(() => {
    onPageChange?.(activeTab);
  }, [activeTab, onPageChange]);

  const handleTabChange = (tabId: TabId) => {
    setActiveTab(tabId);
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

  const toggleFAQ = (index: number) => {
    const newExpanded = new Set(expandedFAQs);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedFAQs(newExpanded);
  };

  const handleUpdate = (path: string, value: unknown) => {
    updateField('faq', path, value);
  };

  // Theme-aware styling helpers using CSS variables
  const inputClass = `w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl text-sm transition-all bg-secondary border-border text-foreground placeholder-muted-foreground focus:border-primary border focus:outline-none focus:ring-2 focus:ring-primary/20`;

  const labelClass = `text-sm font-medium text-muted-foreground`;

  const sectionClass = `rounded-xl border overflow-hidden border-border bg-card`;

  const sectionHeaderClass = `w-full flex items-center justify-between p-3 sm:p-4 text-left transition-colors hover:bg-secondary/50`;

  const addNewContactCard = () => {
    const newCard: FAQContactCard = {
      type: 'phone',
      label: 'Call us at',
      value: '+91 98765 43210',
      href: 'tel:+919876543210',
    };
    // Add at the beginning of the array
    handleUpdate('contactCards', [newCard, ...(content.contactCards || [])]);
  };

  const addNewFAQ = () => {
    const newFAQ: FAQItem = {
      question: 'New Question?',
      answer: 'Answer to the question goes here.',
    };
    // Add at the beginning of the array
    handleUpdate('items', [newFAQ, ...(content.items || [])]);
    // Auto-expand the newly added item (now at index 0)
    setExpandedFAQs(new Set([0]));
  };

  const addNewBusinessHour = () => {
    const newHour: BusinessHour = {
      day: 'New Day',
      hours: '9:00 AM - 5:00 PM',
    };
    // Add at the beginning of the array
    handleUpdate('businessHours', [newHour, ...(content.businessHours || [])]);
  };

  const addNewServiceOption = () => {
    const newOption: ContactServiceOption = {
      value: 'new-service',
      label: 'New Service',
    };
    const currentOptions = content.contactPage?.serviceOptions || [];
    // Add at the beginning of the array
    handleUpdate('contactPage.serviceOptions', [newOption, ...currentOptions]);
  };

  // Get icon component by type
  const getContactIcon = (type: string) => {
    const option = contactTypeOptions.find(opt => opt.value === type);
    return option?.icon || Phone;
  };

  // ============================================================================
  // FAQ SECTION TAB CONTENT
  // ============================================================================
  const renderFAQSectionTab = () => (
    <div className="space-y-4 sm:space-y-6">
      {/* FAQ Header Content */}
      <div className={sectionClass}>
        <button onClick={() => toggleSection('faqHeader')} className={sectionHeaderClass}>
          <div className="flex items-center gap-2 sm:gap-3">
            <motion.div animate={{ rotate: expandedSections.has('faqHeader') ? 90 : 0 }}>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </motion.div>
            <Type className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />
            <span className="font-medium text-foreground text-sm sm:text-base">FAQ Header</span>
          </div>
        </button>

        <AnimatePresence>
          {expandedSections.has('faqHeader') && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="p-3 sm:p-4 pt-0 space-y-3 sm:space-y-4 border-t border-border">
                <div className="space-y-2">
                  <label className={labelClass}>FAQ Badge</label>
                  <input
                    type="text"
                    value={content.badge || ''}
                    onChange={(e) => handleUpdate('badge', e.target.value)}
                    placeholder="FAQ"
                    className={inputClass}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div className="space-y-2">
                    <label className={labelClass}>FAQ Headline</label>
                    <input
                      type="text"
                      value={content.headline?.line1 || ''}
                      onChange={(e) => handleUpdate('headline.line1', e.target.value)}
                      placeholder="Frequently Asked"
                      className={inputClass}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className={labelClass}>FAQ Highlighted Text</label>
                    <input
                      type="text"
                      value={content.headline?.highlight || ''}
                      onChange={(e) => handleUpdate('headline.highlight', e.target.value)}
                      placeholder="Questions"
                      className={inputClass}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className={labelClass}>FAQ Description</label>
                  <textarea
                    value={content.description || ''}
                    onChange={(e) => handleUpdate('description', e.target.value)}
                    placeholder="Find quick answers..."
                    rows={2}
                    className={inputClass}
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Contact Cards (for FAQ section left side) */}
      <div className={sectionClass}>
        <div
          onClick={() => toggleSection('contactCards')}
          onKeyDown={(e) => e.key === 'Enter' && toggleSection('contactCards')}
          role="button"
          tabIndex={0}
          className={`${sectionHeaderClass} cursor-pointer`}
        >
          <div className="flex items-center gap-2 sm:gap-3">
            <motion.div animate={{ rotate: expandedSections.has('contactCards') ? 90 : 0 }}>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </motion.div>
            <Phone className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" />
            <span className="font-medium text-foreground text-sm sm:text-base">Contact Cards</span>
            <span className="px-2 py-0.5 rounded-full text-xs bg-secondary text-muted-foreground">
              {content.contactCards?.length || 0}
            </span>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              addNewContactCard();
            }}
            className="p-2 rounded-lg bg-secondary hover:bg-secondary/80 text-foreground"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        <AnimatePresence>
          {expandedSections.has('contactCards') && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="p-3 sm:p-4 pt-0 space-y-3 sm:space-y-4 border-t border-border">
                {content.contactCards?.map((card: FAQContactCard, index: number) => {
                  const Icon = getContactIcon(card.type);
                  return (
                    <div key={index} className="p-3 sm:p-4 rounded-xl bg-secondary/50">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <Icon className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm font-medium text-foreground">
                            Contact #{index + 1}
                          </span>
                        </div>
                        <button
                          onClick={() => {
                            const newCards = content.contactCards?.filter((_: FAQContactCard, i: number) => i !== index);
                            handleUpdate('contactCards', newCards);
                          }}
                          className="p-1.5 rounded-lg text-destructive hover:bg-destructive/10"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                        <div className="space-y-2">
                          <label className={labelClass}>Type</label>
                          <select
                            value={card.type || 'phone'}
                            onChange={(e) => {
                              const newCards = [...(content.contactCards || [])];
                              newCards[index] = { ...newCards[index], type: e.target.value as 'phone' | 'whatsapp' | 'email' };
                              handleUpdate('contactCards', newCards);
                            }}
                            className={inputClass}
                          >
                            {contactTypeOptions.map(opt => (
                              <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                          </select>
                        </div>

                        <div className="space-y-2">
                          <label className={labelClass}>Label</label>
                          <input
                            type="text"
                            value={card.label || ''}
                            onChange={(e) => {
                              const newCards = [...(content.contactCards || [])];
                              newCards[index] = { ...newCards[index], label: e.target.value };
                              handleUpdate('contactCards', newCards);
                            }}
                            placeholder="Call us at"
                            className={inputClass}
                          />
                        </div>

                        <div className="space-y-2">
                          <label className={labelClass}>Display Value</label>
                          <input
                            type="text"
                            value={card.value || ''}
                            onChange={(e) => {
                              const newCards = [...(content.contactCards || [])];
                              newCards[index] = { ...newCards[index], value: e.target.value };
                              handleUpdate('contactCards', newCards);
                            }}
                            placeholder="+91 98765 43210"
                            className={inputClass}
                          />
                        </div>

                        <div className="space-y-2">
                          <label className={labelClass}>Link (href)</label>
                          <input
                            type="text"
                            value={card.href || ''}
                            onChange={(e) => {
                              const newCards = [...(content.contactCards || [])];
                              newCards[index] = { ...newCards[index], href: e.target.value };
                              handleUpdate('contactCards', newCards);
                            }}
                            placeholder="tel:+919876543210"
                            className={inputClass}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}

                {(!content.contactCards || content.contactCards.length === 0) && (
                  <div className="text-center py-6 text-muted-foreground">
                    <Phone className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No contact cards added</p>
                    <button onClick={addNewContactCard} className="mt-2 text-primary text-sm font-medium">
                      + Add contact card
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Business Hours (for FAQ section left side) */}
      <div className={sectionClass}>
        <div
          onClick={() => toggleSection('businessHours')}
          onKeyDown={(e) => e.key === 'Enter' && toggleSection('businessHours')}
          role="button"
          tabIndex={0}
          className={`${sectionHeaderClass} cursor-pointer`}
        >
          <div className="flex items-center gap-2 sm:gap-3">
            <motion.div animate={{ rotate: expandedSections.has('businessHours') ? 90 : 0 }}>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </motion.div>
            <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-purple-500" />
            <span className="font-medium text-foreground text-sm sm:text-base">Business Hours</span>
            <span className="px-2 py-0.5 rounded-full text-xs bg-secondary text-muted-foreground">
              {content.businessHours?.length || 0}
            </span>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              addNewBusinessHour();
            }}
            className="p-2 rounded-lg bg-secondary hover:bg-secondary/80 text-foreground"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        <AnimatePresence>
          {expandedSections.has('businessHours') && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="p-3 sm:p-4 pt-0 space-y-3 sm:space-y-4 border-t border-border">
                {content.businessHours?.map((hour: BusinessHour, index: number) => (
                  <div key={index} className="p-3 sm:p-4 rounded-xl bg-secondary/50">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm font-medium text-foreground">
                          Schedule #{index + 1}
                        </span>
                      </div>
                      <button
                        onClick={() => {
                          const newHours = content.businessHours?.filter((_: BusinessHour, i: number) => i !== index);
                          handleUpdate('businessHours', newHours);
                        }}
                        className="p-1.5 rounded-lg text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                      <div className="space-y-2">
                        <label className={labelClass}>Day(s)</label>
                        <input
                          type="text"
                          value={hour.day || ''}
                          onChange={(e) => {
                            const newHours = [...(content.businessHours || [])];
                            newHours[index] = { ...newHours[index], day: e.target.value };
                            handleUpdate('businessHours', newHours);
                          }}
                          placeholder="Monday - Friday"
                          className={inputClass}
                        />
                      </div>

                      <div className="space-y-2">
                        <label className={labelClass}>Hours</label>
                        <input
                          type="text"
                          value={hour.hours || ''}
                          onChange={(e) => {
                            const newHours = [...(content.businessHours || [])];
                            newHours[index] = { ...newHours[index], hours: e.target.value };
                            handleUpdate('businessHours', newHours);
                          }}
                          placeholder="8:00 AM - 7:00 PM"
                          className={inputClass}
                        />
                      </div>
                    </div>
                  </div>
                ))}

                {(!content.businessHours || content.businessHours.length === 0) && (
                  <div className="text-center py-6 text-muted-foreground">
                    <Clock className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No business hours added</p>
                    <button onClick={addNewBusinessHour} className="mt-2 text-primary text-sm font-medium">
                      + Add business hours
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* FAQ Items */}
      <div className={sectionClass}>
        <div
          onClick={() => toggleSection('items')}
          onKeyDown={(e) => e.key === 'Enter' && toggleSection('items')}
          role="button"
          tabIndex={0}
          className={`${sectionHeaderClass} cursor-pointer`}
        >
          <div className="flex items-center gap-2 sm:gap-3">
            <motion.div animate={{ rotate: expandedSections.has('items') ? 90 : 0 }}>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </motion.div>
            <HelpCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />
            <span className="font-medium text-foreground text-sm sm:text-base">FAQ Items</span>
            <span className="px-2 py-0.5 rounded-full text-xs bg-secondary text-muted-foreground">
              {content.items?.length || 0}
            </span>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              addNewFAQ();
            }}
            className="p-2 rounded-lg bg-secondary hover:bg-secondary/80 text-foreground"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        <AnimatePresence>
          {expandedSections.has('items') && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="p-3 sm:p-4 pt-0 space-y-3 sm:space-y-4 border-t border-border">
                {content.items?.map((faq: FAQItem, index: number) => (
                  <div
                    key={index}
                    className="rounded-xl border overflow-hidden border-border bg-card"
                  >
                    {/* FAQ Header */}
                    <div
                      onClick={() => toggleFAQ(index)}
                      onKeyDown={(e) => e.key === 'Enter' && toggleFAQ(index)}
                      role="button"
                      tabIndex={0}
                      className="w-full flex items-center justify-between p-3 sm:p-4 text-left hover:bg-secondary/50 cursor-pointer"
                    >
                      <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                        <GripVertical className="w-4 h-4 cursor-grab text-muted-foreground hidden sm:block" />
                        <span className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center text-xs sm:text-sm font-bold bg-secondary text-muted-foreground flex-shrink-0">
                          {index + 1}
                        </span>
                        <span className="font-medium text-foreground text-sm sm:text-base truncate">
                          {faq.question || 'New Question'}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            const newItems = content.items?.filter((_: FAQItem, i: number) => i !== index);
                            handleUpdate('items', newItems);
                          }}
                          className="p-1.5 sm:p-2 rounded-lg text-destructive hover:bg-destructive/10"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <motion.div animate={{ rotate: expandedFAQs.has(index) ? 180 : 0 }}>
                          <ChevronDown className="w-4 h-4 text-muted-foreground" />
                        </motion.div>
                      </div>
                    </div>

                    {/* FAQ Details */}
                    <AnimatePresence>
                      {expandedFAQs.has(index) && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="p-3 sm:p-4 pt-0 space-y-3 sm:space-y-4 border-t border-border">
                            <div className="space-y-2">
                              <label className={labelClass}>Question</label>
                              <input
                                type="text"
                                value={faq.question || ''}
                                onChange={(e) => {
                                  const newItems = [...(content.items || [])];
                                  newItems[index] = { ...newItems[index], question: e.target.value };
                                  handleUpdate('items', newItems);
                                }}
                                placeholder="How does doorstep service work?"
                                className={inputClass}
                              />
                            </div>

                            <div className="space-y-2">
                              <label className={labelClass}>Answer</label>
                              <textarea
                                value={faq.answer || ''}
                                onChange={(e) => {
                                  const newItems = [...(content.items || [])];
                                  newItems[index] = { ...newItems[index], answer: e.target.value };
                                  handleUpdate('items', newItems);
                                }}
                                placeholder="Our certified mechanics come to your location..."
                                rows={4}
                                className={inputClass}
                              />
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}

                {(!content.items || content.items.length === 0) && (
                  <div className="text-center py-6 sm:py-8 text-muted-foreground">
                    <HelpCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No FAQs added yet</p>
                    <button onClick={addNewFAQ} className="mt-2 text-primary text-sm font-medium">
                      + Add your first FAQ
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

  // ============================================================================
  // CONTACT PAGE TAB CONTENT
  // ============================================================================
  const renderContactPageTab = () => (
    <div className="space-y-4 sm:space-y-6">
      {/* Contact Page Header Content */}
      <div className={sectionClass}>
        <button onClick={() => toggleSection('contactHeader')} className={sectionHeaderClass}>
          <div className="flex items-center gap-2 sm:gap-3">
            <motion.div animate={{ rotate: expandedSections.has('contactHeader') ? 90 : 0 }}>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </motion.div>
            <Type className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" />
            <span className="font-medium text-foreground text-sm sm:text-base">Page Header</span>
          </div>
        </button>

        <AnimatePresence>
          {expandedSections.has('contactHeader') && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="p-3 sm:p-4 pt-0 space-y-3 sm:space-y-4 border-t border-border">
                <div className="space-y-2">
                  <label className={labelClass}>Contact Badge</label>
                  <input
                    type="text"
                    value={content.contactBadge || ''}
                    onChange={(e) => handleUpdate('contactBadge', e.target.value)}
                    placeholder="Contact Us"
                    className={inputClass}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div className="space-y-2">
                    <label className={labelClass}>Contact Headline</label>
                    <input
                      type="text"
                      value={content.contactHeadline?.line1 || ''}
                      onChange={(e) => handleUpdate('contactHeadline.line1', e.target.value)}
                      placeholder="Get in"
                      className={inputClass}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className={labelClass}>Contact Highlighted Text</label>
                    <input
                      type="text"
                      value={content.contactHeadline?.highlight || ''}
                      onChange={(e) => handleUpdate('contactHeadline.highlight', e.target.value)}
                      placeholder="Touch"
                      className={inputClass}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className={labelClass}>Contact Description</label>
                  <textarea
                    value={content.contactDescription || ''}
                    onChange={(e) => handleUpdate('contactDescription', e.target.value)}
                    placeholder="Visit our service center..."
                    rows={2}
                    className={inputClass}
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Google Map Section */}
      <div className={sectionClass}>
        <button onClick={() => toggleSection('map')} className={sectionHeaderClass}>
          <div className="flex items-center gap-2 sm:gap-3">
            <motion.div animate={{ rotate: expandedSections.has('map') ? 90 : 0 }}>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </motion.div>
            <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500" />
            <span className="font-medium text-foreground text-sm sm:text-base">Google Map</span>
          </div>
        </button>

        <AnimatePresence>
          {expandedSections.has('map') && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="p-3 sm:p-4 pt-0 space-y-3 sm:space-y-4 border-t border-border">
                <div className="space-y-2">
                  <label className={labelClass}>Map Embed URL</label>
                  <textarea
                    value={content.mapEmbedUrl || ''}
                    onChange={(e) => handleUpdate('mapEmbedUrl', e.target.value)}
                    placeholder="https://www.google.com/maps/embed?..."
                    rows={3}
                    className={inputClass}
                  />
                  <p className="text-[10px] text-muted-foreground mt-1">
                    Copy the 'src' attribute from Google Maps 'Embed Map' iframe code.
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Contact Form Settings */}
      <div className={sectionClass}>
        <button onClick={() => toggleSection('contactForm')} className={sectionHeaderClass}>
          <div className="flex items-center gap-2 sm:gap-3">
            <motion.div animate={{ rotate: expandedSections.has('contactForm') ? 90 : 0 }}>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </motion.div>
            <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />
            <span className="font-medium text-foreground text-sm sm:text-base">Contact Form</span>
          </div>
        </button>

        <AnimatePresence>
          {expandedSections.has('contactForm') && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="p-3 sm:p-4 pt-0 space-y-3 sm:space-y-4 border-t border-border">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div className="space-y-2">
                    <label className={labelClass}>Form Title</label>
                    <input
                      type="text"
                      value={content.contactPage?.formTitle || ''}
                      onChange={(e) => handleUpdate('contactPage.formTitle', e.target.value)}
                      placeholder="Send us a Message"
                      className={inputClass}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className={labelClass}>Form Subtitle</label>
                    <input
                      type="text"
                      value={content.contactPage?.formSubtitle || ''}
                      onChange={(e) => handleUpdate('contactPage.formSubtitle', e.target.value)}
                      placeholder="We'll get back to you within 24 hours"
                      className={inputClass}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div className="space-y-2">
                    <label className={labelClass}>Submit Button Text</label>
                    <input
                      type="text"
                      value={content.contactPage?.submitButton || ''}
                      onChange={(e) => handleUpdate('contactPage.submitButton', e.target.value)}
                      placeholder="Send Message"
                      className={inputClass}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className={labelClass}>Success Message</label>
                    <input
                      type="text"
                      value={content.contactPage?.successMessage || ''}
                      onChange={(e) => handleUpdate('contactPage.successMessage', e.target.value)}
                      placeholder="Thank you for contacting us..."
                      className={inputClass}
                    />
                  </div>
                </div>

                {/* Service Options */}
                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between">
                    <label className={labelClass}>Service Options (Dropdown)</label>
                    <button
                      onClick={addNewServiceOption}
                      className="p-1.5 rounded-lg bg-secondary hover:bg-secondary/80 text-foreground"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>

                  {content.contactPage?.serviceOptions?.map((option: ContactServiceOption, index: number) => (
                    <div key={index} className="flex gap-2 items-center">
                      <input
                        type="text"
                        value={option.value || ''}
                        onChange={(e) => {
                          const newOptions = [...(content.contactPage?.serviceOptions || [])];
                          newOptions[index] = { ...newOptions[index], value: e.target.value };
                          handleUpdate('contactPage.serviceOptions', newOptions);
                        }}
                        placeholder="value-slug"
                        className={`${inputClass} flex-1`}
                      />
                      <input
                        type="text"
                        value={option.label || ''}
                        onChange={(e) => {
                          const newOptions = [...(content.contactPage?.serviceOptions || [])];
                          newOptions[index] = { ...newOptions[index], label: e.target.value };
                          handleUpdate('contactPage.serviceOptions', newOptions);
                        }}
                        placeholder="Display Label"
                        className={`${inputClass} flex-1`}
                      />
                      <button
                        onClick={() => {
                          const newOptions = content.contactPage?.serviceOptions?.filter((_: ContactServiceOption, i: number) => i !== index);
                          handleUpdate('contactPage.serviceOptions', newOptions);
                        }}
                        className="p-2 rounded-lg text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}

                  {(!content.contactPage?.serviceOptions || content.contactPage.serviceOptions.length === 0) && (
                    <p className="text-xs text-muted-foreground text-center py-2">
                      No service options. Click + to add.
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Quick Contact Buttons */}
      <div className={sectionClass}>
        <button onClick={() => toggleSection('quickButtons')} className={sectionHeaderClass}>
          <div className="flex items-center gap-2 sm:gap-3">
            <motion.div animate={{ rotate: expandedSections.has('quickButtons') ? 90 : 0 }}>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </motion.div>
            <Send className="w-4 h-4 sm:w-5 sm:h-5 text-purple-500" />
            <span className="font-medium text-foreground text-sm sm:text-base">Quick Contact Buttons</span>
          </div>
        </button>

        <AnimatePresence>
          {expandedSections.has('quickButtons') && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="p-3 sm:p-4 pt-0 space-y-3 sm:space-y-4 border-t border-border">
                <div className="space-y-2">
                  <label className={labelClass}>Call Now Link</label>
                  <input
                    type="text"
                    value={content.contactPage?.callNowHref || ''}
                    onChange={(e) => handleUpdate('contactPage.callNowHref', e.target.value)}
                    placeholder="tel:+919876543210"
                    className={inputClass}
                  />
                </div>

                <div className="space-y-2">
                  <label className={labelClass}>WhatsApp Link</label>
                  <input
                    type="text"
                    value={content.contactPage?.whatsappHref || ''}
                    onChange={(e) => handleUpdate('contactPage.whatsappHref', e.target.value)}
                    placeholder="https://wa.me/919876543210"
                    className={inputClass}
                  />
                </div>

                <div className="space-y-2">
                  <label className={labelClass}>Email Link</label>
                  <input
                    type="text"
                    value={content.contactPage?.emailHref || ''}
                    onChange={(e) => handleUpdate('contactPage.emailHref', e.target.value)}
                    placeholder="mailto:info@example.com"
                    className={inputClass}
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Tab Navigation */}
      <div className="flex gap-2 p-1 rounded-xl bg-secondary/50">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                isActive
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {activeTab === 'faqSection' && renderFAQSectionTab()}
          {activeTab === 'contactPage' && renderContactPageTab()}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default FAQEditor;