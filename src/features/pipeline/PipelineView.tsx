import React, { useState } from 'react';
import { LeadOpportunity, PipelineStage } from '../../types/crm';

interface PipelineViewProps {
  leads: LeadOpportunity[];
  onSelectLead: (lead: LeadOpportunity) => void;
  onUpdateStage: (leadId: string, stage: PipelineStage) => void;
  onOpenAddLead: () => void;
}

const STAGES: PipelineStage[] = [
  'New Lead',
  'Contact Attempted',
  'Contact Established',
  'Qualified',
  'Offer Presented',
  'Follow-up / Decision Pending',
  'Payment Pending',
  'Won',
];

export const PipelineView: React.FC<PipelineViewProps> = ({
  leads,
  onSelectLead,
  onUpdateStage,
  onOpenAddLead,
}) => {
  const [selectedOwner, setSelectedOwner] = useState<string>('all');

  const filteredLeads = leads.filter((l) => {
    if (selectedOwner !== 'all' && l.ownerName !== selectedOwner) return false;
    return true;
  });

  const getStageTotal = (stage: PipelineStage) => {
    const list = filteredLeads.filter((l) => l.stage === stage);
    const sum = list.reduce((acc, curr) => acc + (curr.quotedPrice || curr.estimatedValue), 0);
    return { count: list.length, sum };
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
        <div>
          <div className="text-[11px] text-[#4e8c34] font-extrabold uppercase tracking-[1.5px]">
            Deal Progression
          </div>
          <h1 className="text-2xl font-black text-[#10120e] tracking-tight">Sales Pipeline</h1>
          <p className="text-xs text-[#73776e]">
            Drag or transition qualified prospects through closing stages
          </p>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={selectedOwner}
            onChange={(e) => setSelectedOwner(e.target.value)}
            className="border border-[#e7e5dc] bg-white rounded-lg px-3 py-2 text-xs font-semibold outline-none"
          >
            <option value="all">All Sales Reps</option>
            <option value="Chika">Chika Nwosu</option>
            <option value="Daniel">Daniel Okafor</option>
            <option value="Patrick Ezeji">Patrick Ezeji</option>
            <option value="Unassigned">Unassigned</option>
          </select>

          <button
            onClick={onOpenAddLead}
            className="bg-[#47e802] text-black font-black text-xs px-4 py-2 rounded-lg shadow-sm hover:brightness-95 cursor-pointer"
          >
            ＋ New Opportunity
          </button>
        </div>
      </div>

      {/* Kanban Board Container */}
      <div className="flex gap-3 overflow-x-auto pb-4 pt-1 items-start min-h-[600px]">
        {STAGES.map((stage) => {
          const { count, sum } = getStageTotal(stage);
          const stageLeads = filteredLeads.filter((l) => l.stage === stage);

          return (
            <div
              key={stage}
              className="w-[280px] shrink-0 bg-[#f8f6ef] border border-[#e7e5dc] rounded-2xl flex flex-col max-h-[75vh]"
            >
              {/* Column Header */}
              <div className="p-3 border-b border-[#e7e5dc] bg-[#fffefa] rounded-t-2xl">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-[#10120e] truncate">{stage}</span>
                  <span className="w-5 h-5 rounded-full bg-[#f5f2e8] text-[10px] font-black text-[#10120e] flex items-center justify-center">
                    {count}
                  </span>
                </div>
                <div className="text-[11px] font-bold text-[#2f9b00] mt-1">
                  ₦{sum > 0 ? (sum / 1000).toFixed(0) + 'k' : '0'}
                </div>
              </div>

              {/* Card List */}
              <div className="p-2.5 space-y-2.5 overflow-y-auto flex-1">
                {stageLeads.length === 0 ? (
                  <div className="p-4 text-center text-gray-400 text-[11px] border border-dashed border-[#e7e5dc] rounded-xl bg-white/50">
                    No opportunities in this stage
                  </div>
                ) : (
                  stageLeads.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => onSelectLead(item)}
                      className="bg-white border border-[#eae8df] rounded-xl p-3 shadow-xs hover:border-[#47e802] hover:shadow-md cursor-pointer transition-all space-y-2"
                    >
                      <div className="flex items-start justify-between gap-1">
                        <strong className="text-xs font-bold text-[#10120e] block leading-tight">
                          {item.fullName}
                        </strong>
                        <span className="text-[10px] font-bold text-[#2f9b00] bg-[#e9ffdf] px-1.5 py-0.5 rounded">
                          {item.leadScore}pts
                        </span>
                      </div>

                      <div className="text-[11px] text-[#55594f] truncate">
                        {item.programTitle}
                      </div>

                      <div className="text-[11px] font-bold text-[#10120e] flex justify-between items-center">
                        <span>₦{(item.quotedPrice || item.estimatedValue).toLocaleString()}</span>
                        <span className="text-[10px] text-gray-500 font-normal">{item.source}</span>
                      </div>

                      {item.nextAction && (
                        <div className="text-[10px] text-[#55594f] bg-[#f8f6ef] p-1.5 rounded border border-[#efede6] truncate">
                          ⚡ {item.nextAction}
                        </div>
                      )}

                      {/* Quick stage transition button */}
                      <div
                        className="flex items-center justify-between pt-1 border-t border-gray-100 text-[10px]"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <span className="text-gray-400 font-medium">Rep: {item.ownerName}</span>
                        <select
                          value={item.stage}
                          onChange={(e) => onUpdateStage(item.id, e.target.value as PipelineStage)}
                          className="bg-[#f5f2e8] border border-[#e7e5dc] rounded px-1.5 py-0.5 text-[10px] font-bold cursor-pointer"
                        >
                          {STAGES.map((s) => (
                            <option key={s} value={s}>
                              Move: {s}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
