export type CommercialModel = 
  | 'fixed_price'
  | 'instant_booking'
  | 'hourly_booking'
  | 'daily_booking'
  | 'forward_auction'
  | 'reverse_auction'
  | 'live_bidding'
  | 'sealed_bidding'
  | 'a2a_negotiation'
  | 'time_credit_swap'
  | 'rental'
  | 'lease';

export type CategoryType =
  | 'Hospitality & Hotels'
  | 'Flights & Aviation'
  | 'Chauffeur & Transport'
  | 'AI & Tech Services'
  | 'Legal & Financial'
  | 'Workspace & Venues'
  | 'Medical & Wellness'
  | 'Tours & Experiences'
  | 'Equipment & Machinery';

export interface PriceAlert {
  id: string;
  category: CategoryType | 'All Categories';
  commercialModel: CommercialModel | 'All Models';
  targetPriceUSD: number;
  condition: 'below' | 'above';
  active: boolean;
  createdAt: string;
}

export interface ScheduledBooking {
  id: string;
  listingId: string;
  listingTitle: string;
  category: CategoryType;
  dateStr: string; // e.g. "2026-07-29"
  utcTimeSlot: string; // e.g. "14:00 - 16:00 UTC"
  hoursBooked: number;
  utcCreditsDeducted: number;
  status: 'Confirmed & Locked' | 'Pending Escrow Sync' | 'In Progress';
  bookingHash: string;
  createdAt: string;
}

export interface Bid {
  id: string;
  listingId: string;
  bidderName: string;
  bidderType: 'Consumer' | 'AI Agent' | 'Business';
  amountUSD: number;
  amountUTC: number;
  buyerFee5Pct: number;
  sellerFee5Pct: number;
  totalBuyerPays: number;
  netSellerReceives: number;
  timestamp: string;
  isWinning?: boolean;
  status?: string;
}

export interface Listing {
  id: string;
  title: string;
  description: string;
  category: CategoryType;
  commercialModels: CommercialModel[];
  pricePerHourUSD: number;
  timeCreditsPerHourUTC: number;
  availableHours: number;
  location: string;
  sellerName: string;
  sellerRating: number;
  sellerVerified: boolean;
  language: string;
  imageUrl: string;
  currentHighestBidUSD?: number;
  auctionEndsAt?: string; // ISO String
  bidsCount: number;
  featured?: boolean;
  isDemo?: boolean;
}

export interface WalletTransaction {
  id: string;
  listingId?: string;
  type: 'buy' | 'sell' | 'auction_win' | 'time_swap' | 'ad_reward' | 'escrow_release';
  title: string;
  amountUSD: number;
  amountUTC: number;
  buyerFee5Pct: number;
  sellerFee5Pct: number;
  totalFeeToPlatform: number;
  timestamp: string;
  status: 'Completed' | 'In Escrow' | 'Pending';
}

export interface Review {
  id: string;
  listingId: string;
  reviewerName: string;
  reviewerAvatar?: string;
  rating: number;
  comment: string;
  timestamp: string;
  verifiedTransaction: boolean;
  transactionId?: string;
}

export interface SmartWalletState {
  cashBalanceUSD: number;
  utcTimeCredits: number;
  escrowHoldingUSD: number;
  escrowHoldingUTC: number;
  totalMarketplaceEarnedUSD: number;
  transactions: WalletTransaction[];
}

export interface A2AAgentConfig {
  agentName: string;
  autoBidEnabled: boolean;
  maxBidPriceUSD: number;
  preferredCategories: CategoryType[];
  autoAcceptSwapRatio: number;
  riskTolerance: 'Conservative' | 'Balanced' | 'Aggressive';
  targetLanguage: string;
}

export interface AdMobConfig {
  publisherId: string;
  appUnitId: string;
  adUnits: {
    banner: string;
    interstitial: string;
    rewardedVideo: string;
    nativeAd: string;
    appOpen: string;
    rewardedInterstitial: string;
  };
}

export interface PeerMessage {
  id: string;
  listingId: string;
  sender: 'user' | 'seller';
  senderName: string;
  text: string;
  timestamp: string;
  proposedPriceUSD?: number;
  isOffer?: boolean;
}

export const ADMOB_CREDENTIALS: AdMobConfig = {
  publisherId: "pub-2980680946304710",
  appUnitId: "ca-app-pub-2980680946304710~2617421798",
  adUnits: {
    banner: "ca-app-pub-2980680946304710/1032845563",
    interstitial: "ca-app-pub-2980680946304710/2172884450",
    rewardedVideo: "ca-app-pub-2980680946304710/3668921616",
    nativeAd: "ca-app-pub-2980680946304710/5953999752",
    appOpen: "ca-app-pub-2980680946304710/6184281650",
    rewardedInterstitial: "ca-app-pub-2980680946304710/6514576804",
  }
};
