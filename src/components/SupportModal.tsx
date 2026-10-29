import React from 'react';

interface SupportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SupportModal: React.FC<SupportModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-[#1118] backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-150"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="w-[min(480px,100%)] bg-[#fffefa] border border-[#e7e5dc] rounded-[18px] p-6 shadow-2xl">
        <div className="flex items-center justify-between border-b border-[#e7e5dc] pb-3 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#47e802] flex items-center justify-center font-black text-black">
              D
            </div>
            <div>
              <h3 className="font-bold text-base text-[#10120e]">DSP Academy Operations Desk</h3>
              <p className="text-[11px] text-[#73776e]">Direct support for staff and coaches</p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-black font-bold">
            ✕
          </button>
        </div>

        <div className="space-y-3 text-xs">
          <div className="p-3 bg-[#f8f6ef] rounded-xl border border-[#e7e5dc]">
            <strong className="block text-sm text-[#10120e] mb-1">WhatsApp Escalation Line</strong>
            <p className="text-[#55594f] mb-2">
              For urgent payment reconciliation, LMS student login blocks, or hot deal approvals.
            </p>
            <div className="flex items-center gap-2">
              <span className="font-mono font-bold text-xs bg-white px-2.5 py-1 rounded border border-[#e7e5dc]">
                +234 803 291 4482
              </span>
              <a
                href="https://wa.me/2348032914482"
                target="_blank"
                rel="noreferrer"
                className="bg-[#47e802] text-black font-bold px-3 py-1 rounded text-xs hover:brightness-95"
              >
                Open WhatsApp
              </a>
            </div>
          </div>

          <div className="p-3 bg-[#fffefa] rounded-xl border border-[#e7e5dc]">
            <strong className="block text-sm text-[#10120e] mb-1">Internal Operations Email</strong>
            <p className="text-[#55594f]">
              Send bulk cohort roster changes, partner invoices, or curriculum updates to{' '}
              <a href="mailto:support@dspacademy.org" className="text-[#2f9b00] font-bold">
                support@dspacademy.org
              </a>
            </p>
          </div>
        </div>

        <div className="mt-5 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-[#47e802] font-black text-black text-xs rounded-lg hover:brightness-95 cursor-pointer"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
};
