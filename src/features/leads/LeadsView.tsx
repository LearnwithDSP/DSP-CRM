import React, { useState } from 'react';
import { LeadOpportunity, PipelineStage, LeadSource } from '../../types/crm';

interface LeadsViewProps {
  leads: LeadOpportunity[];
  onOpenAddLead: () => void;
  onSelectLead: (lead: LeadOpportunity) => void;
  onUpdateStage: (leadId: string, stage: PipelineStage) => void;
}

export const LeadsView: React.FC<LeadsViewProps> = ({
  leads,
  onOpenAddLead,
  onSelectLead,
  onUpdateStage,
}) => {
  const [stageFilter, setStageFilter] = useState<string>('all');
  const [sourceFilter, setSourceFilter] = useState<string>('all');
  const [search, setSearch] = useState('');

  const filtered = leads.filter((l) => {
    if (stageFilter !== 'all' && l.stage !== stageFilter) return false;
    if (sourceFilter !== 'all' && l.source !== sourceFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        l.fullName.toLowerCase().includes(q) ||
        l.email.toLowerCase().includes(q) ||
        l.phone.toLowerCase().includes(q) ||
        l.programTitle.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
        <div>
          <div className="text-[11px] text-[#4e8c34] font-extrabold uppercase tracking-[1.5px]">
            Acquisition & Pipeline
          </div>
          <h1 className="text-2xl font-black text-[#10120e] tracking-tight">Leads & Prospects</h1>
          <p className="text-xs text-[#73776e]">
            {leads.length} active leads tracked across conversion funnels
          </p>
        </div>
        <button
          onClick={onOpenAddLead}
          className="bg-[#47e802] text-black font-black text-xs px-4 py-2.5 rounded-[10px] shadow-sm hover:brightness-95 cursor-pointer flex items-center gap-1.5 self-start sm:self-auto"
        >
          <span>＋</span> Add new lead
        </button>
      </div>

      {/* Filter toolbar */}
      <div className="bg-[#fffefa] border border-[#eae8df] rounded-xl p-3 flex flex-wrap items-center justify-between gap-3 shadow-xs">
        <div className="flex flex-wrap items-center gap-2 flex-1 min-w-[280px]">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Filter by name, phone, program..."
            className="border border-[#e7e5dc] bg-[#fbfaf6] rounded-lg px-3 py-1.5 text-xs outline-none focus:border-[#47e802] w-full sm:w-[220px]"
          />

          <select
            value={stageFilter}
            onChange={(e) => setStageFilter(e.target.value)}
            className="border border-[#e7e5dc] bg-white rounded-lg px-2.5 py-1.5 text-xs outline-none"
          >
            <option value="all">All Stages</option>
            <option value="New Lead">New Lead</option>
            <option value="Contact Attempted">Contact Attempted</option>
            <option value="Contact Established">Contact Established</option>
            <option value="Qualified">Qualified</option>
            <option value="Offer Presented">Offer Presented</option>
            <option value="Follow-up / Decision Pending">Decision Pending</option>
            <option value="Payment Pending">Payment Pending</option>
            <option value="Won">Won</option>
            <option value="Lost">Lost</option>
          </select>

          <select
            value={sourceFilter}
            onChange={(e) => setSourceFilter(e.target.value)}
            className="border border-[#e7e5dc] bg-white rounded-lg px-2.5 py-1.5 text-xs outline-none"
          >
            <option value="all">All Sources</option>
            <option value="Website">Website</option>
            <option value="Instagram">Instagram</option>
            <option value="WhatsApp">WhatsApp</option>
            <option value="Facebook">Facebook</option>
            <option value="Masterclass">Masterclass</option>
            <option value="Referral">Referral</option>
            <option value="Google">Google</option>
          </select>
        </div>

        <div className="text-xs text-[#73776e] font-semibold">
          Showing {filtered.length} of {leads.length} records
        </div>
      </div>

      {/* Leads Table */}
      <div className="bg-[#fffefa] border border-[#eae8df] rounded-xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse whitespace-nowrap text-left text-xs">
            <thead>
              <tr className="bg-[#f8f7f1] border-b border-[#eae8df]">
                <th className="p-3 font-bold text-[#74786f]">PROSPECT</th>
                <th className="p-3 font-bold text-[#74786f]">PROGRAM</th>
                <th className="p-3 font-bold text-[#74786f]">SOURCE</th>
                <th className="p-3 font-bold text-[#74786f]">SCORE</th>
                <th className="p-3 font-bold text-[#74786f]">STAGE</th>
                <th className="p-3 font-bold text-[#74786f]">VALUE</th>
                <th className="p-3 font-bold text-[#74786f]">OWNER</th>
                <th className="p-3 font-bold text-[#74786f]">NEXT ACTION</th>
                <th className="p-3 font-bold text-[#74786f] text-right">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#efede6]">
              {filtered.map((l) => {
                const initials = l.fullName
                  .split(/\s+/)
                  .slice(0, 2)
                  .map((x) => x[0])
                  .join('')
                  .toUpperCase();

                let pillColor = 'bg-[#edeee8] text-black';
                if (l.stage === 'Qualified' || l.stage === 'Won') pillColor = 'bg-[#e4fbd9] text-[#2f9b00]';
                else if (l.stage === 'Contacted' || l.stage === 'Contact Attempted') pillColor = 'bg-[#fff2bb] text-[#8a6800]';
                else if (l.stage === 'Offer Presented') pillColor = 'bg-[#e0f5ff] text-[#006699]';
                else if (l.stage === 'Lost') pillColor = 'bg-red-100 text-red-700';

                return (
                  <tr
                    key={l.id}
                    className="hover:bg-[#faf9f5] cursor-pointer transition-colors"
                  >
                    <td className="p-3" onClick={() => onSelectLead(l)}>
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-[#e2e5d8] flex items-center justify-center font-bold text-xs text-[#10120e]">
                          {initials}
                        </div>
                        <div>
                          <strong className="block text-[#10120e] font-bold">{l.fullName}</strong>
                          <span className="text-[#73776e] text-[11px] block">{l.phone}</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-3 text-[#55594f] font-medium" onClick={() => onSelectLead(l)}>
                      {l.programTitle}
                    </td>
                    <td className="p-3 text-[#55594f]" onClick={() => onSelectLead(l)}>
                      {l.source}
                    </td>
                    <td className="p-3" onClick={() => onSelectLead(l)}>
                      <span className="font-bold text-[#2f9b00] bg-[#e9ffdf] px-2 py-0.5 rounded-md text-[11px]">
                        {l.leadScore}/100
                      </span>
                    </td>
                    <td className="p-3">
                      <select
                        value={l.stage}
                        onChange={(e) => onUpdateStage(l.id, e.target.value as PipelineStage)}
                        onClick={(e) => e.stopPropagation()}
                        className={`text-[11px] font-bold rounded-full px-2 py-1 border-0 cursor-pointer outline-none ${pillColor}`}
                      >
                        <option value="New Lead">New Lead</option>
                        <option value="Contact Attempted">Contact Attempted</option>
                        <option value="Contact Established">Contact Established</option>
                        <option value="Qualified">Qualified</option>
                        <option value="Offer Presented">Offer Presented</option>
                        <option value="Follow-up / Decision Pending">Decision Pending</option>
                        <option value="Payment Pending">Payment Pending</option>
                        <option value="Won">Won</option>
                        <option value="Lost">Lost</option>
                        <option value="Nurture">Nurture</option>
                      </select>
                    </td>
                    <td className="p-3 font-semibold text-[#10120e]" onClick={() => onSelectLead(l)}>
                      ₦{l.estimatedValue.toLocaleString()}
                    </td>
                    <td className="p-3 font-medium text-[#10120e]" onClick={() => onSelectLead(l)}>
                      {l.ownerName}
                    </td>
                    <td className="p-3 text-[11px] text-[#55594f] max-w-[180px] truncate" onClick={() => onSelectLead(l)}>
                      {l.nextAction || 'First follow-up'}
                    </td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => onSelectLead(l)}
                        className="px-2.5 py-1 bg-white border border-[#e7e5dc] rounded-md font-bold text-[11px] text-[#10120e] hover:bg-gray-100"
                      >
                        View →
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
