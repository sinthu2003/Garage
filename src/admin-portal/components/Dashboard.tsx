/**
 * ============================================
 * DASHBOARD - PREMIUM REDESIGN
 * ============================================
 * Features:
 * - No page scroll - viewport fit
 * - 3 visible items in leads/follow-ups with internal scroll
 * - Premium glassmorphism aesthetics
 * 
 * @file src/admin-portal/screens/Dashboard.tsx
 */

import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  TrendingDown,
  Users,
  Calendar,
  Clock,
  Mail,
  MapPin,
  RefreshCw,
  AlertCircle,
  ArrowUpRight,
  Phone,
  Eye,
  Sparkles,
  CalendarCheck,
  AlertTriangle,
  CheckCircle2,
  Car,
  ChevronRight,
} from 'lucide-react';
import {
  getDashboardData,
  type DashboardStats,
  type Booking,
  getBookingStatusColor,
  formatPhone,
  getRelativeTime,
} from '../../services/api/bookingsApi';

// ============================================
// SHIMMER ANIMATION STYLE
// ============================================

const shimmerStyle = `
  @keyframes shimmer {
    0% { transform: translateX(-100%); }
    100% { transform: translateX(100%); }
  }
`;

// ============================================
// INTERFACES
// ============================================

interface DashboardProps {
  isDarkMode?: boolean;
  onNavigate?: (screen: 'bookings' | 'inquiries') => void;
}

// ============================================
// ANIMATION VARIANTS
// ============================================

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: 'spring' as const, stiffness: 400, damping: 28 },
  },
};

// ============================================
// GREETING HELPER
// ============================================

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good Morning';
  if (hour < 17) return 'Good Afternoon';
  return 'Good Evening';
};

// ============================================
// MINI TREND CHART
// ============================================

const TrendChart: React.FC<{ data: number[]; color: string }> = ({ data, color }) => {
  if (!data.length) return null;
  const max = Math.max(...data, 1);
  const min = Math.min(...data, 0);
  const range = max - min || 1;
  const width = 72;
  const height = 28;

  const points = data.map((val, i) => {
    const x = (i / (data.length - 1 || 1)) * width;
    const y = height - 2 - ((val - min) / range) * (height - 4);
    return { x, y };
  });

  const pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
  const areaD = `${pathD} L ${width} ${height} L 0 ${height} Z`;

  return (
    <svg width={width} height={height} className="overflow-visible">
      <defs>
        <linearGradient id={`chart-grad-${color}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={color} stopOpacity="0.25" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={areaD} fill={`url(#chart-grad-${color})`} />
      <path d={pathD} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={points[points.length - 1].x} cy={points[points.length - 1].y} r="4" fill={color} />
      <circle cx={points[points.length - 1].x} cy={points[points.length - 1].y} r="6" fill={color} opacity="0.3" />
    </svg>
  );
};

// ============================================
// KPI CARD COMPONENT
// ============================================

interface KPICardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  trend?: number;
  trendLabel?: string;
  iconBg: string;
  iconColor: string;
  chartColor?: string;
  onClick?: () => void;
  subtitle?: string;
  sparkData?: number[];
}

const KPICard: React.FC<KPICardProps> = ({
  title,
  value,
  icon,
  trend,
  trendLabel,
  iconBg,
  iconColor,
  chartColor,
  onClick,
  subtitle,
  sparkData,
}) => (
  <motion.div
    variants={itemVariants}
    whileHover={{ y: -3, scale: 1.01 }}
    whileTap={{ scale: 0.98 }}
    onClick={onClick}
    className="relative overflow-hidden rounded-2xl cursor-pointer group"
  >
    {/* Glass background */}
    <div className="absolute inset-0 bg-gradient-to-br from-card/95 to-card/80 backdrop-blur-xl" />
    <div className="absolute inset-0 bg-gradient-to-br from-white/[0.08] to-transparent" />
    <div className="absolute inset-[1px] rounded-2xl border border-white/10" />
    
    {/* Glow effect on hover */}
    <div className={`absolute -inset-1 ${iconBg} opacity-0 group-hover:opacity-20 blur-2xl transition-opacity duration-500`} />

    <div className="relative p-5">
      {/* Top row: Icon + Chart */}
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-xl ${iconBg} shadow-lg`}>
          <div className={iconColor}>{icon}</div>
        </div>
        {sparkData && sparkData.length > 1 && chartColor && (
          <TrendChart data={sparkData} color={chartColor} />
        )}
      </div>

      {/* Title */}
      <p className="text-muted-foreground text-sm font-medium mb-1">{title}</p>
      
      {/* Value + Trend */}
      <div className="flex items-baseline gap-3">
        <span className="text-foreground text-3xl font-bold tracking-tight">
          {value.toLocaleString()}
        </span>
        {trend !== undefined && (
          <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full
            ${trend >= 0 ? 'text-emerald-600 bg-emerald-500/15' : 'text-red-500 bg-red-500/15'}`}>
            {trend >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
            {Math.abs(trend)}%
          </span>
        )}
      </div>

      {/* Subtitle */}
      {(subtitle || trendLabel) && (
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-border/40">
          <span className="text-xs text-muted-foreground">{subtitle || trendLabel}</span>
          <ChevronRight size={14} className="text-muted-foreground/50 group-hover:text-primary 
            group-hover:translate-x-1 transition-all" />
        </div>
      )}
    </div>
  </motion.div>
);

// ============================================
// LEAD CARD COMPONENT
// ============================================

const LeadCard: React.FC<{ lead: Booking; onClick?: () => void; index: number }> = ({ lead, onClick, index }) => (
  <motion.div
    initial={{ opacity: 0, x: -10 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay: index * 0.05 }}
    whileHover={{ x: 4, backgroundColor: 'hsl(var(--secondary) / 0.8)' }}
    onClick={onClick}
    className="flex items-center gap-4 p-4 rounded-xl bg-secondary/40 
      border border-transparent hover:border-primary/20 cursor-pointer transition-all group"
  >
    {/* Avatar */}
    <div className="relative flex-shrink-0">
      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary via-primary/80 to-primary/60 
        flex items-center justify-center text-primary-foreground font-semibold text-lg shadow-lg
        ring-2 ring-primary/20">
        {(lead.name?.[0] || lead.phone[0]).toUpperCase()}
      </div>
      {lead.status === 'new' && (
        <span className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 
          border-card shadow-lg shadow-emerald-500/30" />
      )}
    </div>

    {/* Info */}
    <div className="flex-1 min-w-0">
      <div className="flex items-center gap-2 mb-1">
        <p className="text-foreground font-semibold truncate">
          {lead.name || formatPhone(lead.phone, lead.countryCode)}
        </p>
        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide
          ${getBookingStatusColor(lead.status)}`}>
          {lead.status}
        </span>
      </div>
      <div className="flex items-center gap-3 text-sm text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <Car size={13} className="text-muted-foreground/70" />
          {lead.brandName}
        </span>
        <span className="flex items-center gap-1.5">
          <MapPin size={13} className="text-muted-foreground/70" />
          {lead.city}
        </span>
      </div>
    </div>

    {/* Time & Actions */}
    <div className="text-right flex-shrink-0">
      <p className="text-xs text-muted-foreground mb-2">{getRelativeTime(lead.createdAt)}</p>
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all">
        <button className="p-1.5 rounded-lg hover:bg-primary/15 text-primary transition-colors">
          <Phone size={14} />
        </button>
        <button className="p-1.5 rounded-lg hover:bg-primary/15 text-primary transition-colors">
          <Eye size={14} />
        </button>
      </div>
    </div>
  </motion.div>
);

// ============================================
// FOLLOW-UP CARD COMPONENT
// ============================================

const FollowUpCard: React.FC<{ booking: Booking; onClick?: () => void; index: number }> = ({ booking, onClick, index }) => {
  const isOverdue = new Date(booking.followUpDate || '').getTime() < Date.now();

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ x: 4 }}
      onClick={onClick}
      className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all group
        ${isOverdue
          ? 'bg-red-500/8 border-red-500/25 hover:bg-red-500/15 hover:border-red-500/40'
          : 'bg-amber-500/8 border-amber-500/25 hover:bg-amber-500/15 hover:border-amber-500/40'}`}
    >
      <div className={`p-2.5 rounded-xl ${isOverdue ? 'bg-red-500/15' : 'bg-amber-500/15'}`}>
        {isOverdue ? (
          <AlertTriangle size={16} className="text-red-500" />
        ) : (
          <Clock size={16} className="text-amber-500" />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-foreground font-medium truncate text-sm">
          {booking.name || formatPhone(booking.phone, booking.countryCode)}
        </p>
        <p className="text-muted-foreground text-xs truncate">
          {booking.brandName} {booking.carModel}
        </p>
      </div>

      <ChevronRight size={16} className="text-muted-foreground/50 group-hover:text-foreground 
        group-hover:translate-x-0.5 transition-all" />
    </motion.div>
  );
};

// ============================================
// MAIN DASHBOARD COMPONENT
// ============================================

export const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [todayLeads, setTodayLeads] = useState<Booking[]>([]);
  const [followUps, setFollowUps] = useState<Booking[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const loadDashboardData = useCallback(async (showRefresh = false) => {
    try {
      if (showRefresh) {
        setIsRefreshing(true);
      } else {
        setIsLoading(true);
      }
      setError(null);

      const dashboardData = await getDashboardData();

      setStats(dashboardData.stats);
      setTodayLeads(dashboardData.todayLeads);
      setFollowUps(dashboardData.followUps);
      setUnreadCount(dashboardData.unreadCount);
    } catch (err) {
      console.error('Dashboard load error:', err);
      setError('Failed to load dashboard data. Please try again.');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  useEffect(() => {
    const interval = setInterval(() => {
      loadDashboardData(true);
    }, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [loadDashboardData]);

  // Loading State - Skeleton Animation
  if (isLoading) {
    return (
      <>
        <style>{shimmerStyle}</style>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="h-full flex flex-col p-5 lg:p-6 overflow-hidden"
        >
        {/* Header Skeleton */}
        <div className="flex items-center justify-between mb-5 flex-shrink-0">
          <div>
            <div className="h-8 w-48 bg-gradient-to-r from-secondary via-secondary/50 to-secondary 
              rounded-lg animate-pulse" />
            <div className="h-4 w-72 bg-gradient-to-r from-secondary via-secondary/50 to-secondary 
              rounded-md mt-2 animate-pulse" />
          </div>
          <div className="h-10 w-28 bg-gradient-to-r from-secondary via-secondary/50 to-secondary 
            rounded-xl animate-pulse" />
        </div>

        {/* KPI Cards Skeleton */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5 flex-shrink-0">
          {[...Array(4)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="relative overflow-hidden rounded-2xl bg-card/60 border border-border/50 p-5"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-secondary via-secondary/50 to-secondary 
                  animate-pulse" />
                <div className="w-16 h-7 bg-gradient-to-r from-secondary via-secondary/50 to-secondary 
                  rounded animate-pulse" />
              </div>
              <div className="h-4 w-24 bg-gradient-to-r from-secondary via-secondary/50 to-secondary 
                rounded mb-2 animate-pulse" />
              <div className="h-8 w-16 bg-gradient-to-r from-secondary via-secondary/50 to-secondary 
                rounded animate-pulse" />
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-border/40">
                <div className="h-3 w-20 bg-gradient-to-r from-secondary via-secondary/50 to-secondary 
                  rounded animate-pulse" />
              </div>
              {/* Shimmer overlay */}
              <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] 
                bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            </motion.div>
          ))}
        </div>

        {/* Activity Panels Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 flex-1 min-h-0">
          {[...Array(2)].map((_, panelIndex) => (
            <motion.div
              key={panelIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + panelIndex * 0.1 }}
              className="flex flex-col rounded-2xl bg-card/60 border border-border/50 overflow-hidden"
            >
              {/* Panel Header Skeleton */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-border/40">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-r from-secondary via-secondary/50 to-secondary 
                    animate-pulse" />
                  <div className="h-5 w-28 bg-gradient-to-r from-secondary via-secondary/50 to-secondary 
                    rounded animate-pulse" />
                  <div className="h-6 w-16 bg-gradient-to-r from-secondary via-secondary/50 to-secondary 
                    rounded-full animate-pulse" />
                </div>
                <div className="h-4 w-16 bg-gradient-to-r from-secondary via-secondary/50 to-secondary 
                  rounded animate-pulse" />
              </div>

              {/* Panel Content Skeleton */}
              <div className="flex-1 p-3 space-y-2">
                {[...Array(3)].map((_, rowIndex) => (
                  <motion.div
                    key={rowIndex}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + panelIndex * 0.1 + rowIndex * 0.08 }}
                    className="relative flex items-center gap-4 p-4 rounded-xl bg-secondary/30 overflow-hidden"
                  >
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-secondary via-secondary/50 to-secondary 
                      animate-pulse flex-shrink-0" />
                    <div className="flex-1">
                      <div className="h-5 w-36 bg-gradient-to-r from-secondary via-secondary/50 to-secondary 
                        rounded mb-2 animate-pulse" />
                      <div className="h-4 w-48 bg-gradient-to-r from-secondary via-secondary/50 to-secondary 
                        rounded animate-pulse" />
                    </div>
                    <div className="h-4 w-16 bg-gradient-to-r from-secondary via-secondary/50 to-secondary 
                      rounded animate-pulse" />
                    {/* Shimmer overlay */}
                    <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] 
                      bg-gradient-to-r from-transparent via-white/5 to-transparent" 
                      style={{ animationDelay: `${rowIndex * 0.2}s` }} />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
      </>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-md"
        >
          <div className="w-14 h-14 rounded-2xl bg-destructive/10 flex items-center justify-center mx-auto mb-4">
            <AlertCircle size={28} className="text-destructive" />
          </div>
          <h3 className="text-foreground font-semibold text-lg mb-2">Something went wrong</h3>
          <p className="text-muted-foreground mb-6">{error}</p>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => loadDashboardData()}
            className="px-6 py-3 bg-primary text-primary-foreground rounded-xl 
              hover:bg-primary/90 transition-colors inline-flex items-center gap-2 font-medium"
          >
            <RefreshCw size={18} />
            Try Again
          </motion.button>
        </motion.div>
      </div>
    );
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="h-full flex flex-col p-5 lg:p-6 overflow-hidden"
    >
      {/* ============================================ */}
      {/* HEADER */}
      {/* ============================================ */}
      <motion.div variants={itemVariants} className="flex items-center justify-between mb-5 flex-shrink-0">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight">
            {getGreeting()}!
          </h1>
          <p className="text-muted-foreground text-sm mt-0.5">
            Here's what's happening with your business today.
          </p>
        </div>

        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => loadDashboardData(true)}
          disabled={isRefreshing}
          className="flex items-center gap-2 px-4 py-2.5 bg-secondary/80 text-foreground rounded-xl
            hover:bg-secondary transition-all border border-border/50 font-medium shadow-sm
            disabled:opacity-50"
        >
          <RefreshCw size={16} className={isRefreshing ? 'animate-spin' : ''} />
          <span className="hidden sm:inline">{isRefreshing ? 'Refreshing...' : 'Refresh'}</span>
        </motion.button>
      </motion.div>

      {/* ============================================ */}
      {/* KPI CARDS */}
      {/* ============================================ */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5 flex-shrink-0">
        <KPICard
          title="Total Bookings"
          value={stats?.bookings.total || 0}
          icon={<Calendar size={22} />}
          iconBg="bg-indigo-500/15"
          iconColor="text-indigo-500"
          chartColor="#6366f1"
          subtitle="All time bookings"
          onClick={() => onNavigate?.('bookings')}
          sparkData={[12, 19, 15, 25, 22, 30, 28]}
        />
        <KPICard
          title="Today's Leads"
          value={stats?.todayLeads || 0}
          icon={<Users size={22} />}
          trend={12}
          trendLabel="vs yesterday"
          iconBg="bg-emerald-500/15"
          iconColor="text-emerald-500"
          chartColor="#10b981"
          onClick={() => onNavigate?.('bookings')}
          sparkData={[5, 8, 6, 10, 7, 12, stats?.todayLeads || 0]}
        />
        <KPICard
          title="Pending Follow-ups"
          value={stats?.pendingFollowUps || 0}
          icon={<Clock size={22} />}
          iconBg="bg-amber-500/15"
          iconColor="text-amber-500"
          subtitle="Needs attention"
          onClick={() => onNavigate?.('bookings')}
        />
        <KPICard
          title="Unread Messages"
          value={unreadCount}
          icon={<Mail size={22} />}
          iconBg="bg-purple-500/15"
          iconColor="text-purple-500"
          subtitle="New inquiries"
          onClick={() => onNavigate?.('inquiries')}
        />
      </div>

      {/* ============================================ */}
      {/* ACTIVITY PANELS */}
      {/* ============================================ */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 flex-1 min-h-0">
        {/* Today's Leads Panel */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col rounded-2xl bg-card/60 backdrop-blur-sm border border-border/50 
            overflow-hidden shadow-xl shadow-black/5"
        >
          {/* Panel Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-border/40 flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5">
                <Sparkles size={18} className="text-primary" />
              </div>
              <h3 className="text-foreground font-semibold">Today's Leads</h3>
              {todayLeads.length > 0 && (
                <span className="px-2.5 py-1 text-xs font-bold bg-emerald-500/15 text-emerald-600 rounded-full">
                  {todayLeads.length} new
                </span>
              )}
            </div>
            <button
              onClick={() => onNavigate?.('bookings')}
              className="text-primary text-sm font-medium hover:text-primary/80 flex items-center gap-1
                transition-colors"
            >
              View all
              <ArrowUpRight size={14} />
            </button>
          </div>

          {/* Panel Content - Shows 3 items, scroll for more */}
          <div className="flex-1 overflow-y-auto p-3 custom-scrollbar">
            {todayLeads.length > 0 ? (
              <div className="space-y-2">
                {todayLeads.map((lead, index) => (
                  <LeadCard
                    key={lead._id}
                    lead={lead}
                    index={index}
                    onClick={() => onNavigate?.('bookings')}
                  />
                ))}
              </div>
            ) : (
              <div className="h-full flex items-center justify-center">
                <div className="text-center py-8">
                  <div className="w-14 h-14 rounded-full bg-secondary flex items-center justify-center mx-auto mb-3">
                    <Users size={24} className="text-muted-foreground/50" />
                  </div>
                  <p className="text-muted-foreground font-medium">No leads today yet</p>
                  <p className="text-muted-foreground/60 text-sm mt-1">New leads will appear here</p>
                </div>
              </div>
            )}
          </div>
        </motion.div>

        {/* Pending Follow-ups Panel */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col rounded-2xl bg-card/60 backdrop-blur-sm border border-border/50 
            overflow-hidden shadow-xl shadow-black/5"
        >
          {/* Panel Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-border/40 flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-gradient-to-br from-amber-500/20 to-amber-500/5">
                <CalendarCheck size={18} className="text-amber-500" />
              </div>
              <h3 className="text-foreground font-semibold">Pending Follow-ups</h3>
              {followUps.length > 0 && (
                <span className="px-2.5 py-1 text-xs font-bold bg-amber-500/15 text-amber-600 rounded-full">
                  {followUps.length} pending
                </span>
              )}
            </div>
            <button
              onClick={() => onNavigate?.('bookings')}
              className="text-amber-600 text-sm font-medium hover:text-amber-500 flex items-center gap-1
                transition-colors"
            >
              View all
              <ArrowUpRight size={14} />
            </button>
          </div>

          {/* Panel Content - Shows 3 items, scroll for more */}
          <div className="flex-1 overflow-y-auto p-3 custom-scrollbar">
            {followUps.length > 0 ? (
              <div className="space-y-2">
                {followUps.map((booking, index) => (
                  <FollowUpCard
                    key={booking._id}
                    booking={booking}
                    index={index}
                    onClick={() => onNavigate?.('bookings')}
                  />
                ))}
              </div>
            ) : (
              <div className="h-full flex items-center justify-center">
                <div className="text-center py-8">
                  <div className="w-14 h-14 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-3">
                    <CheckCircle2 size={24} className="text-emerald-500" />
                  </div>
                  <p className="text-foreground font-medium">All caught up!</p>
                  <p className="text-muted-foreground text-sm mt-1">No pending follow-ups</p>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Dashboard;