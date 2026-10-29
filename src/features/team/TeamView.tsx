import React from 'react';
import { StaffProfile, ActivityItem } from '../../types/crm';

interface TeamViewProps {
  staffList: StaffProfile[];
  activities: ActivityItem[];
  currentUser: StaffProfile;
  onSelectUser: (staffId: string) => void;
}

export const TeamView: React.FC<TeamViewProps> = ({
  staffList,
  activities,
  currentUser,
  onSelectUser,
}) => {
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
        <div>
          <div className="text-[11px] text-[#4e8c34] font-extrabold uppercase tracking-[1.5px]">
            Personnel & Workload
          </div>
          <h1 className="text-2xl font-black text-[#10120e] tracking-tight">Staff & Coaches</h1>
          <p className="text-xs text-[#73776e]">
            Performance scorecards, assigned lead capacity, and execution tracking
          </p>
        </div>
      </div>

      {/* Staff Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {staffList.map((st) => {
          const isMe = st.id === currentUser.id;

          return (
            <div
              key={st.id}
              className={`bg-[#fffefa] border rounded-2xl p-4 shadow-xs space-y-3 transition-all ${
                isMe ? 'border-[#47e802] ring-2 ring-[#47e802]/20' : 'border-[#eae8df]'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-[#e2e5d8] flex items-center justify-center font-black text-sm text-[#10120e]">
                    {st.avatarInitials}
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-[#10120e] flex items-center gap-1.5">
                      {st.fullName}
                      {isMe && (
                        <span className="text-[10px] bg-[#efffe7] text-[#2f9b00] px-1.5 py-0.5 rounded font-extrabold">
                          Active User
                        </span>
                      )}
                    </h3>
                    <span className="text-[11px] text-[#73776e] block">{st.department}</span>
                  </div>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-[#f5f2e8] px-2 py-0.5 rounded text-[#55594f]">
                  {st.role.replace('_', ' ')}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs bg-[#f8f6ef] p-2.5 rounded-xl border border-[#efede6]">
                <div>
                  <span className="text-gray-500 text-[10px] block">Active Leads</span>
                  <span className="font-bold text-[#10120e]">{st.activeLeadsCount || 15} assigned</span>
                </div>
                <div>
                  <span className="text-gray-500 text-[10px] block">Closing Rate</span>
                  <span className="font-bold text-[#2f9b00]">{st.conversionRate || 28}%</span>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs pt-1 border-t border-[#efede6]">
                <span className="text-[#73776e] text-[11px] truncate max-w-[150px]">{st.email}</span>
                <button
                  onClick={() => onSelectUser(st.id)}
                  className="px-3 py-1 bg-white hover:bg-gray-50 border border-[#e7e5dc] rounded-lg text-xs font-bold text-[#10120e] cursor-pointer"
                >
                  {isMe ? 'Selected' : 'Simulate Role'}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Staff Audit Timeline */}
      <div className="bg-[#fffefa] border border-[#eae8df] rounded-2xl p-5 shadow-xs space-y-3">
        <h2 className="text-base font-bold text-[#10120e]">Recent Staff Activity Ledger</h2>
        <div className="divide-y divide-[#efede6]">
          {activities.slice(0, 6).map((act) => (
            <div key={act.id} className="py-2.5 flex items-start gap-3 text-xs">
              <div className="w-7 h-7 rounded-full bg-[#e2e5d8] flex items-center justify-center font-bold text-[10px] text-[#10120e] shrink-0">
                {act.actorInitials}
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-center">
                  <strong className="font-bold text-[#10120e]">{act.actorName}</strong>
                  <span className="text-gray-400 text-[10px]">{act.timeAgo}</span>
                </div>
                <div className="font-medium text-[#10120e]">{act.actionTitle}</div>
                <div className="text-gray-500 text-[11px] mt-0.5">{act.description}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
