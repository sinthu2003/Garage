import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Moon,
  Sun,
  Undo2,
  Redo2,
  Download,
  Upload,
  RotateCcw,
  Check,
  Sparkles,
  Wrench,
  DollarSign,
  Star,
  HelpCircle,
  Zap,
  Layers,
  Users,
  Image,
  SplitSquareHorizontal,
  Navigation,
  LayoutGrid,
  Globe,
  CalendarCheck,
  FileText,
  ChevronLeft,
  ChevronRight,
  Search,
  Menu,
} from 'lucide-react';
import { useContent } from '../context/ContentContext';
import { editorConfig, type EditorId } from './editors';
import {
  HeroEditor,
  ServicesEditor,
  ServiceDetailEditor, // Imported
  PricingEditor,
  TestimonialsEditor,
  FAQEditor,
  FeaturesEditor,
  HowItWorksEditor,
  PartnersEditor,
  GalleryEditor,
  BeforeAfterEditor,
  NavbarEditor,
  FooterEditor,
  GlobalSettingsEditor,
  BookingWidgetEditor,
  PagesEditor,
} from './editors';

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

// Icon mapping
const iconMap: Record<string, React.FC<{ className?: string }>> = {
  Sparkles,
  Wrench,
  DollarSign,
  Star,
  HelpCircle,
  Zap,
  Layers,
  Users,
  Image,
  SplitSquareHorizontal,
  Navigation,
  LayoutGrid,
  Globe,
  CalendarCheck,
  FileText,
};

// Editor component mapping
const editorComponents: Record<string, React.FC<{ isDarkMode: boolean }>> = {
  HeroEditor,
  ServicesEditor,
  ServiceDetailEditor, // Added mapping
  PricingEditor,
  TestimonialsEditor,
  FAQEditor,
  FeaturesEditor,
  HowItWorksEditor,
  PartnersEditor,
  GalleryEditor,
  BeforeAfterEditor,
  NavbarEditor,
  FooterEditor,
  GlobalSettingsEditor,
  BookingWidgetEditor,
  PagesEditor,
};

export const AdminPanel: React.FC<AdminPanelProps> = ({ isOpen, onClose }) => {
  const {
    content,
    undo,
    redo,
    canUndo,
    canRedo,
    resetContent,
    exportContent,
    importContent,
    hasUnsavedChanges,
  } = useContent();

  const [isDarkMode, setIsDarkMode] = useState(true);
  const [activeEditor, setActiveEditor] = useState<EditorId>('hero');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSaveIndicator, setShowSaveIndicator] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Check for mobile viewport
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setSidebarCollapsed(true);
      }
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Filter editors based on search
  const filteredEditors = editorConfig.filter(
    (editor) =>
      editor.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      editor.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Show save indicator when content changes
  useEffect(() => {
    if (hasUnsavedChanges) {
      setShowSaveIndicator(true);
      const timer = setTimeout(() => setShowSaveIndicator(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [content, hasUnsavedChanges]);

  // Handle export
  const handleExport = () => {
    const jsonContent = exportContent();
    const blob = new Blob([jsonContent], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `site-content-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Handle import
  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const content = event.target?.result as string;
          importContent(content);
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  // Handle reset
  const handleReset = () => {
    resetContent();
    setShowResetConfirm(false);
  };

  // Handle editor selection
  const handleEditorSelect = (editorId: EditorId) => {
    setActiveEditor(editorId);
    if (isMobile) {
      setMobileSidebarOpen(false);
    }
  };

  // Get active editor component
  const ActiveEditorComponent = editorComponents[
    editorConfig.find((e) => e.id === activeEditor)?.component || 'HeroEditor'
  ];

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.metaKey || e.ctrlKey) {
        if (e.key === 'z' && !e.shiftKey) {
          e.preventDefault();
          if (canUndo) undo();
        }
        if ((e.key === 'z' && e.shiftKey) || e.key === 'y') {
          e.preventDefault();
          if (canRedo) redo();
        }
        if (e.key === 's') {
          e.preventDefault();
          handleExport();
        }
      }

      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, canUndo, canRedo, undo, redo, onClose]);

  // Theme-aware class helper
  const themeClass = (darkClass: string, lightClass: string) =>
    isDarkMode ? darkClass : lightClass;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9998] bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Panel Container */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className={`fixed right-0 top-0 bottom-0 z-[9999] flex flex-col md:flex-row ${themeClass('bg-background', 'bg-background')} shadow-2xl`}
            style={{ 
              width: isMobile ? '100%' : 'min(100%, 1200px)',
              maxWidth: '100vw'
            }}
          >
            {/* Mobile Header */}
            <div className={`md:hidden flex items-center justify-between p-3 border-b ${themeClass('border-border bg-card', 'border-border bg-card')}`}>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
                  className={`p-2 rounded-xl ${themeClass('hover:bg-secondary text-foreground', 'hover:bg-secondary text-foreground')}`}
                >
                  <Menu className="w-5 h-5" />
                </button>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-primary-foreground" />
                  </div>
                  <span className={`font-semibold text-sm ${themeClass('text-foreground', 'text-foreground')}`}>
                    {editorConfig.find((e) => e.id === activeEditor)?.label || 'Editor'}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setIsDarkMode(!isDarkMode)}
                  className={`p-2 rounded-xl ${themeClass('hover:bg-secondary text-muted-foreground', 'hover:bg-secondary text-muted-foreground')}`}
                >
                  {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                </button>
                <button
                  onClick={onClose}
                  className={`p-2 rounded-xl ${themeClass('hover:bg-secondary text-muted-foreground', 'hover:bg-secondary text-muted-foreground')}`}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Mobile Sidebar Overlay */}
            <AnimatePresence>
              {mobileSidebarOpen && isMobile && (
                <>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="md:hidden fixed inset-0 z-[10000] bg-black/40"
                    onClick={() => setMobileSidebarOpen(false)}
                  />
                  <motion.div
                    initial={{ x: '-100%' }}
                    animate={{ x: 0 }}
                    exit={{ x: '-100%' }}
                    transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                    className={`md:hidden fixed left-0 top-0 bottom-0 z-[10001] w-[280px] max-w-[85vw] flex flex-col ${themeClass('bg-card border-border', 'bg-card border-border')} border-r`}
                  >
                    {/* Mobile Sidebar Header */}
                    <div className={`p-4 flex items-center justify-between border-b ${themeClass('border-border', 'border-border')}`}>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center">
                          <Sparkles className="w-5 h-5 text-primary-foreground" />
                        </div>
                        <div>
                          <h2 className={`font-bold ${themeClass('text-foreground', 'text-foreground')}`}>CMS Editor</h2>
                          <p className={`text-xs ${themeClass('text-muted-foreground', 'text-muted-foreground')}`}>Content Manager</p>
                        </div>
                      </div>
                      <button
                        onClick={() => setMobileSidebarOpen(false)}
                        className={`p-2 rounded-xl ${themeClass('hover:bg-secondary text-muted-foreground', 'hover:bg-secondary text-muted-foreground')}`}
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    {/* Mobile Search */}
                    <div className="p-3">
                      <div className={`relative flex items-center ${themeClass('bg-secondary', 'bg-secondary')} rounded-xl`}>
                        <Search className={`absolute left-3 w-4 h-4 ${themeClass('text-muted-foreground', 'text-muted-foreground')}`} />
                        <input
                          type="text"
                          placeholder="Search sections..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className={`w-full pl-10 pr-4 py-2.5 bg-transparent text-sm ${themeClass('text-foreground placeholder-muted-foreground', 'text-foreground placeholder-muted-foreground')} focus:outline-none`}
                        />
                      </div>
                    </div>

                    {/* Mobile Section List */}
                    <div className="flex-1 overflow-y-auto py-2">
                      {filteredEditors.map((editor) => {
                        const Icon = iconMap[editor.icon] || Sparkles;
                        const isActive = activeEditor === editor.id;

                        return (
                          <button
                            key={editor.id}
                            onClick={() => handleEditorSelect(editor.id)}
                            className={`w-full flex items-center gap-3 px-4 py-3 transition-all ${
                              isActive
                                ? themeClass('bg-secondary border-r-2 border-primary', 'bg-secondary border-r-2 border-primary')
                                : themeClass('hover:bg-secondary/50', 'hover:bg-secondary/50')
                            }`}
                          >
                            <div className={`w-9 h-9 rounded-xl flex items-center justify-center bg-gradient-to-br ${editor.color}`}>
                              <Icon className="w-4 h-4 text-white" />
                            </div>
                            <span className={`text-sm font-medium ${isActive ? 'text-primary' : themeClass('text-foreground', 'text-foreground')}`}>
                              {editor.label}
                            </span>
                          </button>
                        );
                      })}
                    </div>

                    {/* Mobile Sidebar Footer */}
                    <div className={`p-4 border-t ${themeClass('border-border', 'border-border')}`}>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={handleExport}
                          className={`flex items-center justify-center gap-2 p-2.5 rounded-xl text-sm font-medium ${themeClass('bg-secondary text-foreground hover:bg-secondary/80', 'bg-secondary text-foreground hover:bg-secondary/80')}`}
                        >
                          <Download className="w-4 h-4" />
                          Export
                        </button>
                        <button
                          onClick={handleImport}
                          className={`flex items-center justify-center gap-2 p-2.5 rounded-xl text-sm font-medium ${themeClass('bg-secondary text-foreground hover:bg-secondary/80', 'bg-secondary text-foreground hover:bg-secondary/80')}`}
                        >
                          <Upload className="w-4 h-4" />
                          Import
                        </button>
                      </div>
                      <button
                        onClick={() => setShowResetConfirm(true)}
                        className="w-full mt-2 flex items-center justify-center gap-2 p-2.5 rounded-xl text-sm font-medium bg-destructive/10 text-destructive hover:bg-destructive/20"
                      >
                        <RotateCcw className="w-4 h-4" />
                        Reset
                      </button>
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>

            {/* Desktop Sidebar */}
            <motion.div
              animate={{ width: sidebarCollapsed ? 80 : 280 }}
              className={`hidden md:flex flex-shrink-0 border-r ${themeClass('border-border bg-card', 'border-border bg-card')} flex-col`}
            >
              {/* Sidebar Header */}
              <div className={`p-4 border-b ${themeClass('border-border', 'border-border')}`}>
                <div className="flex items-center justify-between">
                  {!sidebarCollapsed && (
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center">
                        <Sparkles className="w-5 h-5 text-primary-foreground" />
                      </div>
                      <div>
                        <h2 className={`font-bold ${themeClass('text-foreground', 'text-foreground')}`}>
                          CMS Editor
                        </h2>
                        <p className={`text-xs ${themeClass('text-muted-foreground', 'text-muted-foreground')}`}>
                          Content Manager
                        </p>
                      </div>
                    </div>
                  )}
                  <button
                    onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                    className={`p-2 rounded-lg transition-colors ${themeClass('hover:bg-secondary text-muted-foreground', 'hover:bg-secondary text-muted-foreground')} ${sidebarCollapsed ? 'mx-auto' : ''}`}
                  >
                    {sidebarCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
                  </button>
                </div>

                {/* Search */}
                {!sidebarCollapsed && (
                  <div className="mt-4 relative">
                    <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${themeClass('text-muted-foreground', 'text-muted-foreground')}`} />
                    <input
                      type="text"
                      placeholder="Search sections..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className={`w-full pl-10 pr-4 py-2.5 rounded-xl text-sm ${themeClass('bg-secondary border-border text-foreground placeholder-muted-foreground', 'bg-secondary border-border text-foreground placeholder-muted-foreground')} border focus:outline-none focus:ring-2 focus:ring-primary/20`}
                    />
                  </div>
                )}
              </div>

              {/* Section List */}
              <div className="flex-1 overflow-y-auto py-2">
                {filteredEditors.map((editor) => {
                  const Icon = iconMap[editor.icon] || Sparkles;
                  const isActive = activeEditor === editor.id;

                  return (
                    <button
                      key={editor.id}
                      onClick={() => setActiveEditor(editor.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 transition-all ${
                        isActive
                          ? themeClass('bg-secondary border-r-2 border-primary', 'bg-secondary border-r-2 border-primary')
                          : themeClass('hover:bg-secondary/50', 'hover:bg-secondary/50')
                      } ${sidebarCollapsed ? 'justify-center px-2' : ''}`}
                    >
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center bg-gradient-to-br ${editor.color}`}>
                        <Icon className="w-4 h-4 text-white" />
                      </div>
                      {!sidebarCollapsed && (
                        <span className={`text-sm font-medium ${isActive ? 'text-primary' : themeClass('text-foreground', 'text-foreground')}`}>
                          {editor.label}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Sidebar Footer Actions */}
              {!sidebarCollapsed && (
                <div className={`p-4 border-t ${themeClass('border-border', 'border-border')}`}>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={handleExport}
                      className={`flex items-center justify-center gap-2 p-2 rounded-lg text-sm ${themeClass('bg-secondary text-foreground hover:bg-secondary/80', 'bg-secondary text-foreground hover:bg-secondary/80')}`}
                    >
                      <Download className="w-4 h-4" />
                      Export
                    </button>
                    <button
                      onClick={handleImport}
                      className={`flex items-center justify-center gap-2 p-2 rounded-lg text-sm ${themeClass('bg-secondary text-foreground hover:bg-secondary/80', 'bg-secondary text-foreground hover:bg-secondary/80')}`}
                    >
                      <Upload className="w-4 h-4" />
                      Import
                    </button>
                  </div>
                  <button
                    onClick={() => setShowResetConfirm(true)}
                    className="w-full mt-2 flex items-center justify-center gap-2 p-2 rounded-lg text-sm bg-destructive/10 text-destructive hover:bg-destructive/20"
                  >
                    <RotateCcw className="w-4 h-4" />
                    Reset to Default
                  </button>
                </div>
              )}
            </motion.div>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col overflow-hidden min-w-0">
              {/* Desktop Header */}
              <div className={`hidden md:flex items-center justify-between p-4 border-b ${themeClass('border-border', 'border-border')}`}>
                <div className="flex items-center gap-2 sm:gap-4 flex-wrap min-w-0">
                  {/* Section Title */}
                  <h2 className={`text-lg font-semibold truncate ${themeClass('text-foreground', 'text-foreground')}`}>
                    {editorConfig.find((e) => e.id === activeEditor)?.label || 'Editor'}
                  </h2>

                  {/* Undo/Redo */}
                  <div className="flex items-center gap-1">
                    <button
                      onClick={undo}
                      disabled={!canUndo}
                      className={`p-2 rounded-lg transition-colors ${
                        canUndo
                          ? themeClass('hover:bg-secondary text-foreground', 'hover:bg-secondary text-foreground')
                          : 'opacity-30 cursor-not-allowed'
                      }`}
                      title="Undo (Ctrl+Z)"
                    >
                      <Undo2 className="w-5 h-5" />
                    </button>
                    <button
                      onClick={redo}
                      disabled={!canRedo}
                      className={`p-2 rounded-lg transition-colors ${
                        canRedo
                          ? themeClass('hover:bg-secondary text-foreground', 'hover:bg-secondary text-foreground')
                          : 'opacity-30 cursor-not-allowed'
                      }`}
                      title="Redo (Ctrl+Y)"
                    >
                      <Redo2 className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Save Indicator */}
                  <AnimatePresence>
                    {showSaveIndicator && (
                      <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/10"
                      >
                        <Check className="w-4 h-4 text-green-500" />
                        <span className="text-xs font-medium text-green-500">
                          Auto-saved
                        </span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div className="flex items-center gap-2">
                  {/* Dark Mode Toggle */}
                  <button
                    onClick={() => setIsDarkMode(!isDarkMode)}
                    className={`p-2 rounded-lg transition-colors ${themeClass('hover:bg-secondary text-muted-foreground', 'hover:bg-secondary text-muted-foreground')}`}
                    title={isDarkMode ? 'Light Mode' : 'Dark Mode'}
                  >
                    {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                  </button>

                  {/* Close Button */}
                  <button
                    onClick={onClose}
                    className={`p-2 rounded-lg transition-colors ${themeClass('hover:bg-secondary text-muted-foreground', 'hover:bg-secondary text-muted-foreground')}`}
                    title="Close (Esc)"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Mobile Action Bar */}
              <div className={`md:hidden flex items-center justify-between px-3 py-2 border-b ${themeClass('border-border', 'border-border')}`}>
                <div className="flex items-center gap-1">
                  <button
                    onClick={undo}
                    disabled={!canUndo}
                    className={`p-2 rounded-lg ${canUndo ? themeClass('text-foreground', 'text-foreground') : 'opacity-30'}`}
                  >
                    <Undo2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={redo}
                    disabled={!canRedo}
                    className={`p-2 rounded-lg ${canRedo ? themeClass('text-foreground', 'text-foreground') : 'opacity-30'}`}
                  >
                    <Redo2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex items-center gap-1">
                  {showSaveIndicator && (
                    <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-green-500/10">
                      <Check className="w-3 h-3 text-green-500" />
                      <span className="text-xs text-green-500">Saved</span>
                    </div>
                  )}
                  <button
                    onClick={handleExport}
                    className={`p-2 rounded-lg ${themeClass('text-muted-foreground', 'text-muted-foreground')}`}
                  >
                    <Download className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleImport}
                    className={`p-2 rounded-lg ${themeClass('text-muted-foreground', 'text-muted-foreground')}`}
                  >
                    <Upload className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Editor Content */}
              <div className="flex-1 overflow-y-auto p-3 sm:p-4 md:p-6">
                <ActiveEditorComponent isDarkMode={isDarkMode} />
              </div>
            </div>
          </motion.div>

          {/* Reset Confirmation Modal */}
          <AnimatePresence>
            {showResetConfirm && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/60 p-4"
                onClick={() => setShowResetConfirm(false)}
              >
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  onClick={(e) => e.stopPropagation()}
                  className={`max-w-md w-full p-4 sm:p-6 rounded-2xl ${themeClass('bg-card', 'bg-card')} shadow-xl`}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-destructive/10 flex items-center justify-center">
                      <RotateCcw className="w-5 h-5 sm:w-6 sm:h-6 text-destructive" />
                    </div>
                    <div>
                      <h3 className={`text-base sm:text-lg font-bold ${themeClass('text-foreground', 'text-foreground')}`}>
                        Reset All Content?
                      </h3>
                      <p className={`text-xs sm:text-sm ${themeClass('text-muted-foreground', 'text-muted-foreground')}`}>
                        This action cannot be undone
                      </p>
                    </div>
                  </div>

                  <p className={`mb-6 text-sm sm:text-base ${themeClass('text-muted-foreground', 'text-muted-foreground')}`}>
                    All your content changes will be lost and reset to the default values. 
                    Consider exporting your content first.
                  </p>

                  <div className="flex gap-3">
                    <button
                      onClick={() => setShowResetConfirm(false)}
                      className={`flex-1 py-2.5 rounded-xl font-medium text-sm sm:text-base ${themeClass('bg-secondary text-foreground hover:bg-secondary/80', 'bg-secondary text-foreground hover:bg-secondary/80')}`}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleReset}
                      className="flex-1 py-2.5 rounded-xl font-medium text-sm sm:text-base bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      Reset Content
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
    </AnimatePresence>
  );
};

export default AdminPanel;