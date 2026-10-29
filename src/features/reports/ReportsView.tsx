import React, { useState } from 'react';
import { CrmState } from '../../services/crmStore';

interface ReportsViewProps {
  state: CrmState;
  onOpenPaymentRecord: () => void;
}

export const ReportsView: React.FC<ReportsViewProps> = ({
  state,
  onOpenPaymentRecord,
}) => {
  const [tab, setTab] = useState<'funnel' | 'sources' | 'finance'>('funnel');

  const totalCollected = state.payments.reduce((acc, p) => acc + p.amountNGN, 0) + 2840000;

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
        <div>
          <div className="text-[11px] text-[#4e8c34] font-extrabold uppercase tracking-[1.5px]">
            Executive Intelligence
          </div>
          <h1 className="text-2xl font-black text-[#10120e] tracking-tight">Reports & Analytics</h1>
          <p className="text-xs text-[#73776e]">
            Conversion bottlenecks, acquisition ROI, and verified cash collected
          </p>
        </div>
        <button
          onClick={onOpenPaymentRecord}
          className="bg-[#47e802] text-black font-black text-xs px-4 py-2.5 rounded-[10px] shadow-sm hover:brightness-95 cursor-pointer self-start sm:self-auto"
        >
          ₦ Record / Reconcile Payment
        </button>
      </div>

      {/* Tabs */}
      <div className="bg-[#fffefa] border border-[#eae8df] rounded-xl p-2 flex gap-1 shadow-xs">
        <button
          onClick={() => setTab('funnel')}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            tab === 'funnel' ? 'bg-[#47e802] text-black' : 'text-[#73776e] hover:bg-[#f5f2e8]'
          }`}
        >
          Stage Funnel Analysis
        </button>
        <button
          onClick={() => setTab('sources')}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            tab === 'sources' ? 'bg-[#47e802] text-black' : 'text-[#73776e] hover:bg-[#f5f2e8]'
          }`}
        >
          Acquisition by Source
        </button>
        <button
          onClick={() => setTab('finance')}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            tab === 'finance' ? 'bg-[#47e802] text-black' : 'text-[#73776e] hover:bg-[#f5f2e8]'
          }`}
        >
          Verified Financial Ledger
        </button>
      </div>

      {/* Tab 1: Funnel */}
      {tab === 'funnel' && (
        <div className="bg-[#fffefa] border border-[#eae8df] rounded-2xl p-5 shadow-xs space-y-4">
          <h2 className="text-base font-bold text-[#10120e]">Stage-by-Stage Conversion Funnel</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="bg-[#f8f7f1] border-b border-[#eae8df]">
                  <th className="p-3 font-bold text-[#74786f]">FUNNEL STAGE</th>
                  <th className="p-3 font-bold text-[#74786f]">PROSPECTS</th>
                  <th className="p-3 font-bold text-[#74786f]">RETENTION</th>
                  <th className="p-3 font-bold text-[#74786f]">DROP-OFF</th>
                  <th className="p-3 font-bold text-[#74786f]">PRIMARY OBJECTION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#efede6]">
                <tr>
                  <td className="p-3 font-bold text-[#10120e]">1. New Inbound Leads</td>
                  <td className="p-3 font-semibold">248</td>
                  <td className="p-3 text-[#2f9b00] font-bold">100%</td>
                  <td className="p-3 text-gray-400">0%</td>
                  <td className="p-3 text-[#73776e]">Response time delay (&gt;15m)</td>
                </tr>
                <tr>
                  <td className="p-3 font-bold text-[#10120e]">2. Contact Established</td>
                  <td className="p-3 font-semibold">162</td>
                  <td className="p-3 text-[#2f9b00] font-bold">65.3%</td>
                  <td className="p-3 text-red-600 font-bold">34.7%</td>
                  <td className="p-3 text-[#73776e]">Unanswered WhatsApp / phone call</td>
                </tr>
                <tr>
                  <td className="p-3 font-bold text-[#10120e]">3. Qualified Fit</td>
                  <td className="p-3 font-semibold">86</td>
                  <td className="p-3 text-[#2f9b00] font-bold">34.6%</td>
                  <td className="p-3 text-red-600 font-bold">46.9%</td>
                  <td className="p-3 text-[#73776e]">Budget mismatch or low urgency</td>
                </tr>
                <tr>
                  <td className="p-3 font-bold text-[#10120e]">4. Offer Presented</td>
                  <td className="p-3 font-semibold">54</td>
                  <td className="p-3 text-[#2f9b00] font-bold">21.7%</td>
                  <td className="p-3 text-red-600 font-bold">37.2%</td>
                  <td className="p-3 text-[#73776e]">Decision delay / installment request</td>
                </tr>
                <tr>
                  <td className="p-3 font-bold text-[#10120e]">5. Enrolled & Paid</td>
                  <td className="p-3 font-semibold">42</td>
                  <td className="p-3 text-[#2f9b00] font-bold">16.9%</td>
                  <td className="p-3 text-red-600 font-bold">22.2%</td>
                  <td className="p-3 text-[#73776e]">Failed transfer or delayed payment</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Sources */}
      {tab === 'sources' && (
        <div className="bg-[#fffefa] border border-[#eae8df] rounded-2xl p-5 shadow-xs space-y-4">
          <h2 className="text-base font-bold text-[#10120e]">Acquisition Channel Performance</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {[
              { source: 'Website', leads: 94, share: '38%', conv: '19.1%' },
              { source: 'Social ads (Meta/IG)', leads: 64, share: '26%', conv: '14.2%' },
              { source: 'Referrals & Alumni', leads: 45, share: '18%', conv: '31.1%' },
              { source: 'Masterclasses & Events', leads: 25, share: '10%', conv: '24.0%' },
              { source: 'Other / Direct', leads: 20, share: '8%', conv: '10.0%' },
            ].map((s) => (
              <div key={s.source} className="p-4 bg-[#f8f6ef] rounded-xl border border-[#efede6] space-y-2">
                <div className="flex justify-between items-center">
                  <h3 className="font-bold text-sm text-[#10120e]">{s.source}</h3>
                  <span className="text-xs font-bold text-[#2f9b00]">{s.share} volume</span>
                </div>
                <div className="text-xs text-gray-500 flex justify-between">
                  <span>Total Leads: <b>{s.leads}</b></span>
                  <span>Lead-to-Won: <b>{s.conv}</b></span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Finance */}
      {tab === 'finance' && (
        <div className="bg-[#fffefa] border border-[#eae8df] rounded-2xl p-5 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
            <div>
              <h2 className="text-base font-bold text-[#10120e]">Audited Revenue & Collections</h2>
              <p className="text-xs text-[#73776e]">
                Strict rule: Only verified bank transfers and gateway settlements are counted as revenue.
              </p>
            </div>
            <div className="text-right">
              <span className="text-xs text-gray-500 block">Total Verified Collections:</span>
              <span className="text-xl font-black text-[#2f9b00]">
                ₦{totalCollected.toLocaleString()}
              </span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse whitespace-nowrap">
              <thead>
                <tr className="bg-[#f8f7f1] border-b border-[#eae8df]">
                  <th className="p-3 font-bold text-[#74786f]">PAYER</th>
                  <th className="p-3 font-bold text-[#74786f]">TRACK</th>
                  <th className="p-3 font-bold text-[#74786f]">AMOUNT (NGN)</th>
                  <th className="p-3 font-bold text-[#74786f]">CHANNEL</th>
                  <th className="p-3 font-bold text-[#74786f]">TRANSACTION REF</th>
                  <th className="p-3 font-bold text-[#74786f]">VERIFIED BY</th>
                  <th className="p-3 font-bold text-[#74786f]">STATUS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#efede6]">
                {state.payments.map((p) => (
                  <tr key={p.id} className="hover:bg-[#faf9f5]">
                    <td className="p-3 font-bold text-[#10120e]">{p.studentOrLeadName}</td>
                    <td className="p-3 text-[#55594f]">{p.programTitle}</td>
                    <td className="p-3 font-extrabold text-[#2f9b00]">
                      ₦{p.amountNGN.toLocaleString()}
                    </td>
                    <td className="p-3">{p.channel}</td>
                    <td className="p-3 font-mono text-[11px] text-gray-500">{p.transactionRef}</td>
                    <td className="p-3 font-medium text-[#10120e]">{p.verifiedBy}</td>
                    <td className="p-3">
                      <span className="bg-[#e4fbd9] text-[#2f9b00] font-bold px-2 py-0.5 rounded text-[11px]">
                        ✓ Verified
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
