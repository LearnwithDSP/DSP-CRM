import React, { useState } from 'react';
import { StaffProfile } from '../types/crm';
import { isSupabaseConfigured } from '../lib/supabase';

interface TopbarProps {
  onToggleMobileMenu: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  currentUser: StaffProfile;
  staffList: StaffProfile[];
  onSelectUser: (staffId: string) => void;
  onOpenNotifications: () => void;
  onOpenSettings: () => void;
}

export const Topbar: React.FC<TopbarProps> = ({
  onToggleMobileMenu,
  searchQuery,
  onSearchChange,
  currentUser,
  staffList,
  onSelectUser,
  onOpenNotifications,
  onOpenSettings,
}) => {
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  return (
    <header className="h-[72px] border-b border-[#e7e5dc] flex items-center justify-between gap-[18px] px-4 md:px-[28px] bg-[#f7f5ee]/80 sticky top-0 z-20 backdrop-blur-sm">
      <div className="flex items-center gap-3 flex-1 max-w-[540px]">
        {/* Mobile menu button */}
        <button
          onClick={onToggleMobileMenu}
          className="md:hidden w-[38px] h-[38px] border border-[#e7e5dc] bg-[#fffefa] rounded-[11px] flex items-center justify-center text-[18px] text-[#10120e] cursor-pointer hover:bg-white"
          aria-label="Open menu"
        >
          ☰
        </button>

        {/* Search */}
        <div className="w-full relative">
          <span className="absolute left-[13px] top-[9px] text-[17px] text-[#73776e] pointer-events-none">
            ⌕
          </span>
          <input
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search leads, clients, programs or staff…"
            className="w-full border border-[#e4e1d7] bg-[#fbfaf6] rounded-[11px] p-[11px_14px_11px_39px] text-[13px] outline-none focus:border-[#47e802] focus:ring-2 focus:ring-[#47e802]/20 transition-all text-[#10120e]"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-[10px] text-xs text-gray-400 hover:text-black"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* User area */}
      <div className="flex items-center gap-[11px] relative">
        {/* Supabase status badge */}
        <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border border-[#e7e5dc] bg-[#fffefa]">
          <span
            className={`w-2 h-2 rounded-full ${
              isSupabaseConfigured ? 'bg-[#47e802]' : 'bg-amber-400'
            }`}
          />
          <span className="text-[#55594f]">
            {isSupabaseConfigured ? 'Supabase Live' : 'Offline / Local Store'}
          </span>
        </div>

        {/* Notification Bell */}
        <button
          onClick={onOpenNotifications}
          className="w-[38px] h-[38px] border border-[#e7e5dc] bg-[#fffefa] rounded-[11px] relative flex items-center justify-center cursor-pointer hover:bg-white text-[17px]"
          aria-label="Notifications"
        >
          ♧
          <i className="absolute w-[8px] h-[8px] rounded-full bg-[#47e802] right-[8px] top-[7px]" />
        </button>

        {/* User profile toggle */}
        <div
          onClick={() => setShowUserDropdown(!showUserDropdown)}
          className="flex items-center gap-[11px] cursor-pointer p-1 rounded-xl hover:bg-[#eae8df]/50 transition-all"
        >
          <div className="w-[36px] h-[36px] rounded-full bg-[#e2e5d8] flex items-center justify-center font-bold text-[12px] text-[#10120e]">
            {currentUser.avatarInitials}
          </div>
          <div className="hidden sm:block text-left">
            <strong className="block text-[12px] font-bold text-[#10120e] leading-tight">
              {currentUser.fullName}
            </strong>
            <small className="block text-[11px] text-[#73776e]">
              {currentUser.role === 'owner' ? 'Owner · DSP Academy' : `${currentUser.department}`}
            </small>
          </div>
          <button
            className="w-[28px] h-[28px] border border-[#e7e5dc] bg-[#fffefa] rounded-[8px] flex items-center justify-center text-[12px] cursor-pointer"
            aria-label="Profile options"
          >
            ⌄
          </button>
        </div>

        {/* Role & User Switcher Dropdown */}
        {showUserDropdown && (
          <div className="absolute right-0 top-[54px] w-[260px] bg-[#fffefa] border border-[#e7e5dc] rounded-2xl shadow-xl p-3 z-50 animate-in fade-in slide-in-from-top-2">
            <div className="px-2 py-1.5 border-b border-[#e7e5dc] mb-2">
              <div className="text-[11px] font-bold uppercase tracking-wider text-[#73776e]">
                Active Staff Profile
              </div>
              <div className="font-bold text-[13px] text-[#10120e]">{currentUser.fullName}</div>
              <div className="text-[11px] text-[#73776e]">{currentUser.email}</div>
            </div>

            <div className="text-[10px] uppercase font-bold text-[#8a8d83] px-2 py-1">
              Switch User / Role (RBAC)
            </div>
            <div className="space-y-1 max-h-[190px] overflow-y-auto">
              {staffList.map((st) => (
                <button
                  key={st.id}
                  onClick={() => {
                    onSelectUser(st.id);
                    setShowUserDropdown(false);
                  }}
                  className={`w-full flex items-center gap-2 p-2 rounded-lg text-left text-xs transition-all ${
                    st.id === currentUser.id
                      ? 'bg-[#efffe7] text-[#10120e] font-bold'
                      : 'hover:bg-[#f5f2e8] text-[#55594f]'
                  }`}
                >
                  <div className="w-6 h-6 rounded-full bg-[#e2e5d8] text-[10px] flex items-center justify-center font-bold">
                    {st.avatarInitials}
                  </div>
                  <div className="flex-1 truncate">
                    <span className="block truncate">{st.fullName}</span>
                    <span className="text-[10px] text-gray-400 capitalize">{st.role.replace('_', ' ')}</span>
                  </div>
                  {st.id === currentUser.id && <span className="text-[#47e802] font-black">✓</span>}
                </button>
              ))}
            </div>

            <div className="border-t border-[#e7e5dc] mt-2 pt-2">
              <button
                onClick={() => {
                  setShowUserDropdown(false);
                  onOpenSettings();
                }}
                className="w-full text-left px-2 py-1.5 text-xs text-[#10120e] font-semibold hover:bg-[#f5f2e8] rounded-md flex items-center justify-between"
              >
                <span>Database & Settings</span>
                <span>⚙</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
