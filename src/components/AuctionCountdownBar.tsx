import React, { useState, useEffect } from 'react';
import { Clock, Flame, AlertCircle, CheckCircle } from 'lucide-react';

interface AuctionCountdownBarProps {
  auctionEndsAt?: string;
  totalDurationSeconds?: number;
  className?: string;
  compact?: boolean;
}

export const AuctionCountdownBar: React.FC<AuctionCountdownBarProps> = ({
  auctionEndsAt,
  totalDurationSeconds = 172800, // Default 48 hours in seconds
  className = '',
  compact = false
}) => {
  // Target timestamp in ms
  const getTargetTime = () => {
    if (auctionEndsAt) {
      const parsed = new Date(auctionEndsAt).getTime();
      if (!isNaN(parsed)) return parsed;
    }
    // Fallback: 36 hours from now
    return Date.now() + 36 * 3600 * 1000;
  };

  const [targetTime] = useState<number>(getTargetTime);
  const [timeLeftMs, setTimeLeftMs] = useState<number>(Math.max(0, targetTime - Date.now()));

  useEffect(() => {
    const timer = setInterval(() => {
      const remaining = Math.max(0, targetTime - Date.now());
      setTimeLeftMs(remaining);
      if (remaining <= 0) {
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [targetTime]);

  const totalMs = totalDurationSeconds * 1000;
  const remainingSeconds = Math.floor(timeLeftMs / 1000);
  
  // Calculate percentage remaining (clamped 0 to 100)
  const remainingPct = Math.min(100, Math.max(0, (timeLeftMs / totalMs) * 100));

  // Time format calculations
  const days = Math.floor(remainingSeconds / (3600 * 24));
  const hours = Math.floor((remainingSeconds % (3600 * 24)) / 3600);
  const minutes = Math.floor((remainingSeconds % 3600) / 60);
  const seconds = remainingSeconds % 60;

  const isEndingSoon = remainingSeconds > 0 && remainingSeconds < 7200; // < 2 hours
  const isUrgent = remainingSeconds > 0 && remainingSeconds < 1800; // < 30 mins
  const isEnded = remainingSeconds <= 0;

  // Format string display
  const formatCountdown = () => {
    if (isEnded) return 'Auction Closed';
    const parts = [];
    if (days > 0) parts.push(`${days}d`);
    parts.push(`${hours.toString().padStart(2, '0')}h`);
    parts.push(`${minutes.toString().padStart(2, '0')}m`);
    parts.push(`${seconds.toString().padStart(2, '0')}s`);
    return parts.join(' ');
  };

  // Color schemes based on urgency
  const getBarColorClass = () => {
    if (isEnded) return 'bg-slate-400';
    if (isUrgent) return 'bg-gradient-to-r from-rose-500 via-red-500 to-amber-500 animate-pulse';
    if (isEndingSoon) return 'bg-gradient-to-r from-amber-500 to-yellow-400';
    return 'bg-gradient-to-r from-emerald-500 via-teal-400 to-blue-500';
  };

  const getBadgeColorClass = () => {
    if (isEnded) return 'bg-slate-100 text-slate-700 border-slate-300';
    if (isUrgent) return 'bg-rose-50 text-rose-700 border-rose-300 animate-pulse font-extrabold';
    if (isEndingSoon) return 'bg-amber-50 text-amber-800 border-amber-300 font-bold';
    return 'bg-emerald-50 text-emerald-800 border-emerald-300 font-bold';
  };

  if (compact) {
    return (
      <div className={`space-y-1 ${className}`}>
        <div className="flex items-center justify-between text-[11px]">
          <span className="flex items-center gap-1 text-slate-600 font-bold">
            {isUrgent ? <Flame className="w-3.5 h-3.5 text-rose-600 animate-bounce" /> : <Clock className="w-3.5 h-3.5 text-blue-600" />}
            {isEnded ? 'Auction Ended' : 'Time Remaining'}
          </span>
          <span className={`font-mono text-xs font-black ${isUrgent ? 'text-rose-600' : isEndingSoon ? 'text-amber-600' : 'text-slate-900'}`}>
            {formatCountdown()}
          </span>
        </div>
        
        {/* Progress Bar Container */}
        <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden border border-slate-200/80 p-0.5">
          <div
            className={`h-full rounded-full transition-all duration-500 ${getBarColorClass()}`}
            style={{ width: `${remainingPct}%` }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-slate-50 border border-sky-200 rounded-xl p-3 space-y-2 text-slate-900 shadow-2xs ${className}`}>
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center gap-1.5">
          {isUrgent ? (
            <Flame className="w-4 h-4 text-rose-600 animate-bounce" />
          ) : isEndingSoon ? (
            <Clock className="w-4 h-4 text-amber-500 animate-spin" style={{ animationDuration: '6s' }} />
          ) : (
            <Clock className="w-4 h-4 text-blue-600" />
          )}
          <span className="font-extrabold text-slate-900">
            {isEnded ? 'Auction Concluded' : isUrgent ? 'FINAL COUNTDOWN' : 'Auction Time Remaining'}
          </span>
        </div>

        <span className={`px-2 py-0.5 rounded-md text-[10px] uppercase font-mono border ${getBadgeColorClass()}`}>
          {isEnded ? 'Closed' : isUrgent ? 'Ending Soon!' : `${Math.round(remainingPct)}% Time Left`}
        </span>
      </div>

      {/* Numerical Countdown Display */}
      <div className="flex items-center justify-between">
        <div className="flex items-baseline gap-1 font-mono">
          <span className={`text-base font-black tracking-tight ${isUrgent ? 'text-rose-600' : isEndingSoon ? 'text-amber-700' : 'text-blue-900'}`}>
            {formatCountdown()}
          </span>
        </div>
        <span className="text-[10px] text-slate-600 font-semibold font-mono">
          {isEnded ? 'Bidding Completed' : `Ends: ${new Date(targetTime).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}`}
        </span>
      </div>

      {/* Visual Progress Bar */}
      <div className="relative w-full bg-slate-200/90 rounded-full h-2.5 overflow-hidden border border-slate-300/80 p-0.5 shadow-inner">
        <div
          className={`h-full rounded-full transition-all duration-1000 ${getBarColorClass()}`}
          style={{ width: `${remainingPct}%` }}
        />
      </div>
    </div>
  );
};
