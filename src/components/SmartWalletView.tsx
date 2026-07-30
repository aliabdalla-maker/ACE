import React, { useState } from 'react';
import { SmartWalletState, WalletTransaction } from '../types';
import { LanguageItem } from '../data/languages';
import { 
  Wallet, 
  Repeat, 
  DollarSign, 
  ShieldCheck, 
  Percent, 
  ArrowUpRight, 
  ArrowDownLeft, 
  PlayCircle, 
  Plus, 
  History, 
  Sparkles,
  CheckCircle2,
  FileText,
  Download,
  QrCode
} from 'lucide-react';
import { AdMobBanner } from './AdMobBanner';
import { TransactionReceiptModal } from './TransactionReceiptModal';
import { WalletTrendChart } from './WalletTrendChart';
import { WalletQRCodeModal } from './WalletQRCodeModal';

interface SmartWalletViewProps {
  wallet: SmartWalletState;
  selectedLanguage: LanguageItem;
  onDepositCash: (amount: number) => void;
  onRewardEarned: (utcAmount: number) => void;
}

export const SmartWalletView: React.FC<SmartWalletViewProps> = ({
  wallet,
  selectedLanguage,
  onDepositCash,
  onRewardEarned
}) => {
  const [depositAmount, setDepositAmount] = useState<number>(500);
  const [showDepositModal, setShowDepositModal] = useState<boolean>(false);
  const [depositSuccess, setDepositSuccess] = useState<boolean>(false);
  const [selectedTxForReceipt, setSelectedTxForReceipt] = useState<WalletTransaction | null>(null);
  const [showMasterAuditModal, setShowMasterAuditModal] = useState<boolean>(false);
  const [showQRModal, setShowQRModal] = useState<boolean>(false);

  const handleConfirmDeposit = () => {
    onDepositCash(depositAmount);
    setDepositSuccess(true);
    setTimeout(() => {
      setDepositSuccess(false);
      setShowDepositModal(false);
    }, 1500);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Wallet Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* UTC Time Credits Card */}
        <div className="bg-white border border-sky-200 rounded-2xl p-5 shadow-xl space-y-3 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-blue-700 uppercase tracking-wider font-mono">Time Credits</span>
            <Repeat className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <span className="text-3xl font-extrabold text-slate-900 font-mono">{wallet.utcTimeCredits}</span>
            <span className="text-xs text-blue-600 ml-1.5 font-bold">UTC Hours</span>
          </div>
          <div className="text-[11px] text-slate-500 flex items-center justify-between pt-2 border-t border-sky-100 font-medium">
            <span>Escrow Holding:</span>
            <span className="font-bold text-slate-800 font-mono">{wallet.escrowHoldingUTC} UTC</span>
          </div>
        </div>

        {/* USD Cash Balance Card */}
        <div className="bg-white border border-sky-200 rounded-2xl p-5 shadow-xl space-y-3 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-emerald-700 uppercase tracking-wider font-mono">USD Cash Balance</span>
            <DollarSign className="w-5 h-5 text-emerald-600" />
          </div>
          <div>
            <span className="text-3xl font-extrabold text-slate-900 font-mono">${wallet.cashBalanceUSD}</span>
            <span className="text-xs text-emerald-600 ml-1.5 font-bold">USD</span>
          </div>
          <div className="text-[11px] text-slate-500 flex items-center justify-between pt-2 border-t border-sky-100 font-medium">
            <span>Locked in Escrow:</span>
            <span className="font-bold text-slate-800 font-mono">${wallet.escrowHoldingUSD}</span>
          </div>
        </div>

        {/* Dual 5% Platform Revenue Ledger */}
        <div className="bg-white border border-sky-200 rounded-2xl p-5 shadow-xl space-y-3 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-blue-700 uppercase tracking-wider font-mono">Platform Escrow Volume</span>
            <Percent className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <span className="text-3xl font-extrabold text-slate-900 font-mono">${wallet.totalMarketplaceEarnedUSD}</span>
            <span className="text-xs text-blue-600 ml-1.5 font-bold">ACE Fees</span>
          </div>
          <div className="text-[11px] text-slate-500 flex items-center justify-between pt-2 border-t border-sky-100 font-medium">
            <span>Platform Standard:</span>
            <span className="font-bold text-emerald-700 font-mono">5.0% Fee Per Party</span>
          </div>
        </div>
      </div>

      {/* 30-Day Recharts Financial Insights Trend */}
      <WalletTrendChart 
        cashBalanceUSD={wallet.cashBalanceUSD} 
        utcTimeCredits={wallet.utcTimeCredits} 
      />

      {/* Action Bar & AdMob Rewarded Unit */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white border border-sky-200 p-4 rounded-2xl shadow-xl">
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setShowDepositModal(true)}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-1.5 transition shadow-md shadow-emerald-600/20"
          >
            <Plus className="w-4 h-4 text-yellow-300" />
            <span>Deposit Cash</span>
          </button>

          <button
            onClick={() => setShowQRModal(true)}
            className="bg-sky-50 hover:bg-sky-100 text-blue-800 border border-sky-200 font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-1.5 transition shadow-2xs"
            title="Generate & Share Wallet QR Code"
          >
            <QrCode className="w-4 h-4 text-blue-600" />
            <span>Receive via QR</span>
          </button>
        </div>

        {/* AdMob Rewarded Unit Trigger */}
        <div className="w-full sm:w-auto">
          <AdMobBanner type="banner" onRewardEarned={onRewardEarned} />
        </div>
      </div>

      {/* Itemized Transaction History with 5% Fee Breakdown */}
      <div className="bg-white border border-sky-200 rounded-2xl p-5 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-sky-100 pb-3">
          <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
            <History className="w-4 h-4 text-blue-600" />
            <span>Transaction Ledger & Escrow Records</span>
          </h3>
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-mono font-bold">{wallet.transactions.length} Records</span>
            <button
              onClick={() => setShowMasterAuditModal(true)}
              className="bg-sky-50 hover:bg-sky-100 text-blue-800 border border-sky-200 px-2.5 py-1 rounded-lg text-[11px] font-bold flex items-center gap-1 transition"
              title="Download Master Audit Statement"
            >
              <FileText className="w-3.5 h-3.5 text-blue-600" />
              <span>Full Audit Report</span>
            </button>
          </div>
        </div>

        <div className="space-y-2.5">
          {wallet.transactions.map((tx) => (
            <div key={tx.id} className="bg-sky-50/60 border border-sky-200 rounded-xl p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900">{tx.title}</span>
                  <span className={`text-[10px] px-2 py-0.2 rounded-full font-bold uppercase ${
                    tx.status === 'Completed' ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' : 'bg-slate-200 text-slate-700'
                  }`}>
                    {tx.status}
                  </span>
                </div>
                <div className="text-[10px] text-slate-500 font-mono space-x-3 font-medium">
                  <span>Platform Fee (5.0%): <strong className="text-emerald-700">${tx.buyerFee5Pct}</strong></span>
                  <span>Timestamp: {tx.timestamp}</span>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0 self-end sm:self-auto">
                <div className="text-right">
                  <span className="text-sm font-bold text-emerald-700 font-mono block">${tx.amountUSD}</span>
                  <span className="text-[10px] text-slate-500 font-mono">{tx.amountUTC} UTC</span>
                </div>

                <button
                  onClick={() => setSelectedTxForReceipt(tx)}
                  className="bg-white hover:bg-sky-100 text-slate-800 border border-sky-200 px-2.5 py-1.5 rounded-lg text-[11px] font-bold flex items-center gap-1 transition shadow-2xs"
                  title="View & Download Audit Receipt"
                >
                  <Download className="w-3.5 h-3.5 text-blue-600" />
                  <span>Receipt</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Transaction Audit Receipt Modal */}
      {(selectedTxForReceipt || showMasterAuditModal) && (
        <TransactionReceiptModal
          transaction={selectedTxForReceipt}
          allTransactions={showMasterAuditModal ? wallet.transactions : undefined}
          onClose={() => {
            setSelectedTxForReceipt(null);
            setShowMasterAuditModal(false);
          }}
        />
      )}

      {/* Wallet QR Code Modal */}
      {showQRModal && (
        <WalletQRCodeModal
          utcBalance={wallet.utcTimeCredits}
          cashBalanceUSD={wallet.cashBalanceUSD}
          onClose={() => setShowQRModal(false)}
        />
      )}

      {/* Deposit Cash Modal */}
      {showDepositModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-sky-200 rounded-2xl max-w-sm w-full p-5 shadow-xl relative space-y-4 text-slate-900">
            <h3 className="font-extrabold text-slate-900 text-base">Deposit Cash Funds</h3>
            <p className="text-xs text-slate-600 font-medium">Add USD balance to your ACE wallet for bidding and hourly bookings.</p>

            {depositSuccess ? (
              <div className="py-6 text-center space-y-2">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto animate-bounce" />
                <p className="font-extrabold text-slate-900 text-sm">Deposit Confirmed!</p>
              </div>
            ) : (
              <div className="space-y-3">
                <input
                  type="number"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(Number(e.target.value))}
                  className="w-full bg-sky-50/70 border border-sky-200 rounded-xl p-3 text-sm text-slate-900 font-bold font-mono focus:outline-none focus:border-blue-500"
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowDepositModal(false)}
                    className="flex-1 bg-white hover:bg-sky-50 text-slate-700 font-bold text-xs py-2.5 rounded-xl border border-sky-200"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleConfirmDeposit}
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-2.5 rounded-xl shadow-md shadow-emerald-600/20"
                  >
                    Confirm Deposit
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
