import React, { useState } from 'react';
import { Listing, CategoryType, CommercialModel } from '../types';
import { X, Sparkles, Percent, DollarSign, Repeat, ShieldCheck } from 'lucide-react';

interface CreateListingModalProps {
  onClose: () => void;
  onCreate: (listing: Listing) => void;
}

export const CreateListingModal: React.FC<CreateListingModalProps> = ({ onClose, onCreate }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<CategoryType>('Hospitality & Hotels');
  const [pricePerHourUSD, setPricePerHourUSD] = useState<number>(100);
  const [location, setLocation] = useState('Global / Remote');
  const [imageUrl, setImageUrl] = useState('https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80');

  const sellerFee5Pct = Math.round(pricePerHourUSD * 0.05 * 100) / 100;
  const netSellerReceives = Math.round((pricePerHourUSD - sellerFee5Pct) * 100) / 100;
  const buyerCheckoutUSD = Math.round((pricePerHourUSD * 1.05) * 100) / 100;
  const timeCreditsPerHourUTC = Math.round((pricePerHourUSD / 50) * 10) / 10;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    const newListing: Listing = {
      id: `gaace-${Date.now()}`,
      isDemo: false,
      title,
      description,
      category,
      commercialModels: ['hourly_booking', 'forward_auction', 'time_credit_swap', 'a2a_negotiation'],
      pricePerHourUSD,
      timeCreditsPerHourUTC,
      availableHours: 50,
      location,
      sellerName: 'User Business (You)',
      sellerRating: 5.0,
      sellerVerified: true,
      language: 'English',
      imageUrl: imageUrl || 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80',
      bidsCount: 0,
      featured: true,
      auctionEndsAt: new Date(Date.now() + 86400000 * 2).toISOString()
    };

    onCreate(newListing);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-white border border-sky-200 rounded-2xl max-w-lg w-full p-5 shadow-xl relative max-h-[90vh] overflow-y-auto text-slate-900">
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 bg-sky-50 border border-sky-200 rounded-lg p-1.5 transition">
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 text-blue-700 font-extrabold text-base mb-1">
          <Sparkles className="w-5 h-5 text-blue-600" />
          <h3>Advertise Service / Asset on ACE</h3>
        </div>
        <p className="text-xs text-slate-600 font-medium mb-4">List products, hotel suites, jets, or consulting services by the hour.</p>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="text-slate-800 font-bold block mb-1">Listing Title</label>
            <input
              type="text"
              required
              placeholder="e.g., Executive Heli Charter & Sky Lounge Access"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-sky-50/70 border border-sky-200 rounded-xl p-2.5 text-slate-900 font-semibold focus:outline-none focus:border-blue-500 font-sans"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-slate-800 font-bold block mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as CategoryType)}
                className="w-full bg-sky-50/70 border border-sky-200 rounded-xl p-2.5 text-slate-900 font-semibold focus:outline-none focus:border-blue-500 font-sans"
              >
                <option value="Hospitality & Hotels">Hospitality & Hotels</option>
                <option value="Flights & Aviation">Flights & Aviation</option>
                <option value="Chauffeur & Transport">Chauffeur & Transport</option>
                <option value="AI & Tech Services">AI & Tech Services</option>
                <option value="Legal & Financial">Legal & Financial</option>
                <option value="Workspace & Venues">Workspace & Venues</option>
                <option value="Equipment & Machinery">Equipment & Machinery</option>
                <option value="Tours & Experiences">Tours & Experiences</option>
              </select>
            </div>

            <div>
              <label className="text-slate-800 font-bold block mb-1">Base Price / hr (USD)</label>
              <input
                type="number"
                required
                value={pricePerHourUSD}
                onChange={(e) => setPricePerHourUSD(Number(e.target.value))}
                className="w-full bg-sky-50/70 border border-sky-200 rounded-xl p-2.5 text-slate-900 font-extrabold font-mono focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="text-slate-800 font-bold block mb-1">Description</label>
            <textarea
              required
              rows={3}
              placeholder="Provide details about availability, amenities, or deliverables..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-sky-50/70 border border-sky-200 rounded-xl p-2.5 text-slate-900 font-medium focus:outline-none focus:border-blue-500 font-sans"
            />
          </div>

          <div>
            <label className="text-slate-800 font-bold block mb-1">Location / Service Area</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full bg-sky-50/70 border border-sky-200 rounded-xl p-2.5 text-slate-900 font-semibold focus:outline-none focus:border-blue-500 font-sans"
            />
          </div>

          {/* 5% Seller Fee Calculation Preview */}
          <div className="bg-sky-50/70 border border-sky-200 rounded-xl p-3 space-y-1.5 text-[11px] font-medium">
            <div className="flex items-center gap-1 text-blue-800 font-extrabold">
              <Percent className="w-3.5 h-3.5 text-blue-600" />
              <span>Seller Platform Fee (5.0%) Breakdown</span>
            </div>
            <div className="flex justify-between text-slate-700">
              <span>Your Listed Price:</span>
              <span className="font-mono text-slate-900 font-bold">${pricePerHourUSD} / hr</span>
            </div>
            <div className="flex justify-between text-slate-500">
              <span>Seller Platform Fee (5.0%):</span>
              <span className="font-mono text-slate-700 font-semibold">-${sellerFee5Pct}</span>
            </div>
            <div className="flex justify-between text-emerald-800 font-extrabold border-t border-sky-200 pt-1">
              <span>Your Net Payout:</span>
              <span className="font-mono">${netSellerReceives} / hr</span>
            </div>
            <div className="flex justify-between text-[10px] text-slate-500 pt-0.5">
              <span>Equivalent Time Credit:</span>
              <span className="font-mono text-slate-700 font-bold">{timeCreditsPerHourUTC} UTC / hr</span>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl text-xs flex items-center justify-center gap-2 transition shadow-md shadow-emerald-600/20"
          >
            <ShieldCheck className="w-4 h-4 text-yellow-300" />
            <span>Publish & Enable Autonomous Trading</span>
          </button>
        </form>
      </div>
    </div>
  );
};
