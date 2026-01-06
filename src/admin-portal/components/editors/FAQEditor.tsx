import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HelpCircle,
  Type,
  Phone,
  MessageCircle,
  Mail,
  ChevronRight,
  ChevronDown,
  Plus,
  Trash2,
  GripVertical,
} from 'lucide-react';
import { useFAQContent } from '../../hooks/useContentHooks';
import { useContent } from '../../context/ContentContext';
import type { FAQContactCard, FAQItem } from '../../types/content.types';

interface FAQEditorProps {
  isDarkMode: boolean;
}

// Contact type options
const contactTypeOptions = [
  { value: 'phone', label: 'Phone', icon: Phone },
  { value: 'whatsapp', label: 'WhatsApp', icon: MessageCircle },
  { value: 'email', label: 'Email', icon: Mail },
];

export const FAQEditor: React.FC<FAQEditorProps> = ({ }) => {
  const { updateField } = useContent();
  const content = useFAQContent();
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(['header', 'contactCards', 'items'])
  );
  const [expandedFAQs, setExpandedFAQs] = useState<Set<number>>(new Set([0]));

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
    handleUpdate('contactCards', [...(content.contactCards || []), newCard]);
  };

  const addNewFAQ = () => {
    const newFAQ: FAQItem = {
      question: 'New Question?',
      answer: 'Answer to the question goes here.',
    };
    handleUpdate('items', [...(content.items || []), newFAQ]);
  };

  // Get icon component by type
  const getContactIcon = (type: string) => {
    const option = contactTypeOptions.find(opt => opt.value === type);
    return option?.icon || Phone;
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 pb-4 border-b border-border">
        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center flex-shrink-0">
          <HelpCircle className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
        </div>
        <div className="min-w-0">
          <h2 className="text-lg sm:text-xl font-bold text-foreground truncate">
            FAQ Editor
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Frequently asked questions and contact cards
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
                    placeholder="FAQ"
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
                      placeholder="Frequently Asked"
                      className={inputClass}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className={labelClass}>Highlighted Text</label>
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
                  <label className={labelClass}>Description</label>
                  <textarea
                    value={content.description || ''}
                    onChange={(e) => handleUpdate('description', e.target.value)}
                    placeholder="Everything you need to know..."
                    rows={2}
                    className={inputClass}
                  />
                </div>

                {/* Preview */}
                <div className="p-3 sm:p-4 rounded-xl bg-secondary">
                  <p className="text-xs uppercase tracking-wider mb-2 text-muted-foreground">
                    Preview
                  </p>
                  <div className="inline-block px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-medium mb-2">
                    {content.badge || 'FAQ'}
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-foreground">
                    {content.headline?.line1 || 'Frequently Asked'}
                    {' '}
                    <span className="text-primary">{content.headline?.highlight || 'Questions'}</span>
                  </h3>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Contact Cards */}
      <div className={sectionClass}>
        <button onClick={() => toggleSection('contactCards')} className={sectionHeaderClass}>
          <div className="flex items-center gap-2 sm:gap-3">
            <motion.div animate={{ rotate: expandedSections.has('contactCards') ? 90 : 0 }}>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </motion.div>
            <Phone className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />
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
        </button>

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
                  const IconComponent = getContactIcon(card.type);

                  return (
                    <div
                      key={index}
                      className="p-3 sm:p-4 rounded-xl border border-border bg-card"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-start gap-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                          card.type === 'phone' ? 'bg-blue-500/10' :
                          card.type === 'whatsapp' ? 'bg-green-500/10' :
                          'bg-purple-500/10'
                        }`}>
                          <IconComponent className={`w-5 h-5 ${
                            card.type === 'phone' ? 'text-blue-500' :
                            card.type === 'whatsapp' ? 'text-green-500' :
                            'text-purple-500'
                          }`} />
                        </div>

                        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3">
                          <select
                            value={card.type || 'phone'}
                            onChange={(e) => {
                              const newCards = [...(content.contactCards || [])];
                              newCards[index] = { ...newCards[index], type: e.target.value };
                              handleUpdate('contactCards', newCards);
                            }}
                            className={inputClass}
                          >
                            {contactTypeOptions.map(opt => (
                              <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                          </select>

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

                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={card.href || ''}
                              onChange={(e) => {
                                const newCards = [...(content.contactCards || [])];
                                newCards[index] = { ...newCards[index], href: e.target.value };
                                handleUpdate('contactCards', newCards);
                              }}
                              placeholder="tel:+91..."
                              className={`flex-1 ${inputClass}`}
                            />
                            <button
                              onClick={() => {
                                const newCards = content.contactCards?.filter((_: FAQContactCard, i: number) => i !== index);
                                handleUpdate('contactCards', newCards);
                              }}
                              className="p-2 rounded-lg text-destructive hover:bg-destructive/10 flex-shrink-0"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
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

                {/* Contact Cards Preview */}
                {content.contactCards && content.contactCards.length > 0 && (
                  <div className="p-3 sm:p-4 rounded-xl bg-secondary">
                    <p className="text-xs uppercase tracking-wider mb-3 text-muted-foreground">
                      Preview
                    </p>
                    <div className="flex flex-wrap gap-2 sm:gap-3">
                      {content.contactCards.map((card: FAQContactCard, i: number) => {
                        const Icon = getContactIcon(card.type);
                        const bgColor = card.type === 'phone' ? 'bg-blue-500' :
                                       card.type === 'whatsapp' ? 'bg-green-500' : 'bg-purple-500';

                        return (
                          <div
                            key={i}
                            className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl ${bgColor} text-white`}
                          >
                            <Icon className="w-4 h-4" />
                            <span className="text-xs sm:text-sm font-medium">{card.value}</span>
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

      {/* FAQ Items */}
      <div className={sectionClass}>
        <button onClick={() => toggleSection('items')} className={sectionHeaderClass}>
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
        </button>

        <AnimatePresence>
          {expandedSections.has('items') && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="p-3 sm:p-4 pt-0 space-y-3 sm:space-y-4 border-t border-border">
                <p className="text-xs text-muted-foreground">
                  💡 Drag items to reorder (coming soon)
                </p>

                {content.items?.map((faq: FAQItem, index: number) => (
                  <div
                    key={index}
                    className="rounded-xl border overflow-hidden border-border bg-card"
                  >
                    {/* FAQ Header */}
                    <button
                      onClick={() => toggleFAQ(index)}
                      className="w-full flex items-center justify-between p-3 sm:p-4 text-left hover:bg-secondary/50"
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
                    </button>

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
};

export default FAQEditor;