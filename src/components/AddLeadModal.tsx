import React, { useState } from 'react';
import { LeadSource, QualificationData } from '../types/crm';
import { StaffProfile } from '../types/crm';

interface AddLeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  staffList: StaffProfile[];
  onSaveLead: (lead: {
    fullName: string;
    phone: string;
    email?: string;
    source: LeadSource;
    programTitle: string;
    ownerName?: string;
    needNotes?: string;
    estimatedValue?: number;
    qualification?: QualificationData;
  }) => void;
}

export const AddLeadModal: React.FC<AddLeadModalProps> = ({
  isOpen,
  onClose,
  staffList,
  onSaveLead,
}) => {
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [source, setSource] = useState<LeadSource>('Website');
  const [programTitle, setProgramTitle] = useState('AI & Automation Coaching');
  const [ownerName, setOwnerName] = useState('Chika');
  const [needNotes, setNeedNotes] = useState('');
  const [budgetReady, setBudgetReady] = useState<'Full payment ready' | 'Installment required' | 'Need employer sponsorship' | 'Undecided'>('Full payment ready');
  const [urgency, setUrgency] = useState<'Immediate (this week)' | 'Next 30 days' | 'Exploring options'>('Immediate (this week)');
  const [showAdvancedQual, setShowAdvancedQual] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !phone.trim()) return;

    let defaultPrice = 350000;
    if (programTitle === 'Digital Marketing') defaultPrice = 250000;
    if (programTitle === 'SEO Mastery') defaultPrice = 200000;
    if (programTitle === 'High-Ticket Sales Masterclass') defaultPrice = 450000;

    onSaveLead({
      fullName: fullName.trim(),
      phone: phone.trim(),
      email: email.trim() || undefined,
      source,
      programTitle,
      ownerName: ownerName === 'Unassigned' ? 'Unassigned' : ownerName,
      needNotes: needNotes.trim(),
      estimatedValue: defaultPrice,
      qualification: {
        budgetReady,
        urgency,
        goal: needNotes.trim(),
        skillLevel: 'Intermediate',
      },
    });

    // Reset
    setFullName('');
    setPhone('');
    setEmail('');
    setNeedNotes('');
    onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-[#1118] backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-150"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="w-[min(540px,100%)] bg-[#fffefa] border border-[#e7e5dc] rounded-[18px] p-[23px] shadow-[0_25px_80px_#0003] max-h-[90vh] overflow-y-auto">
        <h2 className="m-[0_0_5px] text-[20px] font-bold text-[#10120e] tracking-tight">
          Add a new lead
        </h2>
        <p className="m-[0_0_18px] text-[#73776e] text-[12px]">
          Capture the contact and give the next action a clear owner.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold text-[#10120e]">Full name *</label>
              <input
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                placeholder="Prospect name"
                className="border border-[#e7e5dc] bg-white rounded-[9px] p-[10px] outline-none text-[13px] focus:border-[#47e802] focus:ring-2 focus:ring-[#47e802]/20"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold text-[#10120e]">Phone / WhatsApp *</label>
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                placeholder="+234…"
                className="border border-[#e7e5dc] bg-white rounded-[9px] p-[10px] outline-none text-[13px] focus:border-[#47e802] focus:ring-2 focus:ring-[#47e802]/20"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold text-[#10120e]">Email</label>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                placeholder="name@example.com"
                className="border border-[#e7e5dc] bg-white rounded-[9px] p-[10px] outline-none text-[13px] focus:border-[#47e802] focus:ring-2 focus:ring-[#47e802]/20"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold text-[#10120e]">Lead source</label>
              <select
                value={source}
                onChange={(e) => setSource(e.target.value as LeadSource)}
                className="border border-[#e7e5dc] bg-white rounded-[9px] p-[10px] outline-none text-[13px] focus:border-[#47e802] focus:ring-2 focus:ring-[#47e802]/20"
              >
                <option value="Website">Website</option>
                <option value="WhatsApp">WhatsApp</option>
                <option value="Facebook">Facebook</option>
                <option value="Instagram">Instagram</option>
                <option value="Google">Google</option>
                <option value="Masterclass">Masterclass</option>
                <option value="Referral">Referral</option>
                <option value="Manual">Manual</option>
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold text-[#10120e]">Program interest</label>
              <select
                value={programTitle}
                onChange={(e) => setProgramTitle(e.target.value)}
                className="border border-[#e7e5dc] bg-white rounded-[9px] p-[10px] outline-none text-[13px] focus:border-[#47e802] focus:ring-2 focus:ring-[#47e802]/20"
              >
                <option>AI & Automation Coaching</option>
                <option>Digital Marketing</option>
                <option>SEO Mastery</option>
                <option>High-Ticket Sales Masterclass</option>
                <option>Other / not sure yet</option>
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold text-[#10120e]">Assign to</label>
              <select
                value={ownerName}
                onChange={(e) => setOwnerName(e.target.value)}
                className="border border-[#e7e5dc] bg-white rounded-[9px] p-[10px] outline-none text-[13px] focus:border-[#47e802] focus:ring-2 focus:ring-[#47e802]/20"
              >
                <option value="Unassigned">Unassigned</option>
                <option value="Chika">Chika Nwosu</option>
                <option value="Daniel">Daniel Okafor</option>
                <option value="Amaka M.">Amaka M.</option>
                <option value="Patrick Ezeji">Patrick Ezeji</option>
              </select>
            </div>

            <div className="col-span-1 sm:col-span-2 flex flex-col gap-1.5">
              <label className="text-[11px] font-bold text-[#10120e]">
                What does the prospect need?
              </label>
              <textarea
                value={needNotes}
                onChange={(e) => setNeedNotes(e.target.value)}
                rows={2}
                placeholder="Goal, challenge, urgency or next step"
                className="border border-[#e7e5dc] bg-white rounded-[9px] p-[10px] outline-none text-[13px] focus:border-[#47e802] focus:ring-2 focus:ring-[#47e802]/20 resize-none"
              />
            </div>
          </div>

          {/* Quick Qualification Toggle */}
          <div className="border-t border-[#e7e5dc] pt-3">
            <button
              type="button"
              onClick={() => setShowAdvancedQual(!showAdvancedQual)}
              className="text-xs text-[#2f9b00] font-bold flex items-center gap-1 hover:underline cursor-pointer"
            >
              <span>{showAdvancedQual ? '▲ Hide' : '▼ Add'} Lead Qualification Scoring</span>
            </button>

            {showAdvancedQual && (
              <div className="mt-3 p-3 bg-[#f8f6ef] rounded-xl grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block text-[11px] font-bold mb-1 text-[#55594f]">
                    Budget Readiness
                  </label>
                  <select
                    value={budgetReady}
                    onChange={(e: any) => setBudgetReady(e.target.value)}
                    className="w-full p-2 bg-white border border-[#e7e5dc] rounded-md"
                  >
                    <option value="Full payment ready">Full payment ready (High)</option>
                    <option value="Installment required">Installment required</option>
                    <option value="Need employer sponsorship">Employer sponsorship</option>
                    <option value="Undecided">Undecided</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold mb-1 text-[#55594f]">
                    Urgency to Start
                  </label>
                  <select
                    value={urgency}
                    onChange={(e: any) => setUrgency(e.target.value)}
                    className="w-full p-2 bg-white border border-[#e7e5dc] rounded-md"
                  >
                    <option value="Immediate (this week)">Immediate (this week)</option>
                    <option value="Next 30 days">Next 30 days</option>
                    <option value="Exploring options">Exploring options</option>
                  </select>
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-white border border-[#e7e5dc] text-[13px] font-bold text-[#10120e] rounded-[10px] hover:bg-gray-50 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-[#47e802] border-0 text-[13px] font-black text-black rounded-[10px] shadow-[0_3px_10px_#47e80225] hover:brightness-95 cursor-pointer"
            >
              Save lead
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
