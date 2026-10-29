import React, { useState } from 'react';
import { StaffProfile, ProgramItem } from '../types/crm';

interface ScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  staffList: StaffProfile[];
  programs: ProgramItem[];
  prefilledStudent?: string;
  prefilledProgram?: string;
  onConfirmSchedule: (session: {
    studentName: string;
    coachName: string;
    programTitle: string;
    sessionType: 'Consultation' | '1-on-1 Coaching' | 'Masterclass Review' | 'Project Audit' | 'Strategy Session';
    scheduledTime: string;
    dateStr: string;
    durationMinutes?: number;
  }) => void;
}

export const ScheduleModal: React.FC<ScheduleModalProps> = ({
  isOpen,
  onClose,
  staffList,
  programs,
  prefilledStudent = '',
  prefilledProgram = '',
  onConfirmSchedule,
}) => {
  const [studentName, setStudentName] = useState(prefilledStudent);
  const [coachName, setCoachName] = useState(staffList[0]?.fullName || 'Patrick Ezeji');
  const [programTitle, setProgramTitle] = useState(prefilledProgram || programs[0]?.title || 'AI & Automation Coaching');
  const [sessionType, setSessionType] = useState<'Consultation' | '1-on-1 Coaching' | 'Masterclass Review' | 'Project Audit' | 'Strategy Session'>('Consultation');
  const [scheduledTime, setScheduledTime] = useState('11:00 AM');
  const [dateStr, setDateStr] = useState('Tomorrow');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentName.trim()) return;

    onConfirmSchedule({
      studentName: studentName.trim(),
      coachName,
      programTitle,
      sessionType,
      scheduledTime,
      dateStr,
      durationMinutes: sessionType === 'Masterclass Review' ? 90 : 45,
    });

    onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-[#1118] backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-150"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="w-[min(500px,100%)] bg-[#fffefa] border border-[#e7e5dc] rounded-[18px] p-6 shadow-2xl">
        <h2 className="text-xl font-bold text-[#10120e] mb-1">Book Coaching / Consultation</h2>
        <p className="text-xs text-[#73776e] mb-4">
          Reserve instructor calendar slots and send calendar invites.
        </p>

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div className="flex flex-col gap-1">
            <label className="text-[11px] font-bold text-[#10120e]">Student or Prospect Name *</label>
            <input
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
              required
              placeholder="e.g. Adaobi S."
              className="border border-[#e7e5dc] bg-white rounded-lg p-2.5 text-xs outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-bold text-[#10120e]">Assigned Coach / Host</label>
              <select
                value={coachName}
                onChange={(e) => setCoachName(e.target.value)}
                className="border border-[#e7e5dc] bg-white rounded-lg p-2.5 text-xs outline-none"
              >
                {staffList.map((st) => (
                  <option key={st.id} value={st.fullName}>
                    {st.fullName}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-bold text-[#10120e]">Session Format</label>
              <select
                value={sessionType}
                onChange={(e: any) => setSessionType(e.target.value)}
                className="border border-[#e7e5dc] bg-white rounded-lg p-2.5 text-xs outline-none"
              >
                <option value="Consultation">Consultation (30-45m)</option>
                <option value="1-on-1 Coaching">1-on-1 Coaching (45m)</option>
                <option value="Strategy Session">Strategy Session (60m)</option>
                <option value="Project Audit">Project Audit (45m)</option>
                <option value="Masterclass Review">Masterclass Review (90m)</option>
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-bold text-[#10120e]">Date</label>
              <select
                value={dateStr}
                onChange={(e) => setDateStr(e.target.value)}
                className="border border-[#e7e5dc] bg-white rounded-lg p-2.5 text-xs outline-none"
              >
                <option value="Today">Today</option>
                <option value="Tomorrow">Tomorrow</option>
                <option value="In 2 Days">In 2 Days</option>
                <option value="This Friday">This Friday</option>
                <option value="Next Monday">Next Monday</option>
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-bold text-[#10120e]">Scheduled Time</label>
              <input
                value={scheduledTime}
                onChange={(e) => setScheduledTime(e.target.value)}
                placeholder="02:00 PM"
                className="border border-[#e7e5dc] bg-white rounded-lg p-2.5 text-xs outline-none"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[11px] font-bold text-[#10120e]">Program Track</label>
            <select
              value={programTitle}
              onChange={(e) => setProgramTitle(e.target.value)}
              className="border border-[#e7e5dc] bg-white rounded-lg p-2.5 text-xs outline-none"
            >
              {programs.map((p) => (
                <option key={p.id} value={p.title}>
                  {p.title}
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-[#e7e5dc]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-white border border-[#e7e5dc] text-xs font-bold rounded-lg cursor-pointer hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-[#47e802] border-0 text-xs font-black text-black rounded-lg shadow-sm hover:brightness-95 cursor-pointer"
            >
              Confirm Booking
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
