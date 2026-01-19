/**
 * ============================================
 * BOOKINGS MANAGEMENT - REDESIGNED V8
 * ============================================
 * Features:
 * - User-centric inline filter bar
 * - Status pills for quick filtering
 * - Active filter chips with easy removal
 * - Smart responsive design
 * - Compact yet accessible
 * - Fuel Type filter (replaced City filter)
 * - Brand filter linked to car_brands table
 * - Shared Dropdown component integration
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
  SlidersHorizontal,
  MapPin,
  Car,
  CarFront,
  Fuel,
  CircleDot,
  Settings,
  Hash,
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
import { getAllBrands, type CarBrand } from '../../services/api/carDataApi';
import { Dropdown, type DropdownOption } from './shared/Dropdown';

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

const STATUS_OPTIONS: DropdownOption[] = [
  { value: '', label: 'All Status' },
  { value: 'new', label: 'New' },
  { value: 'contacted', label: 'Contacted' },
  { value: 'scheduled', label: 'Scheduled' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' },
];

const STATUS_OPTIONS_NO_ALL: DropdownOption[] = STATUS_OPTIONS.filter(s => s.value !== '');

const DATE_FILTER_OPTIONS: DropdownOption[] = [
  { value: 'all', label: 'All Dates' },
  { value: 'today', label: 'Today' },
  { value: 'yesterday', label: 'Yesterday' },
  { value: 'last7days', label: 'Last 7 Days' },
  { value: 'custom', label: 'Custom Range' },
];

// Status colors mapping
const STATUS_STYLES: Record<BookingStatus, { bg: string; text: string; dot: string; border: string; activeBg: string }> = {
  new: { 
    bg: 'bg-blue-50 dark:bg-blue-500/15', 
    text: 'text-blue-700 dark:text-blue-400', 
    dot: 'bg-blue-500',
    border: 'border-blue-200 dark:border-blue-500/30',
    activeBg: 'bg-blue-500 text-white'
  },
  contacted: { 
    bg: 'bg-amber-50 dark:bg-amber-500/15', 
    text: 'text-amber-700 dark:text-amber-400', 
    dot: 'bg-amber-500',
    border: 'border-amber-200 dark:border-amber-500/30',
    activeBg: 'bg-amber-500 text-white'
  },
  scheduled: { 
    bg: 'bg-purple-50 dark:bg-purple-500/15', 
    text: 'text-purple-700 dark:text-purple-400', 
    dot: 'bg-purple-500',
    border: 'border-purple-200 dark:border-purple-500/30',
    activeBg: 'bg-purple-500 text-white'
  },
  completed: { 
    bg: 'bg-emerald-50 dark:bg-emerald-500/15', 
    text: 'text-emerald-700 dark:text-emerald-400', 
    dot: 'bg-emerald-500',
    border: 'border-emerald-200 dark:border-emerald-500/30',
    activeBg: 'bg-emerald-500 text-white'
  },
  cancelled: { 
    bg: 'bg-red-50 dark:bg-red-500/15', 
    text: 'text-red-700 dark:text-red-400', 
    dot: 'bg-red-500',
    border: 'border-red-200 dark:border-red-500/30',
    activeBg: 'bg-red-500 text-white'
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

const formatDateShort = (date: Date): string => {
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
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

// Active Filter Chip
const FilterChip: React.FC<{ label: string; value: string; onRemove: () => void }> = ({ label, value, onRemove }) => (
  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
    <span className="text-muted-foreground">{label}:</span>
    <span>{value}</span>
    <button 
      onClick={onRemove} 
      className="ml-0.5 p-0.5 rounded-full hover:bg-primary/20 transition-colors"
    >
      <X size={12} />
    </button>
  </span>
);

// ============================================
// BOOKING CARD (Mobile/Tablet View)
// ============================================

interface BookingCardProps {
  booking: Booking;
  index: number;
  pageOffset: number;
  isSelected: boolean;
  onToggleSelect: () => void;
  onView: () => void;
}

const BookingCard: React.FC<BookingCardProps> = ({ 
  booking, 
  index, 
  pageOffset, 
  isSelected, 
  onToggleSelect, 
  onView 
}) => {
  const serialNo = pageOffset + index + 1;

  return (
    <div className={`bg-card border border-border rounded-xl p-3 ${isSelected ? 'ring-2 ring-primary bg-primary/5' : ''}`}>
      {/* Header Row: Checkbox, ID, Status */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <button onClick={onToggleSelect} className="text-muted-foreground hover:text-foreground transition-colors">
            {isSelected ? <CheckSquare size={18} className="text-primary" /> : <Square size={18} />}
          </button>
          <span className="text-sm font-bold text-foreground">#{serialNo}</span>
        </div>
        <StatusBadge status={booking.status} size="sm" />
      </div>

      {/* Data Rows */}
      <div className="space-y-1.5 text-sm mb-3">
        {/* Vehicle - Full Width */}
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground">Vehicle:</span>
          <span className="font-semibold text-foreground">{booking.brandName} {booking.carModel}</span>
        </div>

        {/* Phone & City - Two Columns */}
        <div className="grid grid-cols-2 gap-x-4">
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">Phone:</span>
            <span className="font-medium text-foreground truncate">{formatPhone(booking.phone, booking.countryCode)}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">City:</span>
            <span className="font-medium text-foreground">{booking.city}</span>
          </div>
        </div>

        {/* Fuel & Date - Two Columns */}
        <div className="grid grid-cols-2 gap-x-4">
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">Fuel:</span>
            <span className="font-medium text-foreground">{booking.fuelType}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">Date:</span>
            <span className="text-muted-foreground">{getRelativeTime(booking.createdAt)}</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2 pt-2 border-t border-border">
        <a 
          href={`tel:${booking.phone}`} 
          className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-green-50 dark:bg-green-500/10 text-green-600 text-sm font-medium hover:bg-green-100 dark:hover:bg-green-500/20 transition-colors"
        >
          <Phone size={14} />
          Call
        </a>
        <button 
          onClick={onView} 
          className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-primary/10 text-primary text-sm font-medium hover:bg-primary/20 transition-colors"
        >
          <Eye size={14} />
          View
        </button>
      </div>
    </div>
  );
};

// ============================================
// BOOKING TABLE ROW (Desktop View)
// ============================================

interface BookingRowProps {
  booking: Booking;
  index: number;
  pageOffset: number;
  isSelected: boolean;
  onToggleSelect: () => void;
  onView: () => void;
}

const BookingRow: React.FC<BookingRowProps> = ({ 
  booking, 
  index, 
  pageOffset, 
  isSelected, 
  onToggleSelect, 
  onView 
}) => {
  const serialNo = pageOffset + index + 1;

  return (
    <tr className={`border-b border-border last:border-0 hover:bg-secondary/30 transition-colors ${isSelected ? 'bg-primary/5' : ''}`}>
      {/* Checkbox */}
      <td className="px-4 py-3">
        <button onClick={onToggleSelect} className="text-muted-foreground hover:text-foreground transition-colors">
          {isSelected ? <CheckSquare size={20} className="text-primary" /> : <Square size={20} />}
        </button>
      </td>
      
      {/* S.No */}
      <td className="px-3 py-3 text-center">
        <span className="inline-flex w-8 h-8 rounded-lg bg-secondary items-center justify-center text-sm font-bold text-muted-foreground">
          {serialNo}
        </span>
      </td>
      
      {/* Phone */}
      <td className="px-4 py-3">
        <span className="text-sm font-semibold text-foreground">{formatPhone(booking.phone, booking.countryCode)}</span>
      </td>
      
      {/* City */}
      <td className="px-4 py-3">
        <span className="text-sm font-medium text-foreground">{booking.city}</span>
      </td>
      
      {/* Brand */}
      <td className="px-4 py-3">
        <span className="text-sm font-medium text-foreground">{booking.brandName}</span>
      </td>
      
      {/* Model */}
      <td className="px-4 py-3">
        <span className="text-sm font-medium text-foreground">{booking.carModel}</span>
      </td>
      
      {/* Fuel */}
      <td className="px-4 py-3">
        <span className="text-sm font-medium text-foreground">{booking.fuelType}</span>
      </td>
      
      {/* Status */}
      <td className="px-4 py-3">
        <StatusBadge status={booking.status} size="sm" />
      </td>
      
      {/* Date */}
      <td className="px-4 py-3">
        <span className="text-sm text-muted-foreground whitespace-nowrap">{getRelativeTime(booking.createdAt)}</span>
      </td>
      
      {/* Actions */}
      <td className="px-4 py-3">
        <div className="flex items-center justify-center gap-1">
          <a 
            href={`tel:${booking.phone}`} 
            className="p-2 rounded-lg hover:bg-green-500/10 text-green-600 transition-colors" 
            title="Call"
          >
            <Phone size={16} />
          </a>
          <button 
            onClick={onView} 
            className="p-2 rounded-lg hover:bg-primary/10 text-primary transition-colors" 
            title="View Details"
          >
            <Eye size={16} />
          </button>
        </div>
      </td>
    </tr>
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
                      <Dropdown
                        options={STATUS_OPTIONS_NO_ALL}
                        value={status}
                        onChange={(val) => setStatus(val as BookingStatus)}
                        size="sm"
                        variant="default"
                      />
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
  const [facets, setFacets] = useState<{ fuelTypes: string[]; brands: string[] }>({ fuelTypes: [], brands: [] });
  const [allBrands, setAllBrands] = useState<CarBrand[]>([]);

  // Filter & Search States
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [statusFilter, setStatusFilter] = useState<BookingStatus | ''>('');
  const [fuelTypeFilter, setFuelTypeFilter] = useState('');
  const [brandFilter, setBrandFilter] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [dateFilter, setDateFilter] = useState<DateFilterType>('all');
  const [customRange, setCustomRange] = useState<DateRange>({ start: null, end: null });
  const [showMoreFilters, setShowMoreFilters] = useState(false);
  const [showCustomDatePicker, setShowCustomDatePicker] = useState(false);

  // Action States
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [bulkStatus, setBulkStatus] = useState<BookingStatus | ''>('');
  const [isBulkUpdating, setIsBulkUpdating] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  
  const hasLoadedRef = useRef(false);

  // Derived values
  const hasFilters = search || statusFilter || fuelTypeFilter || brandFilter || dateFilter !== 'all';
  const pageOffset = (page - 1) * limit;
  
  // Build dropdown options from data
  const fuelTypeOptions: DropdownOption[] = [
    { value: '', label: 'All Fuel Types' },
    ...(facets.fuelTypes || []).map(f => ({ value: f, label: f }))
  ];

  const brandOptions: DropdownOption[] = [
    { value: '', label: 'All Brands' },
    ...allBrands.map(b => ({ value: b._id, label: b.name }))
  ];

  // Count active filters for badge
  const activeFilters = [
    statusFilter && { label: 'Status', value: STATUS_OPTIONS.find(s => s.value === statusFilter)?.label || statusFilter, clear: () => setStatusFilter('') },
    fuelTypeFilter && { label: 'Fuel', value: fuelTypeFilter, clear: () => setFuelTypeFilter('') },
    brandFilter && { 
      label: 'Brand', 
      value: allBrands.find(b => b._id === brandFilter)?.name || brandFilter, 
      clear: () => setBrandFilter('') 
    },
    dateFilter !== 'all' && { 
      label: 'Date', 
      value: dateFilter === 'custom' && customRange.start && customRange.end 
        ? `${formatDateShort(customRange.start)} - ${formatDateShort(customRange.end)}`
        : DATE_FILTER_OPTIONS.find(d => d.value === dateFilter)?.label || dateFilter, 
      clear: () => { setDateFilter('all'); setCustomRange({ start: null, end: null }); }
    },
  ].filter(Boolean) as { label: string; value: string; clear: () => void }[];

  // Fetch all brands on component mount
  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const brands = await getAllBrands({ includeInactive: true });
        setAllBrands(brands);
      } catch (error) {
        console.error('Failed to fetch brands', error);
      }
    };
    fetchBrands();
  }, []);

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
        fuelType: fuelTypeFilter || undefined,
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
        setFacets({
          fuelTypes: Array.isArray(res.facets.fuelTypes) ? res.facets.fuelTypes : [],
          brands: Array.isArray(res.facets.brands) ? res.facets.brands : []
        });
      }
    } catch {
      setError('Failed to load bookings');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [page, limit, search, statusFilter, fuelTypeFilter, brandFilter, sortBy, sortOrder, dateFilter, customRange]);

  useEffect(() => {
    loadBookings(!hasLoadedRef.current ? false : true);
    hasLoadedRef.current = true;
  }, [page, search, statusFilter, fuelTypeFilter, brandFilter, sortBy, sortOrder, dateFilter, customRange]);

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
        fuelType: fuelTypeFilter || undefined,
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
  
  const clearAllFilters = () => { 
    setSearchInput(''); 
    setSearch(''); 
    setStatusFilter(''); 
    setFuelTypeFilter('');
    setBrandFilter('');
    setDateFilter('all'); 
    setCustomRange({ start: null, end: null }); 
    setPage(1);
    setShowMoreFilters(false);
  };
  
  const openPanel = (b: Booking) => { setSelectedBooking(b); setIsPanelOpen(true); };
  const closePanel = () => { setIsPanelOpen(false); setSelectedBooking(null); };

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
      {/* HEADER BAR */}
      <div className="flex-shrink-0 border-b border-border bg-card overflow-visible relative z-20">
        {/* Row 1: Search + Filter Toggle + Actions */}
        <div className="flex items-center gap-3 p-3 lg:px-4">
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search phone, city, brand..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full pl-9 pr-8 py-2.5 rounded-xl bg-secondary/50 border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all"
            />
            {searchInput && (
              <button 
                onClick={() => { setSearchInput(''); setSearch(''); }}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 rounded-lg hover:bg-secondary"
              >
                <X size={14} className="text-muted-foreground" />
              </button>
            )}
          </div>

          {/* Spacer */}
          <div className="flex-1" />

          {/* Actions */}
          <div className="flex items-center gap-1">
            {/* Filter Toggle Button */}
            <button
              onClick={() => setShowMoreFilters(!showMoreFilters)}
              className={`
                flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-all
                ${showMoreFilters || activeFilters.length > 0
                  ? 'bg-primary text-primary-foreground border-primary shadow-sm'
                  : 'bg-secondary/50 text-foreground border-border hover:bg-secondary hover:border-border'
                }
              `}
            >
              <SlidersHorizontal size={16} />
              <span>Filters</span>
              {activeFilters.length > 0 && (
                <span className={`
                  min-w-[20px] h-5 px-1.5 rounded-full text-xs font-bold flex items-center justify-center
                  ${showMoreFilters ? 'bg-primary-foreground text-primary' : 'bg-primary-foreground text-primary'}
                `}>
                  {activeFilters.length}
                </span>
              )}
            </button>
            <button 
              onClick={() => loadBookings(true)} 
              disabled={isRefreshing} 
              className="p-2.5 rounded-xl hover:bg-secondary border border-transparent hover:border-border disabled:opacity-50 transition-all"
              title="Refresh"
            >
              <RefreshCw size={18} className={`text-muted-foreground ${isRefreshing ? 'animate-spin' : ''}`} />
            </button>
            <button 
              onClick={handleExport} 
              disabled={isExporting} 
              className="p-2.5 rounded-xl hover:bg-secondary border border-transparent hover:border-border disabled:opacity-50 transition-all"
              title="Export CSV"
            >
              <Download size={18} className="text-muted-foreground" />
            </button>
          </div>
        </div>

        {/* Filter Panel (Collapsible) */}
        <AnimatePresence>
          {showMoreFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <div className="px-3 lg:px-4 pb-4 pt-1">
                <div className="p-4 rounded-2xl bg-secondary/30 border border-border space-y-4">
                  
                  {/* Show either Filters OR Custom Date Picker */}
                  <AnimatePresence mode="wait">
                    {!showCustomDatePicker ? (
                      /* Regular Filters */
                      <motion.div
                        key="filters"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.15 }}
                      >
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                          {/* Status Filter */}
                          <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                             
                              Status
                            </label>
                            <Dropdown
                              options={STATUS_OPTIONS}
                              value={statusFilter}
                              onChange={(val) => { setStatusFilter(val as BookingStatus | ''); setPage(1); }}
                              placeholder="All Status"
                              size="md"
                              variant="default"
                              fullWidth
                            />
                          </div>

                          {/* Fuel Type Filter */}
                          <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                              
                              Fuel Type
                            </label>
                            <Dropdown
                              options={fuelTypeOptions}
                              value={fuelTypeFilter}
                              onChange={(val) => { setFuelTypeFilter(val as string); setPage(1); }}
                              placeholder="All Fuel Types"
                              size="md"
                              variant="default"
                              fullWidth
                            />
                          </div>

                          {/* Brand Filter */}
                          <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                             
                              Brand
                            </label>
                            <Dropdown
                              options={brandOptions}
                              value={brandFilter}
                              onChange={(val) => { setBrandFilter(val as string); setPage(1); }}
                              placeholder="All Brands"
                              size="md"
                              variant="default"
                              fullWidth
                              searchable
                              searchPlaceholder="Search brands..."
                            />
                          </div>

                          {/* Date Range */}
                          <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                              
                              Date Range
                            </label>
                            <Dropdown
                              options={DATE_FILTER_OPTIONS}
                              value={dateFilter}
                              onChange={(val) => {
                                const value = val as DateFilterType;
                                if (value === 'custom') {
                                  setShowCustomDatePicker(true);
                                } else {
                                  setDateFilter(value);
                                  setPage(1);
                                }
                              }}
                              placeholder="All Dates"
                              size="md"
                              variant="default"
                              fullWidth
                              renderValue={(selected) => {
                                const opt = selected as DropdownOption;
                                if (opt.value === 'custom' && customRange.start && customRange.end) {
                                  return `${formatDateShort(customRange.start)} - ${formatDateShort(customRange.end)}`;
                                }
                                return opt.label;
                              }}
                            />
                          </div>
                        </div>
                      </motion.div>
                    ) : (
                      /* Custom Date Range Picker - Replaces Filters */
                      <motion.div
                        key="datepicker"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ duration: 0.15 }}
                      >
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-end gap-3">
                          {/* From Date */}
                          <div className="flex-1 space-y-1.5">
                            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">From</label>
                            <input
                              type="date"
                              value={formatDateForInput(customRange.start)}
                              onChange={(e) => setCustomRange({
                                ...customRange,
                                start: e.target.value ? new Date(e.target.value) : null
                              })}
                              className="w-full px-3 py-2.5 rounded-xl bg-background border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                            />
                          </div>

                          {/* To Date */}
                          <div className="flex-1 space-y-1.5">
                            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">To</label>
                            <input
                              type="date"
                              value={formatDateForInput(customRange.end)}
                              onChange={(e) => setCustomRange({
                                ...customRange,
                                end: e.target.value ? new Date(e.target.value) : null
                              })}
                              className="w-full px-3 py-2.5 rounded-xl bg-background border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                            />
                          </div>

                          {/* Apply Button */}
                          <button
                            onClick={() => { 
                              if (customRange.start && customRange.end) {
                                setDateFilter('custom'); 
                                setPage(1);
                              }
                              setShowCustomDatePicker(false); 
                            }}
                            disabled={!customRange.start || !customRange.end}
                            className="px-8 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold disabled:opacity-50 transition-all hover:bg-primary/90 whitespace-nowrap"
                          >
                            Apply
                          </button>

                          {/* Cancel Button */}
                          <button
                            onClick={() => { 
                              setShowCustomDatePicker(false);
                              if (dateFilter === 'custom' && (!customRange.start || !customRange.end)) {
                                setDateFilter('all');
                              }
                            }}
                            className="px-6 py-2.5 rounded-xl bg-secondary border border-border text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary/80 transition-all whitespace-nowrap"
                          >
                            Cancel
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Active Filters & Clear - Only show when not in custom date picker mode */}
                  {!showCustomDatePicker && activeFilters.length > 0 && (
                    <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-border/50">
                      <span className="text-xs font-medium text-muted-foreground">Active:</span>
                      {activeFilters.map((filter, i) => (
                        <FilterChip key={i} label={filter.label} value={filter.value} onRemove={filter.clear} />
                      ))}
                      <button 
                        onClick={clearAllFilters} 
                        className="ml-auto text-sm font-medium text-destructive hover:text-destructive/80 transition-colors"
                      >
                        Clear all
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Active Filters Preview (when panel is closed) */}
        {!showMoreFilters && activeFilters.length > 0 && (
          <div className="px-3 lg:px-4 pb-3 flex flex-wrap items-center gap-2">
            {activeFilters.map((filter, i) => (
              <FilterChip key={i} label={filter.label} value={filter.value} onRemove={filter.clear} />
            ))}
            <button 
              onClick={clearAllFilters} 
              className="text-xs font-medium text-muted-foreground hover:text-destructive transition-colors ml-1"
            >
              Clear all
            </button>
          </div>
        )}

        {/* Bulk Actions Bar */}
        <AnimatePresence>
          {selectedIds.size > 0 && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="border-t border-primary/20"
            >
              <div className="flex flex-wrap items-center gap-3 p-3 lg:px-4 bg-primary/5 relative">
                <div className="flex items-center gap-2">
                  <CheckSquare size={18} className="text-primary" />
                  <span className="text-sm font-semibold text-foreground">{selectedIds.size} selected</span>
                </div>
                <div className="flex-1" />
                <Dropdown
                  options={[
                    { value: '', label: 'Change status to...' },
                    ...STATUS_OPTIONS_NO_ALL
                  ]}
                  value={bulkStatus}
                  onChange={(val) => setBulkStatus(val as BookingStatus | '')}
                  placeholder="Change status to..."
                  size="sm"
                  variant="default"
                />
                <button 
                  onClick={handleBulkUpdate} 
                  disabled={!bulkStatus || isBulkUpdating} 
                  className="px-4 py-2 bg-primary text-primary-foreground text-sm font-semibold rounded-xl disabled:opacity-50 flex items-center gap-2 hover:bg-primary/90 transition-colors"
                >
                  {isBulkUpdating && <Loader2 size={14} className="animate-spin" />}
                  Apply
                </button>
                <button 
                  onClick={() => setSelectedIds(new Set())} 
                  className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-secondary transition-all"
                >
                  <X size={18} />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* CONTENT */}
      <div className="flex-1 overflow-auto">
        {/* Mobile/Tablet View - Cards */}
        <div className="block lg:hidden p-3 space-y-3">
          {bookings.map((b, i) => (
            <BookingCard 
              key={b._id} 
              booking={b} 
              index={i}
              pageOffset={pageOffset}
              isSelected={selectedIds.has(b._id)} 
              onToggleSelect={() => toggleSelect(b._id)} 
              onView={() => openPanel(b)} 
            />
          ))}

          {/* Mobile Empty State */}
          {!bookings.length && (
            <div className="text-center py-12">
              <Calendar size={48} className="text-muted-foreground/30 mx-auto mb-4" />
              <p className="text-lg font-semibold text-foreground">No bookings found</p>
              <p className="text-sm text-muted-foreground mt-2">Try adjusting your search or filters</p>
              {hasFilters && (
                <button 
                  onClick={clearAllFilters} 
                  className="mt-4 px-5 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-semibold hover:bg-primary/90 transition-colors"
                >
                  Clear All Filters
                </button>
              )}
            </div>
          )}
        </div>

        {/* Desktop View - Table */}
        <div className="hidden lg:block p-4">
          <div className="bg-card rounded-2xl border border-border overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-secondary/50 border-b border-border">
                  <tr>
                    <th className="w-14 px-4 py-3 text-left">
                      <button onClick={toggleAll} className="text-muted-foreground hover:text-foreground transition-colors">
                        {selectedIds.size === bookings.length && bookings.length > 0 ? (
                          <CheckSquare size={20} className="text-primary" />
                        ) : (
                          <Square size={20} />
                        )}
                      </button>
                    </th>
                    <th className="w-16 px-3 py-3 text-center text-xs font-bold text-muted-foreground uppercase tracking-wide">
                      <span className="flex items-center justify-center gap-1">
                        <Hash size={14} className="text-gray-500" />
                      </span>
                    </th>
                    <th className="px-4 py-3 text-left">
                      <button onClick={() => handleSort('phone')} className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground uppercase tracking-wide hover:text-foreground transition-colors">
                        <Phone size={14} className="text-green-500" />
                        Phone <ArrowUpDown size={12} />
                      </button>
                    </th>
                    <th className="px-4 py-3 text-left">
                      <button onClick={() => handleSort('city')} className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground uppercase tracking-wide hover:text-foreground transition-colors">
                        <MapPin size={14} className="text-blue-500" />
                        City <ArrowUpDown size={12} />
                      </button>
                    </th>
                    <th className="px-4 py-3 text-left">
                      <span className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground uppercase tracking-wide">
                        <Car size={14} className="text-purple-500" />
                        Brand
                      </span>
                    </th>
                    <th className="px-4 py-3 text-left">
                      <span className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground uppercase tracking-wide">
                        <CarFront size={14} className="text-indigo-500" />
                        Model
                      </span>
                    </th>
                    <th className="px-4 py-3 text-left">
                      <span className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground uppercase tracking-wide">
                        <Fuel size={14} className="text-amber-500" />
                        Fuel
                      </span>
                    </th>
                    <th className="px-4 py-3 text-left">
                      <button onClick={() => handleSort('status')} className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground uppercase tracking-wide hover:text-foreground transition-colors">
                        <CircleDot size={14} className="text-emerald-500" />
                        Status <ArrowUpDown size={12} />
                      </button>
                    </th>
                    <th className="px-4 py-3 text-left">
                      <button onClick={() => handleSort('createdAt')} className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground uppercase tracking-wide hover:text-foreground transition-colors">
                        <Calendar size={14} className="text-orange-500" />
                        Date <ArrowUpDown size={12} />
                      </button>
                    </th>
                    <th className="w-24 px-4 py-3 text-center text-xs font-bold text-muted-foreground uppercase tracking-wide">
                      <span className="flex items-center justify-center gap-1.5">
                        <Settings size={14} className="text-gray-500" />
                        Actions
                      </span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((b, i) => (
                    <BookingRow 
                      key={b._id} 
                      booking={b} 
                      index={i}
                      pageOffset={pageOffset}
                      isSelected={selectedIds.has(b._id)} 
                      onToggleSelect={() => toggleSelect(b._id)} 
                      onView={() => openPanel(b)} 
                    />
                  ))}
                </tbody>
              </table>
            </div>

            {/* Desktop Empty State */}
            {!bookings.length && (
              <div className="text-center py-16">
                <Calendar size={48} className="text-muted-foreground/30 mx-auto mb-4" />
                <p className="text-lg font-semibold text-foreground">No bookings found</p>
                <p className="text-sm text-muted-foreground mt-2">Try adjusting your search or filters</p>
                {hasFilters && (
                  <button 
                    onClick={clearAllFilters} 
                    className="mt-4 px-5 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-semibold hover:bg-primary/90 transition-colors"
                  >
                    Clear All Filters
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* COMPACT PAGINATION */}
      <div className="flex-shrink-0 px-3 py-2 lg:px-4 border-t border-border bg-card flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground hidden sm:inline">Show:</span>
          <select
            value={limit}
            onChange={(e) => { setLimit(Number(e.target.value)); setPage(1); }}
            className="px-3 py-1.5 rounded-lg bg-secondary/50 border border-border text-sm font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 cursor-pointer appearance-none pr-8 bg-no-repeat bg-[length:16px_16px] bg-[right_8px_center]"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`
            }}
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">
            <span className="font-semibold text-foreground">{total}</span>
            <span className="hidden sm:inline"> total</span>
          </span>
          <div className="flex items-center border border-border rounded-lg overflow-hidden">
            <button 
              onClick={() => setPage(p => Math.max(1, p - 1))} 
              disabled={page === 1} 
              className="p-1.5 hover:bg-secondary disabled:opacity-40 disabled:cursor-not-allowed transition-colors border-r border-border"
            >
              <ChevronLeft size={16} />
            </button>
            <span className="px-3 py-1 text-sm font-medium bg-secondary/30 min-w-[60px] text-center">
              {page} / {totalPages}
            </span>
            <button 
              onClick={() => setPage(p => Math.min(totalPages, p + 1))} 
              disabled={page === totalPages} 
              className="p-1.5 hover:bg-secondary disabled:opacity-40 disabled:cursor-not-allowed transition-colors border-l border-border"
            >
              <ChevronRight size={16} />
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