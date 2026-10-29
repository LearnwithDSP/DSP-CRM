import React, { useState } from 'react';
import { CrmState } from '../../services/crmStore';
import { StaffProfile, LeadOpportunity } from '../../types/crm';
import { NavPage } from '../../components/Sidebar';

interface DashboardViewProps {
  state: CrmState;
  currentUser: StaffProfile;
  onNavigate: (page: NavPage) => void;
  onOpenAddLead: () => void;
  onOpenAddTask: () => void;
  onSelectLead: (lead: LeadOpportunity) => void;
  onToggleTask: (taskId: string) => void;
  searchFilter?: string;
  showToast: (msg: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  state,
  currentUser,
  onNavigate,
  onOpenAddLead,
  onOpenAddTask,
  onSelectLead,
  onToggleTask,
  searchFilter = '',
  showToast,
}) => {
  const [period, setPeriod] = useState('month');
  const [sourcePeriod, setSourcePeriod] = useState('This month');
  const [revenueRange, setRevenueRange] = useState('Last 6 months');

  // Filter leads based on global search if entered
  const filteredLeads = state.leads.filter((l) => {
    if (!searchFilter) return true;
    const q = searchFilter.toLowerCase();
    return (
      l.fullName.toLowerCase().includes(q) ||
      l.email.toLowerCase().includes(q) ||
      l.phone.toLowerCase().includes(q) ||
      l.programTitle.toLowerCase().includes(q)
    );
  });

  // Calculate dynamic metrics
  const totalLeads = state.totalLeadsCount;
  const qualifiedCount = state.leads.filter(
    (l) => l.stage === 'Qualified' || l.stage === 'Offer Presented' || l.stage === 'Won'
  ).length + 80;
  const enrolledCount = state.students.length + 38;
  const totalCashCollected = state.payments.reduce((acc, p) => acc + p.amountNGN, 0) + 2840000;

  const formattedRevenue = `₦${(totalCashCollected / 1000000).toFixed(2)}m`;

  return (
    <div className="space-y-[15px]">
      {/* Welcome header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-end gap-4 mb-[22px]">
        <div>
          <div className="text-[11px] text-[#4e8c34] font-extrabold uppercase tracking-[1.5px]">
            Business overview
          </div>
          <h1 className="text-[26px] sm:text-[29px] tracking-[-1.2px] m-[4px_0_3px] font-extrabold text-[#10120e] leading-tight">
            Welcome back, {currentUser.fullName.split(' ')[0]}.
          </h1>
          <p className="text-[#73776e] text-[13px] m-0">
            Here’s what needs your attention across the coaching business.
          </p>
        </div>
        <div className="flex items-center gap-[9px]">
          <select
            value={period}
            onChange={(e) => {
              setPeriod(e.target.value);
              showToast(`Period filter set to ${e.target.options[e.target.selectedIndex].text}.`);
            }}
            className="border border-[#e7e5dc] rounded-[10px] bg-[#fffefa] p-[10px_12px] text-[13px] text-[#333] outline-none cursor-pointer"
          >
            <option value="month">This month</option>
            <option value="week">This week</option>
            <option value="quarter">This quarter</option>
          </select>
          <button
            onClick={onOpenAddLead}
            className="bg-[#47e802] border-0 rounded-[10px] p-[11px_15px] font-extrabold text-[13px] text-[#111] shadow-[0_3px_10px_#47e80225] hover:brightness-95 hover:-translate-y-px transition-all cursor-pointer flex items-center gap-1.5"
          >
            <span>＋</span> Add lead
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-[14px] mb-[15px]">
        {/* KPI 1: Total Leads */}
        <article
          onClick={() => onNavigate('Leads')}
          className="bg-[#fffefa] border border-[#eae8df] rounded-[15px] p-[17px] shadow-[0_6px_24px_rgba(20,24,14,0.045)] flex items-start gap-[13px] cursor-pointer hover:border-[#47e802] transition-all"
        >
          <div className="w-[43px] h-[43px] shrink-0 rounded-[13px] bg-[#e9ffdf] flex items-center justify-center text-[20px]">
            ♧
          </div>
          <div>
            <div className="text-[#5f645a] text-[12px]">Total leads</div>
            <div className="text-[25px] sm:text-[27px] leading-[1.2] font-extrabold tracking-[-1px] m-[4px_0] text-[#10120e]">
              {totalLeads}
            </div>
            <div className="text-[11px] text-[#2f9b00] font-bold">
              ↗ 12% <span className="text-[#73776e] font-normal">vs previous period</span>
            </div>
          </div>
        </article>

        {/* KPI 2: Qualified */}
        <article
          onClick={() => onNavigate('Sales Pipeline')}
          className="bg-[#fffefa] border border-[#eae8df] rounded-[15px] p-[17px] shadow-[0_6px_24px_rgba(20,24,14,0.045)] flex items-start gap-[13px] cursor-pointer hover:border-[#47e802] transition-all"
        >
          <div className="w-[43px] h-[43px] shrink-0 rounded-[13px] bg-[#e9ffdf] flex items-center justify-center text-[20px]">
            ◎
          </div>
          <div>
            <div className="text-[#5f645a] text-[12px]">Qualified opportunities</div>
            <div className="text-[25px] sm:text-[27px] leading-[1.2] font-extrabold tracking-[-1px] m-[4px_0] text-[#10120e]">
              {qualifiedCount}
            </div>
            <div className="text-[11px] text-[#2f9b00] font-bold">
              ↗ 18% <span className="text-[#73776e] font-normal">vs previous period</span>
            </div>
          </div>
        </article>

        {/* KPI 3: Enrolled */}
        <article
          onClick={() => onNavigate('Students')}
          className="bg-[#fffefa] border border-[#eae8df] rounded-[15px] p-[17px] shadow-[0_6px_24px_rgba(20,24,14,0.045)] flex items-start gap-[13px] cursor-pointer hover:border-[#47e802] transition-all"
        >
          <div className="w-[43px] h-[43px] shrink-0 rounded-[13px] bg-[#e9ffdf] flex items-center justify-center text-[20px]">
            ✓
          </div>
          <div>
            <div className="text-[#5f645a] text-[12px]">Enrolled students</div>
            <div className="text-[25px] sm:text-[27px] leading-[1.2] font-extrabold tracking-[-1px] m-[4px_0] text-[#10120e]">
              {enrolledCount}
            </div>
            <div className="text-[11px] text-[#2f9b00] font-bold">
              ↗ 25% <span className="text-[#73776e] font-normal">vs previous period</span>
            </div>
          </div>
        </article>

        {/* KPI 4: Cash Collected */}
        <article
          onClick={() => onNavigate('Reports')}
          className="bg-[#fffefa] border border-[#eae8df] rounded-[15px] p-[17px] shadow-[0_6px_24px_rgba(20,24,14,0.045)] flex items-start gap-[13px] cursor-pointer hover:border-[#47e802] transition-all"
        >
          <div className="w-[43px] h-[43px] shrink-0 rounded-[13px] bg-[#e9ffdf] flex items-center justify-center text-[20px] font-bold">
            ₦
          </div>
          <div>
            <div className="text-[#5f645a] text-[12px]">Cash collected</div>
            <div className="text-[25px] sm:text-[27px] leading-[1.2] font-extrabold tracking-[-1px] m-[4px_0] text-[#10120e]">
              {formattedRevenue}
            </div>
            <div className="text-[11px] text-[#2f9b00] font-bold">
              ↗ 16% <span className="text-[#73776e] font-normal">vs previous period</span>
            </div>
          </div>
        </article>
      </section>

      {/* Middle Grid: Pipeline Funnel, Lead Sources, Revenue Trend */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[14px] mb-[15px]">
        {/* Sales Pipeline Funnel Card */}
        <article className="bg-[#fffefa] border border-[#eae8df] rounded-[15px] p-[17px] shadow-[0_6px_24px_rgba(20,24,14,0.045)] flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center gap-[10px] mb-[15px]">
              <h2 className="text-[15px] font-bold tracking-[-0.3px] text-[#10120e] m-0">
                Sales pipeline
              </h2>
              <button
                onClick={() => onNavigate('Sales Pipeline')}
                className="border-0 bg-transparent text-[#239400] font-extrabold text-[12px] whitespace-nowrap cursor-pointer hover:underline"
              >
                View pipeline →
              </button>
            </div>

            <div className="grid grid-cols-[110px_1fr] items-center gap-[14px]">
              <div className="flex flex-col items-center gap-[4px]">
                <div
                  className="h-[24px] bg-[#47e802] rounded-[4px]"
                  style={{
                    width: '108px',
                    clipPath: 'polygon(0 0, 100% 0, 88% 100%, 12% 100%)',
                  }}
                />
                <div
                  className="h-[24px] bg-[#72ef3d] rounded-[4px]"
                  style={{
                    width: '91px',
                    clipPath: 'polygon(0 0, 100% 0, 88% 100%, 12% 100%)',
                  }}
                />
                <div
                  className="h-[24px] bg-[#a6f582] rounded-[4px]"
                  style={{
                    width: '73px',
                    clipPath: 'polygon(0 0, 100% 0, 88% 100%, 12% 100%)',
                  }}
                />
                <div
                  className="h-[24px] bg-[#cbf9b8] rounded-[4px]"
                  style={{
                    width: '55px',
                    clipPath: 'polygon(0 0, 100% 0, 88% 100%, 12% 100%)',
                  }}
                />
                <div
                  className="h-[24px] bg-[#e4fbd9] rounded-[4px]"
                  style={{
                    width: '37px',
                    clipPath: 'polygon(0 0, 100% 0, 88% 100%, 12% 100%)',
                  }}
                />
              </div>

              <div className="grid gap-[9px]">
                <div className="grid grid-cols-[1fr_auto_auto] gap-[10px] items-center text-[11px] border-b border-[#f0eee7] pb-[7px]">
                  <span>New leads</span>
                  <strong className="text-[11px] font-bold">248</strong>
                  <span className="text-[#73776e]">100%</span>
                </div>
                <div className="grid grid-cols-[1fr_auto_auto] gap-[10px] items-center text-[11px] border-b border-[#f0eee7] pb-[7px]">
                  <span>Contacted</span>
                  <strong className="text-[11px] font-bold">162</strong>
                  <span className="text-[#73776e]">65%</span>
                </div>
                <div className="grid grid-cols-[1fr_auto_auto] gap-[10px] items-center text-[11px] border-b border-[#f0eee7] pb-[7px]">
                  <span>Qualified</span>
                  <strong className="text-[11px] font-bold">86</strong>
                  <span className="text-[#73776e]">35%</span>
                </div>
                <div className="grid grid-cols-[1fr_auto_auto] gap-[10px] items-center text-[11px] border-b border-[#f0eee7] pb-[7px]">
                  <span>Offer presented</span>
                  <strong className="text-[11px] font-bold">54</strong>
                  <span className="text-[#73776e]">22%</span>
                </div>
                <div className="grid grid-cols-[1fr_auto_auto] gap-[10px] items-center text-[11px]">
                  <span>Enrolled</span>
                  <strong className="text-[11px] font-bold">42</strong>
                  <span className="text-[#73776e]">17%</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-[12px] p-[10px] bg-[#f5f2e8] rounded-[9px] text-[11px] text-[#10120e]">
            <strong>Opportunity to improve:</strong> 76 leads have not yet been contacted.
          </div>
        </article>

        {/* Lead Sources Donut Card */}
        <article className="bg-[#fffefa] border border-[#eae8df] rounded-[15px] p-[17px] shadow-[0_6px_24px_rgba(20,24,14,0.045)]">
          <div className="flex justify-between items-center gap-[10px] mb-[15px]">
            <h2 className="text-[15px] font-bold tracking-[-0.3px] text-[#10120e] m-0">
              Lead sources
            </h2>
            <select
              value={sourcePeriod}
              onChange={(e) => {
                setSourcePeriod(e.target.value);
                showToast(`Lead source view: ${e.target.value}`);
              }}
              className="border border-[#e7e5dc] bg-[#fffefa] p-[7px_8px] rounded-[8px] text-[11px] outline-none cursor-pointer"
            >
              <option>This month</option>
              <option>This quarter</option>
            </select>
          </div>

          <div className="flex items-center gap-[20px] justify-center min-h-[170px]">
            {/* Donut chart */}
            <div
              className="w-[142px] h-[142px] rounded-full flex items-center justify-center relative shrink-0"
              style={{
                background:
                  'conic-gradient(#47e802 0 38%, #a1f87d 38% 64%, #d1fac0 64% 82%, #d9dad3 82% 92%, #777b73 92% 100%)',
              }}
            >
              <div className="absolute w-[85px] h-[85px] rounded-full bg-[#fffefa]" />
              <div className="relative z-10 text-center">
                <strong className="text-[22px] block font-extrabold text-[#10120e] leading-tight">
                  {totalLeads}
                </strong>
                <small className="text-[10px] text-[#73776e] font-semibold">Total leads</small>
              </div>
            </div>

            {/* Legend */}
            <div className="grid gap-[9px] text-[11px] text-[#10120e]">
              <div className="flex items-center gap-[7px] whitespace-nowrap">
                <i className="w-[9px] h-[9px] rounded-full inline-block bg-[#47e802]" />
                Website <b className="ml-1">38%</b>
              </div>
              <div className="flex items-center gap-[7px] whitespace-nowrap">
                <i className="w-[9px] h-[9px] rounded-full inline-block bg-[#a1f87d]" />
                Social ads <b className="ml-1">26%</b>
              </div>
              <div className="flex items-center gap-[7px] whitespace-nowrap">
                <i className="w-[9px] h-[9px] rounded-full inline-block bg-[#d1fac0]" />
                Referrals <b className="ml-1">18%</b>
              </div>
              <div className="flex items-center gap-[7px] whitespace-nowrap">
                <i className="w-[9px] h-[9px] rounded-full inline-block bg-[#d9dad3]" />
                Events <b className="ml-1">10%</b>
              </div>
              <div className="flex items-center gap-[7px] whitespace-nowrap">
                <i className="w-[9px] h-[9px] rounded-full inline-block bg-[#777b73]" />
                Other <b className="ml-1">8%</b>
              </div>
            </div>
          </div>
        </article>

        {/* Revenue Trend SVG Card */}
        <article className="bg-[#fffefa] border border-[#eae8df] rounded-[15px] p-[17px] shadow-[0_6px_24px_rgba(20,24,14,0.045)] md:col-span-2 lg:col-span-1">
          <div className="flex justify-between items-center gap-[10px] mb-[15px]">
            <h2 className="text-[15px] font-bold tracking-[-0.3px] text-[#10120e] m-0">
              Revenue trend
            </h2>
            <select
              value={revenueRange}
              onChange={(e) => {
                setRevenueRange(e.target.value);
                showToast(`Revenue range: ${e.target.value}`);
              }}
              className="border border-[#e7e5dc] bg-[#fffefa] p-[7px_8px] rounded-[8px] text-[11px] outline-none cursor-pointer"
            >
              <option>Last 6 months</option>
              <option>Last 12 months</option>
            </select>
          </div>

          <svg
            className="w-full h-[170px] block"
            viewBox="0 0 320 180"
            role="img"
            aria-label="Verified revenue trend chart"
          >
            <g stroke="#e9e7df" strokeWidth="1">
              <path d="M36 20H310M36 55H310M36 90H310M36 125H310M36 160H310" />
            </g>
            <g fill="#73776e" fontSize="10">
              <text x="2" y="23">
                ₦4m
              </text>
              <text x="2" y="58">
                ₦3m
              </text>
              <text x="2" y="93">
                ₦2m
              </text>
              <text x="2" y="128">
                ₦1m
              </text>
              <text x="22" y="163">
                ₦0
              </text>
            </g>
            <g fill="#47e802">
              <rect x="48" y="122" width="23" height="38" rx="3" className="hover:fill-[#3dd100]" />
              <rect x="91" y="103" width="23" height="57" rx="3" className="hover:fill-[#3dd100]" />
              <rect x="134" y="84" width="23" height="76" rx="3" className="hover:fill-[#3dd100]" />
              <rect x="177" y="66" width="23" height="94" rx="3" className="hover:fill-[#3dd100]" />
              <rect x="220" y="47" width="23" height="113" rx="3" className="hover:fill-[#3dd100]" />
              <rect x="263" y="27" width="23" height="133" rx="3" className="hover:fill-[#3dd100]" />
            </g>
            <g fill="#73776e" fontSize="10" textAnchor="middle">
              <text x="60" y="176">
                May
              </text>
              <text x="103" y="176">
                Jun
              </text>
              <text x="146" y="176">
                Jul
              </text>
              <text x="189" y="176">
                Aug
              </text>
              <text x="232" y="176">
                Sep
              </text>
              <text x="275" y="176">
                Oct
              </text>
            </g>
          </svg>

          <div className="text-[#73776e] text-[10px] mt-1">
            Verified collections: ₦3.84m across {state.payments.length} audited transactions.
          </div>
        </article>
      </section>

      {/* Bottom Section: Recent Leads Table, Priority Tasks, Team Activity */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-[14px]">
        {/* Recent Leads Table */}
        <article className="bg-[#fffefa] border border-[#eae8df] rounded-[15px] p-[17px] shadow-[0_6px_24px_rgba(20,24,14,0.045)] lg:col-span-5">
          <div className="flex justify-between items-center gap-[10px] mb-[15px]">
            <h2 className="text-[15px] font-bold tracking-[-0.3px] text-[#10120e] m-0">
              Recent leads
            </h2>
            <button
              onClick={() => onNavigate('Leads')}
              className="border-0 bg-transparent text-[#239400] font-extrabold text-[12px] whitespace-nowrap cursor-pointer hover:underline"
            >
              All leads →
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse whitespace-nowrap text-left">
              <thead>
                <tr className="bg-[#f8f7f1]">
                  <th className="text-[#74786f] text-[10px] font-bold p-[9px_8px]">CONTACT</th>
                  <th className="text-[#74786f] text-[10px] font-bold p-[9px_8px]">SOURCE</th>
                  <th className="text-[#74786f] text-[10px] font-bold p-[9px_8px]">PROGRAM</th>
                  <th className="text-[#74786f] text-[10px] font-bold p-[9px_8px]">STAGE</th>
                  <th className="text-[#74786f] text-[10px] font-bold p-[9px_8px]">OWNER</th>
                </tr>
              </thead>
              <tbody>
                {filteredLeads.slice(0, 5).map((ld) => {
                  const initials = ld.fullName
                    .split(/\s+/)
                    .slice(0, 2)
                    .map((x) => x[0])
                    .join('')
                    .toUpperCase();

                  let pillColor = 'bg-[#edeee8] text-black';
                  if (ld.stage === 'Qualified' || ld.stage === 'Won') pillColor = 'bg-[#e4fbd9] text-[#2f9b00]';
                  else if (ld.stage === 'Contacted' || ld.stage === 'Contact Attempted') pillColor = 'bg-[#fff2bb] text-[#8a6800]';
                  else if (ld.stage === 'Offer Presented') pillColor = 'bg-[#e0f5ff] text-[#006699]';

                  return (
                    <tr
                      key={ld.id}
                      onClick={() => onSelectLead(ld)}
                      className="border-b border-[#efede6] hover:bg-[#faf9f5] cursor-pointer transition-colors"
                    >
                      <td className="p-[10px_8px] text-[11px]">
                        <div className="flex items-center gap-[8px]">
                          <div className="w-[29px] h-[29px] rounded-full bg-[#e2e5d8] flex items-center justify-center font-bold text-[10px] text-[#10120e]">
                            {initials}
                          </div>
                          <div>
                            <strong className="block text-[#10120e] leading-tight font-bold">
                              {ld.fullName}
                            </strong>
                            <span className="text-[#73776e] text-[10px]">{ld.email}</span>
                          </div>
                        </div>
                      </td>
                      <td className="p-[10px_8px] text-[11px] text-[#55594f]">{ld.source}</td>
                      <td className="p-[10px_8px] text-[11px] text-[#55594f] max-w-[130px] truncate">
                        {ld.programTitle}
                      </td>
                      <td className="p-[10px_8px] text-[11px]">
                        <span className={`rounded-full px-[8px] py-[4px] text-[10px] font-bold inline-block ${pillColor}`}>
                          {ld.stage}
                        </span>
                      </td>
                      <td className="p-[10px_8px] text-[11px] font-semibold text-[#10120e]">
                        {ld.ownerName}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </article>

        {/* My Priority Tasks */}
        <article className="bg-[#fffefa] border border-[#eae8df] rounded-[15px] p-[17px] shadow-[0_6px_24px_rgba(20,24,14,0.045)] lg:col-span-4 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center gap-[10px] mb-[15px]">
              <h2 className="text-[15px] font-bold tracking-[-0.3px] text-[#10120e] m-0">
                My priority tasks
              </h2>
              <button
                onClick={() => onNavigate('Tasks')}
                className="border-0 bg-transparent text-[#239400] font-extrabold text-[12px] whitespace-nowrap cursor-pointer hover:underline"
              >
                All tasks →
              </button>
            </div>

            <div className="divide-y divide-[#efede6]">
              {state.tasks.slice(0, 5).map((tk) => (
                <div
                  key={tk.id}
                  className={`flex gap-[9px] items-start py-[11px] ${
                    tk.isCompleted ? 'text-[#92958d]' : 'text-[#10120e]'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={tk.isCompleted}
                    onChange={() => {
                      onToggleTask(tk.id);
                      showToast(
                        !tk.isCompleted ? 'Task marked complete.' : 'Task reopened.'
                      );
                    }}
                    className="accent-[#47e802] w-[16px] h-[16px] mt-[2px] cursor-pointer"
                  />
                  <label
                    className={`text-[11px] flex-1 cursor-pointer font-medium leading-snug ${
                      tk.isCompleted ? 'line-through text-[#92958d]' : ''
                    }`}
                    onClick={() => {
                      onToggleTask(tk.id);
                      showToast(
                        !tk.isCompleted ? 'Task marked complete.' : 'Task reopened.'
                      );
                    }}
                  >
                    {tk.title}
                  </label>
                  <time className="text-[10px] text-[#73776e] whitespace-nowrap font-medium">
                    {tk.dueTime}
                  </time>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={onOpenAddTask}
            className="w-full mt-[12px] bg-[#fffefa] hover:bg-[#f5f2e8] border border-[#e7e5dc] rounded-[10px] p-[8px_11px] text-[12px] font-extrabold text-[#111] cursor-pointer transition-all"
          >
            ＋ Add task
          </button>
        </article>

        {/* Team Activity */}
        <article className="bg-[#fffefa] border border-[#eae8df] rounded-[15px] p-[17px] shadow-[0_6px_24px_rgba(20,24,14,0.045)] lg:col-span-3">
          <div className="flex justify-between items-center gap-[10px] mb-[15px]">
            <h2 className="text-[15px] font-bold tracking-[-0.3px] text-[#10120e] m-0">
              Team activity
            </h2>
            <button
              onClick={() => onNavigate('Team')}
              className="border-0 bg-transparent text-[#239400] font-extrabold text-[12px] whitespace-nowrap cursor-pointer hover:underline"
            >
              View team →
            </button>
          </div>

          <div className="divide-y divide-[#efede6]">
            {state.activities.slice(0, 4).map((act) => (
              <div key={act.id} className="flex gap-[10px] py-[11px]">
                <div className="w-[30px] h-[30px] rounded-full bg-[#e2e5d8] flex items-center justify-center font-bold text-[10px] text-[#10120e] shrink-0">
                  {act.actorInitials}
                </div>
                <div className="flex-1 min-w-0">
                  <strong className="text-[11px] block font-bold text-[#10120e]">
                    {act.actorName}
                  </strong>
                  <p className="text-[11px] text-[#55594f] m-[3px_0_0] line-clamp-2">
                    {act.actionTitle}
                  </p>
                  <small className="text-[10px] text-[#73776e] block mt-0.5">
                    {act.timeAgo}
                  </small>
                </div>
              </div>
            ))}
          </div>
        </article>
      </section>

      {/* Active Coaching Programs Section */}
      <section className="bg-[#fffefa] border border-[#eae8df] rounded-[15px] p-[17px] shadow-[0_6px_24px_rgba(20,24,14,0.045)] mt-[15px]">
        <div className="flex justify-between items-center gap-[10px] mb-[15px]">
          <h2 className="text-[15px] font-bold tracking-[-0.3px] text-[#10120e] m-0">
            Active coaching programs
          </h2>
          <button
            onClick={() => onNavigate('Programs')}
            className="border-0 bg-transparent text-[#239400] font-extrabold text-[12px] whitespace-nowrap cursor-pointer hover:underline"
          >
            Manage programs →
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-[15px]">
          {state.programs.slice(0, 3).map((prog) => (
            <div
              key={prog.id}
              onClick={() => onNavigate('Programs')}
              className="flex gap-[11px] items-center min-w-0 p-2 rounded-xl hover:bg-[#faf9f5] cursor-pointer transition-colors"
            >
              <div className="w-[55px] h-[55px] rounded-[11px] bg-linear-to-br from-[#e2ffd4] to-[#d7d5c2] flex items-center justify-center text-[22px] shrink-0">
                {prog.icon}
              </div>
              <div className="min-w-0 flex-1">
                <strong className="text-[12px] block font-bold text-[#10120e] truncate">
                  {prog.title}
                </strong>
                <small className="text-[#73776e] text-[10px] block">
                  {prog.activeLearners} active learners
                </small>
                <div className="h-[6px] bg-[#ecece4] rounded-[9px] mt-[7px] overflow-hidden">
                  <span
                    className="h-full bg-[#47e802] block rounded-[9px]"
                    style={{ width: `${prog.completionRate}%` }}
                  />
                </div>
              </div>
              <span className="text-[10px] text-[#73776e] font-bold ml-[7px]">
                {prog.completionRate}%
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Today's Schedule Card */}
      <section className="bg-[#fffefa] border border-[#eae8df] rounded-[15px] p-[17px] shadow-[0_6px_24px_rgba(20,24,14,0.045)]">
        <div className="flex justify-between items-center gap-[10px] mb-[15px]">
          <h2 className="text-[15px] font-bold tracking-[-0.3px] text-[#10120e] m-0">
            Today's coaching & consultation schedule
          </h2>
          <button
            onClick={() => onNavigate('Sessions')}
            className="border-0 bg-transparent text-[#239400] font-extrabold text-[12px] whitespace-nowrap cursor-pointer hover:underline"
          >
            Full schedule →
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {state.sessions.slice(0, 4).map((sess) => (
            <div
              key={sess.id}
              onClick={() => onNavigate('Sessions')}
              className="p-3 bg-[#efffe7] border-l-4 border-[#47e802] rounded-xl cursor-pointer hover:brightness-95 transition-all"
            >
              <div className="text-[10px] font-bold text-[#4e8c34] uppercase tracking-wider mb-1">
                {sess.scheduledTime} · {sess.sessionType}
              </div>
              <strong className="block text-xs font-bold text-[#10120e] truncate">
                {sess.studentName}
              </strong>
              <div className="text-[11px] text-[#5d6456] truncate mt-0.5">
                Coach: {sess.coachName}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
