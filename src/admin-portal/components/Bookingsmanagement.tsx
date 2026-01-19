/**
 * ============================================
 * BOOKINGS MANAGEMENT - REDESIGNED V6
 * ============================================
 * Features:
 * - Larger fonts for better visibility
 * - Collapsible filter panel triggered by Filter button
 * - Pill-style date buttons
 * - Removed Source column
 * - Compact pagination
 * - Modern, accessible design
 * 
 * @file src/admin-portal/components/Bookingsmanagement.tsx
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar,
  Search,
  Download,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Wrench,
  AlertCircle,
  Loader2,
  Trash2,
  Eye,
  Edit2,
  X,
  ArrowUpDown,
  Square,
  CheckSquare,
  Phone,
  Mail,
  CheckCircle2,
  Copy,
  Save,
  ChevronDown,
  Filter,
  ChevronUp,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import {
  listBookings,
  updateBooking,
  deleteBooking,
  bulkUpdateBookings,
  exportBookings,
  type Booking,
  type BookingStatus,
  type BookingListOptions,
  type UpdateBookingData,
  formatPhone,
  getRelativeTime,
} from '../../services/api/bookingsApi';

// ============================================
// INTERFACES & TYPES
// ============================================

interface BookingsManagementProps {
  isDarkMode?: boolean;
}

type DateFilterType = 'all' | 'today' | 'yesterday' | 'last7days' | 'custom';

interface DateRange {
  start: Date | null;
  end: Date | null;
}

// ============================================
// CONSTANTS
// ============================================

const STATUS_OPTIONS: { value: BookingStatus | ''; label: string }[] = [
  { value: '', label: 'All Status' },
  { value: 'new', label: 'New' },
  { value: 'contacted', label: 'Contacted' },
  { value: 'scheduled', label: 'Scheduled' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' },
];

const DATE_FILTER_OPTIONS: { value: DateFilterType; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'today', label: 'Today' },
  { value: 'yesterday', label: 'Yesterday' },
  { value: 'last7days', label: 'Last 7 Days' },
  { value: 'custom', label: 'Custom' },
];

const PAGE_SIZES = [10, 20, 50, 100];

// Status colors mapping
const STATUS_STYLES: Record<BookingStatus, { bg: string; text: string; dot: string; border: string }> = {
  new: { 
    bg: 'bg-blue-50 dark:bg-blue-500/15', 
    text: 'text-blue-700 dark:text-blue-400', 
    dot: 'bg-blue-500',
    border: 'border-blue-200 dark:border-blue-500/30'
  },
  contacted: { 
    bg: 'bg-amber-50 dark:bg-amber-500/15', 
    text: 'text-amber-700 dark:text-amber-400', 
    dot: 'bg-amber-500',
    border: 'border-amber-200 dark:border-amber-500/30'
  },
  scheduled: { 
    bg: 'bg-purple-50 dark:bg-purple-500/15', 
    text: 'text-purple-700 dark:text-purple-400', 
    dot: 'bg-purple-500',
    border: 'border-purple-200 dark:border-purple-500/30'
  },
  completed: { 
    bg: 'bg-emerald-50 dark:bg-emerald-500/15', 
    text: 'text-emerald-700 dark:text-emerald-400', 
    dot: 'bg-emerald-500',
    border: 'border-emerald-200 dark:border-emerald-500/30'
  },
  cancelled: { 
    bg: 'bg-red-50 dark:bg-red-500/15', 
    text: 'text-red-700 dark:text-red-400', 
    dot: 'bg-red-500',
    border: 'border-red-200 dark:border-red-500/30'
  },
};

// ============================================
// UTILITY FUNCTIONS
// ============================================

const getDateRange = (filterType: DateFilterType, customRange: DateRange): { startDate?: string; endDate?: string } => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const endOfToday = new Date();
  endOfToday.setHours(23, 59, 59, 999);

  switch (filterType) {
    case 'today':
      return {
        startDate: today.toISOString(),
        endDate: endOfToday.toISOString(),
      };
    case 'yesterday': {
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      const endOfYesterday = new Date(yesterday);
      endOfYesterday.setHours(23, 59, 59, 999);
      return {
        startDate: yesterday.toISOString(),
        endDate: endOfYesterday.toISOString(),
      };
    }
    case 'last7days': {
      const last7 = new Date(today);
      last7.setDate(last7.getDate() - 7);
      return {
        startDate: last7.toISOString(),
        endDate: endOfToday.toISOString(),
      };
    }
    case 'custom':
      if (customRange.start && customRange.end) {
        const start = new Date(customRange.start);
        start.setHours(0, 0, 0, 0);
        const end = new Date(customRange.end);
        end.setHours(23, 59, 59, 999);
        return {
          startDate: start.toISOString(),
          endDate: end.toISOString(),
        };
      }
      return {};
    default:
      return {};
  }
};

const formatDateForInput = (date: Date | null): string => {
  if (!date) return '';
  return date.toISOString().split('T')[0];
};

// ============================================
// UTILITY COMPONENTS
// ============================================

// Status Badge
const StatusBadge: React.FC<{ status: BookingStatus; size?: 'sm' | 'md' | 'lg' }> = ({ status, size = 'md' }) => {
  const style = STATUS_STYLES[status] || STATUS_STYLES.new;
  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-base'
  };
  
  return (
    <span className={`inline-flex items-center gap-2 rounded-full font-semibold uppercase tracking-wide border ${style.bg} ${style.text} ${style.border} ${sizeClasses[size]}`}>
      <span className={`w-2 h-2 rounded-full ${style.dot}`} />
      {status}
    </span>
  );
};

// Copy Button
const CopyButton: React.FC<{ text: string; size?: number }> = ({ text, size = 16 }) => {
  const [copied, setCopied] = useState(false);
  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  return (
    <button 
      onClick={handleCopy} 
      className="p-2 rounded-lg hover:bg-secondary/80 transition-all duration-200 active:scale-95" 
      title="Copy"
    >
      {copied ? (
        <CheckCircle2 size={size} className="text-green-500" />
      ) : (
        <Copy size={size} className="text-muted-foreground hover:text-foreground" />
      )}
    </button>
  );
};

// ============================================
// MOBILE BOOKING ROW (Expandable)
// ============================================

interface MobileBookingRowProps {
  booking: Booking;
  index: number;
  pageOffset: number;
  isSelected: boolean;
  onToggleSelect: () => void;
  onView: () => void;
}

const MobileBookingRow: React.FC<MobileBookingRowProps> = ({ 
  booking, 
  index, 
  pageOffset, 
  isSelected, 
  onToggleSelect, 
  onView 
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const serviceName = typeof booking.service === 'object' ? booking.service?.name : booking.service;
  const serialNo = pageOffset + index + 1;

  return (
    <div className={`border-b border-border last:border-b-0 ${isSelected ? 'bg-primary/5' : ''}`}>
      {/* Main Row */}
      <div 
        className="flex items-center gap-3 p-4 cursor-pointer active:bg-secondary/50"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <button
          onClick={(e) => { e.stopPropagation(); onToggleSelect(); }}
          className="text-muted-foreground hover:text-primary flex-shrink-0"
        >
          {isSelected ? <CheckSquare size={22} className="text-primary" /> : <Square size={22} />}
        </button>

        <span className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center text-sm font-bold text-muted-foreground flex-shrink-0">
          {serialNo}
        </span>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <Phone size={16} className="text-green-500 flex-shrink-0" />
            <span className="text-base font-semibold text-foreground truncate">
              {formatPhone(booking.phone, booking.countryCode)}
            </span>
          </div>
          <div className="flex items-center gap-2 mt-1">
            <MapPin size={14} className="text-muted-foreground flex-shrink-0" />
            <span className="text-sm text-muted-foreground truncate">{booking.city}</span>
            <span className="text-muted-foreground">•</span>
            <span className="text-sm text-muted-foreground">{booking.brandName}</span>
          </div>
        </div>

        <StatusBadge status={booking.status} size="sm" />

        <ChevronDown 
          size={20} 
          className={`text-muted-foreground transition-transform flex-shrink-0 ${isExpanded ? 'rotate-180' : ''}`} 
        />
      </div>

      {/* Expanded Content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 pt-2 space-y-3 bg-secondary/20">
              {/* Vehicle Details */}
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-card rounded-lg p-3 border border-border">
                  <span className="text-xs text-muted-foreground block mb-1">Brand</span>
                  <span className="text-sm font-semibold text-foreground">{booking.brandName}</span>
                </div>
                <div className="bg-card rounded-lg p-3 border border-border">
                  <span className="text-xs text-muted-foreground block mb-1">Model</span>
                  <span className="text-sm font-semibold text-foreground">{booking.carModel}</span>
                </div>
                <div className="bg-card rounded-lg p-3 border border-border">
                  <span className="text-xs text-muted-foreground block mb-1">Fuel</span>
                  <span className="text-sm font-semibold text-foreground">{booking.fuelType}</span>
                </div>
              </div>

              {/* Service & Time */}
              <div className="flex items-center justify-between text-sm">
                {serviceName && (
                  <div className="flex items-center gap-2">
                    <Wrench size={14} className="text-primary" />
                    <span className="font-medium text-foreground">{serviceName}</span>
                  </div>
                )}
                <span className="text-muted-foreground">{getRelativeTime(booking.createdAt)}</span>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3 pt-3 border-t border-border/50">
                <a 
                  href={`tel:${booking.phone}`} 
                  onClick={(e) => e.stopPropagation()}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-green-500/10 text-green-600 font-semibold text-sm hover:bg-green-500/20 transition-colors"
                >
                  <Phone size={16} />
                  Call Now
                </a>
                <CopyButton text={booking.phone} size={18} />
                {booking.email && (
                  <a 
                    href={`mailto:${booking.email}`}
                    onClick={(e) => e.stopPropagation()}
                    className="p-3 rounded-xl bg-blue-500/10 text-blue-600 hover:bg-blue-500/20 transition-colors"
                  >
                    <Mail size={18} />
                  </a>
                )}
                <button 
                  onClick={(e) => { e.stopPropagation(); onView(); }}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-colors"
                >
                  <Eye size={16} />
                  View Details
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ============================================
// SLIDE-OVER DETAIL PANEL
// ============================================

interface DetailPanelProps {
  booking: Booking | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (id: string, data: UpdateBookingData) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  isAdmin: boolean;
}

const DetailPanel: React.FC<DetailPanelProps> = ({ booking, isOpen, onClose, onUpdate, onDelete, isAdmin }) => {
  const [notes, setNotes] = useState('');
  const [status, setStatus] = useState<BookingStatus>('new');
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    if (booking) {
      setNotes(booking.notes || '');
      setStatus(booking.status);
      setIsEditing(false);
      setShowDeleteConfirm(false);
    }
  }, [booking]);

  const handleSave = async () => {
    if (!booking) return;
    setIsSaving(true);
    try {
      await onUpdate(booking._id, { status, notes });
      setIsEditing(false);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!booking) return;
    setIsDeleting(true);
    try {
      await onDelete(booking._id);
      onClose();
    } finally {
      setIsDeleting(false);
    }
  };

  const serviceName = booking ? (typeof booking.service === 'object' ? booking.service?.name : booking.service) : '';

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          />

          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 h-full w-full max-w-lg bg-card border-l border-border shadow-2xl z-50 flex flex-col"
          >
            {booking ? (
              <>
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-border bg-secondary/30">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center text-white shadow-lg">
                      <Phone size={24} />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-foreground">{formatPhone(booking.phone, booking.countryCode)}</h3>
                      <p className="text-sm text-muted-foreground mt-1">{getRelativeTime(booking.createdAt)}</p>
                    </div>
                  </div>
                  <button 
                    onClick={onClose} 
                    className="p-3 rounded-xl hover:bg-secondary text-muted-foreground transition-colors"
                  >
                    <X size={22} />
                  </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                  {/* Status */}
                  <div className="flex items-center justify-between p-4 rounded-xl bg-secondary/50">
                    <span className="text-base font-medium text-muted-foreground">Status</span>
                    {isEditing ? (
                      <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value as BookingStatus)}
                        className="px-4 py-2 rounded-lg bg-background border border-border text-base font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                      >
                        {STATUS_OPTIONS.filter(s => s.value).map(s => (
                          <option key={s.value} value={s.value}>{s.label}</option>
                        ))}
                      </select>
                    ) : (
                      <StatusBadge status={booking.status} size="md" />
                    )}
                  </div>

                  {/* Contact Info */}
                  <div className="p-4 rounded-xl bg-secondary/30 space-y-3">
                    <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Contact Information</h4>
                    <div className="flex items-center justify-between py-2">
                      <a href={`tel:${booking.phone}`} className="flex items-center gap-3 text-base font-medium text-foreground hover:text-primary transition-colors">
                        <Phone size={18} className="text-green-500" />
                        {formatPhone(booking.phone, booking.countryCode)}
                      </a>
                      <CopyButton text={booking.phone} />
                    </div>
                    {booking.email && (
                      <div className="flex items-center justify-between py-2 border-t border-border/50">
                        <a href={`mailto:${booking.email}`} className="flex items-center gap-3 text-base font-medium text-foreground hover:text-primary transition-colors truncate">
                          <Mail size={18} className="text-blue-500 flex-shrink-0" />
                          <span className="truncate">{booking.email}</span>
                        </a>
                        <CopyButton text={booking.email} />
                      </div>
                    )}
                  </div>

                  {/* Vehicle Details */}
                  <div className="p-4 rounded-xl bg-secondary/30">
                    <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-4">Vehicle Details</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="text-xs text-muted-foreground">Brand</span>
                        <p className="text-base font-semibold text-foreground mt-1">{booking.brandName}</p>
                      </div>
                      <div>
                        <span className="text-xs text-muted-foreground">Model</span>
                        <p className="text-base font-semibold text-foreground mt-1">{booking.carModel}</p>
                      </div>
                      <div>
                        <span className="text-xs text-muted-foreground">Fuel Type</span>
                        <p className="text-base font-semibold text-foreground mt-1">{booking.fuelType}</p>
                      </div>
                      <div>
                        <span className="text-xs text-muted-foreground">City</span>
                        <p className="text-base font-semibold text-foreground mt-1">{booking.city}</p>
                      </div>
                    </div>
                  </div>

                  {/* Service */}
                  {serviceName && (
                    <div className="p-4 rounded-xl bg-secondary/30">
                      <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-2">Service Requested</h4>
                      <div className="flex items-center gap-3 mt-2">
                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                          <Wrench size={18} className="text-primary" />
                        </div>
                        <span className="text-base font-semibold text-foreground">{serviceName}</span>
                      </div>
                    </div>
                  )}

                  {/* Notes */}
                  <div className="p-4 rounded-xl bg-secondary/30">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Notes</h4>
                      {!isEditing && (
                        <button 
                          onClick={() => setIsEditing(true)} 
                          className="text-sm font-medium text-primary hover:underline"
                        >
                          Edit
                        </button>
                      )}
                    </div>
                    {isEditing ? (
                      <textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        rows={4}
                        className="w-full px-4 py-3 rounded-xl bg-background border border-border text-base text-foreground resize-none focus:outline-none focus:ring-2 focus:ring-primary/50"
                        placeholder="Add notes about this booking..."
                      />
                    ) : (
                      <p className="text-base text-foreground">
                        {booking.notes || <span className="italic text-muted-foreground">No notes added yet</span>}
                      </p>
                    )}
                  </div>

                  {/* Delete Confirmation */}
                  {showDeleteConfirm && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="p-4 rounded-xl bg-destructive/10 border border-destructive/30"
                    >
                      <p className="text-base font-semibold text-destructive mb-3">Are you sure you want to delete this booking?</p>
                      <p className="text-sm text-muted-foreground mb-4">This action cannot be undone.</p>
                      <div className="flex gap-3">
                        <button 
                          onClick={() => setShowDeleteConfirm(false)} 
                          className="flex-1 px-4 py-3 text-base font-medium bg-secondary rounded-xl hover:bg-secondary/80 transition-colors"
                        >
                          Cancel
                        </button>
                        <button 
                          onClick={handleDelete} 
                          disabled={isDeleting} 
                          className="flex-1 px-4 py-3 text-base font-medium bg-destructive text-white rounded-xl hover:bg-destructive/90 transition-colors flex items-center justify-center gap-2"
                        >
                          {isDeleting && <Loader2 size={16} className="animate-spin" />}
                          Delete
                        </button>
                      </div>
                    </motion.div>
                  )}
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-border bg-secondary/20 flex items-center gap-3">
                  {isAdmin && !showDeleteConfirm && !isEditing && (
                    <button 
                      onClick={() => setShowDeleteConfirm(true)} 
                      className="p-3 rounded-xl hover:bg-destructive/10 text-destructive transition-colors"
                    >
                      <Trash2 size={20} />
                    </button>
                  )}
                  <div className="flex-1" />
                  {isEditing ? (
                    <>
                      <button 
                        onClick={() => { setIsEditing(false); setNotes(booking.notes || ''); setStatus(booking.status); }} 
                        className="px-6 py-3 text-base font-medium bg-secondary rounded-xl hover:bg-secondary/80 transition-colors"
                      >
                        Cancel
                      </button>
                      <button 
                        onClick={handleSave} 
                        disabled={isSaving} 
                        className="px-6 py-3 text-base font-semibold bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-colors flex items-center gap-2"
                      >
                        {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                        Save Changes
                      </button>
                    </>
                  ) : (
                    <>
                      <a 
                        href={`tel:${booking.phone}`} 
                        className="px-6 py-3 text-base font-semibold bg-green-500/10 text-green-600 rounded-xl hover:bg-green-500/20 transition-colors flex items-center gap-2"
                      >
                        <Phone size={18} />
                        Call
                      </a>
                      <button 
                        onClick={() => setIsEditing(true)} 
                        className="px-6 py-3 text-base font-semibold bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-colors flex items-center gap-2"
                      >
                        <Edit2 size={18} />
                        Edit
                      </button>
                    </>
                  )}
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-muted-foreground">
                <p className="text-lg">No booking selected</p>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

// ============================================
// MAIN COMPONENT
// ============================================

export const BookingsManagement: React.FC<BookingsManagementProps> = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  // States
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Data States
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [facets, setFacets] = useState<{ cities: string[]; brands: string[] }>({ cities: [], brands: [] });

  // Filter & Search States
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [statusFilter, setStatusFilter] = useState<BookingStatus | ''>('');
  const [cityFilter, setCityFilter] = useState('');
  const [brandFilter, setBrandFilter] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [dateFilter, setDateFilter] = useState<DateFilterType>('all');
  const [customRange, setCustomRange] = useState<DateRange>({ start: null, end: null });
  const [showFilters, setShowFilters] = useState(false);
  const [showCustomDatePicker, setShowCustomDatePicker] = useState(false);

  // Action States
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [bulkStatus, setBulkStatus] = useState<BookingStatus | ''>('');
  const [isBulkUpdating, setIsBulkUpdating] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  
  const hasLoadedRef = useRef(false);

  // Derived
  const hasFilters = search || statusFilter || cityFilter || brandFilter || dateFilter !== 'all';
  const pageOffset = (page - 1) * limit;
  const activeFilterCount = [statusFilter, cityFilter, brandFilter, dateFilter !== 'all' ? dateFilter : ''].filter(Boolean).length;

  // Load data
  const loadBookings = useCallback(async (refresh = false) => {
    try {
      if (refresh) setIsRefreshing(true);
      else setIsLoading(true);
      
      setError(null);
      
      const options: BookingListOptions = {
        page, 
        limit, 
        sortBy, 
        sortOrder,
        search: search.trim() || undefined,
        status: statusFilter || undefined,
        city: cityFilter || undefined,
        brand: brandFilter || undefined,
      };
      
      const dateRange = getDateRange(dateFilter, customRange);
      if (dateRange.startDate) options.startDate = dateRange.startDate;
      if (dateRange.endDate) options.endDate = dateRange.endDate;

      const res = await listBookings(options);
      
      setBookings(res.items || []);
      setTotal(res.total || 0);
      setTotalPages(res.totalPages || 1);
      
      if (res.facets) {
        setFacets(res.facets);
      }
    } catch {
      setError('Failed to load bookings');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [page, limit, search, statusFilter, cityFilter, brandFilter, sortBy, sortOrder, dateFilter, customRange]);

  useEffect(() => {
    loadBookings(!hasLoadedRef.current ? false : true);
    hasLoadedRef.current = true;
  }, [page, search, statusFilter, cityFilter, brandFilter, sortBy, sortOrder, dateFilter, customRange]);

  useEffect(() => {
    const t = setTimeout(() => { 
      if (searchInput !== search) { 
        setSearch(searchInput); 
        setPage(1); 
      } 
    }, 400);
    return () => clearTimeout(t);
  }, [searchInput]);

  // Handlers
  const handleUpdate = async (id: string, data: UpdateBookingData) => { await updateBooking(id, data); loadBookings(true); };
  const handleDelete = async (id: string) => { await deleteBooking(id); loadBookings(true); };
  
  const handleBulkUpdate = async () => {
    if (!bulkStatus || !selectedIds.size) return;
    setIsBulkUpdating(true);
    try {
      await bulkUpdateBookings(Array.from(selectedIds), bulkStatus);
      setSelectedIds(new Set());
      setBulkStatus('');
      loadBookings(true);
    } finally { setIsBulkUpdating(false); }
  };
  
  const handleExport = async () => {
    setIsExporting(true);
    try {
      const url = await exportBookings({
        status: statusFilter || undefined, 
        city: cityFilter || undefined,
        brand: brandFilter || undefined,
        startDate: '',
        endDate: ''
      });
      const a = document.createElement('a'); 
      a.href = url; 
      a.download = `bookings-${new Date().toISOString().split('T')[0]}.csv`; 
      a.click(); 
      URL.revokeObjectURL(url);
    } finally { setIsExporting(false); }
  };
  
  const toggleSelect = (id: string) => { 
    const s = new Set(selectedIds); 
    s.has(id) ? s.delete(id) : s.add(id); 
    setSelectedIds(s); 
  };
  
  const toggleAll = () => setSelectedIds(
    selectedIds.size === bookings.length ? new Set() : new Set(bookings.map(b => b._id))
  );
  
  const handleSort = (col: string) => { 
    sortBy === col ? setSortOrder(o => o === 'asc' ? 'desc' : 'asc') : (setSortBy(col), setSortOrder('desc')); 
  };
  
  const clearFilters = () => { 
    setSearchInput(''); 
    setSearch(''); 
    setStatusFilter(''); 
    setCityFilter(''); 
    setBrandFilter('');
    setDateFilter('all'); 
    setCustomRange({ start: null, end: null }); 
    setPage(1); 
    setShowFilters(false);
  };
  
  const openPanel = (b: Booking) => { setSelectedBooking(b); setIsPanelOpen(true); };
  const closePanel = () => { setIsPanelOpen(false); setSelectedBooking(null); };

  const handleDateFilterSelect = (filter: DateFilterType) => {
    setDateFilter(filter);
    setPage(1);
    if (filter === 'custom') {
      setShowCustomDatePicker(true);
    } else {
      setShowCustomDatePicker(false);
    }
  };

  // Loading State
  if (isLoading && !hasLoadedRef.current) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <Loader2 size={48} className="animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground text-lg">Loading bookings...</p>
        </div>
      </div>
    );
  }

  // Error State
  if (error && !bookings.length) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <AlertCircle size={48} className="text-destructive mx-auto mb-4" />
          <p className="text-destructive text-lg mb-4">{error}</p>
          <button 
            onClick={() => loadBookings()} 
            className="px-6 py-3 bg-primary text-primary-foreground rounded-xl text-base font-semibold hover:bg-primary/90 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full overflow-hidden bg-background">
      {/* TOP BAR - Search on left, Actions on right */}
      <div className="flex-shrink-0 p-4 lg:px-6 lg:py-4 border-b border-border bg-card">
        <div className="flex items-center gap-3">
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search bookings..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl bg-secondary/50 border border-border text-base text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all"
            />
          </div>

          {/* Spacer to push buttons to right */}
          <div className="flex-1" />

          {/* Right-aligned Actions */}
          <div className="flex items-center gap-2">
            {/* Clear Filters */}
            {hasFilters && (
              <button 
                onClick={clearFilters} 
                className="p-3 text-destructive hover:bg-destructive/10 rounded-xl transition-colors"
                title="Clear all filters"
              >
                <X size={20} />
              </button>
            )}

            {/* Filter Button */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-5 py-3 rounded-xl border text-base font-medium transition-all ${
                showFilters || activeFilterCount > 0
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'bg-secondary/50 text-foreground border-border hover:bg-secondary'
              }`}
            >
              <Filter size={18} />
              <span>Filters</span>
              {activeFilterCount > 0 && (
                <span className={`w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center ${
                  showFilters ? 'bg-primary-foreground text-primary' : 'bg-primary text-primary-foreground'
                }`}>
                  {activeFilterCount}
                </span>
              )}
              {showFilters ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </button>

            {/* Divider */}
            <div className="w-px h-10 bg-border hidden sm:block" />

            {/* Refresh */}
            <button 
              onClick={() => loadBookings(true)} 
              disabled={isRefreshing} 
              className="p-3 rounded-xl bg-secondary/50 border border-border hover:bg-secondary disabled:opacity-50 transition-colors"
              title="Refresh"
            >
              <RefreshCw size={20} className={isRefreshing ? 'animate-spin' : ''} />
            </button>

            {/* Export */}
            <button 
              onClick={handleExport} 
              disabled={isExporting} 
              className="p-3 rounded-xl bg-secondary/50 border border-border hover:bg-secondary disabled:opacity-50 transition-colors"
              title="Export"
            >
              <Download size={20} />
            </button>
          </div>
        </div>

        {/* Collapsible Filter Panel - All filters in single row */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="pt-4 mt-4 border-t border-border">
                {/* All Filters in Single Row */}
                <div className="flex flex-wrap items-end gap-4">
                  {/* Status */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Status</label>
                    <select
                      value={statusFilter}
                      onChange={(e) => { setStatusFilter(e.target.value as BookingStatus | ''); setPage(1); }}
                      className="px-4 py-2.5 rounded-xl bg-secondary/50 border border-border text-base font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 cursor-pointer min-w-[140px]"
                    >
                      {STATUS_OPTIONS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                    </select>
                  </div>
                  
                  {/* City */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">City</label>
                    <select
                      value={cityFilter}
                      onChange={(e) => { setCityFilter(e.target.value); setPage(1); }}
                      className="px-4 py-2.5 rounded-xl bg-secondary/50 border border-border text-base font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 cursor-pointer min-w-[140px]"
                    >
                      <option value="">All Cities</option>
                      {facets.cities.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>

                  {/* Brand */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Brand</label>
                    <select
                      value={brandFilter}
                      onChange={(e) => { setBrandFilter(e.target.value); setPage(1); }}
                      className="px-4 py-2.5 rounded-xl bg-secondary/50 border border-border text-base font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 cursor-pointer min-w-[140px]"
                    >
                      <option value="">All Brands</option>
                      {facets.brands.map(b => <option key={b} value={b}>{b}</option>)}
                    </select>
                  </div>

                  {/* Date Filter Pills - inline with dropdowns */}
                  <div className="relative flex flex-col gap-1.5">
                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Date Range</label>
                    <div className="flex items-center gap-1.5">
                      {DATE_FILTER_OPTIONS.map((opt) => (
                        <button
                          key={opt.value}
                          onClick={() => handleDateFilterSelect(opt.value)}
                          className={`
                            px-3.5 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 whitespace-nowrap
                            ${dateFilter === opt.value
                              ? 'bg-primary text-primary-foreground shadow-md'
                              : 'bg-secondary/60 text-muted-foreground hover:bg-secondary hover:text-foreground'
                            }
                          `}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>

                    {/* Custom Date Range Popup */}
                    <AnimatePresence>
                      {showCustomDatePicker && dateFilter === 'custom' && (
                        <>
                          <div 
                            className="fixed inset-0 z-40" 
                            onClick={() => setShowCustomDatePicker(false)} 
                          />
                          <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                            className="absolute top-full left-0 mt-2 p-4 rounded-xl bg-card border border-border shadow-xl z-50 min-w-[280px]"
                          >
                            <div className="flex items-center justify-between mb-4">
                              <h4 className="font-semibold text-foreground">Select Date Range</h4>
                              <button 
                                onClick={() => setShowCustomDatePicker(false)}
                                className="p-1 rounded-lg hover:bg-secondary text-muted-foreground"
                              >
                                <X size={16} />
                              </button>
                            </div>
                            <div className="space-y-4">
                              <div>
                                <label className="block text-sm font-medium text-muted-foreground mb-2">From</label>
                                <input
                                  type="date"
                                  value={formatDateForInput(customRange.start)}
                                  onChange={(e) => setCustomRange({
                                    ...customRange,
                                    start: e.target.value ? new Date(e.target.value) : null
                                  })}
                                  className="w-full px-4 py-3 rounded-lg bg-secondary border border-border text-base text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-muted-foreground mb-2">To</label>
                                <input
                                  type="date"
                                  value={formatDateForInput(customRange.end)}
                                  onChange={(e) => setCustomRange({
                                    ...customRange,
                                    end: e.target.value ? new Date(e.target.value) : null
                                  })}
                                  className="w-full px-4 py-3 rounded-lg bg-secondary border border-border text-base text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                                />
                              </div>
                              <button
                                onClick={() => { setShowCustomDatePicker(false); setPage(1); }}
                                disabled={!customRange.start || !customRange.end}
                                className="w-full px-4 py-3 rounded-lg bg-primary text-primary-foreground font-semibold disabled:opacity-50 transition-all duration-200 hover:bg-primary/90"
                              >
                                Apply Range
                              </button>
                            </div>
                          </motion.div>
                        </>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Bulk Actions */}
        <AnimatePresence>
          {selectedIds.size > 0 && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="flex flex-wrap items-center gap-3 mt-4 p-3 rounded-xl bg-primary/5 border border-primary/20">
                <span className="text-base font-semibold text-foreground">{selectedIds.size} selected</span>
                <div className="flex-1" />
                <select 
                  value={bulkStatus} 
                  onChange={(e) => setBulkStatus(e.target.value as BookingStatus)} 
                  className="px-4 py-2 rounded-xl bg-secondary border border-border text-base font-medium"
                >
                  <option value="">Change status to...</option>
                  {STATUS_OPTIONS.filter(s => s.value).map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                </select>
                <button 
                  onClick={handleBulkUpdate} 
                  disabled={!bulkStatus || isBulkUpdating} 
                  className="px-5 py-2 bg-primary text-primary-foreground text-base font-semibold rounded-xl disabled:opacity-50 flex items-center gap-2 hover:bg-primary/90 transition-colors"
                >
                  {isBulkUpdating && <Loader2 size={16} className="animate-spin" />}
                  Apply
                </button>
                <button 
                  onClick={() => setSelectedIds(new Set())} 
                  className="px-4 py-2 text-base font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* CONTENT */}
      <div className="flex-1 overflow-auto">
        {/* Mobile View */}
        <div className="block lg:hidden">
          <div className="bg-card">
            {bookings.map((b, i) => (
              <MobileBookingRow 
                key={b._id} 
                booking={b} 
                index={i}
                pageOffset={pageOffset}
                isSelected={selectedIds.has(b._id)} 
                onToggleSelect={() => toggleSelect(b._id)} 
                onView={() => openPanel(b)} 
              />
            ))}
          </div>
        </div>

        {/* Desktop Table */}
        <div className="hidden lg:block p-4">
          <div className="bg-card rounded-2xl border border-border overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-secondary/50 border-b border-border">
                  <tr>
                    <th className="w-14 px-4 py-3.5 text-left">
                      <button onClick={toggleAll} className="text-muted-foreground hover:text-foreground transition-colors">
                        {selectedIds.size === bookings.length && bookings.length > 0 ? (
                          <CheckSquare size={22} className="text-primary" />
                        ) : (
                          <Square size={22} />
                        )}
                      </button>
                    </th>
                    <th className="w-16 px-3 py-3.5 text-center text-sm font-bold text-muted-foreground uppercase tracking-wide">S.No</th>
                    <th className="px-4 py-3.5 text-left">
                      <button onClick={() => handleSort('phone')} className="flex items-center gap-2 text-sm font-bold text-muted-foreground uppercase tracking-wide hover:text-foreground transition-colors">
                        Phone <ArrowUpDown size={14} />
                      </button>
                    </th>
                    <th className="px-4 py-3.5 text-left">
                      <button onClick={() => handleSort('city')} className="flex items-center gap-2 text-sm font-bold text-muted-foreground uppercase tracking-wide hover:text-foreground transition-colors">
                        City <ArrowUpDown size={14} />
                      </button>
                    </th>
                    <th className="px-4 py-3.5 text-left text-sm font-bold text-muted-foreground uppercase tracking-wide">Brand</th>
                    <th className="px-4 py-3.5 text-left text-sm font-bold text-muted-foreground uppercase tracking-wide">Model</th>
                    <th className="px-4 py-3.5 text-left text-sm font-bold text-muted-foreground uppercase tracking-wide">Fuel</th>
                    <th className="px-4 py-3.5 text-left">
                      <button onClick={() => handleSort('status')} className="flex items-center gap-2 text-sm font-bold text-muted-foreground uppercase tracking-wide hover:text-foreground transition-colors">
                        Status <ArrowUpDown size={14} />
                      </button>
                    </th>
                    <th className="px-4 py-3.5 text-left">
                      <button onClick={() => handleSort('createdAt')} className="flex items-center gap-2 text-sm font-bold text-muted-foreground uppercase tracking-wide hover:text-foreground transition-colors">
                        Date <ArrowUpDown size={14} />
                      </button>
                    </th>
                    <th className="w-28 px-4 py-3.5 text-center text-sm font-bold text-muted-foreground uppercase tracking-wide">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((b, i) => (
                    <tr 
                      key={b._id} 
                      className={`border-b border-border last:border-0 hover:bg-secondary/30 transition-colors ${selectedIds.has(b._id) ? 'bg-primary/5' : ''}`}
                    >
                      <td className="px-4 py-3.5">
                        <button onClick={() => toggleSelect(b._id)} className="text-muted-foreground hover:text-foreground transition-colors">
                          {selectedIds.has(b._id) ? <CheckSquare size={22} className="text-primary" /> : <Square size={22} />}
                        </button>
                      </td>
                      <td className="px-3 py-3.5 text-center">
                        <span className="inline-flex w-9 h-9 rounded-lg bg-secondary items-center justify-center text-sm font-bold text-muted-foreground">
                          {pageOffset + i + 1}
                        </span>
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-3">
                          <Phone size={18} className="text-green-500 flex-shrink-0" />
                          <span className="text-base font-semibold text-foreground">{formatPhone(b.phone, b.countryCode)}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3.5 text-base font-medium text-foreground">{b.city}</td>
                      <td className="px-4 py-3.5 text-base font-medium text-foreground">{b.brandName}</td>
                      <td className="px-4 py-3.5 text-base font-medium text-foreground">{b.carModel}</td>
                      <td className="px-4 py-3.5 text-base font-medium text-foreground">{b.fuelType}</td>
                      <td className="px-4 py-3.5"><StatusBadge status={b.status} size="md" /></td>
                      <td className="px-4 py-3.5 text-base text-muted-foreground whitespace-nowrap">{getRelativeTime(b.createdAt)}</td>
                      <td className="px-4 py-3.5">
                        <div className="flex items-center justify-center gap-2">
                          <a 
                            href={`tel:${b.phone}`} 
                            className="p-2.5 rounded-xl hover:bg-green-500/10 text-green-600 transition-colors" 
                            title="Call"
                          >
                            <Phone size={18} />
                          </a>
                          <button 
                            onClick={() => openPanel(b)} 
                            className="p-2.5 rounded-xl hover:bg-primary/10 text-primary transition-colors" 
                            title="View Details"
                          >
                            <Eye size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Empty State */}
            {!bookings.length && (
              <div className="text-center py-16">
                <Calendar size={56} className="text-muted-foreground/30 mx-auto mb-4" />
                <p className="text-xl font-semibold text-foreground">No bookings found</p>
                <p className="text-base text-muted-foreground mt-2">Try adjusting your search or filters</p>
                {hasFilters && (
                  <button 
                    onClick={clearFilters} 
                    className="mt-6 px-6 py-3 bg-primary text-primary-foreground rounded-xl text-base font-semibold hover:bg-primary/90 transition-colors"
                  >
                    Clear All Filters
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Mobile Empty State */}
        {!bookings.length && (
          <div className="lg:hidden text-center py-16 px-6">
            <Calendar size={56} className="text-muted-foreground/30 mx-auto mb-4" />
            <p className="text-xl font-semibold text-foreground">No bookings found</p>
            <p className="text-base text-muted-foreground mt-2">Try adjusting your search or filters</p>
            {hasFilters && (
              <button 
                onClick={clearFilters} 
                className="mt-6 px-6 py-3 bg-primary text-primary-foreground rounded-xl text-base font-semibold"
              >
                Clear All Filters
              </button>
            )}
          </div>
        )}
      </div>

      {/* COMPACT PAGINATION */}
      <div className="flex-shrink-0 px-4 py-1.5 lg:px-6 border-t border-border bg-card flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground hidden sm:inline">Rows:</span>
          <select 
            value={limit} 
            onChange={(e) => { setLimit(+e.target.value); setPage(1); }} 
            className="px-2 py-1 rounded-lg bg-secondary border border-border text-sm font-medium cursor-pointer"
          >
            {PAGE_SIZES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-sm text-muted-foreground">
            <span className="hidden sm:inline">{(page - 1) * limit + 1}-{Math.min(page * limit, total)} of </span>
            <span className="font-semibold text-foreground">{total}</span>
          </span>
          <div className="flex items-center">
            <button 
              onClick={() => setPage(p => Math.max(1, p - 1))} 
              disabled={page === 1} 
              className="p-1 rounded-lg hover:bg-secondary disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft size={18} />
            </button>
            <span className="px-2 text-sm font-medium min-w-[50px] text-center">
              {page}/{totalPages}
            </span>
            <button 
              onClick={() => setPage(p => Math.min(totalPages, p + 1))} 
              disabled={page === totalPages} 
              className="p-1 rounded-lg hover:bg-secondary disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* DETAIL PANEL */}
      <DetailPanel
        booking={selectedBooking}
        isOpen={isPanelOpen}
        onClose={closePanel}
        onUpdate={handleUpdate}
        onDelete={handleDelete}
        isAdmin={isAdmin}
      />
    </div>
  );
};

export default BookingsManagement;