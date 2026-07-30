import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Listing, CategoryType, CommercialModel, PriceAlert, Review, WalletTransaction } from '../types';
import { LanguageItem } from '../data/languages';
import { INITIAL_REVIEWS } from '../data/initialReviews';
import { ListingReviewsModal } from './ListingReviewsModal';
import { PeerMessageThreadModal } from './PeerMessageThreadModal';
import { useLanguage } from '../context/LanguageContext';
import { 
  Search, 
  Filter, 
  Clock, 
  DollarSign, 
  Star, 
  CheckCircle, 
  Gavel, 
  Repeat, 
  Bot, 
  Percent, 
  Sparkles, 
  ChevronRight, 
  Calendar,
  Layers,
  Bell,
  Trash2,
  Power,
  Plus,
  AlertCircle,
  History,
  X,
  Check,
  Cpu,
  Tag,
  Share2,
  Copy,
  MessageSquare,
  RotateCcw,
  Database,
  BookOpen,
  Scale,
  Eye,
  EyeOff
} from 'lucide-react';
import { AdMobBanner } from './AdMobBanner';
import { PriceAlertModal } from './PriceAlertModal';
import { AuctionCountdownBar } from './AuctionCountdownBar';

interface MarketplaceViewProps {
  listings: Listing[];
  selectedLanguage: LanguageItem;
  priceAlerts?: PriceAlert[];
  searchHistory?: string[];
  watchlist?: string[];
  onToggleWatchlist?: (listingId: string) => void;
  onAddSearchHistory?: (term: string) => void;
  onClearSearchHistory?: () => void;
  onRemoveSearchHistoryItem?: (term: string) => void;
  onAddPriceAlert?: (alert: PriceAlert) => void;
  onDeletePriceAlert?: (alertId: string) => void;
  onTogglePriceAlert?: (alertId: string) => void;
  onSelectListing: (listing: Listing, action: 'bid' | 'negotiate' | 'swap' | 'schedule') => void;
  onOpenScheduling?: (listing?: Listing) => void;
  onOpenCreateListing: () => void;
  onRewardEarned: (utcAmount: number) => void;
  onClearDemoData?: () => void;
  onRestoreDemoData?: () => void;
  onOpenTerms?: () => void;
  onOpenInstructions?: () => void;
}

export const MarketplaceView: React.FC<MarketplaceViewProps> = ({
  listings,
  selectedLanguage,
  priceAlerts = [],
  searchHistory = [],
  watchlist = [],
  onToggleWatchlist,
  onAddSearchHistory,
  onClearSearchHistory,
  onRemoveSearchHistoryItem,
  onAddPriceAlert,
  onDeletePriceAlert,
  onTogglePriceAlert,
  onSelectListing,
  onOpenScheduling,
  onOpenCreateListing,
  onRewardEarned,
  onClearDemoData,
  onRestoreDemoData,
  onOpenTerms,
  onOpenInstructions
}) => {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoryChips, setSelectedCategoryChips] = useState<string[]>([]);
  const [selectedModel, setSelectedModel] = useState<string>('All');
  const [dataFilter, setDataFilter] = useState<'all' | 'user' | 'demo'>('all');
  const [translatedMap, setTranslatedMap] = useState<Record<string, { title: string; desc: string }>>({});
  const [translatingId, setTranslatingId] = useState<string | null>(null);
  const [showPriceAlertModal, setShowPriceAlertModal] = useState<boolean>(false);
  const [showAlertsPanel, setShowAlertsPanel] = useState<boolean>(true);
  const [sharedListingId, setSharedListingId] = useState<string | null>(null);

  // Reviews State
  const [reviews, setReviews] = useState<Review[]>(INITIAL_REVIEWS);
  const [activeReviewsListing, setActiveReviewsListing] = useState<Listing | null>(null);
  const [activeMessagingListing, setActiveMessagingListing] = useState<Listing | null>(null);
  const [completedTransactions, setCompletedTransactions] = useState<WalletTransaction[]>([
    {
      id: 'tx-101',
      listingId: 'gaace-101',
      type: 'buy',
      title: 'Booked 5-Star Penthouse Suite (2 Hours)',
      amountUSD: 280,
      amountUTC: 5.6,
      buyerFee5Pct: 14.00,
      sellerFee5Pct: 14.00,
      totalFeeToPlatform: 28.00,
      timestamp: 'Today, 14:22',
      status: 'Completed'
    }
  ]);

  // Category Intelligence Clusters & Granular Domain Chips
  const intelligenceCategoryChips = [
    { id: 'Professional Services', label: 'Professional Services', isCluster: true },
    { id: 'Hospitality', label: 'Hospitality', isCluster: true },
    { id: 'Technology', label: 'Technology', isCluster: true },
    { id: 'Hospitality & Hotels', label: 'Hospitality & Hotels', isCluster: false },
    { id: 'AI & Tech Services', label: 'AI & Tech Services', isCluster: false },
    { id: 'Legal & Financial', label: 'Legal & Financial', isCluster: false },
    { id: 'Flights & Aviation', label: 'Flights & Aviation', isCluster: false },
    { id: 'Chauffeur & Transport', label: 'Chauffeur & Transport', isCluster: false },
    { id: 'Workspace & Venues', label: 'Workspace & Venues', isCluster: false },
    { id: 'Equipment & Machinery', label: 'Equipment & Machinery', isCluster: false },
    { id: 'Tours & Experiences', label: 'Tours & Experiences', isCluster: false },
  ];

  const models = [
    { id: 'All', label: 'All Trading Models' },
    { id: 'hourly_booking', label: 'Hourly Booking' },
    { id: 'forward_auction', label: 'Forward Auction' },
    { id: 'reverse_auction', label: 'Reverse Auction' },
    { id: 'time_credit_swap', label: 'Time Credit Swap' },
    { id: 'a2a_negotiation', label: 'AI-to-AI Negotiation' }
  ];

  const isListingInChipCategory = (listingCategory: string, chipCategory: string): boolean => {
    if (chipCategory === 'Professional Services') {
      return ['Professional Services', 'Legal & Financial', 'Workspace & Venues', 'Chauffeur & Transport'].some(
        c => listingCategory.toLowerCase().includes(c.toLowerCase()) || c.toLowerCase().includes(listingCategory.toLowerCase())
      );
    }
    if (chipCategory === 'Hospitality') {
      return ['Hospitality', 'Hospitality & Hotels', 'Tours & Experiences'].some(
        c => listingCategory.toLowerCase().includes(c.toLowerCase()) || c.toLowerCase().includes(listingCategory.toLowerCase())
      );
    }
    if (chipCategory === 'Technology') {
      return ['Technology', 'AI & Tech Services', 'Equipment & Machinery'].some(
        c => listingCategory.toLowerCase().includes(c.toLowerCase()) || c.toLowerCase().includes(listingCategory.toLowerCase())
      );
    }
    return listingCategory.toLowerCase() === chipCategory.toLowerCase();
  };

  const getCategoryResultCount = (chipCategory: string): number => {
    return listings.filter(item => {
      const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            item.location.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesModel = selectedModel === 'All' || item.commercialModels.includes(selectedModel as CommercialModel);
      if (!matchesSearch || !matchesModel) return false;
      return isListingInChipCategory(item.category, chipCategory);
    }).length;
  };

  const toggleCategoryChip = (chipCategory: string) => {
    setSelectedCategoryChips(prev => {
      if (prev.includes(chipCategory)) {
        return prev.filter(c => c !== chipCategory);
      } else {
        return [...prev, chipCategory];
      }
    });
  };

  const clearCategoryChips = () => {
    setSelectedCategoryChips([]);
  };

  const handleTranslateCard = async (listing: Listing) => {
    if (translatedMap[listing.id]) return;
    setTranslatingId(listing.id);
    try {
      const resTitle = await fetch('/api/gemini/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: listing.title, targetLanguage: selectedLanguage.name })
      });
      const dataTitle = await resTitle.json();

      const resDesc = await fetch('/api/gemini/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: listing.description, targetLanguage: selectedLanguage.name })
      });
      const dataDesc = await resDesc.json();

      setTranslatedMap(prev => ({
        ...prev,
        [listing.id]: {
          title: dataTitle.translatedText || listing.title,
          desc: dataDesc.translatedText || listing.description
        }
      }));
    } catch (e) {
      console.error(e);
    } finally {
      setTranslatingId(null);
    }
  };

  const handleShareListing = async (e: React.MouseEvent, listing: Listing) => {
    e.stopPropagation();
    const trans = translatedMap[listing.id];
    const displayTitle = trans ? trans.title : listing.title;
    const hourlyPrice = listing.currentHighestBidUSD || listing.pricePerHourUSD;
    const shareUrl = `${window.location.origin}${window.location.pathname}#listing-${listing.id}`;
    const shareText = `Check out "${displayTitle}" on AI Commerce Exchange (ACE) ($${hourlyPrice}/hr • ${listing.timeCreditsPerHourUTC} UTC/hr)!`;

    const shareData = {
      title: `${displayTitle} | AI Commerce Exchange (ACE)`,
      text: shareText,
      url: shareUrl,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        setSharedListingId(listing.id);
        setTimeout(() => setSharedListingId(null), 2500);
      } catch {
        // User cancelled or share API unavailable/failed, fallback to clipboard
        copyToClipboard(`${shareText}\nLink: ${shareUrl}`, listing.id);
      }
    } else {
      copyToClipboard(`${shareText}\nLink: ${shareUrl}`, listing.id);
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text);
    } else {
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
    }
    setSharedListingId(id);
    setTimeout(() => setSharedListingId(null), 2500);
  };

  const getListingReviews = (listingId: string) => reviews.filter(r => r.listingId === listingId);
  const getReviewCount = (listingId: string) => getListingReviews(listingId).length;
  const calcAvgRating = (listingId: string, defaultRating: number) => {
    const revs = getListingReviews(listingId);
    if (revs.length === 0) return defaultRating;
    return Number((revs.reduce((acc, r) => acc + r.rating, 0) / revs.length).toFixed(1));
  };

  const handleAddReview = (newReview: Review) => {
    setReviews(prev => [newReview, ...prev]);
  };

  const handleSimulateCompleteTransaction = (listing: Listing) => {
    const newTx: WalletTransaction = {
      id: `tx-completed-${Date.now()}`,
      listingId: listing.id,
      type: 'buy',
      title: `Completed Service Booking: ${listing.title}`,
      amountUSD: listing.pricePerHourUSD,
      amountUTC: listing.timeCreditsPerHourUTC,
      buyerFee5Pct: Math.round(listing.pricePerHourUSD * 0.05 * 100) / 100,
      sellerFee5Pct: Math.round(listing.pricePerHourUSD * 0.05 * 100) / 100,
      totalFeeToPlatform: Math.round(listing.pricePerHourUSD * 0.10 * 100) / 100,
      timestamp: 'Just now',
      status: 'Completed'
    };
    setCompletedTransactions(prev => [newTx, ...prev]);
  };

  const filteredListings = listings.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.location.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCat = selectedCategoryChips.length === 0 ||
      selectedCategoryChips.some(chip => isListingInChipCategory(item.category, chip));

    const matchesModel = selectedModel === 'All' || item.commercialModels.includes(selectedModel as CommercialModel);

    return matchesSearch && matchesCat && matchesModel;
  });

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && searchQuery.trim() && onAddSearchHistory) {
      onAddSearchHistory(searchQuery.trim());
    }
  };

  return (
    <div className="space-y-4">
      {/* Real Live Marketplace Network Status Bar */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-sky-900 text-white rounded-2xl p-3.5 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs border border-blue-700/50">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-extrabold text-yellow-300 flex items-center gap-1.5 uppercase tracking-wider text-[11px] font-mono">
            <Database className="w-4 h-4 text-yellow-300" />
            ACE Verified Network Data:
          </span>
          <span className="bg-emerald-500/20 text-emerald-300 font-extrabold px-2.5 py-1 rounded-xl border border-emerald-500/40 text-[11px] flex items-center gap-1">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
            {listings.length} Active Real Listings
          </span>
          <span className="bg-blue-500/20 text-blue-200 font-bold px-2 py-1 rounded-xl text-[11px] font-mono">
            Escrow Rate: 5.0% Dual Split
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          {onOpenInstructions && (
            <button
              onClick={onOpenInstructions}
              className="bg-amber-400 hover:bg-amber-300 text-blue-950 font-bold px-3.5 py-1.5 rounded-xl text-[11px] flex items-center gap-1.5 transition shadow-sm"
              title="View ACE Usage Manual & Operating Instructions"
            >
              <BookOpen className="w-3.5 h-3.5 text-blue-950" />
              <span>Usage Instructions</span>
            </button>
          )}

          {onOpenTerms && (
            <button
              onClick={onOpenTerms}
              className="bg-white/20 hover:bg-white/30 text-white font-bold px-3.5 py-1.5 rounded-xl text-[11px] flex items-center gap-1.5 transition border border-white/30 shadow-sm"
              title="Read Terms & Conditions of Use"
            >
              <Scale className="w-3.5 h-3.5 text-yellow-300" />
              <span>Terms &amp; Conditions</span>
            </button>
          )}
        </div>
      </div>

      {/* Visually Simple 3-Step Operating Guide Banner */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-black text-slate-900 tracking-tight flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>Simple 3-Step Guide to Trading on ACE</span>
          </h3>
          <span className="text-[10px] text-slate-500 font-semibold bg-slate-100 px-2 py-0.5 rounded-md">Quick Start</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl flex items-start gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-blue-600 text-white font-black text-xs flex items-center justify-center shrink-0">
              1
            </div>
            <div>
              <div className="font-extrabold text-xs text-slate-900">Explore &amp; Filter</div>
              <p className="text-[11px] text-slate-600 mt-0.5">Search listings by hourly rate, category, or commercial model.</p>
            </div>
          </div>
          <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl flex items-start gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white font-black text-xs flex items-center justify-center shrink-0">
              2
            </div>
            <div>
              <div className="font-extrabold text-xs text-slate-900">Book, Bid or Swap</div>
              <p className="text-[11px] text-slate-600 mt-0.5">Place bids in real-time auctions or trade Universal Time Credits (UTC).</p>
            </div>
          </div>
          <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl flex items-start gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-purple-600 text-white font-black text-xs flex items-center justify-center shrink-0">
              3
            </div>
            <div>
              <div className="font-extrabold text-xs text-slate-900">Instant Escrow</div>
              <p className="text-[11px] text-slate-600 mt-0.5">Contracts complete automatically with 5% dual-split protection.</p>
            </div>
          </div>
        </div>
      </div>
      {/* Search & Action Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white border border-sky-200 p-3.5 rounded-2xl shadow-sm">
        <form 
          onSubmit={(e) => {
            e.preventDefault();
            if (searchQuery.trim() && onAddSearchHistory) {
              onAddSearchHistory(searchQuery.trim());
            }
          }}
          className="relative flex-1"
        >
          <Search className="w-4 h-4 text-blue-600 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleSearchKeyDown}
            placeholder={t('search_placeholder', `Search hotel suites, flights, AI developers, luxury assets... (${selectedLanguage.name})`)}
            className="w-full bg-sky-50/70 border border-sky-200 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-400/20 transition font-sans"
          />
        </form>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setShowPriceAlertModal(true)}
            className="bg-sky-100 hover:bg-sky-200 text-blue-800 border border-sky-300 font-bold px-3 py-2 rounded-xl text-xs flex items-center justify-center gap-1.5 transition shadow-sm"
            title="Configure Real-Time Price Alerts"
          >
            <Bell className="w-4 h-4 text-blue-600" />
            <span>{t('btn_price_alert', 'Set Price Alert')}</span>
            {priceAlerts.filter(a => a.active).length > 0 && (
              <span className="bg-blue-600 text-white rounded-full w-4 h-4 text-[10px] font-bold flex items-center justify-center ml-0.5">
                {priceAlerts.filter(a => a.active).length}
              </span>
            )}
          </button>

          <button
            onClick={onOpenCreateListing}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center justify-center gap-2 transition shadow-md shadow-emerald-600/20"
          >
            <Sparkles className="w-4 h-4 text-yellow-300" />
            <span>{t('btn_create_listing', 'Create Listing')}</span>
          </button>
        </div>
      </div>

      {/* Recent Searches Section */}
      {searchHistory.length > 0 && (
        <div className="bg-white border border-sky-200 rounded-2xl px-3.5 py-2.5 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
              <History className="w-3.5 h-3.5 text-blue-600" />
              <span>Recent Searches</span>
            </div>
            {onClearSearchHistory && (
              <button
                onClick={onClearSearchHistory}
                className="text-[11px] text-slate-500 hover:text-blue-700 font-medium transition"
              >
                Clear History
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-0.5 text-xs">
            {searchHistory.map((term) => (
              <div
                key={term}
                onClick={() => {
                  setSearchQuery(term);
                  if (onAddSearchHistory) onAddSearchHistory(term);
                }}
                className={`group flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-semibold border transition cursor-pointer shrink-0 ${
                  searchQuery.toLowerCase() === term.toLowerCase()
                    ? 'bg-blue-600 border-blue-600 text-white shadow-sm'
                    : 'bg-sky-50/80 border-sky-200 text-slate-700 hover:border-blue-300 hover:bg-sky-100'
                }`}
              >
                <span>{term}</span>
                {onRemoveSearchHistoryItem && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemoveSearchHistoryItem(term);
                    }}
                    className="text-slate-400 hover:text-rose-500 p-0.5 rounded transition ml-0.5"
                    title="Remove from history"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Active Price Alert Triggers Banner */}
      {priceAlerts.length > 0 && (
        <div className="bg-white border border-sky-200 rounded-2xl p-3.5 shadow-sm space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
              <Bell className="w-3.5 h-3.5 text-blue-600" />
              <span>Configured Price Alert Triggers ({priceAlerts.length})</span>
            </div>
            <button
              onClick={() => setShowPriceAlertModal(true)}
              className="text-[11px] text-blue-600 hover:text-blue-800 font-bold flex items-center gap-1"
            >
              <Plus className="w-3 h-3" />
              <span>New Alert</span>
            </button>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
            {priceAlerts.map(alert => {
              // Count matches
              const matchesCount = listings.filter(l => {
                const matchCat = alert.category === 'All Categories' || l.category === alert.category;
                const matchModel = alert.commercialModel === 'All Models' || l.commercialModels.includes(alert.commercialModel as CommercialModel);
                const matchPrice = alert.condition === 'below' ? l.pricePerHourUSD <= alert.targetPriceUSD : l.pricePerHourUSD >= alert.targetPriceUSD;
                return matchCat && matchModel && matchPrice;
              }).length;

              return (
                <div
                  key={alert.id}
                  className={`flex items-center gap-2 border px-3 py-1.5 rounded-xl text-xs whitespace-nowrap transition ${
                    alert.active
                      ? 'bg-sky-50 border-sky-300 text-slate-800 font-medium'
                      : 'bg-slate-100 border-slate-200 text-slate-400 line-through'
                  }`}
                >
                  <button
                    onClick={() => onTogglePriceAlert && onTogglePriceAlert(alert.id)}
                    className={`p-0.5 rounded transition ${alert.active ? 'text-emerald-600' : 'text-slate-400'}`}
                    title={alert.active ? 'Deactivate Alert' : 'Activate Alert'}
                  >
                    <Power className="w-3 h-3" />
                  </button>

                  <span className="font-bold text-[11px]">
                    {alert.category} • {alert.condition === 'below' ? '<' : '>'} ${alert.targetPriceUSD}/hr
                  </span>

                  {alert.active && (
                    <span className="bg-emerald-100 text-emerald-800 font-mono text-[10px] font-bold px-1.5 py-0.5 rounded-md border border-emerald-300">
                      {matchesCount} Match{matchesCount === 1 ? '' : 'es'}
                    </span>
                  )}

                  <button
                    onClick={() => onDeletePriceAlert && onDeletePriceAlert(alert.id)}
                    className="text-slate-400 hover:text-rose-500 transition ml-1"
                    title="Delete Alert"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Price Alert Modal */}
      {showPriceAlertModal && (
        <PriceAlertModal
          listings={listings}
          onClose={() => setShowPriceAlertModal(false)}
          onAddAlert={(alert) => {
            if (onAddPriceAlert) onAddPriceAlert(alert);
          }}
        />
      )}

      {/* Category Intelligence Multi-Select Filter Panel */}
      <div className="bg-white border border-sky-200 rounded-2xl p-3.5 shadow-sm space-y-3">
        {/* Panel Header */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-sky-100 pb-2.5">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-xl bg-blue-100 text-blue-700 font-bold border border-blue-200">
              <Cpu className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xs text-slate-900 tracking-wide">Category Intelligence</span>
                <span className="bg-blue-100 text-blue-700 border border-blue-200 text-[10px] font-mono font-bold px-2 py-0.5 rounded-full">
                  Multi-Select Filter
                </span>
              </div>
              <p className="text-[11px] text-slate-500">Filter listings by cluster or domain with real-time result counts</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Real-time result count indicator */}
            <div className="bg-sky-50 border border-sky-200 px-2.5 py-1 rounded-xl text-[11px] font-mono flex items-center gap-1.5">
              <span className="text-slate-500">Real-Time Matches:</span>
              <span className="font-bold text-blue-700 text-xs">{filteredListings.length}</span>
              <span className="text-slate-400 text-[10px]">/ {listings.length}</span>
            </div>

            {selectedCategoryChips.length > 0 && (
              <button
                onClick={clearCategoryChips}
                className="text-[10px] text-slate-600 hover:text-rose-600 bg-slate-100 hover:bg-slate-200 border border-slate-300 px-2 py-1 rounded-lg transition flex items-center gap-1 font-semibold"
                title="Reset all selected category filters"
              >
                <X className="w-3 h-3" />
                <span>Reset ({selectedCategoryChips.length})</span>
              </button>
            )}
          </div>
        </div>

        {/* Chips Container */}
        <div className="space-y-2">
          {/* Intelligence Clusters Row */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar text-xs">
            <span className="text-[10px] text-blue-700 uppercase font-mono font-black shrink-0 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-500" />
              Clusters:
            </span>

            {intelligenceCategoryChips.filter(c => c.isCluster).map((chip) => {
              const isSelected = selectedCategoryChips.includes(chip.id);
              const count = getCategoryResultCount(chip.id);

              return (
                <button
                  key={chip.id}
                  onClick={() => toggleCategoryChip(chip.id)}
                  className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-all font-bold border text-xs flex items-center gap-1.5 shrink-0 ${
                    isSelected
                      ? 'bg-blue-600 text-white border-blue-600 shadow-md scale-102'
                      : 'bg-sky-50/80 border-sky-200 text-slate-700 hover:border-blue-300 hover:bg-sky-100'
                  }`}
                >
                  <div className={`w-3.5 h-3.5 rounded flex items-center justify-center border transition ${
                    isSelected ? 'bg-white border-white text-blue-700' : 'border-slate-300 bg-white'
                  }`}>
                    {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>
                  <span>{chip.label}</span>
                  <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded-md font-bold ${
                    isSelected ? 'bg-blue-700 text-white' : 'bg-slate-200 text-slate-600'
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Granular Categories Row */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
            <span className="text-[10px] text-slate-500 uppercase font-mono font-bold shrink-0 flex items-center gap-1">
              <Tag className="w-3 h-3 text-slate-400" />
              Domains:
            </span>

            {intelligenceCategoryChips.filter(c => !c.isCluster).map((chip) => {
              const isSelected = selectedCategoryChips.includes(chip.id);
              const count = getCategoryResultCount(chip.id);

              return (
                <button
                  key={chip.id}
                  onClick={() => toggleCategoryChip(chip.id)}
                  className={`px-2.5 py-1 rounded-lg whitespace-nowrap transition font-semibold border text-[11px] flex items-center gap-1.5 shrink-0 ${
                    isSelected
                      ? 'bg-blue-100 text-blue-800 border-blue-300 font-bold shadow-xs'
                      : 'bg-white border-sky-200 text-slate-600 hover:text-slate-900 hover:bg-sky-50'
                  }`}
                >
                  {isSelected && <Check className="w-2.5 h-2.5 text-blue-700" />}
                  <span>{chip.label}</span>
                  <span className={`text-[9px] font-mono px-1 py-0.1 rounded font-bold ${
                    isSelected ? 'bg-blue-200 text-blue-900' : 'bg-slate-100 text-slate-500'
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Commercial Model Filter Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        <span className="text-[10px] text-slate-500 uppercase font-mono font-bold flex items-center gap-1 shrink-0">
          <Layers className="w-3.5 h-3.5 text-blue-600" />
          Model:
        </span>
        {models.map((m) => (
          <button
            key={m.id}
            onClick={() => setSelectedModel(m.id)}
            className={`px-2.5 py-1 rounded-lg text-[10px] whitespace-nowrap transition font-bold border ${
              selectedModel === m.id
                ? 'bg-blue-600 border-blue-600 text-white shadow-sm'
                : 'bg-white border-sky-200 text-slate-600 hover:text-blue-700 hover:bg-sky-50'
            }`}
          >
            {m.label}
          </button>
        ))}
      </div>

      {/* Grid of Listings */}
      <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <AnimatePresence mode="popLayout">
          {filteredListings.flatMap((listing, index) => {
            const trans = translatedMap[listing.id];
            const displayTitle = trans ? trans.title : listing.title;
            const displayDesc = trans ? trans.desc : listing.description;

            // Fee calculations
            const hourlyPrice = listing.currentHighestBidUSD || listing.pricePerHourUSD;
            const buyerFee = Math.round(hourlyPrice * 0.05 * 100) / 100;
            const sellerFee = Math.round(hourlyPrice * 0.05 * 100) / 100;
            const buyerTotal = Math.round((hourlyPrice + buyerFee) * 100) / 100;
            const isAuctionListing = listing.commercialModels.some(m => ['forward_auction', 'reverse_auction', 'live_bidding', 'sealed_bidding'].includes(m)) || !!listing.auctionEndsAt;

            // Check price alert match
            const matchingAlert = priceAlerts.find(a => {
              if (!a.active) return false;
              const matchCat = a.category === 'All Categories' || listing.category === a.category;
              const matchModel = a.commercialModel === 'All Models' || listing.commercialModels.includes(a.commercialModel as CommercialModel);
              const matchPrice = a.condition === 'below' ? listing.pricePerHourUSD <= a.targetPriceUSD : listing.pricePerHourUSD >= a.targetPriceUSD;
              return matchCat && matchModel && matchPrice;
            });

            const isWatched = watchlist.includes(listing.id);

            const elements = [];

            {/* Insert AdMob Native Ad after 3rd item */}
            if (index === 2) {
              elements.push(
                <motion.div
                  key="admob-native-banner"
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="md:col-span-2 lg:col-span-3"
                >
                  <AdMobBanner type="nativeAd" onRewardEarned={onRewardEarned} />
                </motion.div>
              );
            }

            elements.push(
              <motion.div
                key={listing.id}
                layout
                initial={{ opacity: 0, scale: 0.94, y: 12 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.92, y: -10 }}
                whileHover={{ y: -6, scale: 1.015, transition: { type: "spring", stiffness: 400, damping: 25 } }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className={`bg-white border rounded-2xl overflow-hidden shadow-sm hover:shadow-lg hover:border-blue-400 transition-all flex flex-col group relative ${
                  matchingAlert ? 'border-emerald-500/80 ring-2 ring-emerald-500/30' : 'border-sky-200'
                }`}
              >
                {/* Image Banner */}
                <div className="relative h-44 w-full overflow-hidden bg-sky-100">
                  <img
                    src={listing.imageUrl}
                    alt={listing.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-950/10 to-transparent" />

                  {/* Category & Verified Badge */}
                  <div className="absolute top-3 left-3 flex flex-wrap items-center gap-1.5">
                    <span className="bg-white/90 backdrop-blur-md text-slate-900 text-[10px] font-bold px-2 py-0.5 rounded-lg border border-sky-200 shadow-sm">
                      {listing.category}
                    </span>
                    <span className="bg-emerald-600 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-lg flex items-center gap-1 shadow-sm border border-emerald-400">
                      <CheckCircle className="w-3 h-3 text-emerald-200" />
                      Verified Live Listing
                    </span>
                  </div>

                  {/* Price Alert Match Trigger Tag */}
                  {matchingAlert && (
                    <div className="absolute top-10 left-3 bg-emerald-500 text-slate-950 font-black text-[10px] px-2 py-0.5 rounded-full shadow-lg flex items-center gap-1 border border-emerald-300">
                      <Bell className="w-3 h-3 fill-slate-950" />
                      <span>Alert Match ({matchingAlert.condition === 'below' ? '<' : '>'} ${matchingAlert.targetPriceUSD})</span>
                    </div>
                  )}

                  {/* UTC Time Credits pill & Watch Toggle */}
                  <div className="absolute top-3 right-3 flex items-center gap-1.5">
                    {onToggleWatchlist && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleWatchlist(listing.id);
                        }}
                        className={`px-2 py-0.5 rounded-lg font-extrabold text-[11px] flex items-center gap-1 shadow-md transition-all ${
                          isWatched
                            ? 'bg-amber-400 text-slate-950 border border-amber-300 ring-2 ring-amber-400/40'
                            : 'bg-slate-900/80 hover:bg-slate-900 text-amber-300 backdrop-blur-md border border-white/20'
                        }`}
                        title={isWatched ? "Remove from Auction Watchlist" : "Add to Auction Watchlist"}
                      >
                        <Eye className={`w-3.5 h-3.5 ${isWatched ? 'fill-slate-950 text-slate-950' : 'text-amber-400'}`} />
                        <span>{isWatched ? 'Watching' : 'Watch'}</span>
                      </button>
                    )}

                    <div className="bg-blue-600 text-white font-mono font-bold text-[11px] px-2.5 py-0.5 rounded-lg shadow-md flex items-center gap-1">
                      <Repeat className="w-3 h-3 text-yellow-300" />
                      {listing.timeCreditsPerHourUTC} UTC / hr
                    </div>
                  </div>

                  {/* Rating & Location */}
                  <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-xs text-white drop-shadow-md">
                    <span className="truncate max-w-[180px] text-[11px] font-semibold">📍 {listing.location}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveReviewsListing(listing);
                      }}
                      className="flex items-center gap-1 font-bold text-amber-900 text-[11px] bg-amber-300 hover:bg-amber-400 px-2 py-0.5 rounded-lg transition hover:scale-105 shadow-sm"
                      title="View verified buyer reviews & rating breakdown"
                    >
                      <Star className="w-3.5 h-3.5 fill-amber-900 text-amber-900" />
                      <span>{calcAvgRating(listing.id, listing.sellerRating)}</span>
                      <span className="text-[10px] font-mono font-normal">({getReviewCount(listing.id)})</span>
                    </button>
                  </div>
                </div>

                {/* Content Body */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-3 text-slate-900">
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <h3 className="font-bold text-sm text-slate-900 group-hover:text-blue-700 transition line-clamp-2">
                        {displayTitle}
                      </h3>
                      <div className="flex items-center gap-1 shrink-0">
                        {/* Social Share Button */}
                        <button
                          onClick={(e) => handleShareListing(e, listing)}
                          className={`text-[10px] px-2 py-0.5 rounded-lg transition-all flex items-center gap-1 font-bold border ${
                            sharedListingId === listing.id
                              ? 'bg-emerald-600 text-white border-emerald-600 shadow-md scale-105'
                              : 'text-slate-700 hover:text-blue-700 bg-sky-50 hover:bg-sky-100 border-sky-200'
                          }`}
                          title="Share listing via Web Share API or copy deep link snippet"
                        >
                          {sharedListingId === listing.id ? (
                            <>
                              <Check className="w-2.5 h-2.5 stroke-[3]" />
                              <span>Shared!</span>
                            </>
                          ) : (
                            <>
                              <Share2 className="w-2.5 h-2.5 text-blue-600" />
                              <span>Share</span>
                            </>
                          )}
                        </button>

                        {/* AI Translate Button */}
                        <button
                          onClick={() => handleTranslateCard(listing)}
                          disabled={translatingId === listing.id}
                          className="text-[10px] text-blue-700 hover:text-blue-900 bg-blue-100 hover:bg-blue-200 border border-blue-200 px-2 py-0.5 rounded-lg font-bold flex items-center gap-1"
                          title="AI Translate to selected language"
                        >
                          <Sparkles className="w-2.5 h-2.5 text-amber-500" />
                          {translatingId === listing.id ? 'Translating...' : selectedLanguage.code.toUpperCase()}
                        </button>
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                      {displayDesc}
                    </p>
                  </div>

                  {/* Visual Progress Bar & Countdown Timer for Auction Listings */}
                  {isAuctionListing && (
                    <AuctionCountdownBar 
                      auctionEndsAt={listing.auctionEndsAt} 
                      compact={false} 
                      className="my-0.5" 
                    />
                  )}

                  {/* 5% Buyer + 5% Seller Fee Transparency Banner */}
                  <div className="bg-sky-50/80 border border-sky-200 rounded-xl p-2.5 text-[11px] space-y-1">
                    <div className="flex items-center justify-between text-slate-700">
                      <span className="text-slate-500 font-medium">Base Hourly Rate:</span>
                      <span className="font-bold text-slate-900 font-mono">${hourlyPrice} / hr</span>
                    </div>
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="text-slate-500 flex items-center gap-1">
                        <Percent className="w-3 h-3 text-emerald-600" />
                        Buyer Fee (5%):
                      </span>
                      <span className="text-emerald-700 font-mono font-bold">+${buyerFee}</span>
                    </div>
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="text-slate-500 flex items-center gap-1">
                        <Percent className="w-3 h-3 text-slate-400" />
                        Seller Net (5% deducted):
                      </span>
                      <span className="text-slate-700 font-mono font-semibold">${hourlyPrice - sellerFee}</span>
                    </div>
                    <div className="border-t border-sky-200 pt-1 flex items-center justify-between font-bold text-[11px]">
                      <span className="text-slate-900">Total Buyer Checkout:</span>
                      <span className="text-blue-700 font-mono font-extrabold">${buyerTotal}</span>
                    </div>
                  </div>

                  {/* Commercial Models Badges */}
                  <div className="flex flex-wrap gap-1.5">
                    {listing.commercialModels.map((m) => (
                      <span key={m} className="bg-slate-100 text-slate-600 text-[10px] px-2 py-0.5 rounded-md font-mono border border-slate-200 font-semibold">
                        {m.replace('_', ' ')}
                      </span>
                    ))}
                  </div>

                  {/* Action Buttons */}
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <button
                      onClick={() => onSelectListing(listing, 'bid')}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5 transition shadow-md shadow-emerald-600/20"
                    >
                      <Gavel className="w-3.5 h-3.5 text-yellow-300" />
                      Bid / Book Now
                    </button>
                    <button
                      onClick={() => onSelectListing(listing, 'negotiate')}
                      className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5 transition shadow-md shadow-blue-500/20"
                    >
                      <Bot className="w-3.5 h-3.5 text-yellow-300" />
                      A2A Negotiate
                    </button>

                    <button
                      onClick={() => setActiveMessagingListing(listing)}
                      className="col-span-2 bg-sky-100 hover:bg-sky-200 text-blue-800 font-bold py-1.5 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5 transition border border-sky-300"
                      title="Open peer-to-peer message thread with seller to negotiate terms"
                    >
                      <MessageSquare className="w-3.5 h-3.5 text-blue-600" />
                      <span>Message Seller (P2P Chat)</span>
                    </button>

                    <button
                      onClick={() => setActiveReviewsListing(listing)}
                      className="col-span-2 bg-slate-100 hover:bg-amber-100 text-slate-800 hover:text-amber-900 font-bold py-1.5 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5 transition border border-slate-200 hover:border-amber-300"
                    >
                      <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                      <span>Verified Reviews ({getReviewCount(listing.id)})</span>
                    </button>

                    <button
                      onClick={() => onOpenScheduling ? onOpenScheduling(listing) : onSelectListing(listing, 'schedule')}
                      className="col-span-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-1.5 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5 transition shadow-sm"
                    >
                      <Calendar className="w-3.5 h-3.5 text-yellow-300" />
                      <span>Schedule UTC Time Slot</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            );

            return elements;
          })}
        </AnimatePresence>
      </motion.div>

      {/* Empty State when no listings match filter */}
      {filteredListings.length === 0 && (
        <div className="bg-white border border-sky-200 rounded-3xl p-8 text-center shadow-sm space-y-4 max-w-lg mx-auto my-6">
          <div className="w-16 h-16 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mx-auto">
            <Database className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-slate-900">No Listings Found</h3>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              There are no active listings matching your search or category filter. Be the first to advertise an asset on ACE!
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={onOpenCreateListing}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-2 transition shadow-md shadow-emerald-600/20"
            >
              <Sparkles className="w-4 h-4 text-yellow-300" />
              <span>Publish New Listing</span>
            </button>
          </div>
        </div>
      )}

      {/* Reviews Modal */}
      {activeReviewsListing && (
        <ListingReviewsModal
          listing={activeReviewsListing}
          reviews={reviews}
          completedTransactions={completedTransactions}
          onClose={() => setActiveReviewsListing(null)}
          onSubmitReview={handleAddReview}
          onSimulateCompleteTransaction={handleSimulateCompleteTransaction}
        />
      )}

      {/* Peer-to-Peer Message Thread Modal */}
      {activeMessagingListing && (
        <PeerMessageThreadModal
          listing={activeMessagingListing}
          onClose={() => setActiveMessagingListing(null)}
          onSelectAction={(listing, action) => {
            setActiveMessagingListing(null);
            if (action === 'schedule') {
              if (onOpenScheduling) onOpenScheduling(listing);
              else onSelectListing(listing, 'schedule');
            } else {
              onSelectListing(listing, action);
            }
          }}
        />
      )}
    </div>
  );
};
