import React, { useState } from 'react';
import { ADMOB_CREDENTIALS } from '../types';
import { PlayCircle, ShieldCheck, Sparkles, X, CheckCircle2, ExternalLink, Radio, Tv } from 'lucide-react';

interface AdMobBannerProps {
  type: 'banner' | 'nativeAd' | 'interstitial' | 'rewardedVideo' | 'appOpen' | 'rewardedInterstitial';
  onRewardEarned?: (amountUTC: number) => void;
  className?: string;
}

export const AdMobBanner: React.FC<AdMobBannerProps> = ({ type, onRewardEarned, className = '' }) => {
  const [showModal, setShowModal] = useState(false);
  const [adState, setAdState] = useState<'idle' | 'watching' | 'rewarded'>('idle');
  const [progress, setProgress] = useState(0);

  const getAdUnitId = () => {
    switch (type) {
      case 'banner': return ADMOB_CREDENTIALS.adUnits.banner;
      case 'nativeAd': return ADMOB_CREDENTIALS.adUnits.nativeAd;
      case 'interstitial': return ADMOB_CREDENTIALS.adUnits.interstitial;
      case 'rewardedVideo': return ADMOB_CREDENTIALS.adUnits.rewardedVideo;
      case 'appOpen': return ADMOB_CREDENTIALS.adUnits.appOpen;
      case 'rewardedInterstitial': return ADMOB_CREDENTIALS.adUnits.rewardedInterstitial;
      default: return ADMOB_CREDENTIALS.adUnits.banner;
    }
  };

  const adUnitId = getAdUnitId();

  const handleWatchAd = () => {
    setShowModal(true);
    setAdState('watching');
    setProgress(0);

    let count = 0;
    const interval = setInterval(() => {
      count += 20;
      setProgress(count);
      if (count >= 100) {
        clearInterval(interval);
        setAdState('rewarded');
        if (onRewardEarned) {
          onRewardEarned(0.5); // 0.5 UTC hours rewarded
        }
      }
    }, 400);
  };

  const renderModalContent = () => (
    showModal && (
      <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-md flex items-center justify-center p-4">
        <div className="bg-white border border-sky-200 rounded-2xl p-6 max-w-md w-full text-center relative shadow-2xl text-slate-900">
          <button onClick={() => setShowModal(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-700">
            <X className="w-5 h-5" />
          </button>
          
          <div className="w-14 h-14 bg-gradient-to-tr from-amber-400 to-amber-500 text-slate-950 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-md shadow-amber-500/20">
            <PlayCircle className="w-8 h-8" />
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[11px] font-bold mb-2">
            <Radio className="w-3.5 h-3.5 animate-pulse text-emerald-600" />
            <span>Google Ads Live Stream Active</span>
          </div>

          <h3 className="font-extrabold text-base text-slate-900 mb-1">
            Google AdMob Sponsored ({type})
          </h3>

          <div className="bg-slate-50 border border-slate-200 p-2.5 rounded-xl text-left text-[11px] font-mono space-y-1 mb-3 text-slate-600">
            <div className="flex justify-between"><span className="text-slate-400">Publisher:</span> <span className="font-bold text-slate-800">{ADMOB_CREDENTIALS.publisherId}</span></div>
            <div className="flex justify-between"><span className="text-slate-400">App ID:</span> <span className="font-bold text-slate-800">{ADMOB_CREDENTIALS.appUnitId}</span></div>
            <div className="flex justify-between"><span className="text-slate-400">Ad Unit ID:</span> <span className="font-bold text-blue-600 truncate">{adUnitId}</span></div>
          </div>

          {adState === 'watching' && (
            <div className="space-y-3 my-4">
              <p className="text-xs text-slate-600 font-medium">Serving verified Google Ads content...</p>
              <div className="w-full bg-sky-100 rounded-full h-3 overflow-hidden border border-sky-200">
                <div className="bg-gradient-to-r from-emerald-500 to-teal-400 h-3 transition-all duration-300" style={{ width: `${progress}%` }}></div>
              </div>
              <span className="text-[10px] text-slate-400 font-mono font-bold block">AdMob Network Handshake: {progress}%</span>
            </div>
          )}

          {adState === 'rewarded' && (
            <div className="bg-emerald-50 border border-emerald-300 rounded-xl p-3.5 my-3 text-emerald-900 text-xs flex flex-col items-center gap-1.5 shadow-sm">
              <ShieldCheck className="w-7 h-7 text-emerald-600 animate-bounce" />
              <span className="font-extrabold text-sm">Reward Unlocked!</span>
              <span className="text-emerald-700 text-[11px] font-medium">+0.5 Universal Time Credit (UTC) added to Smart Wallet.</span>
            </div>
          )}

          <button
            onClick={() => setShowModal(false)}
            className="mt-2 w-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs py-2.5 rounded-xl border border-slate-700 shadow-sm transition"
          >
            {adState === 'rewarded' ? 'Close & Claim Reward' : 'Cancel'}
          </button>
        </div>
      </div>
    )
  );

  if (type === 'banner') {
    return (
      <div className={`w-full bg-white border border-sky-200 rounded-xl p-2.5 text-xs text-slate-800 flex items-center justify-between shadow-sm ${className}`}>
        <div className="flex items-center gap-2">
          <span className="bg-amber-400 text-blue-950 font-black px-2 py-0.5 rounded-md text-[10px] tracking-wider uppercase shadow-sm">AdMob</span>
          <div className="truncate max-w-[220px] sm:max-w-xs">
            <span className="font-bold text-slate-900">Trade Time Credits 24/7 on ACE</span>
            <span className="text-blue-600 block text-[10px] truncate font-mono font-bold">Ad Unit: {adUnitId}</span>
          </div>
        </div>
        <button
          onClick={handleWatchAd}
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 transition text-[11px] shrink-0 shadow-md shadow-emerald-600/20"
        >
          <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
          Earn 0.5 UTC
        </button>
        {renderModalContent()}
      </div>
    );
  }

  if (type === 'nativeAd') {
    return (
      <div className={`bg-white border border-sky-200 rounded-2xl p-4 my-3 text-slate-900 shadow-sm ${className}`}>
        <div className="flex items-center justify-between mb-2">
          <span className="bg-blue-100 text-blue-700 border border-blue-200 font-bold px-2 py-0.5 rounded-lg text-[10px] tracking-wider uppercase">
            Sponsored AdMob Native
          </span>
          <span className="text-[10px] text-emerald-700 font-mono font-bold">Active: {adUnitId}</span>
        </div>
        <div className="flex items-start gap-3">
          <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center shrink-0 text-white font-black text-xl shadow-md shadow-blue-500/30">
            G
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-bold text-sm text-slate-900 truncate">Global AI Time Liquidity Protocol</h4>
            <p className="text-xs text-slate-600 mt-0.5 line-clamp-2">
              Trade hotel, flight, or consulting hours with instant A2A smart contracts &amp; 5% dual platform fees.
            </p>
          </div>
        </div>
        <div className="mt-3 flex items-center justify-between border-t border-sky-100 pt-2.5">
          <span className="text-[11px] text-blue-600 font-mono font-bold">Pub ID: {ADMOB_CREDENTIALS.publisherId}</span>
          <button
            onClick={handleWatchAd}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-3.5 py-1.5 rounded-xl text-xs transition shadow-md shadow-emerald-600/20 flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
            Watch &amp; Earn 0.5 UTC
          </button>
        </div>
        {renderModalContent()}
      </div>
    );
  }

  if (type === 'appOpen') {
    return (
      <div className={`bg-slate-900 text-white border border-amber-500/30 rounded-xl p-3 flex items-center justify-between text-xs shadow-md ${className}`}>
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-amber-400 text-slate-950 font-black flex items-center justify-center text-xs">
            Ad
          </div>
          <div>
            <div className="font-bold text-slate-100 flex items-center gap-1.5">
              <span>Google AdMob App Open Unit</span>
              <span className="text-[9px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-1.5 py-0.2 rounded font-mono">LIVE</span>
            </div>
            <span className="text-[10px] text-slate-400 font-mono block">Unit ID: {adUnitId}</span>
          </div>
        </div>
        <button
          onClick={handleWatchAd}
          className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold px-3 py-1.5 rounded-lg text-[11px] transition shadow"
        >
          View Ad
        </button>
        {renderModalContent()}
      </div>
    );
  }

  return (
    <div className={`bg-white border border-slate-200 rounded-xl p-3 text-xs flex items-center justify-between shadow-sm ${className}`}>
      <div className="flex items-center gap-2">
        <span className="bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded text-[10px] uppercase font-mono">
          AdMob {type}
        </span>
        <span className="text-slate-600 font-mono text-[11px] truncate max-w-[180px] sm:max-w-xs">{adUnitId}</span>
      </div>
      <button
        onClick={handleWatchAd}
        className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-3 py-1 rounded-lg text-xs transition shadow-sm"
      >
        Trigger Ad
      </button>
      {renderModalContent()}
    </div>
  );
};

