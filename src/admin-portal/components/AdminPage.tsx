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
  LayoutDashboard,
  Calendar,
  Mail,
  PanelLeft,
  ChevronDown,
  Shield,
  BookOpen,
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
  PrivacyPolicyEditor,
} from './editors';

// Import admin screens
import { Dashboard } from '../index';
import { BookingsManagement } from '../index';
import { ContactInquiries } from '../index';

// Import company logo
import Logo from '../../assets/Logo.jpg';

// ============================================
// TYPES & INTERFACES
// ============================================
type AdminView = 'dashboard' | 'bookings' | 'inquiries' | 'cms';

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
  Shield,
  BookOpen,
};

// Editor component mapping
const editorComponents: Record<string, React.FC<{ isDarkMode: boolean; onPageChange?: (page: 'services' | 'notFound' | 'faqSection' | 'contactPage' | 'privacyPolicy' | 'termsOfService' | 'warrantyPolicy') => void; onEditingIndexChange?: (index: number | null) => void }>> = {
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
  PrivacyPolicyEditor,
};

// Main navigation sections with enhanced styling
const mainSections: { id: AdminView; label: string; icon: React.FC<{ className?: string }>; description: string }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, description: 'Overview & Analytics' },
  { id: 'bookings', label: 'Bookings', icon: Calendar, description: 'Manage Appointments' },
  { id: 'inquiries', label: 'Inquiries', icon: Mail, description: 'Customer Messages' },
  { id: 'cms', label: 'CMS Editor', icon: PanelLeft, description: 'Content Management' },
];

// ============================================
// ANIMATION VARIANTS
// ============================================
const pageTransition = {
  initial: { opacity: 0, y: 8, scale: 0.99 },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.4,
      ease: [0.25, 0.46, 0.45, 0.94] as const,
    }
  },
  exit: {
    opacity: 0,
    y: -8,
    scale: 0.99,
    transition: { duration: 0.25 }
  }
};

const sidebarItemVariants = {
  hover: { x: 4, transition: { duration: 0.2 } },
  tap: { scale: 0.98 }
};

// ============================================
// ADMIN PAGE COMPONENT
// ============================================
export const AdminPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, isLoading, logout } = useAuth();
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
    loadSection,
    loadServices,
    loadCarBrands,
  } = useContent();

  // Editor ID to section name mapping
  const editorToSectionMap: Record<string, keyof typeof content | 'services-api' | 'carBrands-api' | 'bookingWidget+carBrands'> = {
    hero: 'hero',
    services: 'services',
    serviceDetail: 'services-api',
    pricing: 'pricing',
    testimonials: 'testimonials',
    faq: 'faq',
    features: 'features',
    howItWorks: 'howItWorks',
    partners: 'partners',
    gallery: 'gallery',
    beforeAfter: 'beforeAfter',
    navbar: 'global',
    footer: 'footer',
    global: 'global',
    bookingWidget: 'bookingWidget+carBrands',
    pages: 'pages',
    legal: 'pages',
  };

  // Core states
  const [isDarkMode] = useState(true);
  const [activeView, setActiveView] = useState<AdminView>('dashboard');
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
  const [showUserMenu, setShowUserMenu] = useState(false);

  // Two-panel layout states
  const [previewVisible, setPreviewVisible] = useState(true);
  const [previewFullscreen, setPreviewFullscreen] = useState(false);
  const [previewKey, setPreviewKey] = useState(0);
  const [editorPanelWidth, setEditorPanelWidth] = useState(30);
  const [isResizing, setIsResizing] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState(false);

  // Pages preview state
  const [pagesPreviewId, setPagesPreviewId] = useState<'servicesPage' | 'notFoundPage'>('servicesPage');
  const [faqPreviewId, setFaqPreviewId] = useState<'faqSection' | 'contactPage'>('faqSection');
  const [legalPreviewId, setLegalPreviewId] = useState<'privacyPolicyPage' | 'termsPage' | 'warrantyPolicyPage'>('privacyPolicyPage');
  const [editingServiceIndex, setEditingServiceIndex] = useState<number | null>(null);

  // ✅ NEW: Local service state for INSTANT preview updates (no 2-second delay!)
  const [previewService, setPreviewService] = useState<any>(null);

  // ✅ NEW: Stable callback for preview service updates
  const handleLocalServiceChange = useCallback((service: any) => {
    console.log('🟠 handleLocalServiceChange called:', service?.title, 'price:', service?.price);
    setPreviewService(service);
  }, []);

  const resizeRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const sidebarTimeoutRef = useRef<number | null>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Handler for pages tab change
  const handlePagesTabChange = useCallback((page: 'services' | 'notFound') => {
    setPagesPreviewId(page === 'services' ? 'servicesPage' : 'notFoundPage');
  }, []);

  // Handler for FAQ tab change
  const handleFAQTabChange = useCallback((tab: 'faqSection' | 'contactPage') => {
    setFaqPreviewId(tab);
  }, []);

  // Handler for Legal tab change
  const handleLegalTabChange = useCallback((tab: 'privacyPolicy' | 'termsOfService' | 'warrantyPolicy') => {
    setLegalPreviewId(tab === 'privacyPolicy' ? 'privacyPolicyPage' : tab === 'termsOfService' ? 'termsPage' : 'warrantyPolicyPage');
  }, []);

  // Handler for service editing index change
  const handleServiceEditingIndexChange = useCallback((index: number | null) => {
    setEditingServiceIndex(index);
  }, []);

  // Show notification helper - wrapped in useCallback for stable reference
  const showNotification = useCallback((type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3000);
  }, []);

  // Calculate effective preview ID
  const effectivePreviewId = (() => {
    if (activeEditor === 'pages') return pagesPreviewId;
    if (activeEditor === 'faq') return faqPreviewId;
    if (activeEditor === 'legal') return legalPreviewId;
    return activeEditor;
  })();

  // Filter editors based on search
  const filteredEditors = editorConfig.filter(
    (editor) =>
      editor.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      editor.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Auth check
  useEffect(() => {
    if (!isLoading && !user) {
      navigate('/admin/login');
    }
  }, [user, isLoading, navigate]);

  // Lazy load section data when tab changes
  useEffect(() => {
    if (activeView !== 'cms') return;

    const sectionKey = editorToSectionMap[activeEditor];
    if (!sectionKey) return;

    if (sectionKey === 'services-api') {
      loadServices?.();
    } else if (sectionKey === 'carBrands-api') {
      loadCarBrands?.(true);
    } else if (sectionKey === 'bookingWidget+carBrands') {
      loadSection?.('bookingWidget');
      loadCarBrands?.(true);
    } else {
      loadSection?.(sectionKey as keyof typeof content);
    }
  }, [activeView, activeEditor, loadSection, loadServices, loadCarBrands]);

  // Viewport check
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

  // Refresh preview when content changes
  useEffect(() => {
    if (activeView !== 'cms') return;
    const timer = setTimeout(() => {
      setPreviewKey(k => k + 1);
    }, 300);
    return () => clearTimeout(timer);
  }, [content, activeView]);

  // Reset states when switching editors
  useEffect(() => {
    if (activeEditor !== 'serviceDetail') {
      setEditingServiceIndex(null);
      setPreviewService(null); // ✅ Also clear preview service
    }
    if (activeEditor !== 'faq') setFaqPreviewId('faqSection');
  }, [activeEditor]);

  // Close user menu on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle Apply Changes
  const handleApplyChanges = async () => {
    if (!hasUnsavedChanges) return;

    setIsApplying(true);
    try {
      await applyChanges();
      showNotification('success', 'Changes applied successfully!');
      setPreviewKey((k) => k + 1);
    } catch (error: any) {
      console.error('[handleApplyChanges] ❌ Error applying changes:', error);
      showNotification('error', 'Failed to apply changes. Please try again.');
    } finally {
      setIsApplying(false);
    }
  };

  // ✅ FIXED: Handle logout with proper error handling
  const handleLogout = async () => {
    console.log('🔴 Logout clicked');
    setShowUserMenu(false); // Close menu first
    
    try {
      await logout();
      console.log('✅ Logout successful');
    } catch (error) {
      console.error('❌ Logout error:', error);
    } finally {
      // Always navigate to login, even if logout API fails
      navigate('/admin/login', { replace: true });
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
  const handleReset = async () => {
    console.log('[handleReset] 🔴 RESET BUTTON CLICKED');
    try {
      await resetContent();
      setShowResetConfirm(false);
      showNotification('success', 'Content reset to previous saved version!');
      console.log('[handleReset] ✅ Reset completed');
    } catch (err) {
      console.error('[handleReset] ❌ Reset failed:', err);
      showNotification('error', 'Failed to reset content');
    }
  };

  // Handle editor selection
  const handleEditorSelect = (editorId: EditorId) => {
    setActiveEditor(editorId);
    setSidebarCollapsed(true);
    setSidebarHovered(false);
    if (isMobile) setMobileSidebarOpen(false);
    setPreviewKey(k => k + 1);
  };

  // Handle view selection
  const handleViewSelect = (view: AdminView) => {
    setActiveView(view);
    if (isMobile) setMobileSidebarOpen(false);
  };

  // Handle sidebar hover
  const handleSidebarMouseEnter = () => {
    if (sidebarTimeoutRef.current) clearTimeout(sidebarTimeoutRef.current);
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
      if (sidebarTimeoutRef.current) clearTimeout(sidebarTimeoutRef.current);
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
      const sidebarWidth = (sidebarCollapsed && !sidebarHovered) ? 64 : 240;
      const availableWidth = containerRect.width - sidebarWidth;
      const mouseX = e.clientX - containerRect.left - sidebarWidth;
      const newWidth = (mouseX / availableWidth) * 100;

      setEditorPanelWidth(Math.min(Math.max(newWidth, 25), 50));
    };

    const handleMouseUp = () => setIsResizing(false);

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

  // ✅ FIXED: Render the editor component with special handling for ServiceDetailEditor
  const renderEditorComponent = () => {
    if (!EditorComponent) {
      return (
        <div className="p-6 text-center text-red-500 border border-red-200 rounded-lg bg-red-50">
          <h3 className="font-bold">Component Not Found</h3>
        </div>
      );
    }

    if (activeEditor === 'pages') {
      return <PagesEditor isDarkMode={isDarkMode} onPageChange={handlePagesTabChange} />;
    }

    if (activeEditor === 'faq') {
      return <FAQEditor isDarkMode={isDarkMode} onPageChange={handleFAQTabChange} />;
    }

    if (activeEditor === 'legal') {
      // @ts-ignore
      return <PrivacyPolicyEditor isDarkMode={isDarkMode} onPageChange={handleLegalTabChange} />;
    }

    // ✅ FIXED: Pass ALL required callbacks to ServiceDetailEditor
    if (activeEditor === 'serviceDetail') {
      return (
        <ServiceDetailEditor
          isDarkMode={isDarkMode}
          onEditingIndexChange={handleServiceEditingIndexChange}
          onLocalServiceChange={handleLocalServiceChange}
          showNotification={showNotification}
        />
      );
    }

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

  // Determine if sidebar should be expanded
  const isSidebarExpanded = !sidebarCollapsed || sidebarHovered;

  // Get current view title and description
  const getCurrentViewInfo = () => {
    const section = mainSections.find(s => s.id === activeView);
    if (activeView === 'cms') {
      return {
        title: activeEditorConfig?.label || 'CMS Editor',
        description: 'Edit website content'
      };
    }
    return {
      title: section?.label || 'Admin',
      description: section?.description || ''
    };
  };

  const viewInfo = getCurrentViewInfo();

  // Loading state
  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-background">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="relative">
            <div className="w-16 h-16 rounded-xl overflow-hidden shadow-lg">
              <img src={Logo} alt="Logo" className="w-full h-full object-cover" />
            </div>
            <motion.div
              className="absolute inset-0 w-16 h-16 border-4 border-primary border-t-transparent rounded-xl"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            />
          </div>
          <p className="text-muted-foreground mt-4 font-medium">Loading admin panel...</p>
        </motion.div>
      </div>
    );
  }

  // Don't render if not authenticated
  if (!user) return null;

  return (
    <div
      ref={containerRef}
      className={`h-screen flex overflow-hidden ${themeClass('bg-background text-foreground', 'bg-gray-50 text-gray-900')}`}
    >
      {/* ============================================ */}
      {/* MOBILE SIDEBAR OVERLAY */}
      {/* ============================================ */}
      <AnimatePresence>
        {mobileSidebarOpen && isMobile && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
              onClick={() => setMobileSidebarOpen(false)}
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className={`fixed left-0 top-0 bottom-0 z-50 w-[300px] flex flex-col ${themeClass('bg-card border-border', 'bg-white border-gray-200')} border-r shadow-2xl`}
            >
              {/* Mobile Sidebar Header */}
              <div className="p-5 flex items-center justify-between border-b border-border bg-gradient-to-r from-primary/5 to-transparent">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl overflow-hidden shadow-lg">
                    <img src={Logo} alt="Logo" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h2 className="font-bold text-foreground text-lg">Admin Panel</h2>
                    <p className="text-xs text-muted-foreground">{user?.name || 'Administrator'}</p>
                  </div>
                </div>
                <button
                  onClick={() => setMobileSidebarOpen(false)}
                  className="p-2 rounded-xl hover:bg-secondary text-muted-foreground transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Mobile Main Navigation */}
              <div className="p-4">
                <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider mb-3 px-1">Navigation</p>
                <div className="space-y-1">
                  {mainSections.map((section) => {
                    const Icon = section.icon;
                    const isActive = activeView === section.id;

                    return (
                      <motion.button
                        key={section.id}
                        onClick={() => handleViewSelect(section.id)}
                        variants={sidebarItemVariants}
                        whileHover="hover"
                        whileTap="tap"
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive
                          ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20'
                          : 'hover:bg-secondary/70 text-foreground'
                          }`}
                      >
                        <Icon className={`w-5 h-5 ${isActive ? 'text-primary-foreground' : 'text-muted-foreground'}`} />
                        <div className="text-left">
                          <span className="text-sm font-semibold block">{section.label}</span>
                          <span className={`text-[10px] ${isActive ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
                            {section.description}
                          </span>
                        </div>
                      </motion.button>
                    );
                  })}
                </div>
              </div>

              {/* Mobile CMS Search - Only show when CMS is active */}
              {activeView === 'cms' && (
                <>
                  <div className="px-4 pb-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <input
                        type="text"
                        placeholder="Search sections..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className={`w-full pl-10 pr-4 py-2.5 rounded-xl text-sm ${themeClass('bg-secondary text-foreground', 'bg-gray-100 text-gray-900')} border border-border focus:border-primary/50 focus:outline-none transition-colors`}
                      />
                    </div>
                  </div>

                  {/* Mobile Section List */}
                  <div className="flex-1 overflow-y-auto px-4 py-2">
                    <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider mb-2 px-1">Content Sections</p>
                    <div className="space-y-1">
                      {filteredEditors.map((editor) => {
                        const Icon = iconMap[editor.icon] || Sparkles;
                        const isActive = activeEditor === editor.id;

                        return (
                          <button
                            key={editor.id}
                            onClick={() => handleEditorSelect(editor.id)}
                            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${isActive
                              ? 'bg-primary/10 text-primary border border-primary/20'
                              : 'hover:bg-secondary/50 text-foreground'
                              }`}
                          >
                            <Icon className={`w-4 h-4 ${isActive ? 'text-primary' : 'text-muted-foreground'}`} />
                            <span className={`text-sm font-medium ${isActive ? 'text-primary' : ''}`}>
                              {editor.label}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </>
              )}

              {/* Mobile Footer */}
              <div className="mt-auto p-4 border-t border-border space-y-2">
                {activeView === 'cms' && (
                  <button
                    onClick={() => setShowResetConfirm(true)}
                    className="w-full flex items-center justify-center gap-2 p-3 rounded-xl text-sm font-medium bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors"
                  >
                    <RotateCcw className="w-4 h-4" />
                    Reset Content
                  </button>
                )}
                <button
                  onClick={() => navigate('/')}
                  className="w-full flex items-center justify-center gap-2 p-3 rounded-xl text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors shadow-lg shadow-primary/25"
                >
                  <Home className="w-4 h-4" />
                  View Website
                </button>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setMobileSidebarOpen(false);
                    handleLogout();
                  }}
                  className="w-full flex items-center justify-center gap-2 p-3 rounded-xl text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ============================================ */}
      {/* DESKTOP SIDEBAR */}
      {/* ============================================ */}
      <motion.aside
        animate={{ width: isSidebarExpanded ? 240 : 64 }}
        transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
        onMouseEnter={handleSidebarMouseEnter}
        onMouseLeave={handleSidebarMouseLeave}
        className={`hidden md:flex flex-shrink-0 flex-col border-r ${themeClass('bg-card/50 border-border backdrop-blur-xl', 'bg-white/80 border-gray-200 backdrop-blur-xl')} relative z-10`}
      >
        {/* Sidebar Header */}
        <div className={`p-3 border-b ${themeClass('border-border', 'border-gray-200')} flex items-center ${isSidebarExpanded ? 'justify-between' : 'justify-center'}`}>
          {isSidebarExpanded ? (
            <>
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl overflow-hidden shadow-md">
                  <img src={Logo} alt="Logo" className="w-full h-full object-cover" />
                </div>
                <div className="overflow-hidden">
                  <span className="font-bold text-sm text-foreground block">Admin Panel</span>
                  <p className="text-[10px] text-muted-foreground truncate">{user?.name}</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setSidebarCollapsed(true);
                  setSidebarHovered(false);
                }}
                className="p-1.5 rounded-lg hover:bg-secondary text-muted-foreground transition-colors"
                title="Collapse Sidebar"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
            </>
          ) : (
            <button
              onClick={() => setSidebarCollapsed(false)}
              className="w-9 h-9 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow"
              title="Expand Sidebar"
            >
              <img src={Logo} alt="Logo" className="w-full h-full object-cover" />
            </button>
          )}
        </div>

        {/* Main Navigation Section */}
        <div className={`py-3 border-b ${themeClass('border-border', 'border-gray-200')}`}>
          {isSidebarExpanded && (
            <p className="text-[9px] text-muted-foreground font-semibold uppercase tracking-wider px-4 mb-2">Navigation</p>
          )}
          <div className={`space-y-1 ${isSidebarExpanded ? 'px-2' : 'px-1'}`}>
            {mainSections.map((section) => {
              const Icon = section.icon;
              const isActive = activeView === section.id;

              return (
                <motion.button
                  key={section.id}
                  onClick={() => handleViewSelect(section.id)}
                  title={!isSidebarExpanded ? section.label : undefined}
                  variants={sidebarItemVariants}
                  whileHover="hover"
                  whileTap="tap"
                  className={`w-full flex items-center gap-2.5 py-2.5 rounded-xl transition-all ${isActive
                    ? 'bg-primary text-primary-foreground shadow-md shadow-primary/20'
                    : 'hover:bg-secondary/70 text-foreground'
                    } ${isSidebarExpanded ? 'px-3' : 'justify-center px-2'}`}
                >
                  <Icon className={`w-[18px] h-[18px] flex-shrink-0 ${isActive ? 'text-primary-foreground' : 'text-muted-foreground'}`} />
                  {isSidebarExpanded && (
                    <span className={`text-sm font-medium truncate ${isActive ? '' : ''}`}>
                      {section.label}
                    </span>
                  )}
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* CMS Section List - Only show when CMS is active */}
        {activeView === 'cms' && (
          <>
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
                    className={`w-full pl-9 pr-3 py-2 rounded-lg text-sm ${themeClass('bg-secondary border-border text-foreground', 'bg-gray-100 border-gray-200 text-gray-900')} border focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all`}
                  />
                </div>
              </div>
            )}

            {/* Section List */}
            <div className="flex-1 overflow-y-auto py-2 custom-scrollbar">
              {isSidebarExpanded && (
                <p className="text-[9px] text-muted-foreground font-semibold uppercase tracking-wider px-4 mb-2">Content</p>
              )}
              <div className={`space-y-0.5 ${isSidebarExpanded ? 'px-2' : 'px-1'}`}>
                {filteredEditors.map((editor) => {
                  const Icon = iconMap[editor.icon] || Sparkles;
                  const isActive = activeEditor === editor.id;

                  return (
                    <motion.button
                      key={editor.id}
                      onClick={() => handleEditorSelect(editor.id)}
                      title={!isSidebarExpanded ? editor.label : undefined}
                      variants={sidebarItemVariants}
                      whileHover="hover"
                      whileTap="tap"
                      className={`w-full flex items-center gap-2.5 py-2 rounded-lg transition-all ${isActive
                        ? 'bg-primary/10 text-primary'
                        : 'hover:bg-secondary/50 text-foreground'
                        } ${isSidebarExpanded ? 'px-3' : 'justify-center px-2'}`}
                    >
                      <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-primary' : 'text-muted-foreground'}`} />
                      {isSidebarExpanded && (
                        <span className={`text-[13px] font-medium truncate ${isActive ? 'text-primary' : ''}`}>
                          {editor.label}
                        </span>
                      )}
                    </motion.button>
                  );
                })}
              </div>
            </div>
          </>
        )}

        {/* Sidebar Footer */}
        <div className={`p-2 border-t ${themeClass('border-border', 'border-gray-200')} mt-auto`}>
          {isSidebarExpanded ? (
            <div className="space-y-1">
              {activeView === 'cms' && (
                <button
                  onClick={() => setShowResetConfirm(true)}
                  className="w-full flex items-center justify-center gap-1.5 p-2 rounded-lg text-xs bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Reset
                </button>
              )}
              <button
                onClick={() => navigate('/')}
                className="w-full flex items-center justify-center gap-1.5 p-2 rounded-lg text-xs bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                <Home className="w-3.5 h-3.5" />
                View Site
              </button>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleLogout();
                }}
                className="w-full flex items-center justify-center gap-1.5 p-2 rounded-lg text-xs text-destructive hover:bg-destructive/10 transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
                Logout
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-1">
              {activeView === 'cms' && (
                <button
                  onClick={() => setShowResetConfirm(true)}
                  className="p-2 rounded-lg hover:bg-destructive/10 text-destructive transition-colors"
                  title="Reset"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              )}
              <button
                onClick={() => navigate('/')}
                className="p-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                title="View Site"
              >
                <Home className="w-4 h-4" />
              </button>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleLogout();
                }}
                className="p-2 rounded-lg hover:bg-destructive/10 text-destructive transition-colors"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </motion.aside>

      {/* ============================================ */}
      {/* MAIN CONTENT AREA */}
      {/* ============================================ */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* ============================================ */}
        {/* UNIFIED HEADER - STABLE FOR ALL SCREENS */}
        {/* ============================================ */}
        <header className={`flex-shrink-0 flex items-center justify-between h-14 px-4 border-b ${themeClass('bg-card/80 border-border backdrop-blur-xl', 'bg-white/80 border-gray-200 backdrop-blur-xl')} z-30`}>
          <div className="flex items-center gap-3">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="md:hidden p-2 rounded-xl hover:bg-secondary text-foreground transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* View Title with Icon */}
            <div className="flex items-center gap-3">
              {(() => {
                const currentSection = mainSections.find(s => s.id === activeView);
                const Icon = currentSection?.icon || LayoutDashboard;
                return (
                  <div className={`p-2 rounded-xl ${activeView === 'cms' ? 'bg-primary/10' : 'bg-secondary'}`}>
                    <Icon className={`w-4 h-4 ${activeView === 'cms' ? 'text-primary' : 'text-muted-foreground'}`} />
                  </div>
                );
              })()}
              <div>
                <h2 className="font-bold text-foreground text-sm leading-none">
                  {viewInfo.title}
                </h2>
                <p className="text-[10px] text-muted-foreground mt-0.5">{viewInfo.description}</p>
              </div>
            </div>

            {/* Unsaved Changes Indicator (CMS only) */}
            {activeView === 'cms' && (
              <AnimatePresence>
                {hasUnsavedChanges && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8, x: -10 }}
                    animate={{ opacity: 1, scale: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.8, x: -10 }}
                    className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20"
                  >
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-500 opacity-75" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500" />
                    </span>
                    <span className="text-xs font-medium text-amber-600">Unsaved</span>
                  </motion.div>
                )}
              </AnimatePresence>
            )}
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-2">
            {/* CMS-specific controls */}
            {activeView === 'cms' && (
              <>
                {/* Undo/Redo */}
                <div className="hidden sm:flex items-center gap-0.5 mr-1">
                  <button
                    onClick={undo}
                    disabled={!canUndo}
                    className={`p-2 rounded-lg transition-colors ${canUndo ? 'hover:bg-secondary text-foreground' : 'opacity-30 cursor-not-allowed'}`}
                    title="Undo (Ctrl+Z)"
                  >
                    <Undo2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={redo}
                    disabled={!canRedo}
                    className={`p-2 rounded-lg transition-colors ${canRedo ? 'hover:bg-secondary text-foreground' : 'opacity-30 cursor-not-allowed'}`}
                    title="Redo (Ctrl+Y)"
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
                  className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${hasUnsavedChanges && !isApplying
                    ? 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-md shadow-primary/20'
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
                  <span className="hidden sm:inline">{isApplying ? 'Saving...' : 'Save'}</span>
                </motion.button>

                <div className="w-px h-6 bg-border mx-1 hidden sm:block" />

                {/* Preview Toggle */}
                <button
                  onClick={() => setPreviewVisible(!previewVisible)}
                  className={`p-2 rounded-lg transition-colors ${previewVisible ? 'bg-primary text-primary-foreground' : 'hover:bg-secondary text-muted-foreground'}`}
                  title={`${previewVisible ? 'Hide' : 'Show'} Preview (Ctrl+P)`}
                >
                  {previewVisible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                </button>
              </>
            )}

            {/* ✅ FIXED: User Menu with higher z-index */}
            <div className="relative ml-2" ref={userMenuRef}>
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-secondary transition-colors"
              >
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center text-primary-foreground font-bold text-sm shadow-sm">
                  {user?.name?.[0]?.toUpperCase() || 'A'}
                </div>
                <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform hidden sm:block ${showUserMenu ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {showUserMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className={`absolute right-0 top-full mt-2 w-56 rounded-xl ${themeClass('bg-card border-border', 'bg-white border-gray-200')} border shadow-xl z-[100] overflow-hidden`}
                  >
                    <div className="p-3 border-b border-border bg-secondary/30">
                      <p className="font-semibold text-foreground text-sm">{user?.name}</p>
                      <p className="text-xs text-muted-foreground">{user?.email}</p>
                    </div>
                    <div className="p-1.5">
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setShowUserMenu(false);
                          navigate('/');
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-foreground hover:bg-secondary transition-colors"
                      >
                        <Home className="w-4 h-4 text-muted-foreground" />
                        View Website
                      </button>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleLogout();
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-destructive hover:bg-destructive/10 transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>

        {/* ============================================ */}
        {/* MAIN CONTENT WITH VIEW TRANSITIONS */}
        {/* ============================================ */}
        <div className="flex-1 overflow-hidden">
          <AnimatePresence mode="wait">
            {/* Dashboard View */}
            {activeView === 'dashboard' && (
              <motion.div
                key="dashboard"
                initial="initial"
                animate="animate"
                exit="exit"
                variants={pageTransition}
                className="h-full"
              >
                <Dashboard
                  isDarkMode={isDarkMode}
                  onNavigate={(screen: 'bookings' | 'inquiries') => setActiveView(screen)}
                />
              </motion.div>
            )}

            {/* Bookings View */}
            {activeView === 'bookings' && (
              <motion.div
                key="bookings"
                initial="initial"
                animate="animate"
                exit="exit"
                variants={pageTransition}
                className="h-full"
              >
                <BookingsManagement isDarkMode={isDarkMode} />
              </motion.div>
            )}

            {/* Inquiries View */}
            {activeView === 'inquiries' && (
              <motion.div
                key="inquiries"
                initial="initial"
                animate="animate"
                exit="exit"
                variants={pageTransition}
                className="h-full"
              >
                <ContactInquiries isDarkMode={isDarkMode} />
              </motion.div>
            )}

            {/* CMS View */}
            {activeView === 'cms' && (
              <motion.div
                key="cms"
                initial="initial"
                animate="animate"
                exit="exit"
                variants={pageTransition}
                className="flex-1 flex overflow-hidden h-full"
              >
                {/* Editor Panel - 30% width with flex-shrink-0 to prevent shrinking */}
                <motion.div
                  animate={{ width: previewVisible && !isMobile ? `${editorPanelWidth}%` : '100%' }}
                  transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
                  className={`flex flex-col overflow-hidden border-r flex-shrink-0 ${themeClass('border-border bg-card/30', 'border-gray-200 bg-gray-50/50')}`}
                  style={{ minWidth: previewVisible && !isMobile ? `${editorPanelWidth}%` : undefined }}
                >
                  {/* Editor Content */}
                  <div className="flex-1 overflow-y-auto p-4 custom-scrollbar w-full">
                    {renderEditorComponent()}
                  </div>
                </motion.div>

                {/* Resize Handle */}
                {!isMobile && previewVisible && (
                  <div
                    ref={resizeRef}
                    onMouseDown={handleMouseDown}
                    className={`w-1 hover:w-1.5 cursor-col-resize transition-all flex-shrink-0 ${isResizing ? 'bg-primary' : 'bg-border hover:bg-primary/50'
                      }`}
                  />
                )}

                {/* Preview Panel - 70% width */}
                <AnimatePresence>
                  {previewVisible && (
                    <motion.div
                      initial={isMobile ? { x: '100%' } : { opacity: 0 }}
                      animate={isMobile ? { x: 0 } : { opacity: 1, width: `${100 - editorPanelWidth}%` }}
                      exit={isMobile ? { x: '100%' } : { opacity: 0 }}
                      transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                      className={`flex flex-col ${isMobile ? 'fixed inset-0 z-30' : ''} ${themeClass('bg-background', 'bg-gray-100')}`}
                    >
                      {/* Preview Header */}
                      <div className={`flex items-center justify-between px-4 py-2 border-b ${themeClass('border-border bg-card/50', 'border-gray-200 bg-white/50')}`}>
                        <div className="flex items-center gap-3">
                          <Eye className="w-4 h-4 text-muted-foreground" />
                          <span className="font-medium text-sm text-foreground">Live Preview</span>
                        </div>

                        <div className="flex items-center gap-1">
                          <button onClick={refreshPreview} className="p-1.5 rounded-lg hover:bg-secondary text-muted-foreground transition-colors" title="Refresh">
                            <RefreshCw className="w-4 h-4" />
                          </button>
                          <button onClick={copyPreviewUrl} className="p-1.5 rounded-lg hover:bg-secondary text-muted-foreground transition-colors" title="Copy URL">
                            {copiedUrl ? <CheckCircle className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                          </button>
                          <button onClick={openInNewTab} className="p-1.5 rounded-lg hover:bg-secondary text-muted-foreground transition-colors" title="Open in Tab">
                            <ExternalLink className="w-4 h-4" />
                          </button>
                          {!isMobile && (
                            <button onClick={() => setPreviewFullscreen(true)} className="p-1.5 rounded-lg hover:bg-secondary text-muted-foreground transition-colors" title="Fullscreen">
                              <Maximize2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>

                      {/* URL Bar */}
                      <div className="px-3 py-2 border-b border-border">
                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-secondary text-sm">
                          <div className="w-3 h-3 rounded bg-green-500/20 flex items-center justify-center">
                            <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                          </div>
                          <span className="text-xs text-muted-foreground truncate">
                            {window.location.origin}{getPreviewUrl(effectivePreviewId)}
                          </span>
                        </div>
                      </div>

                      {/* Preview Content */}
                      <div className="flex-1 overflow-auto p-3">
                        <motion.div
                          animate={{ width: '100%' }}
                          transition={{ duration: 0.3 }}
                          className="relative rounded-xl overflow-hidden shadow-xl bg-white"
                          style={{ minHeight: '400px', maxWidth: '100%' }}
                        >
                          <div className="h-full w-full overflow-auto">
                            <SectionPreviewWrapper
                              sectionId={effectivePreviewId}
                              device="desktop"
                              refreshKey={previewKey}
                              className="h-full"
                              editingServiceIndex={activeEditor === 'serviceDetail' ? editingServiceIndex : undefined}
                              previewService={activeEditor === 'serviceDetail' ? previewService : undefined}
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
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* ============================================ */}
      {/* FULLSCREEN PREVIEW MODAL */}
      {/* ============================================ */}
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
                <div className="w-8 h-8 rounded-lg overflow-hidden">
                  <img src={Logo} alt="Logo" className="w-full h-full object-cover" />
                </div>
                <span className="text-white font-medium">Fullscreen Preview</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-green-500/20 text-green-400">
                  Desktop
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={refreshPreview} className="p-2 rounded-lg hover:bg-gray-800 text-gray-400 transition-colors">
                  <RefreshCw className="w-5 h-5" />
                </button>
                <button onClick={openInNewTab} className="p-2 rounded-lg hover:bg-gray-800 text-gray-400 transition-colors">
                  <ExternalLink className="w-5 h-5" />
                </button>
                <button onClick={() => setPreviewFullscreen(false)} className="p-2 rounded-lg hover:bg-gray-800 text-white transition-colors">
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
                  previewService={activeEditor === 'serviceDetail' ? previewService : undefined}
                />
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ============================================ */}
      {/* RESET CONFIRMATION MODAL */}
      {/* ============================================ */}
      <AnimatePresence>
        {showResetConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
            onClick={() => setShowResetConfirm(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className={`max-w-md w-full p-6 rounded-2xl shadow-2xl ${themeClass('bg-card', 'bg-white')}`}
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 rounded-2xl bg-destructive/10 flex items-center justify-center">
                  <RotateCcw className="w-7 h-7 text-destructive" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-foreground">Reset All Content?</h3>
                  <p className="text-sm text-muted-foreground">This action cannot be undone</p>
                </div>
              </div>
              <p className="mb-6 text-muted-foreground">
                All content changes will be permanently lost and reset to their previous saved values.
              </p>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowResetConfirm(false)}
                  className="flex-1 py-3 rounded-xl font-medium bg-secondary text-foreground hover:bg-secondary/80 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleReset}
                  className="flex-1 py-3 rounded-xl font-medium bg-destructive text-destructive-foreground hover:bg-destructive/90 transition-colors"
                >
                  Reset Content
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ============================================ */}
      {/* DISCARD CHANGES MODAL */}
      {/* ============================================ */}
      <AnimatePresence>
        {showDiscardConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
            onClick={() => setShowDiscardConfirm(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className={`max-w-md w-full p-6 rounded-2xl shadow-2xl ${themeClass('bg-card', 'bg-white')}`}
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 rounded-2xl bg-amber-500/10 flex items-center justify-center">
                  <AlertCircle className="w-7 h-7 text-amber-500" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-foreground">Discard Changes?</h3>
                  <p className="text-sm text-muted-foreground">Your unsaved changes will be lost</p>
                </div>
              </div>
              <p className="mb-6 text-muted-foreground">
                Are you sure you want to discard all unsaved changes? This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDiscardConfirm(false)}
                  className="flex-1 py-3 rounded-xl font-medium bg-secondary text-foreground hover:bg-secondary/80 transition-colors"
                >
                  Keep Editing
                </button>
                <button
                  onClick={handleDiscardChanges}
                  className="flex-1 py-3 rounded-xl font-medium bg-amber-500 text-white hover:bg-amber-600 transition-colors"
                >
                  Discard
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ============================================ */}
      {/* NOTIFICATION TOAST */}
      {/* ============================================ */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: 50, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: 50, x: '-50%' }}
            className={`fixed bottom-6 left-1/2 z-[300] flex items-center gap-3 px-5 py-3 rounded-xl shadow-2xl ${notification.type === 'success'
              ? 'bg-green-500 text-white'
              : 'bg-destructive text-destructive-foreground'
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