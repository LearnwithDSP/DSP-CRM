import React, { useState } from 'react';
import { CoachingSession } from '../../types/crm';

interface SessionsViewProps {
  sessions: CoachingSession[];
  onOpenBookSession: () => void;
}

export const SessionsView: React.FC<SessionsViewProps> = ({
  sessions,
  onOpenBookSession,
}) => {
  const [filterType, setFilterType] = useState<string>('all');

  const filtered = sessions.filter((s) => {
    if (filterType !== 'all' && s.sessionType !== filterType) return false;
    return true;
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
        <div>
          <div className="text-[11px] text-[#4e8c34] font-extrabold uppercase tracking-[1.5px]">
            Mentorship & Advisory
          </div>
          <h1 className="text-2xl font-black text-[#10120e] tracking-tight">Coaching Sessions</h1>
          <p className="text-xs text-[#73776e]">
            Calendar bookings, strategy reviews, and student consultations
          </p>
        </div>
        <button
          onClick={onOpenBookSession}
          className="bg-[#47e802] text-black font-black text-xs px-4 py-2.5 rounded-[10px] shadow-sm hover:brightness-95 cursor-pointer self-start sm:self-auto"
        >
          ＋ Book Session
        </button>
      </div>

      <div className="bg-[#fffefa] border border-[#eae8df] rounded-xl p-3 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-2">
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="border border-[#e7e5dc] bg-white rounded-lg px-2.5 py-1.5 text-xs outline-none font-medium"
          >
            <option value="all">All Session Types</option>
            <option value="Consultation">Consultation</option>
            <option value="1-on-1 Coaching">1-on-1 Coaching</option>
            <option value="Masterclass Review">Masterclass Review</option>
            <option value="Strategy Session">Strategy Session</option>
          </select>
        </div>
        <span className="text-xs text-[#73776e] font-semibold">
          {filtered.length} scheduled sessions
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {filtered.map((s) => (
          <div
            key={s.id}
            className="bg-[#fffefa] border border-[#eae8df] rounded-xl p-4 shadow-xs space-y-3 hover:border-[#47e802] transition-colors"
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-bold text-[#4e8c34] uppercase tracking-wider block">
                  {s.dateStr} · {s.scheduledTime} ({s.durationMinutes}m)
                </span>
                <h3 className="text-sm font-bold text-[#10120e] mt-0.5">{s.title}</h3>
              </div>
              <span className="bg-[#efffe7] text-[#2f9b00] border border-[#a1f87d] px-2 py-0.5 rounded text-[11px] font-bold">
                {s.status}
              </span>
            </div>

            <div className="bg-[#f8f6ef] p-2.5 rounded-lg text-xs space-y-1 border border-[#efede6]">
              <div className="flex justify-between">
                <span className="text-gray-500">Student:</span>
                <span className="font-semibold text-[#10120e]">{s.studentName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Instructor:</span>
                <span className="font-medium text-[#10120e]">{s.coachName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Track:</span>
                <span className="text-[#55594f]">{s.programTitle}</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1 text-xs">
              <span className="text-[#73776e] text-[11px]">Google Meet / Zoom link active</span>
              <button
                onClick={() => alert(`Starting meeting for ${s.studentName}`)}
                className="bg-[#10120e] text-white px-3 py-1.5 rounded-lg font-bold text-xs hover:bg-black cursor-pointer"
              >
                Join Room ↗
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
