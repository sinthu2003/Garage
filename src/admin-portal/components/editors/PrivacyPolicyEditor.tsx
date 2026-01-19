import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Shield,
    FileText,
    ChevronRight,
    ChevronDown,
    Plus,
    Trash2,
    GripVertical,
    Type,
    AlignLeft,
    Calendar,
    BookOpen,
    ShieldCheck,
} from 'lucide-react';
import { usePrivacyPolicyContent, useTermsContent, useWarrantyPolicyContent } from '../../hooks/useContentHooks';
import { useContent } from '../../context/ContentContext';
import type { PolicySection } from '../../types/content.types';

interface PrivacyPolicyEditorProps {
    isDarkMode?: boolean;
    onPageChange?: (page: 'privacyPolicy' | 'termsOfService' | 'warrantyPolicy') => void;
}

export const PrivacyPolicyEditor: React.FC<PrivacyPolicyEditorProps> = ({ onPageChange }) => {
    const { updateField } = useContent();
    const privacyContent = usePrivacyPolicyContent();
    const termsContent = useTermsContent();
    const warrantyContent = useWarrantyPolicyContent();

    // Tab state: 'privacyPolicy' | 'termsOfService'
    const [activeTab, setActiveTab] = useState<'privacyPolicy' | 'termsOfService' | 'warrantyPolicy'>('privacyPolicy');

    // Derived content based on active tab
    const content = activeTab === 'privacyPolicy' ? privacyContent :
        activeTab === 'termsOfService' ? termsContent : warrantyContent;
    const contentPathPrefix = activeTab === 'privacyPolicy' ? 'privacyPolicy' :
        activeTab === 'termsOfService' ? 'termsOfService' : 'warrantyPolicy';

    const [expandedSections, setExpandedSections] = useState<Set<string>>(
        new Set(['header', 'sections'])
    );
    const [expandedItems, setExpandedItems] = useState<Set<number>>(new Set([0]));

    // Notify parent of page change for preview updates
    useEffect(() => {
        if (onPageChange) {
            onPageChange(activeTab);
        }
    }, [activeTab, onPageChange]);

    const toggleSection = (section: string) => {
        const newExpanded = new Set(expandedSections);
        if (newExpanded.has(section)) {
            newExpanded.delete(section);
        } else {
            newExpanded.add(section);
        }
        setExpandedSections(newExpanded);
    };

    const toggleItem = (index: number) => {
        const newExpanded = new Set(expandedItems);
        if (newExpanded.has(index)) {
            newExpanded.delete(index);
        } else {
            newExpanded.add(index);
        }
        setExpandedItems(newExpanded);
    };

    const handleUpdate = (path: string, value: unknown) => {
        updateField('pages', `${contentPathPrefix}.${path}`, value);
    };

    const addNewSection = () => {
        const newSection: PolicySection = {
            title: 'New Section',
            content: 'Enter section content here...',
        };
        const currentSections = content.sections || [];
        handleUpdate('sections', [...currentSections, newSection]);
        setExpandedItems(new Set([...expandedItems, currentSections.length]));
    };

    const handleTabChange = (tab: 'privacyPolicy' | 'termsOfService' | 'warrantyPolicy') => {
        setActiveTab(tab);
        // Reset expanded states or keep them? Resetting feels cleaner for context switch
        setExpandedItems(new Set([0]));
    };

    const inputClass = `w-full px-4 py-3 rounded-xl text-sm transition-all bg-secondary border-border text-foreground placeholder-muted-foreground focus:border-primary border focus:outline-none focus:ring-2 focus:ring-primary/20`;
    const labelClass = `text-sm font-medium text-muted-foreground`;
    const sectionClass = `rounded-xl border overflow-hidden border-border bg-card`;
    const sectionHeaderClass = `w-full flex items-center justify-between p-4 text-left transition-colors hover:bg-secondary/50`;

    return (
        <div className="space-y-6">
            {/* Tabs */}
            <div className="flex gap-2 p-1 bg-secondary/50 rounded-xl">
                <button
                    onClick={() => handleTabChange('privacyPolicy')}
                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${activeTab === 'privacyPolicy'
                        ? 'bg-primary text-primary-foreground shadow-sm'
                        : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                        }`}
                >
                    <Shield className="w-4 h-4" />
                    Privacy Policy
                </button>
                <button
                    onClick={() => handleTabChange('termsOfService')}
                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${activeTab === 'termsOfService'
                        ? 'bg-primary text-primary-foreground shadow-sm'
                        : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                        }`}
                >
                    <BookOpen className="w-4 h-4" />
                    Terms of Service
                </button>
                <button
                    onClick={() => handleTabChange('warrantyPolicy')}
                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${activeTab === 'warrantyPolicy'
                        ? 'bg-primary text-primary-foreground shadow-sm'
                        : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                        }`}
                >
                    <ShieldCheck className="w-4 h-4" />
                    Warranty Policy
                </button>
            </div>

            <AnimatePresence mode="wait">
                <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-6"
                >
                    {/* Header */}
                    <div className={sectionClass}>
                        <button onClick={() => toggleSection('header')} className={sectionHeaderClass}>
                            <div className="flex items-center gap-3">
                                <motion.div animate={{ rotate: expandedSections.has('header') ? 90 : 0 }}>
                                    <ChevronRight className="w-4 h-4 text-muted-foreground" />
                                </motion.div>
                                <Type className="w-5 h-5 text-primary" />
                                <span className="font-medium text-foreground">
                                    {activeTab === 'privacyPolicy' ? 'Privacy Policy Header' :
                                        activeTab === 'termsOfService' ? 'Terms Page Header' : 'Warranty Page Header'}
                                </span>
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
                                    <div className="p-4 pt-0 space-y-4 border-t border-border">
                                        <div className="space-y-2">
                                            <label className={labelClass}>Page Title</label>
                                            <div className="relative">
                                                <Type className="absolute left-3 top-3.5 w-4 h-4 text-muted-foreground" />
                                                <input
                                                    type="text"
                                                    value={content.title || ''}
                                                    onChange={(e) => handleUpdate('title', e.target.value)}
                                                    placeholder={
                                                        activeTab === 'privacyPolicy' ? "Privacy Policy" :
                                                            activeTab === 'termsOfService' ? "Terms of Service" : "Warranty Policy"
                                                    }
                                                    className={`${inputClass} pl-10`}
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className={labelClass}>Introduction / Description</label>
                                            <textarea
                                                value={content.description || ''}
                                                onChange={(e) => handleUpdate('description', e.target.value)}
                                                placeholder="Introduction text..."
                                                rows={4}
                                                className={inputClass}
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <label className={labelClass}>Last Updated Date</label>
                                            <div className="relative">
                                                <Calendar className="absolute left-3 top-3.5 w-4 h-4 text-muted-foreground" />
                                                <input
                                                    type="text"
                                                    value={content.lastUpdated || ''}
                                                    onChange={(e) => handleUpdate('lastUpdated', e.target.value)}
                                                    placeholder="January 09, 2026"
                                                    className={`${inputClass} pl-10`}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Content Sections */}
                    <div className={sectionClass}>
                        <div className={sectionHeaderClass}>
                            <button
                                onClick={() => toggleSection('sections')}
                                className="flex items-center gap-3 flex-1"
                            >
                                <motion.div animate={{ rotate: expandedSections.has('sections') ? 90 : 0 }}>
                                    <ChevronRight className="w-4 h-4 text-muted-foreground" />
                                </motion.div>
                                <AlignLeft className="w-5 h-5 text-green-500" />
                                <span className="font-medium text-foreground">Content Sections</span>
                                <span className="px-2 py-0.5 rounded-full text-xs bg-secondary text-muted-foreground">
                                    {(content.sections?.length) || 0}
                                </span>
                            </button>
                            <button
                                onClick={addNewSection}
                                className="p-2 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary transition-colors"
                            >
                                <Plus className="w-5 h-5" />
                            </button>
                        </div>

                        <AnimatePresence>
                            {expandedSections.has('sections') && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    className="overflow-hidden"
                                >
                                    <div className="p-4 pt-0 space-y-4 border-t border-border">
                                        {(content.sections || []).map((section: PolicySection, index: number) => (
                                            <div
                                                key={index}
                                                className="rounded-xl border border-border bg-secondary/30 overflow-hidden"
                                            >
                                                <button
                                                    onClick={() => toggleItem(index)}
                                                    className="w-full flex items-center justify-between p-3 text-left hover:bg-secondary/50"
                                                >
                                                    <div className="flex items-center gap-3 min-w-0">
                                                        <GripVertical className="w-4 h-4 text-muted-foreground hidden sm:block" />
                                                        <span className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold bg-background text-primary border border-border">
                                                            {index + 1}
                                                        </span>
                                                        <span className="font-medium text-foreground truncate">
                                                            {section.title || 'Untitled Section'}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                const newSections = (content.sections || []).filter((_, i) => i !== index);
                                                                handleUpdate('sections', newSections);
                                                            }}
                                                            className="p-2 rounded-lg text-destructive hover:bg-destructive/10 transition-colors"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                        <motion.div animate={{ rotate: expandedItems.has(index) ? 180 : 0 }}>
                                                            <ChevronDown className="w-4 h-4 text-muted-foreground" />
                                                        </motion.div>
                                                    </div>
                                                </button>

                                                <AnimatePresence>
                                                    {expandedItems.has(index) && (
                                                        <motion.div
                                                            initial={{ height: 0, opacity: 0 }}
                                                            animate={{ height: 'auto', opacity: 1 }}
                                                            exit={{ height: 0, opacity: 0 }}
                                                            className="overflow-hidden"
                                                        >
                                                            <div className="p-4 pt-0 space-y-4 border-t border-border/50">
                                                                <div className="space-y-2">
                                                                    <label className={labelClass}>Section Title</label>
                                                                    <input
                                                                        type="text"
                                                                        value={section.title || ''}
                                                                        onChange={(e) => {
                                                                            const newSections = [...(content.sections || [])];
                                                                            newSections[index] = { ...newSections[index], title: e.target.value };
                                                                            handleUpdate('sections', newSections);
                                                                        }}
                                                                        placeholder="e.g. 1. DEFINITIONS"
                                                                        className={inputClass}
                                                                    />
                                                                </div>
                                                                <div className="space-y-2">
                                                                    <label className={labelClass}>Section Content</label>
                                                                    <textarea
                                                                        value={section.content || ''}
                                                                        onChange={(e) => {
                                                                            const newSections = [...(content.sections || [])];
                                                                            newSections[index] = { ...newSections[index], content: e.target.value };
                                                                            handleUpdate('sections', newSections);
                                                                        }}
                                                                        placeholder="Enter the full text for this section..."
                                                                        rows={12}
                                                                        className={inputClass}
                                                                    />
                                                                </div>
                                                            </div>
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </div>
                                        ))}

                                        {(!content.sections || content.sections.length === 0) && (
                                            <div className="text-center py-10 text-muted-foreground">
                                                <FileText className="w-10 h-10 mx-auto mb-3 opacity-20" />
                                                <p>No sections added yet</p>
                                                <button onClick={addNewSection} className="mt-4 text-primary font-medium hover:underline">
                                                    + Add your first section
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </motion.div>
            </AnimatePresence>
        </div>
    );
};

export default PrivacyPolicyEditor;
