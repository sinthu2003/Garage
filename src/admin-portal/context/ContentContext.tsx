/**
 * ============================================
 * CONTENT CONTEXT (API INTEGRATED + LAZY LOADING)
 * ============================================
 * 
 * [FIX] Uses refs to prevent duplicate API calls and infinite loops
 * The key fix is removing loading states from useCallback dependencies
 * and using refs to track loading/loaded status instead.
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
import { 
  contentApi, 
  servicesApi, 
  carDataApi, 
  getErrorMessage,
  type Service,
  type CarBrand,
  type CarModel,
  type CreateServiceData,
  type UpdateServiceData,
  type CreateBrandData,
  type UpdateBrandData,
  type CreateModelData,
  type UpdateModelData,
} from '../../services/api';
import { tokenStorage } from '../../services/api';

// ============================================
// IMAGE RESOLUTION LOGIC (UNCHANGED)
// ============================================

const imageModules = import.meta.glob('../../assets/**/*.{png,jpg,jpeg,svg,webp,avif}', { eager: true });

const resolvePath = (path: string): string => {
  if (!path || typeof path !== 'string') return path;
  
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
  mode?: 'public' | 'admin' | 'auto';
  enableApi?: boolean;
  enableFallback?: boolean;
}

interface ExtendedContentContextValue extends ContentContextValue {
  isLoading: boolean;
  error: string | null;
  isSyncing: boolean;
  clearError: () => void;
  
  loadedSections: Set<string>;
  loadSection: (section: keyof SiteContent) => Promise<void>;
  isSectionLoading: (section: keyof SiteContent) => boolean;
  
  services: Service[];
  servicesLoading: boolean;
  loadServices: () => Promise<void>;
  createService: (data: CreateServiceData) => Promise<Service>;
  updateService: (id: string, data: UpdateServiceData) => Promise<Service>;
  deleteService: (id: string) => Promise<void>;
  reorderServices: (orderedIds: string[]) => Promise<void>;
  
  carBrands: CarBrand[];
  carBrandsLoading: boolean;
  loadCarBrands: (includeModels?: boolean) => Promise<void>;
  createBrand: (data: CreateBrandData) => Promise<CarBrand>;
  updateBrand: (id: string, data: UpdateBrandData) => Promise<CarBrand>;
  deleteBrand: (id: string) => Promise<void>;
  
  createModel: (brandId: string, data: CreateModelData) => Promise<CarModel>;
  updateModel: (id: string, data: UpdateModelData) => Promise<CarModel>;
  deleteModel: (id: string) => Promise<void>;
}

// ============================================
// CONSTANTS
// ============================================

const LOCAL_STORAGE_KEY = 'addax-cms-content';
const SAVED_CONTENT_KEY = 'addax-cms-saved-content';
const HISTORY_LIMIT = 50;
const DEBOUNCE_DELAY = 1000;

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

const ContentContext = createContext<ExtendedContentContextValue | undefined>(undefined);

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
  // Refs for debouncing and preventing duplicate calls
  // [FIX] These refs prevent infinite loops by tracking state without causing re-renders
  // ----------------------------------------
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pendingChangesRef = useRef<Map<string, { path: string; value: unknown }>>(new Map());
  
  // [FIX] Use refs to track loading/loaded state - these don't cause useCallback to recreate
  const servicesLoadingRef = useRef(false);
  const servicesLoadedRef = useRef(false);
  const carBrandsLoadingRef = useRef(false);
  const carBrandsLoadedRef = useRef(false);
  const loadingSectionsRef = useRef<Set<string>>(new Set());
  const loadedSectionsRef = useRef<Set<string>>(new Set());

  // ----------------------------------------
  // State
  // ----------------------------------------
  const [content, setContent] = useState<SiteContent>(() => {
    return resolveContentImages(initialContent || defaultContent as SiteContent);
  });
  const [savedContent, setSavedContent] = useState<SiteContent>(() => {
    return resolveContentImages(initialContent || defaultContent as SiteContent);
  });
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);

  // These state values are for UI display only
  const [loadedSections, setLoadedSections] = useState<Set<string>>(new Set());
  const [loadingSections, setLoadingSections] = useState<Set<string>>(new Set());

  const [services, setServices] = useState<Service[]>([]);
  const [servicesLoading, setServicesLoading] = useState(false);

  const [carBrands, setCarBrands] = useState<CarBrand[]>([]);
  const [carBrandsLoading, setCarBrandsLoading] = useState(false);

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
  // [LAZY LOADING] Different behavior for admin vs public
  // - Admin: Lazy load sections on-demand (faster admin panel)
  // - Public: Load all content at once (smooth browsing)
  // ----------------------------------------
  useEffect(() => {
    const initializeContent = async () => {
      if (!enableApi) {
        // API disabled - use defaults
        console.log('[ContentContext] API disabled, using defaults.');
        setHistory([{ content: deepClone(content), timestamp: Date.now(), action: 'initial' }]);
        setHistoryIndex(0);
        setIsLoading(false);
        return;
      }

      // Check if we're in admin mode
      const isAdminMode = actualMode === 'admin' && tokenStorage.isAuthenticated();

      if (isAdminMode) {
        // ADMIN MODE: Don't load all content - sections will be lazy-loaded
        console.log('[ContentContext] ✅ Admin mode: Initialized with defaults. Sections will be lazy-loaded on demand.');
        setHistory([{ content: deepClone(content), timestamp: Date.now(), action: 'initial' }]);
        setHistoryIndex(0);
        setIsLoading(false);
      } else {
        // PUBLIC MODE: Load all content at once for smooth browsing
        console.log('[ContentContext] 🔄 Public mode: Loading all content...');
        setIsLoading(true);
        setError(null);

        try {
          const loadedContent = await contentApi.getPublicContent();
          const mergedContent = deepMerge(defaultContent as SiteContent, loadedContent);
          const resolvedContent = resolveContentImages(mergedContent);

          setContent(resolvedContent);
          setSavedContent(resolvedContent);
          setHistory([{ content: deepClone(resolvedContent), timestamp: Date.now(), action: 'loaded' }]);
          setHistoryIndex(0);
          
          console.log('[ContentContext] ✅ Public mode: All content loaded.');
        } catch (err) {
          console.error('[ContentContext] ❌ Failed to load public content:', err);
          setError(getErrorMessage(err));

          // Fallback to localStorage if available
          if (enableFallback && typeof window !== 'undefined') {
            try {
              const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
              if (stored) {
                const parsed = JSON.parse(stored);
                const merged = deepMerge(defaultContent as SiteContent, parsed);
                const resolved = resolveContentImages(merged);
                setContent(resolved);
                setSavedContent(resolved);
                console.log('[ContentContext] Loaded from localStorage fallback.');
              }
            } catch (localErr) {
              console.error('[ContentContext] LocalStorage fallback failed:', localErr);
            }
          }
        } finally {
          setIsLoading(false);
        }
      }
    };

    initializeContent();
  }, [actualMode, enableApi, enableFallback]);

  // ----------------------------------------
  // [FIX] Load a specific section on demand - using refs for guards
  // ----------------------------------------
  const loadSection = useCallback(async (section: keyof SiteContent) => {
    // [FIX] Use refs to check loading/loaded state - not state variables
    if (loadedSectionsRef.current.has(section) || loadingSectionsRef.current.has(section)) {
      console.log(`[loadSection] ⏭️ Section '${section}' already loaded or loading, skipping.`);
      return;
    }

    console.log(`[loadSection] 🔄 Loading section: ${section} from API...`);

    // Mark as loading in ref
    loadingSectionsRef.current.add(section);
    setLoadingSections(prev => new Set(prev).add(section));

    try {
      const sectionData = await contentApi.getSection(section);
      console.log(`[loadSection] ✅ API Response for '${section}':`, sectionData);
      
      const resolvedData = resolveContentImages(sectionData);

      // [FIX] Update BOTH content AND savedContent to prevent false "unsaved changes"
      // When we load a section from API, that IS the saved state
      setContent(prev => ({
        ...prev,
        [section]: resolvedData,
      }));
      
      setSavedContent(prev => ({
        ...prev,
        [section]: resolvedData,
      }));

      // Mark as loaded in ref
      loadedSectionsRef.current.add(section);
      setLoadedSections(prev => new Set(prev).add(section));
      
      console.log(`[loadSection] ✅ Section '${section}' loaded and stored in content.${section}`);
    } catch (err) {
      console.error(`[loadSection] ❌ Failed to load section ${section}:`, err);
      setError(getErrorMessage(err));
    } finally {
      // Remove from loading in ref
      loadingSectionsRef.current.delete(section);
      setLoadingSections(prev => {
        const next = new Set(prev);
        next.delete(section);
        return next;
      });
    }
  }, []); // [FIX] Empty deps - function reference is stable

  const isSectionLoading = useCallback((section: keyof SiteContent) => {
    return loadingSections.has(section);
  }, [loadingSections]);

  // ----------------------------------------
  // [FIX] Services CRUD - using refs for guards
  // ----------------------------------------
  const loadServices = useCallback(async () => {
    // [FIX] Use refs to prevent duplicate calls - not state
    if (servicesLoadingRef.current || servicesLoadedRef.current) {
      return;
    }

    // Mark as loading in ref FIRST
    servicesLoadingRef.current = true;
    setServicesLoading(true);

    try {
      const result = await servicesApi.getAll({ limit: 100 });
      // [FIX] Apply resolveContentImages to resolve ../assets/ paths to actual URLs
      const resolvedServices = resolveContentImages(result.items);
      console.log('[loadServices] ✅ Services loaded:', resolvedServices.length, 'items');
      setServices(resolvedServices);
      // Mark as loaded
      servicesLoadedRef.current = true;
    } catch (err) {
      console.error('[loadServices] ❌ Failed to load services:', err);
      setError(getErrorMessage(err));
      // Reset ref on error to allow retry
      servicesLoadedRef.current = false;
    } finally {
      servicesLoadingRef.current = false;
      setServicesLoading(false);
    }
  }, []); // [FIX] Empty deps - function reference is stable

  const createServiceFn = useCallback(async (data: CreateServiceData): Promise<Service> => {
    const newService = await servicesApi.create(data);
    // [FIX] Resolve image paths for new service
    const resolvedService = resolveContentImages(newService);
    setServices(prev => [resolvedService, ...prev]);
    return resolvedService;
  }, []);

  const updateServiceFn = useCallback(async (id: string, data: UpdateServiceData): Promise<Service> => {
    const updated = await servicesApi.update(id, data);
    // [FIX] Resolve image paths for updated service
    const resolvedService = resolveContentImages(updated);
    setServices(prev => prev.map(s => s._id === id ? resolvedService : s));
    return resolvedService;
  }, []);

  const deleteServiceFn = useCallback(async (id: string): Promise<void> => {
    await servicesApi.delete(id);
    setServices(prev => prev.filter(s => s._id !== id));
  }, []);

  const reorderServicesFn = useCallback(async (orderedIds: string[]): Promise<void> => {
    await servicesApi.reorder(orderedIds);
    setServices(prev => {
      const serviceMap = new Map(prev.map(s => [s._id, s]));
      return orderedIds
        .map(id => serviceMap.get(id))
        .filter((s): s is Service => s !== undefined);
    });
  }, []);

  // ----------------------------------------
  // [FIX] Car Brands CRUD - using refs for guards
  // ----------------------------------------
  const loadCarBrands = useCallback(async (includeModels = true) => {
    // [FIX] Use refs to prevent duplicate calls - not state
    if (carBrandsLoadingRef.current || carBrandsLoadedRef.current) {
      return;
    }

    // Mark as loading in ref FIRST
    carBrandsLoadingRef.current = true;
    setCarBrandsLoading(true);

    try {
      const brands = await carDataApi.getAllBrands({ includeModels, includeInactive: true });
      // [FIX] Apply resolveContentImages to resolve ../assets/ paths to actual URLs
      const resolvedBrands = resolveContentImages(brands);
      console.log('[loadCarBrands] ✅ Car brands loaded:', resolvedBrands.length, 'items');
      setCarBrands(resolvedBrands);
      // Mark as loaded
      carBrandsLoadedRef.current = true;
    } catch (err) {
      console.error('[loadCarBrands] ❌ Failed to load car brands:', err);
      setError(getErrorMessage(err));
      // Reset ref on error to allow retry
      carBrandsLoadedRef.current = false;
    } finally {
      carBrandsLoadingRef.current = false;
      setCarBrandsLoading(false);
    }
  }, []); // [FIX] Empty deps - function reference is stable

  const createBrandFn = useCallback(async (data: CreateBrandData): Promise<CarBrand> => {
    const newBrand = await carDataApi.createBrand(data);
    const resolvedBrand = resolveContentImages(newBrand);
    setCarBrands(prev => [...prev, resolvedBrand]);
    return resolvedBrand;
  }, []);

  const updateBrandFn = useCallback(async (id: string, data: UpdateBrandData): Promise<CarBrand> => {
    const updated = await carDataApi.updateBrand(id, data);
    const resolvedBrand = resolveContentImages(updated);
    setCarBrands(prev => prev.map(b => b._id === id ? { ...b, ...resolvedBrand } : b));
    return resolvedBrand;
  }, []);

  const deleteBrandFn = useCallback(async (id: string): Promise<void> => {
    await carDataApi.deleteBrand(id);
    setCarBrands(prev => prev.filter(b => b._id !== id));
  }, []);

  // ----------------------------------------
  // Car Models CRUD
  // ----------------------------------------
  const createModelFn = useCallback(async (brandId: string, data: CreateModelData): Promise<CarModel> => {
    const newModel = await carDataApi.addModelToBrand(brandId, data);
    setCarBrands(prev => prev.map(b => {
      if (b._id === brandId) {
        return {
          ...b,
          models: [...(b.models || []), newModel],
        };
      }
      return b;
    }));
    return newModel;
  }, []);

  const updateModelFn = useCallback(async (id: string, data: UpdateModelData): Promise<CarModel> => {
    const updated = await carDataApi.updateModel(id, data);
    setCarBrands(prev => prev.map(b => ({
      ...b,
      models: b.models?.map(m => m._id === id ? { ...m, ...updated } : m),
    })));
    return updated;
  }, []);

  const deleteModelFn = useCallback(async (id: string): Promise<void> => {
    await carDataApi.deleteModel(id);
    setCarBrands(prev => prev.map(b => ({
      ...b,
      models: b.models?.filter(m => m._id !== id),
    })));
  }, []);

  // ----------------------------------------
  // Debounced API sync for field updates
  // ----------------------------------------
  const syncToApi = useCallback(async () => {
    if (pendingChangesRef.current.size === 0) return;
    if (!tokenStorage.isAuthenticated()) return;

    setIsSyncing(true);

    try {
      const changes = Array.from(pendingChangesRef.current.entries());
      
      for (const [section, { path, value }] of changes) {
        await contentApi.updateField(section as keyof SiteContent, { path, value });
      }

      pendingChangesRef.current.clear();
    } catch (err) {
      console.error('Failed to sync changes to API:', err);
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

  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

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
  // Update field
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
        
        addToHistory(newContent, `Update ${section}.${path}`);
        
        if (actualMode === 'admin' && enableApi && tokenStorage.isAuthenticated()) {
          pendingChangesRef.current.set(section, { path, value });
          debouncedSync();
        }
        
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
  // Update section
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
  // Undo / Redo
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
  // Reset content
  // ----------------------------------------
  const resetContent = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      let newContent: SiteContent;
      
      if (enableApi && tokenStorage.isAuthenticated()) {
        const result = await contentApi.resetContent();
        // [FIX] Merge API result with defaults to ensure all sections exist
        const mergedContent = result.content 
          ? deepMerge(defaultContent as SiteContent, result.content)
          : defaultContent as SiteContent;
        newContent = resolveContentImages(mergedContent);
      } else {
        newContent = resolveContentImages(defaultContent as SiteContent);
      }

      setContent(deepClone(newContent));
      setSavedContent(deepClone(newContent));
      
      // [FIX] Clear loaded sections refs to force reload on next access
      loadedSectionsRef.current.clear();
      setLoadedSections(new Set());
      
      // [FIX] Reset services and car brands loaded state
      servicesLoadedRef.current = false;
      carBrandsLoadedRef.current = false;
      setServices([]);
      setCarBrands([]);

      setHistory([{ content: deepClone(newContent), timestamp: Date.now(), action: 'reset' }]);
      setHistoryIndex(0);
      
      if (typeof window !== 'undefined') {
        localStorage.removeItem(LOCAL_STORAGE_KEY);
        localStorage.removeItem(SAVED_CONTENT_KEY);
      }
      
      console.log('[resetContent] ✅ Content reset to defaults');
    } catch (err) {
      console.error('[resetContent] ❌ Failed to reset content:', err);
      setError(getErrorMessage(err));
      
      // Fallback to defaults
      const resolved = resolveContentImages(defaultContent as SiteContent);
      setContent(deepClone(resolved));
      setSavedContent(deepClone(resolved));
    } finally {
      setIsLoading(false);
    }
  }, [enableApi]);

  // ----------------------------------------
  // Apply Changes
  // ----------------------------------------
  const applyChanges = useCallback(async (): Promise<void> => {
    setIsSyncing(true);
    setError(null);

    try {
      if (pendingChangesRef.current.size > 0) {
        await syncToApi();
      }

      if (enableApi && tokenStorage.isAuthenticated()) {
        const result = await contentApi.applyChanges();
        
        // [FIX] Merge result with current content to preserve loaded sections
        // The API might return partial content, so we merge it
        const mergedContent = result.content 
          ? deepMerge(content, result.content)
          : content;
        const resolved = resolveContentImages(mergedContent);
        
        setSavedContent(resolved);
        setContent(resolved);
        
        console.log('[applyChanges] ✅ Changes applied successfully');
      } else {
        setSavedContent(deepClone(content));
      }

      setLastSaved(new Date());
      
      if (enableFallback && typeof window !== 'undefined') {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(content));
        localStorage.setItem(SAVED_CONTENT_KEY, JSON.stringify(content));
      }
    } catch (err) {
      console.error('[applyChanges] ❌ Failed to apply changes:', err);
      setError(getErrorMessage(err));
      throw err;
    } finally {
      setIsSyncing(false);
    }
  }, [content, enableApi, enableFallback, syncToApi]);

  // ----------------------------------------
  // Discard Changes
  // ----------------------------------------
  const discardChanges = useCallback(async (): Promise<void> => {
    setIsSyncing(true);
    setError(null);

    try {
      pendingChangesRef.current.clear();
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }

      if (enableApi && tokenStorage.isAuthenticated()) {
        const result = await contentApi.discardChanges();
        
        // [FIX] Merge result with defaults to ensure all sections exist
        const mergedContent = result.content 
          ? deepMerge(defaultContent as SiteContent, result.content)
          : savedContent;
        const resolved = resolveContentImages(mergedContent);
        
        setContent(resolved);
        setSavedContent(resolved);
        
        // [FIX] Clear loaded sections to force reload on next access
        loadedSectionsRef.current.clear();
        setLoadedSections(new Set());
        
        console.log('[discardChanges] ✅ Changes discarded successfully');
      } else {
        setContent(deepClone(savedContent));
      }

      setHistory([{ content: deepClone(savedContent), timestamp: Date.now(), action: 'discard' }]);
      setHistoryIndex(0);
      
      if (enableFallback && typeof window !== 'undefined') {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(savedContent));
      }
    } catch (err) {
      console.error('[discardChanges] ❌ Failed to discard changes:', err);
      setError(getErrorMessage(err));
      
      setContent(deepClone(savedContent));
    } finally {
      setIsSyncing(false);
    }
  }, [savedContent, enableApi, enableFallback]);

  // ----------------------------------------
  // Export / Import
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
  // Context value
  // ----------------------------------------
  const contextValue = useMemo<ExtendedContentContextValue>(
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
      
      isLoading,
      error,
      isSyncing,
      clearError: () => setError(null),
      
      loadedSections,
      loadSection,
      isSectionLoading,
      
      services,
      servicesLoading,
      loadServices,
      createService: createServiceFn,
      updateService: updateServiceFn,
      deleteService: deleteServiceFn,
      reorderServices: reorderServicesFn,
      
      carBrands,
      carBrandsLoading,
      loadCarBrands,
      createBrand: createBrandFn,
      updateBrand: updateBrandFn,
      deleteBrand: deleteBrandFn,
      
      createModel: createModelFn,
      updateModel: updateModelFn,
      deleteModel: deleteModelFn,
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
      loadedSections,
      loadSection,
      isSectionLoading,
      services,
      servicesLoading,
      loadServices,
      createServiceFn,
      updateServiceFn,
      deleteServiceFn,
      reorderServicesFn,
      carBrands,
      carBrandsLoading,
      loadCarBrands,
      createBrandFn,
      updateBrandFn,
      deleteBrandFn,
      createModelFn,
      updateModelFn,
      deleteModelFn,
    ]
  );

  return (
    <ContentContext.Provider value={contextValue}>
      {children}
    </ContentContext.Provider>
  );
};

// ============================================
// CUSTOM HOOKS
// ============================================

export const useContent = (): ExtendedContentContextValue => {
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
  const { services, content } = useContent();
  return services.length > 0 ? services : content.services.items;
};

export const useService = (idOrSlug: string | number) => {
  const services = useServices();
  return services.find((service: any) => {
    if (service._id === idOrSlug || service.id === idOrSlug || service.id === String(idOrSlug)) {
      return true;
    }
    const slug = service.slug || service.title?.toLowerCase().replace(/\s+/g, '-').replace(/&/g, 'and');
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
  const { content, carBrands } = useContent();
  
  if (carBrands.length > 0) {
    const brands = carBrands.map(b => ({
      id: b._id,
      name: b.name,
      logo: b.logo,
      urlName: b.urlName,
    }));
    
    const carModels: Record<string, { name: string; type: string; image: string }[]> = {};
    carBrands.forEach(brand => {
      if (brand.models) {
        carModels[brand._id] = brand.models.map(m => ({
          name: m.name,
          type: m.type,
          image: m.image,
        }));
      }
    });

    return {
      ...content.bookingWidget,
      brands,
      carModels,
    };
  }
  
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
export type { ContentProviderProps, ExtendedContentContextValue };
export type { ContentContextValue } from '../types/content.types';