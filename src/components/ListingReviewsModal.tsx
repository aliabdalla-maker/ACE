import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Listing, Review, WalletTransaction } from '../types';
import { Star, CheckCircle, ShieldCheck, MessageSquare, ThumbsUp, X, Sparkles, AlertCircle, PlusCircle } from 'lucide-react';

interface ListingReviewsModalProps {
  listing: Listing;
  reviews: Review[];
  completedTransactions: WalletTransaction[];
  onClose: () => void;
  onSubmitReview: (review: Review) => void;
  onSimulateCompleteTransaction?: (listing: Listing) => void;
}

export const ListingReviewsModal: React.FC<ListingReviewsModalProps> = ({
  listing,
  reviews,
  completedTransactions,
  onClose,
  onSubmitReview,
  onSimulateCompleteTransaction
}) => {
  const listingReviews = reviews.filter(r => r.listingId === listing.id);
  
  // Check if current user has completed a transaction for this listing
  const hasCompletedTx = completedTransactions.some(
    tx => tx.status === 'Completed' && (tx.listingId === listing.id || tx.title.toLowerCase().includes(listing.title.toLowerCase().slice(0, 15)))
  );

  const [activeTab, setActiveTab] = useState<'reviews' | 'write'>('reviews');
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [comment, setComment] = useState<string>('');
  const [reviewerName, setReviewerName] = useState<string>('Verified Member');
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [simulationAdded, setSimulationAdded] = useState<boolean>(false);

  // Calculate statistics
  const totalReviews = listingReviews.length;
  const avgRating = totalReviews > 0
    ? (listingReviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews).toFixed(1)
    : listing.sellerRating.toFixed(1);

  const ratingCounts = [5, 4, 3, 2, 1].map(stars => ({
    stars,
    count: listingReviews.filter(r => Math.round(r.rating) === stars).length,
    pct: totalReviews > 0 ? (listingReviews.filter(r => Math.round(r.rating) === stars).length / totalReviews) * 100 : 0
  }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;

    const newReview: Review = {
      id: `rev-${Date.now()}`,
      listingId: listing.id,
      reviewerName: reviewerName.trim() || 'Verified Member',
      rating,
      comment: comment.trim(),
      timestamp: 'Just now',
      verifiedTransaction: true,
      transactionId: `tx-${Date.now()}`
    };

    onSubmitReview(newReview);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setComment('');
      setActiveTab('reviews');
    }, 1800);
  };

  const handleSimulateTx = () => {
    if (onSimulateCompleteTransaction) {
      onSimulateCompleteTransaction(listing);
      setSimulationAdded(true);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="bg-white border border-sky-200 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-xl flex flex-col text-slate-900"
      >
        {/* Header */}
        <div className="p-4 border-b border-sky-100 bg-sky-50/70 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-amber-100 border border-amber-200 text-amber-700 rounded-xl">
              <Star className="w-5 h-5 fill-amber-500 text-amber-500" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-extrabold text-slate-900 text-base truncate max-w-[320px]">{listing.title}</h2>
                <span className="bg-blue-100 text-blue-800 border border-blue-200 text-[10px] font-mono font-bold px-2 py-0.5 rounded-full">
                  Verified Reviews
                </span>
              </div>
              <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5 font-medium">
                <span>By {listing.sellerName}</span>
                {listing.sellerVerified && (
                  <span className="text-emerald-700 flex items-center gap-0.5 text-[10px] font-bold">
                    <CheckCircle className="w-3 h-3 text-emerald-600" /> Verified Seller
                  </span>
                )}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 bg-white hover:bg-sky-50 border border-sky-200 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 overflow-y-auto space-y-5 flex-1">
          {/* Summary Ratings Banner */}
          <div className="bg-sky-50/70 border border-sky-200 rounded-xl p-4 grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
            <div className="text-center md:border-r md:border-sky-200 pr-2">
              <div className="text-3xl font-extrabold text-slate-900 font-mono flex items-center justify-center gap-1">
                <span>{avgRating}</span>
                <span className="text-sm text-slate-400 font-normal">/ 5.0</span>
              </div>
              <div className="flex items-center justify-center gap-1 my-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-4 h-4 ${
                      star <= Math.round(Number(avgRating))
                        ? 'fill-amber-400 text-amber-400'
                        : 'text-slate-300'
                    }`}
                  />
                ))}
              </div>
              <p className="text-[11px] text-slate-500 font-semibold">
                {totalReviews} Verified {totalReviews === 1 ? 'Review' : 'Reviews'}
              </p>
            </div>

            {/* Breakdown bars */}
            <div className="md:col-span-2 space-y-1">
              {ratingCounts.map(({ stars, count, pct }) => (
                <div key={stars} className="flex items-center gap-2 text-xs">
                  <span className="w-10 text-slate-600 text-[11px] font-mono font-bold flex items-center gap-0.5">
                    {stars} <Star className="w-2.5 h-2.5 fill-slate-400 text-slate-400" />
                  </span>
                  <div className="flex-1 bg-white rounded-full h-2 overflow-hidden border border-sky-200">
                    <div
                      className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="w-8 text-right text-slate-500 text-[10px] font-mono font-semibold">{count}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center justify-between border-b border-sky-100 pb-2">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveTab('reviews')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                  activeTab === 'reviews'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 bg-sky-50 border border-sky-200'
                }`}
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>All Customer Reviews ({totalReviews})</span>
              </button>

              <button
                onClick={() => setActiveTab('write')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                  activeTab === 'write'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 bg-sky-50 border border-sky-200'
                }`}
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Write a Review</span>
              </button>
            </div>

            <div className="text-[10px] text-emerald-700 font-mono font-bold flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>100% Escrow Verified</span>
            </div>
          </div>

          {/* Tab Content */}
          {activeTab === 'reviews' ? (
            <div className="space-y-3">
              {listingReviews.length === 0 ? (
                <div className="text-center py-8 bg-sky-50/50 rounded-xl border border-sky-200 p-6 space-y-2">
                  <Star className="w-8 h-8 text-slate-400 mx-auto" />
                  <p className="text-slate-800 font-bold text-sm">No reviews submitted yet</p>
                  <p className="text-xs text-slate-500 max-w-md mx-auto">
                    Be the first verified customer to complete a transaction and share your review for this service.
                  </p>
                </div>
              ) : (
                listingReviews.map((rev) => (
                  <div key={rev.id} className="bg-sky-50/70 border border-sky-200 rounded-xl p-3.5 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-blue-100 border border-blue-200 flex items-center justify-center text-blue-700 font-bold text-xs font-mono">
                          {rev.reviewerName.charAt(0)}
                        </div>
                        <div>
                          <span className="font-bold text-xs text-slate-900 block">{rev.reviewerName}</span>
                          <span className="text-[10px] text-slate-500">{rev.timestamp}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {rev.verifiedTransaction && (
                          <span className="bg-emerald-100 text-emerald-800 border border-emerald-200 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                            <CheckCircle className="w-3 h-3 text-emerald-600" />
                            Completed Buyer
                          </span>
                        )}

                        <div className="flex items-center gap-0.5 bg-white border border-sky-200 px-2 py-0.5 rounded-md shadow-2xs">
                          <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                          <span className="text-xs font-bold text-slate-900 font-mono">{rev.rating}</span>
                        </div>
                      </div>
                    </div>

                    <p className="text-xs text-slate-700 leading-relaxed pt-1 font-medium">
                      "{rev.comment}"
                    </p>
                  </div>
                ))
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {/* Check if verified transaction exists */}
              {!(hasCompletedTx || simulationAdded) ? (
                <div className="bg-amber-50/80 border border-amber-200 rounded-xl p-4 space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-amber-100 text-amber-800 rounded-lg shrink-0 border border-amber-200">
                      <AlertCircle className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-extrabold text-xs text-amber-900">Verified Buyer Requirement</h4>
                      <p className="text-xs text-slate-700 mt-1 leading-relaxed font-medium">
                        To guarantee authentic ratings and eliminate fake spam reviews, only users with a completed escrow booking or transaction for <strong>{listing.title}</strong> can post a review.
                      </p>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-amber-200/60 flex items-center justify-between">
                    <span className="text-[11px] text-slate-600 font-medium">Want to test writing a review right now?</span>
                    <button
                      onClick={handleSimulateTx}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-3 py-1.5 rounded-xl transition shadow-xs flex items-center gap-1.5"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
                      Simulate Completed Transaction
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="bg-sky-50/80 border border-sky-200 rounded-xl p-4 space-y-4">
                  <div className="bg-emerald-100 border border-emerald-200 text-emerald-900 text-xs px-3 py-2 rounded-xl flex items-center gap-2 font-semibold">
                    <CheckCircle className="w-4 h-4 shrink-0 text-emerald-600" />
                    <span>Verified Completed Transaction Detected! You are eligible to submit a review.</span>
                  </div>

                  {/* Star Rating Selector */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-800 block">Your Rating</label>
                    <div className="flex items-center gap-1.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          type="button"
                          key={star}
                          onClick={() => setRating(star)}
                          onMouseEnter={() => setHoverRating(star)}
                          onMouseLeave={() => setHoverRating(0)}
                          className="p-1 transition transform hover:scale-110"
                        >
                          <Star
                            className={`w-6 h-6 ${
                              star <= (hoverRating || rating)
                                ? 'fill-amber-400 text-amber-400'
                                : 'text-slate-300'
                            }`}
                          />
                        </button>
                      ))}
                      <span className="text-xs font-bold text-amber-600 font-mono ml-2">
                        {hoverRating || rating} / 5 Stars
                      </span>
                    </div>
                  </div>

                  {/* Reviewer Name */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-800 block">Display Name</label>
                    <input
                      type="text"
                      value={reviewerName}
                      onChange={(e) => setReviewerName(e.target.value)}
                      placeholder="e.g. Alex M. (Verified Buyer)"
                      className="w-full bg-white border border-sky-200 rounded-xl px-3 py-2 text-xs text-slate-900 font-semibold focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  {/* Feedback Textarea */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-800 block">Feedback & Service Review</label>
                    <textarea
                      rows={3}
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="Describe the quality of service, communication, and overall experience..."
                      className="w-full bg-white border border-sky-200 rounded-xl p-3 text-xs text-slate-900 font-medium focus:outline-none focus:border-blue-500"
                      required
                    />
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-2 border-t border-sky-200">
                    {submitted ? (
                      <div className="bg-emerald-600 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 animate-pulse">
                        <CheckCircle className="w-4 h-4 text-white" />
                        <span>Review Published!</span>
                      </div>
                    ) : (
                      <button
                        type="submit"
                        disabled={!comment.trim()}
                        className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold px-4 py-2 rounded-xl text-xs transition shadow-md shadow-emerald-600/20 flex items-center gap-1.5"
                      >
                        <ThumbsUp className="w-3.5 h-3.5 text-yellow-300" />
                        <span>Submit Verified Review</span>
                      </button>
                    )}
                  </div>
                </form>
              )}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};
