import React from 'react';
import { X, ShieldCheck, Scale, FileText, CheckCircle2, Percent, Repeat, Bot, DollarSign, Lock } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface TermsAndConditionsModalProps {
  onClose: () => void;
}

export const TermsAndConditionsModal: React.FC<TermsAndConditionsModalProps> = ({ onClose }) => {
  const { t, selectedLanguage } = useLanguage();

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-md flex items-center justify-center p-3 sm:p-5">
      <div className="bg-white border border-sky-200 rounded-2xl max-w-2xl w-full p-5 sm:p-6 shadow-2xl relative flex flex-col max-h-[90vh] text-slate-900">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-sky-100 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center border border-blue-200 shadow-sm">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-extrabold text-slate-900 text-base tracking-tight flex items-center gap-1.5">
                {t('terms_title', 'Terms & Conditions of Use')}
                <span className="text-[10px] bg-blue-100 text-blue-800 px-2 py-0.5 rounded-md font-mono font-bold">
                  {selectedLanguage.flag} {selectedLanguage.name}
                </span>
              </h2>
              <p className="text-xs text-slate-500 font-medium">AI Commerce Exchange (ACE) Operating Protocol</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-sky-50 border border-sky-200 text-slate-500 hover:text-slate-900 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Terms Content Body */}
        <div className="flex-1 overflow-y-auto py-4 space-y-4 text-xs leading-relaxed text-slate-700 pr-1">
          {/* Section 1 */}
          <div className="bg-sky-50/70 border border-sky-200 rounded-xl p-4 space-y-1.5">
            <h3 className="font-extrabold text-blue-900 text-sm flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-blue-600" />
              1. Acceptance & Protocol Scope
            </h3>
            <p>
              By accessing or using the AI Commerce Exchange (ACE) platform, mobile application, or API interfaces, you agree to be bound by these Terms & Conditions of Use. ACE operates an autonomous, peer-to-peer and agent-to-agent (A2A) commerce protocol for trading hourly services, travel, hotel suites, jet charter hours, and high-value consulting assets.
            </p>
          </div>

          {/* Section 2: Platform Fee Confidentiality Policy */}
          <div className="bg-emerald-50/60 border border-emerald-200 rounded-xl p-4 space-y-2.5 shadow-xs">
            <h3 className="font-extrabold text-emerald-950 text-sm flex items-center gap-1.5">
              <Lock className="w-4 h-4 text-emerald-600 shrink-0" />
              2. Platform Fee Confidentiality Policy
            </h3>
            <p className="text-slate-800 font-medium leading-relaxed">
              To maintain commercial confidentiality and ensure fair and independent transactions, the platform shall operate a confidential dual-fee model.
            </p>
            <ul className="space-y-2 text-slate-700 font-normal">
              <li className="pl-3 border-l-2 border-emerald-400">
                <strong className="text-slate-900 font-bold">Buyer Confidentiality:</strong> Buyers shall only be able to view the fees, commissions, service charges, taxes, or subscriptions that apply to their own transactions. Buyers shall not have access to any information regarding the seller's platform fees, commission rates, revenue-sharing arrangements, or financial obligations.
              </li>
              <li className="pl-3 border-l-2 border-emerald-400">
                <strong className="text-slate-900 font-bold">Seller Confidentiality:</strong> Sellers shall only be able to view the fees, commissions, service charges, taxes, subscriptions, or deductions applicable to their own account and transactions. Sellers shall not have access to any information regarding the buyer's platform fees, service charges, commissions, payment processing costs, or financial obligations.
              </li>
              <li className="pl-3 border-l-2 border-emerald-400">
                <strong className="text-slate-900 font-bold">Independent Pricing:</strong> The platform shall calculate buyer and seller charges independently. The percentage, fixed amount, pricing formula, discounts, negotiated rates, promotional incentives, and commission structures applied to one party shall remain confidential and shall not be disclosed to the other party.
              </li>
              <li className="pl-3 border-l-2 border-emerald-400">
                <strong className="text-slate-900 font-bold">Transaction Transparency:</strong> Each party shall receive a detailed financial breakdown relevant only to their own account, including invoices, receipts, statements, taxes, and payment records. Information relating to the other party's fees, commissions, margins, or commercial agreements shall be omitted.
              </li>
              <li className="pl-3 border-l-2 border-emerald-400">
                <strong className="text-slate-900 font-bold">Administrative Access:</strong> Only authorised platform administrators, finance personnel, compliance officers, and AI agents acting under appropriate access controls shall be permitted to view both buyer and seller fee structures for accounting, auditing, fraud prevention, dispute resolution, taxation, and regulatory compliance.
              </li>
              <li className="pl-3 border-l-2 border-emerald-400">
                <strong className="text-slate-900 font-bold">Secure Data Segregation:</strong> The platform shall implement role-based access control (RBAC), attribute-based access control (ABAC), encryption, secure APIs, and audit logging to ensure that buyer financial data and seller financial data remain logically and physically segregated where appropriate.
              </li>
              <li className="pl-3 border-l-2 border-emerald-400">
                <strong className="text-slate-900 font-bold">AI Agent Compliance:</strong> Agentic AI services operating on behalf of buyers or sellers shall only access the financial information authorised for that specific user role. AI agents shall not disclose, infer, estimate, or reveal the commission percentages, platform fees, profit margins, negotiated rates, or commercial arrangements of the opposing party.
              </li>
            </ul>
            <p className="text-[11px] text-slate-500 italic pt-1 border-t border-emerald-200">
              This confidentiality policy shall apply across all B2B, B2C, C2B, C2C, A2A, A2C, and C2A transactions, including auctions, bidding, bookings, rentals, subscriptions, marketplace sales, hourly services, transferable-hour trading, digital products, physical goods, travel, hospitality, logistics, and all future platform services.
            </p>
          </div>

          {/* Section 3 */}
          <div className="bg-white border border-sky-200 rounded-xl p-4 space-y-2 shadow-xs">
            <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-1.5">
              <Percent className="w-4 h-4 text-emerald-600" />
              3. Platform Escrow Mechanism
            </h3>
            <p>
              All financial transactions executed on ACE are protected by the platform's multi-signature Escrow protocol. Funds remain securely locked in Escrow until the buyer confirms service completion or the UTC scheduled time slot elapses without dispute.
            </p>
          </div>

          {/* Section 4 */}
          <div className="bg-white border border-sky-200 rounded-xl p-4 space-y-2 shadow-xs">
            <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-1.5">
              <Repeat className="w-4 h-4 text-blue-600" />
              4. Universal Time Credit (UTC) Standard
            </h3>
            <p>
              Universal Time Credits (UTC) represent standardized units of benchmark service time across the ACE ecosystem. UTC credits held in user wallets are non-perishable and transferable subject to wallet verification.
            </p>
          </div>

          {/* Section 5 */}
          <div className="bg-white border border-sky-200 rounded-xl p-4 space-y-2 shadow-xs">
            <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-1.5">
              <Bot className="w-4 h-4 text-purple-600" />
              5. Autonomous AI-to-AI (A2A) Bidding Authorization
            </h3>
            <p>
              When configuring and enabling an AI Trading Agent in the A2A Trading Console, you grant explicit authorization for your automated agent to place bids, negotiate prices, and execute binding transactions up to your specified maximum price caps in strict compliance with Role-Based Fee Isolation.
            </p>
          </div>

          {/* Section 6 */}
          <div className="bg-white border border-sky-200 rounded-xl p-4 space-y-2 shadow-xs">
            <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-1.5">
              <DollarSign className="w-4 h-4 text-emerald-600" />
              6. Publishing & Seller Fulfillment Obligations
            </h3>
            <p>
              Sellers advertising assets guarantee accurate descriptions and service availability. Failure to deliver services results in full escrow refund to the buyer.
            </p>
          </div>

          {/* Section 7 */}
          <div className="bg-white border border-sky-200 rounded-xl p-4 space-y-2 shadow-xs">
            <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-blue-600" />
              7. Audit Statements & Role-Segregated Receipts
            </h3>
            <p>
              Itemized role-segregated audit reports and transaction receipts generated by ACE serve as legally binding records of trade. Omitted opposing party commission rates and fee structures are protected under Section 2.
            </p>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="pt-3 border-t border-sky-100 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-mono">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>ACE Protocol Terms v3.0 • Confidentiality Amendment Included</span>
          </div>
          <button
            onClick={onClose}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-5 py-2 rounded-xl text-xs transition shadow-md shadow-blue-500/20"
          >
            I Understand &amp; Agree
          </button>
        </div>
      </div>
    </div>
  );
};
