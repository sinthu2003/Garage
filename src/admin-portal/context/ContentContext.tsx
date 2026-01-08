import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useMemo,
} from 'react';
import type { SiteContent, ContentContextValue } from '../types/content.types';
import defaultContent from '../data/siteContent.json';

// ============================================
// IMAGE RESOLUTION LOGIC (NEW)
// ============================================

// 1. Import all images using Vite's glob import
// Note: We use '../../assets' because this file is in src/admin-portal/context
const imageModules = import.meta.glob('../../assets/**/*.{png,jpg,jpeg,svg,webp}', { eager: true });

/**
 * 2. Helper to resolve a single path string to a built image URL
 */
const resolvePath = (path: string): string => {
  if (!path || typeof path !== 'string') return path;
  
  // Only try to resolve paths that look like relative asset paths from the JSON
  if (path.startsWith('../assets/')) {
    // The JSON has "../assets/Logo.jpg", but relative to THIS file, it is "../../assets/Logo.jpg"
    // We strip "../assets/" and prepend "../../assets/"
    const filename = path.replace('../assets/', '');
    const localPath = `../../assets/${filename}`;

    const module = imageModules[localPath] as { default: string } | undefined;
    if (module && module.default) {
      return module.default;
    }
    // If not found, fallback to the original path (or you could return a placeholder)
    console.warn(`Could not resolve image: ${path}`);
  }
  
  return path;
};

/**
 * 3. Deeply traverse the content object and resolve all image strings
 */
const resolveContentImages = <T,>(content: T): T => {
  if (typeof content === 'string') {
    // Try to resolve if it's a string
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
  storageKey?: string;
  enablePersistence?: boolean;
}

// ============================================
// CONSTANTS
// ============================================

const DEFAULT_STORAGE_KEY = 'addax-cms-content';
const HISTORY_LIMIT = 50;
const SAVE_DEBOUNCE_MS = 500;

// ============================================
// HELPER FUNCTIONS
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
  storageKey = DEFAULT_STORAGE_KEY,
  enablePersistence = true,
}) => {
  // ----------------------------------------
  // Load initial content
  // ----------------------------------------
  const loadInitialContent = useCallback((): SiteContent => {
    let loadedData: SiteContent = defaultContent as SiteContent;

    // If initial content is provided via props, use it
    if (initialContent) {
      loadedData = deepClone(initialContent);
    } 
    // Otherwise try localStorage
    else if (enablePersistence && typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(storageKey);
        if (stored) {
          const parsed = JSON.parse(stored);
          loadedData = deepMerge(defaultContent as SiteContent, parsed);
        }
      } catch (error) {
        console.error('Error loading content from localStorage:', error);
      }
    }

    // IMPORTANT: Resolve images before returning
    // This ensures that whether data comes from JSON or LocalStorage, 
    // relative paths are converted to vite-processed URLs.
    return resolveContentImages(loadedData);
  }, [initialContent, storageKey, enablePersistence]);

  // ----------------------------------------
  // State
  // ----------------------------------------
  const [content, setContent] = useState<SiteContent>(() => loadInitialContent());
  
  // We only add to history AFTER resolving images
  const [history, setHistory] = useState<HistoryEntry[]>(() => [
    { content: loadInitialContent(), timestamp: Date.now(), action: 'initial' },
  ]);
  
  const [historyIndex, setHistoryIndex] = useState(0);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [initialHash, setInitialHash] = useState<string>('');

  useEffect(() => {
    setInitialHash(generateHash(loadInitialContent()));
  }, [loadInitialContent]);

  const hasUnsavedChanges = useMemo(() => {
    return generateHash(content) !== initialHash;
  }, [content, initialHash]);

  // ----------------------------------------
  // Auto-save
  // ----------------------------------------
  useEffect(() => {
    if (!enablePersistence || typeof window === 'undefined') return;

    const saveTimer = setTimeout(() => {
      try {
        localStorage.setItem(storageKey, JSON.stringify(content));
        setLastSaved(new Date());
      } catch (error) {
        console.error('Error saving content to localStorage:', error);
      }
    }, SAVE_DEBOUNCE_MS);

    return () => clearTimeout(saveTimer);
  }, [content, storageKey, enablePersistence]);

  // ----------------------------------------
  // Add to history
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
        if (newHistory.length > HISTORY_LIMIT) {
          return newHistory.slice(-HISTORY_LIMIT);
        }
        return newHistory;
      });
      setHistoryIndex((prev) => Math.min(prev + 1, HISTORY_LIMIT - 1));
    },
    [historyIndex]
  );

  // ----------------------------------------
  // Content Updates
  // ----------------------------------------
  const updateField = useCallback(
    (section: string, path: string, value: unknown) => {
      setContent((prev) => {
        const sectionKey = section as keyof SiteContent;
        const sectionContent = prev[sectionKey];

        if (!sectionContent || typeof sectionContent !== 'object') {
          console.error(`Section "${section}" not found or is not an object`);
          return prev;
        }

        const updatedSection = setNestedValue(sectionContent, path, value);
        const newContent: SiteContent = {
          ...prev,
          [sectionKey]: updatedSection,
          meta: { ...prev.meta, lastModified: new Date().toISOString() },
        };
        addToHistory(newContent, `Update ${section}.${path}`);
        return newContent;
      });
    },
    [addToHistory]
  );

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
        return newContent;
      });
    },
    [addToHistory]
  );

  // ----------------------------------------
  // Undo / Redo / Reset
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

  const resetContent = useCallback(() => {
    // Reset to default JSON, but make sure to resolve images again
    const resetData = resolveContentImages(defaultContent as SiteContent);
    setContent(deepClone(resetData));
    setHistory([{ content: deepClone(resetData), timestamp: Date.now(), action: 'reset' }]);
    setHistoryIndex(0);
    
    if (enablePersistence && typeof window !== 'undefined') {
      localStorage.removeItem(storageKey);
    }
  }, [storageKey, enablePersistence]);

  const exportContent = useCallback((): string => {
    return JSON.stringify(content, null, 2);
  }, [content]);

  const importContent = useCallback(
    (jsonString: string): boolean => {
      try {
        const parsed = JSON.parse(jsonString);
        if (!parsed || typeof parsed !== 'object') {
          throw new Error('Invalid content structure');
        }
        // Merge and then resolve images
        const mergedContent = deepMerge(defaultContent as SiteContent, parsed);
        const resolvedMerged = resolveContentImages(mergedContent);

        setContent(resolvedMerged);
        addToHistory(resolvedMerged, 'import');
        setInitialHash(generateHash(resolvedMerged));

        return true;
      } catch (error) {
        console.error('Error importing content:', error);
        return false;
      }
    },
    [addToHistory]
  );

  // ----------------------------------------
  // Context value
  // ----------------------------------------
  const contextValue = useMemo<ContentContextValue>(
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
    ]
  );

  return (
    <ContentContext.Provider value={contextValue}>
      {children}
    </ContentContext.Provider>
  );
};

// ============================================
// CUSTOM HOOKS (Unchanged)
// ============================================

export const useContent = (): ContentContextValue => {
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

export { ContentContext };
export type { ContentProviderProps };
export type { ContentContextValue } from '../types/content.types';