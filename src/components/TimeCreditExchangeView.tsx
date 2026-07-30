import React, { useState } from 'react';
import { SmartWalletState } from '../types';
import { LanguageItem } from '../data/languages';
import { 
  Repeat, 
  ArrowRightLeft, 
  Sparkles, 
  ShieldCheck, 
  Percent, 
  Clock, 
  Hotel, 
  Plane, 
  Bot, 
  Building2, 
  Car, 
  Scale, 
  CheckCircle2, 
  Gift, 
  TrendingUp 
} from 'lucide-react';
import { AdMobBanner } from './AdMobBanner';

interface TimeCreditExchangeViewProps {
  wallet: SmartWalletState;
  selectedLanguage: LanguageItem;
  onExecuteSwap: (sourceHours: number, targetHours: number, targetCategory: string) => void;
  onRewardEarned: (utcAmount: number) => void;
}

export const TimeCreditExchangeView: React.FC<TimeCreditExchangeViewProps> = ({
  wallet,
  selectedLanguage,
  onExecuteSwap,
  onRewardEarned
}) => {
  const [sourceCategory, setSourceCategory] = useState<string>('5-Star Hotel Luxury Suite');
  const [targetCategory, setTargetCategory] = useState<string>('Senior AI Engineering & Cloud Architecture');
  const [sourceHours, setSourceHours] = useState<number>(5);

  const [isLoadingQuote, setIsLoadingQuote] = useState(false);
  const [quoteResult, setQuoteResult] = useState<any>({
    sourceMarketRatePerHour: 140,
    targetMarketRatePerHour: 190,
    sourceTotalValue: 700,
    equivalentTargetHours: 3.68,
    exchangeRatio: '1 Hotel Hour = 0.74 AI Consulting Hours',
    buyerFee5PercentUTC: 0.18,
    sellerFee5PercentUTC: 0.18,
    netTargetHoursReceived: 3.5,
    aiMarketInsight: 'High seasonal demand for AI Engineering relative to Luxury Hotel Suites yields a dynamic 0.74 conversion ratio.'
  });

  const [swapSuccess, setSwapSuccess] = useState(false);

  const categoryOptions = [
    '5-Star Hotel Luxury Suite',
    'Senior AI Engineering & Cloud Architecture',
    'Executive Jet Flight Charter',
    'Maybach VIP Chauffeur Transfer',
    'Cross-Border Legal Counsel',
    'Berlin Executive Coworking Space',
    '100 x H100 GPU Compute Hours',
    'Kyoto Cultural Heritage Private Tour'
  ];

  const handleFetchQuote = async () => {
    setIsLoadingQuote(true);
    setSwapSuccess(false);
    try {
      const res = await fetch('/api/gemini/exchange-quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sourceCategory,
          targetCategory,
          sourceHours,
          userLocation: 'Global / Remote'
        })
      });
      const data = await res.json();
      setQuoteResult(data);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoadingQuote(false);
    }
  };

  const handleConfirmSwap = () => {
    if (wallet.utcTimeCredits < sourceHours) {
      alert(`Insufficient UTC Time Credits. You hold ${wallet.utcTimeCredits} UTC, but need ${sourceHours} UTC.`);
      return;
    }
    const netReceived = quoteResult?.netTargetHoursReceived || (sourceHours * 0.8);
    onExecuteSwap(sourceHours, netReceived, targetCategory);
    setSwapSuccess(true);
    setTimeout(() => setSwapSuccess(false), 4000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Title & Overview Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-2xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-base">
              <Repeat className="w-5 h-5 text-emerald-400" />
              <h2>Universal Time Credit (UTC) Marketplace</h2>
            </div>
            <p className="text-xs text-slate-300 max-w-xl leading-relaxed">
              In ACE, time itself is a portable digital asset. Swap hotel hours for jet flight credits, coworking space, or AI engineering hours with dynamic AI yield valuations.
            </p>
          </div>

          <div className="bg-blue-950 border border-slate-800 rounded-lg p-3 text-right shrink-0">
            <span className="text-[10px] text-slate-400 uppercase font-mono block">Your UTC Balance</span>
            <span className="text-xl font-bold text-emerald-400 font-mono">{wallet.utcTimeCredits} UTC Hours</span>
          </div>
        </div>
      </div>

      {/* Interactive Swap Calculator */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl space-y-5">
        <h3 className="font-bold text-sm text-white flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-emerald-400" />
          <span>Cross-Category AI Hours Swap Engine</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
          {/* Source Asset */}
          <div className="bg-blue-950 border border-slate-800 rounded-lg p-4 space-y-3">
            <span className="text-[10px] uppercase font-bold text-slate-400 font-mono block">You Give (Hours to Swap)</span>
            <div>
              <label className="text-xs text-slate-400 block mb-1">Source Asset Category</label>
              <select
                value={sourceCategory}
                onChange={(e) => setSourceCategory(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-md p-2 text-xs text-white focus:outline-none focus:border-emerald-500 font-sans"
              >
                {categoryOptions.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs text-slate-400 block mb-1">Hours Amount (UTC)</label>
              <input
                type="number"
                value={sourceHours}
                onChange={(e) => setSourceHours(Math.max(1, Number(e.target.value)))}
                className="w-full bg-slate-900 border border-slate-800 rounded-md p-2 text-xs font-bold text-white focus:outline-none focus:border-emerald-500 font-mono"
              />
            </div>
          </div>

          {/* Target Asset */}
          <div className="bg-blue-950 border border-slate-800 rounded-lg p-4 space-y-3">
            <span className="text-[10px] uppercase font-bold text-emerald-400 font-mono block">You Receive (Target Asset)</span>
            <div>
              <label className="text-xs text-slate-400 block mb-1">Target Asset Category</label>
              <select
                value={targetCategory}
                onChange={(e) => setTargetCategory(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-md p-2 text-xs text-white focus:outline-none focus:border-emerald-500 font-sans"
              >
                {categoryOptions.filter(c => c !== sourceCategory).map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div className="p-2.5 bg-slate-900 rounded-md border border-slate-800 flex items-center justify-between text-xs">
              <span className="text-slate-400">Net Estimated Hours:</span>
              <span className="font-bold text-emerald-400 font-mono text-sm">
                {quoteResult?.netTargetHoursReceived || '3.5'} UTC Hours
              </span>
            </div>
          </div>
        </div>

        {/* Calculate Quote Action Button */}
        <div className="flex gap-3">
          <button
            onClick={handleFetchQuote}
            disabled={isLoadingQuote}
            className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold py-2.5 rounded-md text-xs flex items-center justify-center gap-2 transition border border-slate-700"
          >
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span>{isLoadingQuote ? 'Calculating AI Yield Ratio...' : 'Recalculate AI Cross-Quote'}</span>
          </button>

          <button
            onClick={handleConfirmSwap}
            className="flex-1 bg-emerald-500 hover:bg-emerald-400 text-blue-950 font-bold py-2.5 rounded-md text-xs flex items-center justify-center gap-2 transition shadow-lg shadow-emerald-500/20"
          >
            <ArrowRightLeft className="w-4 h-4" />
            <span>Execute Hours Swap</span>
          </button>
        </div>

        {swapSuccess && (
          <div className="bg-emerald-950/70 border border-emerald-500/40 rounded-lg p-3 text-emerald-300 text-xs flex items-center gap-2 animate-fade-in">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <span>Swap executed successfully! Wallet updated with new asset hours.</span>
          </div>
        )}

        {/* Dynamic Quote Valuation & Fee Transparency Card */}
        {quoteResult && (
          <div className="bg-blue-950 border border-slate-800 rounded-lg p-4 space-y-3 text-xs">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="font-bold text-white text-xs flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-emerald-400" />
                AI Market Valuation Insight
              </span>
              <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded font-mono">
                {quoteResult.exchangeRatio}
              </span>
            </div>

            <p className="text-slate-300 text-[11px] leading-relaxed italic">
              "{quoteResult.aiMarketInsight}"
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-slate-800 text-[11px] font-mono">
              <div className="bg-slate-900 p-2 rounded-md border border-slate-800">
                <span className="text-slate-500 block text-[9px]">Src Valuation</span>
                <span className="text-white font-bold">${quoteResult.sourceMarketRatePerHour}/hr</span>
              </div>
              <div className="bg-slate-900 p-2 rounded-md border border-slate-800">
                <span className="text-slate-500 block text-[9px]">Target Valuation</span>
                <span className="text-white font-bold">${quoteResult.targetMarketRatePerHour}/hr</span>
              </div>
              <div className="bg-slate-900 p-2 rounded-md border border-slate-800">
                <span className="text-slate-500 block text-[9px]">Buyer Fee (5%)</span>
                <span className="text-emerald-400 font-bold">{quoteResult.buyerFee5PercentUTC} UTC</span>
              </div>
              <div className="bg-slate-900 p-2 rounded-md border border-slate-800">
                <span className="text-slate-500 block text-[9px]">Seller Fee (5%)</span>
                <span className="text-emerald-400 font-bold">{quoteResult.sellerFee5PercentUTC} UTC</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* AdMob Rewarded Video Ad Section */}
      <AdMobBanner type="nativeAd" onRewardEarned={onRewardEarned} />
    </div>
  );
};
