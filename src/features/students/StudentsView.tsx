import React, { useState } from 'react';
import { StudentItem } from '../../types/crm';

interface StudentsViewProps {
  students: StudentItem[];
  onOpenSchedule: (studentName: string, program: string) => void;
  onOpenPaymentRecord: () => void;
}

export const StudentsView: React.FC<StudentsViewProps> = ({
  students,
  onOpenSchedule,
  onOpenPaymentRecord,
}) => {
  const [filterProgram, setFilterProgram] = useState<string>('all');
  const [search, setSearch] = useState('');

  const filtered = students.filter((s) => {
    if (filterProgram !== 'all' && s.programTitle !== filterProgram) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        s.fullName.toLowerCase().includes(q) ||
        s.email.toLowerCase().includes(q) ||
        s.coachName.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
        <div>
          <div className="text-[11px] text-[#4e8c34] font-extrabold uppercase tracking-[1.5px]">
            Student Success & Coaching
          </div>
          <h1 className="text-2xl font-black text-[#10120e] tracking-tight">Active Students</h1>
          <p className="text-xs text-[#73776e]">
            Learner progress tracking, attendance benchmarks, and tuition verification
          </p>
        </div>
        <button
          onClick={onOpenPaymentRecord}
          className="bg-[#47e802] text-black font-black text-xs px-4 py-2.5 rounded-[10px] shadow-sm hover:brightness-95 cursor-pointer self-start sm:self-auto"
        >
          ₦ Record Tuition / Enroll
        </button>
      </div>

      <div className="bg-[#fffefa] border border-[#eae8df] rounded-xl p-3 flex flex-wrap items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-2">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search students or coach..."
            className="border border-[#e7e5dc] bg-[#fbfaf6] rounded-lg px-3 py-1.5 text-xs outline-none focus:border-[#47e802] w-[200px]"
          />
          <select
            value={filterProgram}
            onChange={(e) => setFilterProgram(e.target.value)}
            className="border border-[#e7e5dc] bg-white rounded-lg px-2.5 py-1.5 text-xs outline-none"
          >
            <option value="all">All Programs</option>
            <option value="AI & Automation Coaching">AI & Automation</option>
            <option value="Digital Marketing">Digital Marketing</option>
            <option value="SEO Mastery">SEO Mastery</option>
          </select>
        </div>

        <div className="text-xs text-[#73776e] font-semibold">
          {filtered.length} active students in current quarter
        </div>
      </div>

      <div className="bg-[#fffefa] border border-[#eae8df] rounded-xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse whitespace-nowrap text-left text-xs">
            <thead>
              <tr className="bg-[#f8f7f1] border-b border-[#eae8df]">
                <th className="p-3 font-bold text-[#74786f]">STUDENT</th>
                <th className="p-3 font-bold text-[#74786f]">PROGRAM & COHORT</th>
                <th className="p-3 font-bold text-[#74786f]">ASSIGNED COACH</th>
                <th className="p-3 font-bold text-[#74786f]">PROGRESS</th>
                <th className="p-3 font-bold text-[#74786f]">ATTENDANCE</th>
                <th className="p-3 font-bold text-[#74786f]">PAYMENT STATUS</th>
                <th className="p-3 font-bold text-[#74786f] text-right">SESSION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#efede6]">
              {filtered.map((st) => {
                const initials = st.fullName
                  .split(/\s+/)
                  .slice(0, 2)
                  .map((x) => x[0])
                  .join('')
                  .toUpperCase();

                return (
                  <tr key={st.id} className="hover:bg-[#faf9f5] transition-colors">
                    <td className="p-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-[#e2e5d8] flex items-center justify-center font-bold text-xs text-[#10120e]">
                          {initials}
                        </div>
                        <div>
                          <strong className="block text-[#10120e] font-bold">{st.fullName}</strong>
                          <span className="text-[#73776e] text-[11px] block">{st.phone}</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-3">
                      <span className="font-semibold text-[#10120e] block">{st.programTitle}</span>
                      <span className="text-[11px] text-gray-500">{st.cohort}</span>
                    </td>
                    <td className="p-3 font-medium text-[#10120e]">{st.coachName}</td>
                    <td className="p-3 min-w-[130px]">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 bg-[#ecece4] rounded-full overflow-hidden">
                          <div
                            className="h-full bg-[#47e802] rounded-full"
                            style={{ width: `${st.progressPercent}%` }}
                          />
                        </div>
                        <span className="font-bold text-[11px] text-[#10120e]">
                          {st.progressPercent}%
                        </span>
                      </div>
                    </td>
                    <td className="p-3">
                      <span className="font-bold text-[#2f9b00] bg-[#e9ffdf] px-2 py-0.5 rounded text-[11px]">
                        {st.attendanceRate}%
                      </span>
                    </td>
                    <td className="p-3">
                      {st.paymentStatus === 'verified' ? (
                        <span className="bg-[#e4fbd9] text-[#2f9b00] font-bold px-2 py-0.5 rounded text-[11px]">
                          ✓ Verified (₦{st.amountPaid.toLocaleString()})
                        </span>
                      ) : (
                        <span className="bg-[#fff2bb] text-[#8a6800] font-bold px-2 py-0.5 rounded text-[11px]">
                          Partial (Bal: ₦{st.balanceDue.toLocaleString()})
                        </span>
                      )}
                    </td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => onOpenSchedule(st.fullName, st.programTitle)}
                        className="px-2.5 py-1 bg-[#fffefa] hover:bg-[#efffe7] border border-[#a1f87d] text-[#2f9b00] font-bold rounded-lg text-[11px] cursor-pointer"
                      >
                        Book Call ▣
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
