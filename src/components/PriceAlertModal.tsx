import React, { useState } from 'react';
import { PriceAlert, CategoryType, CommercialModel, Listing } from '../types';
import { Bell, X, Check, DollarSign, Filter, Sparkles, Tag, ShieldCheck, AlertCircle } from 'lucide-react';

interface PriceAlertModalProps {
  listings: Listing[];
  onClose: () => void;
  onAddAlert: (alert: PriceAlert) => void;
}

const CATEGORY_OPTIONS: (CategoryType | 'All Categories')[] = [
  'All Categories',
  'Hospitality & Hotels',
  'Flights & Aviation',
  'Chauffeur & Transport',
  'AI & Tech Services',
  'Legal & Financial',
  'Workspace & Venues',
  'Medical & Wellness',
  'Tours & Experiences',
  'Equipment & Machinery'
];

const COMMERCIAL_MODEL_OPTIONS: { value: CommercialModel | 'All Models'; label: string }[] = [
  { value: 'All Models', label: 'All Trading Models' },
  { value: 'hourly_booking', label: 'Hourly Booking' },
  { value: 'forward_auction', label: 'Forward Auction' },
  { value: 'reverse_auction', label: 'Reverse Auction' },
  { value: 'time_credit_swap', label: 'Time Credit Swap' },
  { value: 'a2a_negotiation', label: 'AI-to-AI Negotiation' },
  { value: 'fixed_price', label: 'Fixed Price' },
  { value: 'instant_booking', label: 'Instant Booking' },
  { value: 'rental', label: 'Rental' },
  { value: 'lease', label: 'Lease' }
];

export const PriceAlertModal: React.FC<PriceAlertModalProps> = ({
  listings,
  onClose,
  onAddAlert
}) => {
  const [category, setCategory] = useState<CategoryType | 'All Categories'>('All Categories');
  const [commercialModel, setCommercialModel] = useState<CommercialModel | 'All Models'>('All Models');
  const [targetPriceUSD, setTargetPriceUSD] = useState<number>(150);
  const [condition, setCondition] = useState<'below' | 'above'>('below');
  const [successMsg, setSuccessMsg] = useState<boolean>(false);

  // Calculate preview matching listings
  const matchingListings = listings.filter(l => {
    const matchCat = category === 'All Categories' || l.category === category;
    const matchModel = commercialModel === 'All Models' || l.commercialModels.includes(commercialModel as CommercialModel);
    const matchPrice = condition === 'below' ? l.pricePerHourUSD <= targetPriceUSD : l.pricePerHourUSD >= targetPriceUSD;
    return matchCat && matchModel && matchPrice;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (targetPriceUSD <= 0) return;

    const newAlert: PriceAlert = {
      id: `alert-${Date.now()}`,
      category,
      commercialModel,
      targetPriceUSD,
      condition,
      active: true,
      createdAt: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    };

    onAddAlert(newAlert);
    setSuccessMsg(true);
    setTimeout(() => {
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-white border border-sky-200 rounded-2xl max-w-md w-full p-6 shadow-xl space-y-5 relative text-slate-900">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-sky-100">
          <div className="flex items-center gap-2 text-slate-900 font-bold text-base">
            <div className="w-8 h-8 rounded-xl bg-blue-100 border border-blue-200 flex items-center justify-center text-blue-700">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900">Set Real-Time Price Alert</h3>
              <p className="text-[11px] text-slate-500 font-normal">Automated notifications for target category &amp; pricing</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-sky-50 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {successMsg ? (
          <div className="py-8 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 border border-emerald-300 flex items-center justify-center mx-auto animate-bounce">
              <Check className="w-6 h-6 stroke-[3]" />
            </div>
            <h4 className="font-extrabold text-slate-900 text-base">Price Trigger Configured!</h4>
            <p className="text-xs text-slate-600">
              Your real-time price alert trigger has been added to active monitoring.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Category Selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-blue-600" />
                <span>Target Service Category</span>
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full bg-sky-50/70 border border-sky-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-500 font-semibold"
              >
                {CATEGORY_OPTIONS.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Commercial Model / Listing Type Selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <Filter className="w-3.5 h-3.5 text-blue-600" />
                <span>Listing / Trading Model Type</span>
              </label>
              <select
                value={commercialModel}
                onChange={(e) => setCommercialModel(e.target.value as any)}
                className="w-full bg-sky-50/70 border border-sky-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-500 font-semibold"
              >
                {COMMERCIAL_MODEL_OPTIONS.map((m) => (
                  <option key={m.value} value={m.value}>
                    {m.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Trigger Condition */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-800">Alert Trigger Rule</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setCondition('below')}
                  className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition ${
                    condition === 'below'
                      ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                      : 'bg-sky-50 border-sky-200 text-slate-700 hover:bg-sky-100'
                  }`}
                >
                  <span>Price Drops Below</span>
                </button>
                <button
                  type="button"
                  onClick={() => setCondition('above')}
                  className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition ${
                    condition === 'above'
                      ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                      : 'bg-sky-50 border-sky-200 text-slate-700 hover:bg-sky-100'
                  }`}
                >
                  <span>Price Rises Above</span>
                </button>
              </div>
            </div>

            {/* Target Price USD */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold text-slate-800 flex items-center gap-1">
                  <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Target Threshold ($ USD / Hour)</span>
                </label>
                <span className="text-xs font-mono font-extrabold text-blue-700">${targetPriceUSD}</span>
              </div>
              <input
                type="number"
                min="10"
                max="5000"
                step="10"
                value={targetPriceUSD}
                onChange={(e) => setTargetPriceUSD(Number(e.target.value))}
                className="w-full bg-sky-50/70 border border-sky-200 rounded-xl px-3 py-2 text-xs text-slate-900 font-mono font-bold focus:outline-none focus:border-blue-500"
              />

              {/* Quick Presets */}
              <div className="flex items-center gap-1.5 pt-1 text-[11px] font-mono">
                <span className="text-slate-500 text-[10px] font-sans font-medium">Presets:</span>
                {[50, 100, 200, 350, 500].map(val => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setTargetPriceUSD(val)}
                    className="px-2 py-0.5 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition border border-slate-200"
                  >
                    ${val}
                  </button>
                ))}
              </div>
            </div>

            {/* Live Matching Listings Preview */}
            <div className="bg-sky-50 border border-sky-200 rounded-xl p-3 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
                <div>
                  <span className="font-bold text-slate-900 block">Current Market Match</span>
                  <span className="text-[10px] text-slate-500">
                    {matchingListings.length} active listing(s) match this trigger right now
                  </span>
                </div>
              </div>
              <span className="font-mono text-xs font-bold bg-blue-100 text-blue-800 px-2 py-0.5 rounded-lg border border-blue-200">
                {matchingListings.length} Matches
              </span>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 transition shadow-md shadow-emerald-600/20"
              >
                <Bell className="w-4 h-4 text-yellow-300" />
                <span>Save Price Alert Trigger</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
