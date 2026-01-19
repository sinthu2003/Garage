/**
 * ============================================
 * CONTACT INQUIRIES SCREEN - REDESIGNED
 * ============================================
 * 
 * Modern contact inquiries with:
 * - Inbox-style layout with preview
 * - Clean detail panel (Email, Phone, Message)
 * - Quick reply functionality
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
  ChevronDown,
  Copy,
  Eye,
  MailOpen,
  CheckCircle,
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

// ============================================
// INTERFACES
// ============================================

interface ContactInquiriesProps {
  isDarkMode?: boolean;
}

// ============================================
// CONSTANTS
// ============================================

const STATUS_OPTIONS: { value: InquiryStatus | ''; label: string; icon: React.ReactNode; color: string }[] = [
  { value: '', label: 'All Messages', icon: <Inbox size={14} />, color: 'text-muted-foreground' },
  { value: 'new', label: 'Unread', icon: <Circle size={14} />, color: 'text-blue-500' },
  { value: 'read', label: 'Read', icon: <MailOpen size={14} />, color: 'text-gray-500' },
  { value: 'replied', label: 'Replied', icon: <Reply size={14} />, color: 'text-green-500' },
  { value: 'resolved', label: 'Resolved', icon: <CheckCircle2 size={14} />, color: 'text-emerald-500' },
  { value: 'spam', label: 'Spam', icon: <AlertOctagon size={14} />, color: 'text-red-500' },
];

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

const InquiryStatusBadge: React.FC<{ status: InquiryStatus }> = ({ status }) => {
  const statusConfig: Record<InquiryStatus, { icon: React.ReactNode; bg: string; text: string }> = {
    new: { icon: <Sparkles size={10} />, bg: 'bg-blue-500/10', text: 'text-blue-600' },
    read: { icon: <Eye size={10} />, bg: 'bg-gray-500/10', text: 'text-gray-600' },
    replied: { icon: <Reply size={10} />, bg: 'bg-green-500/10', text: 'text-green-600' },
    resolved: { icon: <CheckCircle2 size={10} />, bg: 'bg-emerald-500/10', text: 'text-emerald-600' },
    spam: { icon: <AlertOctagon size={10} />, bg: 'bg-red-500/10', text: 'text-red-600' },
  };

  const config = statusConfig[status] || statusConfig.new;

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold 
      uppercase tracking-wide ${config.bg} ${config.text}`}>
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
            <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-primary rounded-full 
              border-2 border-card animate-pulse" />
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <p className={`truncate ${isUnread ? 'font-bold text-foreground' : 'font-medium text-foreground'}`}>
              {inquiry.name}
            </p>
          </div>
          <p className="text-sm text-primary truncate font-medium mb-0.5">
            {inquiry.service || 'General Inquiry'}
          </p>
          <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
            {inquiry.message}
          </p>
        </div>

        {/* Meta */}
        <div className="flex flex-col items-end gap-2 flex-shrink-0">
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
          className="p-2 rounded-lg bg-card hover:bg-secondary border border-border shadow-sm"
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

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className="p-1.5 rounded-lg hover:bg-secondary text-muted-foreground transition-colors"
      title="Copy"
    >
      {copied ? <CheckCircle size={14} className="text-green-500" /> : <Copy size={14} />}
    </button>
  );
};

// ============================================
// INQUIRY DETAIL PANEL - REDESIGNED
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

  // Empty State
  if (!inquiry) {
    return (
      <div className="flex-1 flex items-center justify-center text-muted-foreground bg-secondary/20">
        <div className="text-center p-8">
          <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center mx-auto mb-4">
            <Inbox size={36} className="text-muted-foreground/40" />
          </div>
          <p className="font-medium text-foreground text-lg mb-1">Select a message</p>
          <p className="text-sm">Choose an inquiry from the list to view details</p>
        </div>
      </div>
    );
  }

  // Loading State
  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
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
      <div className="flex items-center justify-between p-4 border-b border-border bg-secondary/30">
        <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            className="md:hidden p-2 rounded-xl hover:bg-secondary text-muted-foreground"
          >
            <ChevronLeft size={20} />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-primary/60 
              flex items-center justify-center text-primary-foreground font-bold text-lg">
              {inquiry.name[0].toUpperCase()}
            </div>
            <div>
              <h3 className="font-semibold text-foreground text-lg">{inquiry.name}</h3>
              <span className="text-sm text-muted-foreground">{getRelativeTime(inquiry.createdAt)}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Status Dropdown */}
          <div className="relative">
            <select
              value={inquiry.status}
              onChange={(e) => handleStatusChange(e.target.value as InquiryStatus)}
              disabled={isUpdating}
              className="appearance-none px-4 py-2 pr-8 rounded-xl bg-secondary border border-border 
                text-foreground text-sm font-medium disabled:opacity-50 cursor-pointer"
            >
              {STATUS_OPTIONS.filter(s => s.value).map((s) => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 
              text-muted-foreground pointer-events-none" />
          </div>

          {/* More Actions */}
          <div className="relative group">
            <button className="p-2.5 rounded-xl hover:bg-secondary text-muted-foreground">
              <MoreHorizontal size={18} />
            </button>
            <div className="absolute right-0 top-full mt-1 w-48 py-1 bg-card rounded-xl border border-border 
              shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
              <button
                onClick={() => handleStatusChange('spam')}
                className="w-full px-4 py-2 text-left text-sm hover:bg-secondary flex items-center gap-2 text-muted-foreground"
              >
                <AlertOctagon size={14} />
                Mark as Spam
              </button>
              <button
                onClick={() => handleStatusChange('resolved')}
                className="w-full px-4 py-2 text-left text-sm hover:bg-secondary flex items-center gap-2 text-muted-foreground"
              >
                <CheckCircle2 size={14} />
                Mark as Resolved
              </button>
              {isAdmin && (
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="w-full px-4 py-2 text-left text-sm hover:bg-destructive/10 flex items-center gap-2 text-destructive"
                >
                  <Trash2 size={14} />
                  Delete
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Content - Redesigned */}
      <div className="flex-1 overflow-y-auto p-5">
        {/* Service Tag */}
        {inquiry.service && (
          <div className="mb-5">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary/10 
              text-primary text-sm font-medium border border-primary/20">
              <Tag size={14} />
              {inquiry.service}
            </span>
          </div>
        )}

        {/* Contact Cards - Email & Phone */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
          {/* Email Card */}
          <div className="p-4 rounded-xl bg-secondary/40 border border-border">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-muted-foreground font-medium uppercase tracking-wide">Email</span>
              <CopyButton text={inquiry.email} />
            </div>
            <a 
              href={`mailto:${inquiry.email}`} 
              className="flex items-center gap-2 text-foreground font-medium hover:text-primary transition-colors"
            >
              <Mail size={18} className="text-primary flex-shrink-0" />
              <span className="truncate">{inquiry.email}</span>
            </a>
          </div>

          {/* Phone Card */}
          <div className="p-4 rounded-xl bg-secondary/40 border border-border">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-muted-foreground font-medium uppercase tracking-wide">Phone</span>
              {inquiry.phone && <CopyButton text={inquiry.phone} />}
            </div>
            {inquiry.phone ? (
              <a 
                href={`tel:${inquiry.phone}`} 
                className="flex items-center gap-2 text-foreground font-medium hover:text-primary transition-colors"
              >
                <Phone size={18} className="text-green-500 flex-shrink-0" />
                <span>{formatPhone(inquiry.phone, inquiry.countryCode)}</span>
              </a>
            ) : (
              <span className="flex items-center gap-2 text-muted-foreground">
                <Phone size={18} className="flex-shrink-0" />
                <span>Not provided</span>
              </span>
            )}
          </div>
        </div>

        {/* Message Section */}
        <div className="mb-5">
          <span className="text-xs text-muted-foreground font-medium uppercase tracking-wide mb-3 block">
            Message
          </span>
          <div className="p-5 rounded-xl bg-secondary/30 border border-border">
            <p className="text-foreground leading-relaxed whitespace-pre-wrap">
              {inquiry.message}
            </p>
          </div>
        </div>

        {/* Delete Confirmation */}
        <AnimatePresence>
          {showDeleteConfirm && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="p-5 rounded-xl bg-destructive/10 border border-destructive/30"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-destructive/20">
                  <AlertCircle size={18} className="text-destructive" />
                </div>
                <p className="text-destructive font-medium">Delete this inquiry permanently?</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-4 py-2.5 bg-secondary text-foreground rounded-xl font-medium text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="px-4 py-2.5 bg-destructive text-destructive-foreground rounded-xl font-medium 
                    text-sm flex items-center gap-2 disabled:opacity-50"
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
      <div className="p-4 border-t border-border bg-secondary/20 flex items-center gap-3">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleReply}
          className="flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground 
            rounded-xl font-medium text-sm hover:bg-primary/90"
        >
          <Reply size={16} />
          Reply
        </motion.button>

        <a
          href={`tel:${inquiry.phone}`}
          className={`flex items-center gap-2 px-4 py-2.5 bg-green-500/10 text-green-600 
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
          className="p-2.5 rounded-xl hover:bg-secondary text-muted-foreground"
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
  const [limit] = useState(20);
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [statusFilter, setStatusFilter] = useState<InquiryStatus | ''>('');
  const [showMobileDetail, setShowMobileDetail] = useState(false);

  const hasLoadedRef = useRef(false);

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
  }, [page, search, statusFilter]);

  // Search debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchInput !== search) {
        setSearch(searchInput);
        setPage(1);
      }
    }, 500);
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

  const unreadCount = (inquiries || []).filter(i => i.status === 'new').length;

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
      {/* LIST PANEL - UNCHANGED */}
      {/* ============================================ */}
      <div className={`w-full md:w-[380px] lg:w-[420px] flex flex-col border-r border-border bg-card
        ${showMobileDetail ? 'hidden md:flex' : 'flex'}`}
      >
        {/* Header */}
        <div className="flex-shrink-0 p-4 md:p-5 border-b border-border bg-secondary/30">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-bold text-foreground flex items-center gap-3">
              <div className="p-2 rounded-xl bg-primary/10">
                <Mail className="text-primary" size={20} />
              </div>
              Messages
              {unreadCount > 0 && (
                <span className="px-2.5 py-1 text-xs font-bold bg-primary text-primary-foreground rounded-full">
                  {unreadCount}
                </span>
              )}
            </h1>
            <button
              onClick={() => loadInquiries(true)}
              disabled={isRefreshing}
              className="p-2.5 rounded-xl hover:bg-secondary text-muted-foreground disabled:opacity-50 transition-colors"
            >
              <RefreshCw size={18} className={isRefreshing ? 'animate-spin' : ''} />
            </button>
          </div>

          {/* Search & Filter */}
          <div className="flex items-center gap-2">
            <div className="flex-1 relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search messages..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-secondary border border-border 
                  text-foreground text-sm placeholder:text-muted-foreground focus:border-primary/50 transition-colors"
              />
            </div>
            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => { setStatusFilter(e.target.value as InquiryStatus | ''); setPage(1); }}
                className="appearance-none px-4 py-2.5 pr-8 rounded-xl bg-secondary border border-border 
                  text-foreground text-sm cursor-pointer"
              >
                {STATUS_OPTIONS.map((s) => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </select>
              <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 
                text-muted-foreground pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Messages List */}
        <div className="flex-1 overflow-y-auto">
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

          {inquiries.length === 0 && (
            <div className="text-center py-16 px-6">
              <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mx-auto mb-4">
                <Inbox size={28} className="text-muted-foreground/40" />
              </div>
              <p className="text-foreground font-medium">No messages found</p>
              <p className="text-muted-foreground text-sm mt-1">
                {search || statusFilter ? 'Try adjusting your filters' : 'New inquiries will appear here'}
              </p>
            </div>
          )}
        </div>

        {/* Pagination */}
        <div className="flex-shrink-0 p-3 border-t border-border bg-secondary/20 
          flex items-center justify-between">
          <span className="text-sm text-muted-foreground">{total} total</span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="p-1.5 rounded-lg hover:bg-secondary disabled:opacity-50"
            >
              <ChevronLeft size={16} />
            </button>
            <span className="px-3 text-sm font-medium text-muted-foreground">{page}/{totalPages}</span>
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="p-1.5 rounded-lg hover:bg-secondary disabled:opacity-50"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* ============================================ */}
      {/* DETAIL PANEL - REDESIGNED */}
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