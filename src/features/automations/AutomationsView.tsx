import React from 'react';
import { AutomationRule } from '../../types/crm';

interface AutomationsViewProps {
  automations: AutomationRule[];
  onToggleAutomation: (id: string) => void;
}

export const AutomationsView: React.FC<AutomationsViewProps> = ({
  automations,
  onToggleAutomation,
}) => {
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
        <div>
          <div className="text-[11px] text-[#4e8c34] font-extrabold uppercase tracking-[1.5px]">
            Workflow Engine
          </div>
          <h1 className="text-2xl font-black text-[#10120e] tracking-tight">Automations</h1>
          <p className="text-xs text-[#73776e]">
            Event triggers, automatic task creation, lead assignment, and SLA alerts
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {automations.map((rule) => (
          <div
            key={rule.id}
            className="bg-[#fffefa] border border-[#eae8df] rounded-2xl p-5 shadow-xs space-y-3"
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-bold text-[#4e8c34] uppercase tracking-wider block">
                  Trigger & Action Pipeline
                </span>
                <h3 className="text-sm font-bold text-[#10120e] mt-0.5">{rule.name}</h3>
              </div>
              <button
                onClick={() => onToggleAutomation(rule.id)}
                className={`w-11 h-6 rounded-full transition-colors cursor-pointer relative p-0.5 ${
                  rule.isActive ? 'bg-[#47e802]' : 'bg-gray-300'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white shadow-xs transition-transform ${
                    rule.isActive ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            <div className="bg-[#f8f6ef] p-3 rounded-xl space-y-2 text-xs border border-[#efede6]">
              <div>
                <span className="text-gray-500 block text-[10px] font-bold uppercase">When this happens:</span>
                <span className="font-semibold text-[#10120e]">{rule.triggerEvent}</span>
              </div>
              <div className="pt-1 border-t border-[#e7e5dc]">
                <span className="text-gray-500 block text-[10px] font-bold uppercase">Automatically execute:</span>
                <span className="text-[#55594f]">{rule.actionSummary}</span>
              </div>
            </div>

            <div className="flex justify-between items-center text-[11px] text-gray-500 pt-1">
              <span>Executed: <b>{rule.executionCount} times</b></span>
              <span>Last fired: <b>{rule.lastRun || 'Recent'}</b></span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
