import React, { useState } from 'react';
import { useCrmStore } from './services/crmStore';
import { Sidebar, NavPage } from './components/Sidebar';
import { Topbar } from './components/Topbar';
import { AddLeadModal } from './components/AddLeadModal';
import { AddTaskModal } from './components/AddTaskModal';
import { LeadDetailModal } from './components/LeadDetailModal';
import { PaymentModal } from './components/PaymentModal';
import { ScheduleModal } from './components/ScheduleModal';
import { SupportModal } from './components/SupportModal';

import { DashboardView } from './features/dashboard/DashboardView';
import { LeadsView } from './features/leads/LeadsView';
import { ContactsView } from './features/contacts/ContactsView';
import { ProgramsView } from './features/programs/ProgramsView';
import { PipelineView } from './features/pipeline/PipelineView';
import { StudentsView } from './features/students/StudentsView';
import { SessionsView } from './features/sessions/SessionsView';
import { TasksView } from './features/tasks/TasksView';
import { TeamView } from './features/team/TeamView';
import { ReportsView } from './features/reports/ReportsView';
import { AutomationsView } from './features/automations/AutomationsView';
import { SettingsView } from './features/settings/SettingsView';
import { LeadOpportunity, PipelineStage } from './types/crm';

export default function App() {
  const {
    state,
    currentUser,
    addLead,
    updateLeadStage,
    toggleTask,
    addTask,
    recordPayment,
    scheduleSession,
    toggleAutomation,
    setCurrentUser,
    resetToDefaults,
  } = useCrmStore();

  const [currentPage, setCurrentPage] = useState<NavPage>('Dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [globalSearch, setGlobalSearch] = useState('');

  // Modals state
  const [isAddLeadOpen, setIsAddLeadOpen] = useState(false);
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState<LeadOpportunity | null>(null);
  const [paymentModalLead, setPaymentModalLead] = useState<LeadOpportunity | null>(null);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);
  const [prefilledStudentName, setPrefilledStudentName] = useState('');
  const [prefilledProgramTitle, setPrefilledProgramTitle] = useState('');
  const [isSupportOpen, setIsSupportOpen] = useState(false);

  // Toast notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 2800);
  };

  const handleOpenPayment = (lead?: LeadOpportunity | null) => {
    setPaymentModalLead(lead || null);
    setIsPaymentOpen(true);
  };

  const handleOpenSchedule = (studentName?: string, programTitle?: string) => {
    setPrefilledStudentName(studentName || '');
    setPrefilledProgramTitle(programTitle || '');
    setIsScheduleOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#f5f2e8] text-[#10120e] flex">
      {/* Sidebar Navigation */}
      <Sidebar
        currentPage={currentPage}
        onSelectPage={(page) => {
          setCurrentPage(page);
          if (page !== 'Dashboard') {
            showToast(`${page} workspace selected.`);
          }
        }}
        isOpen={mobileMenuOpen}
        onCloseMobile={() => setMobileMenuOpen(false)}
        onOpenSupport={() => setIsSupportOpen(true)}
      />

      {/* Main Content Viewport */}
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar
          onToggleMobileMenu={() => setMobileMenuOpen(!mobileMenuOpen)}
          searchQuery={globalSearch}
          onSearchChange={setGlobalSearch}
          currentUser={currentUser}
          staffList={state.staff}
          onSelectUser={(staffId) => {
            setCurrentUser(staffId);
            const targetStaff = state.staff.find((s) => s.id === staffId);
            showToast(`Active staff: ${targetStaff?.fullName} (${targetStaff?.role})`);
          }}
          onOpenNotifications={() => showToast('You’re all caught up with recent updates.')}
          onOpenSettings={() => setCurrentPage('Settings')}
        />

        <main className="p-4 sm:p-[25px_28px_36px] max-w-[1700px] w-full mx-auto">
          {currentPage === 'Dashboard' && (
            <DashboardView
              state={state}
              currentUser={currentUser}
              onNavigate={(page) => {
                setCurrentPage(page);
                showToast(`${page} view opened.`);
              }}
              onOpenAddLead={() => setIsAddLeadOpen(true)}
              onOpenAddTask={() => setIsAddTaskOpen(true)}
              onSelectLead={(ld) => setSelectedLead(ld)}
              onToggleTask={toggleTask}
              searchFilter={globalSearch}
              showToast={showToast}
            />
          )}

          {currentPage === 'Leads' && (
            <LeadsView
              leads={state.leads}
              onOpenAddLead={() => setIsAddLeadOpen(true)}
              onSelectLead={(ld) => setSelectedLead(ld)}
              onUpdateStage={(id, stage) => {
                updateLeadStage(id, stage);
                showToast(`Lead moved to ${stage}`);
              }}
            />
          )}

          {currentPage === 'Contacts' && (
            <ContactsView
              contacts={state.leads.map((l) => ({
                id: l.contactId,
                fullName: l.fullName,
                email: l.email,
                phone: l.phone,
                source: l.source,
                createdAt: l.createdAt,
              }))}
              leads={state.leads}
              onOpenAddLead={() => setIsAddLeadOpen(true)}
              onSelectLead={(ld) => setSelectedLead(ld)}
            />
          )}

          {currentPage === 'Programs' && (
            <ProgramsView
              programs={state.programs}
              students={state.students}
              onOpenAddLead={() => setIsAddLeadOpen(true)}
            />
          )}

          {currentPage === 'Sales Pipeline' && (
            <PipelineView
              leads={state.leads}
              onSelectLead={(ld) => setSelectedLead(ld)}
              onUpdateStage={(id, stage) => {
                updateLeadStage(id, stage);
                showToast(`Opportunity stage updated to ${stage}`);
              }}
              onOpenAddLead={() => setIsAddLeadOpen(true)}
            />
          )}

          {currentPage === 'Students' && (
            <StudentsView
              students={state.students}
              onOpenSchedule={handleOpenSchedule}
              onOpenPaymentRecord={() => handleOpenPayment(null)}
            />
          )}

          {currentPage === 'Sessions' && (
            <SessionsView
              sessions={state.sessions}
              onOpenBookSession={() => handleOpenSchedule()}
            />
          )}

          {currentPage === 'Tasks' && (
            <TasksView
              tasks={state.tasks}
              onToggleTask={(id) => {
                toggleTask(id);
                showToast('Task updated.');
              }}
              onOpenAddTask={() => setIsAddTaskOpen(true)}
            />
          )}

          {currentPage === 'Team' && (
            <TeamView
              staffList={state.staff}
              activities={state.activities}
              currentUser={currentUser}
              onSelectUser={(staffId) => {
                setCurrentUser(staffId);
                showToast('User persona switched.');
              }}
            />
          )}

          {currentPage === 'Reports' && (
            <ReportsView
              state={state}
              onOpenPaymentRecord={() => handleOpenPayment(null)}
            />
          )}

          {currentPage === 'Automations' && (
            <AutomationsView
              automations={state.automations}
              onToggleAutomation={(id) => {
                toggleAutomation(id);
                showToast('Automation rule status updated.');
              }}
            />
          )}

          {currentPage === 'Settings' && (
            <SettingsView
              state={state}
              currentUser={currentUser}
              staffList={state.staff}
              onSelectUser={setCurrentUser}
              onResetData={resetToDefaults}
              showToast={showToast}
            />
          )}
        </main>
      </div>

      {/* Add Lead Modal */}
      <AddLeadModal
        isOpen={isAddLeadOpen}
        onClose={() => setIsAddLeadOpen(false)}
        staffList={state.staff}
        onSaveLead={(newLead) => {
          addLead(newLead);
          showToast('Lead added. Remember to set a follow-up task.');
        }}
      />

      {/* Add Task Modal */}
      <AddTaskModal
        isOpen={isAddTaskOpen}
        onClose={() => setIsAddTaskOpen(false)}
        staffList={state.staff}
        onSaveTask={(newTask) => {
          addTask(newTask);
          showToast('Task added to your list.');
        }}
      />

      {/* Lead Details Modal */}
      <LeadDetailModal
        lead={selectedLead}
        isOpen={Boolean(selectedLead)}
        onClose={() => setSelectedLead(null)}
        onUpdateStage={(leadId, stage, reason) => {
          updateLeadStage(leadId, stage, reason);
          setSelectedLead((prev) => (prev ? { ...prev, stage } : null));
          showToast(`Lead updated to ${stage}`);
        }}
        onOpenPayment={(lead) => handleOpenPayment(lead)}
        onAddTask={(title, contactName) => {
          addTask({ title, relatedContact: contactName });
          showToast(`Task created for ${contactName}`);
        }}
        onScheduleSession={(lead) => {
          handleOpenSchedule(lead.fullName, lead.programTitle);
        }}
      />

      {/* Payment Verification Modal */}
      <PaymentModal
        isOpen={isPaymentOpen}
        onClose={() => setIsPaymentOpen(false)}
        lead={paymentModalLead}
        programs={state.programs}
        onConfirmPayment={(payment) => {
          recordPayment(payment);
          showToast(`Verified payment of ₦${payment.amountNGN.toLocaleString()}! Student enrolled.`);
        }}
      />

      {/* Coaching Session Modal */}
      <ScheduleModal
        isOpen={isScheduleOpen}
        onClose={() => setIsScheduleOpen(false)}
        staffList={state.staff}
        programs={state.programs}
        prefilledStudent={prefilledStudentName}
        prefilledProgram={prefilledProgramTitle}
        onConfirmSchedule={(sess) => {
          scheduleSession(sess);
          showToast(`Booked ${sess.sessionType} for ${sess.studentName}`);
        }}
      />

      {/* Support Modal */}
      <SupportModal
        isOpen={isSupportOpen}
        onClose={() => setIsSupportOpen(false)}
      />

      {/* Toast Notification element exactly matching prototype styling */}
      {toastMessage && (
        <div className="fixed right-[22px] bottom-[22px] bg-[#111] text-white p-[12px_16px] rounded-[10px] shadow-[0_6px_24px_rgba(20,24,14,0.15)] z-50 text-[13px] font-semibold animate-in fade-in slide-in-from-bottom-2">
          {toastMessage}
        </div>
      )}
    </div>
  );
}
