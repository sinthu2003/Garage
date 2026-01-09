import React, { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Upload,
  X,
  Image as ImageIcon,
  Link,
  Trash2,
  Eye,
  EyeOff,
  Check,
  AlertCircle,
  Loader2,
  Copy,
  ExternalLink,
  FolderOpen,
  RefreshCw,
  Clipboard,
  Info,
  Download,
  Maximize2,
  HardDrive,
} from 'lucide-react';

// ============================================
// LOCAL STORAGE UTILITY
// ============================================
const STORAGE_KEY = 'uploaded_images_cache';
const MAX_STORAGE_ITEMS = 50; // Limit stored images

interface StoredImage {
  id: string;
  url: string;
  name: string;
  size: number;
  timestamp: number;
}

/**
 * Save image to localStorage
 */
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
    
    // Add new image and limit storage
    stored.unshift(newImage);
    if (stored.length > MAX_STORAGE_ITEMS) {
      stored.pop();
    }
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stored));
    console.log('Image saved to localStorage:', id);
    return id;
  } catch (error) {
    console.error('Failed to save to localStorage:', error);
    return '';
  }
};

/**
 * Get all images from localStorage
 */
const getFromLocalStorage = (): StoredImage[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

/**
 * Remove image from localStorage
 */
const removeFromLocalStorage = (id: string): void => {
  try {
    const stored = getFromLocalStorage();
    const filtered = stored.filter((img) => img.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  } catch (error) {
    console.error('Failed to remove from localStorage:', error);
  }
};

/**
 * Clear all images from localStorage
 */
const clearLocalStorage = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear localStorage:', error);
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

/**
 * Compress and optionally resize an image
 */
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

      // Calculate new dimensions if needed
      if (width > opts.maxWidthOrHeight || height > opts.maxWidthOrHeight) {
        const ratio = Math.min(
          opts.maxWidthOrHeight / width,
          opts.maxWidthOrHeight / height
        );
        width = Math.round(width * ratio);
        height = Math.round(height * ratio);
      }

      canvas.width = width;
      canvas.height = height;

      if (!ctx) {
        reject(new Error('Could not get canvas context'));
        return;
      }

      // Draw image on canvas
      ctx.drawImage(img, 0, 0, width, height);

      // Determine output format
      const outputFormat = opts.convertToWebP ? 'image/webp' : 'image/jpeg';
      const formatName = opts.convertToWebP ? 'webp' : 'jpeg';

      // Compress with quality adjustment
      const compress = (quality: number): Promise<Blob> => {
        return new Promise((res) => {
          canvas.toBlob(
            (blob) => {
              if (blob) res(blob);
              else reject(new Error('Compression failed'));
            },
            outputFormat,
            quality
          );
        });
      };

      // Iteratively reduce quality if still too large
      const compressToSize = async (): Promise<Blob> => {
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

/**
 * Convert blob to base64 for localStorage
 */
const blobToBase64 = (blob: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

/**
 * Format file size for display
 */
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
  /** Current image URL */
  value: string;
  /** Callback when image changes */
  onChange: (url: string) => void;
  /** Optional callback with full image data */
  onImageData?: (data: { url: string; file?: File; compressed?: CompressionResult }) => void;
  /** Optional alt text value */
  altText?: string;
  /** Callback when alt text changes */
  onAltChange?: (alt: string) => void;
  /** Placeholder text */
  placeholder?: string;
  /** Label for the input */
  label?: string;
  /** Helper text below input */
  helperText?: string;
  /** Show preview by default */
  showPreviewDefault?: boolean;
  /** Max file size in MB (auto compress if larger) */
  maxSizeMB?: number;
  /** Max width or height in pixels */
  maxWidthOrHeight?: number;
  /** Compression quality (0-1) */
  compressionQuality?: number;
  /** Convert to WebP format */
  convertToWebP?: boolean;
  /** Aspect ratio for preview (e.g., "16/9", "1/1", "4/3") */
  aspectRatio?: string;
  /** Preview height class */
  previewHeight?: string;
  /** Enable drag and drop */
  enableDragDrop?: boolean;
  /** Enable URL input */
  enableUrlInput?: boolean;
  /** Enable file upload */
  enableFileUpload?: boolean;
  /** Enable paste from clipboard */
  enablePaste?: boolean;
  /** Save to localStorage */
  saveToStorage?: boolean;
  /** Custom upload handler (for server upload) */
  onUpload?: (file: File, compressed: CompressionResult) => Promise<string>;
  /** Show alt text input */
  showAltInput?: boolean;
  /** Show image info (dimensions, size) */
  showImageInfo?: boolean;
  /** Disabled state */
  disabled?: boolean;
  /** Error message */
  error?: string;
  /** Additional class names */
  className?: string;
  /** Compact mode */
  compact?: boolean;
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
// COMPONENT
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
  onUpload,
  showAltInput = false,
  showImageInfo = true,
  disabled = false,
  error,
  className = '',
  compact = false,
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
  const [, setCompressionResult] = useState<{
    originalSize: number;
    compressedSize: number;
    savings: number;
  } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Input styling
  const inputClass = `w-full px-3 py-2.5 rounded-xl text-sm transition-all bg-secondary border text-foreground placeholder-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 ${
    disabled ? 'opacity-50 cursor-not-allowed' : ''
  } ${error ? 'border-destructive' : 'border-border'}`;

  // Handle paste from clipboard
  useEffect(() => {
    if (!enablePaste || disabled) return;

    const handlePaste = async (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;

      for (const item of items) {
        if (item.type.startsWith('image/')) {
          e.preventDefault();
          const file = item.getAsFile();
          if (file) {
            await handleFileSelect(file);
          }
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

  // Load image info when URL changes
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
    img.src = value;
  }, [value, showImageInfo]);

  // Handle URL change
  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    onChange(url);
    setImageError(false);
    setUploadError(null);
    setImageInfo(null);
  };

  // Handle file selection with compression
  const handleFileSelect = useCallback(
    async (file: File) => {
      // Validate it's an image (accept all image types)
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

        // Compress the image
        const compressed = await compressImage(file, {
          maxSizeMB,
          maxWidthOrHeight,
          quality: compressionQuality,
          convertToWebP,
        });

        setCompressionProgress('');
        setUploadStatus('uploading');

        // Update image info
        setImageInfo({
          width: compressed.width,
          height: compressed.height,
          size: compressed.compressedSize,
          originalSize: originalSize,
          format: compressed.format,
        });

        let finalUrl = compressed.url;

        if (onUpload) {
          // Custom upload handler (server upload)
          finalUrl = await onUpload(file, compressed);
        } else if (saveToStorage) {
          // Save to localStorage as base64
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
        
        // Store compression result for display
        const savings = Math.round((1 - compressed.compressedSize / originalSize) * 100);
        setCompressionResult({
          originalSize,
          compressedSize: compressed.compressedSize,
          savings: savings > 0 ? savings : 0,
        });
        
        // Log compression details to console for verification
        console.log('=== Image Compression Result ===');
        console.log('Original Size:', formatFileSize(originalSize));
        console.log('Compressed Size:', formatFileSize(compressed.compressedSize));
        console.log('Dimensions:', compressed.width, '×', compressed.height);
        console.log('Format:', compressed.format);
        console.log('Saved to:', saveToStorage ? 'localStorage' : 'memory');
        if (originalSize > compressed.compressedSize) {
          console.log('Savings:', savings + '%');
        }
        console.log('================================');
        
        // Clear compression result after 5 seconds
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
    [maxSizeMB, maxWidthOrHeight, compressionQuality, convertToWebP, onChange, onUpload, onImageData, saveToStorage]
  );

  // Handle file input change
  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
    // Reset input value so same file can be selected again
    if (e.target) {
      e.target.value = '';
    }
  };

  // Handle drag events
  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled && enableDragDrop) {
      setIsDragging(true);
    }
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
    if (file) {
      handleFileSelect(file);
    }
  };

  // Clear image - FIXED VERSION
  const handleClear = useCallback(() => {
    console.log('handleClear called, current value:', value);
    
    // Clear the URL value by calling parent onChange with empty string
    onChange('');
    
    // Clear alt text if callback exists
    if (onAltChange) {
      onAltChange('');
    }
    
    // Reset all internal states
    setImageError(false);
    setUploadError(null);
    setImageInfo(null);
    setCompressionResult(null);
    setShowPreview(false);
    
    // Clear file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    
    console.log('handleClear completed, onChange called with empty string');
  }, [onChange, onAltChange, value]);

  // Copy URL to clipboard
  const handleCopyUrl = async () => {
    if (value) {
      await navigator.clipboard.writeText(value);
    }
  };

  // Open image in new tab
  const handleOpenExternal = () => {
    if (value) {
      window.open(value, '_blank');
    }
  };

  // Download image
  const handleDownload = () => {
    if (value) {
      const link = document.createElement('a');
      link.href = value;
      link.download = `image-${Date.now()}.${imageInfo?.format || 'jpg'}`;
      link.click();
    }
  };

  const hasImage = value && value.trim() !== '';

  return (
    <div ref={containerRef} className={`space-y-2 ${className}`} tabIndex={0}>
      {/* Label */}
      {label && (
        <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
          <ImageIcon className="w-4 h-4" />
          {label}
        </label>
      )}

      {/* Mode Tabs (if both modes enabled) */}
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
            {saveToStorage && (
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
            {/* Choose File Button */}
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
          {/* Hidden file input - only render here if URL mode didn't render it */}
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
            // Preview with overlay controls
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
                  className="p-2 bg-white/20 backdrop-blur-sm rounded-lg text-white hover:bg-white/30 transition-colors"
                  title="Replace image"
                >
                  <RefreshCw className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  onClick={() => setShowFullscreen(true)}
                  className="p-2 bg-white/20 backdrop-blur-sm rounded-lg text-white hover:bg-white/30 transition-colors"
                  title="View fullscreen"
                >
                  <Maximize2 className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  onClick={handleCopyUrl}
                  className="p-2 bg-white/20 backdrop-blur-sm rounded-lg text-white hover:bg-white/30 transition-colors"
                  title="Copy URL"
                >
                  <Copy className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  onClick={handleDownload}
                  className="p-2 bg-white/20 backdrop-blur-sm rounded-lg text-white hover:bg-white/30 transition-colors"
                  title="Download"
                >
                  <Download className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleClear();
                  }}
                  disabled={disabled}
                  className="p-2 bg-destructive/80 backdrop-blur-sm rounded-lg text-white hover:bg-destructive transition-colors"
                  title="Remove image"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>

              {/* Success Badge */}
              {uploadStatus === 'success' && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute top-2 right-2 p-1.5 bg-green-500 rounded-full"
                >
                  <Check className="w-4 h-4 text-white" />
                </motion.div>
              )}

              {/* Image Info Badge */}
              {showImageInfo && imageInfo && (
                <div className="absolute bottom-2 left-2 px-2 py-1 bg-black/60 backdrop-blur-sm rounded-lg text-white text-xs flex items-center gap-2">
                  <Info className="w-3 h-3" />
                  <span>{imageInfo.width} × {imageInfo.height}</span>
                  {imageInfo.size > 0 && (
                    <>
                      <span className="text-white/60">|</span>
                      <span>{formatFileSize(imageInfo.size)}</span>
                    </>
                  )}
                  {imageInfo.originalSize && imageInfo.originalSize > 0 && imageInfo.size > 0 && imageInfo.originalSize !== imageInfo.size && (
                    <span className="text-green-400 font-medium">
                      (-{Math.round((1 - imageInfo.size / imageInfo.originalSize) * 100)}%)
                    </span>
                  )}
                </div>
              )}
            </div>
          ) : (
            // Upload placeholder
            <label
              htmlFor="image-upload-input"
              onClick={() => fileInputRef.current?.click()}
              className={`flex flex-col items-center justify-center py-8 px-4 ${
                disabled ? 'cursor-not-allowed' : 'cursor-pointer'
              }`}
            >
              {uploadStatus === 'compressing' || uploadStatus === 'uploading' ? (
                <>
                  <Loader2 className="w-10 h-10 text-primary animate-spin mb-3" />
                  <p className="text-sm font-medium text-foreground mb-1">
                    {uploadStatus === 'compressing' ? 'Compressing...' : 'Uploading...'}
                  </p>
                  {compressionProgress && (
                    <p className="text-xs text-muted-foreground">{compressionProgress}</p>
                  )}
                </>
              ) : (
                <>
                  <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center mb-3">
                    <Upload className="w-6 h-6 text-muted-foreground" />
                  </div>

                  <p className="text-sm font-medium text-foreground mb-1">
                    {isDragging
                      ? 'Drop image here'
                      : 'Click to upload or drag and drop'}
                  </p>
                  <p className="text-xs text-muted-foreground text-center">
                    All image formats supported (PNG, JPG, WebP, AVIF, GIF, etc.)
                    <br />
                    <span className="text-primary">Auto-compressed to {maxSizeMB}MB max</span>
                  </p>

                  {enablePaste && (
                    <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                      <Clipboard className="w-3 h-3" />
                      Or paste from clipboard (Ctrl+V)
                    </p>
                  )}
                </>
              )}

              {imageError && (
                <p className="text-xs text-destructive mt-2 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  Failed to load image
                </p>
              )}
            </label>
          )}
        </div>
      )}

      {/* URL Preview (for URL mode) */}
      <AnimatePresence>
        {mode === 'url' && showPreview && hasImage && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="relative rounded-xl overflow-hidden border border-border group">
              <img
                src={value}
                alt={altText || 'Preview'}
                className={`w-full ${previewHeight} object-cover`}
                style={aspectRatio ? { aspectRatio } : undefined}
                onError={() => setImageError(true)}
                onLoad={(e) => {
                  const img = e.target as HTMLImageElement;
                  setImageInfo((prev) => ({
                    ...prev,
                    width: img.naturalWidth,
                    height: img.naturalHeight,
                    size: prev?.size || 0,
                  }));
                }}
              />
              {imageError && (
                <div className="absolute inset-0 flex items-center justify-center bg-secondary">
                  <div className="text-center">
                    <AlertCircle className="w-8 h-8 text-destructive mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">Failed to load image</p>
                  </div>
                </div>
              )}
              
              {/* Controls */}
              <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  type="button"
                  onClick={() => setShowFullscreen(true)}
                  className="p-1.5 bg-black/50 backdrop-blur-sm rounded-lg text-white hover:bg-black/70 transition-colors"
                  title="View fullscreen"
                >
                  <Maximize2 className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={handleCopyUrl}
                  className="p-1.5 bg-black/50 backdrop-blur-sm rounded-lg text-white hover:bg-black/70 transition-colors"
                  title="Copy URL"
                >
                  <Copy className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={handleOpenExternal}
                  className="p-1.5 bg-black/50 backdrop-blur-sm rounded-lg text-white hover:bg-black/70 transition-colors"
                  title="Open in new tab"
                >
                  <ExternalLink className="w-4 h-4" />
                </button>
              </div>

              {/* Image Info */}
              {showImageInfo && imageInfo && imageInfo.width > 0 && (
                <div className="absolute bottom-2 left-2 px-2 py-1 bg-black/60 backdrop-blur-sm rounded-lg text-white text-xs">
                  {imageInfo.width} × {imageInfo.height}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Alt Text Input */}
      {showAltInput && hasImage && (
        <div className="space-y-1">
          <label className="text-xs text-muted-foreground">
            Alt Text (for SEO & Accessibility)
          </label>
          <input
            type="text"
            value={altText}
            onChange={(e) => onAltChange?.(e.target.value)}
            placeholder="Describe the image..."
            disabled={disabled}
            className={inputClass}
          />
        </div>
      )}

      {/* Helper Text */}
      {helperText && !error && !uploadError && (
        <p className="text-xs text-muted-foreground">{helperText}</p>
      )}

      {/* Compression Result Banner */}
      {/* <AnimatePresence>
        {compressionResult && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-3 rounded-xl bg-green-500/10 border border-green-500/20"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-500" />
                <span className="text-sm font-medium text-green-600 dark:text-green-400">
                  Image Compressed Successfully
                </span>
              </div>
              <button
                onClick={() => setCompressionResult(null)}
                className="p-1 hover:bg-green-500/20 rounded-lg text-green-600 dark:text-green-400"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="mt-2 flex flex-wrap items-center gap-3 text-xs">
              <span className="text-muted-foreground">
                Original: <span className="font-medium text-foreground">{formatFileSize(compressionResult.originalSize)}</span>
              </span>
              <span className="text-muted-foreground">→</span>
              <span className="text-muted-foreground">
                Compressed: <span className="font-medium text-green-600 dark:text-green-400">{formatFileSize(compressionResult.compressedSize)}</span>
              </span>
              {compressionResult.savings > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-green-500/20 text-green-600 dark:text-green-400 font-medium">
                  -{compressionResult.savings}% saved
                </span>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence> */}

      {/* Error Message */}
      {(error || uploadError) && (
        <p className="text-xs text-destructive flex items-center gap-1">
          <AlertCircle className="w-3 h-3" />
          {error || uploadError}
        </p>
      )}

      {/* Fullscreen Preview Modal */}
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
              onClick={() => setShowFullscreen(false)}
              className="absolute top-4 right-4 p-2 bg-white/10 rounded-lg text-white hover:bg-white/20"
            >
              <X className="w-6 h-6" />
            </button>
            <img
              src={value}
              alt={altText || 'Preview'}
              className="max-w-full max-h-full object-contain rounded-lg"
              onClick={(e) => e.stopPropagation()}
            />
            {showImageInfo && imageInfo && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 bg-black/60 backdrop-blur-sm rounded-lg text-white text-sm">
                {imageInfo.width} × {imageInfo.height} | {formatFileSize(imageInfo.size)}
                {imageInfo.format && ` | ${imageInfo.format.toUpperCase()}`}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ============================================
// MULTI IMAGE UPLOAD COMPONENT
// ============================================
export interface MultiImageUploadProps {
  /** Array of image objects */
  value: Array<{ url: string; alt?: string }>;
  /** Callback when images change */
  onChange: (images: Array<{ url: string; alt?: string }>) => void;
  /** Maximum number of images */
  maxImages?: number;
  /** Label */
  label?: string;
  /** Helper text */
  helperText?: string;
  /** Show alt input for each image */
  showAltInput?: boolean;
  /** Preview height */
  previewHeight?: string;
  /** Max file size in MB */
  maxSizeMB?: number;
  /** Max width or height */
  maxWidthOrHeight?: number;
  /** Save to localStorage */
  saveToStorage?: boolean;
  /** Custom upload handler */
  onUpload?: (file: File, compressed: CompressionResult) => Promise<string>;
  /** Disabled state */
  disabled?: boolean;
  /** Class name */
  className?: string;
  /** Enable multiple file selection */
  enableMultiSelect?: boolean;
  /** ID prefix for scroll targeting (default: 'image-slot') */
  idPrefix?: string;
}

export const MultiImageUpload: React.FC<MultiImageUploadProps> = ({
  value = [],
  onChange,
  maxImages = 10,
  label,
  helperText,
  showAltInput = true,
  previewHeight = 'h-32',
  maxSizeMB = 2,
  maxWidthOrHeight = 1920,
  saveToStorage = true,
  onUpload,
  disabled = false,
  className = '',
  enableMultiSelect = true,
  idPrefix = 'background-image',
}) => {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingCount, setProcessingCount] = useState({ current: 0, total: 0 });
  const multiFileInputRef = useRef<HTMLInputElement>(null);

  // Handle multiple file selection
  const handleMultiFileSelect = async (files: FileList) => {
    if (disabled || isProcessing) return;

    const remainingSlots = maxImages - value.length;
    const filesToProcess = Array.from(files).slice(0, remainingSlots);

    if (filesToProcess.length === 0) return;

    setIsProcessing(true);
    setProcessingCount({ current: 0, total: filesToProcess.length });

    try {
      const newImages: Array<{ url: string; alt?: string }> = [];

      for (let i = 0; i < filesToProcess.length; i++) {
        const file = filesToProcess[i];
        setProcessingCount({ current: i + 1, total: filesToProcess.length });

        if (!file.type.startsWith('image/')) continue;

        const compressed = await compressImage(file, {
          maxSizeMB,
          maxWidthOrHeight,
        });

        let finalUrl = compressed.url;

        if (onUpload) {
          finalUrl = await onUpload(file, compressed);
        } else if (saveToStorage) {
          const base64 = await blobToBase64(compressed.blob);
          saveToLocalStorage({
            url: base64,
            name: file.name,
            size: compressed.compressedSize,
          });
          finalUrl = base64;
        }

        newImages.push({ url: finalUrl, alt: '' });
      }

      onChange([...value, ...newImages]);
    } catch (err) {
      console.error('Multi-upload error:', err);
    } finally {
      setIsProcessing(false);
      setProcessingCount({ current: 0, total: 0 });
      if (multiFileInputRef.current) {
        multiFileInputRef.current.value = '';
      }
    }
  };

  // Update single image URL
  const handleUpdateImage = (index: number, url: string) => {
    const newImages = [...value];
    newImages[index] = { ...newImages[index], url };
    onChange(newImages);
  };

  // Update alt text
  const handleUpdateAlt = (index: number, alt: string) => {
    const newImages = [...value];
    newImages[index] = { ...newImages[index], alt };
    onChange(newImages);
  };

  // Remove image
  const handleRemoveImage = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
  };

  // Drag and drop reordering
  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;

    const newImages = [...value];
    const draggedItem = newImages[draggedIndex];
    newImages.splice(draggedIndex, 1);
    newImages.splice(index, 0, draggedItem);
    onChange(newImages);
    setDraggedIndex(index);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Hidden multi-file input */}
      <input
        ref={multiFileInputRef}
        type="file"
        accept="image/*"
        multiple={enableMultiSelect}
        onChange={(e) => e.target.files && handleMultiFileSelect(e.target.files)}
        disabled={disabled || isProcessing}
        className="hidden"
      />

      {/* Header */}
      {label && (
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <FolderOpen className="w-4 h-4" />
            {label}
            <span className="px-2 py-0.5 rounded-full text-xs bg-secondary">
              {value.length}/{maxImages}
            </span>
          </label>

          {/* Bulk Upload Button */}
          {enableMultiSelect && value.length < maxImages && (
            <button
              type="button"
              onClick={() => multiFileInputRef.current?.click()}
              disabled={disabled || isProcessing}
              className="px-3 py-1.5 text-xs font-medium rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors flex items-center gap-1.5"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-3 h-3 animate-spin" />
                  {processingCount.current}/{processingCount.total}
                </>
              ) : (
                <>
                  <Upload className="w-3 h-3" />
                  Bulk Upload
                </>
              )}
            </button>
          )}
        </div>
      )}

      {/* Images Grid */}
      <div className="space-y-3">
        {value.map((image, index) => (
          <motion.div
            key={index}
            id={`${idPrefix}-${index}`}
            layout
            draggable={!disabled}
            onDragStart={() => handleDragStart(index)}
            onDragOver={(e) => handleDragOver(e, index)}
            onDragEnd={handleDragEnd}
            className={`p-3 rounded-xl border bg-card ${
              draggedIndex === index ? 'border-primary opacity-50' : 'border-border'
            }`}
          >
            <div className="flex items-start gap-3">
              {/* Drag Handle */}
              <div className="pt-2 cursor-grab text-muted-foreground hover:text-foreground">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 8h16M4 16h16"
                  />
                </svg>
              </div>

              {/* Image Upload */}
              <div className="flex-1">
                <ImageUpload
                  value={image.url}
                  onChange={(url) => handleUpdateImage(index, url)}
                  altText={image.alt}
                  onAltChange={(alt) => handleUpdateAlt(index, alt)}
                  showAltInput={showAltInput}
                  previewHeight={previewHeight}
                  maxSizeMB={maxSizeMB}
                  maxWidthOrHeight={maxWidthOrHeight}
                  saveToStorage={saveToStorage}
                  onUpload={onUpload}
                  disabled={disabled}
                  compact
                  placeholder={`Image #${index + 1} URL`}
                  showImageInfo={true}
                />
              </div>

              {/* Remove Button */}
              <button
                type="button"
                onClick={() => handleRemoveImage(index)}
                disabled={disabled}
                className="p-2 rounded-lg text-destructive hover:bg-destructive/10 transition-colors"
                title="Remove image"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            {/* Index Badge */}
            {index === 0 && (
              <span className="inline-block mt-2 px-2 py-0.5 rounded-full text-xs bg-primary/20 text-primary">
                Default Image
              </span>
            )}
          </motion.div>
        ))}
      </div>

      {/* Add Button */}
      {value.length < maxImages && (
        <button
          type="button"
          onClick={() => {
            const newIndex = value.length;
            onChange([...value, { url: '', alt: '' }]);
            // Scroll to the newly added image slot
            setTimeout(() => {
              const newSlot = document.getElementById(`${idPrefix}-${newIndex}`);
              if (newSlot) {
                newSlot.scrollIntoView({ behavior: 'smooth', block: 'center' });
              }
            }, 100);
          }}
          disabled={disabled || isProcessing}
          className="w-full py-3 border-2 border-dashed border-border rounded-xl text-muted-foreground hover:border-primary hover:text-primary transition-colors flex items-center justify-center gap-2"
        >
          <Upload className="w-4 h-4" />
          <span className="text-sm font-medium">Add Image</span>
        </button>
      )}

      {/* Helper Text */}
      {helperText && <p className="text-xs text-muted-foreground">{helperText}</p>}

      {/* Max Reached */}
      {value.length >= maxImages && (
        <p className="text-xs text-muted-foreground text-center">
          Maximum {maxImages} images allowed
        </p>
      )}
    </div>
  );
};

// ============================================
// EXPORTS
// ============================================
export { compressImage, formatFileSize, saveToLocalStorage, getFromLocalStorage, removeFromLocalStorage, clearLocalStorage };
export type { CompressionResult, CompressionOptions, StoredImage };
export default ImageUpload;
