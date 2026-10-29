import React, { useState } from 'react';
import { Contact, LeadOpportunity } from '../../types/crm';

interface ContactsViewProps {
  contacts: Contact[];
  leads: LeadOpportunity[];
  onOpenAddLead: () => void;
  onSelectLead: (lead: LeadOpportunity) => void;
}

export const ContactsView: React.FC<ContactsViewProps> = ({
  contacts,
  leads,
  onOpenAddLead,
  onSelectLead,
}) => {
  const [search, setSearch] = useState('');

  // Map contact to opportunities
  const filtered = contacts.filter((c) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      c.fullName.toLowerCase().includes(q) ||
      c.phone.toLowerCase().includes(q) ||
      c.email.toLowerCase().includes(q) ||
      (c.location && c.location.toLowerCase().includes(q))
    );
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
        <div>
          <div className="text-[11px] text-[#4e8c34] font-extrabold uppercase tracking-[1.5px]">
            Master Directory
          </div>
          <h1 className="text-2xl font-black text-[#10120e] tracking-tight">Contacts</h1>
          <p className="text-xs text-[#73776e]">
            Unified client profiles, phone numbers, and WhatsApp links
          </p>
        </div>
        <button
          onClick={onOpenAddLead}
          className="bg-[#47e802] text-black font-black text-xs px-4 py-2.5 rounded-[10px] shadow-sm hover:brightness-95 cursor-pointer self-start sm:self-auto"
        >
          ＋ Add Contact
        </button>
      </div>

      <div className="bg-[#fffefa] border border-[#eae8df] rounded-xl p-3 flex items-center justify-between shadow-xs">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search contacts by name, city, phone..."
          className="border border-[#e7e5dc] bg-[#fbfaf6] rounded-lg px-3 py-1.5 text-xs outline-none focus:border-[#47e802] w-full sm:w-[320px]"
        />
        <div className="text-xs text-[#73776e] font-semibold">
          {filtered.length} verified records
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {filtered.map((c) => {
          const initials = c.fullName
            .split(/\s+/)
            .slice(0, 2)
            .map((x) => x[0])
            .join('')
            .toUpperCase();

          const relatedOpportunities = leads.filter(
            (l) => l.fullName.toLowerCase() === c.fullName.toLowerCase() || l.phone === c.phone
          );

          const cleanPhone = c.phone.replace(/[^0-9]/g, '');

          return (
            <div
              key={c.id}
              className="bg-[#fffefa] border border-[#eae8df] rounded-xl p-4 shadow-xs space-y-3 hover:border-[#47e802] transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#e2e5d8] flex items-center justify-center font-bold text-xs text-[#10120e]">
                    {initials}
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-[#10120e]">{c.fullName}</h3>
                    <span className="text-[11px] text-[#73776e] block">
                      {c.occupation || 'Professional'} · {c.location || 'Nigeria'}
                    </span>
                  </div>
                </div>
                <span className="text-[10px] bg-[#f5f2e8] text-[#55594f] px-2 py-0.5 rounded font-medium">
                  {c.source}
                </span>
              </div>

              <div className="text-xs space-y-1 bg-[#fbfaf6] p-2.5 rounded-lg border border-[#efede6]">
                <div className="flex justify-between">
                  <span className="text-gray-500">Phone:</span>
                  <a href={`tel:${c.phone}`} className="font-semibold text-[#10120e] hover:underline">
                    {c.phone}
                  </a>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Email:</span>
                  <a href={`mailto:${c.email}`} className="text-[#10120e] truncate max-w-[180px] hover:underline">
                    {c.email}
                  </a>
                </div>
              </div>

              {/* Linked Opportunities */}
              <div>
                <div className="text-[10px] uppercase font-bold text-[#8a8d83] mb-1">
                  Coaching Opportunities ({relatedOpportunities.length})
                </div>
                <div className="space-y-1">
                  {relatedOpportunities.length > 0 ? (
                    relatedOpportunities.map((op) => (
                      <div
                        key={op.id}
                        onClick={() => onSelectLead(op)}
                        className="flex items-center justify-between p-1.5 bg-[#efffe7] rounded-md text-[11px] cursor-pointer hover:bg-[#e4fbd9]"
                      >
                        <span className="font-bold text-[#10120e] truncate max-w-[170px]">
                          {op.programTitle}
                        </span>
                        <span className="text-[10px] font-bold text-[#2f9b00]">{op.stage}</span>
                      </div>
                    ))
                  ) : (
                    <span className="text-[11px] text-gray-400">No active opportunities</span>
                  )}
                </div>
              </div>

              {/* Quick WhatsApp / Call Link */}
              <div className="flex items-center gap-2 pt-2 border-t border-[#efede6]">
                <a
                  href={`https://wa.me/${cleanPhone}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 text-center bg-[#47e802] hover:brightness-95 text-black font-extrabold text-[11px] py-1.5 rounded-lg"
                >
                  WhatsApp Chat 💬
                </a>
                <a
                  href={`tel:${c.phone}`}
                  className="px-3 bg-white border border-[#e7e5dc] hover:bg-gray-50 text-[#10120e] font-bold text-[11px] py-1.5 rounded-lg"
                >
                  Call
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
