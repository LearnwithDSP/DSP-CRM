import React, { useState } from 'react';
import { StaffProfile } from '../types/crm';

interface AddTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  staffList: StaffProfile[];
  onSaveTask: (task: {
    title: string;
    assignee?: string;
    dueTime?: string;
    dueDate?: string;
    priority?: 'low' | 'medium' | 'high' | 'urgent';
    relatedContact?: string;
  }) => void;
}

export const AddTaskModal: React.FC<AddTaskModalProps> = ({
  isOpen,
  onClose,
  staffList,
  onSaveTask,
}) => {
  const [title, setTitle] = useState('');
  const [assignee, setAssignee] = useState(staffList[0]?.fullName || 'Chika Nwosu');
  const [dueTime, setDueTime] = useState('11:00');
  const [dueDate, setDueDate] = useState('Today');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high' | 'urgent'>('medium');
  const [relatedContact, setRelatedContact] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onSaveTask({
      title: title.trim(),
      assignee,
      dueTime,
      dueDate,
      priority,
      relatedContact: relatedContact.trim() || undefined,
    });

    setTitle('');
    setRelatedContact('');
    onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-[#1118] backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-150"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="w-[min(480px,100%)] bg-[#fffefa] border border-[#e7e5dc] rounded-[18px] p-[23px] shadow-[0_25px_80px_#0003]">
        <h2 className="m-[0_0_5px] text-[20px] font-bold text-[#10120e]">Add a new task</h2>
        <p className="m-[0_0_18px] text-[#73776e] text-[12px]">
          Assign clear responsibilities and track operational follow-ups.
        </p>

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-bold text-[#10120e]">Task title / action *</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              placeholder="e.g. Follow up on payment invoice with Tomi"
              className="border border-[#e7e5dc] bg-white rounded-[9px] p-[10px] outline-none text-[13px] focus:border-[#47e802] focus:ring-2 focus:ring-[#47e802]/20"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold text-[#10120e]">Assignee</label>
              <select
                value={assignee}
                onChange={(e) => setAssignee(e.target.value)}
                className="border border-[#e7e5dc] bg-white rounded-[9px] p-[10px] outline-none text-[13px]"
              >
                {staffList.map((st) => (
                  <option key={st.id} value={st.fullName}>
                    {st.fullName} ({st.role.replace('_', ' ')})
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold text-[#10120e]">Priority level</label>
              <select
                value={priority}
                onChange={(e: any) => setPriority(e.target.value)}
                className="border border-[#e7e5dc] bg-white rounded-[9px] p-[10px] outline-none text-[13px]"
              >
                <option value="low">Low Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="high">High Priority</option>
                <option value="urgent">Urgent / Immediate</option>
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold text-[#10120e]">Due Date</label>
              <select
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="border border-[#e7e5dc] bg-white rounded-[9px] p-[10px] outline-none text-[13px]"
              >
                <option value="Today">Today</option>
                <option value="Tomorrow">Tomorrow</option>
                <option value="This Friday">This Friday</option>
                <option value="Next Week">Next Week</option>
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold text-[#10120e]">Due Time</label>
              <input
                type="text"
                value={dueTime}
                onChange={(e) => setDueTime(e.target.value)}
                placeholder="10:30 AM"
                className="border border-[#e7e5dc] bg-white rounded-[9px] p-[10px] outline-none text-[13px]"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-bold text-[#10120e]">
              Related Contact or Lead (Optional)
            </label>
            <input
              value={relatedContact}
              onChange={(e) => setRelatedContact(e.target.value)}
              placeholder="e.g. Adaobi S."
              className="border border-[#e7e5dc] bg-white rounded-[9px] p-[10px] outline-none text-[13px]"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-[#e7e5dc]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-white border border-[#e7e5dc] text-[13px] font-bold rounded-[10px] cursor-pointer hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-[#47e802] border-0 text-[13px] font-black text-black rounded-[10px] shadow-[0_3px_10px_#47e80225] cursor-pointer hover:brightness-95"
            >
              Add task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
