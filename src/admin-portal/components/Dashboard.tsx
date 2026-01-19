/**
 * ============================================
 * DASHBOARD - CLEAN MINIMAL VERSION
 * ============================================
 * * Simple dashboard with:
 * - KPI cards
 * - Today's Leads
 * - Pending Follow-ups
 * * @file src/admin-portal/screens/Dashboard.tsx
 */

import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  TrendingUp,
  TrendingDown,
  Users,
  Calendar,
  Clock,
  Mail,
  MapPin,
  RefreshCw,
  AlertCircle,
  Loader2,
  ArrowUpRight,
  Phone,
  Eye,
  Bell,
  Sparkles,
  CalendarCheck,
  AlertTriangle,
  CheckCircle2,
  Car,
  ChevronRight,
  ArrowRight,
} from 'lucide-react';
import {
  getDashboardData, // <-- Single API Import
  type DashboardStats,
  type Booking,
  getBookingStatusColor,
  formatPhone,
  getRelativeTime,
} from '../../services/api/bookingsApi';

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
    transition: { staggerChildren: 0.06, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: 'spring' as const, stiffness: 400, damping: 30 },
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
// SPARKLINE COMPONENT
// ============================================

const SparkLine: React.FC<{ data: number[]; color?: string }> = ({ data, color = 'hsl(var(--primary))' }) => {
  if (!data.length) return null;
  const max = Math.max(...data, 1);
  const min = Math.min(...data, 0);
  const range = max - min || 1;
  const width = 80;
  const height = 24;
  const points = data.map((val, i) => {
    const x = (i / (data.length - 1 || 1)) * width;
    const y = height - ((val - min) / range) * height;
    return `${x},${y}`;
  }).join(' ');

  return (
    <svg width={width} height={height} className="overflow-visible">
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
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
  color: string;
  bgColor: string;
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
  color,
  bgColor,
  onClick,
  subtitle,
  sparkData,
}) => (
  <motion.div
    variants={itemVariants}
    whileHover={{ y: -4, transition: { duration: 0.2 } }}
    whileTap={{ scale: 0.98 }}
    onClick={onClick}
    className={`relative overflow-hidden rounded-2xl p-5 cursor-pointer transition-all
      bg-card border border-border hover:border-primary/40 hover:shadow-xl group`}
  >
    {/* Background Decoration */}
    <div className={`absolute -right-6 -top-6 w-24 h-24 rounded-full ${bgColor} opacity-10 
      group-hover:opacity-20 transition-opacity`} />
    <div className={`absolute -right-2 -bottom-2 w-16 h-16 rounded-full ${bgColor} opacity-5`} />

    <div className="relative z-10">
      {/* Header Row */}
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-xl ${bgColor}`}>
          <div className={color}>{icon}</div>
        </div>
        {sparkData && sparkData.length > 1 && (
          <SparkLine data={sparkData} color={color.includes('green') ? 'hsl(142 65% 48%)' : 'hsl(var(--primary))'} />
        )}
      </div>

      {/* Value */}
      <div className="mb-2">
        <p className="text-muted-foreground text-sm font-medium mb-1">{title}</p>
        <div className="flex items-baseline gap-2">
          <motion.span
            className="text-foreground text-3xl font-bold"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
          >
            {value.toLocaleString()}
          </motion.span>
          {trend !== undefined && (
            <span className={`flex items-center gap-0.5 text-xs font-semibold px-2 py-0.5 rounded-full
              ${trend >= 0 ? 'text-green-600 bg-green-500/10' : 'text-red-500 bg-red-500/10'}`}>
              {trend >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
              {Math.abs(trend)}%
            </span>
          )}
        </div>
      </div>

      {/* Footer */}
      {(subtitle || trendLabel) && (
        <div className="flex items-center justify-between pt-2 border-t border-border/50">
          <span className="text-xs text-muted-foreground">{subtitle || trendLabel}</span>
          <ArrowRight size={14} className="text-muted-foreground group-hover:text-primary 
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
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.05 }}
    whileHover={{ x: 4 }}
    onClick={onClick}
    className="flex items-center gap-4 p-4 rounded-xl bg-secondary/30 hover:bg-secondary/60 
      border border-transparent hover:border-border cursor-pointer transition-all group"
  >
    {/* Avatar */}
    <div className="relative">
      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-primary/60 
        flex items-center justify-center text-primary-foreground font-semibold text-lg shadow-lg">
        {(lead.name?.[0] || lead.phone[0]).toUpperCase()}
      </div>
      {lead.status === 'new' && (
        <span className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 
          border-card animate-pulse" />
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
        <span className="flex items-center gap-1">
          <Car size={12} />
          {lead.brandName}
        </span>
        <span className="flex items-center gap-1">
          <MapPin size={12} />
          {lead.city}
        </span>
      </div>
    </div>

    {/* Time & Action */}
    <div className="text-right flex-shrink-0">
      <p className="text-xs text-muted-foreground mb-1">{getRelativeTime(lead.createdAt)}</p>
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button className="p-1.5 rounded-lg hover:bg-primary/10 text-primary">
          <Phone size={14} />
        </button>
        <button className="p-1.5 rounded-lg hover:bg-primary/10 text-primary">
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
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ x: 4 }}
      onClick={onClick}
      className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all group
        ${isOverdue
          ? 'bg-red-500/5 border-red-500/20 hover:bg-red-500/10'
          : 'bg-amber-500/5 border-amber-500/20 hover:bg-amber-500/10'}`}
    >
      <div className={`p-2 rounded-lg ${isOverdue ? 'bg-red-500/10' : 'bg-amber-500/10'}`}>
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

      <ChevronRight size={16} className="text-muted-foreground group-hover:text-foreground transition-colors" />
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

      // Single API Call
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

  // Auto-refresh every 5 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      loadDashboardData(true);
    }, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [loadDashboardData]);

  // Loading State
  if (isLoading) {
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
          <p className="text-muted-foreground mt-4 font-medium">Loading dashboard...</p>
        </motion.div>
      </div>
    );
  }

  // Error State
  if (error) {
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
          <h3 className="text-foreground font-semibold text-lg mb-2">Something went wrong</h3>
          <p className="text-muted-foreground mb-6">{error}</p>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => loadDashboardData()}
            className="px-6 py-3 bg-primary text-primary-foreground rounded-xl 
              hover:bg-primary/90 transition-colors flex items-center gap-2 mx-auto font-medium"
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
      className="p-4 md:p-6 space-y-6 h-full overflow-y-auto"
    >
      {/* ============================================ */}
      {/* HEADER SECTION */}
      {/* ============================================ */}
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground flex items-center gap-3">
            <div className="p-2 rounded-xl bg-primary/10">
              <LayoutDashboard className="text-primary" size={24} />
            </div>
            {getGreeting()}!
          </h1>
          <p className="text-muted-foreground mt-1 ml-12 md:ml-14">
            Here's what's happening with your business today.
          </p>
        </div>

        <div className="flex items-center gap-2 ml-12 md:ml-0">
          {/* Notification Badge */}
          {unreadCount > 0 && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onNavigate?.('inquiries')}
              className="relative p-2.5 rounded-xl bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
            >
              <Bell size={20} />
              <span className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center 
                bg-destructive text-destructive-foreground text-[10px] font-bold rounded-full">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            </motion.button>
          )}

          {/* Refresh Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => loadDashboardData(true)}
            disabled={isRefreshing}
            className="flex items-center gap-2 px-4 py-2.5 bg-secondary text-foreground rounded-xl
              hover:bg-secondary/80 transition-colors disabled:opacity-50 border border-border font-medium"
          >
            <RefreshCw size={16} className={isRefreshing ? 'animate-spin' : ''} />
            <span className="hidden sm:inline">{isRefreshing ? 'Refreshing...' : 'Refresh'}</span>
          </motion.button>
        </div>
      </motion.div>

      {/* ============================================ */}
      {/* KPI CARDS */}
      {/* ============================================ */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Total Bookings"
          value={stats?.bookings.total || 0}
          icon={<Calendar size={22} />}
          color="text-primary"
          bgColor="bg-primary/10"
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
          color="text-green-500"
          bgColor="bg-green-500/10"
          onClick={() => onNavigate?.('bookings')}
          sparkData={[5, 8, 6, 10, 7, 12, stats?.todayLeads || 0]}
        />
        <KPICard
          title="Pending Follow-ups"
          value={stats?.pendingFollowUps || 0}
          icon={<Clock size={22} />}
          color="text-amber-500"
          bgColor="bg-amber-500/10"
          subtitle="Needs attention"
          onClick={() => onNavigate?.('bookings')}
        />
        <KPICard
          title="Unread Messages"
          value={unreadCount}
          icon={<Mail size={22} />}
          color="text-purple-500"
          bgColor="bg-purple-500/10"
          subtitle="New inquiries"
          onClick={() => onNavigate?.('inquiries')}
        />
      </div>

      {/* ============================================ */}
      {/* ACTIVITY SECTION */}
      {/* ============================================ */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        {/* Today's Leads */}
        <motion.div
          variants={itemVariants}
          className="p-5 md:p-6 rounded-2xl bg-card border border-border"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-primary/10">
                <Sparkles size={18} className="text-primary" />
              </div>
              <h3 className="text-foreground font-semibold">Today's Leads</h3>
              {todayLeads.length > 0 && (
                <span className="px-2.5 py-1 text-xs font-bold bg-green-500/10 text-green-600 rounded-full">
                  {todayLeads.length} new
                </span>
              )}
            </div>
            <button
              onClick={() => onNavigate?.('bookings')}
              className="text-primary text-sm font-medium hover:text-primary/80 flex items-center gap-1"
            >
              View all
              <ArrowUpRight size={14} />
            </button>
          </div>

          <div className="space-y-2 max-h-[320px] overflow-y-auto pr-1 custom-scrollbar">
            {todayLeads.length > 0 ? (
              todayLeads.slice(0, 5).map((lead, index) => (
                <LeadCard
                  key={lead._id}
                  lead={lead}
                  index={index}
                  onClick={() => onNavigate?.('bookings')}
                />
              ))
            ) : (
              <div className="text-center py-10">
                <div className="w-14 h-14 rounded-full bg-secondary flex items-center justify-center mx-auto mb-3">
                  <Users size={24} className="text-muted-foreground/50" />
                </div>
                <p className="text-muted-foreground font-medium">No leads today yet</p>
                <p className="text-muted-foreground/60 text-sm mt-1">New leads will appear here</p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Pending Follow-ups */}
        <motion.div
          variants={itemVariants}
          className="p-5 md:p-6 rounded-2xl bg-card border border-border"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-amber-500/10">
                <CalendarCheck size={18} className="text-amber-500" />
              </div>
              <h3 className="text-foreground font-semibold">Pending Follow-ups</h3>
              {followUps.length > 0 && (
                <span className="px-2.5 py-1 text-xs font-bold bg-amber-500/10 text-amber-600 rounded-full">
                  {followUps.length} pending
                </span>
              )}
            </div>
            <button
              onClick={() => onNavigate?.('bookings')}
              className="text-amber-600 text-sm font-medium hover:text-amber-500 flex items-center gap-1"
            >
              View all
              <ArrowUpRight size={14} />
            </button>
          </div>

          <div className="space-y-2 max-h-[320px] overflow-y-auto pr-1 custom-scrollbar">
            {followUps.length > 0 ? (
              followUps.slice(0, 6).map((booking, index) => (
                <FollowUpCard
                  key={booking._id}
                  booking={booking}
                  index={index}
                  onClick={() => onNavigate?.('bookings')}
                />
              ))
            ) : (
              <div className="text-center py-10">
                <div className="w-14 h-14 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-3">
                  <CheckCircle2 size={24} className="text-green-500" />
                </div>
                <p className="text-foreground font-medium">All caught up!</p>
                <p className="text-muted-foreground text-sm mt-1">No pending follow-ups</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Dashboard;