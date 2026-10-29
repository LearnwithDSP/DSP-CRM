import React, { useState } from 'react';
import { LeadOpportunity, ProgramItem } from '../types/crm';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  lead?: LeadOpportunity | null;
  programs: ProgramItem[];
  onConfirmPayment: (payment: {
    studentOrLeadName: string;
    programTitle: string;
    amountNGN: number;
    channel: 'Bank Transfer' | 'Paystack' | 'Flutterwave' | 'Installment' | 'Card';
    transactionRef: string;
    notes?: string;
    opportunityId?: string;
  }) => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  lead,
  programs,
  onConfirmPayment,
}) => {
  const [studentOrLeadName, setStudentOrLeadName] = useState(lead?.fullName || '');
  const [programTitle, setProgramTitle] = useState(lead?.programTitle || programs[0]?.title || 'AI & Automation Coaching');
  const [amountNGN, setAmountNGN] = useState<number>(lead?.quotedPrice || lead?.estimatedValue || 350000);
  const [channel, setChannel] = useState<'Bank Transfer' | 'Paystack' | 'Flutterwave' | 'Installment' | 'Card'>('Bank Transfer');
  const [transactionRef, setTransactionRef] = useState('');
  const [notes, setNotes] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentOrLeadName.trim() || !amountNGN) return;

    onConfirmPayment({
      studentOrLeadName: studentOrLeadName.trim(),
      programTitle,
      amountNGN: Number(amountNGN),
      channel,
      transactionRef: transactionRef.trim() || `GTB-DSP-${Math.floor(100000 + Math.random() * 900000)}`,
      notes: notes.trim(),
      opportunityId: lead?.id,
    });

    onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-[#1118] backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-150"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="w-[min(500px,100%)] bg-[#fffefa] border border-[#e7e5dc] rounded-[18px] p-[23px] shadow-2xl">
        <div className="flex items-center gap-2 mb-1">
          <span className="w-8 h-8 rounded-lg bg-[#e9ffdf] flex items-center justify-center font-bold text-base text-[#2f9b00]">
            ₦
          </span>
          <h2 className="text-xl font-bold text-[#10120e]">Verify & Record Payment</h2>
        </div>
        <p className="text-xs text-[#73776e] mb-4">
          Strict verification required: Only confirmed bank receipts or gateway references unlock enrollment.
        </p>

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div className="flex flex-col gap-1">
            <label className="text-[11px] font-bold text-[#10120e]">Payer / Student Name *</label>
            <input
              value={studentOrLeadName}
              onChange={(e) => setStudentOrLeadName(e.target.value)}
              required
              className="border border-[#e7e5dc] bg-white rounded-lg p-2.5 text-xs outline-none focus:border-[#47e802]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-bold text-[#10120e]">Program</label>
              <select
                value={programTitle}
                onChange={(e) => setProgramTitle(e.target.value)}
                className="border border-[#e7e5dc] bg-white rounded-lg p-2.5 text-xs outline-none"
              >
                {programs.map((p) => (
                  <option key={p.id} value={p.title}>
                    {p.title}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-bold text-[#10120e]">Amount Verified (NGN ₦) *</label>
              <input
                type="number"
                value={amountNGN}
                onChange={(e) => setAmountNGN(Number(e.target.value))}
                required
                className="border border-[#e7e5dc] bg-white rounded-lg p-2.5 text-xs font-bold outline-none"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-bold text-[#10120e]">Payment Channel</label>
              <select
                value={channel}
                onChange={(e: any) => setChannel(e.target.value)}
                className="border border-[#e7e5dc] bg-white rounded-lg p-2.5 text-xs outline-none"
              >
                <option value="Bank Transfer">Bank Transfer (Zenith / GTBank)</option>
                <option value="Paystack">Paystack Online Checkout</option>
                <option value="Flutterwave">Flutterwave Gateway</option>
                <option value="Installment">Installment Agreement</option>
                <option value="Card">Debit / Credit Card</option>
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-bold text-[#10120e]">Transaction Reference / Alert *</label>
              <input
                value={transactionRef}
                onChange={(e) => setTransactionRef(e.target.value)}
                placeholder="e.g. GTB-TRF-98214"
                className="border border-[#e7e5dc] bg-white rounded-lg p-2.5 text-xs outline-none"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[11px] font-bold text-[#10120e]">Verification Notes</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              placeholder="Bank teller, narration, or account statement verified"
              className="border border-[#e7e5dc] bg-white rounded-lg p-2 text-xs outline-none resize-none"
            />
          </div>

          <div className="p-2.5 bg-[#efffe7] border border-[#a1f87d] rounded-lg text-[11px] text-[#2f9b00] font-medium">
            ✓ Verifying this payment will automatically transition the lead to <strong>Won</strong> and grant enrollment status.
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-[#e7e5dc]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-white border border-[#e7e5dc] text-xs font-bold rounded-lg cursor-pointer hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-[#47e802] border-0 text-xs font-black text-black rounded-lg shadow-sm hover:brightness-95 cursor-pointer"
            >
              Authorize & Verify
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
