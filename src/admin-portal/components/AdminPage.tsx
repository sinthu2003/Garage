
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
  Search,
  Home,
  ExternalLink,
  Menu,
} from 'lucide-react';
import { useContent } from '../context/ContentContext';
import { editorConfig, type EditorId } from './editors';
import {
  HeroEditor,
  ServicesEditor,
  ServiceDetailEditor, // Added import
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

/**
 * AdminPage - Full-page admin panel for /admin route
 * Fully responsive with mobile-first design
 */
export const AdminPage: React.FC = () => {
  const navigate = useNavigate();
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
    lastSaved,
  } = useContent();

  const [isDarkMode, setIsDarkMode] = useState(true);
  const [activeEditor, setActiveEditor] = useState<EditorId>('hero');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSaveIndicator, setShowSaveIndicator] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Filter editors based on search
  const filteredEditors = editorConfig.filter(
    (editor) =>
      editor.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      editor.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Close mobile menu on resize to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Show save indicator when content changes
  useEffect(() => {
    if (hasUnsavedChanges) {
      setShowSaveIndicator(true);
      const timer = setTimeout(() => setShowSaveIndicator(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [content, hasUnsavedChanges]);

  // Show notification
  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3000);
  };

  // Handle export
  const handleExport = () => {
    try {
      const jsonContent = exportContent();
      const blob = new Blob([jsonContent], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `site-content-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
      showNotification('success', 'Content exported successfully!');
    } catch (error) {
      showNotification('error', 'Failed to export content');
    }
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
          try {
            const content = event.target?.result as string;
            const success = importContent(content);
            if (success) {
              showNotification('success', 'Content imported successfully!');
            } else {
              showNotification('error', 'Failed to import. Invalid format.');
            }
          } catch (error) {
            showNotification('error', 'Failed to import content');
          }
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
    showNotification('success', 'Content reset to defaults!');
  };

  // Handle editor selection (closes mobile menu)
  const handleEditorSelect = (editorId: EditorId) => {
    setActiveEditor(editorId);
    setMobileMenuOpen(false);
  };

  // Get active editor component with SAFETY CHECK
  const activeEditorConfig = editorConfig.find((e) => e.id === activeEditor);
  const Component = activeEditorConfig ? editorComponents[activeEditorConfig.component] : null;

  // Fallback for missing components (Fixes the "Element type is invalid" crash)
  const ActiveEditorComponent = Component || (() => (
    <div className="p-6 text-center text-red-500 border border-red-200 rounded-lg bg-red-50">
      <h3 className="font-bold">Component Not Found</h3>
      <p className="text-sm mt-1">
        Could not load the editor for <strong>{activeEditor}</strong>. 
        Please check if the component is correctly exported in <code>editors/index.ts</code>.
      </p>
    </div>
  ));

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
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
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [canUndo, canRedo, undo, redo]);

  // Theme-aware class helper
  const themeClass = (darkClass: string, lightClass: string) =>
    isDarkMode ? darkClass : lightClass;

  return (
    <div className={`admin-page min-h-screen flex flex-col lg:flex-row ${themeClass('bg-background', 'bg-background')}`}>
      {/* Mobile Header */}
      <header
        className={`lg:hidden sticky top-0 z-50 flex items-center justify-between px-4 py-3 border-b ${themeClass('bg-card border-border', 'bg-card border-border')}`}
      >
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`p-2 rounded-xl ${themeClass('hover:bg-secondary text-foreground', 'hover:bg-secondary text-foreground')}`}
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className={`font-semibold text-sm ${themeClass('text-foreground', 'text-foreground')}`}>CMS</span>
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
            onClick={() => navigate('/')}
            className="p-2 rounded-xl bg-primary text-primary-foreground"
          >
            <Home className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="lg:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
              onClick={() => setMobileMenuOpen(false)}
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className={`lg:hidden fixed left-0 top-0 bottom-0 z-50 w-[280px] max-w-[85vw] flex flex-col ${themeClass('bg-card border-border', 'bg-card border-border')} border-r`}
            >
              {/* Mobile Sidebar Header */}
              <div className={`p-4 flex items-center justify-between border-b ${themeClass('border-border', 'border-border')}`}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-primary-foreground" />
                  </div>
                  <div>
                    <h1 className={`font-bold ${themeClass('text-foreground', 'text-foreground')}`}>CMS Editor</h1>
                    <p className={`text-xs ${themeClass('text-muted-foreground', 'text-muted-foreground')}`}>Content Manager</p>
                  </div>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
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

              {/* Mobile Navigation */}
              <nav className="flex-1 overflow-y-auto p-3 space-y-1">
                {filteredEditors.map((editor) => {
                  const Icon = iconMap[editor.icon] || Sparkles;
                  const isActive = activeEditor === editor.id;

                  return (
                    <button
                      key={editor.id}
                      onClick={() => handleEditorSelect(editor.id)}
                      className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all ${
                        isActive
                          ? themeClass('bg-secondary', 'bg-secondary')
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
              </nav>

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
                  Reset to Default
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: sidebarCollapsed ? 80 : 280 }}
        className={`hidden lg:flex fixed left-0 top-0 h-full z-40 flex-col ${themeClass('bg-card border-border', 'bg-card border-border')} border-r`}
      >
        {/* Logo Header */}
        <div className={`p-4 flex items-center gap-3 border-b ${themeClass('border-border', 'border-border')}`}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center flex-shrink-0">
            <Sparkles className="w-5 h-5 text-primary-foreground" />
          </div>
          <AnimatePresence>
            {!sidebarCollapsed && (
              <motion.div
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                className="overflow-hidden"
              >
                <h1 className={`font-bold text-lg whitespace-nowrap ${themeClass('text-foreground', 'text-foreground')}`}>
                  CMS Editor
                </h1>
                <p className={`text-xs whitespace-nowrap ${themeClass('text-muted-foreground', 'text-muted-foreground')}`}>
                  Content Manager
                </p>
              </motion.div>
            )}
          </AnimatePresence>
          {!sidebarCollapsed && (
            <button
              onClick={() => setSidebarCollapsed(true)}
              className={`ml-auto p-1.5 rounded-lg ${themeClass('hover:bg-secondary text-muted-foreground', 'hover:bg-secondary text-muted-foreground')}`}
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Search */}
        {!sidebarCollapsed && (
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
        )}

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-1">
          {filteredEditors.map((editor) => {
            const Icon = iconMap[editor.icon] || Sparkles;
            const isActive = activeEditor === editor.id;

            return (
              <button
                key={editor.id}
                onClick={() => setActiveEditor(editor.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
                  isActive
                    ? themeClass('bg-secondary', 'bg-secondary')
                    : themeClass('hover:bg-secondary/50', 'hover:bg-secondary/50')
                } ${sidebarCollapsed ? 'justify-center' : ''}`}
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
        </nav>

        {/* Sidebar Footer */}
        {!sidebarCollapsed && (
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
              Reset to Default
            </button>
          </div>
        )}

        {/* Expand Button when collapsed */}
        {sidebarCollapsed && (
          <div className={`p-3 border-t ${themeClass('border-border', 'border-border')}`}>
            <button
              onClick={() => setSidebarCollapsed(false)}
              className={`w-full flex items-center justify-center p-2 rounded-lg ${themeClass('hover:bg-secondary text-muted-foreground', 'hover:bg-secondary text-muted-foreground')}`}
            >
              <ChevronLeft className="w-5 h-5 rotate-180" />
            </button>
          </div>
        )}
      </motion.aside>

      {/* Main Content */}
      <main
        className="flex-1 flex flex-col min-h-0 transition-all duration-300 lg:ml-[280px]"
        style={{ marginLeft: typeof window !== 'undefined' && window.innerWidth >= 1024 ? (sidebarCollapsed ? 80 : 280) : 0 }}
      >
        {/* Desktop Header */}
        <header
          className={`hidden lg:flex sticky top-0 z-30 items-center justify-between px-4 md:px-6 py-4 border-b ${themeClass('bg-background/95 border-border', 'bg-background/95 border-border')} backdrop-blur-sm`}
        >
          <div className="flex items-center gap-2 sm:gap-4 flex-wrap">
            {/* Active Section Title */}
            <h2 className={`text-lg sm:text-xl font-bold ${themeClass('text-foreground', 'text-foreground')}`}>
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
                <Undo2 className="w-4 h-4 sm:w-5 sm:h-5" />
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
                <Redo2 className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>

            {/* Save Indicator */}
            <AnimatePresence>
              {showSaveIndicator && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/10"
                >
                  <Check className="w-4 h-4 text-green-500" />
                  <span className="text-xs font-medium text-green-500">Auto-saved</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Last Saved */}
            {lastSaved && !showSaveIndicator && (
              <span className={`hidden sm:block text-xs ${themeClass('text-muted-foreground', 'text-muted-foreground')}`}>
                Last saved: {lastSaved.toLocaleTimeString()}
              </span>
            )}
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

            {/* View Site Button */}
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className={`hidden sm:flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl text-sm font-medium ${themeClass('bg-secondary text-foreground hover:bg-secondary/80', 'bg-secondary text-foreground hover:bg-secondary/80')}`}
            >
              <ExternalLink className="w-4 h-4" />
              <span className="hidden md:inline">View Site</span>
            </a>

            {/* Back to Home */}
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <Home className="w-4 h-4" />
              <span className="hidden md:inline">Back to Site</span>
            </button>
          </div>
        </header>

        {/* Mobile Action Bar */}
        <div className={`lg:hidden flex items-center justify-between px-4 py-3 border-b ${themeClass('bg-card border-border', 'bg-card border-border')}`}>
          <h2 className={`text-base font-semibold ${themeClass('text-foreground', 'text-foreground')}`}>
            {editorConfig.find((e) => e.id === activeEditor)?.label || 'Editor'}
          </h2>
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
            {showSaveIndicator && (
              <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-green-500/10">
                <Check className="w-3 h-3 text-green-500" />
              </div>
            )}
          </div>
        </div>

        {/* Editor Content */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-4 md:p-6">
          <div className={`rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-6 ${themeClass('bg-card', 'bg-card shadow-sm')}`}>
            <ActiveEditorComponent isDarkMode={isDarkMode} />
          </div>
        </div>
      </main>

      {/* Reset Confirmation Modal */}
      <AnimatePresence>
        {showResetConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
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
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center bg-destructive/10">
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

      {/* Notification Toast */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className={`fixed bottom-4 right-4 left-4 sm:left-auto z-50 flex items-center justify-center sm:justify-start gap-3 px-4 py-3 rounded-xl shadow-lg ${
              notification.type === 'success'
                ? 'bg-green-500 text-white'
                : 'bg-destructive text-destructive-foreground'
            }`}
          >
            {notification.type === 'success' ? (
              <Check className="w-5 h-5 flex-shrink-0" />
            ) : (
              <X className="w-5 h-5 flex-shrink-0" />
            )}
            <span className="font-medium text-sm sm:text-base">{notification.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Dynamic sidebar margin for desktop */}
      <style>{`
        @media (min-width: 1024px) {
          .admin-page main {
            margin-left: ${sidebarCollapsed ? '80px' : '280px'} !important;
          }
        }
      `}</style>
    </div>
  );
};

export default AdminPage;
