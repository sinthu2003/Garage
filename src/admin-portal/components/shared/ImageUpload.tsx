import React, { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Upload, X, Image as ImageIcon, Link, Trash2, Eye, EyeOff, Check,
  AlertCircle, Loader2, Copy, ExternalLink, FolderOpen, RefreshCw,
  Clipboard, Info, Download, Maximize2, HardDrive, Cloud,
} from 'lucide-react';
import { mediaApi } from '../../../services/api';

// ============================================
// LOCAL STORAGE UTILITY
// ============================================
const STORAGE_KEY = 'uploaded_images_cache';
const MAX_STORAGE_ITEMS = 50;

interface StoredImage {
  id: string;
  url: string;
  name: string;
  size: number;
  timestamp: number;
}

const saveToLocalStorage = (imageData: { url: string; name?: string; size?: number }): string => {
  try {
    const stored = getFromLocalStorage();
    const id = `img_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const newImage: StoredImage = {
      id,
      url: imageData.url,
      name: imageData.name || 'Uploaded Image',
      size: imageData.size || 0,
      timestamp: Date.now(),
    };
    stored.unshift(newImage);
    if (stored.length > MAX_STORAGE_ITEMS) stored.pop();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stored));
    console.log('Image saved to localStorage:', id);
    return id;
  } catch (error) {
    console.error('Failed to save to localStorage:', error);
    return '';
  }
};

const getFromLocalStorage = (): StoredImage[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

const removeFromLocalStorage = (id: string): void => {
  try {
    const stored = getFromLocalStorage();
    const filtered = stored.filter((img) => img.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  } catch (error) {
    console.error('Failed to remove from localStorage:', error);
  }
};

const clearLocalStorage = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear localStorage:', error);
  }
};

// ============================================
// AUTO-DETECT FOLDER FROM LABEL
// ============================================
const detectFolderFromLabel = (label?: string): string => {
  if (!label) return 'general';
  
  const labelLower = label.toLowerCase();

  const folderMap: [string, string][] = [
    ['brand logo', 'booking-widget/brands'],
    ['model image', 'booking-widget/models'],
    ['footer logo', 'logo'],
    ['logo', 'logo'],
    ['hero', 'hero'],
    ['background', 'hero'],
    ['banner', 'hero'],
    ['slide', 'hero'],
    ['before', 'before-after'],
    ['after', 'before-after'],
    ['transformation', 'before-after'],
    ['pricing image', 'pricing'],
    ['pricing', 'pricing'],
    ['price', 'pricing'],
    ['step image', 'how-it-works'],
    ['how it works', 'how-it-works'],
    ['process', 'how-it-works'],
    ['service image', 'services'],
    ['service icon', 'services'],
    ['service', 'services'],
    ['gallery', 'gallery'],
    ['testimonial', 'testimonials'],
    ['review', 'testimonials'],
    ['customer', 'testimonials'],
    ['team', 'team'],
    ['member', 'team'],
    ['employee', 'team'],
    ['staff', 'team'],
    ['about', 'about'],
    ['profile', 'about'],
    ['company', 'about'],
    ['why choose', 'why-choose'],
    ['why us', 'why-choose'],
    ['feature', 'features'],
    ['benefit', 'features'],
    ['contact', 'contact'],
    ['icon', 'icons'],
    ['faq', 'faq'],
    ['stat', 'stats'],
    ['counter', 'stats'],
  ];
  
  for (const [pattern, folder] of folderMap) {
    if (labelLower.includes(pattern)) {
      return folder;
    }
  }
  
  return 'general';
};

// ============================================
// S3 CHECK AND UPLOAD UTILITY
// ============================================
const isS3Url = (url: string): boolean => {
  return url.includes('amazonaws.com') || url.includes('s3.') || url.includes('.s3-');
};

const uploadToS3 = async (file: File, folder?: string): Promise<string> => {
  try {
    console.log('=== Uploading to S3 ===');
    console.log('File:', file.name, 'Type:', file.type, 'Size:', formatFileSize(file.size));
    console.log('Folder:', folder || 'general');
    const result = await mediaApi.upload(file, folder);
    console.log('S3 Upload successful:', result.url);
    console.log('========================');
    return result.url;
  } catch (error) {
    console.error('S3 Upload failed:', error);
    throw error;
  }
};

const extractFilenameFromUrl = (url: string): string => {
  try {
    const cleanUrl = url.split('?')[0].split('#')[0];
    const segments = cleanUrl.split('/');
    const lastSegment = segments[segments.length - 1];
    if (lastSegment && lastSegment.includes('.')) {
      return lastSegment.split('.')[0];
    }
    return '';
  } catch {
    return '';
  }
};

// ✅ CRITICAL FIX: Track uploads in progress globally
const uploadsInProgress = new Set<string>();

const ensureImageInS3 = async (
  url: string, 
  folder: string,
  progressCallback?: (message: string) => void
): Promise<string> => {
  // Already S3
  if (isS3Url(url)) {
    console.log('[S3] Already in S3:', url);
    return url;
  }

  // Data URL
  if (url.startsWith('data:')) {
    console.log('[S3] Data URL detected, skipping');
    return url;
  }

  // ✅ FIX: Check if this URL is currently being uploaded
  if (uploadsInProgress.has(url)) {
    console.log('[S3] Upload already in progress for:', url);
    return url; // Return original URL, don't trigger duplicate
  }

  const isValidUrl = url.startsWith('http://') || url.startsWith('https://');
  const isFilePath = url.startsWith('file://') || url.startsWith('/') || 
                     url.startsWith('./') || url.startsWith('../') || 
                     url.match(/^[A-Za-z]:[\\/]/);
  
  if (!isValidUrl && !isFilePath) {
    console.log('[S3] Not a valid URL or file path:', url);
    return url;
  }

  try {
    // ✅ Mark this URL as being uploaded
    uploadsInProgress.add(url);
    
    let fetchUrl = url;
    
    if (isFilePath) {
      if (url.startsWith('/') && !url.startsWith('//')) {
        fetchUrl = `${window.location.origin}${url}`;
      } else if (url.startsWith('./') || url.startsWith('../')) {
        fetchUrl = new URL(url, window.location.href).href;
      } else if (url.startsWith('file://')) {
        fetchUrl = url;
      } else if (url.match(/^[A-Za-z]:[\\/]/)) {
        fetchUrl = `file:///${url.replace(/\\/g, '/')}`;
      }
      progressCallback?.('Reading local file...');
    } else {
      progressCallback?.('Downloading image...');
    }
    
    const response = await fetch(fetchUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch: ${response.status}`);
    }

    const blob = await response.blob();
    
    if (!blob.type.startsWith('image/')) {
      throw new Error('Not a valid image');
    }

    const originalName = extractFilenameFromUrl(url);
    const extension = blob.type.split('/')[1] || 'jpg';
    
    let fileName: string;
    if (originalName) {
      fileName = `${originalName}.${extension}`;
    } else if (isFilePath) {
      fileName = `uploaded-${Date.now()}.${extension}`;
    } else {
      fileName = `external-${Date.now()}.${extension}`;
    }
    
    const file = new File([blob], fileName, { type: blob.type });

    progressCallback?.('Uploading to S3...');

    const s3Url = await uploadToS3(file, folder);

    console.log('[S3] ✅ Auto-uploaded:', {
      original: url,
      fileName,
      type: isFilePath ? 'local file' : 'external URL',
      s3: s3Url,
      folder
    });

    return s3Url;
  } catch (error) {
    console.error('[S3] Auto-upload failed:', error);
    return url;
  } finally {
    // ✅ Always remove from in-progress set
    uploadsInProgress.delete(url);
  }
};

const deleteFromS3 = async (url: string): Promise<void> => {
  try {
    const key = url.includes('amazonaws.com') ? url.split('.com/')[1] : url;
    await mediaApi.delete(key);
    console.log('Deleted from S3:', key);
  } catch (error) {
    console.error('Failed to delete from S3:', error);
    throw error;
  }
};

// ============================================
// IMAGE COMPRESSION UTILITY
// ============================================
interface CompressionResult {
  blob: Blob;
  url: string;
  originalSize: number;
  compressedSize: number;
  width: number;
  height: number;
  format: string;
}

interface CompressionOptions {
  maxSizeMB: number;
  maxWidthOrHeight: number;
  quality: number;
  convertToWebP: boolean;
}

const defaultCompressionOptions: CompressionOptions = {
  maxSizeMB: 2,
  maxWidthOrHeight: 1920,
  quality: 0.85,
  convertToWebP: false,
};

const compressImage = async (
  file: File,
  options: Partial<CompressionOptions> = {}
): Promise<CompressionResult> => {
  const opts = { ...defaultCompressionOptions, ...options };
  const originalSize = file.size;

  return new Promise((resolve, reject) => {
    const img = new Image();
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    img.onload = () => {
      let { width, height } = img;
      if (width > opts.maxWidthOrHeight || height > opts.maxWidthOrHeight) {
        const ratio = Math.min(opts.maxWidthOrHeight / width, opts.maxWidthOrHeight / height);
        width = Math.round(width * ratio);
        height = Math.round(height * ratio);
      }
      canvas.width = width;
      canvas.height = height;
      
      if (!ctx) {
        reject(new Error('Could not get canvas context'));
        return;
      }
      
      // ✅ CRITICAL FIX: Detect formats that support transparency
      const supportsTransparency = file.type === 'image/png' || 
                                   file.type === 'image/webp' || 
                                   file.type === 'image/avif' ||
                                   file.type === 'image/gif';
      
      // ✅ FIX: Preserve transparency for PNG/AVIF/WebP/GIF
      if (supportsTransparency) {
        ctx.clearRect(0, 0, width, height);
      } else {
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, width, height);
      }
      
      ctx.drawImage(img, 0, 0, width, height);

      // ✅ CRITICAL FIX: Preserve original format for transparency-supporting formats
      let outputFormat: string;
      let formatName: string;
      
      if (file.type === 'image/avif') {
        // Keep AVIF as AVIF (best compression with transparency)
        outputFormat = 'image/avif';
        formatName = 'avif';
      } else if (file.type === 'image/png') {
        // Keep PNG as PNG (transparency)
        outputFormat = 'image/png';
        formatName = 'png';
      } else if (file.type === 'image/webp') {
        // Keep WebP as WebP
        outputFormat = 'image/webp';
        formatName = 'webp';
      } else if (file.type === 'image/gif') {
        // Convert GIF to PNG to preserve transparency
        outputFormat = 'image/png';
        formatName = 'png';
      } else {
        // For JPEG and others, use compression options
        outputFormat = opts.convertToWebP ? 'image/webp' : 'image/jpeg';
        formatName = opts.convertToWebP ? 'webp' : 'jpeg';
      }

      console.log(`[ImageUpload] 🎨 Processing: ${file.name} (${file.type}) → ${outputFormat}`);

      const compress = (quality: number): Promise<Blob> => {
        return new Promise((res, rej) => {
          canvas.toBlob(
            (blob) => {
              if (blob) res(blob);
              else rej(new Error('Compression failed'));
            },
            outputFormat,
            supportsTransparency ? undefined : quality
          );
        });
      };

      const compressToSize = async (): Promise<Blob> => {
        // ✅ For transparency formats, skip quality-based compression
        if (supportsTransparency) {
          console.log(`[ImageUpload] ✨ ${formatName.toUpperCase()} detected - preserving transparency`);
          return await compress(1.0);
        }
        
        // For JPEG/WebP without transparency, use quality-based compression
        let quality = opts.quality;
        let blob = await compress(quality);
        let iterations = 0;
        const maxIterations = 10;
        
        while (blob.size > opts.maxSizeMB * 1024 * 1024 && iterations < maxIterations) {
          quality -= 0.1;
          if (quality < 0.1) quality = 0.1;
          blob = await compress(quality);
          iterations++;
        }
        
        return blob;
      };

      compressToSize()
        .then((blob) => {
          const url = URL.createObjectURL(blob);
          const savings = originalSize > blob.size 
            ? Math.round((1 - blob.size / originalSize) * 100) 
            : 0;
          
          console.log(`[ImageUpload] ✅ Compressed: ${formatFileSize(originalSize)} → ${formatFileSize(blob.size)} (${savings}% saved)`);
          
          resolve({
            blob,
            url,
            originalSize,
            compressedSize: blob.size,
            width,
            height,
            format: formatName,
          });
        })
        .catch(reject);
    };

    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = URL.createObjectURL(file);
  });
};

const blobToBase64 = (blob: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// ============================================
// TYPES
// ============================================
export interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  onImageData?: (data: { url: string; file?: File; compressed?: CompressionResult }) => void;
  altText?: string;
  onAltChange?: (alt: string) => void;
  placeholder?: string;
  label?: string;
  helperText?: string;
  showPreviewDefault?: boolean;
  maxSizeMB?: number;
  maxWidthOrHeight?: number;
  compressionQuality?: number;
  convertToWebP?: boolean;
  aspectRatio?: string;
  previewHeight?: string;
  enableDragDrop?: boolean;
  enableUrlInput?: boolean;
  enableFileUpload?: boolean;
  enablePaste?: boolean;
  saveToStorage?: boolean;
  uploadToCloud?: boolean;
  cloudFolder?: string;
  onUpload?: (file: File, compressed: CompressionResult) => Promise<string>;
  showAltInput?: boolean;
  showImageInfo?: boolean;
  disabled?: boolean;
  error?: string;
  className?: string;
  compact?: boolean;
  autoUploadExternalUrls?: boolean;
}

type UploadMode = 'url' | 'file';
type UploadStatus = 'idle' | 'compressing' | 'uploading' | 'success' | 'error';

interface ImageInfo {
  width: number;
  height: number;
  size: number;
  originalSize?: number;
  format?: string;
}

// ============================================
// IMAGE UPLOAD COMPONENT
// ============================================
export const ImageUpload: React.FC<ImageUploadProps> = ({
  value,
  onChange,
  onImageData,
  altText = '',
  onAltChange,
  placeholder = 'Enter image URL or upload a file',
  label,
  helperText,
  showPreviewDefault = false,
  maxSizeMB = 2,
  maxWidthOrHeight = 1920,
  compressionQuality = 0.85,
  convertToWebP = false,
  aspectRatio,
  previewHeight = 'h-40',
  enableDragDrop = true,
  enableUrlInput = true,
  enableFileUpload = true,
  enablePaste = true,
  saveToStorage = true,
  uploadToCloud = true,
  cloudFolder: cloudFolderProp,
  onUpload,
  showAltInput = false,
  showImageInfo = true,
  disabled = false,
  error,
  className = '',
  compact = false,
  autoUploadExternalUrls = true,
}) => {
  const [mode, setMode] = useState<UploadMode>('url');
  const [showPreview, setShowPreview] = useState(showPreviewDefault);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<UploadStatus>('idle');
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [imageError, setImageError] = useState(false);
  const [imageInfo, setImageInfo] = useState<ImageInfo | null>(null);
  const [compressionProgress, setCompressionProgress] = useState<string>('');
  const [showFullscreen, setShowFullscreen] = useState(false);
  const [processedUrls, setProcessedUrls] = useState<Set<string>>(new Set());
  const [, setCompressionResult] = useState<{
    originalSize: number;
    compressedSize: number;
    savings: number;
  } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const autoUploadTimeoutRef = useRef<number | null>(null);

  const inputClass = `w-full px-3 py-2.5 rounded-xl text-sm transition-all bg-secondary border text-foreground placeholder-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 ${
    disabled ? 'opacity-50 cursor-not-allowed' : ''
  } ${error ? 'border-destructive' : 'border-border'}`;

  // Paste handler
  useEffect(() => {
    if (!enablePaste || disabled) return;
    const handlePaste = async (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;
      for (const item of items) {
        if (item.type.startsWith('image/')) {
          e.preventDefault();
          const file = item.getAsFile();
          if (file) await handleFileSelect(file);
          break;
        }
      }
    };
    const container = containerRef.current;
    if (container) {
      container.addEventListener('paste', handlePaste);
      return () => container.removeEventListener('paste', handlePaste);
    }
  }, [enablePaste, disabled]);

  // Load image info
  useEffect(() => {
    if (!value || !showImageInfo) {
      setImageInfo(null);
      return;
    }
    const img = new Image();
    img.onload = () => {
      setImageInfo((prev) => ({
        ...prev,
        width: img.naturalWidth,
        height: img.naturalHeight,
        size: prev?.size || 0,
        originalSize: prev?.originalSize,
        format: prev?.format,
      }));
    };
    img.onerror = () => {
      console.error('[ImageUpload] Failed to load image:', value);
      setImageError(true);
    };
    img.src = value;
  }, [value, showImageInfo]);

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    onChange(url);
    setImageError(false);
    setUploadError(null);
    setImageInfo(null);
  };

  // ✅ CRITICAL FIX: Improved auto-upload with proper duplicate prevention
  useEffect(() => {
    if (autoUploadTimeoutRef.current) {
      window.clearTimeout(autoUploadTimeoutRef.current);
    }

    if (!uploadToCloud || !autoUploadExternalUrls || !value || !value.trim()) {
      return;
    }
    
    // Already S3
    if (isS3Url(value)) {
      return;
    }
    
    // ✅ FIX: Check if already processed
    if (processedUrls.has(value)) {
      console.log('[AutoUpload] Already processed:', value);
      return;
    }
    
    // ✅ FIX: Check if upload in progress globally
    if (uploadsInProgress.has(value)) {
      console.log('[AutoUpload] Upload in progress:', value);
      return;
    }
    
    // ✅ FIX: Check component-level upload status
    if (uploadStatus === 'uploading' || uploadStatus === 'compressing') {
      return;
    }
    
    // Data URL
    if (value.startsWith('data:')) {
      return;
    }

    const isExternalUrl = value.startsWith('http://') || value.startsWith('https://');
    const isFilePath = value.startsWith('file://') || value.startsWith('/') || 
                       value.startsWith('./') || value.startsWith('../') || 
                       value.match(/^[A-Za-z]:[\\/]/);
    
    if (!isExternalUrl && !isFilePath) {
      return;
    }

    autoUploadTimeoutRef.current = window.setTimeout(() => {
      handleAutoUploadToS3(value);
    }, 1000);

    return () => {
      if (autoUploadTimeoutRef.current) {
        window.clearTimeout(autoUploadTimeoutRef.current);
      }
    };
  }, [value, uploadToCloud, autoUploadExternalUrls, processedUrls, uploadStatus]);

  const handleAutoUploadToS3 = async (urlToUpload: string) => {
    if (!urlToUpload || !urlToUpload.trim() || isS3Url(urlToUpload)) {
      return;
    }
    
    // ✅ Check all duplicate conditions
    if (processedUrls.has(urlToUpload) || uploadsInProgress.has(urlToUpload)) {
      return;
    }
    
    if (uploadStatus === 'uploading' || uploadStatus === 'compressing') {
      return;
    }

    setUploadError(null);
    setUploadStatus('uploading');

    try {
      const cloudFolder = cloudFolderProp || detectFolderFromLabel(label);
      
      const s3Url = await ensureImageInS3(
        urlToUpload, 
        cloudFolder,
        (message) => setCompressionProgress(message)
      );

      if (s3Url !== urlToUpload && isS3Url(s3Url)) {
        // ✅ Mark as processed BEFORE calling onChange
        setProcessedUrls(prev => new Set(prev).add(urlToUpload));
        
        onChange(s3Url);
        setUploadStatus('success');
        
        console.log('[AutoUpload] ✅ Success:', {
          original: urlToUpload,
          s3: s3Url,
          folder: cloudFolder
        });

        setTimeout(() => {
          setUploadStatus('idle');
        }, 3000);
      } else {
        setUploadStatus('idle');
      }
      
      setCompressionProgress('');
    } catch (err) {
      console.error('[AutoUpload] Failed:', err);
      if (err instanceof TypeError && err.message.includes('fetch')) {
        console.log('[AutoUpload] CORS issue - keeping original');
      } else {
        setUploadError(err instanceof Error ? err.message : 'Auto-upload failed');
        setUploadStatus('error');
      }
      setCompressionProgress('');
    }
  };

  const handleFileSelect = useCallback(
    async (file: File) => {
      if (!file.type.startsWith('image/')) {
        setUploadError('Please select an image file');
        return;
      }
      setUploadError(null);
      setUploadStatus('compressing');
      setCompressionProgress('Analyzing image...');

      try {
        const originalSize = file.size;
        const needsCompression = originalSize > maxSizeMB * 1024 * 1024;
        setCompressionProgress(
          needsCompression
            ? `Compressing ${formatFileSize(originalSize)} image...`
            : 'Processing image...'
        );

        const compressed = await compressImage(file, {
          maxSizeMB,
          maxWidthOrHeight,
          quality: compressionQuality,
          convertToWebP,
        });

        setCompressionProgress('');
        setUploadStatus('uploading');
        setImageInfo({
          width: compressed.width,
          height: compressed.height,
          size: compressed.compressedSize,
          originalSize,
          format: compressed.format,
        });

        let finalUrl = compressed.url;

        if (onUpload) {
          finalUrl = await onUpload(file, compressed);
        } else if (uploadToCloud) {
          setCompressionProgress('Uploading to cloud...');
          const cloudFolder = cloudFolderProp || detectFolderFromLabel(label);
          const compressedFile = new File(
            [compressed.blob],
            file.name.replace(/\.[^/.]+$/, `.${compressed.format}`),
            { type: `image/${compressed.format}` }
          );
          finalUrl = await uploadToS3(compressedFile, cloudFolder);
        } else if (saveToStorage) {
          const base64 = await blobToBase64(compressed.blob);
          saveToLocalStorage({
            url: base64,
            name: file.name,
            size: compressed.compressedSize,
          });
          finalUrl = base64;
        }

        onChange(finalUrl);
        onImageData?.({ url: finalUrl, file, compressed });
        setUploadStatus('success');
        setCompressionProgress('');

        const savings = Math.round((1 - compressed.compressedSize / originalSize) * 100);
        setCompressionResult({
          originalSize,
          compressedSize: compressed.compressedSize,
          savings: savings > 0 ? savings : 0,
        });

        setTimeout(() => {
          setUploadStatus('idle');
          setCompressionResult(null);
        }, 5000);
      } catch (err) {
        console.error('Image processing error:', err);
        setUploadError(err instanceof Error ? err.message : 'Processing failed');
        setUploadStatus('error');
        setCompressionProgress('');
      }
    },
    [maxSizeMB, maxWidthOrHeight, compressionQuality, convertToWebP, onChange, onUpload, onImageData, saveToStorage, uploadToCloud, cloudFolderProp, label]
  );

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFileSelect(file);
    if (e.target) e.target.value = '';
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled && enableDragDrop) setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (disabled || !enableDragDrop) return;
    const file = e.dataTransfer.files?.[0];
    if (file) handleFileSelect(file);
  };

  const handleClear = useCallback(() => {
    onChange('');
    if (onAltChange) onAltChange('');
    setImageError(false);
    setUploadError(null);
    setImageInfo(null);
    setCompressionResult(null);
    setShowPreview(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  }, [onChange, onAltChange]);

  const handleCopyUrl = async () => {
    if (value) await navigator.clipboard.writeText(value);
  };

  const handleOpenExternal = () => {
    if (value) window.open(value, '_blank');
  };

  const handleDownload = () => {
    if (value) {
      const link = document.createElement('a');
      link.href = value;
      link.download = `image-${Date.now()}.${imageInfo?.format || 'jpg'}`;
      link.click();
    }
  };

  const hasImage = value && value.trim() !== '';
  const detectedFolder = cloudFolderProp || detectFolderFromLabel(label);

  return (
    <div ref={containerRef} className={`space-y-2 ${className}`} tabIndex={0}>
      {/* Label */}
      {label && (
        <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
          <ImageIcon className="w-4 h-4" />
          {label}
        </label>
      )}

      {/* Mode Tabs */}
      {enableUrlInput && enableFileUpload && !compact && (
        <div className="flex items-center justify-between">
          <div className="flex gap-1 p-1 bg-secondary/50 rounded-lg">
            <button
              type="button"
              onClick={() => setMode('url')}
              disabled={disabled}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                mode === 'url'
                  ? 'bg-card text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Link className="w-3 h-3 inline mr-1.5" />
              URL
            </button>
            <button
              type="button"
              onClick={() => setMode('file')}
              disabled={disabled}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                mode === 'file'
                  ? 'bg-card text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Upload className="w-3 h-3 inline mr-1.5" />
              Upload
            </button>
          </div>
          <div className="flex items-center gap-2">
            {uploadToCloud && (
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <Cloud className="w-3 h-3 text-blue-500" />
                <span className="hidden sm:inline">{detectedFolder}</span>
              </span>
            )}
            {autoUploadExternalUrls && uploadToCloud && (
              <span className="text-xs text-green-600 dark:text-green-400 flex items-center gap-1">
                <RefreshCw className="w-3 h-3" />
                Auto S3
              </span>
            )}
            {saveToStorage && !uploadToCloud && (
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <HardDrive className="w-3 h-3" />
                Auto-save
              </span>
            )}
            {enablePaste && (
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <Clipboard className="w-3 h-3" />
                Ctrl+V
              </span>
            )}
          </div>
        </div>
      )}

      {/* URL Input Mode */}
      {(mode === 'url' || !enableFileUpload) && enableUrlInput && (
        <div className="space-y-2">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                value={value}
                onChange={handleUrlChange}
                placeholder={placeholder}
                disabled={disabled}
                className={`${inputClass} ${value ? 'pr-20' : 'pr-3'}`}
              />
              {value && (
                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                  {hasImage && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setShowPreview(!showPreview);
                      }}
                      className="p-1.5 rounded-lg hover:bg-secondary text-muted-foreground"
                      title={showPreview ? 'Hide preview' : 'Show preview'}
                    >
                      {showPreview ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleClear();
                    }}
                    disabled={disabled}
                    className="p-1.5 rounded-lg hover:bg-destructive/10 text-destructive"
                    title="Clear URL"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
            {enableFileUpload && (
              <>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileInputChange}
                  disabled={disabled}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={disabled}
                  className="px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl text-sm font-medium transition-all bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 whitespace-nowrap"
                  title="Choose file from computer"
                >
                  <FolderOpen className="w-4 h-4" />
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* File Upload Mode */}
      {(mode === 'file' || !enableUrlInput) && enableFileUpload && (
        <div
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          className={`relative border-2 border-dashed rounded-xl transition-all ${
            isDragging
              ? 'border-primary bg-primary/5'
              : error
              ? 'border-destructive bg-destructive/5'
              : 'border-border hover:border-primary/50'
          } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
        >
          {mode === 'file' && (
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileInputChange}
              disabled={disabled}
              className="hidden"
            />
          )}

          {hasImage && !imageError ? (
            <div className="relative group">
              <img
                src={value}
                alt={altText || 'Preview'}
                className={`w-full ${previewHeight} object-cover rounded-xl`}
                style={aspectRatio ? { aspectRatio } : undefined}
                onError={() => setImageError(true)}
              />

              {/* Overlay Controls */}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={disabled}
                  className="p-2 rounded-lg bg-white/20 hover:bg-white/30 text-white"
                  title="Replace image"
                >
                  <RefreshCw className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  onClick={() => setShowFullscreen(true)}
                  className="p-2 rounded-lg bg-white/20 hover:bg-white/30 text-white"
                  title="View fullscreen"
                >
                  <Maximize2 className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  onClick={handleCopyUrl}
                  className="p-2 rounded-lg bg-white/20 hover:bg-white/30 text-white"
                  title="Copy URL"
                >
                  <Copy className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  onClick={handleDownload}
                  className="p-2 rounded-lg bg-white/20 hover:bg-white/30 text-white"
                  title="Download"
                >
                  <Download className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  onClick={handleClear}
                  disabled={disabled}
                  className="p-2 rounded-lg bg-red-500/80 hover:bg-red-500 text-white"
                  title="Remove image"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>

              {/* Image Info Badge */}
              {showImageInfo && imageInfo && (
                <div className="absolute bottom-2 left-2 px-2 py-1 bg-black/60 backdrop-blur-sm rounded-lg text-white text-xs flex items-center gap-2">
                  <span>{imageInfo.width} × {imageInfo.height}</span>
                  <span>•</span>
                  <span>{formatFileSize(imageInfo.size)}</span>
                  {imageInfo.format && (
                    <>
                      <span>•</span>
                      <span className="uppercase">{imageInfo.format}</span>
                    </>
                  )}
                </div>
              )}

              {/* Cloud indicator */}
              {value && isS3Url(value) && (
                <div className="absolute top-2 right-2 px-2 py-1 bg-blue-500/80 backdrop-blur-sm rounded-lg text-white text-xs flex items-center gap-1">
                  <Cloud className="w-3 h-3" />
                  S3
                </div>
              )}
            </div>
          ) : (
            <div
              onClick={() => !disabled && fileInputRef.current?.click()}
              className={`p-8 text-center ${disabled ? '' : 'cursor-pointer'}`}
            >
              {uploadStatus === 'compressing' || uploadStatus === 'uploading' ? (
                <div className="space-y-3">
                  <Loader2 className="w-10 h-10 mx-auto text-primary animate-spin" />
                  <p className="text-sm text-muted-foreground">
                    {compressionProgress || (uploadToCloud ? 'Uploading to cloud...' : 'Processing...')}
                  </p>
                </div>
              ) : uploadStatus === 'error' ? (
                <div className="space-y-3">
                  <AlertCircle className="w-10 h-10 mx-auto text-destructive" />
                  <p className="text-sm text-destructive">{uploadError}</p>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setUploadStatus('idle');
                      setUploadError(null);
                    }}
                    className="text-xs text-primary hover:underline"
                  >
                    Try again
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {uploadToCloud ? (
                    <Cloud className="w-10 h-10 mx-auto text-blue-500" />
                  ) : (
                    <Upload className="w-10 h-10 mx-auto text-muted-foreground" />
                  )}
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {isDragging ? 'Drop image here' : 'Click to upload or drag & drop'}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      PNG, JPG, AVIF, WebP up to {maxSizeMB}MB
                      {uploadToCloud && ` • Folder: ${detectedFolder}`}
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* URL Mode Preview */}
      {mode === 'url' && showPreview && hasImage && !imageError && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="relative group"
        >
          <img
            src={value}
            alt={altText || 'Preview'}
            className={`w-full ${previewHeight} object-cover rounded-xl border border-border`}
            style={aspectRatio ? { aspectRatio } : undefined}
            onError={() => setImageError(true)}
          />
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => setShowFullscreen(true)}
              className="p-2 rounded-lg bg-white/20 hover:bg-white/30 text-white"
              title="View fullscreen"
            >
              <Maximize2 className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={handleCopyUrl}
              className="p-2 rounded-lg bg-white/20 hover:bg-white/30 text-white"
              title="Copy URL"
            >
              <Copy className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={handleOpenExternal}
              className="p-2 rounded-lg bg-white/20 hover:bg-white/30 text-white"
              title="Open in new tab"
            >
              <ExternalLink className="w-5 h-5" />
            </button>
          </div>
          {showImageInfo && imageInfo && (
            <div className="absolute bottom-2 left-2 px-2 py-1 bg-black/60 backdrop-blur-sm rounded-lg text-white text-xs flex items-center gap-2">
              <span>{imageInfo.width} × {imageInfo.height}</span>
            </div>
          )}
          {isS3Url(value) && (
            <div className="absolute top-2 right-2 px-2 py-1 bg-blue-500/80 backdrop-blur-sm rounded-lg text-white text-xs flex items-center gap-1">
              <Cloud className="w-3 h-3" />
              S3
            </div>
          )}
        </motion.div>
      )}

      {/* Alt Text Input */}
      {showAltInput && (
        <div className="space-y-1">
          <label className="text-xs font-medium text-muted-foreground">Alt Text</label>
          <input
            type="text"
            value={altText}
            onChange={(e) => onAltChange?.(e.target.value)}
            placeholder="Describe the image for accessibility"
            disabled={disabled}
            className={inputClass}
          />
        </div>
      )}

      {/* Helper Text */}
      {helperText && (
        <p className="text-xs text-muted-foreground flex items-center gap-1">
          <Info className="w-3 h-3" />
          {helperText}
        </p>
      )}

      {/* Compression/Upload progress */}
      {compressionProgress && (
        <p className="text-xs text-blue-500 flex items-center gap-1">
          <Loader2 className="w-3 h-3 animate-spin" />
          {compressionProgress}
        </p>
      )}

      {/* Error Message */}
      {(error || uploadError) && (
        <p className="text-xs text-destructive flex items-center gap-1">
          <AlertCircle className="w-3 h-3" />
          {error || uploadError}
        </p>
      )}

      {/* Image Load Error */}
      {imageError && hasImage && (
        <p className="text-xs text-destructive flex items-center gap-1">
          <AlertCircle className="w-3 h-3" />
          Failed to load image. Check the URL is correct.
        </p>
      )}

      {/* Success indicator */}
      {uploadStatus === 'success' && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="text-xs text-green-600 flex items-center gap-1"
        >
          <Check className="w-3 h-3" />
          {uploadToCloud ? `Uploaded to ${detectedFolder} successfully!` : 'Image processed successfully!'}
        </motion.div>
      )}

      {/* Fullscreen Modal */}
      <AnimatePresence>
        {showFullscreen && hasImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
            onClick={() => setShowFullscreen(false)}
          >
            <button
              className="absolute top-4 right-4 p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white"
              onClick={() => setShowFullscreen(false)}
            >
              <X className="w-6 h-6" />
            </button>
            <img
              src={value}
              alt={altText || 'Fullscreen preview'}
              className="max-w-full max-h-full object-contain rounded-lg"
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ============================================
// EXPORTS
// ============================================
export {
  compressImage,
  formatFileSize,
  saveToLocalStorage,
  getFromLocalStorage,
  removeFromLocalStorage,
  clearLocalStorage,
  uploadToS3,
  deleteFromS3,
  detectFolderFromLabel,
  isS3Url,
  ensureImageInS3,
};
export type { CompressionResult, CompressionOptions, StoredImage };
export default ImageUpload;