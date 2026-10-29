import React, { useState } from 'react';
import { LeadOpportunity, PipelineStage } from '../types/crm';

interface LeadDetailModalProps {
  lead: LeadOpportunity | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateStage: (leadId: string, stage: PipelineStage, reason?: string) => void;
  onOpenPayment: (lead: LeadOpportunity) => void;
  onAddTask: (taskTitle: string, contactName: string) => void;
  onScheduleSession: (lead: LeadOpportunity) => void;
}

const ALL_STAGES: PipelineStage[] = [
  'New Lead',
  'Contact Attempted',
  'Contact Established',
  'Qualified',
  'Offer Presented',
  'Follow-up / Decision Pending',
  'Payment Pending',
  'Won',
  'Lost',
  'Nurture',
];

export const LeadDetailModal: React.FC<LeadDetailModalProps> = ({
  lead,
  isOpen,
  onClose,
  onUpdateStage,
  onOpenPayment,
  onAddTask,
  onScheduleSession,
}) => {
  const [selectedStage, setSelectedStage] = useState<PipelineStage>(lead?.stage || 'New Lead');
  const [lossReason, setLossReason] = useState('');
  const [showLossInput, setShowLossInput] = useState(false);
  const [noteText, setNoteText] = useState('');

  if (!isOpen || !lead) return null;

  const initials = lead.fullName
    .split(/\s+/)
    .slice(0, 2)
    .map((x) => x[0])
    .join('')
    .toUpperCase();

  const handleStageChange = (newStage: PipelineStage) => {
    setSelectedStage(newStage);
    if (newStage === 'Lost') {
      setShowLossInput(true);
    } else {
      setShowLossInput(false);
      onUpdateStage(lead.id, newStage);
    }
  };

  const handleConfirmLoss = () => {
    if (!lossReason.trim()) return;
    onUpdateStage(lead.id, 'Lost', lossReason.trim());
    setShowLossInput(false);
  };

  return (
    <div
      className="fixed inset-0 bg-[#1118] backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-150"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="w-[min(650px,100%)] bg-[#fffefa] border border-[#e7e5dc] rounded-[18px] p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-[#e7e5dc] pb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-[#e2e5d8] flex items-center justify-center font-black text-base text-[#10120e]">
              {initials}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-[#10120e]">{lead.fullName}</h2>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-[#e9ffdf] text-[#2f9b00]">
                  Score: {lead.leadScore}/100
                </span>
              </div>
              <p className="text-xs text-[#73776e]">
                {lead.phone} {lead.email && `· ${lead.email}`}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full border border-[#e7e5dc] flex items-center justify-center text-sm font-bold hover:bg-gray-100 cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Lead Details Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-4 p-3 bg-[#f8f6ef] rounded-xl text-xs">
          <div>
            <span className="text-[10px] uppercase font-bold text-[#73776e] block">Program</span>
            <span className="font-semibold text-[#10120e]">{lead.programTitle}</span>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-[#73776e] block">Source</span>
            <span className="font-semibold text-[#10120e]">{lead.source}</span>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-[#73776e] block">Owner</span>
            <span className="font-semibold text-[#10120e]">{lead.ownerName}</span>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-[#73776e] block">Est. Value</span>
            <span className="font-bold text-[#2f9b00]">₦{lead.estimatedValue.toLocaleString()}</span>
          </div>
        </div>

        {/* Stage Progress Bar / Selector */}
        <div className="my-4">
          <label className="text-[11px] font-bold text-[#10120e] block mb-2">
            Opportunity Stage Transition
          </label>
          <div className="flex flex-wrap gap-1.5">
            {ALL_STAGES.map((st) => {
              const isActive = (selectedStage || lead.stage) === st;
              return (
                <button
                  key={st}
                  type="button"
                  onClick={() => handleStageChange(st)}
                  className={`text-xs px-2.5 py-1.5 rounded-lg border transition-all cursor-pointer font-medium ${
                    isActive
                      ? 'bg-[#47e802] border-[#47e802] text-black font-extrabold shadow-sm'
                      : 'bg-white border-[#e7e5dc] text-[#55594f] hover:bg-[#eeede5]'
                  }`}
                >
                  {st}
                </button>
              );
            })}
          </div>

          {/* Loss Reason Prompt */}
          {showLossInput && (
            <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-xl space-y-2">
              <label className="text-xs font-bold text-red-800 block">
                Required: Reason for marking Lost
              </label>
              <input
                value={lossReason}
                onChange={(e) => setLossReason(e.target.value)}
                placeholder="e.g. Price objection, competitor enrolled, no response"
                className="w-full bg-white border border-red-300 rounded-lg p-2 text-xs outline-none"
              />
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setShowLossInput(false)}
                  className="px-3 py-1 bg-white border text-xs rounded-md"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmLoss}
                  className="px-3 py-1 bg-red-600 text-white font-bold text-xs rounded-md"
                >
                  Confirm Lost
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Qualification & Notes */}
        <div className="space-y-3 my-4 border-t border-[#e7e5dc] pt-3 text-xs">
          <div>
            <span className="font-bold text-[#10120e] block mb-1">Prospect Need & Goal:</span>
            <p className="text-[#55594f] bg-white p-2.5 rounded-lg border border-[#e7e5dc]">
              {lead.needNotes || 'No notes entered during intake.'}
            </p>
          </div>

          {lead.qualification && (
            <div className="bg-[#fdfcf9] border border-[#e7e5dc] p-3 rounded-xl grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-gray-500 block text-[10px]">Budget Readiness</span>
                <span className="font-semibold">{lead.qualification.budgetReady || 'Not assessed'}</span>
              </div>
              <div>
                <span className="text-gray-500 block text-[10px]">Urgency</span>
                <span className="font-semibold">{lead.qualification.urgency || 'Standard'}</span>
              </div>
            </div>
          )}

          <div>
            <span className="font-bold text-[#10120e] block mb-1">Next Scheduled Action:</span>
            <div className="flex items-center justify-between p-2.5 bg-[#efffe7] border border-[#a1f87d] rounded-lg">
              <span className="font-medium text-[#10120e]">{lead.nextAction || 'First follow-up call'}</span>
              <span className="text-[11px] text-[#2f9b00] font-bold">{lead.nextActionDue || 'Today'}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="border-t border-[#e7e5dc] pt-4 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <button
              onClick={() => onAddTask(`Follow up with ${lead.fullName}`, lead.fullName)}
              className="px-3 py-1.5 bg-white border border-[#e7e5dc] text-xs font-semibold rounded-lg hover:bg-gray-50 cursor-pointer"
            >
              ＋ Add Task
            </button>
            <button
              onClick={() => onScheduleSession(lead)}
              className="px-3 py-1.5 bg-white border border-[#e7e5dc] text-xs font-semibold rounded-lg hover:bg-gray-50 cursor-pointer"
            >
              ▣ Schedule Session
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onClose();
                onOpenPayment(lead);
              }}
              className="px-4 py-1.5 bg-[#47e802] text-black font-extrabold text-xs rounded-lg shadow-sm hover:brightness-95 cursor-pointer"
            >
              ₦ Record Payment / Enroll
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
