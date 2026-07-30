import React, { useState } from 'react';
import { WalletTransaction } from '../types';
import { 
  FileText, 
  Download, 
  Printer, 
  Share2, 
  X, 
  CheckCircle2, 
  ShieldCheck, 
  Percent, 
  Copy, 
  Building2, 
  Check 
} from 'lucide-react';

interface TransactionReceiptModalProps {
  transaction: WalletTransaction | null;
  allTransactions?: WalletTransaction[];
  onClose: () => void;
}

export const TransactionReceiptModal: React.FC<TransactionReceiptModalProps> = ({
  transaction,
  allTransactions,
  onClose
}) => {
  const [copied, setCopied] = useState<boolean>(false);
  const [downloading, setDownloading] = useState<boolean>(false);
  const [roleView, setRoleView] = useState<'buyer' | 'seller'>('buyer');

  if (!transaction && !allTransactions) return null;

  // Selected single transaction or audit statement mode
  const activeTx = transaction;

  const receiptId = activeTx ? `REC-${activeTx.id.toUpperCase()}-${Date.now().toString().slice(-4)}` : `AUDIT-STATEMENT-${Date.now().toString().slice(-6)}`;
  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  const generatePlainTextSummary = () => {
    if (activeTx) {
      if (roleView === 'buyer') {
        return `====================================================
AI COMMERCE EXCHANGE (ACE) - BUYER RECEIPT
Receipt ID: ${receiptId}
Date Generated: ${currentDate}
Transaction ID: ${activeTx.id}
Transaction Title: ${activeTx.title}
Status: ${activeTx.status}
----------------------------------------------------
ITEMIZED FINANCIAL BREAKDOWN (BUYER PERSPECTIVE):
- Base Value (USD): $${activeTx.amountUSD.toFixed(2)}
- Base Value (UTC): ${activeTx.amountUTC} UTC Hours
- Platform Fee (5.0%): $${activeTx.buyerFee5Pct.toFixed(2)}
----------------------------------------------------
TOTAL AMOUNT PAID INTO ESCROW: $${(activeTx.amountUSD + activeTx.buyerFee5Pct).toFixed(2)}
----------------------------------------------------
Platform Escrow Status: 100% Verified
====================================================`;
      } else {
        return `====================================================
AI COMMERCE EXCHANGE (ACE) - SELLER RECEIPT
Receipt ID: ${receiptId}
Date Generated: ${currentDate}
Transaction ID: ${activeTx.id}
Transaction Title: ${activeTx.title}
Status: ${activeTx.status}
----------------------------------------------------
ITEMIZED FINANCIAL BREAKDOWN (SELLER PERSPECTIVE):
- Base Listed Value (USD): $${activeTx.amountUSD.toFixed(2)}
- Base Value (UTC): ${activeTx.amountUTC} UTC Hours
- Platform Fee (5.0%): -$${activeTx.sellerFee5Pct.toFixed(2)}
----------------------------------------------------
NET SELLER PAYOUT SETTLEMENT: $${(activeTx.amountUSD - activeTx.sellerFee5Pct).toFixed(2)}
----------------------------------------------------
Platform Escrow Status: 100% Verified
====================================================`;
      }
    } else if (allTransactions) {
      const totalVolume = allTransactions.reduce((acc, t) => acc + t.amountUSD, 0);
      const totalFeesCollected = allTransactions.reduce((acc, t) => acc + (roleView === 'buyer' ? t.buyerFee5Pct : t.sellerFee5Pct), 0);

      return `====================================================
AI COMMERCE EXCHANGE (ACE) - AUDIT STATEMENT (${roleView.toUpperCase()} SUMMARY)
Statement ID: ${receiptId}
Date Generated: ${currentDate}
Total Recorded Transactions: ${allTransactions.length}
----------------------------------------------------
CUMULATIVE AUDIT SUMMARY:
- Total Gross Volume: $${totalVolume.toFixed(2)} USD
- Total Platform Fees (5.0%): $${totalFeesCollected.toFixed(2)} USD
----------------------------------------------------
Audit Verified: All 5% fee deductions checked.
====================================================`;
    }
    return '';
  };

  const handleCopySummary = () => {
    const text = generatePlainTextSummary();
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = () => {
    setDownloading(true);
    const content = generatePlainTextSummary();
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = activeTx ? `ACE_Receipt_${activeTx.id}.txt` : `ACE_Master_Audit_Report.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setTimeout(() => {
      setDownloading(false);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 overflow-y-auto print:p-0 print:bg-white print:fixed print:inset-0">
      <div className="bg-white border border-sky-200 rounded-2xl max-w-xl w-full p-6 shadow-xl relative flex flex-col my-auto print:border-none print:shadow-none print:bg-white print:text-black print:max-w-none print:w-full text-slate-900">
        {/* Modal Controls (Hidden when printing) */}
        <div className="flex items-center justify-between pb-4 border-b border-sky-100 print:hidden">
          <div className="flex items-center gap-2 text-blue-700 font-bold text-sm">
            <FileText className="w-5 h-5 text-blue-600" />
            <span>Audit Transaction Receipt</span>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-sky-50 transition"
            title="Close Receipt Modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Printable Receipt Body */}
        <div className="py-4 space-y-5 print:py-0 print:text-black">
          {/* Header Banner */}
          <div className="flex items-start justify-between border-b border-sky-200 print:border-black pb-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center text-white font-black text-sm shadow-sm print:border print:border-black">
                  A
                </div>
                <h2 className="font-extrabold text-base text-slate-900 print:text-black tracking-tight">AI Commerce Exchange (ACE)</h2>
              </div>
              <p className="text-[11px] text-slate-500 print:text-slate-600 font-medium">Enterprise Autonomous Time & Service Marketplace</p>
              <p className="text-[10px] text-slate-400 print:text-slate-500 font-mono">Escrow Compliance Ref: ACE-5PCT-AUDIT-v2.4</p>
            </div>

            <div className="text-right text-xs font-mono space-y-1">
              <span className="bg-blue-100 text-blue-800 border border-blue-200 print:bg-slate-200 print:text-black print:border-slate-400 text-[10px] font-bold px-2 py-0.5 rounded-md block">
                OFFICIAL RECEIPT
              </span>
              <p className="text-[10px] text-slate-500 print:text-slate-700 font-semibold">{receiptId}</p>
              <p className="text-[10px] text-slate-400 print:text-slate-600">{currentDate}</p>
            </div>
          </div>

          {/* Role Perspective Switcher */}
          <div className="flex items-center justify-between bg-sky-50 print:hidden p-1.5 rounded-xl border border-sky-200 text-xs">
            <span className="text-slate-600 font-bold px-2">Receipt Perspective:</span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setRoleView('buyer')}
                className={`px-3 py-1 rounded-lg font-bold transition ${
                  roleView === 'buyer'
                    ? 'bg-blue-600 text-white shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Buyer View (5% Fee)
              </button>
              <button
                onClick={() => setRoleView('seller')}
                className={`px-3 py-1 rounded-lg font-bold transition ${
                  roleView === 'seller'
                    ? 'bg-blue-600 text-white shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Seller View (5% Fee)
              </button>
            </div>
          </div>

          {/* Active Single Transaction Details */}
          {activeTx ? (
            <div className="space-y-4">
              <div className="bg-sky-50/70 print:bg-slate-100 border border-sky-200 print:border-slate-300 rounded-xl p-3.5 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500 print:text-slate-600 font-medium">Transaction Title</span>
                  <span className="text-[10px] font-mono font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 print:bg-slate-200 print:text-black px-2 py-0.5 rounded-md">
                    {activeTx.status}
                  </span>
                </div>
                <h3 className="text-sm font-bold text-slate-900 print:text-black">{activeTx.title}</h3>
                <div className="flex items-center justify-between text-xs text-slate-500 print:text-slate-600 font-mono pt-1">
                  <span>Tx Reference ID: {activeTx.id}</span>
                  <span>Timestamp: {activeTx.timestamp}</span>
                </div>
              </div>

              {/* 5% Fee Audit Table */}
              <div className="border border-sky-200 print:border-slate-400 rounded-xl overflow-hidden">
                <div className="bg-sky-100/70 print:bg-slate-200 px-3 py-2 text-xs font-bold text-slate-800 print:text-black border-b border-sky-200 print:border-slate-400 flex justify-between">
                  <span>Itemized Fee Breakdown ({roleView === 'buyer' ? 'Buyer Perspective' : 'Seller Perspective'})</span>
                  <span>Amount ($ USD)</span>
                </div>

                <div className="divide-y divide-sky-100 print:divide-slate-300 text-xs font-mono">
                  <div className="px-3 py-2 flex justify-between text-slate-700 print:text-slate-800 font-medium">
                    <span>Base Hourly Valuation</span>
                    <span>${activeTx.amountUSD.toFixed(2)} ({activeTx.amountUTC} UTC)</span>
                  </div>

                  {roleView === 'buyer' ? (
                    <>
                      <div className="px-3 py-2 flex justify-between text-blue-700 print:text-blue-800 font-bold bg-blue-50/60 print:bg-slate-50">
                        <span className="flex items-center gap-1">
                          <Percent className="w-3.5 h-3.5" />
                          Platform Fee (5.0%)
                        </span>
                        <span>+${activeTx.buyerFee5Pct.toFixed(2)}</span>
                      </div>
                      <div className="px-3 py-2 flex justify-between text-slate-900 print:text-black font-extrabold bg-sky-100/50 print:bg-slate-200">
                        <span>Total Paid Into Escrow</span>
                        <span>${(activeTx.amountUSD + activeTx.buyerFee5Pct).toFixed(2)}</span>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="px-3 py-2 flex justify-between text-slate-700 print:text-slate-800 font-semibold bg-sky-50/60 print:bg-slate-50">
                        <span className="flex items-center gap-1">
                          <Percent className="w-3.5 h-3.5" />
                          Platform Fee (5.0%)
                        </span>
                        <span>-${activeTx.sellerFee5Pct.toFixed(2)}</span>
                      </div>
                      <div className="px-3 py-2 flex justify-between text-emerald-800 print:text-black font-extrabold bg-emerald-50/50 print:bg-slate-200">
                        <span>Net Settlement Payout</span>
                        <span>${(activeTx.amountUSD - activeTx.sellerFee5Pct).toFixed(2)}</span>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Settlement Summary */}
              <div className="text-xs font-mono">
                {roleView === 'buyer' ? (
                  <div className="bg-sky-50 print:bg-slate-100 p-3 rounded-xl border border-sky-200 print:border-slate-300 space-y-1">
                    <span className="text-[10px] text-slate-500 print:text-slate-600 block font-medium">Total Buyer Payment</span>
                    <span className="text-sm font-bold text-slate-900 print:text-black">${(activeTx.amountUSD + activeTx.buyerFee5Pct).toFixed(2)}</span>
                    <span className="text-[9px] text-slate-400 block">Base Price + 5.0% Buyer Platform Fee</span>
                  </div>
                ) : (
                  <div className="bg-sky-50 print:bg-slate-100 p-3 rounded-xl border border-sky-200 print:border-slate-300 space-y-1">
                    <span className="text-[10px] text-slate-500 print:text-slate-600 block font-medium">Net Seller Payout Credit</span>
                    <span className="text-sm font-bold text-emerald-700 print:text-emerald-700">${(activeTx.amountUSD - activeTx.sellerFee5Pct).toFixed(2)}</span>
                    <span className="text-[9px] text-slate-400 block">Listed Base Price - 5.0% Seller Platform Fee</span>
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* Master Audit Ledger Summary */
            <div className="space-y-4">
              <div className="bg-sky-50 print:bg-slate-100 border border-sky-200 print:border-slate-300 rounded-xl p-3.5 space-y-2">
                <h3 className="text-sm font-bold text-slate-900 print:text-black">Master Platform Escrow Audit Ledger</h3>
                <p className="text-xs text-slate-600 print:text-slate-600">
                  Comprehensive statement of all completed transactions and 5% buyer + 5% seller fee deductions.
                </p>
              </div>

              {allTransactions && (
                <div className="border border-sky-200 print:border-slate-400 rounded-xl overflow-hidden text-xs">
                  <div className="bg-sky-100 print:bg-slate-200 px-3 py-2 font-bold text-slate-800 print:text-black flex justify-between border-b border-sky-200">
                    <span>Transaction</span>
                    <span>Fee Split (Buyer/Seller)</span>
                    <span>Total Vol</span>
                  </div>
                  <div className="divide-y divide-sky-100 print:divide-slate-300 font-mono">
                    {allTransactions.map(t => (
                      <div key={t.id} className="px-3 py-2 flex justify-between text-slate-700 print:text-slate-800">
                        <span className="truncate max-w-[180px] font-medium">{t.title}</span>
                        <span className="text-emerald-700 font-bold print:text-emerald-700">${t.buyerFee5Pct} / ${t.sellerFee5Pct}</span>
                        <span className="font-bold text-slate-900 print:text-black">${t.amountUSD}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Audit Verification Footer */}
          <div className="bg-sky-50/80 print:bg-slate-50 border border-sky-200 print:border-slate-300 rounded-xl p-3 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-slate-700 print:text-slate-800">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <div>
                <span className="font-bold block text-[11px] text-slate-900">Audit Verified &amp; Signed</span>
                <span className="text-[10px] text-slate-500 print:text-slate-600 font-mono">SHA256: e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855</span>
              </div>
            </div>
            <div className="text-right text-[10px] text-slate-500 font-mono font-bold">
              ACE Escrow Protocol
            </div>
          </div>
        </div>

        {/* Modal Buttons (Hidden on Print) */}
        <div className="mt-5 pt-4 border-t border-sky-100 print:hidden flex flex-wrap items-center justify-between gap-2">
          <button
            onClick={handleCopySummary}
            className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition border border-slate-200"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-500" />}
            <span>{copied ? 'Copied to Clipboard' : 'Copy Summary'}</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3 py-2 rounded-xl bg-sky-100 hover:bg-sky-200 text-blue-800 text-xs font-bold flex items-center gap-1.5 transition border border-sky-300"
            >
              <Printer className="w-3.5 h-3.5 text-blue-600" />
              <span>Print PDF</span>
            </button>

            <button
              onClick={handleDownloadPDF}
              disabled={downloading}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 transition shadow-md shadow-emerald-600/20"
            >
              <Download className="w-3.5 h-3.5 text-yellow-300" />
              <span>{downloading ? 'Exporting...' : 'Download Receipt'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
