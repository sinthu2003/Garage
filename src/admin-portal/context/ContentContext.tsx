/**
 * ============================================
 * CONTENT CONTEXT (PURE API DRIVEN + ROBUST ERROR HANDLING)
 * ============================================
 * [FINAL] Removed siteContent.json dependency.
 * [FIX] Explicitly exporting types to fix index.tsx errors.
 * [FIX] 'Save after Reset' bug fixed via backend discard sync.
 * [FIX] 'No Pending Changes' 400 Error is now ignored (treated as success).
 * * @file src/context/ContentContext.tsx
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
  tokenStorage,
} from '../../services/api';

// ============================================
// IMAGE RESOLUTION LOGIC
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
// TYPES & HELPERS
// ============================================

interface HistoryEntry {
  content: SiteContent;
  timestamp: number;
  action?: string;
}

// ✅ EXPORTED to fix index.tsx error
export interface ContentProviderProps {
  children: React.ReactNode;
  initialContent?: SiteContent;
  mode?: 'public' | 'admin' | 'auto';
  enableApi?: boolean;
  enableFallback?: boolean;
}

// ✅ EXPORTED to fix index.tsx error
export interface ExtendedContentContextValue extends ContentContextValue {
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

const LOCAL_STORAGE_KEY = 'addax-cms-content';
const PREVIOUS_CONTENT_KEY = 'addax-cms-prev-content';
const HISTORY_LIMIT = 50;
const DEBOUNCE_DELAY = 5000;

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
  // Refs for tracking state without re-renders
  // ----------------------------------------
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pendingChangesRef = useRef<Map<string, { path: string; value: unknown }>>(new Map());

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
    return resolveContentImages(initialContent || {} as SiteContent);
  });
  const [savedContent, setSavedContent] = useState<SiteContent>(() => {
    return resolveContentImages(initialContent || {} as SiteContent);
  });
  const [previousSavedContent, setPreviousSavedContent] = useState<SiteContent>(() => {
    // Try to load from local storage first
    try {
      const stored = localStorage.getItem(PREVIOUS_CONTENT_KEY);
      if (stored) {
        return resolveContentImages(JSON.parse(stored));
      }
    } catch (e) {
      console.warn('Failed to load previous content:', e);
    }
    return resolveContentImages(initialContent || {} as SiteContent);
  });

  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);

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
    return JSON.stringify(content) !== JSON.stringify(savedContent);
  }, [content, savedContent]);

  // ----------------------------------------
  // INITIALIZATION
  // ----------------------------------------
  useEffect(() => {
    const initializeContent = async () => {
      if (!enableApi) {
        setIsLoading(false);
        return;
      }

      const isAdminMode = actualMode === 'admin' && tokenStorage.isAuthenticated();
      setIsLoading(true);
      setError(null);

      try {
        let fetchedContent: SiteContent;
        if (isAdminMode) {
          fetchedContent = await contentApi.getWorkingContent();
        } else {
          fetchedContent = await contentApi.getPublicContent();
        }

        const resolved = resolveContentImages(fetchedContent);
        setContent(resolved);
        setSavedContent(resolved);

        // Restore previous content from storage if available
        try {
          const storedPrev = localStorage.getItem(PREVIOUS_CONTENT_KEY);
          if (storedPrev) {
            console.log('[Init] Restored previous content from storage');
            setPreviousSavedContent(resolveContentImages(JSON.parse(storedPrev)));
          } else {
            setPreviousSavedContent(deepClone(resolved));
          }
        } catch (e) {
          console.warn('[Init] Failed to restore previous content:', e);
          setPreviousSavedContent(deepClone(resolved));
        }
        setHistory([{ content: deepClone(resolved), timestamp: Date.now(), action: 'initial' }]);
        setHistoryIndex(0);
      } catch (err) {
        console.error('[ContentContext] Initialization failed:', err);
        setError(getErrorMessage(err));

        if (enableFallback && typeof window !== 'undefined') {
          try {
            const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
            if (stored) {
              const parsed = resolveContentImages(JSON.parse(stored));
              setContent(parsed);
              setSavedContent(parsed);
            }
          } catch (localErr) {
            console.error('[ContentContext] LocalStorage fallback failed:', localErr);
          }
        }
      } finally {
        setIsLoading(false);
      }
    };

    initializeContent();
  }, [actualMode, enableApi, enableFallback]);

  // ----------------------------------------
  // SECTION LOADING
  // ----------------------------------------
  const loadSection = useCallback(async (section: keyof SiteContent) => {
    if (loadedSectionsRef.current.has(section) || loadingSectionsRef.current.has(section)) {
      return;
    }

    loadingSectionsRef.current.add(section);
    setLoadingSections(prev => new Set(prev).add(section));

    try {
      const sectionData = await contentApi.getSection(section);
      const resolvedData = resolveContentImages(sectionData);

      setContent(prev => ({
        ...prev,
        [section]: resolvedData,
      }));

      setSavedContent(prev => ({
        ...prev,
        [section]: resolvedData,
      }));

      loadedSectionsRef.current.add(section);
      setLoadedSections(prev => new Set(prev).add(section));
    } catch (err) {
      console.error(`[loadSection] Failed to load ${section}:`, err);
      setError(getErrorMessage(err));
    } finally {
      loadingSectionsRef.current.delete(section);
      setLoadingSections(prev => {
        const next = new Set(prev);
        next.delete(section);
        return next;
      });
    }
  }, []);

  const isSectionLoading = useCallback((section: keyof SiteContent) => {
    return loadingSections.has(section);
  }, [loadingSections]);

  // ----------------------------------------
  // SERVICES CRUD
  // ----------------------------------------
  const loadServices = useCallback(async () => {
    if (servicesLoadingRef.current || servicesLoadedRef.current) return;
    servicesLoadingRef.current = true;
    setServicesLoading(true);

    try {
      const result = await servicesApi.getAll({ limit: 100 });
      const resolvedServices = resolveContentImages(result.items);
      setServices(resolvedServices);
      servicesLoadedRef.current = true;
    } catch (err) {
      console.error('[loadServices] Failed:', err);
      setError(getErrorMessage(err));
      servicesLoadedRef.current = false;
    } finally {
      servicesLoadingRef.current = false;
      setServicesLoading(false);
    }
  }, []);

  const createServiceFn = useCallback(async (data: CreateServiceData): Promise<Service> => {
    const newService = await servicesApi.create(data);
    const resolvedService = resolveContentImages(newService);
    setServices(prev => [resolvedService, ...prev]);
    return resolvedService;
  }, []);

  const updateServiceFn = useCallback(async (id: string, data: UpdateServiceData): Promise<Service> => {
    const updated = await servicesApi.update(id, data);
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
  // CAR BRANDS & MODELS CRUD
  // ----------------------------------------
  const loadCarBrands = useCallback(async (includeModels = true) => {
    if (carBrandsLoadingRef.current || carBrandsLoadedRef.current) return;
    carBrandsLoadingRef.current = true;
    setCarBrandsLoading(true);

    try {
      const brands = await carDataApi.getAllBrands({ includeModels, includeInactive: true });
      const resolvedBrands = resolveContentImages(brands);
      setCarBrands(resolvedBrands);
      carBrandsLoadedRef.current = true;
    } catch (err) {
      console.error('[loadCarBrands] Failed:', err);
      setError(getErrorMessage(err));
      carBrandsLoadedRef.current = false;
    } finally {
      carBrandsLoadingRef.current = false;
      setCarBrandsLoading(false);
    }
  }, []);

  const createBrandFn = useCallback(async (data: CreateBrandData): Promise<CarBrand> => {
    const newBrand = await carDataApi.createBrand(data);
    setCarBrands(prev => [newBrand, ...prev]);
    return newBrand;
  }, []);

  const updateBrandFn = useCallback(async (id: string, data: UpdateBrandData): Promise<CarBrand> => {
    const updated = await carDataApi.updateBrand(id, data);
    const resolvedBrand = resolveContentImages(updated);
    setCarBrands(prev => prev.map(b => {
      if (b._id === id) {
        return { ...resolvedBrand, models: b.models || [] };
      }
      return b;
    }));
    return resolvedBrand;
  }, []);

  const deleteBrandFn = useCallback(async (id: string): Promise<void> => {
    await carDataApi.deleteBrand(id);
    setCarBrands(prev => prev.filter(b => b._id !== id));
  }, []);

  const createModelFn = useCallback(async (brandId: string, data: CreateModelData): Promise<CarModel> => {
    const newModel = await carDataApi.addModelToBrand(brandId, data);
    setCarBrands(prev => prev.map(b => {
      if (b._id === brandId) {
        return { ...b, models: [newModel, ...(b.models || [])] };
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
  // SYNC TO API (Strict Mode - Throws on Error)
  // ----------------------------------------
  const syncToApi = useCallback(async () => {
    if (pendingChangesRef.current.size === 0 || !tokenStorage.isAuthenticated()) return;
    setIsSyncing(true);

    const changes = Array.from(pendingChangesRef.current.entries());

    try {
      for (const [section, { path, value }] of changes) {
        console.log(`[Sync] Uploading change: ${section}.${path} =`, value);
        await contentApi.updateField(section as keyof SiteContent, { path, value });
        // Only remove if successful
        pendingChangesRef.current.delete(section);
      }
    } catch (err) {
      console.error('[Sync] ❌ Update Failed:', err);
      // RE-THROW to stop Apply Changes from committing bad data
      throw err;
    } finally {
      setIsSyncing(false);
    }
  }, []);

  // ----------------------------------------
  // SYNC FULL CONTENT TO BACKEND
  // Used after reset to create draft with restored content
  // ----------------------------------------
  const syncFullContentToBackend = useCallback(async (targetContent: SiteContent, baseContent?: SiteContent) => {
    if (!tokenStorage.isAuthenticated()) return;

    // Use provided base content OR current savedContent
    // FAILSAFE: Ensure comparisonBase is never undefined
    const comparisonBase = baseContent || savedContent || {} as SiteContent;

    if (!comparisonBase) {
      console.error('[SyncFull] Critical: No comparison base available');
      return;
    }

    console.log('[SyncFull] Syncing full content to backend...');
    setIsSyncing(true);

    try {
      let syncedCount = 0;

      // Sync each section that differs from savedContent
      for (const section of Object.keys(targetContent) as (keyof SiteContent)[]) {
        // Skip meta section as it's auto-generated
        if (section === 'meta') {
          console.log('[SyncFull] Skipping meta section');
          continue;
        }

        const targetStr = JSON.stringify(targetContent[section]);
        const savedStr = JSON.stringify(comparisonBase[section]);

        if (targetStr !== savedStr) {
          console.log(`[SyncFull] Updating section: ${section}`);
          await contentApi.updateSection(section, targetContent[section]);
          syncedCount++;
        } else {
          console.log(`[SyncFull] Skipping ${section} (no changes)`);
        }
      }

      console.log(`[SyncFull] ✅ Synced ${syncedCount} sections to backend.`);
    } catch (err) {
      console.error('[SyncFull] ❌ Failed:', err);
      throw err;
    } finally {
      setIsSyncing(false);
    }
  }, [savedContent]);

  const debouncedSync = useCallback(() => {
    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    debounceTimerRef.current = setTimeout(() => {
      // We don't await/catch here because it's background sync.
      // Real error handling happens on "Apply Changes" click.
      syncToApi().catch(err => console.warn('Background sync failed:', err));
    }, DEBOUNCE_DELAY);
  }, [syncToApi]);

  const addToHistory = useCallback((newContent: SiteContent, action?: string) => {
    setHistory((prev) => {
      const newHistory = prev.slice(0, historyIndex + 1);
      newHistory.push({ content: deepClone(newContent), timestamp: Date.now(), action });
      return newHistory.length > HISTORY_LIMIT ? newHistory.slice(1) : newHistory;
    });
    setHistoryIndex((prev) => Math.min(prev + 1, HISTORY_LIMIT - 1));
  }, [historyIndex]);

  const updateField = useCallback((section: string, path: string, value: unknown) => {
    setContent((prev) => {
      const sectionKey = section as keyof SiteContent;
      if (!prev[sectionKey]) return prev;

      const updatedSection = setNestedValue(prev[sectionKey], path, value);
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

      return newContent;
    });
  }, [addToHistory, actualMode, enableApi, debouncedSync]);

  const updateSection = useCallback((section: string, value: unknown) => {
    setContent((prev) => {
      const sectionKey = section as keyof SiteContent;
      const newContent: SiteContent = {
        ...prev,
        [sectionKey]: value as any,
        meta: { ...prev.meta, lastModified: new Date().toISOString() },
      };
      addToHistory(newContent, `Update ${section}`);

      if (actualMode === 'admin' && enableApi && tokenStorage.isAuthenticated()) {
        contentApi.updateSection(sectionKey, value as any).catch(console.error);
      }

      return newContent;
    });
  }, [addToHistory, actualMode, enableApi]);

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

  // ----------------------------------------
  // RESET (With Backend Discard)
  // ----------------------------------------
  const resetContent = useCallback(async () => {
    console.log('[resetContent] 🚀 RESET STARTED');
    setError(null);

    try {
      const restoredContent = deepClone(previousSavedContent);
      console.log('[resetContent] Restored content created');

      // Clear pending changes BEFORE setting content
      pendingChangesRef.current.clear();
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }

      console.log('[resetContent] Checking conditions - Mode:', actualMode, 'API:', enableApi, 'Auth:', tokenStorage.isAuthenticated());
      if (actualMode === 'admin' && enableApi && tokenStorage.isAuthenticated()) {
        try {
          console.log('[resetContent] 🔄 Discarding backend drafts...');
          const result = await contentApi.discardChanges();
          console.log('[resetContent] ✅ Backend synced to reset state.');

          if (!result || !result.content) {
            throw new Error('Discard API returned invalid content');
          }

          // CRITICAL FIX: Keep savedContent as published content
          // Set content to restoredContent to create unsaved changes
          const resolvedContent = resolveContentImages(result.content);
          setSavedContent(resolvedContent); // Current published content
          setContent(restoredContent); // Restored content (creates unsaved changes)

          // Immediately create draft with restored content
          console.log('[resetContent] 📝 Creating draft with restored content...');
          // PASS resolvedContent as the base to compare against (since state update is async)
          await syncFullContentToBackend(restoredContent, resolvedContent);
          console.log('[resetContent] ✅ Draft created. Click Apply Changes to publish.');
        } catch (apiErr) {
          console.warn('[resetContent] API discard failed (local reset OK):', apiErr);
          // Fallback: just set content locally
          setContent(restoredContent);
        }
      } else {
        setContent(restoredContent);
      }

      setHistory([{ content: deepClone(restoredContent), timestamp: Date.now(), action: 'reset' }]);
      setHistoryIndex(0);
    } catch (err) {
      console.error('[resetContent] Failed:', err);
      setError(getErrorMessage(err));
      setContent(deepClone(previousSavedContent));
    } finally {
      // Done
    }
  }, [previousSavedContent, actualMode, enableApi, syncFullContentToBackend]);

  // ----------------------------------------
  // APPLY CHANGES (Robust Error Handling)
  // ----------------------------------------
  const applyChanges = useCallback(async (): Promise<void> => {
    setIsSyncing(true);
    setError(null);

    try {
      // Check if there are any actual changes
      const hasChanges = JSON.stringify(content) !== JSON.stringify(savedContent);

      if (!hasChanges && pendingChangesRef.current.size === 0) {
        console.log('[Apply] ℹ️ No changes to apply.');
        setLastSaved(new Date());
        setIsSyncing(false);
        return;
      }

      // Sync pending changes
      if (pendingChangesRef.current.size > 0) {
        // If syncToApi fails, it will throw, jumping to catch block
        await syncToApi();
      } else if (hasChanges) {
        // Content changed but no pending changes (e.g., after reset)
        // Sync full content to create draft
        console.log('[Apply] Syncing full content after reset...');
        await syncFullContentToBackend(content);
      }

      if (enableApi && tokenStorage.isAuthenticated()) {
        console.log('[Apply] Committing changes...');

        try {
          const result = await contentApi.applyChanges();
          console.log('[Apply] API returned:', result);

          // If content is missing but API call succeeded, assume local content is now published
          const mergedContent = (result && result.content)
            ? { ...content, ...result.content }
            : content;
          console.log('[Apply] Merged content prepared');

          const resolved = resolveContentImages(mergedContent);
          console.log('[Apply] Content resolved, updating state...');

          setPreviousSavedContent(deepClone(savedContent));
          // Persist previous content for reload resilience
          try {
            localStorage.setItem(PREVIOUS_CONTENT_KEY, JSON.stringify(savedContent));
          } catch (e) {
            console.warn('Failed to persist previous content:', e);
          }

          setSavedContent(resolved);
          setContent(resolved);
          pendingChangesRef.current.clear();

          console.log('[Apply] ✅ Changes saved successfully.');

        } catch (apiErr: any) {
          // [CRITICAL FIX] If backend says "Nothing to do", treat as Success
          const errorMsg = apiErr.response?.data?.message || apiErr.message || '';
          if (errorMsg.includes('No pending changes')) {
            console.log('[Apply] ℹ️ Nothing to save. Treating as success.');
            setLastSaved(new Date());
            return;
          }
          throw apiErr;
        }
      }
      setLastSaved(new Date());
    } catch (err: any) {
      console.error('[Apply] ❌ Failed to save:', err);
      const msg = err.response?.data?.message || err.message || 'Unknown save error';
      setError(`Save Failed: ${msg}`);
      throw err; // Re-throw so UI can show error toast
    } finally {
      setIsSyncing(false);
    }
  }, [content, savedContent, enableApi, syncToApi, syncFullContentToBackend]);

  const discardChanges = useCallback(async (): Promise<void> => {
    setIsSyncing(true);
    try {
      if (enableApi && tokenStorage.isAuthenticated()) {
        const result = await contentApi.discardChanges();
        const resolved = resolveContentImages(result.content || savedContent);
        setContent(resolved);
        setSavedContent(resolved);
        loadedSectionsRef.current.clear();
        setLoadedSections(new Set());
      } else {
        setContent(deepClone(savedContent));
      }
      setHistory([{ content: deepClone(savedContent), timestamp: Date.now(), action: 'discard' }]);
      setHistoryIndex(0);
    } catch (err) {
      console.error('Failed to discard changes:', err);
      setError(getErrorMessage(err));
      setContent(deepClone(savedContent));
    } finally {
      setIsSyncing(false);
    }
  }, [savedContent, enableApi]);

  // ----------------------------------------
  // CONTEXT VALUE
  // ----------------------------------------
  const contextValue = useMemo<ExtendedContentContextValue>(
    () => ({
      content, updateField, updateSection, undo, redo, canUndo: historyIndex > 0, canRedo: historyIndex < history.length - 1,
      resetContent, exportContent: () => JSON.stringify(content), importContent: async (s) => { setContent(JSON.parse(s)); return true; },
      hasUnsavedChanges, lastSaved, applyChanges, discardChanges, isLoading, error, isSyncing, clearError: () => setError(null),
      loadedSections, loadSection, isSectionLoading, services, servicesLoading, loadServices, createService: createServiceFn,
      updateService: updateServiceFn, deleteService: deleteServiceFn, reorderServices: reorderServicesFn, carBrands, carBrandsLoading,
      loadCarBrands, createBrand: createBrandFn, updateBrand: updateBrandFn, deleteBrand: deleteBrandFn, createModel: createModelFn,
      updateModel: updateModelFn, deleteModel: deleteModelFn
    }),
    [content, historyIndex, history.length, hasUnsavedChanges, lastSaved, isLoading, error, isSyncing, loadedSections, loadSection, isSectionLoading, services, servicesLoading, carBrands, carBrandsLoading, createServiceFn, updateServiceFn, deleteServiceFn, reorderServicesFn, createBrandFn, updateBrandFn, deleteBrandFn, createModelFn, updateModelFn, deleteModelFn]
  );

  return <ContentContext.Provider value={contextValue}>{children}</ContentContext.Provider>;
};

// ============================================
// CUSTOM HOOKS (DEFENSIVE)
// ============================================

export const useContent = (): ExtendedContentContextValue => {
  const context = useContext(ContentContext);
  if (context === undefined) throw new Error('useContent must be used within ContentProvider');
  return context;
};

export const useSectionContent = <K extends keyof SiteContent>(section: K): SiteContent[K] => {
  const { content } = useContent();
  return content?.[section];
};

export const useBrand = () => useContent().content?.global?.brand || {};

export const useServices = () => useContent().content?.services?.items || [];

export const useService = (idOrSlug: string | number) => {
  const services = useServices();
  return services.find((service: any) => {
    if (service._id === idOrSlug || service.id === idOrSlug || service.id === String(idOrSlug)) return true;
    const slug = service.slug || service.title?.toLowerCase().replace(/\s+/g, '-').replace(/&/g, 'and');
    return slug === idOrSlug;
  });
};

export const useTestimonials = () => useContent().content?.testimonials?.items || [];

export const useFAQs = () => useContent().content?.faq?.items || [];

export const useBookingData = () => useContent().content?.bookingWidget || {};

export const useGallery = () => useContent().content?.gallery || { categories: [], images: [] };

export const usePartners = () => useContent().content?.partners || { brands: [] };

export { ContentContext };
// ✅ Re-exporting this type solves your index.tsx error
export type { ContentContextValue } from '../types/content.types';