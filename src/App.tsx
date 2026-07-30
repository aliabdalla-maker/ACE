import React, { useState } from 'react';
import { Listing, Bid, SmartWalletState, A2AAgentConfig, WalletTransaction, PriceAlert, ScheduledBooking } from './types';
import { TOP_40_LANGUAGES, LanguageItem } from './data/languages';
import { LanguageProvider } from './context/LanguageContext';
import { INITIAL_LISTINGS } from './data/initialListings';
import { AndroidFrame } from './components/AndroidFrame';
import { MarketplaceView } from './components/MarketplaceView';
import { AuctionBiddingModal } from './components/AuctionBiddingModal';
import { TimeCreditExchangeView } from './components/TimeCreditExchangeView';
import { A2ATradingConsole } from './components/A2ATradingConsole';
import { SmartWalletView } from './components/SmartWalletView';
import { CreateListingModal } from './components/CreateListingModal';
import { SchedulingModal } from './components/SchedulingModal';
import { TermsAndConditionsModal } from './components/TermsAndConditionsModal';
import { UsageInstructionsModal } from './components/UsageInstructionsModal';
import { AdMobBanner } from './components/AdMobBanner';
import { AuctionCountdownBar } from './components/AuctionCountdownBar';
import { Gavel, Clock, Sparkles, Percent, ShieldCheck, Eye, EyeOff, Trash2, X, Crown, Zap, CheckCircle2, BellRing, Bell } from 'lucide-react';

export default function App() {
  const [currentTab, setCurrentTab] = useState<'marketplace' | 'auctions' | 'time_exchange' | 'a2a_agent' | 'wallet'>('marketplace');
  const [selectedLanguage, setSelectedLanguage] = useState<LanguageItem>(TOP_40_LANGUAGES[0]); // English default
  const [listings, setListings] = useState<Listing[]>(INITIAL_LISTINGS);

  // Price Alerts State
  const [priceAlerts, setPriceAlerts] = useState<PriceAlert[]>([
    {
      id: 'alert-1',
      category: 'Hospitality & Hotels',
      commercialModel: 'All Models',
      targetPriceUSD: 200,
      condition: 'below',
      active: true,
      createdAt: '10:00 AM'
    },
    {
      id: 'alert-2',
      category: 'AI & Tech Services',
      commercialModel: 'hourly_booking',
      targetPriceUSD: 120,
      condition: 'below',
      active: true,
      createdAt: '11:30 AM'
    }
  ]);

  // Recent Search History State
  const [searchHistory, setSearchHistory] = useState<string[]>([
    'Executive Suite',
    'Private Jet Flight',
    'AI Developer',
    'Luxury Yacht'
  ]);

  // Smart Wallet State
  const [wallet, setWallet] = useState<SmartWalletState>({
    cashBalanceUSD: 2850,
    utcTimeCredits: 28.5,
    escrowHoldingUSD: 350,
    escrowHoldingUTC: 7.0,
    totalMarketplaceEarnedUSD: 145.50,
    transactions: [
      {
        id: 'tx-101',
        type: 'buy',
        title: 'Booked 5-Star Penthouse Suite (2 Hours)',
        amountUSD: 280,
        amountUTC: 5.6,
        buyerFee5Pct: 14.00,
        sellerFee5Pct: 14.00,
        totalFeeToPlatform: 28.00,
        timestamp: 'Today, 14:22',
        status: 'Completed'
      },
      {
        id: 'tx-102',
        type: 'time_swap',
        title: 'Swapped 5 Hotel Hours ⇄ 3.5 AI Consulting Hours',
        amountUSD: 350,
        amountUTC: 7.0,
        buyerFee5Pct: 17.50,
        sellerFee5Pct: 17.50,
        totalFeeToPlatform: 35.00,
        timestamp: 'Yesterday, 09:15',
        status: 'Completed'
      },
      {
        id: 'tx-103',
        type: 'ad_reward',
        title: 'Google AdMob Rewarded Video Ad Bonus',
        amountUSD: 25,
        amountUTC: 0.5,
        buyerFee5Pct: 0,
        sellerFee5Pct: 0,
        totalFeeToPlatform: 0,
        timestamp: '2 days ago',
        status: 'Completed'
      }
    ]
  });

  // Personal AI Agent Config
  const [agentConfig, setAgentConfig] = useState<A2AAgentConfig>({
    agentName: 'ACE-Agent-Alpha',
    autoBidEnabled: true,
    maxBidPriceUSD: 250,
    preferredCategories: ['AI & Tech Services', 'Hospitality & Hotels', 'Flights & Aviation'],
    autoAcceptSwapRatio: 0.8,
    riskTolerance: 'Balanced',
    targetLanguage: selectedLanguage.name
  });

  const [activeBiddingListing, setActiveBiddingListing] = useState<Listing | null>(null);
  const [showCreateListingModal, setShowCreateListingModal] = useState<boolean>(false);
  const [userBids, setUserBids] = useState<Bid[]>([
    {
      id: 'bid-demo-1',
      listingId: 'gaace-105',
      bidderName: 'You (Current User)',
      bidderType: 'Consumer',
      amountUSD: 165,
      amountUTC: 3.3,
      buyerFee5Pct: 8.25,
      sellerFee5Pct: 8.25,
      totalBuyerPays: 173.25,
      netSellerReceives: 156.75,
      timestamp: '15 mins ago',
      status: 'In Escrow'
    }
  ]);
  const [watchlist, setWatchlist] = useState<string[]>(['gaace-105', 'gaace-107']);
  const [rapidBidSuccessMsg, setRapidBidSuccessMsg] = useState<string | null>(null);

  const handleToggleWatchlist = (listingId: string) => {
    setWatchlist(prev => 
      prev.includes(listingId) 
        ? prev.filter(id => id !== listingId)
        : [...prev, listingId]
    );
  };

  const handleRapidTenPercentBid = (item: Listing) => {
    const currentPrice = item.currentHighestBidUSD || item.pricePerHourUSD;
    const rapidBidUSD = Math.round((currentPrice * 1.10) * 100) / 100;
    const buyerFee5Pct = Math.round(rapidBidUSD * 0.05 * 100) / 100;
    const sellerFee5Pct = Math.round(rapidBidUSD * 0.05 * 100) / 100;
    const totalBuyerPaysUSD = Math.round((rapidBidUSD + buyerFee5Pct) * 100) / 100;
    const netSellerReceivesUSD = Math.round((rapidBidUSD - sellerFee5Pct) * 100) / 100;
    const equivalentUTC = Math.round((rapidBidUSD / 50) * 10) / 10;

    const rapidBid: Bid = {
      id: `bid-rapid-${Date.now()}`,
      listingId: item.id,
      bidderName: 'You (Rapid +10%)',
      bidderType: 'Consumer',
      amountUSD: rapidBidUSD,
      amountUTC: equivalentUTC,
      buyerFee5Pct,
      sellerFee5Pct,
      totalBuyerPays: totalBuyerPaysUSD,
      netSellerReceives: netSellerReceivesUSD,
      timestamp: new Date().toLocaleTimeString(),
      status: 'In Escrow',
      isWinning: true
    };

    handlePlaceBid(rapidBid);
    setRapidBidSuccessMsg(`⚡ Rapid +10% Bid placed at $${rapidBidUSD}/hr for "${item.title}"! Total $${totalBuyerPaysUSD} in Escrow.`);
    setTimeout(() => setRapidBidSuccessMsg(null), 4500);
  };

  const handleSimulateRivalOutbid = (item: Listing) => {
    const currentHigh = item.currentHighestBidUSD || item.pricePerHourUSD;
    const rivalBidAmount = Math.round((currentHigh + 20) * 100) / 100;
    setListings(prev => prev.map(l => {
      if (l.id === item.id) {
        return {
          ...l,
          currentHighestBidUSD: rivalBidAmount,
          bidsCount: l.bidsCount + 1
        };
      }
      return l;
    }));
    setRapidBidSuccessMsg(`🔔 Rival Bidder placed $${rivalBidAmount}/hr on "${item.title}". Outbid notification triggered on Watchlist!`);
    setTimeout(() => setRapidBidSuccessMsg(null), 4500);
  };

  // Scheduled Bookings State
  const [scheduledBookings, setScheduledBookings] = useState<ScheduledBooking[]>([
    {
      id: 'booking-1',
      listingId: 'list-1',
      listingTitle: '5-Star Executive Penthouse Suite',
      category: 'Hospitality & Hotels',
      dateStr: '2026-07-29',
      utcTimeSlot: '14:00 - 16:00 UTC',
      hoursBooked: 2,
      utcCreditsDeducted: 5.6,
      status: 'Confirmed & Locked',
      bookingHash: '0x8f2a9c1b4e3d706f',
      createdAt: '10:15 AM'
    }
  ]);
  const [showSchedulingModal, setShowSchedulingModal] = useState<boolean>(false);
  const [schedulingListing, setSchedulingListing] = useState<Listing | null>(null);
  const [showTermsModal, setShowTermsModal] = useState<boolean>(false);
  const [showInstructionsModal, setShowInstructionsModal] = useState<boolean>(false);

  // Demo Data Management Handlers
  const handleClearDemoData = () => {
    setListings(prev => prev.filter(l => l.isDemo === false));
  };

  const handleRestoreDemoData = () => {
    setListings(INITIAL_LISTINGS);
  };

  // Handlers
  const handleConfirmSchedule = (newBooking: ScheduledBooking) => {
    setScheduledBookings(prev => [newBooking, ...prev]);
    setWallet(prev => ({
      ...prev,
      utcTimeCredits: Math.max(0, Math.round((prev.utcTimeCredits - newBooking.utcCreditsDeducted) * 10) / 10),
      transactions: [
        {
          id: `tx-sched-${Date.now()}`,
          type: 'auction_win',
          title: `Locked UTC Slot: ${newBooking.listingTitle} (${newBooking.dateStr} @ ${newBooking.utcTimeSlot})`,
          amountUSD: newBooking.hoursBooked * 100,
          amountUTC: newBooking.utcCreditsDeducted,
          buyerFee5Pct: Math.round(newBooking.hoursBooked * 5),
          sellerFee5Pct: Math.round(newBooking.hoursBooked * 5),
          totalFeeToPlatform: Math.round(newBooking.hoursBooked * 10),
          timestamp: 'Just now',
          status: 'In Escrow'
        },
        ...prev.transactions
      ]
    }));
  };
  const handleRewardEarned = (utcAmount: number) => {
    setWallet(prev => ({
      ...prev,
      utcTimeCredits: Math.round((prev.utcTimeCredits + utcAmount) * 10) / 10,
      transactions: [
        {
          id: `tx-ad-${Date.now()}`,
          type: 'ad_reward',
          title: `AdMob Rewarded Video Bonus (+${utcAmount} UTC)`,
          amountUSD: utcAmount * 50,
          amountUTC: utcAmount,
          buyerFee5Pct: 0,
          sellerFee5Pct: 0,
          totalFeeToPlatform: 0,
          timestamp: 'Just now',
          status: 'Completed'
        },
        ...prev.transactions
      ]
    }));
  };

  const handlePlaceBid = (bid: Bid) => {
    setUserBids(prev => [bid, ...prev]);

    // Update listing bid count & current highest
    setListings(prev => prev.map(l => {
      if (l.id === bid.listingId) {
        return {
          ...l,
          currentHighestBidUSD: bid.amountUSD,
          bidsCount: l.bidsCount + 1
        };
      }
      return l;
    }));

    // Lock buyer amount in escrow & ledger
    setWallet(prev => ({
      ...prev,
      cashBalanceUSD: Math.max(0, prev.cashBalanceUSD - bid.totalBuyerPays),
      escrowHoldingUSD: prev.escrowHoldingUSD + bid.totalBuyerPays,
      totalMarketplaceEarnedUSD: prev.totalMarketplaceEarnedUSD + bid.buyerFee5Pct + bid.sellerFee5Pct,
      transactions: [
        {
          id: `tx-bid-${Date.now()}`,
          type: 'auction_win',
          title: `Bid Order: ${bid.amountUSD} USD (Locked in Escrow)`,
          amountUSD: bid.amountUSD,
          amountUTC: bid.amountUTC,
          buyerFee5Pct: bid.buyerFee5Pct,
          sellerFee5Pct: bid.sellerFee5Pct,
          totalFeeToPlatform: bid.buyerFee5Pct + bid.sellerFee5Pct,
          timestamp: 'Just now',
          status: 'In Escrow'
        },
        ...prev.transactions
      ]
    }));
  };

  const handleExecuteSwap = (sourceHours: number, targetHours: number, targetCategory: string) => {
    setWallet(prev => ({
      ...prev,
      utcTimeCredits: Math.round((prev.utcTimeCredits - sourceHours + targetHours) * 10) / 10,
      transactions: [
        {
          id: `tx-swap-${Date.now()}`,
          type: 'time_swap',
          title: `Swapped ${sourceHours} UTC Hours ⇄ ${targetHours.toFixed(1)} UTC (${targetCategory})`,
          amountUSD: sourceHours * 50,
          amountUTC: sourceHours,
          buyerFee5Pct: Math.round(sourceHours * 0.05 * 50 * 100) / 100,
          sellerFee5Pct: Math.round(sourceHours * 0.05 * 50 * 100) / 100,
          totalFeeToPlatform: Math.round(sourceHours * 0.10 * 50 * 100) / 100,
          timestamp: 'Just now',
          status: 'Completed'
        },
        ...prev.transactions
      ]
    }));
  };

  const handleDepositCash = (amount: number) => {
    setWallet(prev => ({
      ...prev,
      cashBalanceUSD: prev.cashBalanceUSD + amount,
      transactions: [
        {
          id: `tx-dep-${Date.now()}`,
          type: 'buy',
          title: `Deposited $${amount} USD Cash Balance`,
          amountUSD: amount,
          amountUTC: amount / 50,
          buyerFee5Pct: 0,
          sellerFee5Pct: 0,
          totalFeeToPlatform: 0,
          timestamp: 'Just now',
          status: 'Completed'
        },
        ...prev.transactions
      ]
    }));
  };

  const handleCreateListing = (newListing: Listing) => {
    setListings(prev => [newListing, ...prev]);
  };

  const handleAddPriceAlert = (newAlert: PriceAlert) => {
    setPriceAlerts(prev => [newAlert, ...prev]);
  };

  const handleDeletePriceAlert = (alertId: string) => {
    setPriceAlerts(prev => prev.filter(a => a.id !== alertId));
  };

  const handleTogglePriceAlert = (alertId: string) => {
    setPriceAlerts(prev => prev.map(a => a.id === alertId ? { ...a, active: !a.active } : a));
  };

  const handleAddSearchHistory = (term: string) => {
    const trimmed = term.trim();
    if (!trimmed) return;
    setSearchHistory(prev => {
      const filtered = prev.filter(t => t.toLowerCase() !== trimmed.toLowerCase());
      return [trimmed, ...filtered].slice(0, 10);
    });
  };

  const handleClearSearchHistory = () => {
    setSearchHistory([]);
  };

  const handleRemoveSearchHistoryItem = (termToRemove: string) => {
    setSearchHistory(prev => prev.filter(t => t !== termToRemove));
  };

  return (
    <LanguageProvider initialLanguage={selectedLanguage} onLanguageChangeExternal={setSelectedLanguage}>
      <AndroidFrame
        currentTab={currentTab}
        onTabChange={setCurrentTab}
        selectedLanguage={selectedLanguage}
        onLanguageChange={(lang) => {
          setSelectedLanguage(lang);
          setAgentConfig(prev => ({ ...prev, targetLanguage: lang.name }));
        }}
        onRewardEarned={handleRewardEarned}
        onOpenScheduling={() => {
          setSchedulingListing(null);
          setShowSchedulingModal(true);
        }}
        onOpenTerms={() => setShowTermsModal(true)}
        onOpenInstructions={() => setShowInstructionsModal(true)}
      >
      {/* 1. Marketplace Tab */}
      {currentTab === 'marketplace' && (
        <MarketplaceView
          listings={listings}
          selectedLanguage={selectedLanguage}
          priceAlerts={priceAlerts}
          searchHistory={searchHistory}
          watchlist={watchlist}
          onToggleWatchlist={handleToggleWatchlist}
          onAddSearchHistory={handleAddSearchHistory}
          onClearSearchHistory={handleClearSearchHistory}
          onRemoveSearchHistoryItem={handleRemoveSearchHistoryItem}
          onAddPriceAlert={handleAddPriceAlert}
          onDeletePriceAlert={handleDeletePriceAlert}
          onTogglePriceAlert={handleTogglePriceAlert}
          onSelectListing={(listing, action) => {
            if (action === 'bid') setActiveBiddingListing(listing);
            else if (action === 'negotiate') setCurrentTab('a2a_agent');
            else if (action === 'swap') setCurrentTab('time_exchange');
            else if (action === 'schedule') {
              setSchedulingListing(listing);
              setShowSchedulingModal(true);
            }
          }}
          onOpenScheduling={(listing) => {
            setSchedulingListing(listing || null);
            setShowSchedulingModal(true);
          }}
          onOpenCreateListing={() => setShowCreateListingModal(true)}
          onRewardEarned={handleRewardEarned}
          onClearDemoData={handleClearDemoData}
          onRestoreDemoData={handleRestoreDemoData}
          onOpenTerms={() => setShowTermsModal(true)}
          onOpenInstructions={() => setShowInstructionsModal(true)}
        />
      )}

      {/* 2. Auctions & Bidding Tab */}
      {currentTab === 'auctions' && (
        <div className="space-y-6 max-w-5xl mx-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="font-bold text-white text-base flex items-center gap-2">
                <Gavel className="w-5 h-5 text-amber-400" />
                <span>Live Bidding & Reverse Auctions Console</span>
              </h2>
              <p className="text-xs text-slate-400">
                Participate in forward auctions, sealed bids, or reverse auctions with 5% dual platform fees.
              </p>
            </div>
            <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 text-xs font-mono shrink-0">
              <span className="text-slate-400">Your Active Placed Bids:</span>
              <span className="font-bold text-amber-400 ml-2">{userBids.length} Order(s)</span>
            </div>
          </div>

          {/* Dedicated Auction Watchlist Section */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4.5 space-y-4 shadow-xl">
            {rapidBidSuccessMsg && (
              <div className="bg-emerald-500/10 border border-emerald-500/40 text-emerald-300 p-3 rounded-xl flex items-center justify-between gap-2 text-xs font-medium animate-fadeIn">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{rapidBidSuccessMsg}</span>
                </div>
                <button 
                  onClick={() => setRapidBidSuccessMsg(null)}
                  className="text-emerald-400 hover:text-white p-1"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
                  <Eye className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-white tracking-tight flex items-center gap-2">
                    <span>Your Auction Watchlist</span>
                    <span className="bg-amber-400 text-slate-950 text-[11px] font-black px-2 py-0.5 rounded-full font-mono">
                      {listings.filter(l => watchlist.includes(l.id)).length}
                    </span>
                  </h3>
                  <p className="text-[11px] text-slate-400">Track active auctions, price updates, and countdown timers with rapid +10% bidding</p>
                </div>
              </div>
              {watchlist.length > 0 && (
                <button
                  onClick={() => setWatchlist([])}
                  className="text-[11px] text-slate-400 hover:text-rose-400 font-medium transition flex items-center gap-1 bg-slate-950 border border-slate-800 px-2.5 py-1 rounded-lg"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Clear Watchlist</span>
                </button>
              )}
            </div>

            {listings.filter(l => watchlist.includes(l.id)).length === 0 ? (
              <div className="bg-slate-950/80 border border-slate-800/80 rounded-xl p-6 text-center space-y-2">
                <div className="w-12 h-12 rounded-full bg-slate-800 text-amber-400 flex items-center justify-center mx-auto">
                  <Eye className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-xs text-slate-200">No Auctions Being Watched Yet</h4>
                <p className="text-[11px] text-slate-400 max-w-md mx-auto">
                  Click the <span className="text-amber-400 font-bold">Watch</span> button on any auction item in the marketplace or auctions console to track countdown timers & live bids here.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {listings.filter(l => watchlist.includes(l.id)).map(item => {
                  const hourlyPrice = item.currentHighestBidUSD || item.pricePerHourUSD;
                  const itemUserBids = userBids.filter(b => b.listingId === item.id);
                  const highestUserBid = itemUserBids.length > 0 ? Math.max(...itemUserBids.map(b => b.amountUSD)) : 0;
                  const isLeadingBidder = highestUserBid > 0 && item.currentHighestBidUSD !== undefined && highestUserBid >= item.currentHighestBidUSD;
                  const isOutbid = highestUserBid > 0 && item.currentHighestBidUSD !== undefined && item.currentHighestBidUSD > highestUserBid;
                  const nextTenPercentBidUSD = Math.round((hourlyPrice * 1.10) * 100) / 100;

                  return (
                    <div 
                      key={item.id} 
                      className={`bg-slate-950 border ${
                        isOutbid
                          ? 'border-rose-500/80 shadow-lg shadow-rose-500/15 ring-2 ring-rose-500/30'
                          : isLeadingBidder 
                            ? 'border-amber-400/80 shadow-lg shadow-amber-500/10 ring-1 ring-amber-400/30' 
                            : 'border-slate-800 hover:border-amber-500/50'
                      } rounded-xl p-3.5 transition space-y-3 relative group`}
                    >
                      <div className="flex items-start gap-3">
                        <img
                          src={item.imageUrl}
                          alt={item.title}
                          className="w-16 h-16 rounded-lg object-cover border border-slate-800 shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-1">
                            <h4 className="font-bold text-xs text-white truncate group-hover:text-amber-300 transition">
                              {item.title}
                            </h4>
                            <button
                              onClick={() => handleToggleWatchlist(item.id)}
                              className="text-slate-500 hover:text-rose-400 p-1 rounded transition shrink-0"
                              title="Remove from Watchlist"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                            <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded font-medium">
                              {item.category}
                            </span>
                            <span className="text-[11px] text-amber-400 font-mono font-bold">
                              ${hourlyPrice}/hr
                            </span>
                            {isLeadingBidder && (
                              <span className="inline-flex items-center gap-1 bg-amber-400/20 border border-amber-400/60 text-amber-300 text-[10px] font-extrabold px-2 py-0.5 rounded-md shadow-sm">
                                <Crown className="w-3 h-3 text-amber-400 fill-amber-400" />
                                <span>Leading Bidder</span>
                              </span>
                            )}
                            {isOutbid && (
                              <span className="inline-flex items-center gap-1 bg-rose-500/20 border border-rose-500/70 text-rose-300 text-[10px] font-black px-2 py-0.5 rounded-md shadow-sm animate-pulse">
                                <BellRing className="w-3.5 h-3.5 text-rose-400 fill-rose-400/40 animate-bounce" />
                                <span>OUTBID ALERT</span>
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Outbid Alert Banner */}
                      {isOutbid && (
                        <div className="bg-rose-950/60 border border-rose-500/40 rounded-lg p-2.5 text-[11px] text-rose-200 flex items-center justify-between gap-2 shadow-inner">
                          <div className="flex items-center gap-1.5 min-w-0">
                            <BellRing className="w-4 h-4 text-rose-400 animate-bounce shrink-0" />
                            <span className="truncate">
                              You were outbid! Your bid: <strong className="text-white">${highestUserBid}</strong> • High bid: <strong className="text-amber-300">${hourlyPrice}</strong>
                            </span>
                          </div>
                          <button
                            onClick={() => handleRapidTenPercentBid(item)}
                            className="bg-rose-500 hover:bg-rose-400 text-slate-950 font-black text-[10px] px-2.5 py-1 rounded-md shadow transition shrink-0 flex items-center gap-1"
                          >
                            <Zap className="w-3 h-3 fill-slate-950" />
                            <span>Reclaim (${nextTenPercentBidUSD})</span>
                          </button>
                        </div>
                      )}

                      {/* Live Auction Countdown Bar */}
                      <AuctionCountdownBar auctionEndsAt={item.auctionEndsAt} compact={false} />

                      <div className="flex items-center justify-between pt-1 border-t border-slate-900 gap-2">
                        <span className="text-[10px] text-slate-400 font-mono flex items-center gap-1 shrink-0">
                          {item.bidsCount ? `${item.bidsCount} bid(s)` : 'No bids yet'}
                          {isLeadingBidder && (
                            <span className="text-amber-400 font-bold ml-1"> (${highestUserBid})</span>
                          )}
                          {isOutbid && (
                            <span className="text-rose-400 font-bold ml-1"> (Your bid: ${highestUserBid})</span>
                          )}
                        </span>
                        
                        <div className="flex items-center gap-1.5">
                          {isLeadingBidder && (
                            <button
                              onClick={() => handleSimulateRivalOutbid(item)}
                              className="text-[10px] text-amber-400/80 hover:text-amber-300 underline font-semibold transition mr-1"
                              title="Simulate a higher rival bid to test Outbid Alert"
                            >
                              Test Outbid
                            </button>
                          )}

                          <button
                            onClick={() => handleRapidTenPercentBid(item)}
                            className={`${
                              isOutbid
                                ? 'bg-rose-500 hover:bg-rose-400 text-slate-950 shadow-rose-500/20'
                                : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-emerald-500/20'
                            } font-black px-2.5 py-1.5 rounded-lg text-xs flex items-center gap-1 transition shadow-md active:scale-95 shrink-0`}
                            title={`Rapidly place a bid at 110% of current price ($${nextTenPercentBidUSD}/hr)`}
                          >
                            <Zap className="w-3.5 h-3.5 fill-slate-950 text-slate-950" />
                            <span>+10% Bid (${nextTenPercentBidUSD})</span>
                          </button>
                          
                          <button
                            onClick={() => setActiveBiddingListing(item)}
                            className={`${
                              isOutbid
                                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/50 hover:bg-rose-500/30'
                                : isLeadingBidder 
                                  ? 'bg-amber-400/90 hover:bg-amber-300 text-slate-950 border border-amber-300' 
                                  : 'bg-slate-800 hover:bg-slate-700 text-white border border-slate-700'
                            } font-bold px-2.5 py-1.5 rounded-lg text-xs flex items-center gap-1 transition shadow-md shrink-0`}
                          >
                            <Gavel className="w-3.5 h-3.5" />
                            <span>Custom</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Active User Bids Ledger */}
          {userBids.length > 0 && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3">
              <h3 className="font-bold text-xs uppercase tracking-wider text-slate-300">Your Placed Bids & Escrow Status</h3>
              <div className="space-y-2">
                {userBids.map((b) => (
                  <div key={b.id} className="bg-slate-950 border border-slate-800 p-3 rounded-xl flex items-center justify-between text-xs font-mono">
                    <div>
                      <span className="font-bold text-white block">{b.bidderType} Bid • ${b.amountUSD}/hr</span>
                      <span className="text-[10px] text-slate-400">Buyer Fee (5%): +${b.buyerFee5Pct} | Seller Net: ${b.netSellerReceives}</span>
                    </div>
                    <span className="bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded text-[10px] font-bold">
                      Locked in Escrow: ${b.totalBuyerPays}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Grid of Active Auction Listings */}
          <MarketplaceView
            listings={listings.filter(l => l.commercialModels.includes('forward_auction') || l.commercialModels.includes('reverse_auction') || l.commercialModels.includes('live_bidding'))}
            selectedLanguage={selectedLanguage}
            watchlist={watchlist}
            onToggleWatchlist={handleToggleWatchlist}
            onSelectListing={(listing) => setActiveBiddingListing(listing)}
            onOpenCreateListing={() => setShowCreateListingModal(true)}
            onRewardEarned={handleRewardEarned}
          />
        </div>
      )}

      {/* 3. Time Credit (UTC) Tab */}
      {currentTab === 'time_exchange' && (
        <TimeCreditExchangeView
          wallet={wallet}
          selectedLanguage={selectedLanguage}
          onExecuteSwap={handleExecuteSwap}
          onRewardEarned={handleRewardEarned}
        />
      )}

      {/* 4. AI Agent Trade Console */}
      {currentTab === 'a2a_agent' && (
        <A2ATradingConsole
          agentConfig={agentConfig}
          onUpdateConfig={setAgentConfig}
          listings={listings}
          selectedLanguage={selectedLanguage}
        />
      )}

      {/* 5. Smart Wallet Tab */}
      {currentTab === 'wallet' && (
        <SmartWalletView
          wallet={wallet}
          selectedLanguage={selectedLanguage}
          onDepositCash={handleDepositCash}
          onRewardEarned={handleRewardEarned}
        />
      )}

      {/* Bidding Modal */}
      {activeBiddingListing && (
        <AuctionBiddingModal
          listing={activeBiddingListing}
          onClose={() => setActiveBiddingListing(null)}
          onPlaceBid={handlePlaceBid}
          userWalletBalanceUSD={wallet.cashBalanceUSD}
          userWalletBalanceUTC={wallet.utcTimeCredits}
        />
      )}

      {/* Create Listing Modal */}
      {showCreateListingModal && (
        <CreateListingModal
          onClose={() => setShowCreateListingModal(false)}
          onCreate={handleCreateListing}
        />
      )}

      {/* Global UTC Scheduling Modal */}
      {showSchedulingModal && (
        <SchedulingModal
          listings={listings}
          initialListing={schedulingListing}
          scheduledBookings={scheduledBookings}
          onClose={() => setShowSchedulingModal(false)}
          onConfirmSchedule={handleConfirmSchedule}
        />
      )}

      {/* Terms and Conditions Modal */}
      {showTermsModal && (
        <TermsAndConditionsModal
          onClose={() => setShowTermsModal(false)}
        />
      )}

      {/* Usage Instructions Modal */}
      {showInstructionsModal && (
        <UsageInstructionsModal
          onClose={() => setShowInstructionsModal(false)}
          onOpenCreateListing={() => setShowCreateListingModal(true)}
        />
      )}
      </AndroidFrame>
    </LanguageProvider>
  );
}
