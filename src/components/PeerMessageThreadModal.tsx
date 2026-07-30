import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Listing, PeerMessage } from '../types';
import { 
  Send, 
  X, 
  MessageSquare, 
  CheckCircle, 
  Bot, 
  Gavel, 
  ShieldCheck, 
  DollarSign, 
  Clock, 
  Sparkles,
  Repeat,
  Calendar
} from 'lucide-react';

interface PeerMessageThreadModalProps {
  listing: Listing;
  onClose: () => void;
  onSelectAction: (listing: Listing, action: 'bid' | 'negotiate' | 'schedule') => void;
}

export const PeerMessageThreadModal: React.FC<PeerMessageThreadModalProps> = ({
  listing,
  onClose,
  onSelectAction
}) => {
  const currentPrice = listing.currentHighestBidUSD || listing.pricePerHourUSD;
  const discountedPrice = Math.round(currentPrice * 0.9);

  const initialMessages: PeerMessage[] = [
    {
      id: 'msg-1',
      listingId: listing.id,
      sender: 'seller',
      senderName: listing.sellerName,
      text: `Hello! Thanks for inspecting "${listing.title}". I am currently available for direct bookings, UTC time credit swaps, or custom negotiated terms. How can I assist you today?`,
      timestamp: 'Just now'
    }
  ];

  const [messages, setMessages] = useState<PeerMessage[]>(initialMessages);
  const [inputText, setInputText] = useState<string>('');
  const [isSellerTyping, setIsSellerTyping] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isSellerTyping]);

  const handleSendMessage = (customText?: string, isOffer: boolean = false, proposedPrice?: number) => {
    const textToSend = customText || inputText;
    if (!textToSend.trim()) return;

    const userMsg: PeerMessage = {
      id: `msg-${Date.now()}`,
      listingId: listing.id,
      sender: 'user',
      senderName: 'You (Buyer)',
      text: textToSend.trim(),
      timestamp: 'Just now',
      isOffer,
      proposedPriceUSD: proposedPrice
    };

    setMessages(prev => [...prev, userMsg]);
    if (!customText) setInputText('');

    // Simulate Seller automated / live response
    setIsSellerTyping(true);
    setTimeout(() => {
      let replyText = `Thanks for your inquiry! I can accommodate your request for "${listing.title}". Feel free to lock in your booking using escrow or submit an automated bid.`;
      
      if (isOffer && proposedPrice) {
        replyText = `I evaluated your proposal of $${proposedPrice}/hr (10% below $${currentPrice}/hr list price). That looks reasonable! You can lock it in via A2A Negotiation or proceed directly to checkout.`;
      } else if (textToSend.toLowerCase().includes('utc') || textToSend.toLowerCase().includes('credit')) {
        replyText = `Yes! I accept UTC Time Credits at a rate of ${listing.timeCreditsPerHourUTC} UTC/hr. You can reserve your time slot directly in the scheduling tab.`;
      } else if (textToSend.toLowerCase().includes('available') || textToSend.toLowerCase().includes('when')) {
        replyText = `I am located in ${listing.location} with immediate calendar availability for this week!`;
      }

      const sellerMsg: PeerMessage = {
        id: `msg-reply-${Date.now()}`,
        listingId: listing.id,
        sender: 'seller',
        senderName: listing.sellerName,
        text: replyText,
        timestamp: 'Just now'
      };

      setIsSellerTyping(false);
      setMessages(prev => [...prev, sellerMsg]);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="bg-white border border-sky-200 rounded-2xl w-full max-w-xl max-h-[88vh] overflow-hidden shadow-xl flex flex-col text-slate-900"
      >
        {/* Header */}
        <div className="p-3.5 border-b border-sky-100 bg-sky-50/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <img
                src={listing.imageUrl}
                alt={listing.title}
                className="w-11 h-11 rounded-lg object-cover border border-sky-200"
              />
              <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full" title="Online now" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-sm text-slate-900 truncate max-w-[260px]">{listing.title}</h3>
                <span className="bg-blue-100 text-blue-800 border border-blue-200 text-[10px] font-mono font-bold px-2 py-0.5 rounded-full shrink-0">
                  P2P Negotiate
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5 font-medium">
                <span className="font-semibold text-slate-800">{listing.sellerName}</span>
                {listing.sellerVerified && (
                  <span className="text-emerald-700 flex items-center gap-0.5 text-[10px] font-bold">
                    <CheckCircle className="w-3 h-3 text-emerald-600" /> Verified Seller
                  </span>
                )}
                <span className="text-slate-300">•</span>
                <span className="font-mono text-emerald-700 font-extrabold">${currentPrice}/hr</span>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 bg-white hover:bg-sky-50 border border-sky-200 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Escrow Transparency Badge */}
        <div className="bg-sky-50/50 border-b border-sky-200 px-4 py-1.5 text-[11px] text-slate-600 flex items-center justify-between font-mono">
          <div className="flex items-center gap-1.5 text-emerald-700 font-bold">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Escrow Protected: Terms agreed in chat apply to final checkout</span>
          </div>
          <div className="flex items-center gap-1 text-slate-700 font-bold">
            <Repeat className="w-3 h-3 text-emerald-600" />
            <span>{listing.timeCreditsPerHourUTC} UTC / hr</span>
          </div>
        </div>

        {/* Message Thread Body */}
        <div className="p-4 overflow-y-auto space-y-3 flex-1 bg-sky-50/30 min-h-[280px]">
          {messages.map((msg) => {
            const isUser = msg.sender === 'user';
            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
              >
                <div className="flex items-center gap-1.5 mb-1 text-[10px] text-slate-500">
                  <span className="font-semibold text-slate-700">{msg.senderName}</span>
                  <span>•</span>
                  <span>{msg.timestamp}</span>
                </div>

                <div
                  className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed border ${
                    isUser
                      ? 'bg-blue-600 text-white font-medium rounded-tr-none border-blue-600 shadow-xs'
                      : 'bg-white text-slate-800 rounded-tl-none border-sky-200 shadow-xs'
                  }`}
                >
                  <p>{msg.text}</p>
                  {msg.isOffer && msg.proposedPriceUSD && (
                    <div className="mt-2 pt-2 border-t border-sky-200 text-[10px] font-mono font-bold flex items-center justify-between">
                      <span className={isUser ? 'text-blue-100' : 'text-slate-600'}>Counter Offer:</span>
                      <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded border border-emerald-200 font-extrabold">
                        ${msg.proposedPriceUSD} / hr
                      </span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {isSellerTyping && (
            <div className="flex items-center gap-2 text-slate-600 text-xs font-mono bg-white border border-sky-200 px-3 py-1.5 rounded-full w-max shadow-2xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-blue-600 animate-spin" />
              <span>{listing.sellerName} is typing a response...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestion Chips */}
        <div className="p-2.5 bg-sky-50/80 border-t border-sky-200 space-y-2">
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar text-[11px]">
            <span className="text-slate-500 font-mono font-bold shrink-0">Quick Prompts:</span>

            <button
              onClick={() => handleSendMessage(`I would like to propose a 10% rate discount to $${discountedPrice}/hr for this reservation.`, true, discountedPrice)}
              className="px-2.5 py-1 bg-white hover:bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg shrink-0 transition flex items-center gap-1 font-bold shadow-2xs"
            >
              <DollarSign className="w-3 h-3 text-emerald-600" />
              <span>Propose $${discountedPrice}/hr (10% Off)</span>
            </button>

            <button
              onClick={() => handleSendMessage(`Is this listing eligible for direct UTC Time Credit swap at ${listing.timeCreditsPerHourUTC} UTC/hr?`)}
              className="px-2.5 py-1 bg-white hover:bg-sky-100 text-slate-700 border border-sky-200 rounded-lg shrink-0 transition flex items-center gap-1 font-semibold shadow-2xs"
            >
              <Repeat className="w-3 h-3 text-blue-600" />
              <span>Confirm UTC Swap Rate</span>
            </button>

            <button
              onClick={() => handleSendMessage(`Could you confirm exact availability for a UTC time slot appointment this week?`)}
              className="px-2.5 py-1 bg-white hover:bg-sky-100 text-slate-700 border border-sky-200 rounded-lg shrink-0 transition flex items-center gap-1 font-semibold shadow-2xs"
            >
              <Clock className="w-3 h-3 text-blue-600" />
              <span>Ask Availability</span>
            </button>
          </div>

          {/* Text Input Form */}
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Type your message or custom counter offer..."
              className="flex-1 bg-white border border-sky-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 font-medium focus:outline-none focus:border-blue-500"
            />
            <button
              onClick={() => handleSendMessage()}
              disabled={!inputText.trim()}
              className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold p-2.5 rounded-xl transition shadow-xs shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>

          {/* Direct Action Buttons Footer */}
          <div className="pt-2 border-t border-sky-200 grid grid-cols-3 gap-2">
            <button
              onClick={() => {
                onClose();
                onSelectAction(listing, 'bid');
              }}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-1.5 px-2 rounded-xl text-xs flex items-center justify-center gap-1 transition shadow-xs"
            >
              <Gavel className="w-3.5 h-3.5 text-yellow-300" />
              <span>Bid / Book</span>
            </button>

            <button
              onClick={() => {
                onClose();
                onSelectAction(listing, 'negotiate');
              }}
              className="bg-white hover:bg-sky-100 text-slate-800 border border-sky-200 font-bold py-1.5 px-2 rounded-xl text-xs flex items-center justify-center gap-1 transition shadow-2xs"
            >
              <Bot className="w-3.5 h-3.5 text-blue-600" />
              <span>A2A Negotiate</span>
            </button>

            <button
              onClick={() => {
                onClose();
                onSelectAction(listing, 'schedule');
              }}
              className="bg-blue-50 hover:bg-blue-100 text-blue-800 border border-blue-200 font-bold py-1.5 px-2 rounded-xl text-xs flex items-center justify-center gap-1 transition shadow-2xs"
            >
              <Calendar className="w-3.5 h-3.5 text-blue-600" />
              <span>Schedule</span>
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
