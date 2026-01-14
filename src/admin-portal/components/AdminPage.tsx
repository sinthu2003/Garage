import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,

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
  Menu,
  Eye,
  EyeOff,
  Maximize2,
  Minimize2,
  RefreshCw,
  ExternalLink,
  Home,
  LogOut,
  Copy,
  CheckCircle,
  Search,
  Save,
  AlertCircle,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
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

// Editor component mapping - Updated type to support onPageChange and onEditingIndexChange callbacks
const editorComponents: Record<string, React.FC<{ isDarkMode: boolean; onPageChange?: (page: 'services' | 'notFound' | 'faqSection' | 'contactPage') => void; onEditingIndexChange?: (index: number | null) => void }>> = {
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
 * AdminPage - Full Page Admin with Clean Two-Panel Layout
 * Left: Editor Fields (30%) | Right: Live Preview (70%)
 * Sidebar opens on hover
 * Now with dynamic Pages preview support and Apply Changes button
 */
export const AdminPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, isLoading, logout } = useAuth(); // NEW: Auth hook
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
    // [NEW] Lazy loading functions
    loadSection,
    loadServices,
    loadCarBrands,
  } = useContent();

  // [NEW] Editor ID to section name mapping for lazy loading
  const editorToSectionMap: Record<string, keyof typeof content | 'services-api' | 'carBrands-api' | 'bookingWidget+carBrands'> = {
    hero: 'hero',
    services: 'services',
    serviceDetail: 'services-api',  // Uses services API
    pricing: 'pricing',
    testimonials: 'testimonials',
    faq: 'faq',
    features: 'features',
    howItWorks: 'howItWorks',
    partners: 'partners',
    gallery: 'gallery',
    beforeAfter: 'beforeAfter',
    navbar: 'global',  // [FIX] Navbar content is inside global (brand, navbar)
    footer: 'footer',
    global: 'global',
    bookingWidget: 'bookingWidget+carBrands',  // [FIX] Load both section content AND car brands
    pages: 'pages',
  };

  // Core states
  const [isDarkMode] = useState(true);
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
  const [editorPanelWidth, setEditorPanelWidth] = useState(30); // 30% for editor
  const [isResizing, setIsResizing] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState(false);

  // Pages preview state - tracks which page tab is selected
  const [pagesPreviewId, setPagesPreviewId] = useState<'servicesPage' | 'notFoundPage'>('servicesPage');

  // NEW: FAQ preview state - tracks which FAQ tab is selected
  const [faqPreviewId, setFaqPreviewId] = useState<'faqSection' | 'contactPage'>('faqSection');

  // ServiceDetail editing index state - tracks which service is being edited
  const [editingServiceIndex, setEditingServiceIndex] = useState<number | null>(null);

  const resizeRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const sidebarTimeoutRef = useRef<number | null>(null);

  // Handler for pages tab change
  const handlePagesTabChange = useCallback((page: 'services' | 'notFound') => {
    setPagesPreviewId(page === 'services' ? 'servicesPage' : 'notFoundPage');
  }, []);

  // NEW: Handler for FAQ tab change
  const handleFAQTabChange = useCallback((tab: 'faqSection' | 'contactPage') => {
    setFaqPreviewId(tab);
  }, []);

  // Handler for service editing index change
  const handleServiceEditingIndexChange = useCallback((index: number | null) => {
    setEditingServiceIndex(index);
  }, []);

  // Calculate effective preview ID - uses pagesPreviewId when editing pages, faqPreviewId when editing FAQ
  const effectivePreviewId = (() => {
    if (activeEditor === 'pages') return pagesPreviewId;
    if (activeEditor === 'faq') return faqPreviewId;
    return activeEditor;
  })();

  // Filter editors based on search
  const filteredEditors = editorConfig.filter(
    (editor) =>
      editor.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      editor.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // NEW: Auth check - redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !user) {
      navigate('/admin/login');
    }
  }, [user, isLoading, navigate]);

  // [NEW] Lazy load section data when tab changes
  useEffect(() => {
    const sectionKey = editorToSectionMap[activeEditor];
    if (!sectionKey) return;

    if (sectionKey === 'services-api') {
      // Load services from separate API
      loadServices?.();
    } else if (sectionKey === 'carBrands-api') {
      // Load car brands from separate API
      loadCarBrands?.(true); // true = include models
    } else if (sectionKey === 'bookingWidget+carBrands') {
      // [FIX] BookingWidget needs BOTH: section content (labels, cities, etc.) AND car brands
      loadSection?.('bookingWidget');
      loadCarBrands?.(true); // true = include models
    } else {
      // Load section from content API
      loadSection?.(sectionKey as keyof typeof content);
    }
  }, [activeEditor, loadSection, loadServices, loadCarBrands]);

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

  // Refresh preview when content changes (debounced)
  useEffect(() => {
    const timer = setTimeout(() => {
      setPreviewKey(k => k + 1);
    }, 300);
    return () => clearTimeout(timer);
  }, [content]);

  // Reset editingServiceIndex when switching away from serviceDetail editor
  useEffect(() => {
    if (activeEditor !== 'serviceDetail') {
      setEditingServiceIndex(null);
    }
  }, [activeEditor]);

  // NEW: Reset faqPreviewId when switching away from FAQ editor
  useEffect(() => {
    if (activeEditor !== 'faq') {
      setFaqPreviewId('faqSection');
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

  // NEW: Handle logout
  const handleLogout = () => {
    logout();
    navigate('/admin/login');
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
    showNotification('success', 'Content reset to defaults!');
    setPreviewKey((k) => k + 1);
  };

  // Handle editor selection
  const handleEditorSelect = (editorId: EditorId) => {
    setActiveEditor(editorId);
    setSidebarCollapsed(true);
    setSidebarHovered(false);
    if (isMobile) {
      setMobileSidebarOpen(false);
    }
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

  // Preview actions - UPDATED to use effectivePreviewId
  const refreshPreview = () => setPreviewKey((k) => k + 1);
  
  const copyPreviewUrl = () => {
    const url = window.location.origin + getPreviewUrl(effectivePreviewId);
    navigator.clipboard.writeText(url);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2000);
  };

  const openInNewTab = () => {
    const url = getPreviewUrl(effectivePreviewId);
    window.open(url, '_blank');
  };

  // Get active editor component
  const activeEditorConfig = editorConfig.find((e) => e.id === activeEditor);
  const EditorComponent = activeEditorConfig ? editorComponents[activeEditorConfig.component] : null;

  // Render the editor component with special handling for PagesEditor, FAQEditor, and ServiceDetailEditor
  const renderEditorComponent = () => {
    if (!EditorComponent) {
      return (
        <div className="p-6 text-center text-red-500 border border-red-200 rounded-lg bg-red-50">
          <h3 className="font-bold">Component Not Found</h3>
        </div>
      );
    }

    // Special handling for PagesEditor to pass the callback
    if (activeEditor === 'pages') {
      return (
        <PagesEditor 
          isDarkMode={isDarkMode} 
          onPageChange={handlePagesTabChange}
        />
      );
    }

    // NEW: Special handling for FAQEditor to pass the callback
    if (activeEditor === 'faq') {
      return (
        <FAQEditor 
          isDarkMode={isDarkMode} 
          onPageChange={handleFAQTabChange}
        />
      );
    }

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
    return <EditorComponent isDarkMode={isDarkMode} />;
  };

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
        if (e.key === 'p') {
          e.preventDefault();
          setPreviewVisible((v) => !v);
        }
        if (e.key === 'b') {
          e.preventDefault();
          setSidebarCollapsed((c) => !c);
        }
        if (e.key === 's') {
          e.preventDefault();
          if (hasUnsavedChanges) handleApplyChanges();
        }
      }
      if (e.key === 'Escape' && previewFullscreen) {
        setPreviewFullscreen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [canUndo, canRedo, undo, redo, previewFullscreen, hasUnsavedChanges]);

  // Theme class helper
  const themeClass = (dark: string, light: string) => isDarkMode ? dark : light;

  // Determine if sidebar should be expanded (hovered or explicitly expanded)
  const isSidebarExpanded = !sidebarCollapsed || sidebarHovered;

  // NEW: Show loading while checking auth
  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // NEW: Don't render if not authenticated
  if (!user) {
    return null;
  }

  return (
    <div 
      ref={containerRef}
      className={`h-screen flex overflow-hidden ${themeClass('bg-background text-foreground', 'bg-gray-50 text-gray-900')}`}
    >
      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {mobileSidebarOpen && isMobile && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
              onClick={() => setMobileSidebarOpen(false)}
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className={`fixed left-0 top-0 bottom-0 z-50 w-[280px] flex flex-col ${themeClass('bg-card border-border', 'bg-white border-gray-200')} border-r shadow-xl`}
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
                      className={`w-full flex items-center gap-3 px-4 py-3 transition-all ${
                        isActive
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

              {/* Mobile Footer */}
              <div className="p-4 border-t border-border space-y-2">
                <button 
                  onClick={() => setShowResetConfirm(true)} 
                  className="w-full flex items-center justify-center gap-2 p-2.5 rounded-xl text-sm font-medium bg-destructive/10 text-destructive hover:bg-destructive/20"
                >
                  <RotateCcw className="w-4 h-4" />
                  Reset
                </button>
                <button 
                  onClick={() => navigate('/')} 
                  className="w-full flex items-center justify-center gap-2 p-2.5 rounded-xl text-sm font-medium bg-primary text-primary-foreground"
                >
                  <Home className="w-4 h-4" />
                  View Site
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar - Hover to Expand */}
      <motion.aside
        animate={{ width: isSidebarExpanded ? 220 : 56 }}
        transition={{ duration: 0.2 }}
        onMouseEnter={handleSidebarMouseEnter}
        onMouseLeave={handleSidebarMouseLeave}
        className={`hidden md:flex flex-shrink-0 flex-col border-r ${themeClass('bg-card border-border', 'bg-white border-gray-200')} relative z-10`}
      >
        {/* Sidebar Header */}
        <div className={`p-3 border-b ${themeClass('border-border', 'border-gray-200')} flex items-center ${isSidebarExpanded ? 'justify-between' : 'justify-center'}`}>
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
                title="Collapse Sidebar"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
            </>
          ) : (
            <button
              onClick={() => setSidebarCollapsed(false)}
              className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center hover:opacity-90 transition-opacity"
              title="Expand Sidebar"
            >
              <Sparkles className="w-4 h-4 text-primary-foreground" />
            </button>
          )}
        </div>

        {/* Search - Only when expanded */}
        {isSidebarExpanded && (
          <div className="p-3 border-b border-border">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full pl-9 pr-3 py-2 rounded-lg text-sm ${themeClass('bg-secondary border-border text-foreground', 'bg-gray-100 border-gray-200 text-gray-900')} border focus:outline-none focus:ring-2 focus:ring-primary/20`}
              />
            </div>
          </div>
        )}

        {/* Section List */}
        <div className="flex-1 overflow-y-auto py-1">
          {filteredEditors.map((editor) => {
            const Icon = iconMap[editor.icon] || Sparkles;
            const isActive = activeEditor === editor.id;

            return (
              <button
                key={editor.id}
                onClick={() => handleEditorSelect(editor.id)}
                title={!isSidebarExpanded ? editor.label : undefined}
                className={`w-full flex items-center gap-2.5 py-2.5 transition-all ${
                  isActive
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

        {/* Sidebar Footer */}
        <div className={`p-2 border-t ${themeClass('border-border', 'border-gray-200')}`}>
          {isSidebarExpanded ? (
            <div className="space-y-1">
              <button 
                onClick={() => setShowResetConfirm(true)} 
                className="w-full flex items-center justify-center gap-1.5 p-2 rounded-lg text-xs bg-destructive/10 text-destructive hover:bg-destructive/20"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Reset
              </button>
              <button 
                onClick={() => navigate('/')} 
                className="w-full flex items-center justify-center gap-1.5 p-2 rounded-lg text-xs bg-primary text-primary-foreground hover:bg-primary/90"
              >
                <Home className="w-3.5 h-3.5" />
                View Site
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-1">
              <button 
                onClick={() => setShowResetConfirm(true)} 
                className="p-2 rounded-lg hover:bg-destructive/10 text-destructive" 
                title="Reset"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <button 
                onClick={() => navigate('/')} 
                className="p-2 rounded-lg bg-primary text-primary-foreground" 
                title="View Site"
              >
                <Home className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </motion.aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* Top Header Bar */}
        <header className={`flex items-center justify-between px-3 py-2 border-b ${themeClass('bg-card border-border', 'bg-white border-gray-200')}`}>
          <div className="flex items-center gap-2">
            {/* Mobile Menu Button */}
            <button 
              onClick={() => setMobileSidebarOpen(true)} 
              className="md:hidden p-2 rounded-lg hover:bg-secondary text-foreground"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Section Title */}
            <h2 className="font-semibold text-foreground text-sm sm:text-base">
              {activeEditorConfig?.label || 'Editor'}
            </h2>

            {/* Unsaved Changes Indicator */}
            <AnimatePresence>
              {hasUnsavedChanges && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="hidden sm:flex items-center gap-1.5 px-2 py-1 rounded-full bg-amber-500/10"
                >
                  <AlertCircle className="w-3 h-3 text-amber-500" />
                  <span className="text-xs font-medium text-amber-500">Unsaved changes</span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="flex items-center gap-1">
            {/* Undo/Redo */}
            <div className="hidden sm:flex items-center gap-0.5 mr-1">
              <button 
                onClick={undo} 
                disabled={!canUndo} 
                className={`p-1.5 rounded-lg ${canUndo ? 'hover:bg-secondary text-foreground' : 'opacity-30 cursor-not-allowed'}`} 
                title="Undo"
              >
                <Undo2 className="w-4 h-4" />
              </button>
              <button 
                onClick={redo} 
                disabled={!canRedo} 
                className={`p-1.5 rounded-lg ${canRedo ? 'hover:bg-secondary text-foreground' : 'opacity-30 cursor-not-allowed'}`} 
                title="Redo"
              >
                <Redo2 className="w-4 h-4" />
              </button>
            </div>

            {/* Discard Changes Button */}
            {hasUnsavedChanges && (
              <button
                onClick={() => setShowDiscardConfirm(true)}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-muted-foreground hover:bg-secondary transition-colors"
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
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                hasUnsavedChanges && !isApplying
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
              <span className="hidden sm:inline">{isApplying ? 'Applying...' : 'Apply Changes'}</span>
            </motion.button>

            <div className="w-px h-5 bg-border mx-1 hidden sm:block" />

            {/* Preview Toggle */}
            <button
              onClick={() => setPreviewVisible(!previewVisible)}
              className={`p-1.5 rounded-lg ${previewVisible ? 'bg-primary text-primary-foreground' : 'hover:bg-secondary text-muted-foreground'}`}
              title={`${previewVisible ? 'Hide' : 'Show'} Preview`}
            >
              {previewVisible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
            </button>

            {/* Dark Mode Toggle */}
            {/* <button 
              onClick={() => setIsDarkMode(!isDarkMode)} 
              className="p-1.5 rounded-lg hover:bg-secondary text-muted-foreground" 
              title={isDarkMode ? 'Light Mode' : 'Dark Mode'}
            >
              {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button> */}

            {/* NEW: Logout Button */}
            <button 
              onClick={handleLogout} 
              className="hidden sm:flex p-1.5 rounded-lg hover:bg-destructive/10 text-destructive hover:text-destructive" 
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* Two Panel Content Area */}
        <div className="flex-1 flex overflow-hidden">
          {/* Editor Panel - 30% */}
          <motion.div
            animate={{ 
              width: isMobile ? '100%' : (previewVisible ? `${editorPanelWidth}%` : '100%'),
              display: (isMobile && previewVisible) ? 'none' : 'flex'
            }}
            transition={{ duration: 0.2 }}
            className="flex-shrink-0 flex flex-col overflow-hidden"
          >
            <div className={`flex-1 overflow-y-auto p-3 sm:p-4 ${themeClass('bg-background', 'bg-gray-50')}`}>
              {renderEditorComponent()}
            </div>

            {/* Mobile Apply Changes Bar */}
            {isMobile && hasUnsavedChanges && (
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

          {/* Resize Handle */}
          {previewVisible && !isMobile && (
            <div
              ref={resizeRef}
              onMouseDown={handleMouseDown}
              className={`hidden md:flex w-1 hover:w-1.5 cursor-col-resize items-center justify-center transition-all ${
                isResizing ? 'w-1.5 bg-primary' : themeClass('bg-border hover:bg-primary/50', 'bg-gray-200 hover:bg-primary/50')
              }`}
            >
              <div className={`w-0.5 h-10 rounded-full ${isResizing ? 'bg-primary-foreground' : 'bg-muted-foreground/20'}`} />
            </div>
          )}

          {/* Preview Panel - 70% - Desktop Only View */}
          <AnimatePresence>
            {previewVisible && (
              <motion.div
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: isMobile ? '100%' : `${100 - editorPanelWidth}%` }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.2 }}
                className={`flex flex-col overflow-hidden ${themeClass('bg-secondary/30', 'bg-gray-100')}`}
              >
                {/* Preview Header - Desktop Only (No device toggles) */}
                <div className={`flex items-center justify-between px-3 py-2 border-b ${themeClass('bg-card border-border', 'bg-white border-gray-200')}`}>
                  <div className="flex items-center gap-2">
                    <Eye className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium text-foreground">Live Preview</span>
                    <span className="text-xs px-1.5 py-0.5 rounded-full bg-green-500/10 text-green-500">Real-time</span>
                  </div>

                  <div className="flex items-center gap-1">
                    <button 
                      onClick={refreshPreview} 
                      className="p-1.5 rounded-lg hover:bg-secondary text-muted-foreground" 
                      title="Refresh"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                    </button>
                    <button 
                      onClick={copyPreviewUrl} 
                      className="p-1.5 rounded-lg hover:bg-secondary text-muted-foreground" 
                      title="Copy URL"
                    >
                      {copiedUrl ? <CheckCircle className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                    <button 
                      onClick={openInNewTab} 
                      className="p-1.5 rounded-lg hover:bg-secondary text-muted-foreground" 
                      title="Open in New Tab"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                    <button 
                      onClick={() => setPreviewFullscreen(true)} 
                      className="hidden md:flex p-1.5 rounded-lg hover:bg-secondary text-muted-foreground" 
                      title="Fullscreen"
                    >
                      <Maximize2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Browser URL Bar - UPDATED to use effectivePreviewId */}
                <div className={`flex items-center gap-2 px-3 py-1.5 border-b ${themeClass('bg-secondary/50 border-border', 'bg-gray-100 border-gray-200')}`}>
                  <div className="flex items-center gap-1">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
                    <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
                  </div>
                  <div className={`flex-1 flex items-center gap-2 px-2 py-1 rounded-md ${themeClass('bg-background', 'bg-white')} border ${themeClass('border-border', 'border-gray-200')}`}>
                    <div className="w-3 h-3 rounded bg-green-500/20 flex items-center justify-center">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                    </div>
                    <span className="text-xs text-muted-foreground truncate">
                      {window.location.origin}{getPreviewUrl(effectivePreviewId)}
                    </span>
                  </div>
                </div>

                {/* Preview Content - Desktop Only View */}
                <div className="flex-1 overflow-auto p-2 sm:p-3">
                  <motion.div
                    animate={{ width: '100%' }}
                    transition={{ duration: 0.3 }}
                    className="relative rounded-lg overflow-hidden shadow-xl bg-white"
                    style={{ 
                      minHeight: '400px',
                      maxWidth: '100%',
                    }}
                  >
                    <div className="h-full w-full overflow-auto">
                      <SectionPreviewWrapper
                        sectionId={effectivePreviewId}
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
                  <div className="p-3 border-t border-border">
                    <button 
                      onClick={() => setPreviewVisible(false)} 
                      className="w-full py-2.5 rounded-xl bg-secondary text-foreground font-medium"
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

      {/* Fullscreen Preview Modal - Desktop Only View */}
      <AnimatePresence>
        {previewFullscreen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 flex flex-col"
          >
            <div className="flex items-center justify-between px-4 py-3 bg-gray-900 border-b border-gray-800">
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

            <div className="flex-1 overflow-auto p-6 flex items-start justify-center">
              <motion.div
                animate={{ width: '100%' }}
                className="h-full rounded-xl overflow-hidden shadow-2xl bg-white"
              >
                <SectionPreviewWrapper 
                  sectionId={effectivePreviewId} 
                  device="desktop" 
                  refreshKey={previewKey}
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
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
            onClick={() => setShowResetConfirm(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className={`max-w-md w-full p-6 rounded-2xl shadow-xl ${themeClass('bg-card', 'bg-white')}`}
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center">
                  <RotateCcw className="w-6 h-6 text-destructive" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-foreground">Reset All Content?</h3>
                  <p className="text-sm text-muted-foreground">This action cannot be undone</p>
                </div>
              </div>
              <p className="mb-6 text-muted-foreground">
                All content changes will be lost and reset to defaults.
              </p>
              <div className="flex gap-3">
                <button 
                  onClick={() => setShowResetConfirm(false)} 
                  className="flex-1 py-2.5 rounded-xl font-medium bg-secondary text-foreground"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleReset} 
                  className="flex-1 py-2.5 rounded-xl font-medium bg-destructive text-destructive-foreground"
                >
                  Reset
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
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
            onClick={() => setShowDiscardConfirm(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className={`max-w-md w-full p-6 rounded-2xl shadow-xl ${themeClass('bg-card', 'bg-white')}`}
            >
              <div className="flex items-center gap-4 mb-4">
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
                  className="flex-1 py-2.5 rounded-xl font-medium bg-secondary text-foreground"
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
            initial={{ opacity: 0, y: 50, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: 50, x: '-50%' }}
            className={`fixed bottom-6 left-1/2 z-50 flex items-center gap-3 px-4 py-2.5 rounded-xl shadow-lg ${
              notification.type === 'success' ? 'bg-green-500 text-white' : 'bg-destructive text-destructive-foreground'
            }`}
          >
            {notification.type === 'success' ? <Check className="w-5 h-5" /> : <X className="w-5 h-5" />}
            <span className="font-medium">{notification.message}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminPage;