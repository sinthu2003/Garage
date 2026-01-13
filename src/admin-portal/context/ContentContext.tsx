/**
 * ============================================
 * CONTENT CONTEXT (API INTEGRATED)
 * ============================================
 * 
 * This is the UPDATED ContentContext that integrates with your backend API.
 * 
 * Changes from original:
 * - Loads content from API instead of static JSON
 * - Syncs changes to API (debounced)
 * - applyChanges() calls API to publish
 * - discardChanges() calls API to revert
 * - Supports both PUBLIC mode (website) and ADMIN mode (with drafts)
 * - Keeps undo/redo local for fast editing
 * - Keeps image resolution logic intact
 * 
 * @file src/context/ContentContext.tsx
 */

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
  useEffect,
  useRef,
} from 'react';
import type { SiteContent, ContentContextValue } from '../types/content.types';
import defaultContent from '../data/siteContent.json';
import { contentApi,getErrorMessage } from '../../services/api';
import { tokenStorage } from '../../services/api';

// ============================================
// IMAGE RESOLUTION LOGIC (UNCHANGED)
// ============================================

// 1. Import all images using Vite's glob import
const imageModules = import.meta.glob('../../assets/**/*.{png,jpg,jpeg,svg,webp,avif}', { eager: true });

/**
 * 2. Helper to resolve a single path string to a built image URL
 */
const resolvePath = (path: string): string => {
  if (!path || typeof path !== 'string') return path;
  
  // Only try to resolve paths that look like relative asset paths from the JSON
  if (path.startsWith('../assets/')) {
    const filename = path.replace('../assets/', '');
    const localPath = `../../assets/${filename}`;

    const module = imageModules[localPath] as { default: string } | undefined;
    if (module && module.default) {
      return module.default;
    }
    console.warn(`Could not resolve image: ${path}`);
  }
  
  return path;
};

/**
 * 3. Deeply traverse the content object and resolve all image strings
 */
const resolveContentImages = <T,>(content: T): T => {
  if (typeof content === 'string') {
    return resolvePath(content) as unknown as T;
  }
  
  if (Array.isArray(content)) {
    return content.map(item => resolveContentImages(item)) as unknown as T;
  }
  
  if (content !== null && typeof content === 'object') {
    const result: any = {};
    for (const key in content) {
      if (Object.prototype.hasOwnProperty.call(content, key)) {
        result[key] = resolveContentImages((content as any)[key]);
      }
    }
    return result;
  }
  
  return content;
};

// ============================================
// TYPES
// ============================================

interface HistoryEntry {
  content: SiteContent;
  timestamp: number;
  action?: string;
}

interface ContentProviderProps {
  children: React.ReactNode;
  initialContent?: SiteContent;
  /** 
   * Mode: 'public' loads published content, 'admin' loads working content with drafts 
   * Default: auto-detect based on authentication
   */
  mode?: 'public' | 'admin' | 'auto';
  /** Enable loading from API (default: true) */
  enableApi?: boolean;
  /** Fallback to localStorage if API fails (default: true) */
  enableFallback?: boolean;
}

// ============================================
// CONSTANTS
// ============================================

const LOCAL_STORAGE_KEY = 'addax-cms-content';
const SAVED_CONTENT_KEY = 'addax-cms-saved-content';
const HISTORY_LIMIT = 50;
const DEBOUNCE_DELAY = 1000; // 1 second debounce for API sync

// ============================================
// HELPER FUNCTIONS (UNCHANGED)
// ============================================

const deepClone = <T,>(obj: T): T => {
  return JSON.parse(JSON.stringify(obj));
};

const setNestedValue = (obj: any, path: string, value: unknown): any => {
  const result = deepClone(obj);
  const keys = path.split('.');
  let current = result;

  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];
    if (/^\d+$/.test(keys[i + 1])) {
      if (!Array.isArray(current[key])) {
        current[key] = [];
      }
    } else if (!(key in current) || current[key] === null) {
      current[key] = {};
    }
    current = current[key];
  }

  const finalKey = keys[keys.length - 1];
  current[finalKey] = value;
  return result;
};

const deepMerge = <T,>(target: T, source: any): T => {
  if (!source) return target;
  
  const result = { ...target } as any;

  for (const key of Object.keys(source)) {
    const sourceValue = source[key];
    const targetValue = result[key];

    if (
      sourceValue &&
      typeof sourceValue === 'object' &&
      !Array.isArray(sourceValue) &&
      targetValue &&
      typeof targetValue === 'object' &&
      !Array.isArray(targetValue)
    ) {
      result[key] = deepMerge(targetValue, sourceValue);
    } else if (sourceValue !== undefined) {
      result[key] = sourceValue;
    }
  }

  return result as T;
};

const generateHash = (content: SiteContent): string => {
  return JSON.stringify(content);
};

// ============================================
// CONTEXT
// ============================================

const ContentContext = createContext<ContentContextValue | undefined>(undefined);

// ============================================
// PROVIDER COMPONENT
// ============================================

export const ContentProvider: React.FC<ContentProviderProps> = ({
  children,
  initialContent,
  mode = 'auto',
  enableApi = true,
  enableFallback = true,
}) => {
  // ----------------------------------------
  // Refs for debouncing
  // ----------------------------------------
const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pendingChangesRef = useRef<Map<string, { path: string; value: unknown }>>(new Map());

  // ----------------------------------------
  // State
  // ----------------------------------------
  const [content, setContent] = useState<SiteContent>(() => {
    // Start with default content, will be replaced by API data
    return resolveContentImages(initialContent || defaultContent as SiteContent);
  });
  const [savedContent, setSavedContent] = useState<SiteContent>(() => {
    return resolveContentImages(initialContent || defaultContent as SiteContent);
  });
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  
  // Loading and error states (NEW)
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);

  // Determine actual mode
  const actualMode = mode === 'auto' 
    ? (tokenStorage.isAuthenticated() ? 'admin' : 'public')
    : mode;

  // ----------------------------------------
  // Check for unsaved changes
  // ----------------------------------------
  const hasUnsavedChanges = useMemo(() => {
    return generateHash(content) !== generateHash(savedContent);
  }, [content, savedContent]);

  // ----------------------------------------
  // Load content from API on mount
  // ----------------------------------------
  useEffect(() => {
    const loadContent = async () => {
      if (!enableApi) {
        setIsLoading(false);
        // Initialize history with current content
        setHistory([{ content: deepClone(content), timestamp: Date.now(), action: 'initial' }]);
        setHistoryIndex(0);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        let loadedContent: SiteContent;

        if (actualMode === 'admin' && tokenStorage.isAuthenticated()) {
          // Admin mode: load working content (includes drafts)
          loadedContent = await contentApi.getWorkingContent();
        } else {
          // Public mode: load published content
          loadedContent = await contentApi.getPublicContent();
        }

        // Merge with defaults and resolve images
        const mergedContent = deepMerge(defaultContent as SiteContent, loadedContent);
        const resolvedContent = resolveContentImages(mergedContent);

        setContent(resolvedContent);
        setSavedContent(resolvedContent);
        setHistory([{ content: deepClone(resolvedContent), timestamp: Date.now(), action: 'loaded' }]);
        setHistoryIndex(0);

      } catch (err) {
        console.error('Failed to load content from API:', err);
        setError(getErrorMessage(err));

        // Fallback to localStorage if enabled
        if (enableFallback && typeof window !== 'undefined') {
          try {
            const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
            if (stored) {
              const parsed = JSON.parse(stored);
              const merged = deepMerge(defaultContent as SiteContent, parsed);
              const resolved = resolveContentImages(merged);
              setContent(resolved);
              setSavedContent(resolved);
              setHistory([{ content: deepClone(resolved), timestamp: Date.now(), action: 'fallback' }]);
              setHistoryIndex(0);
              console.log('Loaded content from localStorage fallback');
            }
          } catch (localErr) {
            console.error('LocalStorage fallback also failed:', localErr);
          }
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadContent();
  }, [actualMode, enableApi, enableFallback]);

  // ----------------------------------------
  // Debounced API sync for field updates
  // ----------------------------------------
  const syncToApi = useCallback(async () => {
    if (pendingChangesRef.current.size === 0) return;
    if (!tokenStorage.isAuthenticated()) return;

    setIsSyncing(true);

    try {
      // Process all pending changes
      const changes = Array.from(pendingChangesRef.current.entries());
      
      for (const [section, { path, value }] of changes) {
        await contentApi.updateField(section as keyof SiteContent, { path, value });
      }

      pendingChangesRef.current.clear();
    } catch (err) {
      console.error('Failed to sync changes to API:', err);
      // Don't clear pending changes on error - will retry
    } finally {
      setIsSyncing(false);
    }
  }, []);

  const debouncedSync = useCallback(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    debounceTimerRef.current = setTimeout(() => {
      syncToApi();
    }, DEBOUNCE_DELAY);
  }, [syncToApi]);

  // Cleanup debounce timer on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  // ----------------------------------------
  // Add to history (UNCHANGED)
  // ----------------------------------------
  const addToHistory = useCallback(
    (newContent: SiteContent, action?: string) => {
      setHistory((prev) => {
        const newHistory = prev.slice(0, historyIndex + 1);
        newHistory.push({
          content: deepClone(newContent),
          timestamp: Date.now(),
          action,
        });
        
        // Limit history size
        if (newHistory.length > HISTORY_LIMIT) {
          newHistory.shift();
          return newHistory;
        }
        
        return newHistory;
      });
      setHistoryIndex((prev) => Math.min(prev + 1, HISTORY_LIMIT - 1));
    },
    [historyIndex]
  );

  // ----------------------------------------
  // Update field (UPDATED - syncs to API)
  // ----------------------------------------
  const updateField = useCallback(
    (section: string, path: string, value: unknown) => {
      setContent((prev) => {
        const sectionKey = section as keyof SiteContent;
        const sectionContent = prev[sectionKey];

        if (sectionContent === undefined) {
          console.warn(`Section "${section}" not found in content`);
          return prev;
        }

        const updatedSection = setNestedValue(sectionContent, path, value);
        const newContent: SiteContent = {
          ...prev,
          [sectionKey]: updatedSection,
          meta: { ...prev.meta, lastModified: new Date().toISOString() },
        };
        
        // Add to local history
        addToHistory(newContent, `Update ${section}.${path}`);
        
        // Queue for API sync (admin mode only)
        if (actualMode === 'admin' && enableApi && tokenStorage.isAuthenticated()) {
          pendingChangesRef.current.set(section, { path, value });
          debouncedSync();
        }
        
        // Also save to localStorage as backup
        if (enableFallback && typeof window !== 'undefined') {
          try {
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newContent));
          } catch (err) {
            console.warn('Failed to save to localStorage:', err);
          }
        }

        return newContent;
      });
    },
    [addToHistory, actualMode, enableApi, enableFallback, debouncedSync]
  );

  // ----------------------------------------
  // Update section (UPDATED - syncs to API)
  // ----------------------------------------
  const updateSection = useCallback(
    (section: string, value: unknown) => {
      setContent((prev) => {
        const sectionKey = section as keyof SiteContent;
        const newContent: SiteContent = {
          ...prev,
          [sectionKey]: value as any,
          meta: { ...prev.meta, lastModified: new Date().toISOString() },
        };
        addToHistory(newContent, `Update ${section}`);
        
        // For section updates, sync immediately
        if (actualMode === 'admin' && enableApi && tokenStorage.isAuthenticated()) {
          contentApi.updateSection(sectionKey, value as SiteContent[typeof sectionKey])
            .catch(err => console.error('Failed to sync section:', err));
        }
        
        return newContent;
      });
    },
    [addToHistory, actualMode, enableApi]
  );

  // ----------------------------------------
  // Undo / Redo (UNCHANGED - local only)
  // ----------------------------------------
  const undo = useCallback(() => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      setContent(deepClone(history[newIndex].content));
    }
  }, [history, historyIndex]);

  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      setContent(deepClone(history[newIndex].content));
    }
  }, [history, historyIndex]);

  const canUndo = historyIndex > 0;
  const canRedo = historyIndex < history.length - 1;

  // ----------------------------------------
  // Reset content (UPDATED - calls API)
  // ----------------------------------------
  const resetContent = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      if (enableApi && tokenStorage.isAuthenticated()) {
        // Call API to reset
        const result = await contentApi.resetContent();
        const resolved = resolveContentImages(result.content);
        
        setContent(resolved);
        setSavedContent(resolved);
      } else {
        // Fallback to default content
        const resolved = resolveContentImages(defaultContent as SiteContent);
        setContent(deepClone(resolved));
        setSavedContent(deepClone(resolved));
      }

      // Reset history
      setHistory([{ content: deepClone(content), timestamp: Date.now(), action: 'reset' }]);
      setHistoryIndex(0);
      
      // Clear localStorage
      if (typeof window !== 'undefined') {
        localStorage.removeItem(LOCAL_STORAGE_KEY);
        localStorage.removeItem(SAVED_CONTENT_KEY);
      }
    } catch (err) {
      console.error('Failed to reset content:', err);
      setError(getErrorMessage(err));
      
      // Fallback to local reset
      const resolved = resolveContentImages(defaultContent as SiteContent);
      setContent(deepClone(resolved));
      setSavedContent(deepClone(resolved));
    } finally {
      setIsLoading(false);
    }
  }, [enableApi, content]);

  // ----------------------------------------
  // Apply Changes (UPDATED - calls API to publish)
  // ----------------------------------------
  const applyChanges = useCallback(async (): Promise<void> => {
    setIsSyncing(true);
    setError(null);

    try {
      // Flush any pending changes first
      if (pendingChangesRef.current.size > 0) {
        await syncToApi();
      }

      if (enableApi && tokenStorage.isAuthenticated()) {
        // Call API to publish changes
        const result = await contentApi.applyChanges();
        const resolved = resolveContentImages(result.content);
        
        setSavedContent(resolved);
        setContent(resolved);
      } else {
        // Fallback: just update saved content locally
        setSavedContent(deepClone(content));
      }

      setLastSaved(new Date());
      
      // Update localStorage
      if (enableFallback && typeof window !== 'undefined') {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(content));
        localStorage.setItem(SAVED_CONTENT_KEY, JSON.stringify(content));
      }
    } catch (err) {
      console.error('Failed to apply changes:', err);
      setError(getErrorMessage(err));
      throw err; // Re-throw so caller can handle
    } finally {
      setIsSyncing(false);
    }
  }, [content, enableApi, enableFallback, syncToApi]);

  // ----------------------------------------
  // Discard Changes (UPDATED - calls API to revert)
  // ----------------------------------------
  const discardChanges = useCallback(async (): Promise<void> => {
    setIsSyncing(true);
    setError(null);

    try {
      // Clear pending changes
      pendingChangesRef.current.clear();
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }

      if (enableApi && tokenStorage.isAuthenticated()) {
        // Call API to discard draft
        const result = await contentApi.discardChanges();
        const resolved = resolveContentImages(result.content);
        
        setContent(resolved);
        setSavedContent(resolved);
      } else {
        // Fallback: revert to saved content
        setContent(deepClone(savedContent));
      }

      // Reset history
      setHistory([{ content: deepClone(savedContent), timestamp: Date.now(), action: 'discard' }]);
      setHistoryIndex(0);
      
      // Update localStorage
      if (enableFallback && typeof window !== 'undefined') {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(savedContent));
      }
    } catch (err) {
      console.error('Failed to discard changes:', err);
      setError(getErrorMessage(err));
      
      // Fallback: just revert locally
      setContent(deepClone(savedContent));
    } finally {
      setIsSyncing(false);
    }
  }, [savedContent, enableApi, enableFallback]);

  // ----------------------------------------
  // Export / Import (UPDATED)
  // ----------------------------------------
  const exportContent = useCallback((): string => {
    return JSON.stringify(content, null, 2);
  }, [content]);

  const importContent = useCallback(
    async (jsonString: string): Promise<boolean> => {
      try {
        const parsed = JSON.parse(jsonString);
        if (!parsed || typeof parsed !== 'object') {
          throw new Error('Invalid content structure');
        }
        
        const mergedContent = deepMerge(defaultContent as SiteContent, parsed);
        const resolvedMerged = resolveContentImages(mergedContent);

        setContent(resolvedMerged);
        addToHistory(resolvedMerged, 'import');

        // Sync to API if authenticated
        if (enableApi && tokenStorage.isAuthenticated()) {
          await contentApi.importContent(parsed);
        }

        return true;
      } catch (err) {
        console.error('Error importing content:', err);
        setError(getErrorMessage(err));
        return false;
      }
    },
    [addToHistory, enableApi]
  );

  // ----------------------------------------
  // Context value (EXTENDED)
  // ----------------------------------------
  const contextValue = useMemo<ContentContextValue & { 
    isLoading: boolean; 
    error: string | null; 
    isSyncing: boolean;
    clearError: () => void;
  }>(
    () => ({
      content,
      updateField,
      updateSection,
      undo,
      redo,
      canUndo,
      canRedo,
      resetContent,
      exportContent,
      importContent,
      hasUnsavedChanges,
      lastSaved,
      applyChanges,
      discardChanges,
      // New properties
      isLoading,
      error,
      isSyncing,
      clearError: () => setError(null),
    }),
    [
      content,
      updateField,
      updateSection,
      undo,
      redo,
      canUndo,
      canRedo,
      resetContent,
      exportContent,
      importContent,
      hasUnsavedChanges,
      lastSaved,
      applyChanges,
      discardChanges,
      isLoading,
      error,
      isSyncing,
    ]
  );

  return (
    <ContentContext.Provider value={contextValue as ContentContextValue}>
      {children}
    </ContentContext.Provider>
  );
};

// ============================================
// CUSTOM HOOKS (UNCHANGED)
// ============================================

export const useContent = (): ContentContextValue & {
  isLoading?: boolean;
  error?: string | null;
  isSyncing?: boolean;
  clearError?: () => void;
} => {
  const context = useContext(ContentContext);
  if (context === undefined) {
    throw new Error('useContent must be used within a ContentProvider');
  }
  return context;
};

export const useSectionContent = <K extends keyof SiteContent>(
  section: K
): SiteContent[K] => {
  const { content } = useContent();
  return content[section];
};

export const useBrand = () => {
  const { content } = useContent();
  return content.global.brand;
};

export const useServices = () => {
  const { content } = useContent();
  return content.services.items;
};

export const useService = (idOrSlug: string | number) => {
  const services = useServices();
  return services.find((service) => {
    if (service.id === idOrSlug || service.id === String(idOrSlug)) {
      return true;
    }
    const slug = service.title.toLowerCase().replace(/\s+/g, '-').replace(/&/g, 'and');
    return slug === idOrSlug;
  });
};

export const useTestimonials = () => {
  const { content } = useContent();
  return content.testimonials.items;
};

export const useFAQs = () => {
  const { content } = useContent();
  return content.faq.items;
};

export const useBookingData = () => {
  const { content } = useContent();
  return content.bookingWidget;
};

export const useGallery = () => {
  const { content } = useContent();
  return content.gallery;
};

export const usePartners = () => {
  const { content } = useContent();
  return content.partners;
};

// ============================================
// EXPORTS
// ============================================

export { ContentContext };
export type { ContentProviderProps };
export type { ContentContextValue } from '../types/content.types';