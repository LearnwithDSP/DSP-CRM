import React, { useState } from 'react';
import { TaskItem } from '../../types/crm';

interface TasksViewProps {
  tasks: TaskItem[];
  onToggleTask: (taskId: string) => void;
  onOpenAddTask: () => void;
}

export const TasksView: React.FC<TasksViewProps> = ({
  tasks,
  onToggleTask,
  onOpenAddTask,
}) => {
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed' | 'high'>('all');

  const filtered = tasks.filter((t) => {
    if (filter === 'pending') return !t.isCompleted;
    if (filter === 'completed') return t.isCompleted;
    if (filter === 'high') return t.priority === 'high' || t.priority === 'urgent';
    return true;
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
        <div>
          <div className="text-[11px] text-[#4e8c34] font-extrabold uppercase tracking-[1.5px]">
            Operations & Accountability
          </div>
          <h1 className="text-2xl font-black text-[#10120e] tracking-tight">Staff Tasks</h1>
          <p className="text-xs text-[#73776e]">
            Follow-ups, prospect outreach, onboarding milestones, and SLA deadlines
          </p>
        </div>
        <button
          onClick={onOpenAddTask}
          className="bg-[#47e802] text-black font-black text-xs px-4 py-2.5 rounded-[10px] shadow-sm hover:brightness-95 cursor-pointer self-start sm:self-auto"
        >
          ＋ Add Task
        </button>
      </div>

      <div className="bg-[#fffefa] border border-[#eae8df] rounded-xl p-3 flex flex-wrap items-center justify-between gap-3 shadow-xs">
        <div className="flex gap-1.5 bg-[#f5f2e8] p-1 rounded-xl">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-all ${
              filter === 'all' ? 'bg-white text-black shadow-xs' : 'text-[#73776e]'
            }`}
          >
            All Tasks ({tasks.length})
          </button>
          <button
            onClick={() => setFilter('pending')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-all ${
              filter === 'pending' ? 'bg-white text-black shadow-xs' : 'text-[#73776e]'
            }`}
          >
            Pending ({tasks.filter((t) => !t.isCompleted).length})
          </button>
          <button
            onClick={() => setFilter('high')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-all ${
              filter === 'high' ? 'bg-white text-black shadow-xs' : 'text-[#73776e]'
            }`}
          >
            High & Urgent
          </button>
          <button
            onClick={() => setFilter('completed')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-all ${
              filter === 'completed' ? 'bg-white text-black shadow-xs' : 'text-[#73776e]'
            }`}
          >
            Completed ({tasks.filter((t) => t.isCompleted).length})
          </button>
        </div>
      </div>

      <div className="bg-[#fffefa] border border-[#eae8df] rounded-xl shadow-xs divide-y divide-[#efede6] overflow-hidden">
        {filtered.map((t) => (
          <div
            key={t.id}
            className={`p-4 flex items-start gap-3.5 hover:bg-[#faf9f5] transition-colors ${
              t.isCompleted ? 'bg-gray-50/50' : ''
            }`}
          >
            <input
              type="checkbox"
              checked={t.isCompleted}
              onChange={() => onToggleTask(t.id)}
              className="accent-[#47e802] w-5 h-5 mt-0.5 cursor-pointer"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <span
                  className={`text-sm font-bold block ${
                    t.isCompleted ? 'line-through text-gray-400' : 'text-[#10120e]'
                  }`}
                >
                  {t.title}
                </span>
                <span
                  className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${
                    t.priority === 'urgent'
                      ? 'bg-red-100 text-red-700'
                      : t.priority === 'high'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-[#f5f2e8] text-gray-600'
                  }`}
                >
                  {t.priority}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-3 mt-1.5 text-xs text-[#73776e]">
                <span>Assignee: <b className="text-[#10120e]">{t.assignee}</b></span>
                <span>Due: <b className="text-[#10120e]">{t.dueDate} at {t.dueTime}</b></span>
                {t.relatedContact && (
                  <span className="bg-[#f8f6ef] px-2 py-0.5 rounded border border-[#efede6]">
                    Related: {t.relatedContact}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
