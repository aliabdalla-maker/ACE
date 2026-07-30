import React, { useState } from 'react';
import { A2AAgentConfig, Listing } from '../types';
import { LanguageItem } from '../data/languages';
import { Bot, Sparkles, Play, ShieldCheck, Percent, Send, CheckCircle2, Sliders, RefreshCw, Layers } from 'lucide-react';

interface A2ATradingConsoleProps {
  agentConfig: A2AAgentConfig;
  onUpdateConfig: (newConfig: A2AAgentConfig) => void;
  listings: Listing[];
  selectedLanguage: LanguageItem;
}

export const A2ATradingConsole: React.FC<A2ATradingConsoleProps> = ({
  agentConfig,
  onUpdateConfig,
  listings,
  selectedLanguage
}) => {
  const [selectedListingId, setSelectedListingId] = useState<string>(listings[0]?.id || '');
  const [offerPriceUSD, setOfferPriceUSD] = useState<number>(listings[0]?.pricePerHourUSD ? Math.round(listings[0].pricePerHourUSD * 0.85) : 100);
  const [negotiating, setNegotiating] = useState<boolean>(false);
  
  const [negotiationLogs, setNegotiationLogs] = useState<Array<{
    sender: 'User-AI' | 'Supplier-AI' | 'ACE Protocol';
    message: string;
    terms?: any;
    timestamp: string;
  }>>([
    {
      sender: 'ACE Protocol',
      message: 'A2A Trading Console Initialized. AI agents bound by 5% Platform Escrow Protocol.',
      timestamp: new Date().toLocaleTimeString()
    }
  ]);

  const activeListing = listings.find(l => l.id === selectedListingId) || listings[0];

  const handleRunNegotiation = async () => {
    if (!activeListing) return;
    setNegotiating(true);

    const logUserMsg = {
      sender: 'User-AI' as const,
      message: `Proposing autonomous counter-offer of $${offerPriceUSD}/hr for "${activeListing.title}".`,
      timestamp: new Date().toLocaleTimeString()
    };

    setNegotiationLogs(prev => [...prev, logUserMsg]);

    try {
      const res = await fetch('/api/gemini/negotiate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          buyerAgentName: agentConfig.agentName,
          sellerAgentName: activeListing.sellerName,
          listingTitle: activeListing.title,
          category: activeListing.category,
          currentPrice: activeListing.pricePerHourUSD,
          requestedPrice: offerPriceUSD,
          language: selectedLanguage.name
        })
      });

      const data = await res.json();

      const logSupplierMsg = {
        sender: 'Supplier-AI' as const,
        message: data.aiAgentMessage || `Supplier AI counter-offered $${data.counterPrice}/hr. Rationale: ${data.rationale}`,
        terms: data.dealTerms,
        timestamp: new Date().toLocaleTimeString()
      };

      setNegotiationLogs(prev => [...prev, logSupplierMsg]);
    } catch (e) {
      console.error(e);
      setNegotiationLogs(prev => [...prev, {
        sender: 'ACE Protocol',
        message: 'A2A Negotiation error or connection timeout. Standard algorithmic fee schedule applied.',
        timestamp: new Date().toLocaleTimeString()
      }]);
    } finally {
      setNegotiating(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header Banner */}
      <div className="bg-white border border-sky-200 rounded-2xl p-5 shadow-xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-blue-700 font-extrabold text-base">
              <Bot className="w-5 h-5 text-blue-600" />
              <h2>AI-to-AI (A2A) Autonomous Commerce Console</h2>
            </div>
            <p className="text-xs text-slate-600 max-w-xl leading-relaxed font-medium">
              Authorize your personal AI agent to negotiate directly with supplier AI agents in real-time. Optimize prices, swap time credits, and enforce 5% escrow agreements.
            </p>
          </div>

          <div className="bg-sky-50 border border-sky-200 rounded-xl p-3 shrink-0 flex items-center gap-3 shadow-2xs">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
            <div>
              <span className="text-[10px] text-slate-500 block font-mono font-bold">Agent Status</span>
              <span className="text-xs font-bold text-emerald-700 font-mono">AUTONOMOUS ONLINE</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Agent Configuration Panel */}
        <div className="bg-white border border-sky-200 rounded-2xl p-4 space-y-4 shadow-xl">
          <h3 className="font-extrabold text-xs uppercase tracking-wider text-slate-800 flex items-center gap-1.5 border-b border-sky-100 pb-2">
            <Sliders className="w-4 h-4 text-blue-600" />
            <span>Agent Parameters</span>
          </h3>

          <div className="space-y-3 text-xs">
            <div>
              <label className="text-slate-700 font-bold block mb-1">Agent Identity Name</label>
              <input
                type="text"
                value={agentConfig.agentName}
                onChange={(e) => onUpdateConfig({ ...agentConfig, agentName: e.target.value })}
                className="w-full bg-sky-50/70 border border-sky-200 rounded-xl p-2 text-slate-900 font-semibold focus:outline-none focus:border-blue-500 font-sans"
              />
            </div>

            <div>
              <label className="text-slate-700 font-bold block mb-1">Max Ceiling Rate (USD / hr)</label>
              <input
                type="number"
                value={agentConfig.maxBidPriceUSD}
                onChange={(e) => onUpdateConfig({ ...agentConfig, maxBidPriceUSD: Number(e.target.value) })}
                className="w-full bg-sky-50/70 border border-sky-200 rounded-xl p-2 text-slate-900 font-bold focus:outline-none focus:border-blue-500 font-mono"
              />
            </div>

            <div>
              <label className="text-slate-700 font-bold block mb-1">Risk Profile & Strategy</label>
              <select
                value={agentConfig.riskTolerance}
                onChange={(e) => onUpdateConfig({ ...agentConfig, riskTolerance: e.target.value as any })}
                className="w-full bg-sky-50/70 border border-sky-200 rounded-xl p-2 text-slate-900 font-semibold focus:outline-none focus:border-blue-500 font-sans"
              >
                <option value="Conservative">Conservative (High Value Focus)</option>
                <option value="Balanced">Balanced (Standard A2A Yield)</option>
                <option value="Aggressive">Aggressive (Arbitrage & Deep Discount)</option>
              </select>
            </div>

            <div className="flex items-center justify-between p-2.5 bg-sky-50/70 border border-sky-200 rounded-xl">
              <span className="text-slate-800 font-bold">Auto-Bidding Enabled</span>
              <button
                onClick={() => onUpdateConfig({ ...agentConfig, autoBidEnabled: !agentConfig.autoBidEnabled })}
                className={`w-10 h-5 rounded-full transition p-0.5 ${agentConfig.autoBidEnabled ? 'bg-emerald-500' : 'bg-slate-300'}`}
              >
                <div className={`w-4 h-4 bg-white rounded-full transition transform shadow-2xs ${agentConfig.autoBidEnabled ? 'translate-x-5' : 'translate-x-0'}`} />
              </button>
            </div>
          </div>
        </div>

        {/* Live A2A Negotiation Simulator */}
        <div className="lg:col-span-2 bg-white border border-sky-200 rounded-2xl p-4 flex flex-col space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-sky-100 pb-3">
            <h3 className="font-extrabold text-xs uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-blue-600" />
              <span>Live A2A Negotiation Simulator</span>
            </h3>

            <span className="text-[10px] text-slate-500 font-mono font-bold">
              Lang: <strong className="text-blue-700">{selectedLanguage.name}</strong>
            </span>
          </div>

          {/* Select Target Listing */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <label className="text-slate-700 font-bold block mb-1">Target Service / Asset Listing</label>
              <select
                value={selectedListingId}
                onChange={(e) => {
                  setSelectedListingId(e.target.value);
                  const selected = listings.find(l => l.id === e.target.value);
                  if (selected) setOfferPriceUSD(Math.round(selected.pricePerHourUSD * 0.85));
                }}
                className="w-full bg-sky-50/70 border border-sky-200 rounded-xl p-2 text-slate-900 font-semibold focus:outline-none focus:border-blue-500 font-sans"
              >
                {listings.map((l) => (
                  <option key={l.id} value={l.id}>{l.title} (${l.pricePerHourUSD}/hr)</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-slate-700 font-bold block mb-1">Your AI Proposed Counter Rate (USD)</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={offerPriceUSD}
                  onChange={(e) => setOfferPriceUSD(Number(e.target.value))}
                  className="flex-1 bg-sky-50/70 border border-sky-200 rounded-xl p-2 text-slate-900 font-extrabold focus:outline-none focus:border-blue-500 font-mono"
                />
                <button
                  onClick={handleRunNegotiation}
                  disabled={negotiating}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-3.5 py-2 rounded-xl text-xs flex items-center gap-1 shrink-0 transition shadow-xs"
                >
                  {negotiating ? <RefreshCw className="w-3.5 h-3.5 animate-spin text-yellow-300" /> : <Send className="w-3.5 h-3.5 text-yellow-300" />}
                  <span>Negotiate</span>
                </button>
              </div>
            </div>
          </div>

          {/* Negotiation Logs Stream */}
          <div className="bg-sky-50/50 border border-sky-200 rounded-xl p-3 h-64 overflow-y-auto space-y-3 font-mono text-xs">
            {negotiationLogs.map((log, i) => (
              <div key={i} className={`p-2.5 rounded-xl border text-[11px] space-y-1 shadow-2xs ${
                log.sender === 'User-AI'
                  ? 'bg-blue-50 border-blue-200 text-blue-950 font-medium'
                  : log.sender === 'Supplier-AI'
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-950 font-medium'
                  : 'bg-white border-sky-200 text-slate-600'
              }`}>
                <div className="flex items-center justify-between text-[10px] font-extrabold">
                  <span className={log.sender === 'User-AI' ? 'text-blue-700' : log.sender === 'Supplier-AI' ? 'text-emerald-700' : 'text-slate-500'}>
                    [{log.sender}]
                  </span>
                  <span className="text-slate-400 font-mono">{log.timestamp}</span>
                </div>
                <p className="leading-snug">{log.message}</p>

                {log.terms && (
                  <div className="mt-2 p-2 bg-white rounded-lg border border-sky-200 text-[10px] space-y-0.5 shadow-2xs">
                    <div className="text-emerald-800 font-extrabold">Agreed Terms Breakdown (5.0% Platform Fee):</div>
                    <div className="flex justify-between text-slate-700 font-semibold">
                      <span>Base Rate: ${log.terms.hourlyRate}/hr</span>
                      <span>Platform Fee (+5%): +${log.terms.buyerFee5Percent}</span>
                    </div>
                    <div className="flex justify-between text-blue-700 font-extrabold pt-0.5 border-t border-sky-100">
                      <span>Total Payable:</span>
                      <span>${log.terms.buyerTotal}</span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
