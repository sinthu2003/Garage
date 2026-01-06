import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useMemo,
} from 'react';
import type { SiteContent } from '../types/content.types';
import defaultContent from '../data/siteContent.json';

// History entry for undo/redo
interface HistoryEntry {
  content: SiteContent;
  timestamp: number;
}

// Context value interface
interface ContentContextValue {
  content: SiteContent;
  updateField: (section: string, path: string, value: unknown) => void;
  updateSection: (section: string, value: unknown) => void;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  resetContent: () => void;
  exportContent: () => string;
  importContent: (jsonString: string) => boolean;
  hasUnsavedChanges: boolean;
  lastSaved: Date | null;
}

// Create context
const ContentContext = createContext<ContentContextValue | undefined>(undefined);

// Storage key
const STORAGE_KEY = 'addax-cms-content';
const HISTORY_LIMIT = 50;

// Helper: Deep set value in object by path
// Typed as 'any' inputs to handle Interfaces lacking index signatures
const setNestedValue = (obj: any, path: string, value: unknown): any => {
  const result = JSON.parse(JSON.stringify(obj)); // Deep clone
  const keys = path.split('.');
  let current = result;

  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];
    if (!(key in current)) {
      current[key] = {};
    }
    current = current[key];
  }

  current[keys[keys.length - 1]] = value;
  return result;
};

// Provider component
interface ContentProviderProps {
  children: React.ReactNode;
  initialContent?: SiteContent;
}

// Deep merge helper - using 'any' to avoid "Index signature missing" errors on Interfaces
const deepMerge = <T,>(target: T, source: any): T => {
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

export const ContentProvider: React.FC<ContentProviderProps> = ({
  children,
  initialContent,
}) => {
  // Load initial content from localStorage or use default
  const loadInitialContent = useCallback((): SiteContent => {
    if (initialContent) return initialContent;

    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Merge with default to ensure all fields exist
        return deepMerge(defaultContent as SiteContent, parsed);
      }
    } catch (error) {
      console.error('Error loading content from localStorage:', error);
    }

    return defaultContent as SiteContent;
  }, [initialContent]);

  const [content, setContent] = useState<SiteContent>(() => loadInitialContent());
  const [history, setHistory] = useState<HistoryEntry[]>(() => [
    { content: loadInitialContent(), timestamp: Date.now() },
  ]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [initialContentHash, setInitialContentHash] = useState<string>('');

  // Calculate content hash for change detection
  const getContentHash = useCallback((c: SiteContent): string => {
    return JSON.stringify(c);
  }, []);

  // Initialize hash on mount
  useEffect(() => {
    setInitialContentHash(getContentHash(loadInitialContent()));
  }, [getContentHash, loadInitialContent]);

  // Check for unsaved changes
  const hasUnsavedChanges = useMemo(() => {
    return getContentHash(content) !== initialContentHash;
  }, [content, initialContentHash, getContentHash]);

  // Save to localStorage with debounce
  useEffect(() => {
    const saveTimer = setTimeout(() => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(content));
        setLastSaved(new Date());
      } catch (error) {
        console.error('Error saving content to localStorage:', error);
      }
    }, 500);

    return () => clearTimeout(saveTimer);
  }, [content]);

  // Add to history
  const addToHistory = useCallback((newContent: SiteContent) => {
    setHistory((prev) => {
      // Remove any future history if we're not at the end
      const newHistory = prev.slice(0, historyIndex + 1);

      // Add new entry
      newHistory.push({
        content: JSON.parse(JSON.stringify(newContent)),
        timestamp: Date.now(),
      });

      // Limit history size
      if (newHistory.length > HISTORY_LIMIT) {
        newHistory.shift();
        return newHistory;
      }

      return newHistory;
    });

    setHistoryIndex((prev) => Math.min(prev + 1, HISTORY_LIMIT - 1));
  }, [historyIndex]);

  // Update a specific field by path
  const updateField = useCallback(
    (section: string, path: string, value: unknown) => {
      setContent((prev) => {
        // Use assertion as keyof SiteContent to access property
        const sectionKey = section as keyof SiteContent;
        const sectionContent = prev[sectionKey];
        
        if (!sectionContent || typeof sectionContent !== 'object') {
          console.error(`Section "${section}" not found or is not an object`);
          return prev;
        }

        const updatedSection = setNestedValue(
          sectionContent,
          path,
          value
        );

        const newContent: SiteContent = {
          ...prev,
          [sectionKey]: updatedSection,
          meta: {
            ...prev.meta,
            lastModified: new Date().toISOString(),
          },
        };

        // Add to history (debounced)
        addToHistory(newContent);

        return newContent;
      });
    },
    [addToHistory]
  );

  // Update entire section
  const updateSection = useCallback(
    (section: string, value: unknown) => {
      setContent((prev) => {
        const sectionKey = section as keyof SiteContent;
        const newContent: SiteContent = {
          ...prev,
          [sectionKey]: value as any, // Cast to any/correct type
          meta: {
            ...prev.meta,
            lastModified: new Date().toISOString(),
          },
        };

        addToHistory(newContent);

        return newContent;
      });
    },
    [addToHistory]
  );

  // Undo
  const undo = useCallback(() => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      setContent(JSON.parse(JSON.stringify(history[newIndex].content)));
    }
  }, [history, historyIndex]);

  // Redo
  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      setContent(JSON.parse(JSON.stringify(history[newIndex].content)));
    }
  }, [history, historyIndex]);

  // Can undo/redo
  const canUndo = historyIndex > 0;
  const canRedo = historyIndex < history.length - 1;

  // Reset to default content
  const resetContent = useCallback(() => {
    const resetData = defaultContent as SiteContent;
    setContent(resetData);
    setHistory([{ content: resetData, timestamp: Date.now() }]);
    setHistoryIndex(0);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  // Export content as JSON string
  const exportContent = useCallback((): string => {
    return JSON.stringify(content, null, 2);
  }, [content]);

  // Import content from JSON string
  const importContent = useCallback((jsonString: string): boolean => {
    try {
      const parsed = JSON.parse(jsonString);

      // Validate basic structure
      if (!parsed || typeof parsed !== 'object') {
        throw new Error('Invalid content structure');
      }

      // Merge with default to ensure all required fields
      const mergedContent = deepMerge(defaultContent as SiteContent, parsed);

      setContent(mergedContent);
      addToHistory(mergedContent);

      return true;
    } catch (error) {
      console.error('Error importing content:', error);
      return false;
    }
  }, [addToHistory]);

  // Context value
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

// Custom hook to use content context
export const useContent = (): ContentContextValue => {
  const context = useContext(ContentContext);

  if (context === undefined) {
    throw new Error('useContent must be used within a ContentProvider');
  }

  return context;
};

// Export context for advanced usage
export { ContentContext };
export type { ContentContextValue, ContentProviderProps };