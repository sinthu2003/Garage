/**
 * ============================================
 * CONTACT INQUIRIES SCREEN - ENHANCED V4
 * ============================================
 * 
 * Modern contact inquiries with:
 * - Clean filter bar: Search, Filter icon, Refresh, Bell with count
 * - Collapsible filter dropdown panel
 * - Enhanced detail panel with better UX
 * - Quick actions and status management
 * - Responsive design optimized
 * 
 * @file src/admin-portal/screens/ContactInquiries.tsx
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mail,
  Inbox,
  Search,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Phone,
  AlertCircle,
  Loader2,
  Trash2,
  Reply,
  ExternalLink,
  AlertOctagon,
  Circle,
  MoreHorizontal,
  CheckCircle2,
  Tag,
  Sparkles,
  Copy,
  Eye,
  MailOpen,
  CheckCircle,
  X,
  Clock,
  MessageSquare,
  Bell,
  SlidersHorizontal,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import {
  listContactInquiries,
  getContactInquiryById,
  updateContactInquiry,
  deleteContactInquiry,
  type ContactInquiry,
  type InquiryStatus,
  type InquiryListOptions,
  formatPhone,
  getRelativeTime,
} from '../../services/api/bookingsApi';
import { Dropdown, type DropdownOption } from './shared/Dropdown';

// ============================================
// INTERFACES
// ============================================

interface ContactInquiriesProps {
  isDarkMode?: boolean;
}

// ============================================
// CONSTANTS
// ============================================

const STATUS_OPTIONS: DropdownOption[] = [
  { value: '', label: 'All Status', icon: <Inbox size={14} /> },
  { value: 'new', label: 'Unread', icon: <Circle size={14} className="text-blue-500" /> },
  { value: 'read', label: 'Read', icon: <MailOpen size={14} className="text-gray-500" /> },
  { value: 'replied', label: 'Replied', icon: <Reply size={14} className="text-green-500" /> },
  { value: 'resolved', label: 'Resolved', icon: <CheckCircle2 size={14} className="text-emerald-500" /> },
  { value: 'spam', label: 'Spam', icon: <AlertOctagon size={14} className="text-red-500" /> },
];

const STATUS_OPTIONS_NO_ALL: DropdownOption[] = STATUS_OPTIONS.filter(s => s.value !== '');

const PAGE_SIZES = [10, 20, 50, 100];

// ============================================
// ANIMATION VARIANTS
// ============================================

const listItemVariants = {
  hidden: { opacity: 0, x: -10 },
  visible: { opacity: 1, x: 0, transition: { type: 'spring' as const, stiffness: 400, damping: 30 } },
  exit: { opacity: 0, x: 10 },
};

const detailVariants = {
  hidden: { opacity: 0, x: 20 },
  visible: { opacity: 1, x: 0, transition: { type: 'spring' as const, stiffness: 300, damping: 25 } },
  exit: { opacity: 0, x: -20 },
};

// ============================================
// STATUS BADGE COMPONENT
// ============================================

const InquiryStatusBadge: React.FC<{ status: InquiryStatus; size?: 'sm' | 'md' }> = ({ status, size = 'sm' }) => {
  const statusConfig: Record<InquiryStatus, { icon: React.ReactNode; bg: string; text: string; border: string }> = {
    new: { 
      icon: <Sparkles size={size === 'sm' ? 10 : 12} />, 
      bg: 'bg-blue-500/10', 
      text: 'text-blue-600 dark:text-blue-400',
      border: 'border-blue-500/20'
    },
    read: { 
      icon: <Eye size={size === 'sm' ? 10 : 12} />, 
      bg: 'bg-gray-500/10', 
      text: 'text-gray-600 dark:text-gray-400',
      border: 'border-gray-500/20'
    },
    replied: { 
      icon: <Reply size={size === 'sm' ? 10 : 12} />, 
      bg: 'bg-green-500/10', 
      text: 'text-green-600 dark:text-green-400',
      border: 'border-green-500/20'
    },
    resolved: { 
      icon: <CheckCircle2 size={size === 'sm' ? 10 : 12} />, 
      bg: 'bg-emerald-500/10', 
      text: 'text-emerald-600 dark:text-emerald-400',
      border: 'border-emerald-500/20'
    },
    spam: { 
      icon: <AlertOctagon size={size === 'sm' ? 10 : 12} />, 
      bg: 'bg-red-500/10', 
      text: 'text-red-600 dark:text-red-400',
      border: 'border-red-500/20'
    },
  };

  const config = statusConfig[status] || statusConfig.new;
  const sizeClasses = size === 'sm' 
    ? 'px-2 py-0.5 text-[10px]' 
    : 'px-2.5 py-1 text-xs';

  return (
    <span className={`inline-flex items-center gap-1 rounded-full font-semibold 
      uppercase tracking-wide border ${config.bg} ${config.text} ${config.border} ${sizeClasses}`}>
      {config.icon}
      {status}
    </span>
  );
};

// ============================================
// INQUIRY LIST ITEM COMPONENT
// ============================================

interface InquiryListItemProps {
  inquiry: ContactInquiry;
  isSelected: boolean;
  onClick: () => void;
}

const InquiryListItem: React.FC<InquiryListItemProps> = ({ inquiry, isSelected, onClick }) => {
  const isUnread = inquiry.status === 'new';

  return (
    <motion.div
      variants={listItemVariants}
      layout
      onClick={onClick}
      className={`relative p-4 border-b border-border cursor-pointer transition-all group
        ${isSelected
          ? 'bg-primary/5 border-l-[3px] border-l-primary'
          : 'hover:bg-secondary/50 border-l-[3px] border-l-transparent'}
        ${isUnread ? 'bg-blue-500/[0.03]' : ''}`}
    >
      {/* Main Content */}
      <div className="flex items-start gap-3">
        {/* Avatar */}
        <div className="relative flex-shrink-0">
          <div className={`w-11 h-11 rounded-full flex items-center justify-center text-sm font-semibold
            ${isUnread
              ? 'bg-gradient-to-br from-primary to-primary/60 text-primary-foreground'
              : 'bg-secondary text-muted-foreground'}`}>
            {inquiry.name[0].toUpperCase()}
          </div>
          {isUnread && (
            <span className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-primary rounded-full 
              border-2 border-card" />
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <p className={`truncate ${isUnread ? 'font-bold text-foreground' : 'font-medium text-foreground'}`}>
              {inquiry.name}
            </p>
          </div>
          <p className="text-sm text-primary truncate font-medium mb-0.5">
            {inquiry.service || 'General Inquiry'}
          </p>
          <p className="text-xs text-muted-foreground line-clamp-1 leading-relaxed">
            {inquiry.message}
          </p>
        </div>

        {/* Meta */}
        <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
          <span className={`text-xs ${isUnread ? 'text-primary font-semibold' : 'text-muted-foreground'}`}>
            {getRelativeTime(inquiry.createdAt)}
          </span>
          <InquiryStatusBadge status={inquiry.status} />
        </div>
      </div>

      {/* Hover Actions */}
      <div className="absolute right-3 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 
        transition-opacity flex items-center gap-1">
        <button
          onClick={(e) => { e.stopPropagation(); window.location.href = `mailto:${inquiry.email}`; }}
          className="p-2 rounded-lg bg-card hover:bg-primary/10 border border-border shadow-sm transition-colors"
          title="Reply"
        >
          <Reply size={14} className="text-primary" />
        </button>
      </div>
    </motion.div>
  );
};

// ============================================
// COPY BUTTON COMPONENT
// ============================================

const CopyButton: React.FC<{ text: string }> = ({ text }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className="p-1.5 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
      title="Copy"
    >
      {copied ? <CheckCircle size={14} className="text-green-500" /> : <Copy size={14} />}
    </button>
  );
};

// ============================================
// INQUIRY DETAIL PANEL - ENHANCED
// ============================================

interface InquiryDetailProps {
  inquiry: ContactInquiry | null;
  onClose: () => void;
  onUpdate: (id: string, data: Partial<ContactInquiry>) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  isAdmin: boolean;
  isLoading: boolean;
}

const InquiryDetail: React.FC<InquiryDetailProps> = ({
  inquiry,
  onClose,
  onUpdate,
  onDelete,
  isAdmin,
  isLoading,
}) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClick = () => setShowMoreMenu(false);
    if (showMoreMenu) document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, [showMoreMenu]);

  // Empty State
  if (!inquiry) {
    return (
      <div className="flex-1 flex items-center justify-center text-muted-foreground bg-secondary/10">
        <div className="text-center p-8">
          <div className="w-24 h-24 rounded-full bg-secondary/50 flex items-center justify-center mx-auto mb-5">
            <MessageSquare size={40} className="text-muted-foreground/30" />
          </div>
          <p className="font-semibold text-foreground text-lg mb-2">Select a message</p>
          <p className="text-sm text-muted-foreground">Choose an inquiry from the list to view details</p>
        </div>
      </div>
    );
  }

  // Loading State
  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-card">
        <div className="text-center">
          <Loader2 size={36} className="animate-spin text-primary mx-auto mb-3" />
          <p className="text-muted-foreground">Loading message...</p>
        </div>
      </div>
    );
  }

  const handleStatusChange = async (newStatus: InquiryStatus) => {
    setIsUpdating(true);
    try {
      await onUpdate(inquiry._id, { status: newStatus });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await onDelete(inquiry._id);
      onClose();
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  const handleReply = () => {
    const subject = inquiry.service ? `Re: ${inquiry.service}` : 'Re: Your Inquiry';
    window.location.href = `mailto:${inquiry.email}?subject=${encodeURIComponent(subject)}`;
    handleStatusChange('replied');
  };

  return (
    <motion.div
      key={inquiry._id}
      variants={detailVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="flex-1 flex flex-col bg-card border-l border-border overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border bg-secondary/20">
        <div className="flex items-center gap-3">
          {/* Mobile Back Button */}
          <button
            onClick={onClose}
            className="md:hidden p-2 rounded-xl hover:bg-secondary text-muted-foreground"
          >
            <ChevronLeft size={20} />
          </button>
          
          {/* User Info */}
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-primary/60 
              flex items-center justify-center text-primary-foreground font-bold text-lg shadow-lg">
              {inquiry.name[0].toUpperCase()}
            </div>
            <div>
              <h3 className="font-semibold text-foreground text-lg leading-tight">{inquiry.name}</h3>
              <div className="flex items-center gap-2 mt-0.5">
                <Clock size={12} className="text-muted-foreground" />
                <span className="text-sm text-muted-foreground">{getRelativeTime(inquiry.createdAt)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {/* Status Dropdown */}
          <div className="w-32">
            <Dropdown
              options={STATUS_OPTIONS_NO_ALL}
              value={inquiry.status}
              onChange={(val) => handleStatusChange(val as InquiryStatus)}
              disabled={isUpdating}
              size="sm"
              variant="default"
              fullWidth
            />
          </div>

          {/* More Actions */}
          <div className="relative">
            <button 
              onClick={(e) => { e.stopPropagation(); setShowMoreMenu(!showMoreMenu); }}
              className="p-2.5 rounded-xl hover:bg-secondary text-muted-foreground transition-colors"
            >
              <MoreHorizontal size={18} />
            </button>
            
            <AnimatePresence>
              {showMoreMenu && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95, y: -5 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -5 }}
                  className="absolute right-0 top-full mt-2 w-52 py-2 bg-card rounded-xl border border-border 
                    shadow-xl z-20"
                >
                  <button
                    onClick={() => { handleStatusChange('spam'); setShowMoreMenu(false); }}
                    className="w-full px-4 py-2.5 text-left text-sm hover:bg-secondary flex items-center 
                      gap-3 text-muted-foreground transition-colors"
                  >
                    <AlertOctagon size={16} />
                    Mark as Spam
                  </button>
                  <button
                    onClick={() => { handleStatusChange('resolved'); setShowMoreMenu(false); }}
                    className="w-full px-4 py-2.5 text-left text-sm hover:bg-secondary flex items-center 
                      gap-3 text-muted-foreground transition-colors"
                  >
                    <CheckCircle2 size={16} />
                    Mark as Resolved
                  </button>
                  {isAdmin && (
                    <>
                      <div className="my-2 border-t border-border" />
                      <button
                        onClick={() => { setShowDeleteConfirm(true); setShowMoreMenu(false); }}
                        className="w-full px-4 py-2.5 text-left text-sm hover:bg-destructive/10 flex items-center 
                          gap-3 text-destructive transition-colors"
                      >
                        <Trash2 size={16} />
                        Delete Permanently
                      </button>
                    </>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-5 space-y-5">
        {/* Service Tag */}
        {inquiry.service && (
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary/10 
              text-primary text-sm font-medium border border-primary/20">
              <Tag size={14} />
              {inquiry.service}
            </span>
          </div>
        )}

        {/* Contact Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Email Card */}
          <div className="p-4 rounded-xl bg-secondary/30 border border-border hover:border-primary/30 
            transition-colors group">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">
                Email
              </span>
              <CopyButton text={inquiry.email} />
            </div>
            <a 
              href={`mailto:${inquiry.email}`} 
              className="flex items-center gap-3 text-foreground font-medium hover:text-primary 
                transition-colors group-hover:text-primary"
            >
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center 
                group-hover:bg-primary/20 transition-colors">
                <Mail size={18} className="text-primary" />
              </div>
              <span className="truncate">{inquiry.email}</span>
            </a>
          </div>

          {/* Phone Card */}
          <div className="p-4 rounded-xl bg-secondary/30 border border-border hover:border-green-500/30 
            transition-colors group">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">
                Phone
              </span>
              {inquiry.phone && <CopyButton text={inquiry.phone} />}
            </div>
            {inquiry.phone ? (
              <a 
                href={`tel:${inquiry.phone}`} 
                className="flex items-center gap-3 text-foreground font-medium hover:text-green-600 
                  transition-colors group-hover:text-green-600"
              >
                <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center 
                  group-hover:bg-green-500/20 transition-colors">
                  <Phone size={18} className="text-green-500" />
                </div>
                <span>{formatPhone(inquiry.phone, inquiry.countryCode)}</span>
              </a>
            ) : (
              <div className="flex items-center gap-3 text-muted-foreground">
                <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
                  <Phone size={18} />
                </div>
                <span className="italic">Not provided</span>
              </div>
            )}
          </div>
        </div>

        {/* Message Section */}
        <div>
          <span className="text-xs text-muted-foreground font-semibold uppercase tracking-wider mb-3 block">
            Message
          </span>
          <div className="p-5 rounded-xl bg-secondary/20 border border-border">
            <p className="text-foreground leading-relaxed whitespace-pre-wrap text-[15px]">
              {inquiry.message}
            </p>
          </div>
        </div>

        {/* Reply Info (if replied) */}
        {inquiry.status === 'replied' && inquiry.repliedAt && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Reply size={14} className="text-green-500" />
            <span>Replied {getRelativeTime(inquiry.repliedAt)}</span>
            {inquiry.repliedBy && (
              <span className="text-foreground font-medium">by {inquiry.repliedBy.name}</span>
            )}
          </div>
        )}

        {/* Delete Confirmation */}
        <AnimatePresence>
          {showDeleteConfirm && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="p-5 rounded-xl bg-destructive/10 border border-destructive/30"
            >
              <div className="flex items-start gap-4 mb-4">
                <div className="p-2.5 rounded-xl bg-destructive/20 flex-shrink-0">
                  <AlertCircle size={20} className="text-destructive" />
                </div>
                <div>
                  <p className="text-destructive font-semibold mb-1">Delete this inquiry?</p>
                  <p className="text-sm text-muted-foreground">This action cannot be undone.</p>
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 px-4 py-2.5 bg-secondary text-foreground rounded-xl font-medium text-sm
                    hover:bg-secondary/80 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="flex-1 px-4 py-2.5 bg-destructive text-destructive-foreground rounded-xl 
                    font-medium text-sm flex items-center justify-center gap-2 disabled:opacity-50
                    hover:bg-destructive/90 transition-colors"
                >
                  {isDeleting && <Loader2 size={14} className="animate-spin" />}
                  Delete
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer Actions */}
      <div className="p-4 border-t border-border bg-secondary/10 flex items-center gap-3">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleReply}
          className="flex items-center gap-2 px-6 py-2.5 bg-primary text-primary-foreground 
            rounded-xl font-semibold text-sm hover:bg-primary/90 transition-colors shadow-sm"
        >
          <Reply size={16} />
          Reply
        </motion.button>

        <a
          href={inquiry.phone ? `tel:${inquiry.phone}` : '#'}
          className={`flex items-center gap-2 px-5 py-2.5 bg-green-500/10 text-green-600 
            rounded-xl font-medium text-sm hover:bg-green-500/20 transition-colors
            ${!inquiry.phone ? 'opacity-50 pointer-events-none' : ''}`}
        >
          <Phone size={16} />
          Call
        </a>

        <div className="flex-1" />

        <a
          href={`mailto:${inquiry.email}`}
          target="_blank"
          rel="noopener noreferrer"
          className="p-2.5 rounded-xl hover:bg-secondary text-muted-foreground transition-colors"
          title="Open in email client"
        >
          <ExternalLink size={18} />
        </a>
      </div>
    </motion.div>
  );
};

// ============================================
// MAIN CONTACT INQUIRIES COMPONENT
// ============================================

export const ContactInquiries: React.FC<ContactInquiriesProps> = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  // Loading states
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoadingDetail, setIsLoadingDetail] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Data states
  const [inquiries, setInquiries] = useState<ContactInquiry[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedInquiry, setSelectedInquiry] = useState<ContactInquiry | null>(null);

  // Filter states
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [statusFilter, setStatusFilter] = useState<InquiryStatus | ''>('');
  const [showMobileDetail, setShowMobileDetail] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const hasLoadedRef = useRef(false);

  // Computed values
  const unreadCount = (inquiries || []).filter(i => i.status === 'new').length;
  const hasActiveFilter = statusFilter !== '';

  // Load inquiries
  const loadInquiries = useCallback(async (showRefresh = false) => {
    try {
      if (showRefresh) setIsRefreshing(true);
      else setIsLoading(true);
      setError(null);

      const options: InquiryListOptions = { page, limit };
      if (search) options.search = search;
      if (statusFilter) options.status = statusFilter;

      const response = await listContactInquiries(options);
      setInquiries(response.items || []);
      setTotal(response.total || 0);
      setTotalPages(response.totalPages || 1);
    } catch (err) {
      console.error('Load inquiries error:', err);
      setError('Failed to load inquiries.');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [page, limit, search, statusFilter]);

  useEffect(() => {
    loadInquiries(!hasLoadedRef.current ? false : true);
    hasLoadedRef.current = true;
  }, [page, limit, search, statusFilter]);

  // Search debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchInput !== search) {
        setSearch(searchInput);
        setPage(1);
      }
    }, 400);
    return () => clearTimeout(timer);
  }, [searchInput]);

  // Handlers
  const handleSelectInquiry = async (inquiry: ContactInquiry) => {
    setSelectedInquiry(inquiry);
    setShowMobileDetail(true);
    if (inquiry.status === 'new') {
      setIsLoadingDetail(true);
      try {
        const fullInquiry = await getContactInquiryById(inquiry._id);
        setSelectedInquiry(fullInquiry);
        setInquiries(prev => prev.map(i => i._id === inquiry._id ? { ...i, status: 'read' } : i));
      } finally {
        setIsLoadingDetail(false);
      }
    }
  };

  const handleUpdateInquiry = async (id: string, data: Partial<ContactInquiry>) => {
    await updateContactInquiry(id, data);
    setInquiries(prev => prev.map(i => i._id === id ? { ...i, ...data } : i));
    if (selectedInquiry?._id === id) setSelectedInquiry(prev => prev ? { ...prev, ...data } : null);
  };

  const handleDeleteInquiry = async (id: string) => {
    await deleteContactInquiry(id);
    setInquiries(prev => prev.filter(i => i._id !== id));
    setSelectedInquiry(null);
    setShowMobileDetail(false);
  };

  const clearFilters = () => {
    setStatusFilter('');
    setPage(1);
    setShowFilters(false);
  };

  // Loading state
  if (isLoading && !hasLoadedRef.current) {
    return (
      <div className="flex items-center justify-center h-full min-h-[500px]">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="relative">
            <div className="w-20 h-20 border-4 border-primary/20 rounded-full animate-pulse" />
            <Loader2 size={32} className="animate-spin text-primary absolute top-1/2 left-1/2 
              -translate-x-1/2 -translate-y-1/2" />
          </div>
          <p className="text-muted-foreground mt-4 font-medium">Loading messages...</p>
        </motion.div>
      </div>
    );
  }

  // Error state
  if (error && inquiries.length === 0) {
    return (
      <div className="flex items-center justify-center h-full min-h-[500px]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-md"
        >
          <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-4">
            <AlertCircle size={32} className="text-destructive" />
          </div>
          <h3 className="text-foreground font-semibold text-lg mb-2">Failed to load messages</h3>
          <p className="text-muted-foreground mb-6">{error}</p>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => loadInquiries()}
            className="px-6 py-3 bg-primary text-primary-foreground rounded-xl flex items-center gap-2 mx-auto font-medium"
          >
            <RefreshCw size={18} />
            Try Again
          </motion.button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex h-full overflow-hidden bg-background">
      {/* ============================================ */}
      {/* LIST PANEL */}
      {/* ============================================ */}
      <div className={`w-full md:w-[380px] lg:w-[420px] flex flex-col border-r border-border bg-card
        ${showMobileDetail ? 'hidden md:flex' : 'flex'}`}
      >
        {/* ============================================ */}
        {/* NEW FILTER BAR: Search | Filter | Refresh | Bell */}
        {/* ============================================ */}
        <div className="flex-shrink-0 border-b border-border relative z-20">
          <div className="flex items-center gap-2 p-3">
            {/* Search Input */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search messages..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-secondary/50 border border-border 
                  text-foreground text-sm placeholder:text-muted-foreground 
                  focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 
                  focus:bg-background transition-all"
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

            {/* Filter Button */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`relative p-2.5 rounded-xl border transition-all
                ${showFilters || hasActiveFilter
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'bg-secondary/50 text-muted-foreground border-border hover:bg-secondary hover:text-foreground'
                }`}
              title="Filters"
            >
              <SlidersHorizontal size={18} />
              {hasActiveFilter && !showFilters && (
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-primary rounded-full border-2 border-card" />
              )}
            </button>

            {/* Refresh Button */}
            <button
              onClick={() => loadInquiries(true)}
              disabled={isRefreshing}
              className="p-2.5 rounded-xl bg-secondary/50 border border-border text-muted-foreground 
                hover:bg-secondary hover:text-foreground disabled:opacity-50 transition-all"
              title="Refresh"
            >
              <RefreshCw size={18} className={isRefreshing ? 'animate-spin' : ''} />
            </button>

            {/* Bell Button with Unread Count */}
            <button
              onClick={() => { setStatusFilter('new'); setPage(1); setShowFilters(false); }}
              className={`relative p-2.5 rounded-xl border transition-all
                ${statusFilter === 'new'
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'bg-secondary/50 text-muted-foreground border-border hover:bg-secondary hover:text-foreground'
                }`}
              title={`${unreadCount} unread messages`}
            >
              <Bell size={18} />
              {unreadCount > 0 && (
                <span className={`absolute -top-1.5 -right-1.5 min-w-[20px] h-5 px-1.5 
                  rounded-full text-[11px] font-bold flex items-center justify-center
                  ${statusFilter === 'new' 
                    ? 'bg-primary-foreground text-primary' 
                    : 'bg-primary text-primary-foreground'
                  }`}>
                  {unreadCount > 99 ? '99+' : unreadCount}
                </span>
              )}
            </button>
          </div>

          {/* Collapsible Filter Dropdown */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.15 }}
                className="relative z-30"
              >
                <div className="px-3 pb-3">
                  <div className="p-3 rounded-xl bg-secondary/30 border border-border space-y-3">
                    {/* Status Filter */}
                    <div className="relative z-40">
                      <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">
                        Status
                      </label>
                      <Dropdown
                        options={STATUS_OPTIONS}
                        value={statusFilter}
                        onChange={(val) => { setStatusFilter(val as InquiryStatus | ''); setPage(1); }}
                        placeholder="All Status"
                        size="md"
                        variant="default"
                        fullWidth
                      />
                    </div>

                    {/* Clear & Apply Buttons */}
                    {hasActiveFilter && (
                      <div className="flex items-center justify-between pt-2 border-t border-border/50">
                        <button
                          onClick={clearFilters}
                          className="text-sm font-medium text-destructive hover:text-destructive/80 transition-colors"
                        >
                          Clear filters
                        </button>
                        <button
                          onClick={() => setShowFilters(false)}
                          className="px-4 py-1.5 text-sm font-medium bg-primary text-primary-foreground 
                            rounded-lg hover:bg-primary/90 transition-colors"
                        >
                          Done
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Active Filter Indicator (when filter panel is closed) */}
          {!showFilters && hasActiveFilter && (
            <div className="px-3 pb-2">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full 
                  bg-primary/10 text-primary text-xs font-medium">
                  {STATUS_OPTIONS.find(s => s.value === statusFilter)?.icon}
                  {STATUS_OPTIONS.find(s => s.value === statusFilter)?.label}
                  <button 
                    onClick={clearFilters}
                    className="ml-0.5 p-0.5 rounded-full hover:bg-primary/20"
                  >
                    <X size={12} />
                  </button>
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Messages List */}
        <div className="flex-1 overflow-y-auto relative z-10">
          <AnimatePresence mode="popLayout">
            {inquiries.map((inquiry) => (
              <InquiryListItem
                key={inquiry._id}
                inquiry={inquiry}
                isSelected={selectedInquiry?._id === inquiry._id}
                onClick={() => handleSelectInquiry(inquiry)}
              />
            ))}
          </AnimatePresence>

          {/* Empty State */}
          {inquiries.length === 0 && (
            <div className="text-center py-16 px-6">
              <div className="w-20 h-20 rounded-full bg-secondary/50 flex items-center justify-center mx-auto mb-4">
                <Inbox size={32} className="text-muted-foreground/40" />
              </div>
              <p className="text-foreground font-semibold text-lg mb-1">No messages found</p>
              <p className="text-muted-foreground text-sm">
                {search || statusFilter ? 'Try adjusting your filters' : 'New inquiries will appear here'}
              </p>
              {(search || statusFilter) && (
                <button
                  onClick={() => { setSearchInput(''); setSearch(''); setStatusFilter(''); }}
                  className="mt-4 px-4 py-2 text-sm text-primary hover:underline"
                >
                  Clear filters
                </button>
              )}
            </div>
          )}
        </div>

        {/* Compact Pagination - Native Select */}
        <div className="flex-shrink-0 px-3 py-2 border-t border-border bg-secondary/10 
          flex items-center justify-between gap-2">
          {/* Page Size Selector */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground hidden sm:inline">Show:</span>
            <select 
              value={limit} 
              onChange={(e) => { setLimit(+e.target.value); setPage(1); }} 
              className="px-2 py-1.5 rounded-lg bg-background border border-border text-sm font-medium 
                cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/50"
            >
              {PAGE_SIZES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          {/* Total & Pagination Controls */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              <span className="font-semibold text-foreground">{total}</span>
              <span className="hidden sm:inline"> total</span>
            </span>
            <div className="flex items-center border border-border rounded-lg overflow-hidden">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-1.5 hover:bg-secondary disabled:opacity-40 disabled:cursor-not-allowed 
                  transition-colors border-r border-border"
              >
                <ChevronLeft size={16} />
              </button>
              <span className="px-3 py-1 text-sm font-medium bg-secondary/30 min-w-[60px] text-center">
                {page} / {totalPages}
              </span>
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="p-1.5 hover:bg-secondary disabled:opacity-40 disabled:cursor-not-allowed 
                  transition-colors border-l border-border"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ============================================ */}
      {/* DETAIL PANEL */}
      {/* ============================================ */}
      <div className={`flex-1 ${showMobileDetail ? 'flex' : 'hidden md:flex'}`}>
        <AnimatePresence mode="wait">
          <InquiryDetail
            key={selectedInquiry?._id || 'empty'}
            inquiry={selectedInquiry}
            onClose={() => { setSelectedInquiry(null); setShowMobileDetail(false); }}
            onUpdate={handleUpdateInquiry}
            onDelete={handleDeleteInquiry}
            isAdmin={isAdmin}
            isLoading={isLoadingDetail}
          />
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ContactInquiries;