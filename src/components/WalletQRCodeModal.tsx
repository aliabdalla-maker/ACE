import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { QrCode, X, Copy, Check, Download, Share2, ShieldCheck, Repeat, DollarSign } from 'lucide-react';

interface WalletQRCodeModalProps {
  walletAddress?: string;
  utcBalance: number;
  cashBalanceUSD: number;
  onClose: () => void;
}

export const WalletQRCodeModal: React.FC<WalletQRCodeModalProps> = ({
  walletAddress = "gaace1q9x0z87kfa3l2p9u5c7v6m4n1w8e2r3t4y5u6",
  utcBalance,
  cashBalanceUSD,
  onClose
}) => {
  const [assetType, setAssetType] = useState<'UTC' | 'USD'>('UTC');
  const [requestAmount, setRequestAmount] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);
  const [downloading, setDownloading] = useState<boolean>(false);

  // Payload for QR Code
  const qrPayload = JSON.stringify({
    protocol: "ACE-ESCROW-v2",
    address: walletAddress,
    asset: assetType,
    amount: requestAmount ? Number(requestAmount) : undefined,
    timestamp: Date.now()
  });

  const formattedDisplayString = `${walletAddress}?asset=${assetType}${requestAmount ? `&amount=${requestAmount}` : ''}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(formattedDisplayString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadQR = () => {
    setDownloading(true);
    const svgElement = document.getElementById('ace-wallet-qrcode');
    if (!svgElement) return;

    const svgData = new XMLSerializer().serializeToString(svgElement);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      canvas.width = img.width + 40;
      canvas.height = img.height + 40;
      if (ctx) {
        ctx.fillStyle = '#090d16';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 20, 20);
      }
      const pngFile = canvas.toDataURL('image/png');
      const downloadLink = document.createElement('a');
      downloadLink.download = `ACE_Wallet_QR_${assetType}.png`;
      downloadLink.href = pngFile;
      downloadLink.click();
      setDownloading(false);
    };

    img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-white border border-sky-200 rounded-2xl max-w-sm w-full p-6 shadow-xl space-y-5 relative text-slate-900">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b border-sky-100">
          <div className="flex items-center gap-2 text-slate-900 font-extrabold text-sm">
            <div className="w-7 h-7 rounded-lg bg-sky-100 border border-sky-200 flex items-center justify-center text-blue-600">
              <QrCode className="w-4 h-4" />
            </div>
            <div>
              <h3>Receive Payments</h3>
              <p className="text-[10px] text-slate-500 font-medium">Share QR code to receive UTC or Cash</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 bg-sky-50 border border-sky-200 p-1.5 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Asset Selector Tabs */}
        <div className="flex bg-sky-50/70 p-1 rounded-xl border border-sky-200 text-xs font-semibold">
          <button
            onClick={() => setAssetType('UTC')}
            className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-1.5 transition ${
              assetType === 'UTC'
                ? 'bg-blue-600 text-white font-bold shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Repeat className="w-3.5 h-3.5" />
            <span>UTC Time Credits</span>
          </button>

          <button
            onClick={() => setAssetType('USD')}
            className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-1.5 transition ${
              assetType === 'USD'
                ? 'bg-blue-600 text-white font-bold shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <DollarSign className="w-3.5 h-3.5" />
            <span>USD Cash</span>
          </button>
        </div>

        {/* Optional Amount Request Input */}
        <div className="space-y-1">
          <label className="text-[11px] font-bold text-slate-800 flex items-center justify-between">
            <span>Optional Requested Amount</span>
            <span className="text-[10px] text-slate-500 font-mono">
              Current: {assetType === 'UTC' ? `${utcBalance} UTC` : `$${cashBalanceUSD}`}
            </span>
          </label>
          <div className="relative">
            <input
              type="number"
              min="0"
              step={assetType === 'UTC' ? '0.1' : '10'}
              placeholder={assetType === 'UTC' ? 'e.g. 5.0 UTC Hours' : 'e.g. 250 USD'}
              value={requestAmount}
              onChange={(e) => setRequestAmount(e.target.value)}
              className="w-full bg-sky-50/70 border border-sky-200 rounded-xl px-3 py-2 text-xs text-slate-900 font-mono focus:outline-none focus:border-blue-500 font-bold"
            />
            <span className="absolute right-3 top-2 text-xs font-mono font-extrabold text-blue-700">
              {assetType}
            </span>
          </div>
        </div>

        {/* QR Code Container */}
        <div className="bg-sky-50/80 border border-sky-200 rounded-2xl p-5 flex flex-col items-center justify-center space-y-3 relative group">
          <div className="p-3 bg-white rounded-xl shadow-md border-2 border-sky-200">
            <QRCodeSVG
              id="ace-wallet-qrcode"
              value={qrPayload}
              size={180}
              level="H"
              includeMargin={true}
              fgColor="#020617"
              bgColor="#ffffff"
            />
          </div>

          <div className="text-center space-y-0.5">
            <div className="flex items-center justify-center gap-1.5 text-xs font-mono font-extrabold text-blue-700">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
              <span>ACE Escrow Verified</span>
            </div>
            <p className="text-[10px] text-slate-500 font-mono truncate max-w-[240px]">
              {walletAddress}
            </p>
          </div>
        </div>

        {/* Address String Copy Box */}
        <div className="bg-sky-50/70 border border-sky-200 rounded-xl p-2.5 flex items-center justify-between text-xs font-mono">
          <span className="truncate text-slate-700 font-semibold text-[11px] max-w-[220px]">
            {formattedDisplayString}
          </span>
          <button
            onClick={handleCopy}
            className="p-1.5 rounded-lg bg-white border border-sky-200 hover:bg-sky-100 text-blue-700 transition shrink-0 ml-2"
            title="Copy Wallet Payment URI"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-blue-600" />}
          </button>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          <button
            onClick={handleCopy}
            className="py-2.5 rounded-xl bg-sky-50 hover:bg-sky-100 text-blue-900 border border-sky-200 text-xs font-bold flex items-center justify-center gap-1.5 transition"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5 text-blue-600" />}
            <span>{copied ? 'Copied URI' : 'Copy Address'}</span>
          </button>

          <button
            onClick={handleDownloadQR}
            disabled={downloading}
            className="py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition shadow-md shadow-emerald-600/20"
          >
            <Download className="w-3.5 h-3.5 text-yellow-300" />
            <span>{downloading ? 'Saving...' : 'Save QR Image'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
