import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Moon,
  Sun,
  Undo2,
  Redo2,
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
  Menu,
  Eye,
  EyeOff,
  Minimize2,
  RefreshCw,
  ExternalLink,
  Copy,
  CheckCircle,
  Maximize2,
  Save,
  AlertCircle
} from 'lucide-react';
import { useContent } from '../context/ContentContext';
import {
  editorConfig,
  type EditorId,
  SectionPreviewWrapper,
  getPreviewUrl,
} from './editors';
import {
  HeroEditor,
  ServicesEditor,
  ServiceDetailEditor,
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
  FileText
};

// Editor component mapping - Updated type to support onEditingIndexChange callback
const editorComponents: Record<string, React.FC<{ isDarkMode: boolean; onEditingIndexChange?: (index: number | null) => void }>> = {
  HeroEditor,
  ServicesEditor,
  ServiceDetailEditor,
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
 * AdminPanel - Slide-out Panel with Two-Panel Layout
 * Left: Editor Fields (30%) | Right: Live Component Preview (70%)
 * Desktop-only preview with Apply Changes functionality
 */
export const AdminPanel: React.FC<AdminPanelProps> = ({ isOpen, onClose }) => {
  const {
    content,
    undo,
    redo,
    canUndo,
    canRedo,
    resetContent,
    hasUnsavedChanges,
    applyChanges,
    discardChanges,
  } = useContent();

  // Core states
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [activeEditor, setActiveEditor] = useState<EditorId>('hero');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);
  const [sidebarHovered, setSidebarHovered] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [showDiscardConfirm, setShowDiscardConfirm] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [isApplying, setIsApplying] = useState(false);

  // Two-panel layout states
  const [previewVisible, setPreviewVisible] = useState(true);
  const [previewFullscreen, setPreviewFullscreen] = useState(false);
  const [previewKey, setPreviewKey] = useState(0);
  const [editorPanelWidth, setEditorPanelWidth] = useState(30);
  const [isResizing, setIsResizing] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState(false);

  // NEW: ServiceDetail editing index state - tracks which service is being edited
  const [editingServiceIndex, setEditingServiceIndex] = useState<number | null>(null);

  const resizeRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const sidebarTimeoutRef = useRef<number | null>(null);

  // NEW: Handler for service editing index change
  const handleServiceEditingIndexChange = useCallback((index: number | null) => {
    setEditingServiceIndex(index);
  }, []);

  // Check for mobile/tablet viewport
  useEffect(() => {
    const checkViewport = () => {
      const width = window.innerWidth;
      const mobile = width < 768;
      const tablet = width >= 768 && width < 1024;

      setIsMobile(mobile);

      if (mobile) {
        setSidebarCollapsed(true);
        setPreviewVisible(false);
      } else if (tablet) {
        setSidebarCollapsed(true);
        setEditorPanelWidth(40);
      } else {
        setEditorPanelWidth(30);
      }
    };

    checkViewport();
    window.addEventListener('resize', checkViewport);
    return () => window.removeEventListener('resize', checkViewport);
  }, []);

  // Filter editors based on search
  const filteredEditors = editorConfig.filter(
    (editor) =>
      editor.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      editor.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Refresh preview when content changes (debounced)
  useEffect(() => {
    if (!isOpen) return;
    const timer = setTimeout(() => {
      setPreviewKey(k => k + 1);
    }, 300);
    return () => clearTimeout(timer);
  }, [content, isOpen]);

  // Reset editingServiceIndex when switching away from serviceDetail editor
  useEffect(() => {
    if (activeEditor !== 'serviceDetail') {
      setEditingServiceIndex(null);
    }
  }, [activeEditor]);

  // Show notification
  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3000);
  };

  // Handle Apply Changes
  const handleApplyChanges = async () => {
    if (!hasUnsavedChanges) return;

    setIsApplying(true);
    try {
      await applyChanges();
      showNotification('success', 'Changes applied successfully!');
      setPreviewKey((k) => k + 1);
    } catch (error) {
      showNotification('error', 'Failed to apply changes. Please try again.');
    } finally {
      setIsApplying(false);
    }
  };

  // Handle Discard Changes
  const handleDiscardChanges = () => {
    discardChanges();
    setShowDiscardConfirm(false);
    showNotification('success', 'Changes discarded!');
    setPreviewKey((k) => k + 1);
  };

  // Handle reset
  const handleReset = () => {
    resetContent();
    setShowResetConfirm(false);
    showNotification('success', 'Content reset!');
    setPreviewKey((k) => k + 1);
  };

  // Handle editor selection
  const handleEditorSelect = (editorId: EditorId) => {
    setActiveEditor(editorId);
    if (isMobile) {
      setMobileSidebarOpen(false);
    }
    setSidebarCollapsed(true);
    setSidebarHovered(false);
    setPreviewKey(k => k + 1);
  };

  // Handle sidebar hover
  const handleSidebarMouseEnter = () => {
    if (sidebarTimeoutRef.current) {
      clearTimeout(sidebarTimeoutRef.current);
    }
    setSidebarHovered(true);
  };

  const handleSidebarMouseLeave = () => {
    sidebarTimeoutRef.current = setTimeout(() => {
      setSidebarHovered(false);
    }, 300);
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (sidebarTimeoutRef.current) {
        clearTimeout(sidebarTimeoutRef.current);
      }
    };
  }, []);

  // Handle panel resize
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing || !containerRef.current) return;

      const container = containerRef.current;
      const containerRect = container.getBoundingClientRect();
      const sidebarWidth = (sidebarCollapsed && !sidebarHovered) ? 56 : 220;
      const availableWidth = containerRect.width - sidebarWidth;
      const mouseX = e.clientX - containerRect.left - sidebarWidth;
      const newWidth = (mouseX / availableWidth) * 100;

      setEditorPanelWidth(Math.min(Math.max(newWidth, 25), 50));
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
  }, [isResizing, sidebarCollapsed, sidebarHovered]);

  // Preview actions
  const refreshPreview = () => setPreviewKey((k) => k + 1);

  const copyPreviewUrl = () => {
    const url = window.location.origin + getPreviewUrl(activeEditor);
    navigator.clipboard.writeText(url);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2000);
  };

  const openInNewTab = () => {
    const url = getPreviewUrl(activeEditor);
    window.open(url, '_blank');
  };

  // Get active editor component
  const activeEditorConfig = editorConfig.find((e) => e.id === activeEditor);
  const Component = activeEditorConfig ? editorComponents[activeEditorConfig.component] : null;
  const ActiveEditorComponent = Component || (() => (
    <div className="p-6 text-center text-red-500 border border-red-200 rounded-lg bg-red-50">
      <h3 className="font-bold">Component Not Found</h3>
      <p className="text-sm mt-1">Could not load editor for <strong>{activeEditor}</strong>.</p>
    </div>
  ));

  // Render the editor component with special handling for ServiceDetailEditor
  const renderEditorComponent = () => {
    // Special handling for ServiceDetailEditor to pass the editing index callback
    if (activeEditor === 'serviceDetail') {
      return (
        <ServiceDetailEditor
          isDarkMode={isDarkMode}
          onEditingIndexChange={handleServiceEditingIndexChange}
        />
      );
    }
    // All other editors
    return <ActiveEditorComponent isDarkMode={isDarkMode} />;
  };

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
        if (e.key === 'p') {
          e.preventDefault();
          setPreviewVisible((v) => !v);
        }
        if (e.key === 's') {
          e.preventDefault();
          if (hasUnsavedChanges) handleApplyChanges();
        }
      }

      if (e.key === 'Escape') {
        if (previewFullscreen) {
          setPreviewFullscreen(false);
        } else {
          onClose();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, canUndo, canRedo, undo, redo, onClose, previewFullscreen, hasUnsavedChanges]);

  // Theme-aware class helper
  const themeClass = (darkClass: string, lightClass: string) =>
    isDarkMode ? darkClass : lightClass;

  // Determine if sidebar should be expanded (hovered or explicitly expanded)
  const isSidebarExpanded = !sidebarCollapsed || sidebarHovered;

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
            ref={containerRef}
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className={`fixed right-0 top-0 bottom-0 z-[9999] flex ${themeClass('bg-background', 'bg-gray-50')} shadow-2xl`}
            style={{
              width: isMobile ? '100%' : 'min(100%, 1600px)',
              maxWidth: '100vw'
            }}
          >
            {/* Mobile Header */}
            <div className={`md:hidden flex items-center justify-between p-3 border-b ${themeClass('border-border bg-card', 'border-gray-200 bg-white')} absolute top-0 left-0 right-0 z-10`}>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
                  className="p-2 rounded-xl hover:bg-secondary text-foreground"
                >
                  <Menu className="w-5 h-5" />
                </button>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-primary-foreground" />
                  </div>
                  <span className="font-semibold text-sm text-foreground">
                    {editorConfig.find((e) => e.id === activeEditor)?.label || 'Editor'}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setPreviewVisible(!previewVisible)}
                  className={`p-2 rounded-xl ${previewVisible ? 'bg-primary text-primary-foreground' : 'hover:bg-secondary text-muted-foreground'}`}
                >
                  {previewVisible ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                </button>
                {/* <button
                  onClick={() => setIsDarkMode(!isDarkMode)}
                  className="p-2 rounded-xl hover:bg-secondary text-muted-foreground"
                >
                  {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                </button> */}
                <button
                  onClick={onClose}
                  className="p-2 rounded-xl hover:bg-secondary text-muted-foreground"
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
                    className="fixed inset-0 z-[10000] bg-black/40"
                    onClick={() => setMobileSidebarOpen(false)}
                  />
                  <motion.div
                    initial={{ x: '-100%' }}
                    animate={{ x: 0 }}
                    exit={{ x: '-100%' }}
                    transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                    className={`fixed left-0 top-0 bottom-0 z-[10001] w-[280px] max-w-[85vw] flex flex-col ${themeClass('bg-card border-border', 'bg-white border-gray-200')} border-r`}
                  >
                    {/* Mobile Sidebar Header */}
                    <div className="p-4 flex items-center justify-between border-b border-border">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center">
                          <Sparkles className="w-5 h-5 text-primary-foreground" />
                        </div>
                        <div>
                          <h2 className="font-bold text-foreground">CMS Editor</h2>
                          <p className="text-xs text-muted-foreground">Content Manager</p>
                        </div>
                      </div>
                      <button
                        onClick={() => setMobileSidebarOpen(false)}
                        className="p-2 rounded-xl hover:bg-secondary text-muted-foreground"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    {/* Mobile Search */}
                    <div className="p-3">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <input
                          type="text"
                          placeholder="Search sections..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className={`w-full pl-10 pr-4 py-2.5 rounded-xl text-sm ${themeClass('bg-secondary text-foreground', 'bg-gray-100 text-gray-900')} focus:outline-none`}
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
                            className={`w-full flex items-center gap-3 px-4 py-3 transition-all ${isActive
                              ? 'bg-primary/10 border-r-2 border-primary'
                              : 'hover:bg-secondary/50'
                              }`}
                          >
                            <Icon className={`w-5 h-5 ${isActive ? 'text-primary' : 'text-muted-foreground'}`} />
                            <span className={`text-sm font-medium ${isActive ? 'text-primary' : 'text-foreground'}`}>
                              {editor.label}
                            </span>
                          </button>
                        );
                      })}
                    </div>

                    {/* Mobile Sidebar Footer */}
                    <div className="p-4 border-t border-border">
                      <button
                        onClick={() => setShowResetConfirm(true)}
                        className="w-full flex items-center justify-center gap-2 p-2.5 rounded-xl text-sm font-medium bg-destructive/10 text-destructive hover:bg-destructive/20"
                      >
                        <RotateCcw className="w-4 h-4" />
                        Reset
                      </button>
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>

            {/* Main Content */}
            <div className={`flex-1 flex overflow-hidden ${isMobile ? 'pt-14' : ''}`}>
              {/* Desktop Sidebar - Hover to Expand */}
              <motion.div
                animate={{ width: isSidebarExpanded ? 220 : 56 }}
                transition={{ duration: 0.2 }}
                onMouseEnter={handleSidebarMouseEnter}
                onMouseLeave={handleSidebarMouseLeave}
                className={`hidden md:flex flex-shrink-0 border-r ${themeClass('border-border bg-card', 'border-gray-200 bg-white')} flex-col relative z-10`}
              >
                {/* Sidebar Header */}
                <div className={`p-3 border-b ${themeClass('border-border', 'border-gray-200')}`}>
                  <div className="flex items-center justify-between">
                    {isSidebarExpanded ? (
                      <>
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center">
                            <Sparkles className="w-4 h-4 text-primary-foreground" />
                          </div>
                          <span className="font-semibold text-sm text-foreground">CMS Editor</span>
                        </div>
                        <button
                          onClick={() => {
                            setSidebarCollapsed(true);
                            setSidebarHovered(false);
                          }}
                          className="p-1.5 rounded-lg hover:bg-secondary text-muted-foreground"
                        >
                          <ChevronLeft className="w-4 h-4" />
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => setSidebarCollapsed(false)}
                        className="w-8 h-8 mx-auto rounded-lg bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center"
                      >
                        <Sparkles className="w-4 h-4 text-primary-foreground" />
                      </button>
                    )}
                  </div>

                  {/* Search */}
                  {isSidebarExpanded && (
                    <div className="mt-3 relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <input
                        type="text"
                        placeholder="Search..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className={`w-full pl-9 pr-3 py-2 rounded-lg text-sm ${themeClass('bg-secondary border-border text-foreground', 'bg-gray-100 border-gray-200 text-gray-900')} border focus:outline-none focus:ring-2 focus:ring-primary/20`}
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
                        onClick={() => handleEditorSelect(editor.id)}
                        title={!isSidebarExpanded ? editor.label : undefined}
                        className={`w-full flex items-center gap-2.5 py-2.5 transition-all ${isActive
                          ? 'bg-primary/10 border-r-2 border-primary'
                          : 'hover:bg-secondary/50'
                          } ${isSidebarExpanded ? 'px-3' : 'justify-center px-2'}`}
                      >
                        <Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-primary' : 'text-muted-foreground'}`} />
                        {isSidebarExpanded && (
                          <span className={`text-sm font-medium truncate ${isActive ? 'text-primary' : 'text-foreground'}`}>
                            {editor.label}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Sidebar Footer Actions */}
                {isSidebarExpanded && (
                  <div className={`p-3 border-t ${themeClass('border-border', 'border-gray-200')}`}>
                    <button
                      onClick={() => setShowResetConfirm(true)}
                      className="w-full flex items-center justify-center gap-2 p-2 rounded-lg text-sm bg-destructive/10 text-destructive hover:bg-destructive/20"
                    >
                      <RotateCcw className="w-4 h-4" />
                      Reset to Default
                    </button>
                  </div>
                )}
              </motion.div>

              {/* Main Content Area - Two Panel Layout */}
              <div className="flex-1 flex flex-col overflow-hidden min-w-0">
                {/* Desktop Header */}
                <div className={`hidden md:flex items-center justify-between p-3 border-b ${themeClass('border-border', 'border-gray-200')}`}>
                  <div className="flex items-center gap-4">
                    {/* Section Title */}
                    <h2 className="text-lg font-semibold text-foreground">
                      {editorConfig.find((e) => e.id === activeEditor)?.label || 'Editor'}
                    </h2>

                    {/* Undo/Redo */}
                    <div className="flex items-center gap-1">
                      <button
                        onClick={undo}
                        disabled={!canUndo}
                        className={`p-2 rounded-lg ${canUndo ? 'hover:bg-secondary text-foreground' : 'opacity-30 cursor-not-allowed'}`}
                        title="Undo (Ctrl+Z)"
                      >
                        <Undo2 className="w-5 h-5" />
                      </button>
                      <button
                        onClick={redo}
                        disabled={!canRedo}
                        className={`p-2 rounded-lg ${canRedo ? 'hover:bg-secondary text-foreground' : 'opacity-30 cursor-not-allowed'}`}
                        title="Redo (Ctrl+Y)"
                      >
                        <Redo2 className="w-5 h-5" />
                      </button>
                    </div>

                    {/* Unsaved Changes Indicator */}
                    <AnimatePresence>
                      {hasUnsavedChanges && (
                        <motion.div
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -10 }}
                          className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10"
                        >
                          <AlertCircle className="w-4 h-4 text-amber-500" />
                          <span className="text-xs font-medium text-amber-500">Unsaved changes</span>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Discard Changes Button */}
                    {hasUnsavedChanges && (
                      <button
                        onClick={() => setShowDiscardConfirm(true)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-muted-foreground hover:bg-secondary transition-colors"
                        title="Discard Changes"
                      >
                        <X className="w-4 h-4" />
                        <span className="hidden lg:inline">Discard</span>
                      </button>
                    )}

                    {/* Apply Changes Button */}
                    <motion.button
                      onClick={handleApplyChanges}
                      disabled={!hasUnsavedChanges || isApplying}
                      className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${hasUnsavedChanges && !isApplying
                        ? 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm'
                        : 'bg-secondary text-muted-foreground cursor-not-allowed opacity-50'
                        }`}
                      title="Apply Changes (Ctrl+S)"
                      whileTap={hasUnsavedChanges && !isApplying ? { scale: 0.95 } : {}}
                    >
                      {isApplying ? (
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                        >
                          <RefreshCw className="w-4 h-4" />
                        </motion.div>
                      ) : (
                        <Save className="w-4 h-4" />
                      )}
                      <span>{isApplying ? 'Applying...' : 'Apply Changes'}</span>
                    </motion.button>

                    <div className="w-px h-6 bg-border mx-1" />

                    {/* Preview Toggle */}
                    <button
                      onClick={() => setPreviewVisible(!previewVisible)}
                      className={`p-2 rounded-lg transition-colors ${previewVisible
                        ? 'bg-primary text-primary-foreground'
                        : 'hover:bg-secondary text-muted-foreground'
                        }`}
                      title={`${previewVisible ? 'Hide' : 'Show'} Preview (Ctrl+P)`}
                    >
                      {previewVisible ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                    </button>

                    {/* Dark Mode Toggle */}
                    <button
                      onClick={() => setIsDarkMode(!isDarkMode)}
                      className="p-2 rounded-lg hover:bg-secondary text-muted-foreground"
                      title={isDarkMode ? 'Light Mode' : 'Dark Mode'}
                    >
                      {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                    </button>

                    {/* Close Button */}
                    <button
                      onClick={onClose}
                      className="p-2 rounded-lg hover:bg-secondary text-muted-foreground"
                      title="Close (Esc)"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Mobile Action Bar */}
                <div className={`md:hidden flex items-center justify-between px-3 py-2 border-b ${themeClass('border-border', 'border-gray-200')}`}>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={undo}
                      disabled={!canUndo}
                      className={`p-2 rounded-lg ${canUndo ? 'text-foreground' : 'opacity-30'}`}
                    >
                      <Undo2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={redo}
                      disabled={!canRedo}
                      className={`p-2 rounded-lg ${canRedo ? 'text-foreground' : 'opacity-30'}`}
                    >
                      <Redo2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex items-center gap-1">
                    {hasUnsavedChanges && (
                      <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-amber-500/10">
                        <AlertCircle className="w-3 h-3 text-amber-500" />
                        <span className="text-xs text-amber-500">Unsaved</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Two Panel Content Area */}
                <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
                  {/* Editor Panel - 30% width */}
                  <motion.div
                    animate={{
                      width: isMobile ? '100%' : (previewVisible ? `${editorPanelWidth}%` : '100%'),
                      display: (isMobile && previewVisible) ? 'none' : 'flex'
                    }}
                    transition={{ duration: 0.2 }}
                    className="flex-shrink-0 flex flex-col overflow-hidden"
                  >
                    <div className={`flex-1 overflow-y-auto p-3 sm:p-4 md:p-5 ${themeClass('bg-background', 'bg-gray-50')}`}>
                      {renderEditorComponent()}
                    </div>

                    {/* Mobile Apply Changes Bar */}
                    {isMobile && hasUnsavedChanges && !previewVisible && (
                      <div className={`p-3 border-t ${themeClass('border-border bg-card', 'border-gray-200 bg-white')}`}>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setShowDiscardConfirm(true)}
                            className="flex-1 py-2.5 rounded-xl font-medium bg-secondary text-foreground"
                          >
                            Discard
                          </button>
                          <button
                            onClick={handleApplyChanges}
                            disabled={isApplying}
                            className="flex-1 py-2.5 rounded-xl font-medium bg-primary text-primary-foreground flex items-center justify-center gap-2"
                          >
                            {isApplying ? (
                              <>
                                <motion.div
                                  animate={{ rotate: 360 }}
                                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                                >
                                  <RefreshCw className="w-4 h-4" />
                                </motion.div>
                                Applying...
                              </>
                            ) : (
                              <>
                                <Save className="w-4 h-4" />
                                Apply Changes
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    )}
                  </motion.div>

                  {/* Resize Handle (Desktop only) */}
                  {previewVisible && !isMobile && (
                    <div
                      ref={resizeRef}
                      onMouseDown={handleMouseDown}
                      className={`hidden md:flex w-1 hover:w-2 cursor-col-resize items-center justify-center transition-all ${isResizing ? 'w-2 bg-primary' : themeClass('bg-border hover:bg-primary/50', 'bg-gray-200 hover:bg-primary/50')
                        }`}
                    >
                      <div className={`w-1 h-8 rounded-full ${isResizing ? 'bg-primary-foreground' : 'bg-muted-foreground/30'}`} />
                    </div>
                  )}

                  {/* Preview Panel - 70% width - Desktop Only View */}
                  <AnimatePresence>
                    {previewVisible && (
                      <motion.div
                        initial={{ opacity: 0, width: 0 }}
                        animate={{
                          opacity: 1,
                          width: isMobile ? '100%' : `${100 - editorPanelWidth}%`
                        }}
                        exit={{ opacity: 0, width: 0 }}
                        transition={{ duration: 0.2 }}
                        className={`flex flex-col overflow-hidden ${themeClass('bg-secondary/30', 'bg-gray-100')}`}
                      >
                        {/* Preview Header - Desktop Only (No device toggles) */}
                        <div className={`flex items-center justify-between px-4 py-2 border-b ${themeClass('bg-card border-border', 'bg-card border-border')}`}>
                          <div className="flex items-center gap-2">
                            <Eye className="w-4 h-4 text-primary" />
                            <span className="text-sm font-medium text-foreground">
                              Live Preview
                            </span>
                            <span className="text-xs px-2 py-0.5 rounded-full bg-green-500/10 text-green-500">
                              Real-time
                            </span>
                          </div>

                          <div className="flex items-center gap-1">
                            <button
                              onClick={refreshPreview}
                              className="p-1.5 rounded-lg transition-colors hover:bg-secondary text-muted-foreground"
                              title="Refresh Preview"
                            >
                              <RefreshCw className="w-4 h-4" />
                            </button>
                            <button
                              onClick={copyPreviewUrl}
                              className="p-1.5 rounded-lg transition-colors hover:bg-secondary text-muted-foreground"
                              title="Copy Preview URL"
                            >
                              {copiedUrl ? <CheckCircle className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                            </button>
                            <button
                              onClick={openInNewTab}
                              className="p-1.5 rounded-lg transition-colors hover:bg-secondary text-muted-foreground"
                              title="Open in New Tab"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setPreviewFullscreen(true)}
                              className="hidden md:flex p-1.5 rounded-lg transition-colors hover:bg-secondary text-muted-foreground"
                              title="Fullscreen Preview"
                            >
                              <Maximize2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        {/* Preview URL Bar */}
                        <div className={`flex items-center gap-2 px-4 py-2 border-b ${themeClass('bg-secondary/50 border-border', 'bg-gray-100 border-gray-200')}`}>
                          <div className="flex items-center gap-1.5">
                            <div className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-600 transition-colors cursor-pointer" />
                            <div className="w-3 h-3 rounded-full bg-yellow-500 hover:bg-yellow-600 transition-colors cursor-pointer" />
                            <div className="w-3 h-3 rounded-full bg-green-500 hover:bg-green-600 transition-colors cursor-pointer" />
                          </div>
                          <div className={`flex-1 flex items-center gap-2 px-3 py-1.5 rounded-lg ${themeClass('bg-background', 'bg-white')} border ${themeClass('border-border', 'border-gray-200')}`}>
                            <div className="w-4 h-4 rounded bg-green-500/20 flex items-center justify-center flex-shrink-0">
                              <div className="w-2 h-2 rounded-full bg-green-500" />
                            </div>
                            <span className={`text-xs truncate ${themeClass('text-muted-foreground', 'text-gray-500')}`}>
                              {typeof window !== 'undefined' ? window.location.origin : 'https://yoursite.com'}{getPreviewUrl(activeEditor)}
                            </span>
                          </div>
                        </div>

                        {/* Preview Content - Desktop Only View */}
                        <div className="flex-1 overflow-auto p-2 sm:p-3 md:p-4">
                          <motion.div
                            animate={{ width: '100%' }}
                            transition={{ duration: 0.3 }}
                            className="relative rounded-xl overflow-hidden shadow-2xl bg-white"
                            style={{ minHeight: '400px', maxWidth: '100%' }}
                          >
                            <div className="h-full w-full overflow-auto">
                              <SectionPreviewWrapper
                                sectionId={activeEditor}
                                device="desktop"
                                refreshKey={previewKey}
                                className="h-full"
                                editingServiceIndex={activeEditor === 'serviceDetail' ? editingServiceIndex : undefined}
                              />
                            </div>
                          </motion.div>
                        </div>

                        {/* Mobile Back Button */}
                        {isMobile && (
                          <div className="p-4 border-t border-border">
                            <button
                              onClick={() => setPreviewVisible(false)}
                              className="w-full py-3 rounded-xl bg-secondary text-foreground font-medium"
                            >
                              Back to Editor
                            </button>
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Fullscreen Preview Overlay - Desktop Only View */}
          <AnimatePresence>
            {previewFullscreen && previewVisible && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[10100] bg-black/90 flex flex-col"
              >
                <div className="flex items-center justify-between px-4 py-3 bg-gray-900">
                  <div className="flex items-center gap-3">
                    <Eye className="w-5 h-5 text-white" />
                    <span className="text-white font-medium">Fullscreen Preview</span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-green-500/20 text-green-400">
                      Desktop
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={refreshPreview} className="p-2 rounded-lg hover:bg-gray-800 text-gray-400">
                      <RefreshCw className="w-5 h-5" />
                    </button>
                    <button onClick={openInNewTab} className="p-2 rounded-lg hover:bg-gray-800 text-gray-400">
                      <ExternalLink className="w-5 h-5" />
                    </button>
                    <button onClick={() => setPreviewFullscreen(false)} className="p-2 rounded-lg hover:bg-gray-800 text-white">
                      <Minimize2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                <div className="flex-1 flex items-center justify-center p-4 overflow-auto">
                  <motion.div
                    animate={{ width: '100%', maxWidth: '100%' }}
                    transition={{ duration: 0.3 }}
                    className="h-full rounded-xl overflow-hidden shadow-2xl bg-white"
                  >
                    <SectionPreviewWrapper
                      sectionId={activeEditor}
                      device="desktop"
                      refreshKey={previewKey}
                      className="h-full"
                      editingServiceIndex={activeEditor === 'serviceDetail' ? editingServiceIndex : undefined}
                    />
                  </motion.div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

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
                  className={`max-w-md w-full p-6 rounded-2xl shadow-xl ${themeClass('bg-card', 'bg-white')}`}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center">
                      <RotateCcw className="w-6 h-6 text-destructive" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-foreground">Reset All Content?</h3>
                      <p className="text-sm text-muted-foreground">This action cannot be undone</p>
                    </div>
                  </div>
                  <p className="mb-6 text-muted-foreground">
                    All your content changes will be lost and reset to the default values.
                  </p>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setShowResetConfirm(false)}
                      className="flex-1 py-2.5 rounded-xl font-medium bg-secondary text-foreground hover:bg-secondary/80"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleReset}
                      className="flex-1 py-2.5 rounded-xl font-medium bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      Reset Content
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Discard Changes Confirmation Modal */}
          <AnimatePresence>
            {showDiscardConfirm && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/60 p-4"
                onClick={() => setShowDiscardConfirm(false)}
              >
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  onClick={(e) => e.stopPropagation()}
                  className={`max-w-md w-full p-6 rounded-2xl shadow-xl ${themeClass('bg-card', 'bg-white')}`}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center">
                      <AlertCircle className="w-6 h-6 text-amber-500" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-foreground">Discard Changes?</h3>
                      <p className="text-sm text-muted-foreground">Your unsaved changes will be lost</p>
                    </div>
                  </div>
                  <p className="mb-6 text-muted-foreground">
                    Are you sure you want to discard all unsaved changes? This action cannot be undone.
                  </p>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setShowDiscardConfirm(false)}
                      className="flex-1 py-2.5 rounded-xl font-medium bg-secondary text-foreground hover:bg-secondary/80"
                    >
                      Keep Editing
                    </button>
                    <button
                      onClick={handleDiscardChanges}
                      className="flex-1 py-2.5 rounded-xl font-medium bg-amber-500 text-white hover:bg-amber-600"
                    >
                      Discard
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
                className={`fixed bottom-4 right-4 left-4 sm:left-auto z-[10200] flex items-center justify-center sm:justify-start gap-3 px-4 py-3 rounded-xl shadow-lg ${notification.type === 'success'
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
        </>
      )}
    </AnimatePresence>
  );
};

export default AdminPanel;