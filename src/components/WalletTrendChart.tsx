import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend
} from 'recharts';
import { TrendingUp, Calendar, DollarSign, Repeat, ArrowUpRight, ShieldAlert, Sparkles } from 'lucide-react';

interface WalletTrendChartProps {
  cashBalanceUSD: number;
  utcTimeCredits: number;
}

export const WalletTrendChart: React.FC<WalletTrendChartProps> = ({
  cashBalanceUSD,
  utcTimeCredits
}) => {
  const [timeRange, setTimeRange] = useState<'7D' | '14D' | '30D'>('30D');
  const [activeMetric, setActiveMetric] = useState<'all' | 'usd' | 'utc'>('all');

  // Generate realistic 30-day historical trend ending at current balances
  const full30DayData = useMemo(() => {
    const data = [];
    const today = new Date('2026-07-28');
    
    // Seed initial values around 65-70% of current values for growth story
    let currentUsd = Math.max(800, Math.round(cashBalanceUSD * 0.62));
    let currentUtc = Math.max(12, Math.round(utcTimeCredits * 0.55));

    for (let i = 29; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const dateStr = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

      if (i === 0) {
        // Last day always matches actual current state exact values
        data.push({
          date: dateStr,
          rawDate: d,
          usdBalance: cashBalanceUSD,
          utcCredits: utcTimeCredits,
          transactionType: 'Settlement Complete'
        });
      } else {
        // Organic fluctuations with steady upward trajectory
        const usdDelta = (Math.sin(i * 0.8) * 180) + (Math.random() * 90 - 30) + ((cashBalanceUSD - currentUsd) / 25);
        const utcDelta = (Math.cos(i * 0.6) * 1.5) + (Math.random() * 1.2 - 0.4) + ((utcTimeCredits - currentUtc) / 25);

        currentUsd = Math.max(200, Math.round(currentUsd + usdDelta));
        currentUtc = Math.max(2, Number((currentUtc + utcDelta).toFixed(1)));

        data.push({
          date: dateStr,
          rawDate: d,
          usdBalance: currentUsd,
          utcCredits: currentUtc,
          transactionType: i % 4 === 0 ? 'UTC Trade' : i % 3 === 0 ? 'Hourly Booking' : 'Hold'
        });
      }
    }
    return data;
  }, [cashBalanceUSD, utcTimeCredits]);

  // Filter based on selected time range
  const chartData = useMemo(() => {
    const days = timeRange === '7D' ? 7 : timeRange === '14D' ? 14 : 30;
    return full30DayData.slice(-days);
  }, [full30DayData, timeRange]);

  // Calculate 30-day stats
  const startUsd = chartData[0]?.usdBalance || cashBalanceUSD;
  const startUtc = chartData[0]?.utcCredits || utcTimeCredits;
  
  const usdGrowth = cashBalanceUSD - startUsd;
  const usdPct = startUsd > 0 ? ((usdGrowth / startUsd) * 100).toFixed(1) : '0.0';

  const utcGrowth = Number((utcTimeCredits - startUtc).toFixed(1));
  const utcPct = startUtc > 0 ? ((utcGrowth / startUtc) * 100).toFixed(1) : '0.0';

  return (
    <div className="bg-white border border-sky-200 rounded-2xl p-5 shadow-sm space-y-4">
      {/* Chart Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-sky-100 pb-3">
        <div>
          <div className="flex items-center gap-2 text-slate-900 font-extrabold text-sm">
            <TrendingUp className="w-4 h-4 text-blue-600" />
            <span>30-Day Liquidity &amp; Asset Trend Analytics</span>
          </div>
          <p className="text-[11px] text-slate-500">Track USD Cash vs. Universal Time Credits (UTC) balance dynamics</p>
        </div>

        {/* Range and Metric Filters */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex bg-sky-50 p-1 rounded-xl border border-sky-200 text-[11px]">
            <button
              onClick={() => setActiveMetric('all')}
              className={`px-2.5 py-1 rounded-lg font-bold transition ${
                activeMetric === 'all' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Dual View
            </button>
            <button
              onClick={() => setActiveMetric('usd')}
              className={`px-2.5 py-1 rounded-lg font-bold transition ${
                activeMetric === 'usd' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              $ USD
            </button>
            <button
              onClick={() => setActiveMetric('utc')}
              className={`px-2.5 py-1 rounded-lg font-bold transition ${
                activeMetric === 'utc' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              UTC Credits
            </button>
          </div>

          <div className="flex bg-sky-50 p-1 rounded-xl border border-sky-200 text-[11px] font-mono">
            {(['7D', '14D', '30D'] as const).map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-2 py-1 rounded-lg transition ${
                  timeRange === range ? 'bg-white text-blue-700 font-extrabold shadow-xs border border-sky-200' : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                {range}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* KPI Stats Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
        <div className="bg-sky-50/70 border border-sky-200 rounded-xl p-2.5 space-y-0.5">
          <span className="text-[10px] text-slate-500 block font-sans font-medium">USD Net Change</span>
          <div className="flex items-center gap-1">
            <span className={`font-bold ${usdGrowth >= 0 ? 'text-emerald-700' : 'text-rose-600'}`}>
              {usdGrowth >= 0 ? `+$${usdGrowth}` : `-$${Math.abs(usdGrowth)}`}
            </span>
            <span className="text-[10px] text-slate-500">({usdPct}%)</span>
          </div>
        </div>

        <div className="bg-sky-50/70 border border-sky-200 rounded-xl p-2.5 space-y-0.5">
          <span className="text-[10px] text-slate-500 block font-sans font-medium">UTC Net Change</span>
          <div className="flex items-center gap-1">
            <span className={`font-bold ${utcGrowth >= 0 ? 'text-blue-700' : 'text-amber-700'}`}>
              {utcGrowth >= 0 ? `+${utcGrowth} UTC` : `${utcGrowth} UTC`}
            </span>
            <span className="text-[10px] text-slate-500">({utcPct}%)</span>
          </div>
        </div>

        <div className="bg-sky-50/70 border border-sky-200 rounded-xl p-2.5 space-y-0.5">
          <span className="text-[10px] text-slate-500 block font-sans font-medium">30D Peak Cash</span>
          <span className="font-bold text-slate-900">${Math.max(...chartData.map(d => d.usdBalance))}</span>
        </div>

        <div className="bg-sky-50/70 border border-sky-200 rounded-xl p-2.5 space-y-0.5">
          <span className="text-[10px] text-slate-500 block font-sans font-medium">30D Peak UTC</span>
          <span className="font-bold text-blue-700">{Math.max(...chartData.map(d => d.utcCredits))} UTC</span>
        </div>
      </div>

      {/* Recharts Container */}
      <div className="h-64 sm:h-72 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e0f2fe" vertical={false} />
            <XAxis 
              dataKey="date" 
              stroke="#64748b" 
              fontSize={11} 
              tickLine={false}
              axisLine={{ stroke: '#bae6fd' }}
            />
            {(activeMetric === 'all' || activeMetric === 'usd') && (
              <YAxis 
                yAxisId="usd" 
                orientation="left"
                stroke="#059669" 
                fontSize={10} 
                tickLine={false}
                axisLine={false}
                tickFormatter={(val) => `$${val}`}
              />
            )}
            {(activeMetric === 'all' || activeMetric === 'utc') && (
              <YAxis 
                yAxisId="utc" 
                orientation="right" 
                stroke="#2563eb" 
                fontSize={10} 
                tickLine={false}
                axisLine={false}
                tickFormatter={(val) => `${val}h`}
              />
            )}
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#ffffff', 
                borderColor: '#bae6fd', 
                borderRadius: '12px',
                fontSize: '12px',
                color: '#0f172a',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
              }}
              formatter={(value: any, name: string) => {
                if (name === 'USD Cash Balance') return [`$${value}`, 'USD Cash'];
                if (name === 'UTC Time Credits') return [`${value} UTC Hours`, 'Time Credits'];
                return [value, name];
              }}
              labelStyle={{ color: '#0369a1', fontWeight: 'bold', marginBottom: '4px' }}
            />
            <Legend 
              wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }}
            />

            {(activeMetric === 'all' || activeMetric === 'usd') && (
              <Line
                yAxisId="usd"
                type="monotone"
                dataKey="usdBalance"
                name="USD Cash Balance"
                stroke="#059669"
                strokeWidth={2.5}
                dot={{ fill: '#059669', r: 3, strokeWidth: 1 }}
                activeDot={{ r: 6, stroke: '#ffffff', strokeWidth: 2 }}
              />
            )}

            {(activeMetric === 'all' || activeMetric === 'utc') && (
              <Line
                yAxisId="utc"
                type="monotone"
                dataKey="utcCredits"
                name="UTC Time Credits"
                stroke="#2563eb"
                strokeWidth={2}
                strokeDasharray="4 4"
                dot={{ fill: '#2563eb', r: 3, strokeWidth: 1 }}
                activeDot={{ r: 6, stroke: '#ffffff', strokeWidth: 2 }}
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Financial Insights Footer */}
      <div className="bg-sky-50/80 border border-sky-200 rounded-xl p-3 text-xs flex items-center justify-between text-slate-700">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
          <span>
            AI Trading Insight: Your cash reserves grew by <strong className="text-emerald-700">{usdPct}%</strong> over the last {timeRange} with active UTC escrow backing.
          </span>
        </div>
        <span className="font-mono text-[10px] text-slate-400 hidden sm:inline">Recharts v2.x Engine</span>
      </div>
    </div>
  );
};
