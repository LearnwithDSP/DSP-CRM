import React, { useState } from 'react';
import { isSupabaseConfigured } from '../../lib/supabase';
import { StaffProfile, UserRole } from '../../types/crm';
import { CrmState } from '../../services/crmStore';

interface SettingsViewProps {
  state: CrmState;
  currentUser: StaffProfile;
  staffList: StaffProfile[];
  onSelectUser: (staffId: string) => void;
  onResetData: () => void;
  showToast: (msg: string) => void;
}

const SQL_MIGRATION_PREVIEW = `-- Run this in your Supabase SQL Editor:
-- supabase/migrations/20261028000000_dsp_crm_init.sql

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  role TEXT NOT NULL DEFAULT 'sales_rep',
  avatar_initials TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS public.opportunities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  contact_id UUID NOT NULL,
  title TEXT NOT NULL,
  stage TEXT NOT NULL DEFAULT 'New Lead',
  source TEXT NOT NULL DEFAULT 'Website',
  estimated_value NUMERIC(12, 2) DEFAULT 0,
  lead_score INT DEFAULT 50,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Full schema with RLS and foreign keys is saved in supabase/migrations/`;

export const SettingsView: React.FC<SettingsViewProps> = ({
  state,
  currentUser,
  staffList,
  onSelectUser,
  onResetData,
  showToast,
}) => {
  const [copiedSql, setCopiedSql] = useState(false);

  const handleCopySql = () => {
    navigator.clipboard.writeText(SQL_MIGRATION_PREVIEW);
    setCopiedSql(true);
    showToast('SQL migration schema copied to clipboard!');
    setTimeout(() => setCopiedSql(false), 2000);
  };

  const handleExportJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(state, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `dsp_coaching_crm_export_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast('CRM data exported successfully.');
  };

  return (
    <div className="space-y-5 max-w-4xl">
      <div>
        <div className="text-[11px] text-[#4e8c34] font-extrabold uppercase tracking-[1.5px]">
          System & Architecture
        </div>
        <h1 className="text-2xl font-black text-[#10120e] tracking-tight">Settings & Integrations</h1>
        <p className="text-xs text-[#73776e]">
          Supabase database provisioning, role simulation, and database migration files
        </p>
      </div>

      {/* Supabase Status Card */}
      <div className="bg-[#fffefa] border border-[#eae8df] rounded-2xl p-5 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-lg ${
                isSupabaseConfigured
                  ? 'bg-[#efffe7] text-[#2f9b00] border border-[#a1f87d]'
                  : 'bg-amber-100 text-amber-800'
              }`}
            >
              ⚡
            </div>
            <div>
              <h2 className="font-bold text-sm text-[#10120e]">Supabase Database & Auth</h2>
              <span className="text-xs text-[#73776e]">
                {isSupabaseConfigured
                  ? 'Connected to live Supabase project'
                  : 'Running in resilient offline mode with local browser persistence'}
              </span>
            </div>
          </div>
          <span
            className={`text-xs font-bold px-3 py-1 rounded-full ${
              isSupabaseConfigured
                ? 'bg-[#e4fbd9] text-[#2f9b00]'
                : 'bg-amber-100 text-amber-800'
            }`}
          >
            {isSupabaseConfigured ? 'Connected' : 'Offline / Local Fallback'}
          </span>
        </div>

        <div className="bg-[#f8f6ef] p-3.5 rounded-xl text-xs space-y-2 border border-[#efede6]">
          <div className="font-bold text-[#10120e]">How to connect your production Supabase project:</div>
          <ol className="list-decimal pl-4 space-y-1 text-[#55594f]">
            <li>
              Add <code>VITE_SUPABASE_URL</code> and <code>VITE_SUPABASE_ANON_KEY</code> to your environment or Vercel dashboard.
            </li>
            <li>
              Run the SQL migration located in <code>supabase/migrations/20261028000000_dsp_crm_init.sql</code> inside the Supabase SQL Editor.
            </li>
            <li>
              Enable Email Auth in Supabase Authentication settings.
            </li>
          </ol>
        </div>

        <div>
          <div className="flex justify-between items-center mb-1.5">
            <span className="text-xs font-bold text-[#10120e]">Supabase Schema Preview:</span>
            <button
              onClick={handleCopySql}
              className="text-xs bg-white border border-[#e7e5dc] px-2.5 py-1 rounded font-bold hover:bg-gray-50 cursor-pointer"
            >
              {copiedSql ? '✓ Copied' : 'Copy SQL Script'}
            </button>
          </div>
          <pre className="bg-[#10120e] text-[#47e802] p-3 rounded-xl text-[11px] overflow-x-auto font-mono">
            {SQL_MIGRATION_PREVIEW}
          </pre>
        </div>
      </div>

      {/* Role-Based Access Control Simulation */}
      <div className="bg-[#fffefa] border border-[#eae8df] rounded-2xl p-5 shadow-xs space-y-3">
        <h2 className="font-bold text-sm text-[#10120e]">Role-Based Access Control (RBAC) Testing</h2>
        <p className="text-xs text-[#73776e]">
          Switch active user persona to verify permissions and role segregation across sales, coaching, and finance.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 pt-1">
          {staffList.map((st) => (
            <button
              key={st.id}
              onClick={() => {
                onSelectUser(st.id);
                showToast(`Switched active profile to ${st.fullName} (${st.role})`);
              }}
              className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                st.id === currentUser.id
                  ? 'border-[#47e802] bg-[#efffe7] shadow-xs'
                  : 'border-[#eae8df] bg-white hover:bg-[#f8f6ef]'
              }`}
            >
              <div className="font-bold text-xs text-[#10120e]">{st.fullName}</div>
              <div className="text-[11px] text-[#73776e] capitalize">{st.role.replace('_', ' ')}</div>
              {st.id === currentUser.id && (
                <span className="text-[10px] font-extrabold text-[#2f9b00] mt-1 block">
                  ✓ Active Persona
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Data Management */}
      <div className="bg-[#fffefa] border border-[#eae8df] rounded-2xl p-5 shadow-xs space-y-3">
        <h2 className="font-bold text-sm text-[#10120e]">Data Management & Backup</h2>
        <p className="text-xs text-[#73776e]">
          Export CRM dataset for reporting or reset to clean seed data.
        </p>

        <div className="flex flex-wrap items-center gap-3 pt-1">
          <button
            onClick={handleExportJson}
            className="px-4 py-2 bg-white border border-[#e7e5dc] rounded-xl text-xs font-bold text-[#10120e] hover:bg-gray-50 cursor-pointer"
          >
            Export All Data (JSON)
          </button>
          <button
            onClick={() => {
              if (window.confirm('Reset local CRM database to initial seed dataset?')) {
                onResetData();
                showToast('Local CRM store reset to default seed records.');
              }
            }}
            className="px-4 py-2 bg-red-50 border border-red-200 rounded-xl text-xs font-bold text-red-700 hover:bg-red-100 cursor-pointer"
          >
            Reset Seed Data
          </button>
        </div>
      </div>
    </div>
  );
};
