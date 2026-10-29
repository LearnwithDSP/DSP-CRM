import React from 'react';
import { ProgramItem, StudentItem } from '../../types/crm';

interface ProgramsViewProps {
  programs: ProgramItem[];
  students: StudentItem[];
  onSelectProgram?: (program: ProgramItem) => void;
  onOpenAddLead: () => void;
}

export const ProgramsView: React.FC<ProgramsViewProps> = ({
  programs,
  students,
  onOpenAddLead,
}) => {
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
        <div>
          <div className="text-[11px] text-[#4e8c34] font-extrabold uppercase tracking-[1.5px]">
            Curriculum & Delivery
          </div>
          <h1 className="text-2xl font-black text-[#10120e] tracking-tight">Coaching Programs</h1>
          <p className="text-xs text-[#73776e]">
            Official training tracks, cohorts, learner capacity and completion performance
          </p>
        </div>
        <button
          onClick={onOpenAddLead}
          className="bg-[#47e802] text-black font-black text-xs px-4 py-2.5 rounded-[10px] shadow-sm hover:brightness-95 cursor-pointer self-start sm:self-auto"
        >
          ＋ Enroll Student to Track
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {programs.map((prog) => {
          const enrolledStudents = students.filter(
            (s) => s.programTitle.toLowerCase() === prog.title.toLowerCase()
          );

          return (
            <div
              key={prog.id}
              className="bg-[#fffefa] border border-[#eae8df] rounded-2xl p-5 shadow-xs space-y-4 hover:border-[#47e802] transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-2xl bg-linear-to-br from-[#e2ffd4] to-[#d7d5c2] flex items-center justify-center text-2xl font-bold">
                    {prog.icon}
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-[#4e8c34] uppercase tracking-wider block">
                      {prog.category} · {prog.code}
                    </span>
                    <h2 className="text-lg font-bold text-[#10120e] leading-snug">{prog.title}</h2>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-base font-black text-[#2f9b00]">
                    ₦{prog.priceNGN.toLocaleString()}
                  </div>
                  <span className="text-[10px] text-gray-500">Standard Tuition</span>
                </div>
              </div>

              <p className="text-xs text-[#55594f] leading-relaxed">{prog.description}</p>

              {/* Progress & Stats */}
              <div className="bg-[#f8f6ef] p-3 rounded-xl space-y-2 border border-[#efede6]">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-[#10120e]">Cohort Completion Benchmark</span>
                  <span className="font-extrabold text-[#2f9b00]">{prog.completionRate}%</span>
                </div>
                <div className="h-2 bg-[#ecece4] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#47e802] rounded-full"
                    style={{ width: `${prog.completionRate}%` }}
                  />
                </div>
                <div className="flex justify-between text-[11px] text-gray-500 pt-1">
                  <span>Active learners: <b>{prog.activeLearners}</b></span>
                  <span>Cohort capacity: <b>{prog.capacity}</b></span>
                </div>
              </div>

              {/* Enrolled Students preview */}
              <div>
                <div className="text-[11px] uppercase font-bold text-[#73776e] mb-1.5">
                  Recent Enrollees ({enrolledStudents.length} in Active Cohort)
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {enrolledStudents.slice(0, 4).map((st) => (
                    <span
                      key={st.id}
                      className="px-2 py-1 bg-white border border-[#e7e5dc] rounded-md text-[11px] font-medium text-[#10120e]"
                    >
                      {st.fullName} ({st.progressPercent}%)
                    </span>
                  ))}
                  {enrolledStudents.length === 0 && (
                    <span className="text-xs text-gray-400">Cohort intake open for next cycle</span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
