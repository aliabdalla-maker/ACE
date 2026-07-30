import React, { useState, useEffect } from 'react';
import { TOP_40_LANGUAGES, LanguageItem } from '../data/languages';
import { ADMOB_CREDENTIALS } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { 
  Globe, 
  Wallet, 
  Bot, 
  Repeat, 
  Gavel, 
  Store, 
  Menu, 
  X, 
  Smartphone, 
  Monitor, 
  Sparkles, 
  Percent, 
  ShieldCheck, 
  Wifi, 
  BatteryMedium,
  Calendar,
  BookOpen,
  Scale
} from 'lucide-react';
import { AdMobBanner } from './AdMobBanner';

const appLogo = '/src/assets/images/app_logo_icon_1785405369377.jpg';
import { FirebaseAuthButton } from './FirebaseAuthButton';
import { AIFeatureSuiteModal } from './AIFeatureSuiteModal';

interface AndroidFrameProps {
  currentTab: 'marketplace' | 'auctions' | 'time_exchange' | 'a2a_agent' | 'wallet';
  onTabChange: (tab: 'marketplace' | 'auctions' | 'time_exchange' | 'a2a_agent' | 'wallet') => void;
  selectedLanguage: LanguageItem;
  onLanguageChange: (lang: LanguageItem) => void;
  onRewardEarned: (utcAmount: number) => void;
  onOpenScheduling?: () => void;
  onOpenTerms?: () => void;
  onOpenInstructions?: () => void;
  children: React.ReactNode;
}

export const AndroidFrame: React.FC<AndroidFrameProps> = ({
  currentTab,
  onTabChange,
  selectedLanguage,
  onLanguageChange,
  onRewardEarned,
  onOpenScheduling,
  onOpenTerms,
  onOpenInstructions,
  children
}) => {
  const { t } = useLanguage();
  const [isPhoneFrame, setIsPhoneFrame] = useState(false);
  const [showLangModal, setShowLangModal] = useState(false);
  const [showDrawer, setShowDrawer] = useState(false);
  const [showAdMobInfoModal, setShowAdMobInfoModal] = useState(false);
  const [showAISuiteModal, setShowAISuiteModal] = useState(false);
  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 10000);
    return () => clearInterval(interval);
  }, []);

  const navItems = [
    { id: 'marketplace' as const, label: t('nav_marketplace', 'Marketplace'), icon: Store },
    { id: 'auctions' as const, label: t('nav_bidding', 'Bidding & Auctions'), icon: Gavel },
    { id: 'time_exchange' as const, label: t('nav_time_exchange', 'Time Credit (UTC)'), icon: Repeat },
    { id: 'a2a_agent' as const, label: t('nav_a2a_agent', 'AI Agent Trade'), icon: Bot },
    { id: 'wallet' as const, label: t('nav_wallet', 'Smart Wallet'), icon: Wallet },
  ];

  const contentUI = (
    <div className="flex flex-col h-full bg-gradient-to-br from-blue-600 via-indigo-600 to-sky-600 text-slate-900 min-h-screen">
      {/* Android Top System Bar */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-sky-700 text-white text-[11px] px-4 py-1 flex items-center justify-between border-b border-blue-500/30 shrink-0 font-mono shadow-sm">
        <div className="flex items-center gap-2">
          <span className="font-semibold">{currentTime || '12:00'}</span>
          <span className="text-[10px] bg-emerald-400 text-slate-950 px-1.5 py-0.2 rounded font-sans font-extrabold">5G</span>
          <span className="hidden sm:inline text-blue-100 font-semibold">| ACE v2.4</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="hidden xs:inline text-yellow-300 text-[10px] font-sans font-bold">5.0% Buyer + 5.0% Seller Fee</span>
          <Wifi className="w-3.5 h-3.5 text-white" />
          <BatteryMedium className="w-4 h-4 text-emerald-300" />
        </div>
      </div>

      {/* App Action Bar Header */}
      <header className="bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-600 border-b border-blue-400/40 px-4 py-2.5 flex items-center justify-between shrink-0 sticky top-0 z-30 shadow-md text-white">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowDrawer(true)}
            className="p-1.5 rounded-md bg-white/20 hover:bg-white/30 text-white transition border border-white/20 shadow-sm"
            title="Open Menu Drawer"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2.5">
            <img 
              src={appLogo} 
              alt="ACE Logo" 
              className="w-8 h-8 rounded-lg object-cover shadow-md border border-amber-300/60"
              referrerPolicy="no-referrer"
            />
            <div>
              <h1 className="font-extrabold text-sm text-white tracking-tight flex items-center gap-1.5">
                ACE <span className="text-yellow-300 font-bold">Commerce Exchange</span>
              </h1>
              <p className="text-[10px] text-blue-100 font-medium truncate max-w-[140px] sm:max-w-xs">{selectedLanguage.welcomeText}</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Universal Time Wallet Balance Header Display */}
          <div className="hidden lg:flex flex-col items-end pr-2 border-r border-white/20">
            <span className="text-[9px] uppercase tracking-widest text-blue-100 font-mono font-bold">Universal Time Wallet</span>
            <span className="text-yellow-300 font-mono text-xs font-bold">28.50 UTC/H</span>
          </div>

          {/* Usage Instructions Guide Header Button */}
          {onOpenInstructions && (
            <button
              onClick={onOpenInstructions}
              className="p-1.5 px-2.5 rounded-lg bg-white/20 hover:bg-white/30 text-white text-xs flex items-center gap-1.5 transition border border-white/30 shadow-sm font-semibold"
              title="Open Usage Instructions & Operating Manual"
            >
              <BookOpen className="w-4 h-4 text-yellow-300" />
              <span className="hidden sm:inline text-[11px]">Instructions</span>
            </button>
          )}

          {/* Terms & Conditions Header Button */}
          {onOpenTerms && (
            <button
              onClick={onOpenTerms}
              className="p-1.5 px-2.5 rounded-lg bg-white/20 hover:bg-white/30 text-white text-xs flex items-center gap-1.5 transition border border-white/30 shadow-sm font-semibold"
              title="View Terms & Conditions of Use"
            >
              <Scale className="w-4 h-4 text-yellow-300" />
              <span className="hidden sm:inline text-[11px]">Terms</span>
            </button>
          )}

          {/* UTC Calendar Button */}
          {onOpenScheduling && (
            <button
              onClick={onOpenScheduling}
              className="p-1.5 px-2.5 rounded-lg bg-white/20 hover:bg-white/30 text-white text-xs flex items-center gap-1.5 transition border border-white/30 shadow-sm font-semibold"
              title="Open Global Time Calendar & UTC Scheduling"
            >
              <Calendar className="w-4 h-4 text-yellow-300" />
              <span className="hidden sm:inline text-[11px]">UTC Calendar</span>
            </button>
          )}

          {/* Frame Toggle */}
          <button
            onClick={() => setIsPhoneFrame(!isPhoneFrame)}
            className="p-1.5 px-2.5 rounded-lg bg-white/20 hover:bg-white/30 text-white text-xs flex items-center gap-1.5 transition border border-white/30 shadow-sm"
            title={isPhoneFrame ? "Switch to Full View" : "Switch to Android Phone View"}
          >
            {isPhoneFrame ? <Monitor className="w-4 h-4 text-yellow-300" /> : <Smartphone className="w-4 h-4 text-yellow-300" />}
            <span className="hidden md:inline text-[11px] font-semibold">{isPhoneFrame ? 'Full Screen' : 'Android App'}</span>
          </button>

          {/* AI Studio Suite Launcher Button */}
          <button
            onClick={() => setShowAISuiteModal(true)}
            className="p-1.5 px-3 rounded-lg bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 text-xs font-black flex items-center gap-1.5 transition shadow-md shadow-amber-500/20"
            title="Open Gemini AI Studio Suite (Chat, Grounding, Image/Video Studio, Voice, Music)"
          >
            <Sparkles className="w-4 h-4 text-slate-950 animate-bounce" />
            <span className="hidden sm:inline">AI Studio Suite</span>
          </button>

          {/* Firebase Authentication Button */}
          <FirebaseAuthButton />

          {/* Language Selector Button */}
          <button
            onClick={() => setShowLangModal(true)}
            className="p-1.5 px-2.5 rounded-lg bg-yellow-400 hover:bg-yellow-300 text-blue-950 text-xs font-bold flex items-center gap-1.5 transition shadow-sm"
          >
            <span className="text-sm">{selectedLanguage.flag}</span>
            <span className="hidden sm:inline text-[11px]">{selectedLanguage.name}</span>
            <Globe className="w-3.5 h-3.5 text-blue-950" />
          </button>
        </div>
      </header>

      {/* Exchange Rate Marquee Bar */}
      <div className="bg-sky-100/90 border-b border-sky-300 px-4 py-1.5 flex gap-4 overflow-x-auto whitespace-nowrap text-[11px] font-mono no-scrollbar shrink-0 shadow-inner text-blue-950">
        <span className="text-blue-900 font-sans font-black uppercase text-[10px] tracking-wider self-center">UTC RATES:</span>
        <span className="text-slate-800"><span className="text-blue-700 font-bold">HOTEL:</span> 1.0H ⇄ <span className="text-emerald-700 font-bold">0.82 FLIGHT</span></span>
        <span className="text-sky-400">|</span>
        <span className="text-slate-800"><span className="text-blue-700 font-bold">AI CONSULT:</span> 1.0H ⇄ <span className="text-emerald-700 font-bold">4.50 CAB</span></span>
        <span className="text-sky-400">|</span>
        <span className="text-slate-800"><span className="text-blue-700 font-bold">MEETING:</span> 1.0H ⇄ <span className="text-emerald-700 font-bold">1.20 MEAL</span></span>
        <span className="text-sky-400">|</span>
        <span className="text-slate-800"><span className="text-blue-700 font-bold">CHAUFFEUR:</span> 1.0H ⇄ <span className="text-emerald-700 font-bold">0.95 SPA</span></span>
        <span className="text-sky-400">|</span>
        <span className="text-slate-800"><span className="text-blue-700 font-bold">LEGAL:</span> 1.0H ⇄ <span className="text-emerald-700 font-bold">2.10 WORKSPACE</span></span>
      </div>

      {/* Top Banner AdMob Unit */}
      <div className="px-3 py-1.5 bg-sky-50 shrink-0 border-b border-sky-200">
        <AdMobBanner type="banner" onRewardEarned={onRewardEarned} />
      </div>

      {/* Main Scrollable View */}
      <main className="flex-1 overflow-y-auto pb-20 p-3 sm:p-5 max-w-7xl w-full mx-auto">
        {children}
      </main>

      {/* Android Bottom Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-sky-200 px-2 py-1.5 flex items-center justify-around shadow-xl text-slate-800">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`flex flex-col items-center py-1.5 px-3 rounded-xl transition-all ${
                isActive
                  ? 'text-white bg-blue-600 font-bold shadow-md shadow-blue-500/25 scale-105'
                  : 'text-slate-600 hover:text-blue-700 hover:bg-sky-100/70'
              }`}
            >
              <Icon className={`w-5 h-5 mb-0.5 ${isActive ? 'scale-110 text-white' : ''}`} />
              <span className="text-[10px] tracking-tight">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Drawer Menu Overlay */}
      {showDrawer && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex">
          <div className="w-80 max-w-[85vw] bg-white text-slate-900 h-full p-5 flex flex-col border-r border-sky-200 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-sky-200 mb-4">
              <div className="flex items-center gap-2.5">
                <img 
                  src={appLogo} 
                  alt="ACE Logo" 
                  className="w-10 h-10 rounded-xl object-cover shadow-md border border-amber-400/80"
                  referrerPolicy="no-referrer"
                />
                <div>
                  <h2 className="font-bold text-slate-900 text-sm tracking-tight">AI Commerce Exchange (ACE)</h2>
                  <p className="text-[10px] text-blue-600 font-mono font-bold">Enterprise Autonomous Economy</p>
                </div>
              </div>
              <button onClick={() => setShowDrawer(false)} className="p-1 rounded bg-sky-100 text-slate-600 hover:text-slate-900">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 flex-1 overflow-y-auto">
              <div className="p-4 bg-gradient-to-br from-blue-50 to-sky-100 rounded-xl border border-sky-200 space-y-1.5 shadow-sm">
                <p className="text-[10px] uppercase font-black text-blue-800">Platform Compliance</p>
                <p className="text-xs text-slate-800 font-semibold">Trading Fee: <span className="text-emerald-600 font-bold">5.0%</span></p>
                <p className="text-[10px] text-slate-600 italic">Applied to both Buyer &amp; Seller on execution.</p>
              </div>

              <div className="space-y-1">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider px-1 mb-2">Navigation</p>
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = currentTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        onTabChange(item.id);
                        setShowDrawer(false);
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-semibold transition ${
                        isActive
                          ? 'bg-blue-600 text-white font-bold shadow-md shadow-blue-500/20'
                          : 'text-slate-700 hover:bg-sky-100 hover:text-blue-900'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>

              <div className="space-y-2 pt-3 border-t border-sky-200">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider px-1">Protocol Governance &amp; Manual</p>
                {onOpenInstructions && (
                  <button
                    onClick={() => {
                      onOpenInstructions();
                      setShowDrawer(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-sky-100 hover:text-blue-900 transition"
                  >
                    <BookOpen className="w-4 h-4 text-blue-600" />
                    <span>Usage Instructions Guide</span>
                  </button>
                )}
                {onOpenTerms && (
                  <button
                    onClick={() => {
                      onOpenTerms();
                      setShowDrawer(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-sky-100 hover:text-blue-900 transition"
                  >
                    <Scale className="w-4 h-4 text-blue-600" />
                    <span>Terms &amp; Conditions of Use</span>
                  </button>
                )}
                <button
                  onClick={() => setShowAdMobInfoModal(true)}
                  className="w-full bg-sky-50 hover:bg-sky-100 border border-sky-200 rounded-xl p-3 text-left transition shadow-sm mt-1"
                >
                  <div className="flex items-center gap-2 text-blue-700 font-bold text-xs mb-1">
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    <span>AdMob Revenue Integration</span>
                  </div>
                  <p className="text-[10px] text-emerald-700 font-mono font-bold truncate">Status: Active &amp; Verified Account</p>
                </button>
              </div>
            </div>

            <div className="pt-4 border-t border-sky-200 text-[10px] text-slate-500 font-mono text-center">
              ACE Android Engine v2.4 • 40 Languages Active
            </div>
          </div>
          <div className="flex-1" onClick={() => setShowDrawer(false)} />
        </div>
      )}

      {/* 40 Top Languages Selection Modal */}
      {showLangModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white border border-sky-200 rounded-2xl max-w-lg w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
            <div className="p-4 border-b border-sky-200 flex items-center justify-between bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
              <div className="flex items-center gap-2">
                <Globe className="w-5 h-5 text-yellow-300" />
                <h3 className="font-bold text-white text-base">Select Global Language (40 Spoken)</h3>
              </div>
              <button onClick={() => setShowLangModal(false)} className="p-1 rounded bg-white/20 text-white hover:bg-white/30">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-3 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 gap-2 flex-1 bg-sky-50/50">
              {TOP_40_LANGUAGES.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => {
                    onLanguageChange(lang);
                    setShowLangModal(false);
                  }}
                  className={`flex items-center justify-between p-2.5 rounded-xl border transition text-left ${
                    selectedLanguage.code === lang.code
                      ? 'bg-blue-600 border-blue-600 text-white font-bold shadow-md'
                      : 'bg-white border-sky-200 text-slate-800 hover:bg-sky-100/80 hover:border-blue-300'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="text-xl shrink-0">{lang.flag}</span>
                    <div className="truncate">
                      <p className={`text-xs font-semibold truncate ${selectedLanguage.code === lang.code ? 'text-white' : 'text-slate-900'}`}>{lang.name}</p>
                      <p className={`text-[10px] truncate ${selectedLanguage.code === lang.code ? 'text-blue-100' : 'text-slate-500'}`}>{lang.nativeName}</p>
                    </div>
                  </div>
                  {selectedLanguage.code === lang.code && (
                    <ShieldCheck className="w-4 h-4 text-yellow-300 shrink-0" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* AI Feature Suite Modal */}
      {showAISuiteModal && (
        <AIFeatureSuiteModal
          onClose={() => setShowAISuiteModal(false)}
        />
      )}

      {/* AdMob Configuration Modal */}
      {showAdMobInfoModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white border border-sky-200 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative text-slate-900 max-h-[90vh] overflow-y-auto">
            <button onClick={() => setShowAdMobInfoModal(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-1 rounded-lg">
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2.5 text-blue-900 font-extrabold text-base mb-2">
              <div className="w-8 h-8 rounded-xl bg-amber-400 text-blue-950 font-black flex items-center justify-center text-xs shadow-sm">
                Ad
              </div>
              <div>
                <h3 className="font-extrabold text-slate-900">Google AdMob Active Integration</h3>
                <span className="text-[10px] text-emerald-600 font-mono font-bold block">Status: Active &amp; Connected to Real Google Ads</span>
              </div>
            </div>

            <p className="text-xs text-slate-600 mb-4">
              Your Google AdMob Publisher account &amp; production ad units are connected to serve real Google Ads and pay out Universal Time Credits (UTC) to active users.
            </p>

            <div className="space-y-2.5 text-xs font-mono bg-slate-50 p-4 rounded-xl border border-slate-200">
              <div className="flex items-center justify-between bg-white p-2 rounded-lg border border-slate-200">
                <span className="text-slate-500 font-bold">Publisher ID:</span>
                <span className="text-blue-700 font-extrabold">{ADMOB_CREDENTIALS.publisherId}</span>
              </div>
              <div className="flex items-center justify-between bg-white p-2 rounded-lg border border-slate-200">
                <span className="text-slate-500 font-bold">App Unit ID:</span>
                <span className="text-blue-700 font-extrabold">{ADMOB_CREDENTIALS.appUnitId}</span>
              </div>

              <div className="pt-2 border-t border-slate-200 space-y-1.5 text-[11px]">
                <span className="text-slate-400 font-bold font-sans uppercase text-[10px] block mb-1">Active Ad Units (6 Units Connected):</span>
                
                <div className="flex items-center justify-between bg-white p-2 rounded-lg border border-slate-100">
                  <span className="text-slate-700 font-bold">1. Banner Ad Unit:</span>
                  <span className="text-emerald-700 font-extrabold">{ADMOB_CREDENTIALS.adUnits.banner}</span>
                </div>

                <div className="flex items-center justify-between bg-white p-2 rounded-lg border border-slate-100">
                  <span className="text-slate-700 font-bold">2. Interstitial Unit:</span>
                  <span className="text-emerald-700 font-extrabold">{ADMOB_CREDENTIALS.adUnits.interstitial}</span>
                </div>

                <div className="flex items-center justify-between bg-white p-2 rounded-lg border border-slate-100">
                  <span className="text-slate-700 font-bold">3. Rewarded Video Unit:</span>
                  <span className="text-amber-600 font-extrabold">{ADMOB_CREDENTIALS.adUnits.rewardedVideo} (+0.5 UTC)</span>
                </div>

                <div className="flex items-center justify-between bg-white p-2 rounded-lg border border-slate-100">
                  <span className="text-slate-700 font-bold">4. Native Feed Unit:</span>
                  <span className="text-emerald-700 font-extrabold">{ADMOB_CREDENTIALS.adUnits.nativeAd}</span>
                </div>

                <div className="flex items-center justify-between bg-white p-2 rounded-lg border border-slate-100">
                  <span className="text-slate-700 font-bold">5. App Open Unit:</span>
                  <span className="text-indigo-600 font-extrabold">{ADMOB_CREDENTIALS.adUnits.appOpen}</span>
                </div>

                <div className="flex items-center justify-between bg-white p-2 rounded-lg border border-slate-100">
                  <span className="text-slate-700 font-bold">6. Rewarded Interstitial:</span>
                  <span className="text-purple-600 font-extrabold">{ADMOB_CREDENTIALS.adUnits.rewardedInterstitial}</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowAdMobInfoModal(false)}
              className="mt-4 w-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs py-2.5 rounded-xl transition shadow-md"
            >
              Done &amp; Close Status
            </button>
          </div>
        </div>
      )}
    </div>
  );

  if (isPhoneFrame) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-200 via-sky-100 to-indigo-200 flex items-center justify-center p-2 sm:p-6">
        <div className="w-full max-w-[430px] h-[880px] max-h-[95vh] bg-white rounded-[48px] border-[10px] border-blue-600 shadow-[0_20px_60px_rgba(37,99,235,0.3)] flex flex-col overflow-hidden relative">
          {/* Phone Speaker Notch */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-5 bg-blue-600 rounded-b-2xl z-50 flex items-center justify-center">
            <div className="w-12 h-1 bg-white rounded-full" />
          </div>
          <div className="flex-1 overflow-hidden pt-3">
            {contentUI}
          </div>
        </div>
      </div>
    );
  }

  return contentUI;
};
