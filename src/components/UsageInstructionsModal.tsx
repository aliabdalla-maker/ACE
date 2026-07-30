import React, { useState } from 'react';
import { 
  X, 
  BookOpen, 
  Search, 
  Gavel, 
  Repeat, 
  Bot, 
  Wallet, 
  Sparkles, 
  Calendar, 
  CheckCircle2, 
  Percent, 
  ShieldCheck, 
  Tag, 
  Trash2,
  ChevronRight,
  Info
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface UsageInstructionsModalProps {
  onClose: () => void;
  onOpenCreateListing?: () => void;
}

export const UsageInstructionsModal: React.FC<UsageInstructionsModalProps> = ({ 
  onClose,
  onOpenCreateListing
}) => {
  const { t, selectedLanguage } = useLanguage();
  const [activeSection, setActiveSection] = useState<'getting_started' | 'bidding' | 'publishing' | 'utc_credits' | 'a2a_agent' | 'escrow'>('getting_started');

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-md flex items-center justify-center p-3 sm:p-5">
      <div className="bg-white border border-sky-200 rounded-2xl max-w-3xl w-full p-5 sm:p-6 shadow-2xl relative flex flex-col max-h-[90vh] text-slate-900">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-sky-100 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold shadow-md shadow-blue-500/20">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-extrabold text-slate-900 text-base tracking-tight flex items-center gap-1.5">
                {t('instructions_title', 'ACE Operating Instructions & Usage Guide')}
                <span className="text-[10px] bg-blue-100 text-blue-800 px-2 py-0.5 rounded-md font-mono font-bold">
                  {selectedLanguage.flag} {selectedLanguage.name}
                </span>
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                {t('instructions_subtitle', 'How to trade, publish, swap time credits & automate AI commerce')}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-sky-50 border border-sky-200 text-slate-500 hover:text-slate-900 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Section Navigation Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto py-2.5 border-b border-sky-100 shrink-0 text-xs font-semibold no-scrollbar">
          <button
            onClick={() => setActiveSection('getting_started')}
            className={`px-3 py-1.5 rounded-xl transition flex items-center gap-1.5 shrink-0 ${
              activeSection === 'getting_started'
                ? 'bg-blue-600 text-white font-bold shadow-sm'
                : 'bg-sky-50/70 hover:bg-sky-100 text-slate-700 border border-sky-200'
            }`}
          >
            <Search className="w-3.5 h-3.5" />
            <span>{t('tab_browse', '1. Browse & Search')}</span>
          </button>

          <button
            onClick={() => setActiveSection('bidding')}
            className={`px-3 py-1.5 rounded-xl transition flex items-center gap-1.5 shrink-0 ${
              activeSection === 'bidding'
                ? 'bg-blue-600 text-white font-bold shadow-sm'
                : 'bg-sky-50/70 hover:bg-sky-100 text-slate-700 border border-sky-200'
            }`}
          >
            <Gavel className="w-3.5 h-3.5" />
            <span>{t('tab_bidding', '2. Bidding & Booking')}</span>
          </button>

          <button
            onClick={() => setActiveSection('publishing')}
            className={`px-3 py-1.5 rounded-xl transition flex items-center gap-1.5 shrink-0 ${
              activeSection === 'publishing'
                ? 'bg-blue-600 text-white font-bold shadow-sm'
                : 'bg-sky-50/70 hover:bg-sky-100 text-slate-700 border border-sky-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>{t('tab_publishing', '3. Publish & Manage Data')}</span>
          </button>

          <button
            onClick={() => setActiveSection('utc_credits')}
            className={`px-3 py-1.5 rounded-xl transition flex items-center gap-1.5 shrink-0 ${
              activeSection === 'utc_credits'
                ? 'bg-blue-600 text-white font-bold shadow-sm'
                : 'bg-sky-50/70 hover:bg-sky-100 text-slate-700 border border-sky-200'
            }`}
          >
            <Repeat className="w-3.5 h-3.5" />
            <span>{t('tab_utc_credits', '4. Time Credits (UTC)')}</span>
          </button>

          <button
            onClick={() => setActiveSection('a2a_agent')}
            className={`px-3 py-1.5 rounded-xl transition flex items-center gap-1.5 shrink-0 ${
              activeSection === 'a2a_agent'
                ? 'bg-blue-600 text-white font-bold shadow-sm'
                : 'bg-sky-50/70 hover:bg-sky-100 text-slate-700 border border-sky-200'
            }`}
          >
            <Bot className="w-3.5 h-3.5" />
            <span>{t('tab_a2a_agent', '5. AI Agent Bidding')}</span>
          </button>

          <button
            onClick={() => setActiveSection('escrow')}
            className={`px-3 py-1.5 rounded-xl transition flex items-center gap-1.5 shrink-0 ${
              activeSection === 'escrow'
                ? 'bg-blue-600 text-white font-bold shadow-sm'
                : 'bg-sky-50/70 hover:bg-sky-100 text-slate-700 border border-sky-200'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>{t('tab_escrow', '6. 5% Escrow & Wallet')}</span>
          </button>
        </div>

        {/* Tab Content Body */}
        <div className="flex-1 overflow-y-auto py-4 space-y-4 text-xs leading-relaxed text-slate-700 pr-1">
          {activeSection === 'getting_started' && (
            <div className="space-y-3">
              <div className="bg-sky-50/80 border border-sky-200 rounded-xl p-4 space-y-2">
                <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                  <Search className="w-4 h-4 text-blue-600" />
                  How to Explore &amp; Filter the Marketplace
                </h3>
                <p>
                  ACE provides instant access to luxury hotel suites, jet charter hours, consulting, venues, and specialized services across 9 commercial trading models.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
                  <div className="bg-white p-3 rounded-lg border border-sky-200 space-y-1">
                    <span className="font-bold text-blue-800 text-xs block">Category Intelligence Chips</span>
                    <p className="text-[11px] text-slate-600">Select multi-category clusters (e.g., Professional Services, Hospitality, Tech) or granular domain chips to filter listings in real time.</p>
                  </div>
                  <div className="bg-white p-3 rounded-lg border border-sky-200 space-y-1">
                    <span className="font-bold text-blue-800 text-xs block">Real-Time Price Alerts</span>
                    <p className="text-[11px] text-slate-600">Click <strong className="text-slate-900">"Set Price Alert"</strong> to get automatic match notifications when rates drop below your target price.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'bidding' && (
            <div className="space-y-3">
              <div className="bg-sky-50/80 border border-sky-200 rounded-xl p-4 space-y-2">
                <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                  <Gavel className="w-4 h-4 text-blue-600" />
                  Bidding, Ordering &amp; UTC Slot Scheduling
                </h3>
                <p>
                  Participate in live forward auctions, reverse auctions, or instant hourly reservations.
                </p>
                <ol className="list-decimal pl-5 space-y-1.5 text-slate-700 font-medium pt-1">
                  <li>Click <strong className="text-slate-900">"Bid / Book Now"</strong> on any card to open the Bidding Order modal.</li>
                  <li>Choose your payment method: USD Cash Balance or Universal Time Credits (UTC).</li>
                  <li>Review the itemized <strong className="text-emerald-700">5.0% Buyer Fee</strong> breakdown before locking funds into Escrow.</li>
                  <li>Use <strong className="text-blue-700">"Schedule UTC Time Slot"</strong> to lock specific dates and hourly slots on the Global UTC Calendar.</li>
                </ol>
              </div>
            </div>
          )}

          {activeSection === 'publishing' && (
            <div className="space-y-3">
              <div className="bg-sky-50/80 border border-sky-200 rounded-xl p-4 space-y-2">
                <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  Publishing &amp; Advertising Commercial Services
                </h3>
                <p>
                  List your own assets (hotel suites, chauffeur vehicles, AI consulting time, spaces) on the live global ACE network.
                </p>
                <div className="bg-white p-3.5 rounded-xl border border-sky-200 space-y-2">
                  <div className="flex items-center gap-2 text-slate-900 font-extrabold text-xs">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Publishing Step-by-Step</span>
                  </div>
                  <ol className="list-decimal pl-5 space-y-1 text-slate-600 text-[11px] font-medium">
                    <li>Click <strong className="text-slate-900">"Advertise Asset"</strong> in the marketplace header.</li>
                    <li>Enter service details, hourly price in USD or UTC credits, location, and supported commercial trading models.</li>
                    <li>Publish your listing to immediately make it live for global buyers and AI trading agents.</li>
                    <li>Track incoming bookings, live bids, and 5% escrow settlements in your Smart Wallet.</li>
                  </ol>
                </div>
                {onOpenCreateListing && (
                  <button
                    onClick={() => {
                      onClose();
                      onOpenCreateListing();
                    }}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 transition shadow-md shadow-emerald-600/20 mt-2"
                  >
                    <Sparkles className="w-4 h-4 text-yellow-300" />
                    <span>Open "Advertise Asset" Form Now</span>
                  </button>
                )}
              </div>
            </div>
          )}

          {activeSection === 'utc_credits' && (
            <div className="space-y-3">
              <div className="bg-sky-50/80 border border-sky-200 rounded-xl p-4 space-y-2">
                <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                  <Repeat className="w-4 h-4 text-blue-600" />
                  Universal Time Credit (UTC) Swaps
                </h3>
                <p>
                  Trade time across industries without cash bottlenecks using automated 1-to-1 UTC time credit swaps.
                </p>
                <div className="bg-white p-3.5 rounded-xl border border-sky-200 space-y-1.5">
                  <span className="font-bold text-slate-900 text-xs block">Example Time Swap:</span>
                  <p className="text-[11px] text-slate-600">
                    Swap <strong>5.0 Hotel Suite Hours</strong> directly for <strong>3.5 AI System Consulting Hours</strong> using real-time benchmark exchange rates.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'a2a_agent' && (
            <div className="space-y-3">
              <div className="bg-sky-50/80 border border-sky-200 rounded-xl p-4 space-y-2">
                <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                  <Bot className="w-4 h-4 text-purple-600" />
                  Autonomous AI-to-AI (A2A) Bidding
                </h3>
                <p>
                  Let your personal AI agent negotiate rates and place bids in the background 24/7.
                </p>
                <ul className="list-disc pl-5 space-y-1 text-slate-700 text-[11px] font-medium">
                  <li>Configure your agent name, max hourly USD budget, and preferred service categories.</li>
                  <li>Enable <strong className="text-slate-900">Auto-Bidding</strong> to allow your bot to auto-counter competing bids in forward or reverse auctions.</li>
                  <li>Review autonomous trade logs in the A2A Trading Console tab.</li>
                </ul>
              </div>
            </div>
          )}

          {activeSection === 'escrow' && (
            <div className="space-y-3">
              <div className="bg-sky-50/80 border border-sky-200 rounded-xl p-4 space-y-2">
                <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  Smart Wallet &amp; 5% Dual Escrow Ledgers
                </h3>
                <p>
                  Track cash balances, escrow holdings, and audit statements with complete transparency.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 text-[11px]">
                  <div className="bg-white p-3 rounded-lg border border-sky-200 space-y-1">
                    <span className="font-bold text-slate-900 block">5% Buyer + 5% Seller Split</span>
                    <p className="text-slate-600">Both buyer and seller fees are itemized on every transaction receipt and audit report.</p>
                  </div>
                  <div className="bg-white p-3 rounded-lg border border-sky-200 space-y-1">
                    <span className="font-bold text-slate-900 block">AdMob Bonus &amp; QR Payments</span>
                    <p className="text-slate-600">Watch AdMob rewarded video ads to earn free UTC hours or receive payments via wallet QR code.</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="pt-3 border-t border-sky-100 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-mono">
            <Info className="w-4 h-4 text-blue-600" />
            <span>ACE Platform User Manual • Version 2.4</span>
          </div>
          <button
            onClick={onClose}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-5 py-2 rounded-xl text-xs transition shadow-md shadow-blue-500/20"
          >
            Got It!
          </button>
        </div>
      </div>
    </div>
  );
};
