import React from 'react';

export type NavPage =
  | 'Dashboard'
  | 'Leads'
  | 'Contacts'
  | 'Programs'
  | 'Sales Pipeline'
  | 'Students'
  | 'Sessions'
  | 'Tasks'
  | 'Team'
  | 'Reports'
  | 'Automations'
  | 'Settings';

interface SidebarProps {
  currentPage: NavPage;
  onSelectPage: (page: NavPage) => void;
  isOpen: boolean;
  onCloseMobile: () => void;
  onOpenSupport: () => void;
}

const navItems: { page: NavPage; icon: string; label: string }[] = [
  { page: 'Dashboard', icon: '▦', label: 'Dashboard' },
  { page: 'Leads', icon: '♙', label: 'Leads' },
  { page: 'Contacts', icon: '♧', label: 'Contacts' },
  { page: 'Programs', icon: '▤', label: 'Programs' },
  { page: 'Sales Pipeline', icon: '◫', label: 'Sales Pipeline' },
  { page: 'Students', icon: '♧', label: 'Students' },
  { page: 'Sessions', icon: '▣', label: 'Sessions' },
  { page: 'Tasks', icon: '☑', label: 'Tasks' },
  { page: 'Team', icon: '♙', label: 'Team' },
  { page: 'Reports', icon: '⌁', label: 'Reports' },
  { page: 'Automations', icon: '⚡', label: 'Automations' },
  { page: 'Settings', icon: '⚙', label: 'Settings' },
];

export const Sidebar: React.FC<SidebarProps> = ({
  currentPage,
  onSelectPage,
  isOpen,
  onCloseMobile,
  onOpenSupport,
}) => {
  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-30 md:hidden"
          onClick={onCloseMobile}
        />
      )}

      <aside
        className={`fixed md:sticky top-0 h-screen z-40 w-[238px] flex flex-col p-[22px_15px_16px] bg-[#f8f6ef] border-r border-[#e7e5dc] transition-all duration-200 ${
          isOpen ? 'left-0 shadow-2xl' : '-left-[250px] md:left-0'
        }`}
      >
        {/* Brand */}
        <div className="flex items-center gap-[10px] p-[4px_10px_28px]">
          <div className="w-[37px] height-[37px] h-[37px] rounded-[12px] bg-[#47e802] flex items-center justify-center font-black text-[18px] text-black shadow-[0_5px_15px_#47e80233]">
            D
          </div>
          <div>
            <strong className="text-[17px] tracking-[-0.6px] font-bold text-[#10120e] block leading-tight">
              DSP Academy
            </strong>
            <small className="block text-[9px] tracking-[1.5px] text-[#73776e] mt-[1px] font-semibold uppercase">
              COACHING CRM
            </small>
          </div>
        </div>

        {/* Navigation Label */}
        <div className="text-[10px] text-[#8a8d83] uppercase tracking-[1.3px] px-[12px] py-[9px] font-bold">
          Workspace
        </div>

        {/* Nav Items */}
        <nav className="flex flex-col gap-[4px] overflow-y-auto pr-1">
          {navItems.map((item) => {
            const isActive = currentPage === item.page;
            return (
              <button
                key={item.page}
                onClick={() => {
                  onSelectPage(item.page);
                  onCloseMobile();
                }}
                className={`flex items-center gap-[12px] w-full p-[11px_12px] border-0 text-left rounded-[11px] text-[13px] transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#47e802] text-[#111] font-bold shadow-[0_4px_12px_#47e80228]'
                    : 'text-[#32362e] font-medium hover:bg-[#eeede5]'
                }`}
              >
                <span className="w-[20px] text-center text-[16px]">{item.icon}</span>
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Bottom Help Area */}
        <div className="mt-auto pt-3">
          <div className="border border-[#e7e5dc] rounded-[14px] p-[15px] bg-[#fbfaf5]">
            <strong className="text-[13px] font-bold text-[#10120e] block">Need a hand?</strong>
            <p className="text-[12px] text-[#73776e] m-[6px_0_13px] leading-relaxed">
              Keep your coaching operation moving smoothly.
            </p>
            <button
              onClick={onOpenSupport}
              className="w-full bg-[#47e802] hover:brightness-95 border-0 rounded-[10px] p-[8px_11px] text-[12px] font-extrabold text-[#111] shadow-[0_3px_10px_#47e80225] cursor-pointer"
            >
              Contact support
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
