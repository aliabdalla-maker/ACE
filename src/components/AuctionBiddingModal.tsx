import React, { useState } from 'react';
import { Listing, Bid } from '../types';
import { Gavel, X, Clock, Percent, ShieldCheck, DollarSign, Repeat, Sparkles, CheckCircle2 } from 'lucide-react';
import { AuctionCountdownBar } from './AuctionCountdownBar';
import { useLanguage } from '../context/LanguageContext';

interface AuctionBiddingModalProps {
  listing: Listing;
  onClose: () => void;
  onPlaceBid: (bid: Bid) => void;
  userWalletBalanceUSD: number;
  userWalletBalanceUTC: number;
}

export const AuctionBiddingModal: React.FC<AuctionBiddingModalProps> = ({
  listing,
  onClose,
  onPlaceBid,
  userWalletBalanceUSD,
  userWalletBalanceUTC
}) => {
  const { t, selectedLanguage } = useLanguage();
  const currentPrice = listing.currentHighestBidUSD || listing.pricePerHourUSD;
  const minBid = Math.round((currentPrice + 5) * 100) / 100;

  const [bidAmountUSD, setBidAmountUSD] = useState<number>(minBid);
  const [paymentMode, setPaymentMode] = useState<'USD' | 'UTC'>('USD');
  const [biddingType, setBiddingType] = useState<'Consumer' | 'AI Agent'>('Consumer');
  const [isSuccess, setIsSuccess] = useState(false);

  // 5% Buyer + 5% Seller Calculation
  const buyerFee5Pct = Math.round(bidAmountUSD * 0.05 * 100) / 100;
  const sellerFee5Pct = Math.round(bidAmountUSD * 0.05 * 100) / 100;
  const totalBuyerPaysUSD = Math.round((bidAmountUSD + buyerFee5Pct) * 100) / 100;
  const netSellerReceivesUSD = Math.round((bidAmountUSD - sellerFee5Pct) * 100) / 100;

  // UTC equivalent (1 UTC = $50 reference)
  const equivalentUTC = Math.round((bidAmountUSD / 50) * 10) / 10;
  const buyerFeeUTC = Math.round((buyerFee5Pct / 50) * 100) / 100;
  const totalBuyerPaysUTC = Math.round((equivalentUTC + buyerFeeUTC) * 100) / 100;

  const handleConfirmBid = () => {
    const newBid: Bid = {
      id: `bid-${Date.now()}`,
      listingId: listing.id,
      bidderName: biddingType === 'AI Agent' ? 'Personal ACE Agent' : 'User (You)',
      bidderType: biddingType,
      amountUSD: bidAmountUSD,
      amountUTC: equivalentUTC,
      buyerFee5Pct,
      sellerFee5Pct,
      totalBuyerPays: totalBuyerPaysUSD,
      netSellerReceives: netSellerReceivesUSD,
      timestamp: new Date().toLocaleTimeString(),
      isWinning: true
    };

    onPlaceBid(newBid);
    setIsSuccess(true);
    setTimeout(() => {
      onClose();
    }, 1600);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-md flex items-center justify-center p-3 sm:p-5">
      <div className="bg-white border border-sky-200 rounded-2xl max-w-lg w-full p-5 shadow-xl relative flex flex-col max-h-[90vh] overflow-y-auto text-slate-900">
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 bg-sky-50 border border-sky-200 rounded-lg p-1.5 transition">
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2.5 text-blue-700 font-extrabold text-base mb-1">
          <Gavel className="w-5 h-5 text-blue-600" />
          <h3>Place Bidding / Booking Order</h3>
        </div>
        <p className="text-xs text-slate-600 font-semibold mb-4">{listing.title}</p>

        {isSuccess ? (
          <div className="py-8 flex flex-col items-center justify-center space-y-3 text-center">
            <CheckCircle2 className="w-14 h-14 text-emerald-600 animate-bounce" />
            <h4 className="font-extrabold text-lg text-slate-900">Order / Bid Placed Successfully!</h4>
            <p className="text-xs text-slate-600 font-medium max-w-xs">
              ${totalBuyerPaysUSD} (including 5% buyer fee) locked safely in Escrow.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Live Auction Countdown & Progress Bar */}
            <AuctionCountdownBar auctionEndsAt={listing.auctionEndsAt} />

            {/* Current Price Banner */}
            <div className="bg-sky-50/80 border border-sky-200 rounded-xl p-3 flex items-center justify-between text-xs">
              <div>
                <span className="text-slate-500 font-bold block">Current Benchmark Rate</span>
                <span className="font-extrabold text-lg text-slate-900 font-mono">${currentPrice} <span className="text-xs font-semibold text-slate-500 font-sans">/ hr</span></span>
              </div>
              <div className="text-right">
                <span className="text-slate-500 font-bold block">Equivalent Time Credit</span>
                <span className="font-extrabold text-emerald-700 font-mono">{listing.timeCreditsPerHourUTC} UTC / hr</span>
              </div>
            </div>

            {/* Bidding Type Switch (Consumer vs AI Agent) */}
            <div className="flex items-center gap-2 bg-sky-50/70 p-1.5 rounded-xl border border-sky-200 text-xs">
              <button
                onClick={() => setBiddingType('Consumer')}
                className={`flex-1 py-1.5 rounded-lg font-bold transition ${
                  biddingType === 'Consumer' ? 'bg-blue-600 text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Consumer Direct Bid
              </button>
              <button
                onClick={() => setBiddingType('AI Agent')}
                className={`flex-1 py-1.5 rounded-lg font-bold transition flex items-center justify-center gap-1.5 ${
                  biddingType === 'AI Agent' ? 'bg-blue-600 text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
                AI Agent Auto-Bid
              </button>
            </div>

            {/* Bid Amount Input */}
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">Your Hourly Bid Rate (USD)</label>
              <div className="relative">
                <DollarSign className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="number"
                  value={bidAmountUSD}
                  onChange={(e) => setBidAmountUSD(Math.max(1, Number(e.target.value)))}
                  className="w-full bg-sky-50/70 border border-sky-200 rounded-xl pl-9 pr-4 py-2.5 text-sm text-slate-900 font-bold font-mono focus:outline-none focus:border-blue-500"
                />
              </div>
              <p className="text-[10px] text-slate-500 font-medium mt-1">Minimum bid increment: ${minBid}</p>
            </div>

            {/* Payment Method Switch */}
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">Pay With</label>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <button
                  onClick={() => setPaymentMode('USD')}
                  className={`p-2.5 rounded-xl border text-left transition ${
                    paymentMode === 'USD' ? 'bg-blue-50 border-blue-300 text-blue-900 font-bold' : 'bg-sky-50/50 border-sky-200 text-slate-600'
                  }`}
                >
                  <span className="block text-slate-900 font-extrabold">$ USD Cash Balance</span>
                  <span className="text-[10px] text-slate-500 font-mono font-bold">Avail: ${userWalletBalanceUSD}</span>
                </button>
                <button
                  onClick={() => setPaymentMode('UTC')}
                  className={`p-2.5 rounded-xl border text-left transition ${
                    paymentMode === 'UTC' ? 'bg-blue-50 border-blue-300 text-blue-900 font-bold' : 'bg-sky-50/50 border-sky-200 text-slate-600'
                  }`}
                >
                  <span className="block text-slate-900 font-extrabold">Universal Time Credit (UTC)</span>
                  <span className="text-[10px] text-slate-500 font-mono font-bold">Avail: {userWalletBalanceUTC} UTC</span>
                </button>
              </div>
            </div>

            {/* 5% Buyer Escrow Breakdown */}
            <div className="bg-sky-50/70 border border-sky-200 rounded-xl p-3.5 space-y-2 text-xs">
              <div className="flex items-center gap-1.5 text-blue-800 font-extrabold border-b border-sky-200 pb-1.5">
                <Percent className="w-4 h-4 text-blue-600" />
                <span>Buyer Platform Fee (5.0%) Breakdown</span>
              </div>
              <div className="space-y-1.5 text-slate-700 text-[11px] font-medium">
                <div className="flex justify-between">
                  <span className="text-slate-500">Base Hourly Bid:</span>
                  <span className="font-mono text-slate-900 font-bold">${bidAmountUSD} ({equivalentUTC} UTC)</span>
                </div>
                <div className="flex justify-between text-blue-700 font-bold">
                  <span>+ Buyer Platform Fee (5.0%):</span>
                  <span className="font-mono">+${buyerFee5Pct}</span>
                </div>
                <div className="border-t border-sky-200 pt-1 flex justify-between font-extrabold text-sm text-slate-900">
                  <span>Total Payable into Escrow:</span>
                  <span className="text-emerald-700 font-mono">${totalBuyerPaysUSD}</span>
                </div>
              </div>
            </div>

            <button
              onClick={handleConfirmBid}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl text-xs flex items-center justify-center gap-2 transition shadow-md shadow-emerald-600/20"
            >
              <ShieldCheck className="w-4 h-4 text-yellow-300" />
              <span>Confirm & Lock ${totalBuyerPaysUSD} in Escrow</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
